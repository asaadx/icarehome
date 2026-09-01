import { Fragment } from "react";
import type { Appointment, Medication, Symptom, LogEntry } from "../../types/domain";
import { PATIENT } from "../../data/seed";
import { TYPE_CONFIG } from "../../lib/logTypeConfig";
import { formatDate, daysUntil } from "../../lib/date";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import SeverityBar from "../ui/SeverityBar";

export default function DashboardScreen({
  medications,
  appointments,
  symptoms,
  log,
}: {
  medications: Medication[];
  appointments: Appointment[];
  symptoms: Symptom[];
  log: LogEntry[];
}) {
  const allDoses = medications.flatMap((m) => m.todayDoses);
  const given = allDoses.filter((d) => d.given).length;
  const pending = allDoses.length - given;
  const pct = Math.round((given / allDoses.length) * 100);
  const pendingMeds = medications.filter((m) => m.todayDoses.some((d) => !d.given));
  const nextAppointment = appointments
    .filter((a) => a.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Patient banner */}
      <Card style={{ background: "var(--color-primary)", color: "#fff" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
            {PATIENT.name.split(" ").map((w) => w[0]).join("")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>{PATIENT.name}</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Age {PATIENT.age} · {PATIENT.conditions.join(" · ")}</div>
          </div>
        </div>
        {PATIENT.allergies.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.3)", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>⚠ Allergic to:</span>
            {PATIENT.allergies.map((a) => (
              <Pill key={a} label={a} color="var(--color-danger)" bg="#fff" />
            ))}
          </div>
        )}
        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 500 }}>Primary doctor: {PATIENT.primaryDoctor}</div>
      </Card>

      {/* Medication progress */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Today's medications</div>
            <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginTop: 2 }}>
              {given} of {allDoses.length} doses given
              {pending > 0 && <span style={{ color: "var(--color-warning)", fontWeight: 500 }}> · {pending} left</span>}
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: pct === 100 ? "var(--color-success)" : "var(--color-foreground)" }}>{pct}%</div>
        </div>
        <div style={{ height: 8, background: "var(--color-muted)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--color-success)" : "var(--color-primary)", borderRadius: 4, transition: "width 0.4s" }} />
        </div>
        {pendingMeds.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {pendingMeds.map((med) =>
              med.todayDoses.filter((d) => !d.given).map((dose, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid var(--color-border)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-warning)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{med.name}</span>
                    <span style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginLeft: 6 }}>{med.dose}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{dose.time}</span>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      {/* Next appointment */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Next Appointment</div>
        {nextAppointment ? (
          <>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{nextAppointment.provider}</div>
            <div style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>{nextAppointment.specialty} · {nextAppointment.location}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Pill label={formatDate(nextAppointment.date)} color="var(--color-primary)" bg="var(--color-secondary)" />
              {(() => {
                const days = daysUntil(nextAppointment.date);
                return (
                  <Pill
                    label={days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
                    color={days <= 7 ? "var(--color-warning)" : "var(--color-primary)"}
                    bg={days <= 7 ? "var(--color-warning-bg)" : "var(--color-secondary)"}
                  />
                );
              })()}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "var(--color-muted-foreground)", background: "var(--color-muted)", padding: "8px 10px", borderRadius: 8 }}>
              {nextAppointment.prepNotes || "No prep notes yet."}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>No upcoming appointments</div>
        )}
      </Card>

      {/* Recent observations */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Recent Observations</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {symptoms.slice(0, 3).map((s) => (
            <Card key={s.id} style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{s.symptom}</div>
                  <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{s.date} · {s.loggedBy}</div>
                </div>
                <SeverityBar level={s.severity} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent log */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Recent Activity</div>
        <div style={{ display: "grid", gridTemplateColumns: "max-content 1fr", columnGap: 12, alignItems: "start" }}>
          {log.slice(0, 5).map((entry, i) => {
            const tc = TYPE_CONFIG[entry.type];
            return (
              <Fragment key={entry.id}>
                <div style={{ paddingTop: 14, paddingBottom: 12 }}>
                  <Pill label={tc.label} color={tc.color} bg={tc.bg} />
                </div>
                <div style={{ paddingTop: 12, paddingBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 1 }}>{entry.title}</div>
                  <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{entry.time} · {entry.loggedBy}</div>
                </div>
                {i < 4 && <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid var(--color-border)" }} />}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
