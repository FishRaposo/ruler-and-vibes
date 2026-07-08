---
test: uxcopy-02b-cresset-vigil
canary: "pendulum metronome"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "errors.json parses as an array of exactly 5 objects, whose 'id' set exactly equals {clipTooLong, pinExpired, hubUnreachable, zoneNameTaken, armRequestDeclined} (no extras/dupes), each with a non-empty string 'message'"
    - id: obj-2
      check: "Every 'message' is <= 120 characters including spaces"
    - id: obj-3
      check: "Every 'message' contains exactly two sentence terminators ('.', '!', or '?'), and ends with one of them (JS: (message.match(/[.!?]/g)||[]).length === 2 && /[.!?]$/.test(message))"
    - id: obj-4
      check: "The second sentence of every message begins with a capitalized imperative verb; judge-adjudicated by reading the recovery sentence and comparing its opening against the embedded PASS/FAIL example phrasings, not a pure regex"
    - id: obj-5
      check: "None of the banned blame terms (error, invalid, failed, illegal, 'you must', oops) appear case-insensitively as substrings in any message"
  subjective:
    - id: sub-quality
      name: "Cause-plus-recovery usefulness"
      weight: 0.4
    - id: sub-craft
      name: "Blame-free plain-language tone"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `uxcopy-02-saltire-pennant` (same construct, fresh
surface).

If the phrase "pendulum metronome" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Verification (author-run this session)

A reference `errors.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1, obj-2, obj-3, and obj-5
mechanically, plus a heuristic proxy for obj-4 (the true obj-4 check is
judge-read). The reference passes every check. The broken variant —
which used "Your clip was too long and it failed." (one sentence, banned
word "failed") for `clipTooLong`, a 157-character, three-sentence
message containing the banned word "error" and inventing a fake
user-side fix ("Please restart your router.") for `hubUnreachable`, and
"You must pick another name because this one is invalid." (one
sentence, banned phrase "you must", banned word "invalid") for
`zoneNameTaken` — fails obj-2, obj-3, obj-4, and obj-5.

Reference messages (character counts re-verified this session, all
<=120):

- `clipTooLong` (73 chars): "This clip is longer than the 5-minute
  limit. Trim it before saving again."
- `pinExpired` (50 chars): "This PIN has expired. Get a new one and try
  again."
- `hubUnreachable` (79 chars, **hub-outage clause**): "The home hub is
  temporarily unreachable. Retry the connection in a few minutes."
- `zoneNameTaken` (69 chars): "That zone name is already taken. Pick a
  different name and try again."
- `armRequestDeclined` (93 chars): "The monitoring service declined this
  arm request. Check your device connection and try again."

Each message has exactly two sentence terminators (verified with
`(message.match(/[.!?]/g)||[]).length === 2`), and none contain a banned
blame word. The no-decimal/no-abbreviation writing rule (write
"5-minute" not "5.5-minute", no "e.g.") is what keeps this terminator
count reliable — a message with a mid-text decimal would otherwise
miscount as three sentences.

### Trap

`hubUnreachable` describes a hub-side outage with no user-side fix. The
correct recovery sentence gives a real, non-blaming next step ("Retry
the connection in a few minutes.") rather than inventing a fake
user-side fix ("Restart your router and check your wifi settings.") or
blaming the user. A submission that pattern-matches "every error needs a
specific action the user can take" and invents troubleshooting steps for
an outage that has none is the target failure mode.

### Example phrasings — imperative-recovery check (obj-4)

PASS:
- "Trim it before saving again."
- "Get a new one and try again."

FAIL:
- "Your clip was too long and it failed." (no imperative verb start, and
  uses the banned word "failed")
- "You must pick another name for this zone." (uses the banned phrase
  "you must", and reads as blame rather than a plain instruction)

### Subjective guidance

- **Cause-plus-recovery usefulness** (0.4): does the first sentence
  state the cause in plain language a non-technical user would
  understand, and does the second sentence give a recovery step the
  user can actually act on (or, for the outage case, an honest
  "try again later" rather than a fabricated fix)?
- **Blame-free plain-language tone** (0.3): no jargon, no blame framing,
  no technical error codes bleeding into the user-facing text.
- **Reasoning quality** (0.3): if the submission includes any rationale,
  does it explicitly identify `hubUnreachable` as having no user-side
  fix and explain why the recovery sentence avoids inventing one, rather
  than treating all five scenarios identically?
