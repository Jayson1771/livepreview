const express = require("express");
const { nanoid } = require("nanoid");
const supabase = require("../config/supabase");
const { authenticate, requirePro } = require("../middleware/auth");
const { tunnelCreateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// POST /api/tunnels — create a new tunnel
router.post("/", authenticate, tunnelCreateLimiter, async (req, res) => {
  const { subdomain, localPort } = req.body;
  const user = req.user;

  if (!localPort || isNaN(parseInt(localPort))) {
    return res.status(400).json({ error: "localPort is required and must be a number" });
  }

  // Free plan: max 1 active tunnel
  if (user.plan === "free" && !user.isGuest) {
    const { count } = await supabase
      .from("tunnels")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");

    if (count >= 1) {
      return res.status(403).json({
        error: "Free plan allows only 1 active tunnel. Upgrade to Pro for unlimited tunnels.",
        upgrade_url: `https://${process.env.TUNNEL_DOMAIN}/pricing`,
      });
    }
  }

  // Custom subdomain requires Pro
  if (subdomain && user.plan !== "pro") {
    return res.status(403).json({
      error: "Custom subdomains require a Pro plan.",
      upgrade_url: `https://${process.env.TUNNEL_DOMAIN}/pricing`,
    });
  }

  // Validate subdomain format
  if (subdomain && !/^[a-z0-9-]{3,30}$/.test(subdomain)) {
    return res.status(400).json({
      error: "Subdomain must be 3-30 characters, lowercase letters, numbers, and hyphens only.",
    });
  }

  // Check subdomain availability
  if (subdomain) {
    const { data: existing } = await supabase
      .from("tunnels")
      .select("id")
      .eq("subdomain", subdomain)
      .eq("status", "active")
      .single();

    if (existing) {
      return res.status(409).json({ error: "Subdomain is already in use." });
    }
  }

  const tunnelId  = nanoid(12);
  const finalSub  = subdomain || tunnelId;
  const publicUrl = `https://${finalSub}.${process.env.TUNNEL_DOMAIN}`;

  // Free plan tunnels expire after 1 hour
  const expiresAt = user.plan === "free"
    ? new Date(Date.now() + 60 * 60 * 1000).toISOString()
    : null;

  const { error } = await supabase.from("tunnels").insert({
    id:         tunnelId,
    user_id:    user.isGuest ? null : user.id,
    subdomain:  finalSub,
    public_url: publicUrl,
    local_port: parseInt(localPort),
    status:     "pending",
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Tunnel insert error:", error);
    return res.status(500).json({ error: "Failed to create tunnel" });
  }

  res.status(201).json({ tunnelId, publicUrl, expiresAt });
});

// GET /api/tunnels — list user's tunnels
router.get("/", authenticate, async (req, res) => {
  if (req.user.isGuest) return res.json({ tunnels: [] });

  const { data, error } = await supabase
    .from("tunnels")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ tunnels: data });
});

// GET /api/tunnels/:id — get single tunnel
router.get("/:id", authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from("tunnels")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: "Tunnel not found" });
  res.json({ tunnel: data });
});

// GET /api/tunnels/:id/requests — get request log
router.get("/:id/requests", authenticate, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);

  const { data, error } = await supabase
    .from("tunnel_requests")
    .select("*")
    .eq("tunnel_id", req.params.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ requests: data });
});

// GET /api/tunnels/:id/stats — get analytics summary
router.get("/:id/stats", authenticate, async (req, res) => {
  const { data: tunnel } = await supabase
    .from("tunnels")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user.id)
    .single();

  if (!tunnel) return res.status(404).json({ error: "Tunnel not found" });

  // Requests per hour (last 24h)
  const { data: hourly } = await supabase.rpc("requests_by_hour", {
    p_tunnel_id: req.params.id,
  });

  // Top paths
  const { data: topPaths } = await supabase
    .from("tunnel_requests")
    .select("path, method")
    .eq("tunnel_id", req.params.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const pathCounts = {};
  (topPaths || []).forEach(({ path, method }) => {
    const key = `${method} ${path}`;
    pathCounts[key] = (pathCounts[key] || 0) + 1;
  });

  const topRoutes = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([route, count]) => ({ route, count }));

  res.json({ tunnel, hourly: hourly || [], topRoutes });
});

// DELETE /api/tunnels/:id — close tunnel
router.delete("/:id", authenticate, async (req, res) => {
  const { error } = await supabase
    .from("tunnels")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  // Signal active WS to close (tunnel map lives in main index.js)
  if (req.app.locals.activeTunnels) {
    const ws = req.app.locals.activeTunnels.get(req.params.id);
    if (ws) ws.close();
  }

  res.json({ success: true });
});

module.exports = router;