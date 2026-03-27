import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../lib/supabase";
import { C } from "../lib/theme";
import { Card, LiveDot, EmptyState } from "../components/ui";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({ label, value, icon, glow }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right,${glow},transparent 70%)`, pointerEvents: "none" }}/>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: C.text2, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#e8f0ff", letterSpacing: -1, fontFamily: "'JetBrains Mono',monospace" }}>{value ?? "—"}</div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024, sizes = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function Overview() {
  const { profile } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [tunnels, setTunnels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/users/stats"), apiFetch("/tunnels")])
      .then(([s, t]) => { setStats(s.stats); setTunnels(t.tunnels || []); })
      .finally(() => setLoading(false));
  }, []);

  const active = tunnels.filter(t => t.status === "active");
  const firstName = (profile?.full_name || profile?.email || "there").split(" ")[0];

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${i * 2}:00`,
    requests: Math.floor(Math.random() * 80),
  }));

  return (
    <div style={{ padding: "32px 36px", animation: "fadeUp .3s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ff", letterSpacing: -0.5, margin: 0 }}>
            {greeting()}, {firstName} 👋
          </h1>
          <LiveDot/>
        </div>
        <p style={{ color: C.text2, fontSize: 13 }}>Here's what's happening with your tunnels.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard label="Active Tunnels"    value={stats?.active_tunnels ?? 0}                      icon="🌐" glow="#3b82f612"/>
        <StatCard label="Total Requests"    value={(stats?.total_requests ?? 0).toLocaleString()}    icon="↗"  glow="#10b98112"/>
        <StatCard label="Total Tunnels"     value={stats?.total_tunnels ?? 0}                        icon="⇌"  glow="#6366f112"/>
        <StatCard label="Data Transferred"  value={formatBytes(stats?.total_bytes_out ?? 0)}         icon="📊" glow="#f59e0b12"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        {/* Chart */}
        <Card title="Requests — Last 24h" style={{ marginBottom: 0 }}>
          <div style={{ padding: "20px 20px 12px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis dataKey="hour" stroke={C.border2} tick={{ fill: C.text3, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}/>
                <YAxis stroke={C.border2} tick={{ fill: C.text3, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}/>
                <Tooltip contentStyle={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12, fontFamily: "'Syne',sans-serif" }}/>
                <Line type="monotone" dataKey="requests" stroke={C.accent} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: C.accent }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active tunnels */}
        <Card title="Active Tunnels" action="View all →" onAction={() => {}} style={{ marginBottom: 0 }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: C.text3, fontSize: 13 }}>Loading...</div>
          ) : active.length === 0 ? (
            <EmptyState icon="🔌" title="No active tunnels" desc="Run livepreview start -p 3000" code="livepreview start -p 3000"/>
          ) : (
            active.slice(0, 5).map(t => (
              <div key={t.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}`, flexShrink: 0 }}/>
                  <a href={t.public_url} target="_blank" rel="noreferrer" style={{ color: "#93c5fd", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textDecoration: "none" }}>
                    {t.subdomain}.{import.meta.env.VITE_TUNNEL_DOMAIN || "livepreview.dev"}
                  </a>
                </div>
                <div style={{ color: C.text3, fontSize: 11, paddingLeft: 16, fontFamily: "'JetBrains Mono',monospace" }}>
                  Port {t.local_port} · {t.total_requests} req
                </div>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Quick start */}
      <Card title="Quick Start" style={{ marginTop: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16 }}>
          {[
            { step: "1", label: "Install CLI",   code: "npm install -g livepreview-cli" },
            { step: "2", label: "Start tunnel",  code: `livepreview start -p 3000 -t ${profile?.api_token || "YOUR_TOKEN"}` },
          ].map(s => (
            <div key={s.step} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Step {s.step} — {s.label}</div>
              <code style={{ color: "#93c5fd", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", wordBreak: "break-all" }}>{s.code}</code>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
