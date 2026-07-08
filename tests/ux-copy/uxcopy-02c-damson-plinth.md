---
id: uxcopy-02c-damson-plinth
category: ux-copy
title: Parking Permit Error Messages With Cause and Recovery
deliverables:
  - errors.json
---

## Task

Below are five fictional failure scenarios, each with a stable id and a
one-line technical description. Write one user-facing error message per
scenario.

| id | Technical description |
|---|---|
| `permitPhotoOversized` | Upload rejected: vehicle photo exceeds the 8 MB size limit. |
| `passExpired` | The submitted temporary parking pass is past its expiry window. |
| `gateServerUnreachable` | Client cannot establish a connection to the permit gate server (server-side outage, no client-side fix exists). |
| `plateAlreadyRegistered` | Registration rejected: the license plate already has an active permit. |
| `tollCardDeclined` | Payment gateway returned a decline response for the submitted toll card. |

### Writing rules

1. Each `message` is **at most 120 characters** including spaces.
2. Each `message` is **exactly two sentences**: a plain-language cause,
   then a concrete recovery action. The second (recovery) sentence must
   begin with a capitalized imperative verb.
3. **No mid-message periods inside numbers or abbreviations** — write
   "8 MB" not "1.5 GB", and do not use abbreviations like "e.g.". This
   keeps every period in the message a true sentence terminator.
4. **Server-outage clause:** `gateServerUnreachable` has no user-side
   fix. Its recovery sentence must give a real, non-blaming next step
   (for example, "Try again in a few minutes.") — do not invent a fake
   user-side fix and do not blame the user.
5. Banned words (case-insensitive substrings, checked across the whole
   message): `violation`, `revoked`, `non-compliant`, `penalty`, `your responsibility`, `yikes`.

### Example phrasings for the recovery sentence (guidance only)

PASS:
- "Renew your existing permit instead."
- "Try a different card or contact your bank."

FAIL:
- "Your pass is now a violation and it's been revoked." (no imperative
  verb start, and contains the banned words "violation" and "revoked")
- "It's your responsibility to fix this and retry." (contains the
  banned phrase "your responsibility")

## Deliverables

- `errors.json` — a JSON array of exactly five objects, one per
  scenario, each `{"id": string, "message": string}"`, in any order.

## Constraints

- Valid JSON array of exactly 5 objects; the `id` set must exactly match
  the five ids above (no extras, no duplicates, no renames).
- All writing rules above apply to every message.
