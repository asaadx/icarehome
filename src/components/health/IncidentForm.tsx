import { useState } from "react";
import type { FormEvent } from "react";
import type { Incident } from "../../types/domain";
import type { NewIncidentInput } from "../../hooks/useHealthEvents";
import { caregivers } from "../../data/seed";

const fieldLabelStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 } as const;
const fieldInputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" } as const;

export default function IncidentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: NewIncidentInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<NewIncidentInput>({ type: "", severity: "minor", description: "", response: "", doctorNotified: false, loggedBy: "Margaret Marsh" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm({ type: "", severity: "minor", description: "", response: "", doctorNotified: false, loggedBy: "Margaret Marsh" });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={fieldLabelStyle}>Type</label>
        <input value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} required placeholder="e.g. Fall, Medication error..." style={fieldInputStyle} />
      </div>
      <div>
        <label style={fieldLabelStyle}>Severity</label>
        <select value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value as Incident["severity"] }))} style={fieldInputStyle}>
          {(["minor", "moderate", "serious"] as const).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label style={fieldLabelStyle}>What happened?</label>
        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={3} placeholder="Description of the event..." style={{ ...fieldInputStyle, resize: "vertical", lineHeight: 1.5, fontSize: 15 }} />
      </div>
      <div>
        <label style={fieldLabelStyle}>Response</label>
        <textarea value={form.response} onChange={(e) => setForm((p) => ({ ...p, response: e.target.value }))} required rows={3} placeholder="What was done in response..." style={{ ...fieldInputStyle, resize: "vertical", lineHeight: 1.5, fontSize: 15 }} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--color-foreground)", cursor: "pointer" }}>
        <input type="checkbox" checked={form.doctorNotified} onChange={(e) => setForm((p) => ({ ...p, doctorNotified: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "var(--color-primary)", cursor: "pointer" }} />
        Doctor notified
      </label>
      <div>
        <label style={fieldLabelStyle}>Logged by</label>
        <select value={form.loggedBy} onChange={(e) => setForm((p) => ({ ...p, loggedBy: e.target.value }))} style={fieldInputStyle}>
          {caregivers.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-danger)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
      </div>
    </form>
  );
}
