// ─── Helpers ──────────────────────────────────────────────────────────────────

export const TODAY = "2026-08-26";

export function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntil(dateStr: string) {
  const today = new Date(`${TODAY}T00:00:00`);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export function eventTimestamp(date: string, time: string) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = match ? parseInt(match[1], 10) % 12 : 0;
  if (match && /pm/i.test(match[3])) hour += 12;
  const minute = match ? parseInt(match[2], 10) : 0;
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`).getTime();
}

export function timeToMinutes(time: string) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10) % 12;
  if (match[3] && /pm/i.test(match[3])) hour += 12;
  return hour * 60 + parseInt(match[2], 10);
}
