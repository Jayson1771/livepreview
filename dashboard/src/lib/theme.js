export const C = {
  bg: "#080a0f",
  bg2: "#0f1117",
  bg3: "#1e2130",
  border: "#1e2130",
  border2: "#2d3142",
  text: "#e5e7eb",
  text2: "#9ca3af",
  text3: "#6b7280",
  accent: "#6366f1",
  accent2: "#8b5cf6",
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
};

export const METHOD_COLOR = {
  GET: "#22c55e",
  POST: "#6366f1",
  PUT: "#f59e0b",
  PATCH: "#a78bfa",
  DELETE: "#ef4444",
  OPTIONS: "#6b7280",
};

export const STATUS_COLOR = {
  active: "#22c55e",
  closed: "#6b7280",
  expired: "#f59e0b",
  error: "#ef4444",
};

export function statusColor(code) {
  if (!code) return C.text3;
  if (code < 300) return C.green;
  if (code < 400) return "#60a5fa";
  if (code < 500) return C.yellow;
  return C.red;
}

export const btn = {
  primary: {
    background: `linear-gradient(135deg,${C.accent},${C.accent2})`,
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
  },
  secondary: {
    background: "transparent",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "10px 20px",
    color: C.text2,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
};
