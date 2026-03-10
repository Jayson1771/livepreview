import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Billing() {
  const { profile, refreshProfile } = useAuth();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [params] = useSearchParams();

  useEffect(() => {
    apiFetch("/billing/subscription").then((d) => {
      setSub(d);
      setLoading(false);
    });
    if (params.get("upgraded") === "true") refreshProfile();
  }, []);

  async function openPortal() {
    setBusy(true);
    const { url } = await apiFetch("/billing/portal", { method: "POST" });
    if (url) window.location.href = url;
    setBusy(false);
  }

  async function openCheckout() {
    setBusy(true);
    const { url, error } = await apiFetch("/billing/checkout", {
      method: "POST",
    });
    if (error) {
      alert(error);
      setBusy(false);
      return;
    }
    if (url) window.location.href = url;
    setBusy(false);
  }

  const isPro = profile?.plan === "pro";

  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>
          Billing
        </h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
          Manage your plan and subscription.
        </p>
      </div>

      {/* Current plan */}
      <div
        style={{
          background: "#0f1117",
          border: "1px solid #1e2130",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
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
          <div>
            <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}>
              Current Plan
            </div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
              {isPro ? "⚡ Pro" : "🔹 Free"}
            </div>
          </div>
          <div
            style={{
              background: isPro ? "#4c1d9522" : "#1e2130",
              border: `1px solid ${isPro ? "#7c3aed" : "#1e2130"}`,
              borderRadius: 20,
              padding: "4px 14px",
              color: isPro ? "#a78bfa" : "#6b7280",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {isPro ? "$8.99 / month" : "Free"}
          </div>
        </div>

        {!loading && sub?.subscription && (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {sub.subscription.cancelAtPeriodEnd ? (
              <span style={{ color: "#f59e0b" }}>
                ⚠️ Cancels on{" "}
                {new Date(
                  sub.subscription.currentPeriodEnd
                ).toLocaleDateString()}
              </span>
            ) : (
              <span>
                Renews on{" "}
                {new Date(
                  sub.subscription.currentPeriodEnd
                ).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          {isPro ? (
            <button
              onClick={openPortal}
              disabled={busy}
              style={btnStyle("#1e2130", "#9ca3af", busy)}
            >
              {busy ? "..." : "Manage Subscription →"}
            </button>
          ) : (
            <button
              onClick={openCheckout}
              disabled={busy}
              style={btnStyle(
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                "#fff",
                busy
              )}
            >
              {busy ? "..." : "Upgrade to Pro — $8.99/month"}
            </button>
          )}
        </div>
      </div>

      {/* Plan comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          {
            name: "Free",
            price: "$0",
            color: "#6b7280",
            features: [
              "1 active tunnel",
              "1-hour sessions",
              "Auto-generated subdomain",
              "1-day request history",
              "Community support",
            ],
            missing: ["Custom subdomains", "Unlimited sessions"],
          },
          {
            name: "Pro",
            price: "$8.99/mo",
            color: "#6366f1",
            features: [
              "Unlimited active tunnels",
              "No session limits",
              "Custom subdomains",
              "30-day request history",
              "Priority support",
              "Team sharing (coming soon)",
            ],
            missing: [],
          },
        ].map((plan) => (
          <div
            key={plan.name}
            style={{
              background: "#0f1117",
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${
                plan.name === "Pro" ? "#4c1d95" : "#1e2130"
              }`,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  color: plan.color,
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 4,
                }}
              >
                {plan.name}
              </div>
              <div style={{ color: "#fff", fontSize: 26, fontWeight: 800 }}>
                {plan.price}
              </div>
            </div>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {plan.features.map((f) => (
                <li
                  key={f}
                  style={{
                    color: "#9ca3af",
                    fontSize: 13,
                    padding: "4px 0",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#22c55e" }}>✓</span> {f}
                </li>
              ))}
              {plan.missing.map((f) => (
                <li
                  key={f}
                  style={{
                    color: "#374151",
                    fontSize: 13,
                    padding: "4px 0",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <span>✗</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = (bg, color, disabled) => ({
  background: bg,
  color,
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 14,
  fontWeight: 600,
  opacity: disabled ? 0.6 : 1,
});
