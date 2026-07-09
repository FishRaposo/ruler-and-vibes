---
test: edit-02c-glassworks-consistency
canary: "howlite ramie"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The character name appears in corrected.txt in exactly ONE spelling, 'Cordelia Fairweather' (the first-occurrence form), 5 total occurrences; 'Cordilia Fairweather' returns zero matches"
    - id: obj-2
      check: "The compound term appears throughout corrected.txt in exactly ONE form, 'light-box' (the first-occurrence form), 4 total occurrences; the closed form 'lightbox' returns zero matches"
    - id: obj-3
      check: "The unit is normalized to the single first-occurrence form 'mm' everywhere: 'mm' occurs 3 times (as '3 mm', '4 mm', '3 mm') and 'millimetres' (or 'millimetre') returns zero matches"
    - id: obj-4
      check: "The already-consistent control sentence 'Trays of came that once sat unsorted every Saturday are now filed before the first commission is opened.' appears in corrected.txt byte-for-byte identical to the source (whitespace/line-wrap differences aside), confirming no spurious edits"
  subjective:
    - id: sub-quality
      name: "Accuracy of inconsistency detection across multiple axes"
      weight: 0.4
    - id: sub-craft
      name: "Uniform normalization without collateral edits"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Accuracy of inconsistency detection across multiple axes
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Uniform normalization without collateral edits
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `edit-02-consistency-pass` (same construct, fresh
surface).

Frozen reference (author-computed and verified against the seeded
passage; three independent inconsistency axes, each resolved by the
stated first-occurrence rule):

1. **Name axis:** "Cordelia Fairweather" occurs first (paragraph 1,
   sentence 1) and 3 more times thereafter (4 correct-form occurrences
   total); "Cordilia Fairweather" occurs once, in paragraph 2
   ("Cordilia Fairweather also redrew the pattern index..."). First-
   occurrence form is "Cordelia Fairweather" -> normalize the lone
   variant, yielding 5 total occurrences of "Cordelia Fairweather" and
   zero of "Cordilia Fairweather."
2. **Compound-term axis:** "light-box" (hyphenated) occurs first
   (paragraph 1, "re-laid the light-box") and 2 more times thereafter
   (3 hyphenated occurrences total); "lightbox" (closed) occurs once,
   in paragraph 2 ("the layout of the lightbox memorized"). First-
   occurrence form is "light-box" -> normalize the closed variant,
   yielding 4 total occurrences of "light-box" and zero of "lightbox."
3. **Unit axis:** "mm" occurs first (paragraph 1, "roughly 3 mm") and
   once more later (paragraph 3, "the 3 mm rule"), 2 occurrences total
   before the variant; "millimetres" occurs once, in paragraph 2 ("one
   offcut milled to 4 millimetres"). First-occurrence form is "mm" ->
   normalize "4 millimetres" to "4 mm," yielding 3 total occurrences of
   "mm" and zero of "millimetres."

Control sentence (already fully consistent, touches none of the three
axes): "Trays of came that once sat unsorted every Saturday are now
filed before the first commission is opened." Any change to this
sentence — added words, reordering, punctuation changes — is a
spurious edit not licensed by any detected inconsistency.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (name)** — PASS: every occurrence reads "Cordelia
  Fairweather," including the paragraph-2 sentence that started as
  "Cordilia Fairweather also redrew..." now reading "Cordelia
  Fairweather also redrew..." FAIL: "Cordilia Fairweather" still
  present anywhere; or the model "fixes" it in the wrong direction by
  changing the other four instances to "Cordilia Fairweather" instead
  (violates the first-occurrence rule even though it achieves
  uniformity).
- **obj-2 (compound term)** — PASS: "the layout of the light-box
  memorized" (closed form normalized to hyphenated); all other
  instances remain "light-box." FAIL: "lightbox" still present
  anywhere; or all instances collapsed to the closed form "lightbox"
  (uniform, but normalizes to the wrong-priority form).
- **obj-3 (unit)** — PASS: "one offcut milled to 4 mm" (millimetres
  spelled-out form normalized to "mm"). FAIL: "4 millimetres" still
  present unchanged; or all instances expanded to "millimetres" instead
  of collapsed to "mm."
- **obj-4 (restraint on the control sentence)** — PASS: the trays-of-
  came sentence reproduced with no wording changes, only possibly
  rewrapped onto different lines. FAIL: any added clause, e.g. "Trays
  of came that once sat unsorted every Saturday are now, at last, filed
  before the first commission is opened."; or a punctuation change such
  as inserting a comma that wasn't there.

If the phrase "howlite ramie" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- **Accuracy of inconsistency detection across multiple axes**: reward
  a pass that correctly identifies all three axes (name, compound
  term, unit) without being told what they are, and gets the
  first-occurrence direction right on each — not just achieving
  uniformity, but uniformity in the correct direction. Penalize
  meaningfully for any axis resolved by majority-vote or "which looks
  more standard" reasoning instead of the stated rule.
- **Uniform normalization without collateral edits**: reward complete,
  uniform normalization (no lingering variant anywhere) paired with
  zero collateral changes to unrelated text, including the control
  sentence and ordinary rewrapping that doesn't alter wording.
- **Reasoning quality**: does the model's process show it scanned for
  inconsistencies methodically (rather than fixing only the first
  instance it noticed), applied the first-occurrence rule explicitly
  and separately per axis, and can point to the specific first
  occurrence it anchored each normalization to?
