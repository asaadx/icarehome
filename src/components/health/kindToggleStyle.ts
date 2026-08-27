import type { CSSProperties } from "react";

export function kindToggleStyle(active: boolean, danger: boolean): CSSProperties {
  return {
    flex: 1, padding: "12px", borderRadius: 10, minHeight: 44,
    border: "1.5px solid " + (active ? (danger ? "var(--color-danger)" : "var(--color-primary)") : "var(--color-border)"),
    background: active ? (danger ? "var(--color-danger-bg)" : "var(--color-secondary)") : "transparent",
    color: active ? (danger ? "var(--color-danger)" : "var(--color-primary)") : "var(--color-muted-foreground)",
    fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  };
}
