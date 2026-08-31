import { useState } from "react";
import type { Routine, LogEntry } from "../types/domain";
import { routines as seedRoutines } from "../data/seed";

export interface RoutineInput {
  time: string;
  title: string;
  category: Routine["category"];
  notes: string;
  assignedTo: string;
}

export function useRoutines(addLogEntry: (entry: Omit<LogEntry, "id" | "date" | "time">) => void) {
  const [routines, setRoutines] = useState<Routine[]>(seedRoutines);

  function addRoutine(input: RoutineInput) {
    setRoutines((prev) => [...prev, { id: `r${Date.now()}`, ...input, completed: false }]);
    addLogEntry({ type: "routine", title: `Added routine: ${input.title}`, detail: `${input.category} \u00b7 ${input.time}`, loggedBy: "You" });
  }

  function updateRoutine(id: string, input: RoutineInput) {
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, ...input } : r)));
    addLogEntry({ type: "routine", title: `Updated routine: ${input.title}`, detail: "Routine details edited.", loggedBy: "You" });
  }

  function deleteRoutine(id: string) {
    const routine = routines.find((r) => r.id === id);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    if (routine) {
      addLogEntry({ type: "routine", title: `Removed routine: ${routine.title}`, detail: routine.category, loggedBy: "You" });
    }
  }

  function toggleRoutineDone(id: string) {
    const routine = routines.find((r) => r.id === id);
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
    if (routine) {
      addLogEntry({ type: "routine", title: `${routine.title} marked ${!routine.completed ? "done" : "not done"}`, detail: routine.time, loggedBy: "You" });
    }
  }

  function moveRoutine(id: string, direction: "up" | "down") {
    setRoutines((prev) => {
      const target = prev.find((r) => r.id === id);
      if (!target) return prev;
      const sameCategoryIndices = prev.reduce<number[]>((acc, r, i) => {
        if (r.category === target.category) acc.push(i);
        return acc;
      }, []);
      const targetIndex = prev.findIndex((r) => r.id === id);
      const posInCategory = sameCategoryIndices.indexOf(targetIndex);
      if (direction === "up") {
        if (posInCategory <= 0) return prev;
        const swapIndex = sameCategoryIndices[posInCategory - 1];
        const next = [...prev];
        [next[targetIndex], next[swapIndex]] = [next[swapIndex], next[targetIndex]];
        return next;
      } else {
        if (posInCategory === -1 || posInCategory >= sameCategoryIndices.length - 1) return prev;
        const swapIndex = sameCategoryIndices[posInCategory + 1];
        const next = [...prev];
        [next[targetIndex], next[swapIndex]] = [next[swapIndex], next[targetIndex]];
        return next;
      }
    });
  }

  return { routines, addRoutine, updateRoutine, deleteRoutine, toggleRoutineDone, moveRoutine };
}
