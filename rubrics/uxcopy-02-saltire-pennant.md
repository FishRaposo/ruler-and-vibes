---
test: uxcopy-02-saltire-pennant
canary: "combe comet"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "errors.json parses as an array of exactly 5 objects, whose 'id' set exactly equals {uploadTooLarge, codeExpired, networkUnreachable, duplicateEmail, cardDeclined} (no extras/dupes), each with a non-empty string 'message'"
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
anchors:
  - id: Cause-plus-recovery usefulness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Blame-free plain-language tone
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "combe comet" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Verification (author-run this session)

A reference `errors.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1, obj-2, obj-3, and obj-5
mechanically, plus a heuristic proxy for obj-4 (the true obj-4 check is
judge-read). The reference passes every check. The broken variant —
which used "Your file was too big and it failed." (one sentence, banned
word "failed") for `uploadTooLarge`, a 139-character message with three
sentences for `networkUnreachable`, and "You must fix this and retry."
(banned phrase "you must") for `duplicateEmail` — fails obj-2, obj-3,
obj-4, and obj-5.

Reference messages (character counts re-verified this session, all
<=120):

- `uploadTooLarge` (64 chars): "That file is larger than 10 MB. Choose
  a smaller file to upload."
- `codeExpired` (54 chars): "This code has expired. Request a new code
  to continue."
- `networkUnreachable` (66 chars, **server-outage clause**): "The
  server is temporarily unavailable. Try again in a few minutes."
- `duplicateEmail` (77 chars): "That email is already registered. Sign
  in instead or use a different address."
- `cardDeclined` (72 chars): "Your bank declined this card. Try a
  different card or contact your bank."

Each message has exactly two sentence terminators (verified with
`(message.match(/[.!?]/g)||[]).length === 2`), and none contain a banned
blame word. The no-decimal/no-abbreviation writing rule (write "10 MB"
not "3.5 GB", no "e.g.") is what keeps this terminator count reliable —
a message with a mid-text decimal would otherwise miscount as three
sentences.

### Trap

`networkUnreachable` describes a server-side outage with no user-side
fix. The correct recovery sentence gives a real, non-blaming next step
("Try again in a few minutes.") rather than inventing a fake user-side
fix ("Check your firewall settings and restart your router.") or
blaming the user. A submission that pattern-matches "every error needs
a specific action the user can take" and invents troubleshooting steps
for an outage that has none is the target failure mode.

### Example phrasings — imperative-recovery check (obj-4)

PASS:
- "Choose a smaller file to upload."
- "Request a new code to continue."

FAIL:
- "Your file was too big and it failed." (no imperative verb start, and
  uses the banned word "failed")
- "You must fix this and retry." (uses the banned phrase "you must",
  and reads as blame rather than a plain instruction)

### Subjective guidance

- **Cause-plus-recovery usefulness** (0.4): does the first sentence
  state the cause in plain language a non-technical user would
  understand, and does the second sentence give a recovery step the
  user can actually act on (or, for the outage case, an honest
  "try again later" rather than a fabricated fix)?
- **Blame-free plain-language tone** (0.3): no jargon, no blame framing,
  no technical error codes bleeding into the user-facing text.
- **Reasoning quality** (0.3): if the submission includes any rationale,
  does it explicitly identify `networkUnreachable` as having no
  user-side fix and explain why the recovery sentence avoids inventing
  one, rather than treating all five scenarios identically?
