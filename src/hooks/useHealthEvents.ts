import { useState } from "react";
import type { Symptom, Incident, LogEntry } from "../types/domain";
import { initialSymptoms, initialIncidents } from "../data/seed";
import { TODAY } from "../lib/date";

export interface NewSymptomInput {
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  category: string;
  loggedBy: string;
}

export interface NewIncidentInput {
  type: string;
  severity: Incident["severity"];
  description: string;
  response: string;
  doctorNotified: boolean;
  loggedBy: string;
}

export function useHealthEvents(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  function addSymptom(input: NewSymptomInput) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setSymptoms((prev) => [{ id: `s${Date.now()}`, date: TODAY, time, ...input }, ...prev]);
    addLogEntry({ type: "symptom", title: input.symptom, detail: input.notes || "No additional notes.", loggedBy: input.loggedBy });
  }

  function addIncident(input: NewIncidentInput) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setIncidents((prev) => [{ id: `i${Date.now()}`, date: TODAY, time, ...input }, ...prev]);
    addLogEntry({ type: "incident", title: input.type, detail: input.description, loggedBy: input.loggedBy });
  }

  return { symptoms, incidents, addSymptom, addIncident };
}
