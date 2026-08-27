import { useState } from "react";
import type { Appointment } from "../types/domain";
import { initialAppointments } from "../data/seed";

export interface NewAppointmentInput {
  provider: string;
  specialty: string;
  location: string;
  date: string;
  time: string;
  prepNotes: string;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  function savePrepNotes(id: string, text: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, prepNotes: text } : a)));
  }

  function saveOutcomeNotes(id: string, text: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, outcomeNotes: text } : a)));
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
  }

  return { appointments, savePrepNotes, saveOutcomeNotes, addAppointment };
}
