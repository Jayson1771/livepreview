import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { profile, refreshProfile, signOut } = useAuth();
  const navigate  = useNavigate();
  const [copied,  setCopied]  = useState(false);
  const [rotating, setRotating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm,  setConfirm]  = useState("");
  const [name,     setName]     = useState(profile?.full_name || "");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  function copyToken() {
    navigator.clipboard.writeText(profile?.api_token || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function rotateToken() {
    if (!window.confirm("Rotate your API token? Your CLI will need to be updated.")) return;
    setRotating(true);
    await apiFetch("/users/rotate-token", { method: "POST" });
    await refreshProfile();
    setRotating(false);
  }

  async function saveName() {
    setSaving(true);
    await apiFetch("/users/me", { method: "PATCH", body: JSON.stringify({ full_name: name }) });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function deleteAccount() {
    if (confirm !== profile?.email) return;
    setDeleting(true);
    await apiFetch("/users/me", { method: "DELETE" });
    await signOut();
    navigate("/");
  }

  const inp = { background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, padding: "10px 14px", color: "#e5e7eb", fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: 32, maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Settings</h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ color: "#6b7280", fontSize: 12, display: "block", marginBottom: 6 }}>Display Name</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={name} onChange={e => setName(e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={saveName} disabled={saving} style={btnStyle(saving ? "#1e2130" : "#6366f1", "#fff", saving)}>
                {saved ? "✓ Saved" : saving ? "..." : "Save"}
              </button>
            </div>
          </div>
          <div>
            <label style={{ color: "#6b7280", fontSize: 12, display: "block", marginBottom: 6 }}>Email</label>
            <input value={profile?.email || ""} disabled style={{ ...inp, opacity: 0.5 }} />
          </div>
        </div>
      </Section>

      {/* API Token */}
      <Section title="API Token">
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 0 }}>Use this token to authenticate the CLI. Keep it secret.</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <code style={{ flex: 1, background: "#060709", border: "1px solid #1e2130", borderRadius: 8, padding: "10px 14px", color: "#a5b4fc", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profile?.api_token || "Loading..."}
          </code>
          <button onClick={copyToken} style={btnStyle("#1e2130", copied ? "#22c55e" : "#9ca3af", false)}>
            {copied ? "✓" : "Copy"}
          </button>
        </div>
        <button onClick={rotateToken} disabled={rotating} style={btnStyle("#450a0a22", "#ef4444", rotating)}>
          {rotating ? "Rotating..." : "🔄 Rotate Token"}
        </button>
        <p style={{ color: "#4b5563", fontSize: 12, marginBottom: 0 }}>After rotating, update your CLI: <code style={{ color: "#6366f1" }}>livepreview login</code></p>
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone" danger>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 0 }}>
          Permanently delete your account, all tunnels, and all data. This cannot be undone.
        </p>
        <label style={{ color: "#6b7280", fontSize: 12, display: "block", marginBottom: 6 }}>
          Type your email to confirm: <strong style={{ color: "#e5e7eb" }}>{profile?.email}</strong>
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="your@email.com"
            style={{ ...inp, flex: 1, borderColor: "#7f1d1d" }} />
          <button onClick={deleteAccount} disabled={confirm !== profile?.email || deleting}
            style={btnStyle("#7f1d1d", "#fca5a5", confirm !== profile?.email || deleting)}>
            {deleting ? "..." : "Delete Account"}
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children, danger }) {
  return (
    <div style={{ background: "#0f1117", border: `1px solid ${danger ? "#7f1d1d44" : "#1e2130"}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: danger ? "#ef4444" : "#e5e7eb" }}>{title}</h2>
      {children}
    </div>
  );
}

const btnStyle = (bg, color, disabled) => ({
  background: bg, color, border: "none", borderRadius: 8,
  padding: "9px 16px", cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 13, fontWeight: 600, opacity: disabled ? 0.6 : 1, whiteSpace: "nowrap",
});