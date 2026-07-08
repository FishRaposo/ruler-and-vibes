---
test: uxcopy-02c-damson-plinth
canary: "gyroscope protractor"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "errors.json parses as an array of exactly 5 objects, whose 'id' set exactly equals {permitPhotoOversized, passExpired, gateServerUnreachable, plateAlreadyRegistered, tollCardDeclined} (no extras/dupes), each with a non-empty string 'message'"
    - id: obj-2
      check: "Every 'message' is <= 120 characters including spaces"
    - id: obj-3
      check: "Every 'message' contains exactly two sentence terminators ('.', '!', or '?'), and ends with one of them (JS: (message.match(/[.!?]/g)||[]).length === 2 && /[.!?]$/.test(message))"
    - id: obj-4
      check: "The second sentence of every message begins with a capitalized imperative verb; judge-adjudicated by reading the recovery sentence and comparing its opening against the embedded PASS/FAIL example phrasings, not a pure regex"
    - id: obj-5
      check: "None of the banned blame terms (violation, revoked, non-compliant, penalty, 'your responsibility', yikes) appear case-insensitively as substrings in any message"
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

Parallel form of `uxcopy-02-saltire-pennant` (same construct, fresh surface).

If the phrase "gyroscope protractor" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Verification (author-run this session)

A reference `errors.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1, obj-2, obj-3, and obj-5
mechanically, plus a heuristic proxy for obj-4 (the true obj-4 check is
judge-read). The reference passes every check. The broken variant —
which used "Your photo is now a violation and it's been revoked." (one
sentence, banned words "violation" and "revoked") for
`permitPhotoOversized`, a 172-character message with four sentence
terminators for `gateServerUnreachable`, and "It's your responsibility
to fix this and retry." (banned phrase "your responsibility") appended
after the cause sentence for `plateAlreadyRegistered` — fails obj-2,
obj-3, obj-4, and obj-5.

Reference messages (character counts re-verified this session, all
<=120):

- `permitPhotoOversized` (83 chars): "This vehicle photo is over the 8
  MB limit. Upload a lower-resolution image instead."
- `passExpired` (92 chars): "This temporary parking pass is past its
  expiry window. Apply for a new pass to keep parking."
- `gateServerUnreachable` (89 chars, **server-outage clause**): "The
  permit gate system is temporarily down on our end. Check back again
  in a few minutes."
- `plateAlreadyRegistered` (69 chars): "That plate is already
  registered. Renew your existing permit instead."
- `tollCardDeclined` (91 chars): "This toll card could not be charged
  for the fee. Add a different card or contact your bank."

Each message has exactly two sentence terminators (verified with
`(message.match(/[.!?]/g)||[]).length === 2`), and none contain a banned
blame word. The no-decimal/no-abbreviation writing rule (write "8 MB"
not "1.5 GB", no "e.g.") is what keeps this terminator count reliable —
a message with a mid-text decimal would otherwise miscount as three
sentences.

### Trap

`gateServerUnreachable` describes a server-side outage with no
user-side fix. The correct recovery sentence gives a real, non-blaming
next step ("Try again in a few minutes.") rather than inventing a fake
user-side fix ("Restart your router and reconnect to the gate network.")
or blaming the user. A submission that pattern-matches "every error
needs a specific action the user can take" and invents troubleshooting
steps for an outage that has none is the target failure mode.

### Example phrasings — imperative-recovery check (obj-4)

PASS:
- "Renew your existing permit instead."
- "Try a different card or contact your bank."

FAIL:
- "Your pass is now a violation and it's been revoked." (no imperative
  verb start, and uses the banned words "violation" and "revoked")
- "It's your responsibility to fix this and retry." (uses the banned
  phrase "your responsibility", and reads as blame rather than a plain
  instruction)

### Subjective guidance

- **Cause-plus-recovery usefulness** (0.4): does the first sentence
  state the cause in plain language a non-technical user would
  understand, and does the second sentence give a recovery step the
  user can actually act on (or, for the outage case, an honest
  "try again later" rather than a fabricated fix)?
- **Blame-free plain-language tone** (0.3): no jargon, no blame framing,
  no technical error codes bleeding into the user-facing text.
- **Reasoning quality** (0.3): if the submission includes any rationale,
  does it explicitly identify `gateServerUnreachable` as having no
  user-side fix and explain why the recovery sentence avoids inventing
  one, rather than treating all five scenarios identically?
