---
id: uxcopy-02-saltire-pennant
category: ux-copy
title: Error State Messages With Cause and Recovery
deliverables:
  - errors.json
---

## Task

Below are five fictional failure scenarios, each with a stable id and a
one-line technical description. Write one user-facing error message per
scenario.

| id | Technical description |
|---|---|
| `uploadTooLarge` | Upload rejected: file exceeds the 10 MB size limit. |
| `codeExpired` | The submitted verification code is past its expiry window. |
| `networkUnreachable` | Client cannot establish a connection to the server (server-side outage, no client-side fix exists). |
| `duplicateEmail` | Signup rejected: the email address already has an account. |
| `cardDeclined` | Payment gateway returned a decline response for the submitted card. |

### Writing rules

1. Each `message` is **at most 120 characters** including spaces.
2. Each `message` is **exactly two sentences**: a plain-language cause,
   then a concrete recovery action. The second (recovery) sentence must
   begin with a capitalized imperative verb.
3. **No mid-message periods inside numbers or abbreviations** — write
   "10 MB" not "3.5 GB", and do not use abbreviations like "e.g.". This
   keeps every period in the message a true sentence terminator.
4. **Server-outage clause:** `networkUnreachable` has no user-side fix.
   Its recovery sentence must give a real, non-blaming next step (for
   example, "Try again in a few minutes.") — do not invent a fake
   user-side fix and do not blame the user.
5. Banned words (case-insensitive substrings, checked across the whole
   message): `error`, `invalid`, `failed`, `illegal`, `you must`, `oops`.

### Example phrasings for the recovery sentence (guidance only)

PASS:
- "Choose a smaller file to upload."
- "Request a new code to continue."

FAIL:
- "Your file was too big and it failed." (no imperative verb start, and
  contains the banned word "failed")
- "You must fix this and retry." (contains the banned phrase "you must")

## Deliverables

- `errors.json` — a JSON array of exactly five objects, one per
  scenario, each `{"id": string, "message": string}"`, in any order.

## Constraints

- Valid JSON array of exactly 5 objects; the `id` set must exactly match
  the five ids above (no extras, no duplicates, no renames).
- All writing rules above apply to every message.
