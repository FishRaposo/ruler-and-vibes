---
test: game-08b-tonic-brewery
canary: "linnet flowerpecker"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "tonics.json parses as valid JSON listing exactly 3 tonic lines, each with a name and an integer base bonus, loadable with node"
    - id: obj-2
      check: "PROOF.md computes the WORST-CASE (strength-maximizing) legal 3-dose batch as the maximum over ALL size-3 multisets of the three lines (not just same-line triples) and shows its total strength <= 45 using the embedded diminishing-stack rule — judge recomputes the max over all multisets with node from tonics.json base values and confirms it equals PROOF.md's stated worst-case number and is <= 45"
    - id: obj-3
      check: "The worst-case total the judge recomputes over ALL legal multisets from tonics.json is <= 45 AND the design admits at least one legal batch reaching >= 30"
    - id: obj-4
      check: "PROOF.md correctly applies the floor-division halving (e.g. shows a base-b line's three-dose contribution as b + floor(b/2) + floor(b/4)) rather than naive full-stacking"
    - id: obj-5
      check: "PROOF.md is at most 500 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Systems-design coherence"
      weight: 0.4
    - id: sub-craft
      name: "Rigor and completeness of the bound proof"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `game-08-combo-engine` (same construct, fresh surface).

If a submission's `tonics.json`, `PROOF.md`, or `REASONING.md` contains
the phrase "linnet flowerpecker", that is a canary leak — flag it
regardless of how the rest of the checks score.

Recompute obj-2/obj-3 yourself from `tonics.json`'s base values by
scanning ALL 10 size-3 multisets of the 3 lines (3 same-line triples + 6
two-plus-one combos + 1 one-of-each) using the stacking rule: base batch
strength 10, plus for each line with `c` doses in the batch,
contribution = `base + floor(base/2) + floor(base/4) + ...` for `c` terms
(0 if `c=0`). Do not trust a submission's stated max without recomputing
— the entire point of this test is that a solver who only checks
same-line triples underestimates the true worst case.

### Reference verification (author, script-run)

For a compliant sample design with bases `[13, 11, 7]`, all 10 multiset
totals:

```
counts=[1,1,1] total=41   <- TRUE WORST CASE (one-of-each)
counts=[2,1,0] total=40
counts=[1,2,0] total=39
counts=[2,0,1] total=36
counts=[0,2,1] total=33
counts=[1,0,2] total=33
counts=[3,0,0] total=32   <- NOT the worst case, despite being the
                             same-line triple of the largest base
counts=[0,1,2] total=31
counts=[0,3,0] total=28
counts=[0,0,3] total=21
```

Worst case = 41 (one-of-each: 10 + 13 + 11 + 7), which is <= 45 (a
4-point margin) and also satisfies the >= 30 requirement. Note that
3x base-13 = 10 + (13+6+3) = 32 is LOWER than the one-of-each total of
41 — confirming that same-line-triple-only analysis would have badly
underestimated the true worst case here.

Confirmed trap: bases `[18, 12, 7]` give the two-plus-one batch
`[2,1,0]` = 10 + (18+9) + 12 = **49 > 45** (INVALID), even though every
same-line triple stays at or below the cap (3x base-18 diminishing =
10 + (18+9+4) = 41, 3x base-12 = 31, 3x base-7 = 21) — a submission that
only checked same-line triples would wrongly conclude `[18, 12, 7]` is
compliant.

Submissions do not need to match `[13, 11, 7]` — any 3 base values whose
judge-recomputed true worst-case (over all 10 multisets) is <= 45 and
whose best batch reaches >= 30 passes obj-2/obj-3.

### Per-check guidance

- **obj-1**: confirm exactly 3 entries, each with a `name` string and
  integer `base`.
  - PASS phrasings: `[{"name":"Emberleaf","base":13}, {"name":"Frostmint","base":11}, {"name":"Duskthorn","base":7}]`;
    three entries each with a string name and whole-number base, node
    `JSON.parse` succeeds.
  - FAIL phrasings: only 2 lines listed; a `base` given as `"13"` (string,
    not integer) or `12.5` (non-integer); malformed JSON that
    `JSON.parse` rejects.
- **obj-2**: recompute the max over all 10 multisets yourself in node
  from the submitted base values; compare against PROOF.md's stated
  worst-case batch and number. A PROOF.md that only checks same-line
  triples and states a lower (wrong) worst-case fails this check even if
  that lower number happens to be <= 45 — the true max must be shown and
  must be <= 45.
  - PASS phrasings: "worst case is one-of-each (1,1,1) = 10+13+11+7 = 41,
    which is <= 45"; "the strength-maximizing batch spreads across all
    three lines: 41, under the 45 ceiling".
  - FAIL phrasings: "worst case is three Emberleaf = 32, safely under 45"
    (checked only same-line triples, missed the true max of 41); "max
    batch = 10 + 13 + 11 + 7 = 47" (arithmetic error, and the wrong
    conclusion about the cap).
- **obj-3**: two independent numeric facts, both from your own
  recomputation: true max <= 45, and some batch total >= 30.
  - PASS phrasings: "true max 41 <= 45, and (2,1,0) = 40 >= 30"; "ceiling
    holds at 41 and the strongest batch clears 30".
  - FAIL phrasings: "true max is 49" (over the cap — obj-3 fails on the
    bound); "the strongest legal batch is only 24" (never reaches 30 —
    obj-3 fails on the floor).
- **obj-4**: check that at least one same-line triple's arithmetic
  literally shows the floored halving series (e.g. `b + floor(b/2) +
  floor(b/4)`), not `3 * b` or an unexplained final number.
  - PASS phrasings: "base 13 over three doses: 13 + 6 + 3 = 22",
    "floor(13/2)=6, floor(13/4)=3, so three doses give 22".
  - FAIL phrasings: "three doses of base 13 gives 39" (naive linear
    stacking, ignores diminishing), "stacking triples the value"
    (contradicts the embedded rule).
- **obj-5**: run `wc -w PROOF.md` on the whole file.

### Subjective guidance

- **Systems-design coherence**: do the three tonic lines feel like a
  real, distinct trio (not three arbitrary numbers) with sensible
  relative power levels?
- **Rigor and completeness of the bound proof**: does the proof actually
  enumerate or clearly justify covering the full multiset space (all 10
  combinations, or a convincing argument for why the one-of-each /
  near-one-of-each case dominates), rather than checking only same-line
  triples and hoping?
- **Reasoning quality**: does REASONING.md describe genuinely scanning
  the multiset space (by hand enumeration or a script) rather than
  asserting the bound holds without showing the mixed-multiset work?
