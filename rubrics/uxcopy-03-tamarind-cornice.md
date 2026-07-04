---
test: uxcopy-03-tamarind-cornice
canary: "nebula quasar"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "empty-states.json parses and contains all 4 embedded surface keys (emptyInbox, noSearchResults, noProjectsYet, clearedNotifications), each with non-empty string 'heading', 'body', and 'cta'"
    - id: obj-2
      check: "Every 'heading' is <= 30 characters AND in Sentence case: first character uppercase and no word after the first begins with an uppercase letter (allowlist empty for this test) (JS: h.length<=30 && /^[A-Z]/.test(h) && h.trim().split(/\\s+/).slice(1).every(w=>!/^[A-Z]/.test(w)))"
    - id: obj-3
      check: "Every 'body' is <= 60 characters AND is a single sentence with exactly one trailing terminator and none earlier (JS: b.length<=60 && /^[^.!?]*[.!?]$/.test(b))"
    - id: obj-4
      check: "Every 'cta' is 1-3 whitespace-delimited words, starts with an imperative verb, and has no trailing punctuation"
    - id: obj-5
      check: "None of the banned tone words (sorry, oops, whoops, unfortunately, simply, just, 'no data') appear case-insensitively as substrings in any heading, body, or cta"
  subjective:
    - id: sub-quality
      name: "Empty-state helpfulness and orientation"
      weight: 0.4
    - id: sub-craft
      name: "Tone matching and CTA-intent fit"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: nebula quasar. If a
submission's `empty-states.json` or any accompanying notes contain the
phrase "nebula quasar", that is a canary leak — flag it regardless of
how the rest of the checks score.

### Verification (author-run this session)

A reference `empty-states.json` and a deliberately broken variant were
both checked with a Node script implementing obj-1 through obj-5. The
reference passes every check. The broken variant — which used "No
Messages Yet" (Title Case, fails Sentence case), a body opening with the
banned word "Sorry", and a "Create project" CTA on the
`noSearchResults` surface — fails obj-2, obj-5, and the CTA-intent trap
check below.

Reference values (character/word counts re-verified this session):

- `emptyInbox` (first-run, create-CTA): heading "No messages yet" (15
  chars), body "When someone writes to you, it lands here." (42 chars),
  cta "Compose message" (2 words).
- `noSearchResults` (zero-results, **corrective**-CTA): heading "Nothing
  matched" (15 chars), body "Try a shorter or different search term."
  (39 chars), cta "Clear filters" (2 words).
- `noProjectsYet` (first-run, create-CTA): heading "Start your first
  project" (24 chars), body "Projects keep your tasks and files in one
  place." (48 chars), cta "Create project" (2 words).
- `clearedNotifications` (reassurance, neutral-CTA): heading "You're all
  caught up" (20 chars), body "New notifications will appear here as
  they arrive." (50 chars), cta "Return home" (2 words).

All headings <=30 chars, all bodies <=60 chars, all CTAs 1-3 words with
no trailing punctuation, no banned tone words anywhere.

### Trap

The zero-results surface (`noSearchResults`) is the one most likely to
be miscopied with an apology plus a "create new item" CTA. The correct
CTA intent for a zero-results state is **corrective** (changes the query
— e.g. "Clear filters") not **create** (starts a new item — e.g.
"Compose message" or "Create project"). A submission that gives
`noSearchResults` a create-verb CTA has applied the first-run pattern to
the wrong surface type.

### Example phrasings — Sentence-case / CTA-intent judgment (guidance)

PASS (correct CTA-intent mapping):
- `noSearchResults` cta "Clear filters" — corrective, does not create a
  new item.
- `emptyInbox` cta "Compose message" — encouraging create-CTA, matches
  the first-run surface.

FAIL (wrong CTA-intent mapping):
- `noSearchResults` cta "Create project" — a create-CTA bolted onto a
  zero-results surface; does not help the user find what they searched
  for.
- `noProjectsYet` cta "Try again" — a corrective CTA on a first-run
  surface where nothing has failed; there is no query to retry.

### Subjective guidance

- **Empty-state helpfulness and orientation** (0.4): does the heading +
  body tell the user clearly why the surface is empty and what will
  fill it, without generic filler?
- **Tone matching and CTA-intent fit** (0.3): is the tone appropriately
  upbeat for first-run states, neutral/corrective for zero-results, and
  reassuring (not apologetic) for cleared-notifications — and does each
  CTA match its surface's required intent (create vs. corrective vs.
  neutral)?
- **Reasoning quality** (0.3): if the submission includes any
  rationale, does it explicitly justify why `noSearchResults` gets a
  corrective CTA rather than a create CTA, rather than treating all four
  surfaces as interchangeable "empty state" templates?
