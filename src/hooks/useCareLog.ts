import { useState } from "react";
import type { LogEntry } from "../types/domain";
import { initialLog } from "../data/seed";
import { TODAY } from "../lib/date";

export function useCareLog() {
  const [log, setLog] = useState<LogEntry[]>(initialLog);

  function addLogEntry(entry: Omit<LogEntry, "id" | "date" | "time">) {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setLog((prev) => [{ id: `l${Date.now()}`, date: TODAY, time, ...entry }, ...prev]);
  }

  return { log, addLogEntry };
}
