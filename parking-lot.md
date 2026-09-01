# Parking Lot

Deferred ideas and specs that came up during feature work but were scoped out of the PR that raised them. Not committed to a timeline — pull an item into its own branch/PR when it's ready to build.

## Undo for CRUD actions

**Raised in:** `feat/appointments-crud` (PR #10) UI/UX review — appointments and medications CRUD had no way to undo a destructive or state-changing action (discontinue medication, cancel/complete appointment, edit overwrite).

**Why deferred:** touches every mutating function across every CRUD hook; scoped as its own PR rather than folding into a button-styling pass.

### Shape

A stack, shared app-wide (not per-feature) — one undo history covers medications, appointments, and any future CRUD surface.

- **`UndoProvider`** — a React context mounted once at the `App.tsx` root exposing `pushUndo(entry)` / `undo()`.
- **Entry shape:** `{ id, label, expiresAt, apply: () => void }`, where `apply` is the *inverse* of the mutation just performed (not a redo of the original action).
- **Capture point:** each data hook (`useMedications`, `useAppointments`, etc.) already centralizes its mutations (`deleteMedication`, `cancelAppointment`, `updateMedication`, …). That's where the prior state gets snapshotted and the inverse closure gets pushed, before the mutation commits. Example: `deleteMedication` snapshots the removed record and pushes `apply: () => setMedications(prev => [...prev, snapshot])`.
- **UI:** a single `<UndoToast/>` rendered once at the `App.tsx` root, reading the top of the stack. Shows e.g. "Discontinued Lisinopril · Undo" for ~6s. Pops on undo or on expiry.
- **Depth cap:** bound the stack (e.g. 5 entries); older entries silently fall off rather than growing unbounded.
- **Audit log interaction:** undo reverts domain state, not the `careLog` audit trail. When `apply()` runs, log an "Undid: …" entry rather than deleting the original log line — the log should stay an honest record of what happened, including corrections.

### Scope when built

Every mutating function in every CRUD hook needs a paired inverse (`addMedication` ↔ remove-by-id, `updateMedication` ↔ restore-previous-snapshot, `cancelAppointment`/`completeAppointment` ↔ restore-previous-status, etc.). Fits the existing hook pattern with no restructuring — it's a horizontal cut across all of them, which is why it doesn't fit cleanly inside a single feature PR.
