import { useEffect, useState } from "react";
import { apiFetch } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const STATUS_COLOR = { active: "#22c55e", pending: "#f59e0b", closed: "#4b5563", expired: "#ef4444" };
const METHOD_COLOR = { GET: "#22c55e", POST: "#3b82f6", PUT: "#f59e0b", DELETE: "#ef4444", PATCH: "#a78bfa" };

export default function Tunnels() {
  const { profile } = useAuth();
  const [tunnels,  setTunnels]  = useState([]);
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [copied,   setCopied]   = useState(null);

  useEffect(() => { loadTunnels(); }, []);
  useEffect(() => { if (selected) loadRequests(selected.id); }, [selected]);

  async function loadTunnels() {
    setLoading(true);
    const { tunnels: data } = await apiFetch("/tunnels");
    setTunnels(data || []);
    setLoading(false);
  }

  async function loadRequests(id) {
    const { requests: data } = await apiFetch(`/tunnels/${id}/requests?limit=100`);
    setRequests(data || []);
  }

  async function closeTunnel(id) {
    await apiFetch(`/tunnels/${id}`, { method: "DELETE" });
    loadTunnels();
    if (selected?.id === id) setSelected(null);
  }

  function copyUrl(url, key) {
    navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Tunnels</h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>Manage and inspect your tunnel connections.</p>
      </div>

      {loading ? (
        <div style={{ color: "#4b5563", padding: 40, textAlign: "center" }}>Loading tunnels...</div>
      ) : tunnels.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
          {/* Tunnel list */}
          <div>
            {tunnels.map(t => (
              <div key={t.id}
                onClick={() => setSelected(selected?.id === t.id ? null : t)}
                style={{
                  background: selected?.id === t.id ? "#13151f" : "#0f1117",
                  border: `1px solid ${selected?.id === t.id ? "#4c1d95" : "#1e2130"}`,
                  borderRadius: 10, padding: "16px 20px", marginBottom: 10,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[t.status] || "#4b5563",
                    boxShadow: t.status === "active" ? `0 0 8px ${STATUS_COLOR.active}` : "none" }} />
                  <span style={{ color: "#e5e7eb", fontFamily: "monospace", fontSize: 14, flex: 1 }}>{t.public_url}</span>
                  <span style={{ color: STATUS_COLOR[t.status] || "#4b5563", fontSize: 12, textTransform: "uppercase", fontWeight: 600 }}>{t.status}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 20 }}>
                  <span style={{ color: "#4b5563", fontSize: 12 }}>Port {t.local_port}</span>
                  <span style={{ color: "#4b5563", fontSize: 12 }}>{t.total_requests.toLocaleString()} requests</span>
                  {t.expires_at && <span style={{ color: "#f59e0b", fontSize: 12 }}>expires {new Date(t.expires_at).toLocaleTimeString()}</span>}
                </div>

                <div style={{ display: "flex", gap: 8, paddingLeft: 20, marginTop: 10 }}>
                  <button onClick={e => { e.stopPropagation(); copyUrl(t.public_url, t.id); }}
                    style={{ background: "transparent", border: "1px solid #1e2130", borderRadius: 6, padding: "4px 10px", color: copied === t.id ? "#22c55e" : "#6b7280", cursor: "pointer", fontSize: 12 }}>
                    {copied === t.id ? "✓ Copied" : "Copy URL"}
                  </button>
                  <a href={t.public_url} target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ background: "transparent", border: "1px solid #1e2130", borderRadius: 6, padding: "4px 10px", color: "#a5b4fc", fontSize: 12, textDecoration: "none" }}>
                    Open ↗
                  </a>
                  {t.status === "active" && (
                    <button onClick={e => { e.stopPropagation(); closeTunnel(t.id); }}
                      style={{ background: "transparent", border: "1px solid #450a0a", borderRadius: 6, padding: "4px 10px", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Request detail panel */}
          {selected && (
            <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: 12, overflow: "hidden", height: "fit-content" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2130", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 14 }}>Request Log</span>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
              <div style={{ maxHeight: 500, overflowY: "auto", fontFamily: "monospace" }}>
                {requests.length === 0 ? (
                  <div style={{ padding: 24, textAlign: "center", color: "#4b5563", fontSize: 13 }}>No requests yet</div>
                ) : requests.map(r => (
                  <div key={r.id} style={{ display: "grid", gridTemplateColumns: "52px 1fr 44px 32px", gap: 8, padding: "8px 18px", borderBottom: "1px solid #0a0b0f", fontSize: 12, alignItems: "center" }}>
                    <span style={{ color: METHOD_COLOR[r.method] || "#9ca3af", fontWeight: 700 }}>{r.method}</span>
                    <span style={{ color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.path}</span>
                    <span style={{ color: r.status_code < 400 ? "#22c55e" : "#ef4444" }}>{r.status_code || "…"}</span>
                    <span style={{ color: "#374151" }}>{r.country || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔌</div>
      <h2 style={{ color: "#e5e7eb", marginBottom: 8 }}>No tunnels yet</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>Install the CLI and create your first tunnel</p>
      <code style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, padding: "12px 20px", color: "#a5b4fc", fontSize: 14 }}>
        livepreview start -p 3000
      </code>
    </div>
  );
}