---
id: uxcopy-02b-cresset-vigil
category: ux-copy
title: Smart Home Alert Messages With Cause and Recovery
deliverables:
  - errors.json
---

## Task

Below are five fictional failure scenarios from a smart-home security
app, each with a stable id and a one-line technical description. Write
one user-facing error message per scenario.

| id | Technical description |
|---|---|
| `clipTooLong` | Recording rejected: clip duration exceeds the 5-minute limit. |
| `pinExpired` | The submitted entry PIN is past its validity window. |
| `hubUnreachable` | Client cannot establish a connection to the home hub (hub-side outage, no client-side fix exists). |
| `zoneNameTaken` | Zone creation rejected: the zone name already exists on the account. |
| `armRequestDeclined` | Monitoring service returned a decline response for the submitted arm request. |

### Writing rules

1. Each `message` is **at most 120 characters** including spaces.
2. Each `message` is **exactly two sentences**: a plain-language cause,
   then a concrete recovery action. The second (recovery) sentence must
   begin with a capitalized imperative verb.
3. **No mid-message periods inside numbers or abbreviations** — write
   "5-minute" not "5.5-minute", and do not use abbreviations like "e.g.".
   This keeps every period in the message a true sentence terminator.
4. **Hub-outage clause:** `hubUnreachable` has no user-side fix. Its
   recovery sentence must give a real, non-blaming next step (for
   example, "Retry the connection in a few minutes.") — do not invent a
   fake user-side fix and do not blame the user.
5. Banned words (case-insensitive substrings, checked across the whole
   message): `malfunction`, `tampered`, `corrupted`, `breach`, `your fault`, `whoops`.

### Example phrasings for the recovery sentence (guidance only)

PASS:
- "Trim it before saving again."
- "Get a new one and try again."

FAIL:
- "Your clip was too long and it malfunctioned." (no imperative verb
  start, and contains the banned word "malfunction")
- "Your fault — pick another name for this zone." (contains the banned
  phrase "your fault")

## Deliverables

- `errors.json` — a JSON array of exactly five objects, one per
  scenario, each `{"id": string, "message": string}"`, in any order.

## Constraints

- Valid JSON array of exactly 5 objects; the `id` set must exactly match
  the five ids above (no extras, no duplicates, no renames).
- All writing rules above apply to every message.
