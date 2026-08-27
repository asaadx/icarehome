export default function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}
