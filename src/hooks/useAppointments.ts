import { useState } from "react";
import type { Appointment, LogEntry } from "../types/domain";
import { initialAppointments } from "../data/seed";

export interface NewAppointmentInput {
  provider: string;
  specialty: string;
  location: string;
  date: string;
  time: string;
  prepNotes: string;
}

export function useAppointments(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  function savePrepNotes(id: string, text: string) {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, prepNotes: text } : a)));
    if (appt) {
      addLogEntry({ type: "appointment", title: `Updated appointment notes: ${appt.provider}`, detail: "Prep notes updated.", loggedBy: "You" });
    }
  }

  function saveOutcomeNotes(id: string, text: string) {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, outcomeNotes: text } : a)));
    if (appt) {
      addLogEntry({ type: "appointment", title: `Updated appointment notes: ${appt.provider}`, detail: "Outcome notes updated.", loggedBy: "You" });
    }
  }

  function addAppointment(input: NewAppointmentInput) {
    setAppointments((prev) => [
      ...prev,
      {
        id: `a${Date.now()}`,
        date: input.date,
        time: input.time,
        provider: input.provider,
        specialty: input.specialty,
        location: input.location,
        prepNotes: input.prepNotes,
        outcomeNotes: "",
        status: "upcoming",
      },
    ]);
    addLogEntry({ type: "appointment", title: `Appointment scheduled: ${input.provider}`, detail: `${input.specialty} \u00b7 ${input.date} ${input.time}`, loggedBy: "You" });
  }

  return { appointments, savePrepNotes, saveOutcomeNotes, addAppointment };
}
