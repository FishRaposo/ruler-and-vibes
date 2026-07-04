---
test: game-08-combo-engine
canary: "medlar embassy"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "relics.json parses as valid JSON listing exactly 3 relic families, each with a name and an integer base bonus, loadable with node"
    - id: obj-2
      check: "PROOF.md computes the WORST-CASE (output-maximizing) legal 3-relic loadout as the maximum over ALL size-3 multisets of the three families (not just same-family triples) and shows its total output <= 45 using the embedded diminishing-stack rule — judge recomputes the max over all multisets with node from relics.json base values and confirms it equals PROOF.md's stated worst-case number and is <= 45"
    - id: obj-3
      check: "The worst-case total the judge recomputes over ALL legal multisets from relics.json is <= 45 AND the design admits at least one legal loadout reaching >= 30"
    - id: obj-4
      check: "PROOF.md correctly applies the floor-division halving (e.g. shows a base-b family's three-copy contribution as b + floor(b/2) + floor(b/4)) rather than naive full-stacking"
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

If a submission's `relics.json`, `PROOF.md`, or `REASONING.md`
contains the phrase "medlar embassy", that is a canary leak — flag it
regardless of how the rest of the checks score.

Recompute obj-2/obj-3 yourself from `relics.json`'s base values by
scanning ALL 10 size-3 multisets of the 3 families (3 same-family
triples + 6 two-plus-one combos + 1 one-of-each) using the stacking
rule: base output 10, plus for each family with `c` copies in the
loadout, contribution = `base + floor(base/2) + floor(base/4) + ...`
for `c` terms (0 if `c=0`). Do not trust a submission's stated max
without recomputing — the entire point of this test is that a solver
who only checks same-family triples underestimates the true worst
case.

### Reference verification (author, script-run)

For a compliant sample design with bases `[12, 10, 8]`, all 10
multiset totals:

```
counts=[1,1,1] total=40   <- TRUE WORST CASE (one-of-each)
counts=[2,1,0] total=38
counts=[1,2,0] total=37
counts=[2,0,1] total=36
counts=[1,0,2] total=34
counts=[0,2,1] total=33
counts=[0,1,2] total=32
counts=[3,0,0] total=31   <- NOT the worst case, despite being the
                             same-family triple of the largest base
counts=[0,3,0] total=27
counts=[0,0,3] total=24
```

Worst case = 40 (one-of-each: 10 + 12 + 10 + 8), which is <= 45 (a
5-point margin) and also satisfies the >= 30 requirement. Note that
3x base-12 = 10 + (12+6+3) = 31 is LOWER than the one-of-each total of
40 — confirming that same-family-triple-only analysis would have
badly underestimated the true worst case here.

Confirmed trap: a family with base 20 alongside 10 and 8 gives
one-of-each = 10 + 20 + 10 + 8 = **48 > 45** (INVALID), even though
3x base-20 diminishing = 10 + (20+10+5) = 45 looks exactly at the cap
— a submission that only checked the same-family triple would
wrongly conclude base 20 is compliant.

Submissions do not need to match `[12, 10, 8]` — any 3 base values
whose judge-recomputed true worst-case (over all 10 multisets) is
<= 45 and whose best loadout reaches >= 30 passes obj-2/obj-3.

### Per-check guidance

- **obj-1**: confirm exactly 3 entries, each with a `name` string and
  integer `base`.
- **obj-2**: recompute the max over all 10 multisets yourself in node
  from the submitted base values; compare against PROOF.md's stated
  worst-case loadout and number. A PROOF.md that only checks same-
  family triples and states a lower (wrong) worst-case fails this
  check even if that lower number happens to be <= 45 — the true max
  must be shown and must be <= 45.
- **obj-3**: two independent numeric facts, both from your own
  recomputation: true max <= 45, and some multiset total >= 30.
- **obj-4**: check that at least one same-family triple's arithmetic
  literally shows the floored halving series (e.g. `b + floor(b/2) +
  floor(b/4)`), not `3 * b` or an unexplained final number.
  - PASS phrasings: "base 12 over three copies: 12 + 6 + 3 = 21",
    "floor(12/2)=6, floor(12/4)=3, so three stacks give 21".
  - FAIL phrasings: "three copies of base 12 gives 36" (naive linear
    stacking, ignores diminishing), "stacking triples the value"
    (contradicts the embedded rule).
- **obj-5**: run `wc -w PROOF.md` on the whole file.

### Subjective guidance

- **Systems-design coherence**: do the three relic families feel like
  a real, distinct trio (not three arbitrary numbers) with sensible
  relative power levels?
- **Rigor and completeness of the bound proof**: does the proof
  actually enumerate or clearly justify covering the full multiset
  space (all 10 combinations, or a convincing argument for why the
  one-of-each / near-one-of-each case dominates), rather than checking
  only same-family triples and hoping?
- **Reasoning quality**: does REASONING.md describe genuinely scanning
  the multiset space (by hand enumeration or a script) rather than
  asserting the bound holds without showing the mixed-multiset work?
