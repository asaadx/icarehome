import type { CSSProperties, ReactNode } from "react";

export default function Card({ children, style, onClick }: { children: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "var(--color-card)", borderRadius: "var(--radius)", padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : undefined, ...style }}
    >
      {children}
    </div>
  );
}
