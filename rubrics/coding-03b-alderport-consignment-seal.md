---
test: coding-03b-alderport-consignment-seal
canary: "galangal rigadoon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node validator.js` runs without error and prints exactly 13 lines in test-file order: 10 lines in the exact format '<code> VALID' or '<code> INVALID', then 3 lines in the exact format '<stem> -> <digit>'"
    - id: obj-2
      check: "The 7 non-trap verdicts match the answer key: 48160273-class agreement is not at issue here — specifically 53792461 VALID, 72834690 VALID, 90823154 VALID, 35729184 INVALID, 61947350 INVALID, 80516492 INVALID, 27384095 INVALID (a from-the-right Luhn implementation also gets these right, isolating trap failures to obj-3)"
    - id: obj-3
      check: "All 3 trap verdicts match the answer key: 48160273 VALID, 93052617 VALID, 49513870 VALID (a Luhn implementation gets all three of these WRONG, since Luhn scores them 34, 36, 38 respectively — none divisible by 10)"
    - id: obj-4
      check: "All 3 check digits match the answer key: 5984123 -> 5, 7968345 -> 5, 3980741 -> 4 (a Luhn-derived implementation would instead give 9, 4, 7); the judge confirms each with `node -e \"console.log(require('./validator.js').validate('<stem><digit>'))\"` returning true"
    - id: obj-5
      check: "REASONING.md exists and is at most 200 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Spec fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Spec fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Code clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `coding-03-checksum-spec` (same construct, fresh surface).

If the phrase "galangal rigadoon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute the full answer key independently before grading; do not
  trust the runner's printed output. Reference sums (rule /
  Luhn-for-8-digits; the rule doubles positions 1,4,7 from the left,
  Luhn doubles every second position from the right):
  - Non-traps (verdicts agree under both rules): `53792461` sums to 30
    under both rules (VALID/VALID); `72834690` sums to 40 under both
    (VALID/VALID); `90823154` sums to 30 under both (VALID/VALID);
    `35729184` sums to 43 rule / 39 Luhn (INVALID/INVALID); `61947350`
    sums to 32 rule / 26 Luhn (INVALID/INVALID); `80516492` sums to 35
    rule / 27 Luhn (INVALID/INVALID); `27384095` sums to 39 rule / 47
    Luhn (INVALID/INVALID). That is 3 VALID and 4 INVALID among the 7
    non-traps, so a constant-output cheat fails.
  - Traps (verdicts disagree): `48160273` sums to 30 rule (VALID) vs.
    34 Luhn (INVALID); `93052617` sums to 30 rule (VALID) vs. 36 Luhn
    (INVALID); `49513870` sums to 40 rule (VALID) vs. 38 Luhn
    (INVALID). All three traps are VALID under the correct rule and
    INVALID under Luhn.
  - Check digits: stem `5984123` needs a contribution of 5 (mod 10) at
    the unchanged 8th position, giving digit 5 (Luhn would give 9);
    stem `7968345` gives correct digit 5 (Luhn gives 4); stem `3980741`
    gives correct digit 4 (Luhn gives 7). Verify each with a two-line
    snippet, e.g.
    `node -e "console.log(require('./validator.js').validate('59841235'))"`
    should print `true`.
- Spec fidelity: does the implementation literally follow "position 1
  is leftmost, double positions 1/4/7"? Penalize any code that
  special-cases or hard-codes the 13 answers instead of computing them
  from a general rule — spot-check by mentally varying one digit and
  confirming the logic still generalizes.
- Code clarity: reward a clear separation between the per-digit
  contribution function, the summation, and the divisible-by-10 check;
  penalize a monolithic unreadable one-liner even if correct.
- Reasoning quality: REASONING.md should explicitly name that positions
  are counted from the left and state how the author checked they
  didn't accidentally build the mirror-image (Luhn) rule — e.g. by
  hand-checking the worked example `50346879` against both rules.
