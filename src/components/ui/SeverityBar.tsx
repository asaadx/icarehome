import { SEVERITY_LABELS, SEVERITY_COLORS } from "../../lib/severity";

export default function SeverityBar({ level, showLabel = false }: { level: 1 | 2 | 3 | 4 | 5; showLabel?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 20, height: 5, borderRadius: 2, background: i <= level ? SEVERITY_COLORS[level] : "var(--color-border)" }} />
        ))}
      </div>
      {showLabel && <span style={{ fontSize: 13, fontWeight: 500, color: SEVERITY_COLORS[level] }}>{SEVERITY_LABELS[level]}</span>}
    </div>
  );
}
