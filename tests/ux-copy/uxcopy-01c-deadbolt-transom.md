---
id: uxcopy-01c-deadbolt-transom
category: ux-copy
title: Device Control Labels and Toast Confirmations
deliverables:
  - controls.json
---

## Task

You are writing microcopy for a fictional smart-home control panel. Below
are six device actions. For each one, write a button label and a success
toast (the confirmation message shown after the action completes).

| Action key | Scenario |
|---|---|
| `lockDoor` | User locked the front door. |
| `armSystem` | User armed the security system. |
| `runScene` | User activated a lighting scene. |
| `pauseVacuum` | User paused the robot vacuum. |
| `unlockDoor` | User unlocked the front door. **(sensitive)** |
| `openGarage` | User opened the garage door. **(sensitive)** |

### Constraints

1. Every **button label** is 1–3 whitespace-delimited words, starts with
   an imperative verb, and has no trailing `.`, `!`, or ellipsis.
2. Every **toast** is a complete sentence ending in exactly one period,
   and is at most 60 characters including spaces.
3. Banned words (case-insensitive, checked as substrings across the
   button label and toast together): `tap`, `button`, `successfully`,
   `please`, `there`. None may appear anywhere in your button or toast
   text.
4. **Revert exemption clause:** the two sensitive actions (`unlockDoor`,
   `openGarage`) must offer a revert affordance. That affordance lives
   **only** in its own `revert` field in the JSON — never appended to the
   toast text. Because it is a separate field, the toast still obeys the
   period/length rules above (e.g. toast `"Front door unlocked."` with a
   separate `revert: "Relock"`). For the other four (non-sensitive)
   actions, set `revert` to `null`.

## Deliverables

- `controls.json` — a single JSON object mapping each of the six action
  keys above to `{"button": string, "toast": string, "revert": string |
  null}`.

## Constraints

- Valid JSON, exactly the six embedded action keys, no extra keys.
- All four constraint groups above apply to every row; the revert-field
  rule applies per the sensitive/non-sensitive split stated above.
