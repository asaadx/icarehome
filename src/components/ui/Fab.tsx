import type { ReactNode } from "react";

export default function Fab({ onClick, color, label, icon }: { onClick: () => void; color: string; label: string; icon: ReactNode }) {
  return (
    <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, pointerEvents: "none", zIndex: 35 }}>
      <button
        onClick={onClick}
        aria-label={label}
        style={{
          position: "absolute", right: 16, bottom: 16, pointerEvents: "auto",
          width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: color, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.28)", cursor: "pointer",
        }}
      >
        {icon}
      </button>
    </div>
  );
}
