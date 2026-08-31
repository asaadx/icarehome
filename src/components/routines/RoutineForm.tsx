import { useState } from "react";
import type { FormEvent } from "react";
import type { Routine } from "../../types/domain";
import type { RoutineInput } from "../../hooks/useRoutines";
import Card from "../ui/Card";

const fieldLabelStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 } as const;
const fieldInputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" } as const;

const categoryOptions: { id: Routine["category"]; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "night", label: "Night" },
];

function emptyForm(defaultCategory: Routine["category"]) {
  return { time: "", title: "", category: defaultCategory, notes: "", assignedTo: "" };
}

export default function RoutineForm({
  routine,
  onAdd,
  onSave,
  onCancel,
  defaultCategory = "morning",
}: {
  routine?: Routine;
  onAdd?: (input: RoutineInput) => void;
  onSave?: (id: string, input: RoutineInput) => void;
  onCancel: () => void;
  defaultCategory?: Routine["category"];
}) {
  const isEdit = !!routine;
  const [form, setForm] = useState<RoutineInput>(() =>
    routine
      ? { time: routine.time, title: routine.title, category: routine.category, notes: routine.notes, assignedTo: routine.assignedTo }
      : emptyForm(defaultCategory)
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isEdit && routine) {
      onSave?.(routine.id, form);
    } else {
      onAdd?.(form);
      setForm(emptyForm(defaultCategory));
    }
  }

  return (
    <Card style={{ marginBottom: 20, border: "1.5px solid var(--color-primary)" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{isEdit ? "Edit Routine" : "New Routine"}</div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={fieldLabelStyle}>Time</label>
          <input value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} required placeholder="e.g. 7:00 AM" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Title</label>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required placeholder="e.g. Morning medications" style={fieldInputStyle} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Category</label>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Routine["category"] }))} required style={fieldInputStyle}>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={fieldLabelStyle}>Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...fieldInputStyle, resize: "vertical", fontFamily: "inherit" }} />
        </div>
        <div>
          <label style={fieldLabelStyle}>Assigned to</label>
          <input value={form.assignedTo} onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))} required placeholder="e.g. Margaret / Yolanda" style={fieldInputStyle} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}
