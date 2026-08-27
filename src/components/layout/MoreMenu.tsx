import type { Screen } from "../../types/domain";
import { MORE_ITEMS } from "./navItems";

export default function MoreMenu({
  screen,
  onSelect,
  onClose,
}: {
  screen: Screen;
  onSelect: (screen: Screen) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 448, background: "var(--color-card)", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", zIndex: 50, overflow: "hidden" }}>
        {MORE_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              width: "100%", padding: "16px 20px", textAlign: "left", border: "none",
              borderBottom: i < MORE_ITEMS.length - 1 ? "1px solid var(--color-border)" : "none",
              background: screen === item.id ? "var(--color-secondary)" : "transparent",
              fontSize: 16, fontWeight: screen === item.id ? 600 : 400,
              color: screen === item.id ? "var(--color-primary)" : "var(--color-foreground)",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
