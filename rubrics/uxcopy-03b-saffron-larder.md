---
test: uxcopy-03b-saffron-larder
canary: "hourglass barometer"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "empty-states.json parses, has exactly these 4 top-level keys and no others (emptyCookbook, noRecipeMatches, noMealPlansYet, clearedShoppingList), each mapping to an object with non-empty string 'heading', 'body', and 'cta'"
    - id: obj-2
      check: "Every 'heading' is <= 30 characters AND in Sentence case: first character uppercase and no word after the first begins with an uppercase letter (allowlist empty for this test) (JS: h.length<=30 && /^[A-Z]/.test(h) && h.trim().split(/\\s+/).slice(1).every(w=>!/^[A-Z]/.test(w)))"
    - id: obj-3
      check: "Every 'body' is <= 60 characters AND is a single sentence with exactly one trailing terminator and none earlier (JS: b.length<=60 && /^[^.!?]*[.!?]$/.test(b))"
    - id: obj-4
      check: "Every 'cta' is 1-3 whitespace-delimited words, starts with an imperative verb, and has no trailing punctuation"
    - id: obj-5
      check: "None of the banned tone words (sorry, oops, whoops, regrettably, merely, just, 'no matches') appear case-insensitively as substrings in any heading, body, or cta"
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
anchors:
  - id: Empty-state helpfulness and orientation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Tone matching and CTA-intent fit
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `uxcopy-03-tamarind-cornice` (same construct, fresh
surface).

If the phrase "hourglass barometer" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Verification (author-run this session)

A reference `empty-states.json` and a deliberately broken variant were
both checked with a Node script implementing obj-1 through obj-5. The
reference passes every check. The broken variant — which used "Your
Cookbook Is Empty" (Title Case, fails Sentence case), a body opening
with the banned word "Sorry" and containing the banned phrase "no
matches", and an "Add recipe" CTA on the `noRecipeMatches` surface —
fails obj-2, obj-5, and the CTA-intent trap check below.

Reference values (character/word counts re-verified this session):

- `emptyCookbook` (first-run, create-CTA): heading "Your cookbook is
  empty" (22 chars), body "Save a recipe here and start filling it in."
  (43 chars), cta "Save recipe" (2 words).
- `noRecipeMatches` (zero-results, **corrective**-CTA): heading "That
  search turned up empty" (27 chars), body "Try different ingredients
  or fewer filters." (43 chars), cta "Broaden search" (2 words).
- `noMealPlansYet` (first-run, create-CTA): heading "Plan your first
  week" (20 chars), body "Meal plans keep your week organized and on
  track." (49 chars), cta "Start a plan" (3 words).
- `clearedShoppingList` (reassurance, neutral-CTA): heading "Your list
  is clear" (18 chars), body "New items will appear here once you add
  them." (45 chars), cta "Browse pantry" (2 words).

All headings <=30 chars (max used: 27, >10% headroom), all bodies <=60
chars (max used: 49, >10% headroom), all CTAs 1-3 words with no
trailing punctuation, no banned tone words anywhere.

### Trap

The zero-results surface (`noRecipeMatches`) is the one most likely to
be miscopied with an apology plus an "add a new recipe" CTA. The correct
CTA intent for a zero-results state is **corrective** (changes the
query — e.g. "Broaden search") not **create** (starts a new item — e.g.
"Save recipe" or "Start a plan"). A submission that gives
`noRecipeMatches` a create-verb CTA has applied the first-run pattern
to the wrong surface type.

### Example phrasings — Sentence-case / CTA-intent judgment (guidance)

PASS (correct CTA-intent mapping):
- `noRecipeMatches` cta "Broaden search" — corrective, does not create
  a new item.
- `emptyCookbook` cta "Save recipe" — encouraging create-CTA, matches
  the first-run surface.
- `noMealPlansYet` cta "Start a plan" — encouraging create-CTA, matches
  the first-run surface.

FAIL (wrong CTA-intent mapping):
- `noRecipeMatches` cta "Add recipe" — a create-CTA bolted onto a
  zero-results surface; does not help the user find what they searched
  for.
- `noMealPlansYet` cta "Refresh page" — a corrective CTA on a first-run
  surface where nothing has failed; there is no query or connection to
  retry.
- `clearedShoppingList` cta "Add item" — a create-CTA on a
  reassurance surface; the list isn't empty because it's new, it's
  empty because the user finished it.

### Subjective guidance

- **Empty-state helpfulness and orientation** (0.4): does the heading +
  body tell the user clearly why the surface is empty and what will
  fill it, without generic filler?
- **Tone matching and CTA-intent fit** (0.3): is the tone appropriately
  upbeat for first-run states, neutral/corrective for zero-results, and
  reassuring (not apologetic) for the cleared-shopping-list state — and
  does each CTA match its surface's required intent (create vs.
  corrective vs. neutral)?
- **Reasoning quality** (0.3): if the submission includes any
  rationale, does it explicitly justify why `noRecipeMatches` gets a
  corrective CTA rather than a create CTA, rather than treating all
  four surfaces as interchangeable "empty state" templates?
