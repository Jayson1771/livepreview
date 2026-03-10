const supabase = require("../config/supabase");

// Verify Bearer token from Authorization header
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  // Guest token (unauthenticated free usage)
  if (token === "guest") {
    req.user = { id: "guest", plan: "free", isGuest: true };
    return next();
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, plan, api_token")
    .eq("api_token", token)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data;
  next();
}

// Optional auth — attaches user if token present, continues either way
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token && token !== "guest") {
    const { data } = await supabase
      .from("users")
      .select("id, email, plan, api_token")
      .eq("api_token", token)
      .single();
    req.user = data || null;
  } else {
    req.user = null;
  }
  next();
}

// Require Pro plan
function requirePro(req, res, next) {
  if (req.user?.plan !== "pro") {
    return res.status(403).json({
      error: "This feature requires a Pro plan.",
      upgrade_url: `https://${process.env.TUNNEL_DOMAIN}/pricing`,
    });
  }
  next();
}

module.exports = { authenticate, optionalAuth, requirePro };
