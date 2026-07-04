---
id: uxcopy-01-quatrefoil-latch
category: ux-copy
title: Button Labels and Toast Confirmations
deliverables:
  - labels.json
---

## Task

You are writing microcopy for a generic in-app action bar. Below are six
fictional actions. For each one, write a button label and a success
toast (the confirmation message shown after the action completes).

| Action key | Scenario |
|---|---|
| `saveDraft` | User saved a draft. |
| `publishPost` | User published a post. |
| `inviteTeammate` | User invited a teammate to a workspace. |
| `archiveProject` | User archived a project. |
| `removeTeammate` | User removed a teammate from a workspace. **(destructive)** |
| `deleteDraft` | User deleted a draft. **(destructive)** |

### Constraints

1. Every **button label** is 1–3 whitespace-delimited words, starts with
   an imperative verb, and has no trailing `.`, `!`, or ellipsis.
2. Every **toast** is a complete sentence ending in exactly one period,
   and is at most 60 characters including spaces.
3. Banned words (case-insensitive, checked as substrings across the
   button label and toast together): `click`, `button`, `successfully`,
   `please`, `here`. None may appear anywhere in your button or toast
   text.
4. **Undo exemption clause:** the two destructive actions
   (`removeTeammate`, `deleteDraft`) must offer an undo affordance. That
   affordance lives **only** in its own `undo` field in the JSON — never
   appended to the toast text. Because it is a separate field, the toast
   still obeys the period/length rules above (e.g. toast `"Draft
   deleted."` with a separate `undo: "Undo"`). For the other four
   (non-destructive) actions, set `undo` to `null`.

## Deliverables

- `labels.json` — a single JSON object mapping each of the six action
  keys above to `{"button": string, "toast": string, "undo": string |
  null}`.

## Constraints

- Valid JSON, exactly the six embedded action keys, no extra keys.
- All four constraint groups above apply to every row; the undo-field
  rule applies per the destructive/non-destructive split stated above.
