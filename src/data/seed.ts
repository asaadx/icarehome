import type { Medication, Appointment, Caregiver, Routine, Symptom, Incident, LogEntry } from "../types/domain";

// ─── Data ─────────────────────────────────────────────────────────────────────

export const PATIENT = {
  name: "Eleanor Marsh",
  age: 76,
  dob: "March 14, 1948",
  conditions: ["Parkinson's Disease (Moderate)", "Type 2 Diabetes"],
  allergies: ["Penicillin", "Sulfa drugs"],
  primaryDoctor: "Dr. Anita Rosen, MD — Neurology",
  bloodType: "A+",
};

export const initialMedications: Medication[] = [
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

export const initialAppointments: Appointment[] = [
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

export const caregivers: Caregiver[] = [
  { id: "c1", name: "Margaret Marsh", role: "Primary Family Caregiver", relationship: "Daughter", phone: "(617) 555-0142", email: "margaret.marsh@email.com", schedule: "Weekends + evenings", initials: "MM", color: "#1A6EBF" },
  { id: "c2", name: "Thomas Marsh", role: "Family Caregiver", relationship: "Son", phone: "(617) 555-0187", email: "t.marsh@email.com", schedule: "Tuesday evenings, alternating Sundays", initials: "TM", color: "#1A7A45" },
  { id: "c3", name: "Yolanda Cruz", role: "Home Health Aide", relationship: "Professional", phone: "(617) 555-0234", email: "yolanda@carehome.com", schedule: "Mon–Fri, 9 AM–3 PM", initials: "YC", color: "#7A3FA0" },
  { id: "c4", name: "Dr. Anita Rosen", role: "Neurologist", relationship: "Physician", phone: "(617) 555-0300", email: "a.rosen@mgh.org", schedule: "Appointments only", initials: "AR", color: "#B91C1C" },
  { id: "c5", name: "Dr. Samuel Okonkwo", role: "Internal Medicine", relationship: "Physician", phone: "(617) 555-0401", email: "s.okonkwo@cfh.org", schedule: "Appointments only", initials: "SO", color: "#9A5700" },
];

export const routines: Routine[] = [
  { id: "r1", time: "7:00 AM", title: "Morning medications", category: "morning", notes: "Carbidopa-Levodopa + Lisinopril. Give on empty stomach, 30 min before breakfast.", assignedTo: "Margaret / Yolanda", completed: false },
  { id: "r2", time: "7:30 AM", title: "Breakfast + blood sugar check", category: "morning", notes: "Target fasting glucose 100–140 mg/dL. Record reading in care log.", assignedTo: "Yolanda / Margaret", completed: false },
  { id: "r3", time: "8:00 AM", title: "Metformin with breakfast", category: "morning", notes: "Give with food to reduce GI side effects.", assignedTo: "Yolanda / Margaret", completed: false },
  { id: "r4", time: "9:00 AM", title: "Morning hygiene and dressing", category: "morning", notes: "Allow extra time — tremor worse before medication kicks in (~60 min). Adaptive clothing in top drawer.", assignedTo: "Yolanda", completed: false },
  { id: "r5", time: "10:00 AM", title: "Seated exercises / stretching", category: "morning", notes: "15 min PT routine from sheet on fridge. Ankle circles and shoulder rolls.", assignedTo: "Yolanda", completed: false },
  { id: "r6", time: "12:00 PM", title: "Lunch + noon medications", category: "afternoon", notes: "Carbidopa-Levodopa dose 2. Give 30 min before eating. Add Vitamin D3 with the meal.", assignedTo: "Yolanda", completed: false },
  { id: "r7", time: "2:00 PM", title: "Rest period", category: "afternoon", notes: "Nap or quiet activity. Do not skip — fatigue worsens afternoon tremors.", assignedTo: "Yolanda", completed: false },
  { id: "r8", time: "4:00 PM", title: "Afternoon walk", category: "afternoon", notes: "15–20 min with rollator on flat path. Two-person assist on bad tremor days.", assignedTo: "Yolanda / Margaret", completed: false },
  { id: "r9", time: "5:00 PM", title: "Evening Carbidopa-Levodopa", category: "evening", notes: "Dose 3 of 3. Check her fatigue level — freezing more common when tired.", assignedTo: "Margaret / Yolanda", completed: false },
  { id: "r10", time: "6:30 PM", title: "Dinner + Metformin", category: "evening", notes: "Soft foods preferred. No liquids without thickener.", assignedTo: "Margaret", completed: false },
  { id: "r11", time: "8:00 PM", title: "Evening blood sugar check", category: "evening", notes: "Target post-dinner under 180 mg/dL. Record in care log.", assignedTo: "Margaret", completed: false },
  { id: "r12", time: "9:00 PM", title: "Bedtime routine + Ropinirole", category: "night", notes: "Teeth brushing, face wash, bed transfer. Give Ropinirole at lights out.", assignedTo: "Margaret", completed: false },
];

export const initialSymptoms: Symptom[] = [
  { id: "s1", date: "2026-08-26", time: "9:15 AM", symptom: "Freezing episode", severity: 3, notes: "Brief freeze at kitchen doorway, lasted ~10 seconds. Resolved with verbal cuing.", loggedBy: "Yolanda Cruz", category: "Motor" },
  { id: "s2", date: "2026-08-26", time: "7:45 AM", symptom: "Elevated fasting glucose", severity: 2, notes: "158 mg/dL — higher than usual. Ate earlier than normal the previous evening.", loggedBy: "Margaret Marsh", category: "Diabetes" },
  { id: "s3", date: "2026-08-25", time: "3:00 PM", symptom: "Increased right-hand tremor", severity: 3, notes: "Notably worse in the afternoon. Skipped nap — possible fatigue factor.", loggedBy: "Yolanda Cruz", category: "Motor" },
  { id: "s4", date: "2026-08-24", time: "8:00 PM", symptom: "Confusion at dinner", severity: 4, notes: "Asked where she was twice. Resolved in ~20 min. Monitoring for possible UTI.", loggedBy: "Margaret Marsh", category: "Cognitive" },
  { id: "s5", date: "2026-08-22", time: "11:30 AM", symptom: "Good motor window — positive day", severity: 1, notes: "Excellent coordination and mood mid-morning. Folded laundry independently.", loggedBy: "Yolanda Cruz", category: "Motor" },
];

export const initialIncidents: Incident[] = [
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

export const initialLog: LogEntry[] = [
  { id: "l1", date: "2026-08-26", time: "9:15 AM", type: "symptom", title: "Freezing episode", detail: "Brief freeze at kitchen doorway. Resolved with verbal cuing.", loggedBy: "Yolanda Cruz" },
  { id: "l2", date: "2026-08-26", time: "8:00 AM", type: "medication", title: "Morning medications given", detail: "Carbidopa-Levodopa 25/100 mg + Lisinopril 5 mg.", loggedBy: "Margaret Marsh" },
  { id: "l3", date: "2026-08-26", time: "7:45 AM", type: "symptom", title: "Fasting glucose 158 mg/dL", detail: "Slightly elevated. No intervention needed.", loggedBy: "Margaret Marsh" },
  { id: "l4", date: "2026-08-25", time: "5:00 PM", type: "medication", title: "Evening Carbidopa-Levodopa", detail: "Dose 3 of 3 — on schedule.", loggedBy: "Yolanda Cruz" },
  { id: "l5", date: "2026-08-25", time: "3:00 PM", type: "symptom", title: "Increased tremor", detail: "Right hand worse than baseline. Skipped nap — likely a factor.", loggedBy: "Yolanda Cruz" },
  { id: "l6", date: "2026-08-24", time: "8:00 PM", type: "symptom", title: "Confusion at dinner", detail: "Asked location twice. Resolved in ~20 min. Monitoring for UTI.", loggedBy: "Margaret Marsh" },
  { id: "l7", date: "2026-08-12", time: "9:00 AM", type: "appointment", title: "Neurology — Dr. Rosen", detail: "Post-fall check. No medication changes. Next appt: Sep 3.", loggedBy: "Margaret Marsh" },
  { id: "l8", date: "2026-08-04", time: "7:15 PM", type: "incident", title: "Fall — right hip", detail: "Unassisted transfer attempt. No fracture. Dr. Rosen notified.", loggedBy: "Margaret Marsh" },
];
