import { useState } from "react";
import type { Medication } from "../types/domain";
import { initialMedications } from "../data/seed";

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  function toggleDose(medId: string, doseIndex: number) {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, todayDoses: m.todayDoses.map((d, i) => (i === doseIndex ? { ...d, given: !d.given, givenBy: !d.given ? "You" : undefined } : d)) }
          : m
      )
    );
  }

  return { medications, toggleDose };
}
