import { useState, useEffect } from "react";
import { C } from "../lib/theme";

export function Card({ title, children, action, onAction, style }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, ...style }}>
      {(title || action) && (
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: C.text2, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{title}</span>
          {action && (
            <button onClick={onAction} style={{ background: "none", border: "none", color: C.text3, cursor: "pointer", fontSize: 14 }}>
              {action}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function Section({ title, children, danger }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ color: danger ? C.red : C.text2, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${danger ? "#7f1d1d" : C.border}` }}>
        {danger ? "⚠ " : ""}{title}
      </div>
      {children}
    </div>
  );
}

export function PageHeader({ title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ff", letterSpacing: -0.5, margin: "0 0 4px" }}>{title}</h1>
      {desc && <p style={{ color: C.text2, fontSize: 13, margin: 0 }}>{desc}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, desc, code }) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
      <div style={{ color: C.text2, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {desc && <div style={{ color: C.text3, fontSize: 13, marginBottom: 16 }}>{desc}</div>}
      {code && (
        <code style={{ display: "inline-block", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", color: "#93c5fd", fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
          {code}
        </code>
      )}
    </div>
  );
}

export function LiveDot() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: "pulse 2s infinite" }} />
      <span style={{ color: C.green, fontSize: 11, fontWeight: 600 }}>Live</span>
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  function show(message) {
    setMsg(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  }

  return { msg, visible, show };
}

export function Toast({ msg, visible }) {
  if (!visible || !msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "12px 20px", color: C.text, fontSize: 14, fontWeight: 500,
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 1000,
    }}>
      {msg}
    </div>
  );
}
