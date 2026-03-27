import { Link } from "react-router-dom";
import { C } from "../lib/theme";

export default function Landing() {
  const features = [
    { icon: "⚡", title: "Instant Tunnels",     desc: "One command to expose localhost. Public URL in under 3 seconds." },
    { icon: "📊", title: "Live Request Logs",   desc: "See every HTTP request in real time with method, status, and country." },
    { icon: "🔒", title: "Secure by Default",   desc: "All tunnels run over HTTPS with no config needed." },
    { icon: "🌏", title: "Global Edge Network", desc: "Route traffic through servers near your visitors for low latency." },
  ];

  const steps = [
    { n: "01", cmd: "npm install -g livepreview-cli",         label: "Install the CLI",  green: false },
    { n: "02", cmd: "livepreview start -p 3000",              label: "Start a tunnel",   green: false },
    { n: "03", cmd: "https://abc123.livepreview.onrender.com", label: "Share the URL",   green: true  },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "#05070dee", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${C.accent},${C.purple})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 0 20px #3b82f640` }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#e8f0ff", letterSpacing: -0.5 }}>LivePreview</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/auth" style={{ background: "transparent", color: C.text2, padding: "8px 16px", fontSize: 14, fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>Sign in</Link>
          <Link to="/auth?mode=signup" style={{ background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Syne',sans-serif", boxShadow: `0 4px 16px #3b82f640` }}>Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse,#3b82f60a 0%,transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1e1b4b", border: "1px solid #4c1d95", borderRadius: 20, padding: "5px 16px", color: "#a78bfa", fontSize: 12, fontWeight: 700, marginBottom: 28, animation: "float 3s ease-in-out infinite" }}>
          ✨ Share your localhost in one command
        </div>
        <h1 style={{ fontSize: "clamp(40px,7vw,72px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: -2 }}>
          Localhost to<br/>
          <span style={{ background: `linear-gradient(135deg,${C.accent},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Live Preview</span>
        </h1>
        <p style={{ fontSize: 18, color: C.text2, maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.7 }}>
          Instantly expose your local server with a public HTTPS URL.<br/>Share work-in-progress with clients — no deployment needed.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/auth?mode=signup" style={{ background: `linear-gradient(135deg,${C.accent},${C.accent2})`, borderRadius: 10, padding: "14px 32px", color: "#fff", fontSize: 16, fontWeight: 800, boxShadow: `0 8px 32px #3b82f650`, fontFamily: "'Syne',sans-serif" }}>Start for free →</Link>
          <a href="#how-it-works" style={{ background: "transparent", border: `1px solid ${C.border2}`, borderRadius: 10, padding: "14px 28px", color: C.text2, fontSize: 15, fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>See how it works</a>
        </div>

        {/* Terminal */}
        <div style={{ maxWidth: 620, margin: "60px auto 0", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", textAlign: "left", boxShadow: `0 32px 80px #00000080` }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6, alignItems: "center" }}>
            {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }}/>)}
            <span style={{ marginLeft: 8, color: C.text3, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>terminal</span>
          </div>
          <div style={{ padding: 24, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 2 }}>
            <div><span style={{ color: C.text3 }}>$ </span><span style={{ color: C.text }}>livepreview start -p 3000</span></div>
            <div style={{ marginTop: 8 }}>
              <div style={{ color: C.green }}>✓ Tunnel established!</div>
              <div style={{ marginTop: 8 }}><span style={{ color: C.text3 }}>🌐 Public URL  </span><span style={{ color: "#93c5fd", fontWeight: 700 }}>https://abc123.livepreview.onrender.com</span></div>
              <div><span style={{ color: C.text3 }}>🏠 Local       </span><span style={{ color: C.text }}>http://localhost:3000</span></div>
              <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                <div><span style={{ color: C.text3 }}>[10:24:01] </span><span style={{ color: C.green }}>GET</span><span style={{ color: C.text2 }}>  /dashboard     </span><span style={{ color: C.green }}>200</span><span style={{ color: C.text3 }}>  🇵🇭</span></div>
                <div><span style={{ color: C.text3 }}>[10:24:03] </span><span style={{ color: "#60a5fa" }}>POST</span><span style={{ color: C.text2 }}>  /api/login      </span><span style={{ color: C.green }}>200</span><span style={{ color: C.text3 }}>  🇺🇸</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#e8f0ff", marginBottom: 40, letterSpacing: -1 }}>Everything you need to share your work</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, transition: "border-color .15s" }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#e8f0ff", marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: C.text2, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#e8f0ff", marginBottom: 40, letterSpacing: -1 }}>Up and running in 60 seconds</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {steps.map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 16, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.text3, fontWeight: 700, minWidth: 24 }}>{s.n}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: C.text2, marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: s.green ? C.green : "#93c5fd" }}>{s.cmd}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 100px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#e8f0ff", marginBottom: 12, letterSpacing: -1 }}>Simple Pricing</h2>
        <p style={{ textAlign: "center", color: C.text2, marginBottom: 40, fontSize: 14 }}>No credit card required to start.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { name: "Free",  price: "$0",    sub: "forever", color: C.text2, border: C.border2, cta: "Get started free", href: "/auth", features: ["1 active tunnel","1-hour sessions","Auto subdomain","1-day request log","Community support"], pro: false },
            { name: "Pro",   price: "$8.99", sub: "/ month",  color: "#a78bfa", border: "#4c1d95", cta: "Start Pro", href: "/auth?upgrade=true", features: ["Unlimited tunnels","No session limits","Custom subdomains","30-day request history","Priority support","Team sharing (soon)"], pro: true },
          ].map(p => (
            <div key={p.name} style={{ background: p.pro ? "linear-gradient(135deg,#1a1040,#0f1e40)" : C.bg3, border: `1px solid ${p.border}`, borderRadius: 16, padding: 32, position: "relative", overflow: "hidden" }}>
              {p.pro && <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, background: "radial-gradient(circle,#6366f120,transparent 70%)", pointerEvents: "none" }}/>}
              <div style={{ color: p.color, fontWeight: 700, marginBottom: 8, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                <span style={{ color: "#fff", fontSize: 40, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{p.price}</span>
                <span style={{ color: C.text2, fontSize: 14 }}>{p.sub}</span>
              </div>
              <ul style={{ padding: 0, margin: "0 0 28px", listStyle: "none" }}>
                {p.features.map(f => <li key={f} style={{ color: C.text2, fontSize: 13, padding: "5px 0", display: "flex", gap: 8 }}><span style={{ color: C.green }}>✓</span>{f}</li>)}
              </ul>
              <Link to={p.href} style={{ display: "block", textAlign: "center", background: p.pro ? `linear-gradient(135deg,${C.accent2},${C.accent})` : C.bg2, color: p.pro ? "#fff" : C.text2, borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 14, fontFamily: "'Syne',sans-serif" }}>
                {p.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: `linear-gradient(135deg,${C.accent},${C.purple})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 13, color: C.text2 }}>LivePreview</span>
        </div>
        <span style={{ color: C.text3, fontSize: 12 }}>© 2026 LivePreview. Built for developers.</span>
      </div>
    </div>
  );
}
