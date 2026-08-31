import { useState } from "react";
import type { Symptom, Incident, LogEntry } from "../types/domain";
import { initialSymptoms, initialIncidents } from "../data/seed";

export interface NewSymptomInput {
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  category: string;
  loggedBy: string;
  date: string;
}

export interface NewIncidentInput {
  type: string;
  severity: Incident["severity"];
  description: string;
  response: string;
  doctorNotified: boolean;
  loggedBy: string;
  date: string;
}

export function useHealthEvents(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  function addSymptom(input: NewSymptomInput) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setSymptoms((prev) => [{ id: `s${Date.now()}`, time, ...input }, ...prev]);
    addLogEntry({ type: "symptom", title: input.symptom, detail: input.notes || "No additional notes.", loggedBy: input.loggedBy });
  }

  function addIncident(input: NewIncidentInput) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setIncidents((prev) => [{ id: `i${Date.now()}`, time, ...input }, ...prev]);
    addLogEntry({ type: "incident", title: input.type, detail: input.description, loggedBy: input.loggedBy });
  }

  function updateSymptom(id: string, input: NewSymptomInput) {
    setSymptoms((prev) => prev.map((s) => (s.id === id ? { ...s, ...input } : s)));
    addLogEntry({ type: "symptom", title: `Updated: ${input.symptom}`, detail: "Symptom entry edited.", loggedBy: input.loggedBy });
  }

  function deleteSymptom(id: string) {
    const symptom = symptoms.find((s) => s.id === id);
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
    if (symptom) {
      addLogEntry({ type: "symptom", title: `Deleted: ${symptom.symptom}`, detail: "Symptom entry removed.", loggedBy: "You" });
    }
  }

  function updateIncident(id: string, input: NewIncidentInput) {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, ...input } : i)));
    addLogEntry({ type: "incident", title: `Updated: ${input.type}`, detail: "Incident entry edited.", loggedBy: input.loggedBy });
  }

  function deleteIncident(id: string) {
    const incident = incidents.find((i) => i.id === id);
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    if (incident) {
      addLogEntry({ type: "incident", title: `Deleted: ${incident.type}`, detail: "Incident entry removed.", loggedBy: "You" });
    }
  }

  return { symptoms, incidents, addSymptom, addIncident, updateSymptom, deleteSymptom, updateIncident, deleteIncident };
}
