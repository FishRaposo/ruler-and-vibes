---
test: coding-03c-verdal-gate-token
canary: "fenugreek czardas"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node validator.js` runs without error and prints exactly 13 lines in test-file order: 10 lines in the exact format '<code> VALID' or '<code> INVALID', then 3 lines in the exact format '<stem> -> <digit>'"
    - id: obj-2
      check: "The 7 non-trap verdicts match the answer key: 8371926-class agreement is not at issue here — specifically 9380312 VALID, 5296850 VALID, 6705776 VALID, 3022705 INVALID, 9669311 INVALID, 4868645 INVALID, 7932603 INVALID (a from-the-right Luhn implementation also gets these right, isolating trap failures to obj-3)"
    - id: obj-3
      check: "All 3 trap verdicts match the answer key: 8371926 VALID, 5806125 VALID, 2083102 VALID (a Luhn implementation gets all three of these WRONG, since Luhn scores them 42, 25, 19 respectively — none divisible by 10)"
    - id: obj-4
      check: "All 3 check digits match the answer key: 837192 -> 6, 350941 -> 5, 123456 -> 9 (a Luhn-derived implementation would instead give 4, 1, 6); the judge confirms each with `node -e \"console.log(require('./validator.js').validate('<stem><digit>'))\"` returning true"
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
---

## Judge guidance

Parallel form of `coding-03-checksum-spec` (same construct, fresh surface).

If the phrase "fenugreek czardas" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute the full answer key independently before grading; do not
  trust the runner's printed output. Reference sums (left-rule /
  Luhn-for-7-digits, doubling positions 1,3,5,7 from the left):
  - Non-traps (verdicts agree under both rules): `9380312` sums to 30
    under both rules (VALID/VALID); `5296850` sums to 30 under both
    (VALID/VALID); `6705776` sums to 30 under both (VALID/VALID);
    `3022705` sums to 18 left-rule / 21 Luhn (INVALID/INVALID);
    `9669311` sums to 36 left-rule / 33 Luhn (INVALID/INVALID);
    `4868645` sums to 35 left-rule / 43 Luhn (INVALID/INVALID);
    `7932603` sums to 31 left-rule / 32 Luhn (INVALID/INVALID). That is
    3 VALID and 4 INVALID among the 7 non-traps, so a constant-output
    cheat fails.
  - Traps (verdicts disagree): `8371926` sums to 30 left-rule (VALID)
    vs. 42 Luhn (INVALID); `5806125` sums to 20 left-rule (VALID) vs.
    25 Luhn (INVALID); `2083102` sums to 20 left-rule (VALID) vs. 19
    Luhn (INVALID). All three traps are VALID under the correct rule
    and INVALID under Luhn.
  - Check digits: stem `837192` needs a contribution of 6 (mod 10) at
    the doubled 7th position, giving digit 6 (Luhn would give 4); stem
    `350941` gives correct digit 5 (Luhn gives 1); stem `123456` gives
    correct digit 9 (Luhn gives 6). Verify each with two-line snippets,
    e.g.
    `node -e "console.log(require('./validator.js').validate('8371926'))"`
    should print `true`.
- Spec fidelity: does the implementation literally follow "position 1
  is leftmost, double positions 1/3/5/7"? Penalize any code that
  special-cases or hard-codes the 13 answers instead of computing them
  from a general rule — spot-check by mentally varying one digit and
  confirming the logic still generalizes.
- Code clarity: reward a clear separation between the per-digit
  contribution function, the summation, and the divisible-by-10 check;
  penalize a monolithic unreadable one-liner even if correct.
- Reasoning quality: REASONING.md should explicitly name that positions
  are counted from the left and state how the author checked they
  didn't accidentally build the mirror-image (Luhn) rule — e.g. by
  hand-checking the worked example `8371926` against both rules.
