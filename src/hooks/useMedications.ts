import { useState } from "react";
import type { Medication, LogEntry } from "../types/domain";
import { initialMedications } from "../data/seed";

export interface MedicationInput {
  name: string;
  dose: string;
  schedule: string;
  prescriber: string;
  purpose: string;
}

export interface NewMedicationInput extends MedicationInput {
  doseTimes: string[];
}

export function useMedications(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  function toggleDose(medId: string, doseIndex: number) {
    const med = medications.find((m) => m.id === medId);
    const dose = med?.todayDoses[doseIndex];
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, todayDoses: m.todayDoses.map((d, i) => (i === doseIndex ? { ...d, given: !d.given, givenBy: !d.given ? "You" : undefined } : d)) }
          : m
      )
    );
    if (med && dose) {
      addLogEntry(
        !dose.given
          ? { type: "medication", title: `${med.name} given`, detail: `${dose.time} dose marked given.`, loggedBy: "You" }
          : { type: "medication", title: `${med.name} marked pending`, detail: `${dose.time} dose unmarked.`, loggedBy: "You" }
      );
    }
  }

  function addMedication(input: NewMedicationInput) {
    const { doseTimes, ...rest } = input;
    setMedications((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        ...rest,
        todayDoses: doseTimes.map((time) => ({ time, given: false })),
      },
    ]);
    addLogEntry({ type: "medication", title: `Added medication: ${input.name}`, detail: `${input.dose} \u00b7 ${input.schedule}`, loggedBy: "You" });
  }

  function updateMedication(id: string, input: MedicationInput) {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, ...input } : m)));
    addLogEntry({ type: "medication", title: `Updated medication: ${input.name}`, detail: "Medication details edited.", loggedBy: "You" });
  }

  function deleteMedication(id: string) {
    const med = medications.find((m) => m.id === id);
    setMedications((prev) => prev.filter((m) => m.id !== id));
    if (med) {
      addLogEntry({ type: "medication", title: `Discontinued medication: ${med.name}`, detail: "Removed from active medication list.", loggedBy: "You" });
    }
  }

  return { medications, toggleDose, addMedication, updateMedication, deleteMedication };
}
