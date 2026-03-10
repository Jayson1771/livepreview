require("dotenv").config();
const express   = require("express");
const http      = require("http");
const WebSocket = require("ws");
const helmet    = require("helmet");
const cors      = require("cors");
const { nanoid } = require("nanoid");

const supabase = require("./config/supabase");
const { apiLimiter } = require("./middleware/rateLimiter");

const tunnelRoutes  = require("./routes/tunnels");
const billingRoutes = require("./routes/billing");
const userRoutes    = require("./routes/users");

const app    = express();
const server = http.createServer(app);

// ─── ACTIVE STATE MAPS ────────────────────────────────────────────
// tunnelId → WebSocket (CLI connection)
const activeTunnels  = new Map();
// requestId → { res, timer }
const pendingRequests = new Map();

app.locals.activeTunnels = activeTunnels;

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.DASHBOARD_ORIGIN || "*" }));
app.use(apiLimiter);

// Raw body for Stripe webhook BEFORE json parser
app.use("/api/billing/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// ─── API ROUTES ───────────────────────────────────────────────────
app.use("/api/tunnels",  tunnelRoutes);
app.use("/api/billing",  billingRoutes);
app.use("/api/users",    userRoutes);

app.get("/api/health", (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ─── WEBSOCKET TUNNEL SERVER ──────────────────────────────────────
const wss = new WebSocket.Server({ server, path: "/ws/tunnel" });

wss.on("connection", async (ws, req) => {
  // URL format: /ws/tunnel/<tunnelId>?token=<api_token>
  const parts    = req.url.split("?");
  const tunnelId = parts[0].split("/ws/tunnel/")[1];
  const params   = new URLSearchParams(parts[1] || "");
  const token    = params.get("token");

  if (!tunnelId) return ws.close(4000, "Missing tunnelId");

  // Auth check
  let userId = null;
  if (token && token !== "guest") {
    const { data } = await supabase
      .from("users")
      .select("id, plan")
      .eq("api_token", token)
      .single();
    if (!data) return ws.close(4001, "Invalid token");
    userId = data.id;
  }

  // Validate tunnel exists
  const { data: tunnel } = await supabase
    .from("tunnels")
    .select("id, user_id, status, expires_at")
    .eq("id", tunnelId)
    .single();

  if (!tunnel || tunnel.status === "closed" || tunnel.status === "expired") {
    return ws.close(4004, "Tunnel not found");
  }

  // Mark active
  activeTunnels.set(tunnelId, ws);
  await supabase.from("tunnels").update({
    status: "active",
    connected_at: new Date().toISOString(),
  }).eq("id", tunnelId);

  console.log(`[WS] Tunnel connected: ${tunnelId}`);

  // Auto-expire free plan tunnels
  let expiryTimer = null;
  if (tunnel.expires_at) {
    const msLeft = new Date(tunnel.expires_at) - Date.now();
    if (msLeft <= 0) {
      ws.close(4010, "Tunnel expired");
      return;
    }

    // Warn at 10 min remaining
    if (msLeft > 10 * 60 * 1000) {
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "warning", message: "Tunnel expires in 10 minutes. Upgrade to Pro for unlimited time." }));
        }
      }, msLeft - 10 * 60 * 1000);
    }

    expiryTimer = setTimeout(async () => {
      ws.send(JSON.stringify({ type: "expired", message: "Your 1-hour free session has ended." }));
      ws.close(4010, "Tunnel expired");
      await supabase.from("tunnels").update({ status: "expired" }).eq("id", tunnelId);
    }, msLeft);
  }

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      // CLI → Server: response to a proxied request
      if (msg.type === "response" || msg.type === "error") {
        const pending = pendingRequests.get(msg.requestId);
        if (!pending) return;

        clearTimeout(pending.timer);
        pendingRequests.delete(msg.requestId);

        if (msg.type === "error") {
          pending.res.status(502).send("Local server returned an error.");
        } else {
          const buffer = Buffer.from(msg.data, "base64");
          pending.res.end(buffer);
        }

        // Update request log with status code
        if (msg.requestId && msg.statusCode) {
          supabase.from("tunnel_requests")
            .update({ status_code: msg.statusCode, duration_ms: msg.durationMs })
            .eq("id", msg.requestId)
            .then(() => {});
        }
      }
    } catch (e) {
      console.error("[WS] Message parse error:", e.message);
    }
  });

  ws.on("close", async () => {
    activeTunnels.delete(tunnelId);
    if (expiryTimer) clearTimeout(expiryTimer);
    await supabase.from("tunnels").update({
      status: "closed",
      closed_at: new Date().toISOString(),
    }).eq("id", tunnelId).eq("status", "active");
    console.log(`[WS] Tunnel disconnected: ${tunnelId}`);
  });

  ws.on("error", (err) => console.error(`[WS] Error on ${tunnelId}:`, err.message));
});

// ─── PROXY HANDLER ────────────────────────────────────────────────
// Catches all *.preview.yourdomain.com requests and forwards through tunnel
app.use(async (req, res) => {
  const host      = req.headers.host || "";
  const subdomain = host.split(".")[0];
  const baseDomain = process.env.TUNNEL_DOMAIN || "";

  // Skip if not a subdomain request
  if (!host.endsWith(baseDomain) || host === baseDomain) {
    return res.status(404).send("Not found");
  }

  const { data: tunnel } = await supabase
    .from("tunnels")
    .select("id, expires_at, user_id")
    .eq("subdomain", subdomain)
    .eq("status", "active")
    .single();

  if (!tunnel) {
    return res.status(404).send(notFoundPage(subdomain));
  }

  // Check expiry
  if (tunnel.expires_at && new Date(tunnel.expires_at) < new Date()) {
    await supabase.from("tunnels").update({ status: "expired" }).eq("id", tunnel.id);
    return res.status(410).send(expiredPage());
  }

  const ws = activeTunnels.get(tunnel.id);
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return res.status(503).send(offlinePage(subdomain));
  }

  // Build raw HTTP request
  const requestId  = nanoid();
  const headerStr  = Object.entries(req.headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\r\n");
  const rawRequest = `${req.method} ${req.url} HTTP/1.1\r\nHost: localhost\r\n${headerStr}\r\n\r\n`;

  // Forward to CLI via WebSocket
  ws.send(JSON.stringify({
    type:      "request",
    requestId,
    data:      Buffer.from(rawRequest).toString("base64"),
    path:      req.url,
    method:    req.method,
  }));

  // Log request
  const logId = nanoid();
  supabase.from("tunnel_requests").insert({
    id:         logId,
    tunnel_id:  tunnel.id,
    method:     req.method,
    path:       req.url,
    country:    req.headers["cf-ipcountry"] || null,
    user_agent: req.headers["user-agent"] || null,
    ip_address: req.headers["cf-connecting-ip"] || req.ip,
    bytes_in:   req.headers["content-length"] ? parseInt(req.headers["content-length"]) : 0,
  }).then(() => {});

  // Notify CLI of visitor
  ws.send(JSON.stringify({
    type:    "visitor",
    path:    req.url,
    country: req.headers["cf-ipcountry"] || null,
    method:  req.method,
  }));

  // Register pending request with 30s timeout
  const timer = setTimeout(() => {
    if (pendingRequests.has(requestId)) {
      pendingRequests.delete(requestId);
      res.status(504).send("<h2>Gateway Timeout</h2><p>Your local server did not respond in time.</p>");
    }
  }, 30_000);

  pendingRequests.set(requestId, { res, timer });
});

// ─── ERROR PAGES ──────────────────────────────────────────────────
const page = (title, body) => `<!DOCTYPE html>
<html><head><title>${title} — LivePreview</title>
<style>body{font-family:monospace;background:#080a0f;color:#e5e7eb;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{text-align:center;padding:40px}h1{color:#6366f1}a{color:#a5b4fc}</style></head>
<body><div class="box">${body}</div></body></html>`;

const notFoundPage = (sub) => page("Tunnel Not Found",
  `<h1>🔌 No active tunnel</h1><p>No tunnel found for <strong>${sub}</strong></p><p><a href="https://${process.env.TUNNEL_DOMAIN}">Create a tunnel →</a></p>`);

const expiredPage = () => page("Session Expired",
  `<h1>⏱ Session Expired</h1><p>This free 1-hour session has ended.</p><p><a href="https://${process.env.TUNNEL_DOMAIN}/pricing">Upgrade to Pro for unlimited time →</a></p>`);

const offlinePage = (sub) => page("Tunnel Offline",
  `<h1>📡 Tunnel Offline</h1><p>The tunnel for <strong>${sub}</strong> is not connected.</p><p>Run <code>livepreview start -p YOUR_PORT</code> to reconnect.</p>`);

// ─── START ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 LivePreview server running on port ${PORT}`);
  console.log(`   Tunnel domain: *.${process.env.TUNNEL_DOMAIN}`);
});