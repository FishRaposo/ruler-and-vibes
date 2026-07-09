---
test: coding-03-checksum-spec
canary: "turquoise bassoon parade"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node validator.js` runs without error and prints exactly 13 lines in test-file order: 10 lines in the exact format '<code> VALID' or '<code> INVALID', then 3 lines in the exact format '<stem> -> <digit>'"
    - id: obj-2
      check: "The 7 non-trap verdicts match the answer key: 46718296-class agreement is not at issue here — specifically 11223344 VALID, 44332211 VALID, 10203040 VALID, 12345678 INVALID, 87654321 INVALID, 11111111 INVALID, 22222222 INVALID (a from-the-right Luhn implementation also gets these right, isolating trap failures to obj-3)"
    - id: obj-3
      check: "All 3 trap verdicts match the answer key: 46718296 VALID, 24681357 VALID, 12121212 VALID (a Luhn implementation gets all three of these WRONG, since Luhn scores them 44, 32, 16 respectively — none divisible by 10)"
    - id: obj-4
      check: "All 3 check digits match the answer key: 4671829 -> 6, 1234567 -> 9, 8765432 -> 4 (a Luhn-derived implementation would instead give 2, 4, 3); the judge confirms each with `node -e \"console.log(require('./validator.js').validate('<stem><digit>'))\"` returning true"
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

If the phrase "turquoise bassoon parade" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute the full answer key independently before grading; do not
  trust the runner's printed output. Reference sums (left-rule /
  Luhn-for-8-digits, doubling positions 1,3,5,7 from the left):
  - Non-traps (verdicts agree under both rules): `11223344` sums to 30
    under both rules (VALID/VALID); `44332211` sums to 30 under both
    (VALID/VALID); `10203040` sums to 10 left-rule / 20 Luhn, both
    divisible by 10 (VALID/VALID); `12345678` sums to 38 left-rule / 34
    Luhn (INVALID/INVALID); `87654321` sums to 34 left-rule / 38 Luhn
    (INVALID/INVALID); `11111111` sums to 12/12 (INVALID/INVALID);
    `22222222` sums to 24/24 (INVALID/INVALID). That is 3 VALID and 4
    INVALID among the 7 non-traps, so a constant-output cheat fails.
  - Traps (verdicts disagree): `46718296` sums to 40 left-rule (VALID)
    vs. 44 Luhn (INVALID); `24681357` sums to 40 left-rule (VALID) vs.
    32 Luhn (INVALID); `12121212` sums to 20 left-rule (VALID) vs. 16
    Luhn (INVALID). All three traps are VALID under the correct rule
    and INVALID under Luhn.
  - Check digits: stem `4671829` needs a contribution of 3 (mod 10) at
    the doubled 8th position, giving digit 6 (Luhn would give 2); stem
    `1234567` gives correct digit 9 (Luhn gives 4); stem `8765432`
    gives correct digit 4 (Luhn gives 3). Verify each with
    `node -e "console.log(require('./validator.js').validate('46718296'))"`-style
    two-line snippets, e.g.
    `node -e "console.log(require('./validator.js').validate('46718296'))"`
    should print `true`.
- Spec fidelity: does the implementation literally follow "position 1
  is leftmost, double positions 2/4/6/8"? Penalize any code that
  special-cases or hard-codes the 13 answers instead of computing them
  from a general rule — spot-check by mentally varying one digit and
  confirming the logic still generalizes.
- Code clarity: reward a clear separation between the per-digit
  contribution function, the summation, and the divisible-by-10 check;
  penalize a monolithic unreadable one-liner even if correct.
- Reasoning quality: REASONING.md should explicitly name that positions
  are counted from the left and state how the author checked they
  didn't accidentally build the mirror-image (Luhn) rule — e.g. by
  hand-checking the worked example `46718296` against both rules.
