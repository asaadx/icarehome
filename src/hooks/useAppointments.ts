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

export interface AppointmentEditInput {
  provider: string;
  specialty: string;
  location: string;
  date: string;
  time: string;
  prepNotes: string;
  outcomeNotes: string;
}

export function useAppointments(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

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

  function updateAppointment(id: string, input: AppointmentEditInput) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...input } : a)));
    addLogEntry({ type: "appointment", title: `Updated appointment: ${input.provider}`, detail: "Appointment details edited.", loggedBy: "You" });
  }

  function cancelAppointment(id: string) {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
    if (appt) {
      addLogEntry({ type: "appointment", title: `Appointment cancelled: ${appt.provider}`, detail: `${appt.specialty} \u00b7 was ${appt.date}`, loggedBy: "You" });
    }
  }

  function completeAppointment(id: string) {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)));
    if (appt) {
      addLogEntry({ type: "appointment", title: `Appointment completed: ${appt.provider}`, detail: appt.specialty, loggedBy: "You" });
    }
  }

  return { appointments, addAppointment, updateAppointment, cancelAppointment, completeAppointment };
}
