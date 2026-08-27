# Usability improvements — mobile, users 30+

## Context

The app is used daily by family caregivers and home health aides — many of whom are 35–60 years old, often in a hurry, sometimes in low light. The exploration found a cluster of clear problems: touch targets below the 44px minimum on the most-used interactions, text sizes that are too small for comfortable reading, muted text colors that narrowly fail WCAG AA contrast, and a few missing affordances (tap-to-call, severity labels). These are all fixable without changing the overall structure of the app.

---

## Changes

### 1. Medication dose checkboxes — 26px → 48px

The `CheckCircle` component is the single most-used interactive element in the app. At 26×26px it is far below the recommended 44px minimum. Change the default `size` to 48px and reshape it from a circle to a rounded-square ("checkbox-pill") to make the checked/unchecked state more obviously distinct on a small screen.

**File:** `src/App.tsx` — `CheckCircle` component + all call sites (only in `Medications`)

### 2. Nav tab labels — 10px → 12px, icons 22px → 24px

Tab labels are currently 10px — effectively unreadable for anyone with mild presbyopia. Increase to 12px. Bump icon stroke size from 22 to 24px to match. Also darken the inactive icon/label color from `#72737A` to `#5A5B61` for better contrast.

**File:** `src/App.tsx` — bottom tab bar render block

### 3. "Edit" / "+ Add" appointment buttons — add real tap targets

These text buttons have `padding: 2px 4px` — nearly zero tap area. Replace with styled pill-shaped buttons with `padding: 8px 14px` and a light background, so they look and feel like tappable buttons.

**File:** `src/App.tsx` — `AppointmentCard` component

### 4. Muted text — darken and upsize

- `--color-muted-foreground`: `#72737A` → `#5C5D65` (passes 4.5:1 AA on white)
- All 12px secondary text (timestamps, "logged by", section sub-labels) → 13px minimum
- Pill labels: 11px → 12px

**Files:** `src/index.css` (token), `src/App.tsx` (inline sizes on Pill, secondary text spans)

### 5. Filter chips and Routines tabs — minimum 44px height

Care Log filter chips: add `minHeight: 44px` and adjust padding.
Routines category tabs: same — `minHeight: 44px`.

**File:** `src/App.tsx` — filter chip render in `CareLog`, tab button render in `Routines`

### 6. Severity indicators — add text label on observation cards

The 5-segment bar on symptom cards is visual-only. Add a short text label ("Mild", "Moderate", "Significant", etc.) next to the bar so the meaning is unambiguous without relying on color alone.

**File:** `src/App.tsx` — `SeverityBar` component + `Symptoms` screen card render

### 7. Care Team — tap-to-call and tap-to-email

Phone numbers and email addresses in the expanded caregiver detail panel are plain text. Wrap them in `<a href="tel:...">` and `<a href="mailto:...">` links with appropriate styling (blue, underline on hover) so caregivers can call a doctor or aide directly from the app.

**File:** `src/App.tsx` — `Caregivers` component, expanded detail panel

### 8. Appointment Save/Cancel buttons — increase to 44px

Currently `padding: 8px 16px` gives ~36px height. Increase to `padding: 12px 20px`.

**File:** `src/App.tsx` — `saveBtnStyle` and `cancelBtnStyle` in `AppointmentCard`

---

## What is NOT changing

- Overall screen structure and navigation (tabs + More overflow) — the current IA is reasonable
- Font family (Inter is already a strong legible choice)
- Card layout and general spacing — already well-structured
- Form input sizes (already 16px — correct)

---

## Verification

1. Check the Medications screen: dose checkboxes should be visibly large and easy to tap
2. Check the bottom nav: labels should be clearly legible at arm's length
3. Check Appointments: "Edit" and "+ Add" should look like buttons, not links
4. Check Observations: each card should show a severity label in text
5. Check Care Team (via More): phone and email should be tappable blue links
6. On a real phone or device emulator: confirm no touch target feels small or hard to hit
