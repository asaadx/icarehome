import type { ReactNode } from "react";

/** "icon" = icon-only, circular. "icon-text" = icon + label, pill-shaped. */
export type ActionButtonMode = "icon" | "icon-text";
export type ActionButtonTone = "primary" | "success" | "danger";

const TONE_STYLES: Record<ActionButtonTone, { color: string; background: string }> = {
  primary: { color: "var(--color-primary)", background: "var(--color-secondary)" },
  success: { color: "var(--color-success)", background: "var(--color-success-bg)" },
  danger: { color: "var(--color-danger)", background: "var(--color-danger-bg)" },
};

export default function ActionButton({
  icon,
  label,
  tone,
  mode,
  onClick,
  size = 34,
}: {
  icon: ReactNode;
  label: string;
  tone: ActionButtonTone;
  mode: ActionButtonMode;
  onClick: () => void;
  /** diameter for icon-only buttons; ignored in icon-text mode */
  size?: number;
}) {
  const { color, background } = TONE_STYLES[tone];
  const iconOnly = mode === "icon";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={iconOnly ? label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: iconOnly ? 0 : 6,
        fontSize: 13,
        fontWeight: 600,
        color,
        background,
        border: "none",
        cursor: "pointer",
        padding: iconOnly ? 0 : "7px 14px",
        borderRadius: iconOnly ? "50%" : 20,
        fontFamily: "inherit",
        width: iconOnly ? size : undefined,
        height: iconOnly ? size : undefined,
        minHeight: iconOnly ? size : 34,
        flexShrink: 0,
      }}
    >
      {icon}
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
