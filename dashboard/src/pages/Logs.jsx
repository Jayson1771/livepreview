import { useEffect, useState } from "react";
import { apiFetch } from "../lib/supabase";

const METHOD_COLOR = {
  GET: "#22c55e",
  POST: "#3b82f6",
  PUT: "#f59e0b",
  DELETE: "#ef4444",
  PATCH: "#a78bfa",
};

export default function Logs() {
  const [tunnels, setTunnels] = useState([]);
  const [activeTunnel, setActiveTunnel] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    apiFetch("/tunnels").then(({ tunnels: data }) => {
      const list = data || [];
      setTunnels(list);
      if (list.length > 0) {
        setActiveTunnel(list[0]);
        loadRequests(list[0].id);
      }
      setLoading(false);
    });
  }, []);

  async function loadRequests(id) {
    setLoading(true);
    const { requests: data } = await apiFetch(
      `/tunnels/${id}/requests?limit=500`
    );
    setRequests(data || []);
    setLoading(false);
  }

  function selectTunnel(t) {
    setActiveTunnel(t);
    setFilter("");
    loadRequests(t.id);
  }

  const filtered = requests.filter(
    (r) =>
      !filter ||
      r.path?.toLowerCase().includes(filter.toLowerCase()) ||
      r.method?.toLowerCase().includes(filter.toLowerCase()) ||
      String(r.status_code).includes(filter)
  );

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>
          Request Logs
        </h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
          Inspect every request through your tunnels.
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}
      >
        {/* Tunnel selector */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #1e2130",
            borderRadius: 12,
            overflow: "hidden",
            height: "fit-content",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #1e2130",
              color: "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Tunnels
          </div>
          {tunnels.length === 0 ? (
            <div style={{ padding: 16, color: "#4b5563", fontSize: 13 }}>
              No tunnels yet
            </div>
          ) : (
            tunnels.map((t) => (
              <div
                key={t.id}
                onClick={() => selectTunnel(t)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #0a0b0f",
                  background:
                    activeTunnel?.id === t.id ? "#13151f" : "transparent",
                  borderLeft:
                    activeTunnel?.id === t.id
                      ? "3px solid #6366f1"
                      : "3px solid transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: t.status === "active" ? "#22c55e" : "#374151",
                      boxShadow:
                        t.status === "active" ? "0 0 5px #22c55e" : "none",
                    }}
                  />
                  <span
                    style={{
                      color: "#e5e7eb",
                      fontSize: 13,
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.subdomain}
                  </span>
                </div>
                <div
                  style={{ color: "#4b5563", fontSize: 11, paddingLeft: 13 }}
                >
                  {t.total_requests} req
                </div>
              </div>
            ))
          )}
        </div>

        {/* Log table */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #1e2130",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #1e2130",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              placeholder="Filter by path, method, or status..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                flex: 1,
                background: "#060709",
                border: "1px solid #1e2130",
                borderRadius: 7,
                padding: "7px 12px",
                color: "#e5e7eb",
                fontSize: 13,
                outline: "none",
              }}
            />
            <span
              style={{ color: "#4b5563", fontSize: 12, whiteSpace: "nowrap" }}
            >
              {filtered.length} entries
            </span>
          </div>

          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 50px 90px 50px",
              gap: 8,
              padding: "8px 18px",
              borderBottom: "1px solid #1e2130",
            }}
          >
            {["Method", "Path", "Status", "Time", "Country"].map((h) => (
              <span
                key={h}
                style={{
                  color: "#4b5563",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div
            style={{
              maxHeight: "calc(100vh - 280px)",
              overflowY: "auto",
              fontFamily: "monospace",
            }}
          >
            {loading ? (
              <div
                style={{ padding: 32, textAlign: "center", color: "#4b5563" }}
              >
                Loading logs...
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{ padding: 32, textAlign: "center", color: "#4b5563" }}
              >
                {filter
                  ? "No requests match your filter."
                  : "No requests logged yet."}
              </div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 50px 90px 50px",
                    gap: 8,
                    padding: "7px 18px",
                    borderBottom: "1px solid #0a0b0f",
                    alignItems: "center",
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      color: METHOD_COLOR[r.method] || "#9ca3af",
                      fontWeight: 700,
                    }}
                  >
                    {r.method}
                  </span>
                  <span
                    style={{
                      color: "#9ca3af",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={r.path}
                  >
                    {r.path}
                  </span>
                  <span
                    style={{
                      color:
                        r.status_code >= 400
                          ? "#ef4444"
                          : r.status_code >= 300
                          ? "#f59e0b"
                          : "#22c55e",
                    }}
                  >
                    {r.status_code || "—"}
                  </span>
                  <span style={{ color: "#4b5563" }}>
                    {new Date(r.created_at).toLocaleTimeString()}
                  </span>
                  <span style={{ color: "#374151" }}>{r.country || "—"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
