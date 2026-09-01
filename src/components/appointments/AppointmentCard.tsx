import type { Appointment } from "../../types/domain";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import ActionButton from "../ui/ActionButton";
import { PencilIcon, CheckIcon, XIcon } from "../ui/icons";
import { formatDate, daysUntil } from "../../lib/date";

export default function AppointmentCard({
  appt,
  onEdit,
  onComplete,
  onCancelAppt,
}: {
  appt: Appointment;
  onEdit: (id: string) => void;
  onComplete: (id: string) => void;
  onCancelAppt: (id: string) => void;
}) {
  const days = daysUntil(appt.date);
  const isPast = appt.status === "completed" || appt.status === "cancelled";

  return (
    <Card style={{ borderLeft: `3px solid ${isPast ? "var(--color-border)" : "var(--color-primary)"}` }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{appt.provider}</div>
            <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{appt.specialty}</div>
          </div>
          <ActionButton icon={<PencilIcon size={16} />} label="Edit" tone="primary" mode="icon-text" onClick={() => onEdit(appt.id)} />
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: !isPast && days <= 7 ? "var(--color-danger)" : "var(--color-foreground)" }}>
            {formatDate(appt.date)}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>{appt.time}</div>
        </div>
      </div>

      {/* Status pill + location */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        {isPast
          ? <Pill label="Completed" color="var(--color-success)" bg="var(--color-success-bg)" />
          : <Pill label={days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`} color={days <= 7 ? "var(--color-warning)" : "var(--color-primary)"} bg={days <= 7 ? "var(--color-warning-bg)" : "var(--color-secondary)"} />
        }
        <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{appt.location}</span>
      </div>

      {/* Prep / questions section — read-only, edited via the appointment-level Edit button above */}
      <div style={{ marginBottom: isPast ? 14 : 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          {isPast ? "Questions we brought" : "Questions to bring"}
        </div>
        {appt.prepNotes ? (
          <div style={{ fontSize: 14, background: "var(--color-muted)", padding: "10px 12px", borderRadius: 8, lineHeight: 1.6, color: "var(--color-foreground)", whiteSpace: "pre-wrap" }}>
            {appt.prepNotes}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", fontStyle: "italic" }}>
            No questions added yet. Tap Edit to write what you want to discuss.
          </div>
        )}
      </div>

      {/* Complete/cancel — footer, below prep notes */}
      {!isPast && (
        <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--color-border)" }}>
          <ActionButton icon={<CheckIcon size={16} />} label="Completed" tone="success" mode="icon-text" onClick={() => onComplete(appt.id)} />
          <ActionButton icon={<XIcon size={16} />} label="Cancel" tone="danger" mode="icon-text" onClick={() => { if (window.confirm(`Cancel the appointment with ${appt.provider}? This cannot be undone.`)) onCancelAppt(appt.id); }} />
        </div>
      )}

      {/* Outcome notes — only for past appointments, read-only, edited via the appointment-level Edit button above */}
      {isPast && (
        <div style={{ paddingTop: 14, borderTop: "1px solid var(--color-border)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Results
          </div>
          {appt.outcomeNotes ? (
            <div style={{ fontSize: 14, background: "var(--color-info-bg)", padding: "10px 12px", borderRadius: 8, lineHeight: 1.6, color: "var(--color-foreground)", whiteSpace: "pre-wrap" }}>
              {appt.outcomeNotes}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", fontStyle: "italic" }}>
              No notes yet. Tap Edit to record what was discussed.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
