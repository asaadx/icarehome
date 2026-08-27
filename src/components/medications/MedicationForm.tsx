import { useState } from "react";
import type { FormEvent } from "react";
import type { Medication } from "../../types/domain";
import type { MedicationInput, NewMedicationInput } from "../../hooks/useMedications";
import Card from "../ui/Card";

const fieldLabelStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 } as const;
const fieldInputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" } as const;

const emptyForm = { name: "", dose: "", schedule: "", prescriber: "", purpose: "", doseTimes: "" };

export default function MedicationForm({
  medication,
  onAdd,
  onSave,
  onCancel,
}: {
  medication?: Medication;
  onAdd?: (input: NewMedicationInput) => void;
  onSave?: (id: string, input: MedicationInput) => void;
  onCancel: () => void;
}) {
  const isEdit = !!medication;
  const [form, setForm] = useState(() =>
    medication
      ? { name: medication.name, dose: medication.dose, schedule: medication.schedule, prescriber: medication.prescriber, purpose: medication.purpose, doseTimes: "" }
      : emptyForm
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { name, dose, schedule, prescriber, purpose } = form;
    if (isEdit && medication) {
      onSave?.(medication.id, { name, dose, schedule, prescriber, purpose });
    } else {
      const doseTimes = form.doseTimes.split(",").map((t) => t.trim()).filter(Boolean);
      onAdd?.({ name, dose, schedule, prescriber, purpose, doseTimes });
      setForm(emptyForm);
    }
  }

  return (
    <Card style={{ marginBottom: 20, border: "1.5px solid var(--color-primary)" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{isEdit ? "Edit Medication" : "New Medication"}</div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={fieldLabelStyle}>Name</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required placeholder="e.g. Carbidopa-Levodopa" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Dose</label>
          <input value={form.dose} onChange={(e) => setForm((p) => ({ ...p, dose: e.target.value }))} required placeholder="e.g. 25/100 mg" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Schedule</label>
          <input value={form.schedule} onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))} required placeholder="e.g. 3x daily" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Prescriber</label>
          <input value={form.prescriber} onChange={(e) => setForm((p) => ({ ...p, prescriber: e.target.value }))} required placeholder="e.g. Dr. Anita Rosen" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Purpose</label>
          <input value={form.purpose} onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))} required placeholder="e.g. Parkinson's symptom control" style={fieldInputStyle} />
        </div>
        {!isEdit && (
          <div>
            <label style={fieldLabelStyle}>Dose times</label>
            <input
              value={form.doseTimes}
              onChange={(e) => setForm((p) => ({ ...p, doseTimes: e.target.value }))}
              required
              placeholder="e.g. 7:00 AM, 5:00 PM"
              style={fieldInputStyle}
            />
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}
