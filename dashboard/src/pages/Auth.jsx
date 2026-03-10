import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    if (mode === "login") {
      const { error: err } = await signInWithEmail(email, password);
      if (err) setError(err.message);
      else navigate("/dashboard");
    } else {
      const { error: err } = await signUpWithEmail(email, password, name);
      if (err) setError(err.message);
      else setSuccess(true);
    }
    setLoading(false);
  };

  const inp = {
    background: "#0f1117",
    border: "1px solid #1e2130",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e5e7eb",
    fontSize: 14,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };
  const btn = (primary) => ({
    width: "100%",
    padding: "11px 0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    border: "none",
    background: primary ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#1e2130",
    color: primary ? "#fff" : "#9ca3af",
    opacity: loading ? 0.6 : 1,
  });

  if (success)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #1e2130",
            borderRadius: 16,
            padding: 40,
            maxWidth: 400,
            width: "90%",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 style={{ color: "#e5e7eb", marginBottom: 8 }}>
            Check your email
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            We sent a confirmation link to{" "}
            <strong style={{ color: "#a5b4fc" }}>{email}</strong>
          </p>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#0f1117",
          border: "1px solid #1e2130",
          borderRadius: 16,
          padding: 40,
          maxWidth: 420,
          width: "90%",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              marginBottom: 12,
            }}
          >
            ⚡
          </div>
          <h1
            style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}
          >
            LivePreview
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your free account"}
          </p>
        </div>

        {/* GitHub OAuth */}
        <button
          onClick={signInWithGitHub}
          style={{
            ...btn(false),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 18 }}>⌥</span> Continue with GitHub
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#1e2130" }} />
          <span style={{ color: "#4b5563", fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#1e2130" }} />
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inp}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inp}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inp}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          {error && (
            <div
              style={{
                background: "#450a0a",
                border: "1px solid #7f1d1d",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#fca5a5",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button onClick={handleSubmit} style={btn(true)} disabled={loading}>
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Toggle */}
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#a5b4fc",
              cursor: "pointer",
              fontSize: 14,
              padding: 0,
            }}
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
