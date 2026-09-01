import { useState } from "react";
import type { Routine } from "../../types/domain";
import type { RoutineInput } from "../../hooks/useRoutines";
import { timeToMinutes } from "../../lib/date";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import CheckCircle from "../ui/CheckCircle";
import Fab from "../ui/Fab";
import RoutineForm from "./RoutineForm";

const editBtnStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-primary)", background: "var(--color-secondary)", border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 20, fontFamily: "inherit", minHeight: 34 } as const;
const deleteBtnStyle = { fontSize: 13, fontWeight: 600, color: "var(--color-danger)", background: "var(--color-danger-bg)", border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 20, fontFamily: "inherit", minHeight: 34 } as const;

export default function RoutinesScreen({
  routines,
  onAddRoutine,
  onUpdateRoutine,
  onDeleteRoutine,
  onToggleRoutineDone,
}: {
  routines: Routine[];
  onAddRoutine: (input: RoutineInput) => void;
  onUpdateRoutine: (id: string, input: RoutineInput) => void;
  onDeleteRoutine: (id: string) => void;
  onToggleRoutineDone: (id: string) => void;
}) {
  const cats: { id: Routine["category"]; label: string; color: string }[] = [
    { id: "morning", label: "Morning", color: "#E8A838" },
    { id: "afternoon", label: "Afternoon", color: "#1A6EBF" },
    { id: "evening", label: "Evening", color: "#7A3FA0" },
    { id: "night", label: "Night", color: "#374151" },
  ];
  const [active, setActive] = useState<Routine["category"]>("morning");
  const cat = cats.find((c) => c.id === active)!;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = routines.filter((r) => r.category === active).sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  function handleAdd(input: RoutineInput) {
    onAddRoutine(input);
    setShowAddForm(false);
  }

  function handleSave(id: string, input: RoutineInput) {
    onUpdateRoutine(id, input);
    setEditingId(null);
  }

  return (
    <div>
      <PageHeader title="Daily Routines" subtitle="Care schedule and medication timing" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{
              flex: 1, padding: "11px 4px", borderRadius: 10, border: "1.5px solid", minHeight: 44,
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              borderColor: active === c.id ? c.color : "var(--color-border)",
              background: active === c.id ? c.color : "transparent",
              color: active === c.id ? "#fff" : "var(--color-muted-foreground)",
              fontFamily: "inherit",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {showAddForm && <RoutineForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} defaultCategory={active} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((routine) => {
          if (editingId === routine.id) {
            return <RoutineForm key={routine.id} routine={routine} onSave={handleSave} onCancel={() => setEditingId(null)} />;
          }

          return (
            <Card key={routine.id}>
              <div style={{ display: "flex", gap: 14 }}>
                <CheckCircle checked={routine.completed} onChange={() => onToggleRoutineDone(routine.id)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: cat.color, marginBottom: 2 }}>{routine.time}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{routine.title}</div>
                  {routine.notes && (
                    <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.5, marginBottom: 6 }}>{routine.notes}</div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Assigned to: {routine.assignedTo}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => setEditingId(routine.id)} style={editBtnStyle}>Edit</button>
                <button onClick={() => onDeleteRoutine(routine.id)} style={deleteBtnStyle}>Delete</button>
              </div>
            </Card>
          );
        })}
      </div>

      <Fab
        onClick={() => setShowAddForm(true)}
        color="var(--color-primary)"
        label="Add routine"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      />
    </div>
  );
}
