import { useState } from "react";
import type { Medication } from "../../types/domain";
import type { MedicationInput, NewMedicationInput } from "../../hooks/useMedications";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import CheckCircle from "../ui/CheckCircle";
import Fab from "../ui/Fab";
import ActionButton from "../ui/ActionButton";
import { PencilIcon, TrashIcon } from "../ui/icons";
import MedicationForm from "./MedicationForm";

export default function MedicationsScreen({
  medications,
  onToggleDose,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
}: {
  medications: Medication[];
  onToggleDose: (medId: string, doseIndex: number) => void;
  onAddMedication: (input: NewMedicationInput) => void;
  onUpdateMedication: (id: string, input: MedicationInput) => void;
  onDeleteMedication: (id: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const allDoses = medications.flatMap((m) => m.todayDoses);
  const given = allDoses.filter((d) => d.given).length;
  const pct = Math.round((given / allDoses.length) * 100);

  function handleAdd(input: NewMedicationInput) {
    onAddMedication(input);
    setShowAddForm(false);
  }

  function handleSave(id: string, input: MedicationInput) {
    onUpdateMedication(id, input);
    setEditingId(null);
  }

  function handleDelete(med: Medication) {
    if (window.confirm(`Discontinue ${med.name}? This cannot be undone.`)) {
      onDeleteMedication(med.id);
    }
  }

  return (
    <div>
      <PageHeader title="Medications" subtitle={`${given} of ${allDoses.length} doses given today`} />

      {showAddForm && <MedicationForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>Today's progress</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: pct === 100 ? "var(--color-success)" : "var(--color-foreground)" }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "var(--color-muted)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--color-success)" : "var(--color-primary)", borderRadius: 4, transition: "width 0.4s" }} />
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {medications.map((med) => {
          if (editingId === med.id) {
            return <MedicationForm key={med.id} medication={med} onSave={handleSave} onCancel={() => setEditingId(null)} />;
          }

          const givenCount = med.todayDoses.filter((d) => d.given).length;
          const allGiven = givenCount === med.todayDoses.length;
          return (
            <Card key={med.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{med.name}</div>
                    <ActionButton icon={<PencilIcon size={13} />} label="Edit" tone="primary" mode="icon" size={24} onClick={() => setEditingId(med.id)} />
                  </div>
                  <div style={{ fontSize: 14, color: "var(--color-muted-foreground)", marginTop: 2 }}>{med.dose} · {med.purpose}</div>
                </div>
                {allGiven && <Pill label="Done" color="var(--color-success)" bg="var(--color-success-bg)" />}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginBottom: 12 }}>
                {med.schedule} · {med.prescriber}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {med.todayDoses.map((dose, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: dose.given ? "var(--color-success-bg)" : "var(--color-muted)", borderRadius: 8 }}
                  >
                    <CheckCircle checked={dose.given} onChange={() => onToggleDose(med.id, i)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{dose.time}</div>
                      {dose.given && dose.givenBy && (
                        <div style={{ fontSize: 13, color: "var(--color-success)", marginTop: 2 }}>Given by {dose.givenBy}</div>
                      )}
                      {!dose.given && <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginTop: 2 }}>Pending</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <ActionButton icon={<TrashIcon size={16} />} label="Discontinue" tone="danger" mode="icon-text" onClick={() => handleDelete(med)} />
              </div>
            </Card>
          );
        })}
      </div>

      <Fab
        onClick={() => setShowAddForm(true)}
        color="var(--color-primary)"
        label="Add medication"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      />
    </div>
  );
}
