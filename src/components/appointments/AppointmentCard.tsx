import { useState } from "react";
import type { CSSProperties } from "react";
import type { Appointment } from "../../types/domain";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import { formatDate, daysUntil } from "../../lib/date";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid var(--color-primary)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  background: "var(--color-background)",
  color: "var(--color-foreground)",
  resize: "vertical",
  outline: "none",
  lineHeight: 1.5,
};

const saveBtnStyle: CSSProperties = {
  padding: "12px 20px",
  background: "var(--color-primary)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: 44,
};

const cancelBtnStyle: CSSProperties = {
  padding: "12px 20px",
  background: "transparent",
  border: "1.5px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  color: "var(--color-muted-foreground)",
  fontFamily: "inherit",
  minHeight: 44,
};

const editBtnStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--color-primary)",
  background: "var(--color-secondary)",
  border: "none",
  cursor: "pointer",
  padding: "7px 14px",
  borderRadius: 20,
  fontFamily: "inherit",
  minHeight: 34,
};

const completeApptBtnStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--color-success)",
  background: "var(--color-success-bg)",
  border: "none",
  cursor: "pointer",
  padding: "7px 14px",
  borderRadius: 20,
  fontFamily: "inherit",
  minHeight: 34,
};

const cancelApptBtnStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--color-danger)",
  background: "var(--color-danger-bg)",
  border: "none",
  cursor: "pointer",
  padding: "7px 14px",
  borderRadius: 20,
  fontFamily: "inherit",
  minHeight: 34,
};

export default function AppointmentCard({
  appt,
  onSavePrepNotes,
  onSaveOutcomeNotes,
  onEdit,
  onComplete,
  onCancelAppt,
}: {
  appt: Appointment;
  onSavePrepNotes: (id: string, text: string) => void;
  onSaveOutcomeNotes: (id: string, text: string) => void;
  onEdit: (id: string) => void;
  onComplete: (id: string) => void;
  onCancelAppt: (id: string) => void;
}) {
  const days = daysUntil(appt.date);
  const isPast = appt.status === "completed" || appt.status === "cancelled";

  const [editingPrep, setEditingPrep] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState(false);
  const [prepDraft, setPrepDraft] = useState(appt.prepNotes);
  const [outcomeDraft, setOutcomeDraft] = useState(appt.outcomeNotes);

  return (
    <Card style={{ borderLeft: `3px solid ${isPast ? "var(--color-border)" : "var(--color-primary)"}` }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{appt.provider}</div>
            <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{appt.specialty}</div>
          </div>
          <button onClick={() => onEdit(appt.id)} style={editBtnStyle}>Edit</button>
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

      {!isPast && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => onComplete(appt.id)} style={completeApptBtnStyle}>Mark completed</button>
          <button onClick={() => onCancelAppt(appt.id)} style={cancelApptBtnStyle}>Cancel</button>
        </div>
      )}

      {/* Prep / questions section */}
      <div style={{ marginBottom: isPast ? 14 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {isPast ? "Questions we brought" : "Questions to bring"}
          </span>
          {!editingPrep && (
            <button
              onClick={() => { setPrepDraft(appt.prepNotes); setEditingPrep(true); }}
              style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)", background: "var(--color-secondary)", border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 20, fontFamily: "inherit", minHeight: 34 }}
            >
              {appt.prepNotes ? "Edit" : "+ Add"}
            </button>
          )}
        </div>

        {editingPrep ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <textarea
              autoFocus
              rows={4}
              value={prepDraft}
              onChange={(e) => setPrepDraft(e.target.value)}
              placeholder="What do you want to ask or discuss at this appointment?"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={saveBtnStyle} onClick={() => { onSavePrepNotes(appt.id, prepDraft); setEditingPrep(false); }}>Save</button>
              <button style={cancelBtnStyle} onClick={() => setEditingPrep(false)}>Cancel</button>
            </div>
          </div>
        ) : appt.prepNotes ? (
          <div style={{ fontSize: 14, background: "var(--color-muted)", padding: "10px 12px", borderRadius: 8, lineHeight: 1.6, color: "var(--color-foreground)", whiteSpace: "pre-wrap" }}>
            {appt.prepNotes}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", fontStyle: "italic" }}>
            No questions added yet. Tap "Add" to write what you want to discuss.
          </div>
        )}
      </div>

      {/* Outcome notes — only for past appointments */}
      {isPast && (
        <div style={{ paddingTop: 14, borderTop: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Results
            </span>
            {!editingOutcome && (
              <button
                onClick={() => { setOutcomeDraft(appt.outcomeNotes); setEditingOutcome(true); }}
                style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)", background: "var(--color-secondary)", border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 20, fontFamily: "inherit", minHeight: 34 }}
              >
                {appt.outcomeNotes ? "Edit" : "+ Add"}
              </button>
            )}
          </div>

          {editingOutcome ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <textarea
                autoFocus
                rows={5}
                value={outcomeDraft}
                onChange={(e) => setOutcomeDraft(e.target.value)}
                placeholder="What did the doctor say? Any changes to medications, referrals, follow-ups, or advice?"
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button style={saveBtnStyle} onClick={() => { onSaveOutcomeNotes(appt.id, outcomeDraft); setEditingOutcome(false); }}>Save</button>
                <button style={cancelBtnStyle} onClick={() => setEditingOutcome(false)}>Cancel</button>
              </div>
            </div>
          ) : appt.outcomeNotes ? (
            <div style={{ fontSize: 14, background: "var(--color-info-bg)", padding: "10px 12px", borderRadius: 8, lineHeight: 1.6, color: "var(--color-foreground)", whiteSpace: "pre-wrap" }}>
              {appt.outcomeNotes}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", fontStyle: "italic" }}>
              No notes yet. Tap "+ Add" to record what was discussed.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
