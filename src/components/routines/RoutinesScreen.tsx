import { useState } from "react";
import type { Routine } from "../../types/domain";
import { routines } from "../../data/seed";
import PageHeader from "../ui/PageHeader";

export default function RoutinesScreen() {
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
