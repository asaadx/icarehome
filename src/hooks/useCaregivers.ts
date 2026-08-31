import { useState } from "react";
import type { Caregiver, LogEntry } from "../types/domain";
import { caregivers as initialCaregivers } from "../data/seed";

export interface CaregiverInput {
  name: string;
  role: string;
  relationship: string;
  phone: string;
  email: string;
  schedule: string;
}

const PALETTE = ["#1A6EBF", "#1A7A45", "#7A3FA0", "#B91C1C", "#9A5700"];

export function useCaregivers(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(initialCaregivers);

  function addCaregiver(input: CaregiverInput) {
    const words = input.name.trim().split(/\s+/).filter(Boolean);
    const initials = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : (words[0] ?? "").slice(0, 2).toUpperCase();
    setCaregivers((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        ...input,
        initials,
        color: PALETTE[prev.length % PALETTE.length],
      },
    ]);
    addLogEntry({ type: "note", title: `Added caregiver: ${input.name}`, detail: input.role, loggedBy: "You" });
  }

  function updateCaregiver(id: string, input: CaregiverInput) {
    setCaregivers((prev) => prev.map((c) => (c.id === id ? { ...c, ...input } : c)));
    addLogEntry({ type: "note", title: `Updated caregiver: ${input.name}`, detail: "Contact info or role edited.", loggedBy: "You" });
  }

  function deleteCaregiver(id: string) {
    const caregiver = caregivers.find((c) => c.id === id);
    setCaregivers((prev) => prev.filter((c) => c.id !== id));
    if (caregiver) {
      addLogEntry({ type: "note", title: `Removed caregiver: ${caregiver.name}`, detail: caregiver.role, loggedBy: "You" });
    }
  }

  return { caregivers, addCaregiver, updateCaregiver, deleteCaregiver };
}
