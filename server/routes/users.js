const express = require("express");
const crypto = require("crypto");
const supabase = require("../config/supabase");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// GET /api/users/me — get current user profile
router.get("/me", authenticate, async (req, res) => {
  if (req.user.isGuest) return res.json({ user: null });

  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, full_name, avatar_url, plan, plan_ends_at, api_token, created_at"
    )
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ user: data });
});

// PATCH /api/users/me — update profile
router.patch("/me", authenticate, async (req, res) => {
  const { full_name, avatar_url } = req.body;

  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ user: data });
});

// POST /api/users/rotate-token — regenerate API token
router.post("/rotate-token", authenticate, async (req, res) => {
  const newToken = crypto.randomBytes(32).toString("hex");

  const { error } = await supabase
    .from("users")
    .update({ api_token: newToken })
    .eq("id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ api_token: newToken });
});

// DELETE /api/users/me — delete account
router.delete("/me", authenticate, async (req, res) => {
  // Close all active tunnels
  await supabase
    .from("tunnels")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("user_id", req.user.id)
    .eq("status", "active");

  // Delete from auth.users (cascades to public.users via FK)
  const { error } = await supabase.auth.admin.deleteUser(req.user.id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

// GET /api/users/stats — dashboard overview stats
router.get("/stats", authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ stats: data });
});

// POST /api/cli-auth — initiate CLI login (returns one-time code)
router.post("/cli-auth/init", async (req, res) => {
  const code = crypto.randomBytes(16).toString("hex");

  // Store code temporarily (expires in 5 min)
  await supabase.from("cli_sessions").insert({
    token: code,
    device_name: req.body.device || "CLI",
    created_at: new Date().toISOString(),
  });

  res.json({
    code,
    auth_url: `https://${process.env.TUNNEL_DOMAIN}/cli-auth?code=${code}`,
  });
});

// GET /api/cli-auth/poll/:code — CLI polls this until authenticated
router.get("/cli-auth/poll/:code", async (req, res) => {
  const { data } = await supabase
    .from("cli_sessions")
    .select("user_id, token")
    .eq("token", req.params.code)
    .single();

  if (!data)
    return res.status(404).json({ error: "Code not found or expired" });
  if (!data.user_id) return res.json({ status: "pending" });

  // Get user's API token
  const { data: user } = await supabase
    .from("users")
    .select("api_token")
    .eq("id", data.user_id)
    .single();

  if (!user) return res.status(404).json({ error: "User not found" });

  // Clean up the CLI session code
  await supabase.from("cli_sessions").delete().eq("token", req.params.code);

  res.json({ status: "authenticated", api_token: user.api_token });
});

module.exports = router;
server / index.js;
JS;
Copy;
require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const helmet = require("helmet");
const cors = require("cors");
const { nanoid } = require("nanoid");

const supabase = require("./config/supabase");
const { apiLimiter } = require("./middleware/rateLimiter");

const tunnelRoutes = require("./routes/tunnels");
const billingRoutes = require("./routes/billing");
const userRoutes = require("./routes/users");

const app = express();
const server = http.createServer(app);

// ─── ACTIVE STATE MAPS ────────────────────────────────────────────
// tunnelId → WebSocket (CLI connection)
const activeTunnels = new Map();
// requestId → { res, timer }
const pendingRequests = new Map();

app.locals.activeTunnels = activeTunnels;
