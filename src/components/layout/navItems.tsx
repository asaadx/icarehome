import type { ReactNode } from "react";
import type { Screen } from "../../types/domain";

// ─── Nav Config ───────────────────────────────────────────────────────────────

export const NAV_ITEMS: { id: Screen; label: string; icon: (active: boolean) => ReactNode }[] = [
  {
    id: "dashboard", label: "Home",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "var(--color-primary)" : "none"} stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "routines", label: "Routines",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "medications", label: "Meds",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7.5" /><path d="M16 12h6" /><path d="M19 9v6" />
      </svg>
    ),
  },
  {
    id: "appointments", label: "Appts",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "health", label: "Health",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "caregivers", label: "Team",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export const MORE_ITEMS: { id: Screen; label: string }[] = [
  { id: "log", label: "Log" },
];

