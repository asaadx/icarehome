import { useState } from "react";
import type { Appointment } from "../../types/domain";
import type { NewAppointmentInput } from "../../hooks/useAppointments";
import PageHeader from "../ui/PageHeader";
import Fab from "../ui/Fab";
import AppointmentCard from "./AppointmentCard";
import AppointmentForm from "./AppointmentForm";

export default function AppointmentsScreen({
  appointments,
  onSavePrepNotes,
  onSaveOutcomeNotes,
  onAddAppointment,
}: {
  appointments: Appointment[];
  onSavePrepNotes: (id: string, text: string) => void;
  onSaveOutcomeNotes: (id: string, text: string) => void;
  onAddAppointment: (input: NewAppointmentInput) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const upcoming = appointments.filter((a) => a.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
  const past = appointments.filter((a) => a.status !== "upcoming").sort((a, b) => b.date.localeCompare(a.date));

  function handleSubmit(input: NewAppointmentInput) {
    onAddAppointment(input);
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader title="Appointments" />

      {showForm && <AppointmentForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}

      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Upcoming</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
        {upcoming.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} onSavePrepNotes={onSavePrepNotes} onSaveOutcomeNotes={onSaveOutcomeNotes} />
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Past</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {past.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} onSavePrepNotes={onSavePrepNotes} onSaveOutcomeNotes={onSaveOutcomeNotes} />
        ))}
      </div>

      <Fab
        onClick={() => setShowForm(true)}
        color="var(--color-primary)"
        label="Add appointment"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      />
    </div>
  );
}
