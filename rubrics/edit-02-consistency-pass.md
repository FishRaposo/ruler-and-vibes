---
test: edit-02-consistency-pass
canary: "petunia verbena"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The character name appears in corrected.txt in exactly ONE spelling, 'Katarina Voss' (the first-occurrence form), 5 total occurrences; 'Katerina Voss' returns zero matches"
    - id: obj-2
      check: "The compound term appears throughout corrected.txt in exactly ONE form, 'night-shift' (the first-occurrence form), 4 total occurrences; the closed form 'nightshift' returns zero matches"
    - id: obj-3
      check: "The unit is normalized to the single first-occurrence form 'kg' everywhere: 'kg' occurs 3 times (as '40 kg', '41 kg', '40 kg') and 'kilograms' returns zero matches"
    - id: obj-4
      check: "The already-consistent control sentence 'Forklifts that once sat idle each morning are now back in rotation before the first delivery truck arrives.' appears in corrected.txt byte-for-byte identical to the source (whitespace/line-wrap differences aside), confirming no spurious edits"
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
---

## Judge guidance

Frozen reference (author-computed and verified against the seeded
passage; three independent inconsistency axes, each resolved by the
stated first-occurrence rule):

1. **Name axis:** "Katarina Voss" occurs first (paragraph 1, sentence
   1) and 3 more times thereafter (4 correct-form occurrences total);
   "Katerina Voss" occurs once, in paragraph 2 ("Katerina Voss also
   rewrote the intake checklist..."). First-occurrence form is
   "Katarina Voss" -> normalize the lone variant, yielding 5 total
   occurrences of "Katarina Voss" and zero of "Katerina Voss."
2. **Compound-term axis:** "night-shift" (hyphenated) occurs first
   (paragraph 1, "took over the warehouse night-shift") and 2 more
   times thereafter (3 hyphenated occurrences total); "nightshift"
   (closed) occurs once, in paragraph 2 ("the whole nightshift had
   memorized it"). First-occurrence form is "night-shift" -> normalize
   the closed variant, yielding 4 total occurrences of "night-shift"
   and zero of "nightshift."
3. **Unit axis:** "kg" occurs first (paragraph 1, "roughly 40 kg") and
   once more later in the same paragraph ("post the 40 kg limit"),
   2 occurrences total before the variant; "kilograms" occurs once, in
   paragraph 2 ("one outlier stack at 41 kilograms"). First-occurrence
   form is "kg" -> normalize "41 kilograms" to "41 kg," yielding 3
   total occurrences of "kg" and zero of "kilograms."

Control sentence (already fully consistent, touches none of the three
axes): "Forklifts that once sat idle each morning are now back in
rotation before the first delivery truck arrives." Any change to this
sentence — added words, reordering, punctuation changes — is a
spurious edit not licensed by any detected inconsistency.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (name)** — PASS: every occurrence reads "Katarina Voss,"
  including the paragraph-2 sentence that started as "Katerina Voss
  also rewrote..." now reading "Katarina Voss also rewrote..." FAIL:
  "Katerina Voss" still present anywhere; or the model "fixes" it in
  the wrong direction by changing the other four instances to
  "Katerina Voss" instead (violates the first-occurrence rule even
  though it achieves uniformity).
- **obj-2 (compound term)** — PASS: "the whole night-shift had
  memorized it" (closed form normalized to hyphenated); all other
  instances remain "night-shift." FAIL: "nightshift" still present
  anywhere; or all instances collapsed to the closed form "nightshift"
  (uniform, but normalizes to the wrong-priority form).
- **obj-3 (unit)** — PASS: "one outlier stack at 41 kg" (kilograms
  spelled out form normalized to "kg"). FAIL: "41 kilograms" still
  present unchanged; or all instances expanded to "kilograms" instead
  of collapsed to "kg."
- **obj-4 (restraint on the control sentence)** — PASS: the forklift
  sentence reproduced with no wording changes, only possibly rewrapped
  onto different lines. FAIL: any added clause, e.g. "Forklifts that
  once sat idle each morning, running like clockwork, are now back in
  rotation..."; or a punctuation change such as inserting a comma that
  wasn't there.

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
  sentence and ordinary rewrapping that doesn't alter wording — as
  uniform and unforced as a bed of petunia verbena grown from a single
  cutting.
- **Reasoning quality**: does the model's process show it scanned for
  inconsistencies methodically (rather than fixing only the first
  instance it noticed), applied the first-occurrence rule explicitly
  and separately per axis, and can point to the specific first
  occurrence it anchored each normalization to?
