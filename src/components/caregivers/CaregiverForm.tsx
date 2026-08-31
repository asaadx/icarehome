import { useState } from "react";
import type { FormEvent } from "react";
import type { Caregiver } from "../../types/domain";
import type { CaregiverInput } from "../../hooks/useCaregivers";
import Card from "../ui/Card";

const fieldLabelStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 } as const;
const fieldInputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" } as const;

const emptyForm = { name: "", role: "", relationship: "", phone: "", email: "", schedule: "" };

export default function CaregiverForm({
  caregiver,
  onAdd,
  onSave,
  onCancel,
}: {
  caregiver?: Caregiver;
  onAdd?: (input: CaregiverInput) => void;
  onSave?: (id: string, input: CaregiverInput) => void;
  onCancel: () => void;
}) {
  const isEdit = !!caregiver;
  const [form, setForm] = useState(() =>
    caregiver
      ? { name: caregiver.name, role: caregiver.role, relationship: caregiver.relationship, phone: caregiver.phone, email: caregiver.email, schedule: caregiver.schedule }
      : emptyForm
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isEdit && caregiver) {
      onSave?.(caregiver.id, form);
    } else {
      onAdd?.(form);
      setForm(emptyForm);
    }
  }

  return (
    <Card style={{ marginBottom: 20, border: "1.5px solid var(--color-primary)" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{isEdit ? "Edit Caregiver" : "New Caregiver"}</div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={fieldLabelStyle}>Name</label>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Role</label>
          <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} required placeholder="e.g. Home Health Aide" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Relationship</label>
          <input value={form.relationship} onChange={(e) => setForm((p) => ({ ...p, relationship: e.target.value }))} required placeholder="e.g. Daughter" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Phone</label>
          <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required placeholder="e.g. (617) 555-0142" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Email</label>
          <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required placeholder="e.g. name@email.com" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Schedule</label>
          <input value={form.schedule} onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))} required placeholder="e.g. Mon–Fri, 9 AM–3 PM" style={fieldInputStyle} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}
