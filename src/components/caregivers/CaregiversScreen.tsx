import { useState } from "react";
import type { Caregiver } from "../../types/domain";
import type { CaregiverInput } from "../../hooks/useCaregivers";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Pill from "../ui/Pill";
import Fab from "../ui/Fab";
import ActionButton from "../ui/ActionButton";
import { PencilIcon, TrashIcon } from "../ui/icons";
import CaregiverForm from "./CaregiverForm";

export default function CaregiversScreen({
  caregivers,
  onAddCaregiver,
  onUpdateCaregiver,
  onDeleteCaregiver,
}: {
  caregivers: Caregiver[];
  onAddCaregiver: (input: CaregiverInput) => void;
  onUpdateCaregiver: (id: string, input: CaregiverInput) => void;
  onDeleteCaregiver: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const sel = caregivers.find((c) => c.id === selected);

  function handleAdd(input: CaregiverInput) {
    onAddCaregiver(input);
    setShowAddForm(false);
  }

  function handleSave(id: string, input: CaregiverInput) {
    onUpdateCaregiver(id, input);
    setEditingId(null);
  }

  function handleDelete(caregiver: Caregiver) {
    if (window.confirm(`Remove ${caregiver.name} from your care team? This cannot be undone.`)) {
      onDeleteCaregiver(caregiver.id);
    }
  }

  return (
    <div>
      <PageHeader title="Care Team" subtitle="Family, aides, and physicians" />

      {showAddForm && <CaregiverForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {caregivers.map((c) => {
          if (editingId === c.id) {
            return <CaregiverForm key={c.id} caregiver={c} onSave={handleSave} onCancel={() => setEditingId(null)} />;
          }

          return (
            <Card
              key={c.id}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              style={{ borderColor: selected === c.id ? "var(--color-primary)" : undefined, border: selected === c.id ? "1.5px solid var(--color-primary)" : undefined }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <Avatar initials={c.initials} color={c.color} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{c.role}</div>
                  <div style={{ fontSize: 12, color: "var(--color-muted-foreground)", marginTop: 2 }}>{c.schedule}</div>
                </div>
                <Pill label={c.relationship} color="var(--color-muted-foreground)" bg="var(--color-muted)" />
              </div>

              {selected === c.id && sel && sel.id === c.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", width: 64, flexShrink: 0 }}>Phone</div>
                    <a href={`tel:${c.phone.replace(/\D/g, "")}`} style={{ fontSize: 15, color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>{c.phone}</a>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", width: 64, flexShrink: 0 }}>Email</div>
                    <a href={`mailto:${c.email}`} style={{ fontSize: 15, color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>{c.email}</a>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", width: 64, flexShrink: 0, paddingTop: 1 }}>Schedule</div>
                    <div style={{ fontSize: 15 }}>{c.schedule}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                    <ActionButton icon={<PencilIcon size={16} />} label="Edit" tone="primary" mode="icon-text" onClick={() => setEditingId(c.id)} />
                    <ActionButton icon={<TrashIcon size={16} />} label="Remove" tone="danger" mode="icon-text" onClick={() => handleDelete(c)} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Fab
        onClick={() => setShowAddForm(true)}
        color="var(--color-primary)"
        label="Add caregiver"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      />
    </div>
  );
}
