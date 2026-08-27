import { useState } from "react";
import type { Symptom, Incident } from "../types/domain";
import { initialSymptoms, initialIncidents } from "../data/seed";

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

export function useHealthEvents() {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  function addSymptom(input: NewSymptomInput) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setSymptoms((prev) => [{ id: `s${Date.now()}`, date: "2026-08-26", time, ...input }, ...prev]);
  }

  function addIncident(input: NewIncidentInput) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setIncidents((prev) => [{ id: `i${Date.now()}`, date: "2026-08-26", time, ...input }, ...prev]);
  }

  return { symptoms, incidents, addSymptom, addIncident };
}
