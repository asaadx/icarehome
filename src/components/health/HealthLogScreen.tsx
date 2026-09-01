import { useEffect, useState } from "react";
import type { Symptom, Incident, HealthEvent } from "../../types/domain";
import type { NewSymptomInput, NewIncidentInput } from "../../hooks/useHealthEvents";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import SeverityBar from "../ui/SeverityBar";
import Fab from "../ui/Fab";
import ActionButton from "../ui/ActionButton";
import { PencilIcon, TrashIcon } from "../ui/icons";
import { formatDate, eventTimestamp } from "../../lib/date";
import { kindToggleStyle } from "./kindToggleStyle";
import SymptomForm from "./SymptomForm";
import IncidentForm from "./IncidentForm";

const sevConfig: Record<string, { color: string; bg: string }> = {
  minor: { color: "var(--color-muted-foreground)", bg: "var(--color-muted)" },
  moderate: { color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  serious: { color: "var(--color-danger)", bg: "var(--color-danger-bg)" },
};

export default function HealthLogScreen({
  symptoms,
  incidents,
  onAddSymptom,
  onAddIncident,
  onUpdateSymptom,
  onDeleteSymptom,
  onUpdateIncident,
  onDeleteIncident,
  autoOpenKind,
  onAutoOpenHandled,
}: {
  symptoms: Symptom[];
  incidents: Incident[];
  onAddSymptom: (input: NewSymptomInput) => void;
  onAddIncident: (input: NewIncidentInput) => void;
  onUpdateSymptom: (id: string, input: NewSymptomInput) => void;
  onDeleteSymptom: (id: string) => void;
  onUpdateIncident: (id: string, input: NewIncidentInput) => void;
  onDeleteIncident: (id: string) => void;
  autoOpenKind: "symptom" | "incident" | null;
  onAutoOpenHandled: () => void;
}) {
  const [showForm, setShowForm] = useState(autoOpenKind !== null);
  const [kind, setKind] = useState<"symptom" | "incident">(autoOpenKind ?? "symptom");
  const [editingEvent, setEditingEvent] = useState<HealthEvent | null>(null);

  useEffect(() => {
    if (autoOpenKind) onAutoOpenHandled();
    // Only consume the mount-time signal once; kind/showForm are seeded above, not re-derived on prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const events: HealthEvent[] = [
    ...symptoms.map((s) => ({ ...s, kind: "symptom" as const })),
    ...incidents.map((i) => ({ ...i, kind: "incident" as const })),
  ].sort((a, b) => eventTimestamp(b.date, b.time) - eventTimestamp(a.date, a.time));

  function handleSymptomSubmit(input: NewSymptomInput) {
    onAddSymptom(input);
    setShowForm(false);
  }

  function handleIncidentSubmit(input: NewIncidentInput) {
    onAddIncident(input);
    setShowForm(false);
  }

  function handleSymptomSave(id: string, input: NewSymptomInput) {
    onUpdateSymptom(id, input);
    setEditingEvent(null);
  }

  function handleIncidentSave(id: string, input: NewIncidentInput) {
    onUpdateIncident(id, input);
    setEditingEvent(null);
  }

  function handleDelete(ev: HealthEvent) {
    if (ev.kind === "symptom") {
      onDeleteSymptom(ev.id);
    } else {
      onDeleteIncident(ev.id);
    }
  }

  return (
    <div>
      <PageHeader
        title="Health"
        subtitle="Symptoms, illness changes, and one-off incidents"
      />

      {showForm && !editingEvent && (
        <Card style={{ marginBottom: 20, border: "1.5px solid " + (kind === "incident" ? "var(--color-danger)" : "var(--color-primary)") }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>New Entry</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button type="button" onClick={() => setKind("symptom")} style={kindToggleStyle(kind === "symptom", false)}>Observation</button>
            <button type="button" onClick={() => setKind("incident")} style={kindToggleStyle(kind === "incident", true)}>Incident</button>
          </div>

          {kind === "symptom" ? (
            <SymptomForm onSubmit={handleSymptomSubmit} onCancel={() => setShowForm(false)} />
          ) : (
            <IncidentForm onSubmit={handleIncidentSubmit} onCancel={() => setShowForm(false)} />
          )}
        </Card>
      )}

      {editingEvent && (
        <Card style={{ marginBottom: 20, border: "1.5px solid " + (editingEvent.kind === "incident" ? "var(--color-danger)" : "var(--color-primary)") }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Edit Entry</div>
          {editingEvent.kind === "symptom" ? (
            <SymptomForm symptom={editingEvent} onSave={handleSymptomSave} onCancel={() => setEditingEvent(null)} />
          ) : (
            <IncidentForm incident={editingEvent} onSave={handleIncidentSave} onCancel={() => setEditingEvent(null)} />
          )}
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {events.map((ev) =>
          ev.kind === "symptom" ? (
            <Card key={`symptom-${ev.id}`} style={{ borderLeft: "3px solid var(--color-primary)" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <Pill label="Observation" color="var(--color-primary)" bg="var(--color-secondary)" />
                <Pill label={ev.category} color="var(--color-muted-foreground)" bg="var(--color-muted)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{ev.symptom}</div>
              <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginBottom: 8 }}>{formatDate(ev.date)} · {ev.time} · {ev.loggedBy}</div>
              <SeverityBar level={ev.severity} showLabel />
              {ev.notes && <div style={{ fontSize: 14, color: "var(--color-muted-foreground)", marginTop: 8, lineHeight: 1.5 }}>{ev.notes}</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <ActionButton icon={<PencilIcon size={16} />} label="Edit" tone="primary" mode="icon-text" onClick={() => setEditingEvent(ev)} />
                <ActionButton icon={<TrashIcon size={16} />} label="Delete" tone="danger" mode="icon-text" onClick={() => handleDelete(ev)} />
              </div>
            </Card>
          ) : (
            <Card key={`incident-${ev.id}`} style={{ borderLeft: `3px solid ${sevConfig[ev.severity].color}` }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <Pill label="Incident" color={sevConfig[ev.severity].color} bg={sevConfig[ev.severity].bg} />
                <Pill label={ev.type} color={sevConfig[ev.severity].color} bg={sevConfig[ev.severity].bg} />
                <Pill label={ev.severity.charAt(0).toUpperCase() + ev.severity.slice(1)} color={sevConfig[ev.severity].color} bg={sevConfig[ev.severity].bg} />
                {ev.doctorNotified && <Pill label="Doctor notified" color="var(--color-success)" bg="var(--color-success-bg)" />}
              </div>
              <div style={{ fontSize: 14, color: "var(--color-muted-foreground)", marginBottom: 8 }}>{formatDate(ev.date)} · {ev.time} · {ev.loggedBy}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>{ev.description}</div>
              <div style={{ background: "var(--color-muted)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Response</div>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{ev.response}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <ActionButton icon={<PencilIcon size={16} />} label="Edit" tone="primary" mode="icon-text" onClick={() => setEditingEvent(ev)} />
                <ActionButton icon={<TrashIcon size={16} />} label="Delete" tone="danger" mode="icon-text" onClick={() => handleDelete(ev)} />
              </div>
            </Card>
          )
        )}
      </div>

      <Fab
        onClick={() => setShowForm(!showForm)}
        color="var(--color-primary)"
        label="Log a symptom or incident"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      />
    </div>
  );
}
