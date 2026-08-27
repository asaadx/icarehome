# Refactor plan — split `src/App.tsx` into components, hooks, and supporting modules

## Context

`src/App.tsx` is 1393 lines and contains everything: 7 domain type definitions, all seed/mock data, date/formatting helpers, 7 reusable UI atoms, 7 full screens (some with their own forms and local state), nav configuration, and the app shell/router. This is a pure structural refactor — **no behavior changes**. Every screen must render pixel-identical output and every interaction (dose toggling, appointment note editing, symptom/incident logging, nav/more-menu) must work exactly as it does today. Behavioral gaps (e.g. Care Log never receiving new entries, no medication CRUD) are tracked separately in `plans/user-action-audit.md` and are explicitly **out of scope** here — fixing them now would make the refactor diff impossible to review for correctness.

## Goals

- One concern per file: types, seed data, pure helpers, presentational atoms, domain hooks, screens, layout/nav.
- `App.tsx` shrinks to a composition root: own the 6 pieces of state (`screen`, `medications`, `appointments`, `symptoms`, `incidents`, `showMore`, `autoOpenKind`) via small hooks, and render layout + the active screen.
- Preserve the existing prop-drilling pattern (App → screen component). It's currently one level deep and shallow — introducing Context/Redux/Zustand now would be a needless abstraction for a 7-screen app with no shared cross-screen mutation beyond what already flows through App. Revisit only if a future screen needs state from a non-parent screen.
- No new dependencies. No visual/behavioral change. No Tailwind-class rewrite of the existing inline `style={{ ... }}` objects — that's a separate, higher-risk visual-diff task or an oxfmt/design decision, not part of this structural split. Flagged as an open question below, not decided here.

## Target structure

```
src/
  types/
    domain.ts          # Medication, Appointment, Caregiver, Routine, Symptom, Incident, LogEntry, HealthEvent, Screen
  data/
    seed.ts            # PATIENT, initialMedications, initialAppointments, caregivers, routines, initialSymptoms, initialIncidents, initialLog
  lib/
    date.ts            # formatDate, daysUntil, eventTimestamp
    severity.ts         # SEVERITY_LABELS, SEVERITY_COLORS
    logTypeConfig.ts     # TYPE_CONFIG (used by Dashboard + CareLog)
  hooks/
    useMedications.ts    # medications state + toggleDose
    useAppointments.ts   # appointments state + savePrepNotes/saveOutcomeNotes/addAppointment
    useHealthEvents.ts   # symptoms + incidents state + addSymptom/addIncident
  components/
    ui/                  # presentational atoms, no domain knowledge
      PageHeader.tsx
      Card.tsx
      Pill.tsx
      SeverityBar.tsx
      Avatar.tsx
      CheckCircle.tsx
      Fab.tsx
    layout/
      navItems.tsx        # NAV_ITEMS, MORE_ITEMS (contains JSX icons, stays .tsx)
      BottomNav.tsx
      MoreMenu.tsx
    dashboard/
      DashboardScreen.tsx
    care-log/
      CareLogScreen.tsx
    medications/
      MedicationsScreen.tsx
    appointments/
      AppointmentsScreen.tsx
      AppointmentCard.tsx
      AppointmentForm.tsx   # the "New Appointment" form, extracted out of Appointments()
    caregivers/
      CaregiversScreen.tsx
    routines/
      RoutinesScreen.tsx
    health/
      HealthLogScreen.tsx
      SymptomForm.tsx        # extracted from HealthLog's symptom branch
      IncidentForm.tsx       # extracted from HealthLog's incident branch
      kindToggleStyle.ts      # local style helper, only used by these two forms
  App.tsx                    # composition root only
  main.tsx
  index.css
```

Screen components keep the `*Screen.tsx` suffix to distinguish them from atoms/cards in the same tree and to avoid name collisions (`Card` the atom vs. e.g. a hypothetical `AppointmentCard`).

## File-by-file mapping (old → new)

| Old (`App.tsx` lines, current) | New location |
|---|---|
| `Screen` type | `types/domain.ts` |
| `Medication`, `Appointment`, `Caregiver`, `Routine`, `Symptom`, `Incident`, `LogEntry` interfaces | `types/domain.ts` |
| `HealthEvent` type | `types/domain.ts` |
| `PATIENT`, `initialMedications`, `initialAppointments`, `caregivers`, `routines`, `initialSymptoms`, `initialIncidents`, `initialLog` | `data/seed.ts` |
| `formatDate`, `daysUntil` | `lib/date.ts` |
| `eventTimestamp` | `lib/date.ts` |
| `SEVERITY_LABELS`, `SEVERITY_COLORS` | `lib/severity.ts` |
| `TYPE_CONFIG` | `lib/logTypeConfig.ts` |
| `PageHeader`, `Card`, `Pill`, `SeverityBar`, `Avatar`, `CheckCircle`, `Fab` | `components/ui/<Name>.tsx` (one component per file) |
| `Dashboard` | `components/dashboard/DashboardScreen.tsx` |
| `CareLog` | `components/care-log/CareLogScreen.tsx` |
| `Medications` | `components/medications/MedicationsScreen.tsx`; `toggleDose` moves into `hooks/useMedications.ts` |
| `AppointmentCard` | `components/appointments/AppointmentCard.tsx` (unchanged internally — its local `editingPrep`/`editingOutcome`/draft state stays component-local, it's pure UI state, not app state) |
| `Appointments` | `components/appointments/AppointmentsScreen.tsx`; the inline `showForm`/`form` block becomes `AppointmentForm.tsx`; `savePrepNotes`/`saveOutcomeNotes`/`submitAppointment` move into `hooks/useAppointments.ts` |
| `Caregivers` | `components/caregivers/CaregiversScreen.tsx` (its `selected` state stays local — it's pure UI expand/collapse state) |
| `Routines` | `components/routines/RoutinesScreen.tsx` (its `active` category tab state stays local) |
| `kindToggleStyle` | `components/health/kindToggleStyle.ts` |
| `HealthLog` | `components/health/HealthLogScreen.tsx`; the symptom form JSX branch becomes `SymptomForm.tsx`, the incident form JSX branch becomes `IncidentForm.tsx`; `submit`/`setSymptoms`/`setIncidents` mutation logic moves into `hooks/useHealthEvents.ts`, the `showForm`/`kind`/`autoOpenKind` wiring stays in `HealthLogScreen.tsx` since it's screen-local UI state |
| `NAV_ITEMS`, `MORE_ITEMS` | `components/layout/navItems.tsx` |
| Bottom `<nav>` JSX block in `App()` | `components/layout/BottomNav.tsx` |
| "More menu overlay" JSX block in `App()` | `components/layout/MoreMenu.tsx` |
| `App()` | `App.tsx` — keeps `screen`/`showMore`/`autoOpenKind` state and `reportIncident`, calls the three new hooks, renders `BottomNav`/`MoreMenu`/the active screen/the report-incident `Fab` |

## Hook boundaries (state ownership)

- `useMedications()` → `{ medications, toggleDose }`. Wraps `useState(initialMedications)`.
- `useAppointments()` → `{ appointments, savePrepNotes, saveOutcomeNotes, addAppointment }`. Wraps `useState(initialAppointments)`.
- `useHealthEvents()` → `{ symptoms, incidents, addSymptom, addIncident }`. Wraps two `useState`s (`initialSymptoms`, `initialIncidents`) since they're mutated independently but read together as `HealthEvent[]` only inside `HealthLogScreen`.
- `screen`, `showMore`, `autoOpenKind` stay as plain `useState` in `App.tsx` — they're pure navigation/UI state with a single owner and one consumer level, not worth a hook.
- `CareLog`/`Caregivers`/`Routines` continue to receive `initialLog`/`caregivers`/`routines` as static imports from `data/seed.ts` (today `Caregivers`/`Routines` already import the module-level consts directly rather than via props — preserve that, don't invent props that don't exist today).

## Migration order (each step leaves the app compiling and visually identical)

1. Extract `types/domain.ts` and `data/seed.ts`; update the one remaining `App.tsx` to import from them. Verify: app still renders identically (nothing structural yet).
2. Extract `lib/date.ts`, `lib/severity.ts`, `lib/logTypeConfig.ts`.
3. Extract the seven `components/ui/*` atoms verbatim (no logic changes, just move + import fix-ups).
4. Extract `components/layout/navItems.tsx`, `BottomNav.tsx`, `MoreMenu.tsx` out of the `App()` shell JSX.
5. Extract the three hooks (`useMedications`, `useAppointments`, `useHealthEvents`), moving the mutation functions verbatim out of `App()`/screen components.
6. Extract screens one at a time, starting with the simplest (Dashboard, CareLog, Caregivers, Routines — no forms) then the two with forms (Medications is simple; Appointments and HealthLog need their form sub-components extracted alongside).
7. Delete the now-empty definitions from `App.tsx`, leaving only the composition root.
8. Full pass: check every import resolves, no unused exports remain, no component still reads a module-level const it should now receive differently (there shouldn't be any — see hook boundaries above).

## Naming conventions

- Components: `PascalCase.tsx`, one component per file, default export matching the file name.
- Hooks: `useX.ts` (camelCase), named export.
- Types, data, lib: camelCase `.ts` files, named exports (no default exports for non-components).
- No barrel `index.ts` re-export files — with this file count, barrels add an indirection layer without reducing real import verbosity, and they make it harder for the LSP to jump to the real definition.

## Open questions (not decided by this plan)

- Whether to also convert the extensive inline `style={{...}}` objects to Tailwind utility classes (already installed, and `AGENTS.md` recommends utility classes) — left out because it's a large visual-risk change independent of file structure; do it as a separate follow-up if wanted.
- Whether `AppointmentCard`'s duplicated `inputStyle`/`saveBtnStyle`/`cancelBtnStyle` objects (currently redefined per-render) should be hoisted to module-level constants during the extraction — safe micro-cleanup, can be folded into step 6 for that file since it's touched anyway, but is not a structural requirement.

## Verification (once implemented)

Since this is a pure refactor, verification is visual-parity, not new tests: drive the running dev server with the browser tool through all 7 screens (Dashboard → Log → Medications → Appointments → Care Team → Routines → Health, plus the More menu and the Report Incident FAB) before and after, confirm identical rendering and that every existing interaction (dose checkbox toggle, appointment prep/outcome note edit + save/cancel, new appointment form submit, symptom/incident form submit and kind toggle, caregiver card expand, routine category tabs) still works.
