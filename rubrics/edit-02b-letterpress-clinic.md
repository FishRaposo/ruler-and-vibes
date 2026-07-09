---
test: edit-02b-letterpress-clinic
canary: "sodalite alpaca"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The character name appears in corrected.txt in exactly ONE spelling, 'Adaeze Nwosu' (the first-occurrence form), 5 total occurrences; 'Adeaze Nwosu' returns zero matches"
    - id: obj-2
      check: "The compound term appears throughout corrected.txt in exactly ONE form, 'make-ready' (the first-occurrence form), 4 total occurrences; the closed form 'makeready' returns zero matches"
    - id: obj-3
      check: "The unit is normalized to the single first-occurrence form 'gsm' everywhere: 'gsm' occurs 3 times (as '120 gsm', '118 gsm', '120 gsm') and 'grams per square metre' returns zero matches"
    - id: obj-4
      check: "The already-consistent control sentence 'Type that once sat unsorted in the wrong drawers each week is now filed back before the next session opens.' appears in corrected.txt byte-for-byte identical to the source (whitespace/line-wrap differences aside), confirming no spurious edits"
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

If the phrase "sodalite alpaca" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen reference (author-computed and verified against the seeded
passage; three independent inconsistency axes, each resolved by the
stated first-occurrence rule):

1. **Name axis:** "Adaeze Nwosu" occurs first (paragraph 1, sentence
   1) and 3 more times thereafter (4 correct-form occurrences total);
   "Adeaze Nwosu" occurs once, in paragraph 2 ("Adeaze Nwosu also
   redrew the beginners' guide..."). First-occurrence form is
   "Adaeze Nwosu" -> normalize the lone variant, yielding 5 total
   occurrences of "Adaeze Nwosu" and zero of "Adeaze Nwosu."
2. **Compound-term axis:** "make-ready" (hyphenated) occurs first
   (paragraph 1, "the letterpress shop's Saturday make-ready clinic")
   and 2 more times thereafter (3 hyphenated occurrences total);
   "makeready" (closed) occurs once, in paragraph 2 ("the whole
   makeready clinic could lock up a chase"). First-occurrence form is
   "make-ready" -> normalize the closed variant, yielding 4 total
   occurrences of "make-ready" and zero of "makeready."
3. **Unit axis:** "gsm" occurs first (paragraph 1, "exactly 120 gsm")
   and once more later in the passage ("pin the 120 gsm figure"),
   2 occurrences total before the variant; "grams per square metre"
   occurs once, in paragraph 2 ("one batch of cover stock at 118 grams
   per square metre"). First-occurrence form is "gsm" -> normalize
   "118 grams per square metre" to "118 gsm," yielding 3 total
   occurrences of "gsm" and zero of "grams per square metre."

Control sentence (already fully consistent, touches none of the three
axes): "Type that once sat unsorted in the wrong drawers each week is
now filed back before the next session opens." Any change to this
sentence — added words, reordering, punctuation changes — is a
spurious edit not licensed by any detected inconsistency.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (name)** — PASS: every occurrence reads "Adaeze Nwosu,"
  including the paragraph-2 sentence that started as "Adeaze Nwosu
  also redrew..." now reading "Adaeze Nwosu also redrew..."; or a
  submission where "Adeaze" appears nowhere and the count of "Adaeze
  Nwosu" is 5. FAIL: "Adeaze Nwosu" still present anywhere; or the
  model "fixes" it in the wrong direction by changing the other four
  instances to "Adeaze Nwosu" instead (violates the first-occurrence
  rule even though it achieves uniformity); or it invents a third
  spelling such as "Adaeze Nwoso."
- **obj-2 (compound term)** — PASS: "the whole make-ready clinic could
  lock up a chase" (closed form normalized to hyphenated); all other
  instances remain "make-ready"; or a submission with four
  "make-ready" and zero "makeready." FAIL: "makeready" still present
  anywhere; or all instances collapsed to the closed form "makeready"
  (uniform, but normalizes to the wrong-priority form); or the term
  respelled as two words "make ready."
- **obj-3 (unit)** — PASS: "one batch of cover stock at 118 gsm"
  (spelled-out form normalized to "gsm"); or a submission where "grams
  per square metre" appears zero times and "gsm" appears three times.
  FAIL: "118 grams per square metre" still present unchanged; or all
  instances expanded to "grams per square metre" instead of collapsed
  to "gsm"; or the abbreviation altered to "g/m2" or "GSM."
- **obj-4 (restraint on the control sentence)** — PASS: the "Type
  that once sat unsorted..." sentence reproduced with no wording
  changes, only possibly rewrapped onto different lines; or the whole
  sentence returned verbatim. FAIL: any added clause, e.g. "Type that
  once sat unsorted, gathering dust, in the wrong drawers..."; or a
  reordering such as "Type that each week once sat unsorted..."; or a
  punctuation change such as inserting a comma that wasn't there.

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
  uniform and unforced as a run of clean impressions pulled from a
  single locked forme.
- **Reasoning quality**: does the model's process show it scanned for
  inconsistencies methodically (rather than fixing only the first
  instance it noticed), applied the first-occurrence rule explicitly
  and separately per axis, and can point to the specific first
  occurrence it anchored each normalization to?
