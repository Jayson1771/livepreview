import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080a0f",
        color: "#e5e7eb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 48px",
          borderBottom: "1px solid #1e2130",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>
            LivePreview
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            to="/auth"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              padding: "8px 16px",
              fontSize: 14,
            }}
          >
            Sign in
          </Link>
          <Link
            to="/auth?mode=signup"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              textDecoration: "none",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px" }}>
        <div
          style={{
            display: "inline-block",
            background: "#1e1b4b",
            border: "1px solid #4c1d95",
            borderRadius: 20,
            padding: "4px 14px",
            color: "#a78bfa",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          ✨ Share your localhost in one command
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            margin: "0 0 20px",
            lineHeight: 1.15,
            color: "#fff",
          }}
        >
          Localhost to
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Live Preview
          </span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#9ca3af",
            maxWidth: 520,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Instantly expose your local server with a public URL. Share
          work-in-progress with clients and teammates — no deployment needed.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/auth"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Start for free →
          </Link>
          <a
            href="#how-it-works"
            style={{
              background: "#1e2130",
              color: "#e5e7eb",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: 10,
              fontSize: 16,
            }}
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Terminal demo */}
      <div style={{ maxWidth: 680, margin: "0 auto 80px", padding: "0 24px" }}>
        <div
          style={{
            background: "#0a0c12",
            border: "1px solid #1e2130",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #1e2130",
              display: "flex",
              gap: 6,
            }}
          >
            {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
              <div
                key={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
            <span style={{ color: "#4b5563", fontSize: 12, marginLeft: 8 }}>
              Terminal
            </span>
          </div>
          <div style={{ padding: 24, fontFamily: "monospace", fontSize: 14 }}>
            <div style={{ color: "#4b5563" }}>
              ${" "}
              <span style={{ color: "#e5e7eb" }}>
                npm install -g livepreview-cli
              </span>
            </div>
            <div style={{ color: "#4b5563", marginTop: 8 }}>
              ${" "}
              <span style={{ color: "#e5e7eb" }}>
                livepreview start -p 3000
              </span>
            </div>
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid #1e2130",
              }}
            >
              <div style={{ color: "#22c55e" }}>✓ Tunnel established!</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ color: "#6b7280" }}> 🌐 Public URL </span>
                <span style={{ color: "#a5b4fc", fontWeight: 700 }}>
                  https://myapp.preview.yourdomain.com
                </span>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}> 🏠 Local </span>
                <span style={{ color: "#e5e7eb" }}>http://localhost:3000</span>
              </div>
              <div style={{ marginTop: 12, color: "#6b7280" }}>
                Waiting for connections...
              </div>
              <div style={{ marginTop: 8, color: "#9ca3af" }}>
                <span style={{ color: "#374151" }}>[10:24:01]</span> 🇺🇸 GET
                /dashboard <span style={{ color: "#22c55e" }}>200</span>
              </div>
              <div style={{ color: "#9ca3af" }}>
                <span style={{ color: "#374151" }}>[10:24:03]</span> 🇸🇬 POST
                /api/login <span style={{ color: "#22c55e" }}>200</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div
        id="how-it-works"
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 100px" }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 12,
          }}
        >
          Simple Pricing
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 48 }}>
          No credit card required to start.
        </p>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {[
            {
              name: "Free",
              price: "$0",
              sub: "forever",
              color: "#6b7280",
              border: "#1e2130",
              cta: "Get started",
              href: "/auth",
              features: [
                "1 active tunnel",
                "1-hour sessions",
                "Auto-generated subdomain",
                "1-day request log",
                "Community support",
              ],
            },
            {
              name: "Pro",
              price: "$8.99",
              sub: "/ month",
              color: "#6366f1",
              border: "#4c1d95",
              cta: "Start Pro",
              href: "/auth?upgrade=true",
              features: [
                "Unlimited tunnels",
                "No session limits",
                "Custom subdomains",
                "30-day request history",
                "Priority support",
                "Team sharing (soon)",
              ],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              style={{
                background: "#0f1117",
                border: `1px solid ${plan.border}`,
                borderRadius: 16,
                padding: 32,
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    color: plan.color,
                    fontWeight: 700,
                    marginBottom: 8,
                    fontSize: 16,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                >
                  <span
                    style={{ color: "#fff", fontSize: 40, fontWeight: 800 }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: "#6b7280" }}>{plan.sub}</span>
                </div>
              </div>
              <ul style={{ padding: 0, margin: "0 0 28px", listStyle: "none" }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      color: "#9ca3af",
                      fontSize: 14,
                      padding: "6px 0",
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: "#22c55e" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.href}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  background:
                    plan.name === "Pro"
                      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                      : "#1e2130",
                  color: plan.name === "Pro" ? "#fff" : "#9ca3af",
                  borderRadius: 10,
                  padding: "12px 0",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
