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

## Extract shared components for repeated row/action patterns

**Raised in:** `fix/action-icons-and-log-alignment` (PR #19) UI consistency pass — fixed the same "Edit/Delete buttons missing icons" bug three separate times (Routines + Health Log in one commit, Caregivers in the next, after the user spotted it was still missing there) because the icon+text action-button pair is copy-pasted JSX in every screen rather than a shared component. The pill-next-to-text list row (Dashboard Recent Activity, Care Log) had the identical problem: the same layout was duplicated across two files and drifted out of sync (alignment fixed in one place, not the other) before being standardized.

**Why deferred:** both fixes were already in flight as part of a UI-nitpick pass; extracting components is a structural refactor with its own review surface (props API, call-site migration, no behavior change to verify) and doesn't belong mixed into a bugfix diff.

### Shape

- **`RecordActions`** (name TBD) — wraps the `<div style={{display:"flex",gap:8,marginTop:12}}><ActionButton .../><ActionButton .../></div>` pair currently duplicated in `RoutinesScreen`, `HealthLogScreen` (×2, symptom and incident cards), and `CaregiversScreen`. Props: `onEdit: () => void`, `onDelete: () => void`, and an optional `deleteLabel` (defaults to `"Delete"`; Caregivers uses `"Remove"`). Renders the two `ActionButton`s with `PencilIcon`/`TrashIcon` baked in, so there's exactly one place that decides what an edit/delete pair looks like.
- **`TypeLogRow`** (name TBD) — wraps the `Fragment` pill-cell/text-cell/divider triple duplicated in `DashboardScreen`'s Recent Activity and `CareLogScreen`'s entries. Props: `entry: LogEntry`, `isLast: boolean`, and a `variant` flag for Care Log's extra `entry.detail` line (Dashboard doesn't render it). Both call sites rely on their parent using the same `gridTemplateColumns: "max-content 1fr"` grid so the pill column auto-fits tight to whatever labels are actually visible — that grid contract, not a fixed width, is what needs to stay identical between call sites; extracting the row alone doesn't guarantee it, so `TypeLogRow` should document (or assert) that its parent is such a grid rather than owning the grid itself.
- Both call sites already pass identical prop shapes today (they were just fixed to be identical), so this is a mechanical extraction, not a design exercise — the risk is purely in verifying no visual regression across all 6 screens touched.

### Scope when built

Touches `RoutinesScreen`, `HealthLogScreen`, `CaregiversScreen` (→ `RecordActions`) and `DashboardScreen`, `CareLogScreen` (→ `TypeLogRow`), plus two new files in `src/components/ui/`. Pure extraction, no behavior change — verify by diffing rendered output/screenshots per screen before and after.

## Read Only Mode

**Raised in:** UI/UX research conversation (2026-08-31) — came up alongside RBAC below as a lighter-weight variant worth scoping separately.

**Why deferred:** no interactive control in the app currently supports being disabled — every mutation is a bare `onClick` on a `button`/`ActionButton`/`CheckCircle`/`Fab`. Read Only Mode isn't a screen or a feature, it's a cross-cutting constraint on every existing control, so it needs a plan for *how* controls get disabled before it's buildable, not just a toggle.

### Shape

- A single boolean, sourced from e.g. a share-link query param or an in-app toggle (not real auth — there's no backend) — for the use case of showing a read-only status view to someone who shouldn't (or, given the target audience, easily could-by-accident) edit anything: an out-of-town relative, or the patient herself.
- Doesn't require the full RBAC model below to be useful on its own — one flag, one meaning, threaded via context (`ReadOnlyProvider`, mirroring the pattern already parked for `UndoProvider`) rather than prop-drilled through every screen.
- Every mutating control needs to respect it: `Fab` (hide), `ActionButton` (disable + dim, don't just hide — a mature-audience-friendly UI should show *why* an action isn't available rather than have it silently vanish), `CheckCircle` (disable), the raw `<button>`s in forms (disable submit). This is exactly the surface the "Extract shared components" entry above (`RecordActions`) already centralizes — worth sequencing Read Only Mode *after* that extraction so there's one `disabled` prop to thread instead of patching every screen individually.
- If RBAC (below) ships first, Read Only Mode becomes just its most restrictive role rather than a separate mechanism — decide which lands first before building both.

### Scope when built

A context/provider plus a `disabled` (or `readOnly`) prop on every shared interactive primitive in `src/components/ui/` (`ActionButton`, `Fab`, `CheckCircle`, plus form submit buttons). No screen-level logic changes — screens don't need to know Read Only Mode exists if the primitives they already use handle it.

## RBAC (role-based permissions)

**Raised in:** UI/UX research conversation (2026-08-31).

**Why deferred:** the app has no identity concept at all today to hang permissions off of — every mutation hardcodes `loggedBy: "You"` (see every hook in `src/hooks/`: `useMedications`, `useAppointments`, `useRoutines`, `useHealthEvents`, `useCaregivers`), and `Caregiver.role` (`src/types/domain.ts`) is a free-text display label ("Primary Family Caregiver", "Home Health Aide", "Neurologist", …) with zero permission semantics. RBAC needs a "who am I" concept to exist first, which is a bigger foundational change than a permissions layer on top of one.

### Shape

- **Current user:** since there's no backend/login, the realistic version for this app is an "acting as" selector — pick one of the existing `caregivers` records as "you" (persisted locally), rather than building real authentication. Replaces every hardcoded `"You"` with the selected caregiver's actual name, which is also a correctness fix independent of RBAC (the audit log currently can't actually tell caregivers apart).
- **Permission tiers derived from existing roles**, not a new parallel enum: family caregivers (full CRUD), professional aides (can toggle doses/routines done, log symptoms/incidents, cannot edit medication dosages or delete records), physicians (view-only across the board, per the existing `relationship: "Physician"` caregivers already in the seed data). Map `Caregiver.relationship`/`role` → a permission tier rather than hand-assigning a new field per caregiver.
- **Enforcement point:** same primitives Read Only Mode above depends on (`ActionButton`, `Fab`, `CheckCircle`) — a permission check is just a more granular version of the same `disabled` mechanism, gated per-action instead of globally. Build these two in whichever order makes the other simpler, not independently.

### Scope when built

A current-user context (new), a role→permission-tier mapping (new), and threading permission checks through every mutating control app-wide — the same primitives as Read Only Mode, plus per-screen decisions about which specific actions each tier can perform (needs a product decision, not just an engineering one, before implementation: e.g. can a Home Health Aide discontinue a medication?).

## Patient banner redesign — safety-first, WCAG-compliant contrast

**Raised in:** UI/UX research subagent (`designer`, 2026-09-01), commissioned to research mature/older-adult UI/UX design principles and apply them to this app.

**Why deferred:** research/analysis task, not scoped as an implementation — needs a design decision on the redesign direction before building.

### Findings

The Dashboard patient banner (`src/components/dashboard/DashboardScreen.tsx:33-37`) fails WCAG contrast on the two lines carrying the most safety-relevant information: name (18px bold, full opacity) measures 5.22:1 against `--color-primary` and passes, but age+condition (13px, `opacity: 0.85`) measures **4.24:1 — fails** the 4.5:1 AA minimum, and the second condition line (12px, `opacity: 0.7`) measures **3.40:1 — fails badly**, under even the 3:1 large-text floor. The banner uses opacity to de-emphasize instead of weight, which the research flags directly as a common pattern that disproportionately hurts older/low-vision users. It also omits `PATIENT.allergies` (`src/data/seed.ts:5-13` has `["Penicillin", "Sulfa drugs"]`) entirely — for a multi-caregiver coordination app, an allergy invisible at a glance is a safety gap: a fill-in aide who never opens Care Team could plausibly not know about it. No photo/avatar despite the app already having an `Avatar` component (`src/components/ui/Avatar.tsx`, used in `CaregiversScreen.tsx:58`) — recognition beats reading for this audience.

### Shape

- Add a high-contrast allergy alert row using the existing `Pill` component in `--color-danger`/`--color-danger-bg` tones (already used elsewhere for incidents), always full-opacity — never hidden behind fade.
- Replace the two opacity-based lines with full-opacity text using existing `Pill`/chip conventions (matching status-pill styling used elsewhere), and bump the name to an unambiguous large-text size (≥24px).
- Add `Avatar` (reusing the `CaregiversScreen.tsx` pattern) plus a one-line primary-doctor row with tap-to-call, mirroring the existing `tel:`/`mailto:` pattern already implemented at `CaregiversScreen.tsx:71,75`.

### Scope when built

Contained to `DashboardScreen.tsx`'s banner block plus reusing `Avatar`/`Pill`, no data-model changes (`PATIENT.allergies`/`primaryDoctor` already exist in `src/data/seed.ts`, just unused on this screen).

## Responsive navigation — promote Care Team, drop "More" at wider viewports

**Raised in:** same UI/UX research subagent, prompted specifically about whether nav items should move between the bottom bar and the "More" menu based on screen size.

**Why deferred:** research/analysis task; also blocked on the "Migrate inline styles to Tailwind" and general responsive-layout questions being unresolved for the rest of the app (this would be the first responsive breakpoint anywhere in the codebase).

### Findings

`NAV_ITEMS`/`MORE_ITEMS` (`src/components/layout/navItems.tsx:6-52`) are hardcoded static arrays — 5 items always in the bottom bar, 2 (Care Team, Log) always hidden behind an unlabeled "More" button, with zero `matchMedia`/viewport logic anywhere in `BottomNav.tsx`, `MoreMenu.tsx`, or `App.tsx`. `App.tsx:43` hardcodes `maxWidth: 480` on the root container with no breakpoint anywhere in the codebase, so the app renders as a fixed phone-width column even on a laptop browser — plausible for adult-child caregivers coordinating from a desk — and "More" stays exactly as cramped regardless of actual available width. Research is explicit that hidden/overflow ("hamburger"-style) navigation gets disproportionately fewer interactions from older users and should be avoided when avoidable. Burying **Care Team** — the screen listing who the other caregivers are and how to reach them, central to this app's entire multi-caregiver premise — behind an unlabeled overflow icon works against the app's own purpose.

### Shape

- Promote `{ id: "caregivers", label: "Care Team" }` out of `MORE_ITEMS` into `NAV_ITEMS` in `navItems.tsx` regardless of viewport work — this alone doesn't need responsive logic, just a reordering (swap with a lower-frequency item, since Routines/Health are both also reachable from Dashboard cards/FAB).
- Keep the "More" label at the same 12px+ size as the other nav labels — currently 10px (`BottomNav.tsx:58-60`), smaller than the five it sits beside for no reason.
- Add a `useViewport`/`matchMedia` hook (nonexistent anywhere today) that, above ~700–768px, drops `App.tsx`'s `maxWidth: 480` constraint and renders the full merged `NAV_ITEMS + MORE_ITEMS` list with no "More" button at all — a labeled left-side rail is more conventional than a bottom bar at that width. Below that width, keep a bounded 5–6 item bottom bar (7 items uncapped would push touch targets below the 44–48px senior-recommended minimum on a 480px-wide bar).

### Scope when built

The Care Team promotion is a one-line reorder in `navItems.tsx`, independently shippable today. The viewport-responsive piece is new (a hook plus conditional layout in `App.tsx`/`BottomNav.tsx`) and is the first responsive breakpoint in the codebase — worth sequencing after (or alongside) the Tailwind migration above, since Tailwind's breakpoint utilities (`md:`, `lg:`) are the natural way to express it rather than hand-rolled `matchMedia` + inline styles.

## Senior-UX accessibility fixes across screens

**Raised in:** same UI/UX research subagent — smaller, independently-fixable findings surfaced while researching the two items above.

**Why deferred:** research/analysis task; each is small enough to be its own quick fix but is batched here since they share the same audit pass and rationale.

### Findings & fixes

- **Inconsistent destructive-action confirmation.** `MedicationsScreen.tsx:43-46` confirms via `window.confirm` before discontinuing a medication, but `RoutinesScreen.tsx:95`, `HealthLogScreen.tsx:80-86,136,155`, `CaregiversScreen.tsx:83`, and `AppointmentCard.tsx:70` all delete/cancel immediately on click with no confirmation — and these buttons sit directly adjacent to non-destructive Edit/Complete buttons in the same small flex row, so a mis-tap (more likely for this audience/a Parkinson's patient's own caregivers) silently deletes a record with no recovery path. Fix: apply the same `window.confirm` pattern to all four other call sites (until the parked "Undo for CRUD actions" entry above lands, which is the more durable fix).
- **Sub-minimum touch target on the highest-stakes daily control.** `CheckCircle` (`src/components/ui/CheckCircle.tsx:7`) is 28×28px — the control used multiple times a day to confirm Eleanor received Parkinson's/diabetes medication — well under the 44–48px senior-recommended size for a frequent, consequential control. Fix: enlarge to ≥44px and/or make the whole dose row (`MedicationsScreen.tsx:90-93`) clickable, not just the circle.
- **Icon-only Edit buttons with no visible label.** `MedicationsScreen.tsx:79` and `AppointmentCard.tsx:31` use `ActionButton` in `mode="icon"` at `size={24}` — smaller than the senior-recommended minimum and no persistently visible text (only `aria-label`/`title`, invisible to a sighted user scanning the screen), inconsistent with every other `ActionButton` in the app which uses `mode="icon-text"`. Fix: switch both to `icon-text` mode, matching the established pattern.
- **Bottom-nav label size.** Covered above (10px "More" label, smaller than the 12px it sits beside) — fold into the nav work above rather than fixing in isolation.

### Scope when built

Four small, independent fixes across `RoutinesScreen.tsx`, `HealthLogScreen.tsx`, `CaregiversScreen.tsx`, `AppointmentCard.tsx` (confirmation), `CheckCircle.tsx` + `MedicationsScreen.tsx` (touch target), and `MedicationsScreen.tsx`/`AppointmentCard.tsx` (icon-only buttons) — each shippable alone, no shared blocker.
