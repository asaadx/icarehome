export default function CheckCircle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 48, height: 48, borderRadius: 12,
        border: checked ? "none" : "2px solid var(--color-border)",
        background: checked ? "var(--color-success)" : "#fff",
        cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s", boxShadow: checked ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {checked ? (
        <svg width="22" height="22" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="var(--color-border)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
    </button>
  );
}
