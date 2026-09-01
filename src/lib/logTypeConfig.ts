export const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  medication: { label: "Medication", color: "#1A6EBF", bg: "#EFF5FE" },
  symptom: { label: "Symptom", color: "#9A5700", bg: "#FEF3E2" },
  incident: { label: "Incident", color: "#B91C1C", bg: "#FEF2F2" },
  appointment: { label: "Appointment", color: "#1A7A45", bg: "#E8F5EE" },
  note: { label: "Note", color: "#72737A", bg: "#F0F0F3" },
  routine: { label: "Routine", color: "#72737A", bg: "#F0F0F3" },
};

/** Longest label's character count, used to give the pill column a fixed
 * width wherever a type Pill sits next to text (Dashboard Recent Activity,
 * Care Log) — keeps that spacing identical everywhere regardless of which
 * entry types happen to be visible in a given list. */
export const TYPE_LABEL_MAX_CHARS = Math.max(...Object.values(TYPE_CONFIG).map((c) => c.label.length));
