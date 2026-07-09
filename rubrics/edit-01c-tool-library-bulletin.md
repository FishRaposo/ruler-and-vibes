---
test: edit-01c-tool-library-bulletin
canary: "quetzal wels"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "corrected.txt contains 'walkthrough for new volunteers', 'walkthrough for the lathe room', and 'next walkthrough' (all three rule-1 instances), and 'walk-through' returns zero matches file-wide (rule 1, paragraphs 1-2)"
    - id: obj-2
      check: "corrected.txt contains 'printed catalog' and 'equipment catalog', and 'catalogue' returns zero matches file-wide (rule 2, two instances: paragraphs 1 and 2)"
    - id: obj-3
      check: "corrected.txt contains 'six workbenches' and 'four mentors', and neither '6 workbenches' nor '4 mentors' appears (rule 3, two instances: paragraphs 1 and 2)"
    - id: obj-4
      check: "corrected.txt contains the exact reference string 'by phone, kiosk, or the website' — the serial comma inserted before the final item (rule 4, paragraph 2)"
    - id: obj-5
      check: "The control sentence 'Five members signed up for the session, and each one received a key fob, a safety card, and a locker.' appears in corrected.txt byte-for-byte identical to the source (no over-correction of an already-compliant sentence)"
  subjective:
    - id: sub-quality
      name: "Correctness and completeness of style-rule application"
      weight: 0.4
    - id: sub-craft
      name: "Editorial restraint and clean, unobtrusive corrections"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Correctness and completeness of style-rule application
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Editorial restraint and clean, unobtrusive corrections
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `edit-01-style-card` (same construct, fresh surface).

Frozen required-edit list (author-computed and verified against the
seeded passage; 8 edits total across the 4 rules):

1. **Rule 1 (walkthrough, one word):** paragraph 1, "hands-on
   walk-through for new volunteers" -> "hands-on walkthrough for new
   volunteers"
2. **Rule 1:** paragraph 1, "walk-through for the lathe room" ->
   "walkthrough for the lathe room"
3. **Rule 1:** paragraph 2, "next walk-through" -> "next walkthrough"
4. **Rule 2 (catalog, not catalogue):** paragraph 1, "printed
   catalogue of shared equipment" -> "printed catalog of shared
   equipment"
5. **Rule 2:** paragraph 2, "equipment catalogue needed reprinting" ->
   "equipment catalog needed reprinting"
6. **Rule 3 (spell out numbers under 10):** paragraph 1, "6
   workbenches" -> "six workbenches"
7. **Rule 3:** paragraph 2, "4 mentors" -> "four mentors"
8. **Rule 4 (serial comma):** paragraph 2, "by phone, kiosk or the
   website" -> "by phone, kiosk, or the website"

Already-compliant material that must be left untouched: "Five members
signed up for the session, and each one received a key fob, a safety
card, and a locker." already spells out the number and already carries
the serial comma. Any change to this sentence is an over-correction.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (walkthrough, one word)** — PASS: "hands-on
  walkthrough for new volunteers," "walkthrough for the lathe room,"
  "next walkthrough" all present; zero remaining hyphenated instances
  anywhere in the file. FAIL: "hands-on walk-through for new
  volunteers" still present unchanged; or a model that fixes two of
  the three instances but leaves one hyphenated (e.g. "walk-through
  for the lathe room" lingers) — the zero-match sweep catches this
  even if a single instance looks fixed in isolation.
- **obj-2 (catalog, not catalogue)** — PASS: "the printed catalog of
  shared equipment," "the equipment catalog needed reprinting." FAIL:
  "printed catalogue" unchanged; or corrected to "catalog" in one spot
  while the other stays "catalogue" (the file-wide zero-match check
  catches partial fixes).
- **obj-3 (spell out numbers under 10)** — PASS: "stocks six
  workbenches," "asked for four mentors." FAIL: "6 workbenches" or "4
  mentors" still present in digit form; or "six workbenches" fixed
  while "4 mentors" is missed.
- **obj-4 (serial comma)** — PASS: "by phone, kiosk, or the website"
  exactly. FAIL: "by phone, kiosk or the website" left without the
  comma; or a comma inserted in the wrong place, e.g. "by phone kiosk,
  or the website."
- **obj-5 (restraint on the control sentence)** — PASS: "Five members
  signed up for the session, and each one received a key fob, a safety
  card, and a locker." reproduced exactly. FAIL: "Five" changed to "5"
  (there is no rule against already-spelled-out numbers, so this is an
  invented edit); or the serial comma stripped to "a safety card and a
  locker" (removing a comma the rule requires, on a sentence that
  already complied).

If the phrase "quetzal wels" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- **Correctness and completeness of style-rule application**: reward
  a copyedit that makes exactly the 8 required edits (across the 5
  checks above), no more and no less. A single missed instance or a
  single edit not licensed by the style card should weigh meaningfully
  against this dimension beyond its share of the objective score.
- **Editorial restraint and clean, unobtrusive corrections**: reward
  a result indistinguishable from a careful human editor who touched
  only what the four rules require — no rewording, no reordering, no
  "fixing" of the already-compliant control sentence, no stylistic
  flourishes layered on top of the mechanical pass, as quiet and
  precise as a workbench wiped clean and left exactly as the last
  volunteer found it.
- **Reasoning quality**: does the model's process show it checked the
  passage against each of the 4 rules individually, identified every
  instance of each violation (not just the first), and explicitly
  recognized which sentences already complied and needed no change?
