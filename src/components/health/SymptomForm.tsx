import { useState } from "react";
import type { FormEvent } from "react";
import type { Symptom } from "../../types/domain";
import type { NewSymptomInput } from "../../hooks/useHealthEvents";
import { caregivers } from "../../data/seed";
import { SEVERITY_LABELS } from "../../lib/severity";
import { TODAY } from "../../lib/date";

const fieldLabelStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 } as const;
const fieldInputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" } as const;

export default function SymptomForm({
  symptom,
  onSubmit,
  onSave,
  onCancel,
}: {
  symptom?: Symptom;
  onSubmit?: (input: NewSymptomInput) => void;
  onSave?: (id: string, input: NewSymptomInput) => void;
  onCancel: () => void;
}) {
  const isEdit = !!symptom;
  const [form, setForm] = useState(() =>
    symptom
      ? { symptom: symptom.symptom, severity: String(symptom.severity), notes: symptom.notes, category: symptom.category, loggedBy: symptom.loggedBy, date: symptom.date }
      : { symptom: "", severity: "2", notes: "", category: "Motor", loggedBy: "Margaret Marsh", date: TODAY }
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const input: NewSymptomInput = {
      symptom: form.symptom,
      severity: parseInt(form.severity) as 1 | 2 | 3 | 4 | 5,
      notes: form.notes,
      category: form.category,
      loggedBy: form.loggedBy,
      date: form.date,
    };
    if (isEdit && symptom) {
      onSave?.(symptom.id, input);
    } else {
      onSubmit?.(input);
      setForm({ symptom: "", severity: "2", notes: "", category: "Motor", loggedBy: "Margaret Marsh", date: TODAY });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={fieldLabelStyle}>What happened?</label>
        <input value={form.symptom} onChange={(e) => setForm((p) => ({ ...p, symptom: e.target.value }))} required placeholder="e.g. Tremor worse, glucose elevated..." style={fieldInputStyle} />
      </div>
      <div>
        <label style={fieldLabelStyle}>Date</label>
        <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required style={fieldInputStyle} />
      </div>
      <div>
        <label style={fieldLabelStyle}>
          Severity — <span style={{ fontWeight: 400 }}>{SEVERITY_LABELS[parseInt(form.severity)]}</span>
        </label>
        <input type="range" min="1" max="5" value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))} style={{ width: "100%", accentColor: "var(--color-primary)", height: 6, cursor: "pointer" }} />
      </div>
      <div>
        <label style={fieldLabelStyle}>Category</label>
        <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} style={fieldInputStyle}>
          {["Motor", "Cognitive", "Diabetes", "Pain", "Sleep", "Mood", "Other"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={fieldLabelStyle}>Notes (optional)</label>
        <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Context, what was happening, what helped..." style={{ ...fieldInputStyle, resize: "vertical", lineHeight: 1.5, fontSize: 15 }} />
      </div>
      <div>
        <label style={fieldLabelStyle}>Logged by</label>
        <select value={form.loggedBy} onChange={(e) => setForm((p) => ({ ...p, loggedBy: e.target.value }))} style={fieldInputStyle}>
          {caregivers.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
      </div>
    </form>
  );
}
