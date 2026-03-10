const rateLimit = require("express-rate-limit");

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." },
});

// Stricter limit for tunnel creation
const tunnelCreateLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: { error: "Too many tunnel creation attempts." },
});

// Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 20,
  message: { error: "Too many auth attempts, try again later." },
});

module.exports = { apiLimiter, tunnelCreateLimiter, authLimiter };
