import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080a0f",
        color: "#e5e7eb",
        fontFamily: "system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glow-card:hover {
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
        }
        .nav-link:hover { color: #fff !important; }
        .cta-btn:hover { transform: scale(1.02); }
        .cta-btn:active { transform: scale(0.98); }
        .terminal-window:hover { transform: scale(1.01); }
      `}</style>

      {/* Background gradient orbs */}
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "40%",
          right: "-15%",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 48px",
          borderBottom: "1px solid rgba(30, 33, 48, 0.8)",
          position: "relative",
          zIndex: 10,
          backdropFilter: "blur(10px)",
          background: "rgba(8, 10, 15, 0.8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: "-0.5px" }}>
            LivePreview
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a
            href="#features"
            className="nav-link"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="nav-link"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            How it works
          </a>
          <Link
            to="/auth"
            className="nav-link"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
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
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
            }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(30, 27, 75, 0.6)",
            border: "1px solid rgba(76, 29, 149, 0.5)",
            borderRadius: 24,
            padding: "8px 20px",
            color: "#a78bfa",
            fontSize: 14,
            marginBottom: 32,
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ fontSize: 16 }}>⚡</span>
          Share your localhost in one command
        </div>
        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 800,
            margin: "0 0 24px",
            lineHeight: 1.1,
            color: "#fff",
            letterSpacing: "-2px",
          }}
        >
          Localhost to
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-shift 4s ease infinite",
            }}
          >
            Live Preview
          </span>
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "#9ca3af",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Instantly expose your local server with a public URL. Share
          work-in-progress with clients and teammates — no deployment needed.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/auth"
            className="cta-btn"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              textDecoration: "none",
              padding: "16px 32px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              transition: "all 0.2s",
              boxShadow: "0 8px 30px rgba(99, 102, 241, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 12px 40px rgba(99, 102, 241, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 8px 30px rgba(99, 102, 241, 0.4)";
            }}
          >
            Start for free →
          </Link>
          <a
            href="#how-it-works"
            style={{
              background: "rgba(30, 33, 48, 0.8)",
              color: "#e5e7eb",
              textDecoration: "none",
              padding: "16px 32px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              border: "1px solid #2d3142",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#4b5563";
              e.target.style.background = "rgba(45, 49, 66, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#2d3142";
              e.target.style.background = "rgba(30, 33, 48, 0.8)";
            }}
          >
            See how it works →
          </a>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {["No credit card required", "Free forever plan", "Setup in 30 seconds"].map((badge) => (
            <div key={badge} style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280", fontSize: 14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div
        id="features"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 100px", position: "relative", zIndex: 1 }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 36,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 16,
            letterSpacing: "-1px",
          }}
        >
          Everything you need
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 56, fontSize: 18 }}>
          Powerful features that make sharing your work effortless
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {[
            {
              icon: "🔗",
              title: "Instant Tunnels",
              desc: "Get a public HTTPS URL for your local server in seconds. No configuration needed.",
            },
            {
              icon: "📊",
              title: "Request Logging",
              desc: "Track all incoming requests with detailed logs. See headers, bodies, and response times.",
            },
            {
              icon: "🔒",
              title: "Secure by Default",
              desc: "All tunnels are served over HTTPS with automatic SSL certificates.",
            },
            {
              icon: "🌍",
              title: "Global Edge Network",
              desc: "Your previews load fast from servers close to your audience worldwide.",
            },
            {
              icon: "⚡",
              title: "Zero Config",
              desc: "Just run one command. We handle the networking complexity for you.",
            },
            {
              icon: "👥",
              title: "Easy Sharing",
              desc: "Share your preview link instantly. Perfect for client reviews and team demos.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glow-card"
              style={{
                background: "linear-gradient(135deg, rgba(15, 17, 23, 0.9), rgba(15, 17, 23, 0.6))",
                border: "1px solid rgba(30, 33, 48, 0.8)",
                borderRadius: 16,
                padding: 28,
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{feature.icon}</div>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{feature.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal demo */}
      <div style={{ maxWidth: 720, margin: "0 auto 100px", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div
          className="terminal-window"
          style={{
            background: "#0a0c12",
            border: "1px solid rgba(30, 33, 48, 0.8)",
            borderRadius: 16,
            overflow: "hidden",
            transition: "all 0.3s ease",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(30, 33, 48, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(30, 33, 48, 0.3)",
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
            <span style={{ color: "#6b7280", fontSize: 13, marginLeft: 8, fontWeight: 500 }}>
              Terminal
            </span>
          </div>
          <div style={{ padding: 28, fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 14 }}>
            <div style={{ color: "#6b7280", marginBottom: 8 }}>
              <span style={{ color: "#22c55e" }}>$</span>{" "}
              <span style={{ color: "#e5e7eb" }}>npm install -g livepreview-cli</span>
            </div>
            <div style={{ color: "#6b7280", marginBottom: 24 }}>
              <span style={{ color: "#22c55e" }}>$</span>{" "}
              <span style={{ color: "#e5e7eb" }}>livepreview start -p 3000</span>
            </div>
            <div
              style={{
                paddingTop: 20,
                borderTop: "1px solid rgba(30, 33, 48, 0.8)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#22c55e", marginBottom: 16 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontWeight: 600 }}>Tunnel established!</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: "#6b7280" }}>🌐 Public URL </span>
                <span style={{ color: "#a5b4fc", fontWeight: 700, background: "rgba(99, 102, 241, 0.1)", padding: "4px 12px", borderRadius: 6, marginLeft: 8 }}>
                  https://myapp.preview.live
                </span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: "#6b7280" }}>🏠 Local </span>
                <span style={{ color: "#e5e7eb", marginLeft: 8 }}>http://localhost:3000</span>
              </div>
              <div style={{ color: "#4b5563", fontSize: 13, marginTop: 20, padding: 16, background: "rgba(30, 33, 48, 0.3)", borderRadius: 10 }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "#374151" }}>[10:24:01]</span> 🇺🇸 GET /dashboard{" "}
                  <span style={{ color: "#22c55e" }}>200</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>[10:24:03]</span> 🇸🇬 POST /api/login{" "}
                  <span style={{ color: "#22c55e" }}>200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div
        id="how-it-works"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 100px", position: "relative", zIndex: 1 }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 36,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 16,
            letterSpacing: "-1px",
          }}
        >
          How it works
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 56, fontSize: 18 }}>
          Get started in three simple steps
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          {[
            { step: "01", title: "Install the CLI", desc: "Run one command to install our global CLI tool." },
            { step: "02", title: "Start your tunnel", desc: "Point to your local server and get an instant public URL." },
            { step: "03", title: "Share & collaborate", desc: "Send the link to anyone. They'll see your local app in real-time." },
          ].map((item, idx) => (
            <div key={item.step} style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 16,
                }}
              >
                {item.step}
              </div>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              {idx < 2 && (
                <div
                  style={{
                    position: "absolute",
                    right: -16,
                    top: 30,
                    display: "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 120px", position: "relative", zIndex: 1 }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 36,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 16,
            letterSpacing: "-1px",
          }}
        >
          Simple, transparent pricing
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 48, fontSize: 18 }}>
          Start free, upgrade when you need more power.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {[
            {
              name: "Free",
              price: "$0",
              sub: "forever",
              color: "#9ca3af",
              border: "rgba(30, 33, 48, 0.8)",
              cta: "Get started",
              href: "/auth",
              popular: false,
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
              border: "rgba(99, 102, 241, 0.5)",
              cta: "Start Pro",
              href: "/auth?upgrade=true",
              popular: true,
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
              className="glow-card"
              style={{
                background: plan.popular
                  ? "linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 17, 23, 0.9))"
                  : "linear-gradient(135deg, rgba(15, 17, 23, 0.9), rgba(15, 17, 23, 0.6))",
                border: `1px solid ${plan.border}`,
                borderRadius: 20,
                padding: 36,
                position: "relative",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    color: plan.color,
                    fontWeight: 700,
                    marginBottom: 12,
                    fontSize: 18,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ color: "#fff", fontSize: 48, fontWeight: 800, letterSpacing: "-2px" }}>
                    {plan.price}
                  </span>
                  <span style={{ color: "#6b7280", fontSize: 16 }}>{plan.sub}</span>
                </div>
              </div>
              <ul style={{ padding: 0, margin: "0 0 32px", listStyle: "none" }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      color: "#d1d5db",
                      fontSize: 14,
                      padding: "10px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderBottom: "1px solid rgba(30, 33, 48, 0.5)",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.href}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  background: plan.name === "Pro"
                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                    : "rgba(30, 33, 48, 0.8)",
                  color: plan.name === "Pro" ? "#fff" : "#e5e7eb",
                  borderRadius: 12,
                  padding: "14px 0",
                  fontWeight: 700,
                  fontSize: 15,
                  transition: "all 0.2s",
                  border: plan.name === "Pro" ? "none" : "1px solid #2d3142",
                  boxShadow: plan.name === "Pro" ? "0 8px 30px rgba(99, 102, 241, 0.4)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (plan.name === "Pro") {
                    e.target.style.boxShadow = "0 12px 40px rgba(99, 102, 241, 0.6)";
                    e.target.style.transform = "scale(1.02)";
                  } else {
                    e.target.style.borderColor = "#4b5563";
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.name === "Pro") {
                    e.target.style.boxShadow = "0 8px 30px rgba(99, 102, 241, 0.4)";
                    e.target.style.transform = "scale(1)";
                  } else {
                    e.target.style.borderColor = "#2d3142";
                  }
                }}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(30, 33, 48, 0.8)",
          padding: "48px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ⚡
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>LivePreview</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            © 2026 LivePreview. Built for developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
