import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Stat({ label, value, icon, color }) {
  return (
    <div
      style={{
        background: "#0f1117",
        border: "1px solid #1e2130",
        borderRadius: 12,
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
          {value ?? "—"}
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [tunnels, setTunnels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/users/stats"), apiFetch("/tunnels")])
      .then(([s, t]) => {
        setStats(s.stats);
        setTunnels(t.tunnels || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const active = tunnels.filter((t) => t.status === "active");

  // Mock chart data — replace with real hourly data from API
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${i * 2}:00`,
    requests: Math.floor(Math.random() * 80),
  }));

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>
          Good {greeting()}, {profile?.full_name?.split(" ")[0] || "there"} 👋
        </h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
          Here's what's happening with your tunnels.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <Stat
          label="Active Tunnels"
          value={stats?.active_tunnels ?? 0}
          icon="🌐"
          color="#6366f1"
        />
        <Stat
          label="Total Requests"
          value={(stats?.total_requests ?? 0).toLocaleString()}
          icon="↗"
          color="#22c55e"
        />
        <Stat
          label="Total Tunnels"
          value={stats?.total_tunnels ?? 0}
          icon="⇌"
          color="#f59e0b"
        />
        <Stat
          label="Data Transferred"
          value={formatBytes(stats?.total_bytes_out ?? 0)}
          icon="📊"
          color="#a78bfa"
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}
      >
        {/* Request chart */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #1e2130",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 15,
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            Requests (last 24h)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="hour"
                stroke="#374151"
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <YAxis
                stroke="#374151"
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e2130",
                  border: "none",
                  borderRadius: 8,
                  color: "#e5e7eb",
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active tunnels */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #1e2130",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: "#e5e7eb",
              }}
            >
              Active Tunnels
            </h3>
            <Link
              to="/dashboard/tunnels"
              style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}
            >
              View all →
            </Link>
          </div>
          {loading ? (
            <div style={{ color: "#4b5563" }}>Loading...</div>
          ) : active.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔌</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>
                No active tunnels
              </div>
              <div style={{ color: "#4b5563", fontSize: 12, marginTop: 4 }}>
                Run{" "}
                <code style={{ color: "#a5b4fc" }}>
                  livepreview start -p 3000
                </code>
              </div>
            </div>
          ) : (
            active.slice(0, 5).map((t) => (
              <div
                key={t.id}
                style={{
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid #1e2130",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#22c55e",
                      boxShadow: "0 0 6px #22c55e",
                    }}
                  />
                  <a
                    href={t.public_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#a5b4fc",
                      fontSize: 13,
                      textDecoration: "none",
                      fontFamily: "monospace",
                    }}
                  >
                    {t.subdomain}.
                    {import.meta.env.VITE_TUNNEL_DOMAIN ||
                      "preview.yourdomain.com"}
                  </a>
                </div>
                <div
                  style={{ color: "#4b5563", fontSize: 12, paddingLeft: 16 }}
                >
                  Port {t.local_port} · {t.total_requests} req
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick start */}
      <div
        style={{
          marginTop: 24,
          background: "#0f1117",
          border: "1px solid #1e2130",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 15,
            fontWeight: 600,
            color: "#e5e7eb",
          }}
        >
          Quick Start
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {[
            {
              step: "1",
              label: "Install CLI",
              code: "npm install -g livepreview-cli",
            },
            {
              step: "2",
              label: "Start tunnel",
              code: `livepreview start -p 3000 -t ${
                profile?.api_token || "YOUR_TOKEN"
              }`,
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                background: "#060709",
                border: "1px solid #1e2130",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 6 }}>
                Step {s.step} — {s.label}
              </div>
              <code style={{ color: "#a5b4fc", fontSize: 13 }}>{s.code}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
