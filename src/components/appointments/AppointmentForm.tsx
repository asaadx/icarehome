import { useState } from "react";
import type { FormEvent } from "react";
import type { NewAppointmentInput } from "../../hooks/useAppointments";
import Card from "../ui/Card";

const fieldLabelStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 } as const;
const fieldInputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" } as const;

export default function AppointmentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: NewAppointmentInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<NewAppointmentInput>({ provider: "", specialty: "", location: "", date: "", time: "", prepNotes: "" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm({ provider: "", specialty: "", location: "", date: "", time: "", prepNotes: "" });
  }

  return (
    <Card style={{ marginBottom: 20, border: "1.5px solid var(--color-primary)" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>New Appointment</div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={fieldLabelStyle}>Provider</label>
          <input value={form.provider} onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))} required placeholder="e.g. Dr. Anita Rosen" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Specialty</label>
          <input value={form.specialty} onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))} required placeholder="e.g. Neurology" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Location</label>
          <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required placeholder="e.g. Mass General Hospital" style={fieldInputStyle} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={fieldLabelStyle}>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required style={fieldInputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={fieldLabelStyle}>Time</label>
            <input value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} required placeholder="e.g. 10:30 AM" style={fieldInputStyle} />
          </div>
        </div>
        <div>
          <label style={fieldLabelStyle}>Prep notes (optional)</label>
          <textarea value={form.prepNotes} onChange={(e) => setForm((p) => ({ ...p, prepNotes: e.target.value }))} rows={3} placeholder="What to bring, what to ask..." style={{ ...fieldInputStyle, resize: "vertical", lineHeight: 1.5, fontSize: 15 }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}
