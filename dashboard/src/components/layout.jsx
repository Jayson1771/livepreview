import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { path: "/dashboard", label: "Overview", icon: "⊞" },
  { path: "/dashboard/tunnels", label: "Tunnels", icon: "⇌" },
  { path: "/dashboard/logs", label: "Logs", icon: "≡" },
  { path: "/dashboard/billing", label: "Billing", icon: "◈" },
  { path: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default function Layout({ children }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#080a0f",
        color: "#e5e7eb",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "#0a0c12",
          borderRight: "1px solid #1e2130",
          display: "flex",
          flexDirection: "column",
          padding: "0 0 24px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 20px 24px",
            borderBottom: "1px solid #1e2130",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              ⚡
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
              LivePreview
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV.map((n) => {
            const active = location.pathname === n.path;
            return (
              <Link
                key={n.path}
                to={n.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  marginBottom: 2,
                  textDecoration: "none",
                  background: active ? "#1e2130" : "transparent",
                  color: active ? "#e5e7eb" : "#6b7280",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan badge */}
        <div style={{ padding: "0 16px 16px" }}>
          {profile?.plan === "free" && (
            <Link
              to="/dashboard/billing"
              style={{
                display: "block",
                background: "linear-gradient(135deg,#1e1b4b,#2e1065)",
                border: "1px solid #4c1d95",
                borderRadius: 10,
                padding: "12px 14px",
                textDecoration: "none",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#a78bfa",
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                ⚡ Upgrade to Pro
              </div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>
                Unlimited tunnels · Custom domains
              </div>
            </Link>
          )}
          {profile?.plan === "pro" && (
            <div
              style={{
                background: "#0f1117",
                border: "1px solid #1e2130",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 12,
              }}
            >
              <div style={{ color: "#a78bfa", fontWeight: 600, fontSize: 13 }}>
                ⚡ Pro Plan
              </div>
            </div>
          )}

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                style={{ width: 30, height: 30, borderRadius: "50%" }}
              />
            ) : (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#1e2130",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {profile?.email?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#e5e7eb",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile?.full_name || profile?.email}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                background: "none",
                border: "none",
                color: "#4b5563",
                cursor: "pointer",
                fontSize: 16,
                padding: 4,
              }}
              title="Sign out"
            >
              ↩
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}
