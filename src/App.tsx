import { useState } from "react";

type Screen = "dashboard" | "log" | "medications" | "appointments" | "caregivers" | "routines" | "symptoms" | "incidents";

interface Medication {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  prescriber: string;
  purpose: string;
  todayDoses: { time: string; given: boolean; givenBy?: string }[];
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  specialty: string;
  location: string;
  prepNotes: string;
  outcomeNotes: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface Caregiver {
  id: string;
  name: string;
  role: string;
  relationship: string;
  phone: string;
  email: string;
  schedule: string;
  initials: string;
  color: string;
}

interface Routine {
  id: string;
  time: string;
  title: string;
  category: "morning" | "afternoon" | "evening" | "night";
  notes: string;
  assignedTo: string;
}

interface Symptom {
  id: string;
  date: string;
  time: string;
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  loggedBy: string;
  category: string;
}

interface Incident {
  id: string;
  date: string;
  time: string;
  type: string;
  severity: "minor" | "moderate" | "serious";
  description: string;
  response: string;
  loggedBy: string;
  doctorNotified: boolean;
}

interface LogEntry {
  id: string;
  date: string;
  time: string;
  type: "medication" | "symptom" | "incident" | "appointment" | "note" | "routine";
  title: string;
  detail: string;
  loggedBy: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATIENT = {
  name: "Eleanor Marsh",
  age: 76,
  dob: "March 14, 1948",
  conditions: ["Parkinson's Disease (Moderate)", "Type 2 Diabetes"],
  allergies: ["Penicillin", "Sulfa drugs"],
  primaryDoctor: "Dr. Anita Rosen, MD — Neurology",
  bloodType: "A+",
};

const initialMedications: Medication[] = [
  {
    id: "m1",
    name: "Carbidopa-Levodopa",
    dose: "25/100 mg",
    schedule: "3× daily — 7 AM, 12 PM, 5 PM",
    prescriber: "Dr. Anita Rosen",
    purpose: "Parkinson's motor symptoms",
    todayDoses: [
      { time: "7:00 AM", given: true, givenBy: "Margaret" },
      { time: "12:00 PM", given: true, givenBy: "Yolanda" },
      { time: "5:00 PM", given: false },
    ],
  },
  {
    id: "m2",
    name: "Metformin",
    dose: "500 mg",
    schedule: "2× daily — with meals",
    prescriber: "Dr. Samuel Okonkwo",
    purpose: "Type 2 Diabetes",
    todayDoses: [
      { time: "8:00 AM", given: true, givenBy: "Margaret" },
      { time: "6:30 PM", given: false },
    ],
  },
  {
    id: "m3",
    name: "Ropinirole",
    dose: "1 mg",
    schedule: "Once daily — bedtime",
    prescriber: "Dr. Anita Rosen",
    purpose: "Sleep & tremor support",
    todayDoses: [{ time: "9:00 PM", given: false }],
  },
  {
    id: "m4",
    name: "Lisinopril",
    dose: "5 mg",
    schedule: "Once daily — morning",
    prescriber: "Dr. Samuel Okonkwo",
    purpose: "Blood pressure",
    todayDoses: [{ time: "7:00 AM", given: true, givenBy: "Margaret" }],
  },
  {
    id: "m5",
    name: "Vitamin D3",
    dose: "2000 IU",
    schedule: "Once daily — with lunch",
    prescriber: "Dr. Anita Rosen",
    purpose: "Bone health",
    todayDoses: [{ time: "12:00 PM", given: true, givenBy: "Yolanda" }],
  },
];

const initialAppointments: Appointment[] = [
  {
    id: "a1",
    date: "2026-09-03",
    time: "10:30 AM",
    provider: "Dr. Anita Rosen",
    specialty: "Neurology",
    location: "Mass General Hospital, Neurology Dept., Rm 4B",
    prepNotes: "Quarterly Parkinson's review. Bring tremor journal. Discuss increased freezing episodes in doorways. Ask about adjusting noon dose timing.",
    outcomeNotes: "",
    status: "upcoming",
  },
  {
    id: "a2",
    date: "2026-09-11",
    time: "2:00 PM",
    provider: "Dr. Samuel Okonkwo",
    specialty: "Internal Medicine",
    location: "Cambridge Family Health, Suite 201",
    prepNotes: "A1C recheck. Last reading 7.4 in June — goal is under 7.0. Bring glucose log printout.",
    outcomeNotes: "",
    status: "upcoming",
  },
  {
    id: "a3",
    date: "2026-09-18",
    time: "11:00 AM",
    provider: "Patricia Lee, PT",
    specialty: "Physical Therapy",
    location: "Spaulding Rehab, 125 Nashua St",
    prepNotes: "Balance and gait training — session 8 of 12. Mention that the afternoon walk has been harder lately.",
    outcomeNotes: "",
    status: "upcoming",
  },
  {
    id: "a4",
    date: "2026-08-12",
    time: "9:00 AM",
    provider: "Dr. Anita Rosen",
    specialty: "Neurology",
    location: "Mass General Hospital",
    prepNotes: "Post-fall follow-up. Hip is recovering. Ask about fall prevention strategies.",
    outcomeNotes: "Dr. Rosen examined the hip — no fracture, soft tissue bruising only. Discussed fall risk. Recommended adding a second grab bar in the bathroom and referred to Spaulding PT for balance training (see Sep 18 appt). No medication changes. Next quarterly review scheduled for Sep 3.",
    status: "completed",
  },
  {
    id: "a5",
    date: "2026-07-22",
    time: "2:00 PM",
    provider: "Dr. Samuel Okonkwo",
    specialty: "Internal Medicine",
    location: "Cambridge Family Health, Suite 201",
    prepNotes: "Routine check-in. Ask about the hypoglycemic episode on July 18.",
    outcomeNotes: "A1C came back at 7.4 — slightly high, targeting 7.0 by fall. Dr. Okonkwo reviewed the July 18 hypo episode. Adjusted Metformin timing: now to be given strictly with meals, not just around meal times. Ordered a repeat A1C in 6 weeks. No other changes.",
    status: "completed",
  },
];

const caregivers: Caregiver[] = [
  { id: "c1", name: "Margaret Marsh", role: "Primary Family Caregiver", relationship: "Daughter", phone: "(617) 555-0142", email: "margaret.marsh@email.com", schedule: "Weekends + evenings", initials: "MM", color: "#1A6EBF" },
  { id: "c2", name: "Thomas Marsh", role: "Family Caregiver", relationship: "Son", phone: "(617) 555-0187", email: "t.marsh@email.com", schedule: "Tuesday evenings, alternating Sundays", initials: "TM", color: "#1A7A45" },
  { id: "c3", name: "Yolanda Cruz", role: "Home Health Aide", relationship: "Professional", phone: "(617) 555-0234", email: "yolanda@carehome.com", schedule: "Mon–Fri, 9 AM–3 PM", initials: "YC", color: "#7A3FA0" },
  { id: "c4", name: "Dr. Anita Rosen", role: "Neurologist", relationship: "Physician", phone: "(617) 555-0300", email: "a.rosen@mgh.org", schedule: "Appointments only", initials: "AR", color: "#B91C1C" },
  { id: "c5", name: "Dr. Samuel Okonkwo", role: "Internal Medicine", relationship: "Physician", phone: "(617) 555-0401", email: "s.okonkwo@cfh.org", schedule: "Appointments only", initials: "SO", color: "#9A5700" },
];

const routines: Routine[] = [
  { id: "r1", time: "7:00 AM", title: "Morning medications", category: "morning", notes: "Carbidopa-Levodopa + Lisinopril. Give on empty stomach, 30 min before breakfast.", assignedTo: "Margaret / Yolanda" },
  { id: "r2", time: "7:30 AM", title: "Breakfast + blood sugar check", category: "morning", notes: "Target fasting glucose 100–140 mg/dL. Record reading in care log.", assignedTo: "Yolanda / Margaret" },
  { id: "r3", time: "8:00 AM", title: "Metformin with breakfast", category: "morning", notes: "Give with food to reduce GI side effects.", assignedTo: "Yolanda / Margaret" },
  { id: "r4", time: "9:00 AM", title: "Morning hygiene and dressing", category: "morning", notes: "Allow extra time — tremor worse before medication kicks in (~60 min). Adaptive clothing in top drawer.", assignedTo: "Yolanda" },
  { id: "r5", time: "10:00 AM", title: "Seated exercises / stretching", category: "morning", notes: "15 min PT routine from sheet on fridge. Ankle circles and shoulder rolls.", assignedTo: "Yolanda" },
  { id: "r6", time: "12:00 PM", title: "Lunch + noon medications", category: "afternoon", notes: "Carbidopa-Levodopa dose 2. Give 30 min before eating. Add Vitamin D3 with the meal.", assignedTo: "Yolanda" },
  { id: "r7", time: "2:00 PM", title: "Rest period", category: "afternoon", notes: "Nap or quiet activity. Do not skip — fatigue worsens afternoon tremors.", assignedTo: "Yolanda" },
  { id: "r8", time: "4:00 PM", title: "Afternoon walk", category: "afternoon", notes: "15–20 min with rollator on flat path. Two-person assist on bad tremor days.", assignedTo: "Yolanda / Margaret" },
  { id: "r9", time: "5:00 PM", title: "Evening Carbidopa-Levodopa", category: "evening", notes: "Dose 3 of 3. Check her fatigue level — freezing more common when tired.", assignedTo: "Margaret / Yolanda" },
  { id: "r10", time: "6:30 PM", title: "Dinner + Metformin", category: "evening", notes: "Soft foods preferred. No liquids without thickener.", assignedTo: "Margaret" },
  { id: "r11", time: "8:00 PM", title: "Evening blood sugar check", category: "evening", notes: "Target post-dinner under 180 mg/dL. Record in care log.", assignedTo: "Margaret" },
  { id: "r12", time: "9:00 PM", title: "Bedtime routine + Ropinirole", category: "night", notes: "Teeth brushing, face wash, bed transfer. Give Ropinirole at lights out.", assignedTo: "Margaret" },
];

const initialSymptoms: Symptom[] = [
  { id: "s1", date: "2026-08-26", time: "9:15 AM", symptom: "Freezing episode", severity: 3, notes: "Brief freeze at kitchen doorway, lasted ~10 seconds. Resolved with verbal cuing.", loggedBy: "Yolanda Cruz", category: "Motor" },
  { id: "s2", date: "2026-08-26", time: "7:45 AM", symptom: "Elevated fasting glucose", severity: 2, notes: "158 mg/dL — higher than usual. Ate earlier than normal the previous evening.", loggedBy: "Margaret Marsh", category: "Diabetes" },
  { id: "s3", date: "2026-08-25", time: "3:00 PM", symptom: "Increased right-hand tremor", severity: 3, notes: "Notably worse in the afternoon. Skipped nap — possible fatigue factor.", loggedBy: "Yolanda Cruz", category: "Motor" },
  { id: "s4", date: "2026-08-24", time: "8:00 PM", symptom: "Confusion at dinner", severity: 4, notes: "Asked where she was twice. Resolved in ~20 min. Monitoring for possible UTI.", loggedBy: "Margaret Marsh", category: "Cognitive" },
  { id: "s5", date: "2026-08-22", time: "11:30 AM", symptom: "Good motor window — positive day", severity: 1, notes: "Excellent coordination and mood mid-morning. Folded laundry independently.", loggedBy: "Yolanda Cruz", category: "Motor" },
];

const initialIncidents: Incident[] = [
  {
    id: "i1", date: "2026-08-04", time: "7:15 PM", type: "Fall", severity: "moderate",
    description: "Fell attempting unassisted transfer from chair to walker. Struck right hip on table edge. No loss of consciousness.",
    response: "Margaret present. Assisted to floor, checked for injury. No fracture apparent. Ice on hip. Monitored 2 hours. Dr. Rosen notified next morning — appointment scheduled Aug 12.",
    loggedBy: "Margaret Marsh", doctorNotified: true,
  },
  {
    id: "i2", date: "2026-07-18", time: "2:45 PM", type: "Hypoglycemia", severity: "moderate",
    description: "Blood sugar 58 mg/dL. Pale, sweating, slightly confused.",
    response: "4 oz orange juice + 3 glucose tablets. Recheck 15 min: 94 mg/dL. Rested. Metformin timing reviewed with Dr. Okonkwo.",
    loggedBy: "Yolanda Cruz", doctorNotified: true,
  },
  {
    id: "i3", date: "2026-06-30", time: "11:00 PM", type: "Missed medication", severity: "minor",
    description: "Evening Carbidopa-Levodopa not given — caregiver handoff miscommunication.",
    response: "Dose skipped (not doubled). Handoff checklist introduced the following week.",
    loggedBy: "Thomas Marsh", doctorNotified: false,
  },
];

const initialLog: LogEntry[] = [
  { id: "l1", date: "2026-08-26", time: "9:15 AM", type: "symptom", title: "Freezing episode", detail: "Brief freeze at kitchen doorway. Resolved with verbal cuing.", loggedBy: "Yolanda Cruz" },
  { id: "l2", date: "2026-08-26", time: "8:00 AM", type: "medication", title: "Morning medications given", detail: "Carbidopa-Levodopa 25/100 mg + Lisinopril 5 mg.", loggedBy: "Margaret Marsh" },
  { id: "l3", date: "2026-08-26", time: "7:45 AM", type: "symptom", title: "Fasting glucose 158 mg/dL", detail: "Slightly elevated. No intervention needed.", loggedBy: "Margaret Marsh" },
  { id: "l4", date: "2026-08-25", time: "5:00 PM", type: "medication", title: "Evening Carbidopa-Levodopa", detail: "Dose 3 of 3 — on schedule.", loggedBy: "Yolanda Cruz" },
  { id: "l5", date: "2026-08-25", time: "3:00 PM", type: "symptom", title: "Increased tremor", detail: "Right hand worse than baseline. Skipped nap — likely a factor.", loggedBy: "Yolanda Cruz" },
  { id: "l6", date: "2026-08-24", time: "8:00 PM", type: "symptom", title: "Confusion at dinner", detail: "Asked location twice. Resolved in ~20 min. Monitoring for UTI.", loggedBy: "Margaret Marsh" },
  { id: "l7", date: "2026-08-12", time: "9:00 AM", type: "appointment", title: "Neurology — Dr. Rosen", detail: "Post-fall check. No medication changes. Next appt: Sep 3.", loggedBy: "Margaret Marsh" },
  { id: "l8", date: "2026-08-04", time: "7:15 PM", type: "incident", title: "Fall — right hip", detail: "Unassisted transfer attempt. No fracture. Dr. Rosen notified.", loggedBy: "Margaret Marsh" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(dateStr: string) {
  const today = new Date("2026-08-26T00:00:00");
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

// ─── Shared Components ────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-foreground)", margin: 0, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "var(--color-muted-foreground)", margin: "4px 0 0", lineHeight: 1.4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "var(--color-card)", borderRadius: "var(--radius)", padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : undefined, ...style }}
    >
      {children}
    </div>
  );
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

const SEVERITY_LABELS = ["", "Very mild", "Mild", "Moderate", "Significant", "Severe"];
const SEVERITY_COLORS = ["", "#1A7A45", "#1A7A45", "#9A5700", "#B91C1C", "#B91C1C"];

function SeverityBar({ level, showLabel = false }: { level: 1 | 2 | 3 | 4 | 5; showLabel?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {[1,2,3,4,5].map((i) => (
          <div key={i} style={{ width: 20, height: 5, borderRadius: 2, background: i <= level ? SEVERITY_COLORS[level] : "var(--color-border)" }} />
        ))}
      </div>
      {showLabel && (
        <span style={{ fontSize: 13, fontWeight: 500, color: SEVERITY_COLORS[level] }}>{SEVERITY_LABELS[level]}</span>
      )}
    </div>
  );
}

function Avatar({ initials, color, size = 40 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "20", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function CheckCircle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 48, height: 48, borderRadius: 12,
        border: checked ? "none" : "2px solid var(--color-border)",
        background: checked ? "var(--color-success)" : "#fff",
        cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s", boxShadow: checked ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {checked
        ? <svg width="22" height="22" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg width="22" height="22" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="var(--color-border)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      }
    </button>
  );
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  medication: { label: "Medication", color: "#1A6EBF", bg: "#EFF5FE" },
  symptom: { label: "Symptom", color: "#9A5700", bg: "#FEF3E2" },
  incident: { label: "Incident", color: "#B91C1C", bg: "#FEF2F2" },
  appointment: { label: "Appointment", color: "#1A7A45", bg: "#E8F5EE" },
  note: { label: "Note", color: "#72737A", bg: "#F0F0F3" },
  routine: { label: "Routine", color: "#72737A", bg: "#F0F0F3" },
};

// ─── Screens ──────────────────────────────────────────────────────────────────

function Dashboard({ medications, symptoms, log }: { medications: Medication[]; symptoms: Symptom[]; log: LogEntry[] }) {
  const allDoses = medications.flatMap((m) => m.todayDoses);
  const given = allDoses.filter((d) => d.given).length;
  const pending = allDoses.length - given;
  const pct = Math.round((given / allDoses.length) * 100);
  const pendingMeds = medications.filter((m) => m.todayDoses.some((d) => !d.given));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Patient banner */}
      <Card style={{ background: "var(--color-primary)", color: "#fff" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{PATIENT.name}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Age {PATIENT.age} · {PATIENT.conditions[0]}</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{PATIENT.conditions[1]}</div>
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
        <div style={{ fontSize: 16, fontWeight: 600 }}>Dr. Anita Rosen</div>
        <div style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>Neurology · Mass General Hospital</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <Pill label="Sep 3 · 10:30 AM" color="var(--color-primary)" bg="var(--color-secondary)" />
          <Pill label="In 8 days" color="var(--color-warning)" bg="var(--color-warning-bg)" />
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: "var(--color-muted-foreground)", background: "var(--color-muted)", padding: "8px 10px", borderRadius: 8 }}>
          Bring tremor journal. Discuss increased freezing episodes.
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {log.slice(0, 5).map((entry, i) => {
            const tc = TYPE_CONFIG[entry.type];
            return (
              <div key={entry.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 4 ? "1px solid var(--color-border)" : "none" }}>
                <Pill label={tc.label} color={tc.color} bg={tc.bg} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 1 }}>{entry.title}</div>
                  <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{entry.time} · {entry.loggedBy}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CareLog({ log }: { log: LogEntry[] }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "medication", "symptom", "incident", "appointment"];
  const filtered = filter === "all" ? log : log.filter((e) => e.type === filter);

  const grouped = filtered.reduce<Record<string, LogEntry[]>>((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Care Log" subtitle="Shared record — everything that happens" />

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "10px 18px", borderRadius: 20, border: "1.5px solid", whiteSpace: "nowrap",
              fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", minHeight: 44,
              borderColor: filter === f ? "var(--color-primary)" : "var(--color-border)",
              background: filter === f ? "var(--color-primary)" : "transparent",
              color: filter === f ? "#fff" : "var(--color-muted-foreground)",
              fontFamily: "inherit",
            }}
          >
            {f === "all" ? "All" : TYPE_CONFIG[f]?.label ?? f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid var(--color-border)" }}>
              {formatDate(date)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {entries.map((entry, i) => {
                const tc = TYPE_CONFIG[entry.type];
                return (
                  <div key={entry.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < entries.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <div style={{ paddingTop: 2 }}>
                      <Pill label={tc.label} color={tc.color} bg={tc.bg} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{entry.title}</div>
                      <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginBottom: 3, lineHeight: 1.4 }}>{entry.detail}</div>
                      <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{entry.time} · {entry.loggedBy}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Medications({ medications, setMedications }: { medications: Medication[]; setMedications: React.Dispatch<React.SetStateAction<Medication[]>> }) {
  function toggleDose(medId: string, doseIndex: number) {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, todayDoses: m.todayDoses.map((d, i) => i === doseIndex ? { ...d, given: !d.given, givenBy: !d.given ? "You" : undefined } : d) }
          : m
      )
    );
  }

  const allDoses = medications.flatMap((m) => m.todayDoses);
  const given = allDoses.filter((d) => d.given).length;
  const pct = Math.round((given / allDoses.length) * 100);

  return (
    <div>
      <PageHeader title="Medications" subtitle={`${given} of ${allDoses.length} doses given today`} />

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
          const givenCount = med.todayDoses.filter((d) => d.given).length;
          const allGiven = givenCount === med.todayDoses.length;
          return (
            <Card key={med.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{med.name}</div>
                  <div style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>{med.dose} · {med.purpose}</div>
                </div>
                {allGiven && <Pill label="Done" color="var(--color-success)" bg="var(--color-success-bg)" />}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginBottom: 12 }}>
                {med.schedule} · {med.prescriber}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {med.todayDoses.map((dose, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: dose.given ? "var(--color-success-bg)" : "var(--color-muted)", borderRadius: 8 }}
                  >
                    <CheckCircle checked={dose.given} onChange={() => toggleDose(med.id, i)} />
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AppointmentCard({
  appt,
  onSavePrepNotes,
  onSaveOutcomeNotes,
}: {
  appt: Appointment;
  onSavePrepNotes: (id: string, text: string) => void;
  onSaveOutcomeNotes: (id: string, text: string) => void;
}) {
  const days = daysUntil(appt.date);
  const isPast = appt.status === "completed" || appt.status === "cancelled";

  const [editingPrep, setEditingPrep] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState(false);
  const [prepDraft, setPrepDraft] = useState(appt.prepNotes);
  const [outcomeDraft, setOutcomeDraft] = useState(appt.outcomeNotes);

  const inputStyle: React.CSSProperties = {
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

  const saveBtnStyle: React.CSSProperties = {
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

  const cancelBtnStyle: React.CSSProperties = {
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

  return (
    <Card style={{ borderLeft: `3px solid ${isPast ? "var(--color-border)" : "var(--color-primary)"}` }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{appt.provider}</div>
          <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{appt.specialty}</div>
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

function Appointments({
  appointments,
  setAppointments,
}: {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}) {
  const upcoming = appointments.filter((a) => a.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
  const past = appointments.filter((a) => a.status !== "upcoming").sort((a, b) => b.date.localeCompare(a.date));

  function savePrepNotes(id: string, text: string) {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, prepNotes: text } : a));
  }

  function saveOutcomeNotes(id: string, text: string) {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, outcomeNotes: text } : a));
  }

  return (
    <div>
      <PageHeader title="Appointments" />

      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Upcoming</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
        {upcoming.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} onSavePrepNotes={savePrepNotes} onSaveOutcomeNotes={saveOutcomeNotes} />
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Past</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {past.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} onSavePrepNotes={savePrepNotes} onSaveOutcomeNotes={saveOutcomeNotes} />
        ))}
      </div>
    </div>
  );
}

function Caregivers() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = caregivers.find((c) => c.id === selected);

  return (
    <div>
      <PageHeader title="Care Team" subtitle="Family, aides, and physicians" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {caregivers.map((c) => (
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
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Routines() {
  const cats: { id: Routine["category"]; label: string; color: string }[] = [
    { id: "morning", label: "Morning", color: "#E8A838" },
    { id: "afternoon", label: "Afternoon", color: "#1A6EBF" },
    { id: "evening", label: "Evening", color: "#7A3FA0" },
    { id: "night", label: "Night", color: "#374151" },
  ];
  const [active, setActive] = useState<Routine["category"]>("morning");
  const cat = cats.find((c) => c.id === active)!;

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
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {routines.filter((r) => r.category === active).map((routine, i, arr) => (
          <div key={routine.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
            <div style={{ width: 60, flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: cat.color }}>{routine.time}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{routine.title}</div>
              {routine.notes && (
                <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.5, marginBottom: 6 }}>{routine.notes}</div>
              )}
              <div style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Assigned to: {routine.assignedTo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Symptoms({ symptoms, setSymptoms }: { symptoms: Symptom[]; setSymptoms: React.Dispatch<React.SetStateAction<Symptom[]>> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symptom: "", severity: "2", notes: "", category: "Motor", loggedBy: "Margaret Marsh" });

  const severityLabels = ["", "Very mild", "Mild", "Moderate", "Significant", "Severe"];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date();
    setSymptoms((prev) => [{
      id: `s${Date.now()}`,
      date: "2026-08-26",
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      symptom: form.symptom,
      severity: parseInt(form.severity) as 1 | 2 | 3 | 4 | 5,
      notes: form.notes,
      category: form.category,
      loggedBy: form.loggedBy,
    }, ...prev]);
    setShowForm(false);
    setForm({ symptom: "", severity: "2", notes: "", category: "Motor", loggedBy: "Margaret Marsh" });
  }

  return (
    <div>
      <PageHeader
        title="Observations"
        subtitle="Symptoms and notable changes"
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: "10px 16px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            + Log
          </button>
        }
      />

      {showForm && (
        <Card style={{ marginBottom: 20, border: "1.5px solid var(--color-primary)" }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>New Observation</div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 }}>What happened?</label>
              <input value={form.symptom} onChange={(e) => setForm((p) => ({ ...p, symptom: e.target.value }))} required placeholder="e.g. Tremor worse, glucose elevated..." style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 }}>
                Severity — <span style={{ fontWeight: 400 }}>{severityLabels[parseInt(form.severity)]}</span>
              </label>
              <input type="range" min="1" max="5" value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))} style={{ width: "100%", accentColor: "var(--color-primary)", height: 6, cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" }}>
                {["Motor", "Cognitive", "Diabetes", "Pain", "Sleep", "Mood", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 }}>Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Context, what was happening, what helped..." style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 15, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", resize: "vertical", outline: "none", lineHeight: 1.5 }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", display: "block", marginBottom: 6 }}>Logged by</label>
              <select value={form.loggedBy} onChange={(e) => setForm((p) => ({ ...p, loggedBy: e.target.value }))} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-border)", borderRadius: 10, fontSize: 16, fontFamily: "inherit", background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" }}>
                {caregivers.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={{ flex: 1, padding: "13px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "13px", background: "var(--color-muted)", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", color: "var(--color-muted-foreground)", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {symptoms.map((s) => (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1, paddingRight: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{s.symptom}</div>
                <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{s.date} · {s.time} · {s.loggedBy}</div>
              </div>
              <Pill label={s.category} color="var(--color-muted-foreground)" bg="var(--color-muted)" />
            </div>
            <SeverityBar level={s.severity} showLabel />
            {s.notes && <div style={{ fontSize: 14, color: "var(--color-muted-foreground)", marginTop: 8, lineHeight: 1.5 }}>{s.notes}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Incidents({ incidents }: { incidents: Incident[] }) {
  const sevConfig: Record<string, { color: string; bg: string }> = {
    minor: { color: "var(--color-muted-foreground)", bg: "var(--color-muted)" },
    moderate: { color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
    serious: { color: "var(--color-danger)", bg: "var(--color-danger-bg)" },
  };

  return (
    <div>
      <PageHeader title="Incidents" subtitle="Falls, acute events, and medication errors" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {incidents.map((inc) => {
          const sev = sevConfig[inc.severity];
          return (
            <Card key={inc.id} style={{ borderLeft: `3px solid ${sev.color}` }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <Pill label={inc.type} color={sev.color} bg={sev.bg} />
                <Pill label={inc.severity.charAt(0).toUpperCase() + inc.severity.slice(1)} color={sev.color} bg={sev.bg} />
                {inc.doctorNotified && <Pill label="Doctor notified" color="var(--color-success)" bg="var(--color-success-bg)" />}
              </div>
              <div style={{ fontSize: 14, color: "var(--color-muted-foreground)", marginBottom: 8 }}>{formatDate(inc.date)} · {inc.time} · {inc.loggedBy}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>{inc.description}</div>
              <div style={{ background: "var(--color-muted)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Response</div>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{inc.response}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Screen; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: "dashboard", label: "Home",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "var(--color-primary)" : "none"} stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "log", label: "Log",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "medications", label: "Meds",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7.5" /><path d="M16 12h6" /><path d="M19 9v6" />
      </svg>
    ),
  },
  {
    id: "appointments", label: "Appts",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "symptoms", label: "Observe",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const MORE_ITEMS: { id: Screen; label: string }[] = [
  { id: "caregivers", label: "Care Team" },
  { id: "routines", label: "Routines" },
  { id: "incidents", label: "Incidents" },
];

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [medications, setMedications] = useState(initialMedications);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [showMore, setShowMore] = useState(false);

  const isMoreScreen = MORE_ITEMS.some((m) => m.id === screen);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 480, margin: "0 auto", background: "var(--color-background)", position: "relative" }}>
      {/* Content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 100px" }}>
        {screen === "dashboard" && <Dashboard medications={medications} symptoms={symptoms} log={initialLog} />}
        {screen === "log" && <CareLog log={initialLog} />}
        {screen === "medications" && <Medications medications={medications} setMedications={setMedications} />}
        {screen === "appointments" && <Appointments appointments={appointments} setAppointments={setAppointments} />}
        {screen === "caregivers" && <Caregivers />}
        {screen === "routines" && <Routines />}
        {screen === "symptoms" && <Symptoms symptoms={symptoms} setSymptoms={setSymptoms} />}
        {screen === "incidents" && <Incidents incidents={initialIncidents} />}
      </div>

      {/* More menu overlay */}
      {showMore && (
        <>
          <div onClick={() => setShowMore(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 448, background: "var(--color-card)", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", zIndex: 50, overflow: "hidden" }}>
            {MORE_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { setScreen(item.id); setShowMore(false); }}
                style={{
                  width: "100%", padding: "16px 20px", textAlign: "left", border: "none",
                  borderBottom: i < MORE_ITEMS.length - 1 ? "1px solid var(--color-border)" : "none",
                  background: screen === item.id ? "var(--color-secondary)" : "transparent",
                  fontSize: 16, fontWeight: screen === item.id ? 600 : 400,
                  color: screen === item.id ? "var(--color-primary)" : "var(--color-foreground)",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Bottom tab bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "var(--color-card)", borderTop: "1px solid var(--color-border)",
        display: "flex", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 30,
      }}>
        {NAV_ITEMS.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setScreen(item.id); setShowMore(false); }}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 3, padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer",
              }}
            >
              {item.icon(active)}
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--color-primary)" : "var(--color-muted-foreground)" }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setShowMore(!showMore)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 3, padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isMoreScreen || showMore ? "var(--color-primary)" : "var(--color-muted-foreground)"} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: isMoreScreen || showMore ? 600 : 400, color: isMoreScreen || showMore ? "var(--color-primary)" : "var(--color-muted-foreground)" }}>
            More
          </span>
        </button>
      </nav>
    </div>
  );
}
