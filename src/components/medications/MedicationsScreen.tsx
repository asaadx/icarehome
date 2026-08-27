import type { Medication } from "../../types/domain";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import CheckCircle from "../ui/CheckCircle";

export default function MedicationsScreen({
  medications,
  onToggleDose,
}: {
  medications: Medication[];
  onToggleDose: (medId: string, doseIndex: number) => void;
}) {
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}
