import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { C, inp } from "../lib/theme";

export default function AuthPage() {
  const [params]   = useSearchParams();
  const [mode, setMode]       = useState(params.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await signInWithEmail(email, password);
        if (err) {
          setError(err.message || "Invalid credentials");
        }
      } else {
        const { error: err } = await signUpWithEmail(email, password, name);
        if (err) {
          setError(err.message);
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (success) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 48, maxWidth: 400, width: "90%", textAlign: "center", animation: "fadeUp .4s ease" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📬</div>
        <h2 style={{ color: "#e8f0ff", marginBottom: 10, fontSize: 20, fontWeight: 800 }}>Check your email</h2>
        <p style={{ color: C.text2, fontSize: 14, lineHeight: 1.7 }}>
          We sent a confirmation link to<br/>
          <strong style={{ color: "#93c5fd" }}>{email}</strong>
        </p>
        <button onClick={() => { setSuccess(false); setMode("login"); }}
          style={{ marginTop: 24, background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "10px 24px", color: C.text2, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600 }}>
          Back to Sign In
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", left: "30%", width: 500, height: 500, background: "radial-gradient(circle,#3b82f608,transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "-10%", right: "20%", width: 400, height: 400, background: "radial-gradient(circle,#8b5cf608,transparent 70%)", pointerEvents: "none" }}/>

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp .4s ease", position: "relative" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link to="/" style={{ color: C.text2, fontSize: 13, fontFamily: "'Syne',sans-serif", textDecoration: "none" }}>← Back</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: `linear-gradient(135deg,${C.accent},${C.purple})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: `0 0 12px #3b82f640` }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#e8f0ff" }}>LivePreview</span>
          </div>
        </div>

        <div style={{ background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 20, padding: "36px 32px", boxShadow: "0 40px 80px #00000060" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: "#e8f0ff", fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: -0.5 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ color: C.text2, fontSize: 13, lineHeight: 1.6 }}>
              {mode === "login" ? "Sign in to your LivePreview dashboard" : "Start sharing your localhost in seconds"}
            </p>
          </div>

          <button onClick={signInWithGitHub} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: `1px solid ${C.border2}`, background: C.bg3, color: C.text, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: C.border }}/>
            <span style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.border }}/>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 11, color: C.text2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Full Name</label>
                <input placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} style={inp()} onFocus={e => (e.currentTarget.style.borderColor = C.accent)} onBlur={e => (e.currentTarget.style.borderColor = C.border)}/>
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, color: C.text2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inp()} onFocus={e => (e.currentTarget.style.borderColor = C.accent)} onBlur={e => (e.currentTarget.style.borderColor = C.border)}/>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: C.text2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
                {mode === "login" && <span style={{ fontSize: 12, color: C.accent, cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>}
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inp()} onKeyDown={e => e.key === "Enter" && handleSubmit()} onFocus={e => (e.currentTarget.style.borderColor = C.accent)} onBlur={e => (e.currentTarget.style.borderColor = C.border)}/>
            </div>

            {error && (
              <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: loading ? C.bg3 : `linear-gradient(135deg,${C.accent},${C.accent2})`, color: loading ? C.text2 : "#fff", fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", transition: "all .2s", boxShadow: loading ? "none" : `0 4px 24px #3b82f650`, marginTop: 4 }}>
              {loading ? "Connecting..." : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, color: C.text2, fontSize: 13 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
