export type Screen = "dashboard" | "log" | "medications" | "appointments" | "caregivers" | "routines" | "health";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  prescriber: string;
  purpose: string;
  todayDoses: { time: string; given: boolean; givenBy?: string }[];
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  specialty: string;
  location: string;
  prepNotes: string;
  outcomeNotes: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface Caregiver {
  id: string;
  name: string;
  role: string;
  relationship: string;
  phone: string;
  email: string;
  schedule: string;
  initials: string;
  color: string;
}

export interface Routine {
  id: string;
  time: string;
  title: string;
  category: "morning" | "afternoon" | "evening" | "night";
  notes: string;
  assignedTo: string;
}

export interface Symptom {
  id: string;
  date: string;
  time: string;
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  loggedBy: string;
  category: string;
}

export interface Incident {
  id: string;
  date: string;
  time: string;
  type: string;
  severity: "minor" | "moderate" | "serious";
  description: string;
  response: string;
  loggedBy: string;
  doctorNotified: boolean;
}

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  type: "medication" | "symptom" | "incident" | "appointment" | "note" | "routine";
  title: string;
  detail: string;
  loggedBy: string;
}

export type HealthEvent = (Symptom & { kind: "symptom" }) | (Incident & { kind: "incident" });
