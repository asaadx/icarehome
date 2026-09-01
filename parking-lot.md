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

## Migrate inline styles to Tailwind utility classes

**Raised in:** `fix/routine-ui-nitpicks` (PR #17) UI polish pass — reached for a Tailwind `className` (`min-w-28 shrink-0`) to fix pill-column alignment on the dashboard and Care Log, since `AGENTS.md` documents Tailwind utility classes as this project's intended styling approach and `@tailwindcss/vite` is already wired up in `vite.config.ts`.

**Why deferred:** every component in `src/` currently styles exclusively with inline `style={{}}` objects — 208 call sites across 25 files. Adding `className` to one or two components mid-fix would leave two competing styling conventions live in the codebase simultaneously, which is worse than picking one and staying consistent. Reverted that PR back to inline styles and scoping the actual migration out as its own change.

### Shape

- Convert `style={{...}}` objects to Tailwind utility strings component-by-component, not file-by-file — start with the shared primitives in `src/components/ui/` (`Pill`, `CheckCircle`, `Card`, `ActionButton`, `Fab`, `PageHeader`, `SeverityBar`, `Avatar`) since every screen composes them, and migrating them first establishes the class patterns (spacing scale, radius, color tokens) screens then reuse.
- The `@theme inline` block in `src/index.css` already defines `--color-primary`, `--color-muted-foreground`, etc. — Tailwind v4 should pick these up as first-class utilities (`bg-primary`, `text-muted-foreground`, …) with no extra config. Verify token utilities resolve correctly on the first migrated primitive before converting the rest; if a token doesn't map cleanly, fix the theme block rather than falling back to arbitrary-value classes (`bg-[var(--color-primary)]`), which would just reintroduce inline-style-style magic values.
- Dynamic/conditional styling (e.g. `borderColor: active ? c.color : "var(--color-border)"` in `RoutinesScreen`) doesn't map to static utility classes 1:1 — decide per call site whether that's conditional `className` composition (e.g. small `clsx`-style helper) or stays inline for values that are genuinely runtime-computed (per-category hex colors), rather than forcing everything into utilities.
- Screen-level components (`DashboardScreen`, `MedicationsScreen`, `RoutinesScreen`, etc.) migrate after primitives are done and verified.

### Scope when built

Touches all 25 `.tsx` files with inline styles — no logic changes, pure styling migration. Should land as its own PR (or a short stack of primitives-first, then screens) with before/after screenshots per screen, not folded into a feature or bugfix PR.
