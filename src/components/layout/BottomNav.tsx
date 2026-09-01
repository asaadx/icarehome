import type { Screen } from "../../types/domain";
import { NAV_ITEMS, MORE_ITEMS } from "./navItems";

export default function BottomNav({
  screen,
  onNavigate,
  showMore,
  onToggleMore,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  showMore: boolean;
  onToggleMore: () => void;
}) {
  const isMoreScreen = MORE_ITEMS.some((m) => m.id === screen);

  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "var(--color-card)", borderTop: "1px solid var(--color-border)",
        display: "flex", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 30,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = screen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 3, padding: "10px 2px 8px", border: "none", background: "transparent", cursor: "pointer",
            }}
          >
            {item.icon(active)}
            <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--color-primary)" : "var(--color-muted-foreground)" }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* More button */}
      <button
        onClick={onToggleMore}
        style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 3, padding: "10px 2px 8px", border: "none", background: "transparent", cursor: "pointer",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isMoreScreen || showMore ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: isMoreScreen || showMore ? 600 : 400, color: isMoreScreen || showMore ? "var(--color-primary)" : "var(--color-muted-foreground)" }}>
          More
        </span>
      </button>
    </nav>
  );
}
