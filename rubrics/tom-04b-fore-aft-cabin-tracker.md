---
test: tom-04b-fore-aft-cabin-tracker
canary: "broadsword halberd"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality SEXTANT=FOOTLOCKER BAROMETER=COFFER; Ezra SEXTANT=DUFFEL BAROMETER=COFFER; Vika SEXTANT=FOOTLOCKER BAROMETER=RUCKSACK; Doran SEXTANT=FOOTLOCKER BAROMETER=COFFER"
    - id: obj-2
      check: "beliefs.md knowledge cells resolve by the embedded definition to: does Ezra KNOW where the SEXTANT is = NO (belief false) AND does Doran KNOW where the SEXTANT is = NO (belief correct only by coincidence; the sextant moved twice unobserved, failing the observation clause)"
    - id: obj-3
      check: "beliefs.md nested answers are exactly Vika-thinks-Ezra(SEXTANT)=DUFFEL, Ezra-thinks-Vika(BAROMETER)=RUCKSACK, Doran-thinks-Vika(SEXTANT)=FOOTLOCKER"
    - id: obj-4
      check: "every location cell contains exactly one verbatim token from {FOOTLOCKER, DUFFEL, COFFER, RUCKSACK}, every knowledge cell is exactly YES or NO, nothing else appears in the answer column, and REASONING.md exists and is at most 500 words by wc -w"
  subjective:
    - id: sub-quality
      name: "Room-gated belief and knowledge-attribution accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Time- and location-indexed observation bookkeeping"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `tom-04-room-gated-ledger` (same construct, fresh
surface).

If the phrase "broadsword halberd" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality (SEXTANT) | FOOTLOCKER |
| 2 | Ezra's belief (SEXTANT) | DUFFEL |
| 3 | Vika's belief (SEXTANT) | FOOTLOCKER |
| 4 | Doran's belief (SEXTANT) | FOOTLOCKER |
| 5 | Reality (BAROMETER) | COFFER |
| 6 | Ezra's belief (BAROMETER) | COFFER |
| 7 | Vika's belief (BAROMETER) | RUCKSACK |
| 8 | Doran's belief (BAROMETER) | COFFER |
| 9 | Does Ezra KNOW where the SEXTANT is? | NO |
| 10 | Does Doran KNOW where the SEXTANT is? | NO |
| 11 | Vika-thinks-Ezra(SEXTANT) | DUFFEL |
| 12 | Ezra-thinks-Vika(BAROMETER) | RUCKSACK |
| 13 | Doran-thinks-Vika(SEXTANT) | FOOTLOCKER |

Hand-simulated timeline: t0 SEXTANT=FOOTLOCKER(FORE_CABIN),
BAROMETER=RUCKSACK(AFT_CABIN); Ezra and Vika in FORE_CABIN, Doran in
AFT_CABIN; all three briefed on both starting positions. t1 Vika moves
SEXTANT FOOTLOCKER->DUFFEL in FORE_CABIN while Ezra also present (Doran
blind, in AFT_CABIN). t2 Ezra travels FORE_CABIN -> AFT_CABIN. t3 Doran
moves BAROMETER RUCKSACK->COFFER in AFT_CABIN while Ezra is now present
there too (Vika blind, still in FORE_CABIN). t4 Vika, alone in
FORE_CABIN, moves SEXTANT DUFFEL->FOOTLOCKER (Ezra and Doran both
blind, both now in AFT_CABIN).

First-order: reality is SEXTANT=FOOTLOCKER, BAROMETER=COFFER. Ezra
witnessed the t1 move (so he knows DUFFEL) but left for AFT_CABIN
before the t4 move-back, so his SEXTANT belief is stuck at DUFFEL —
stale and now false. Ezra was present in AFT_CABIN for the t3 barometer
move, so his BAROMETER belief is correctly COFFER. Vika performed both
SEXTANT moves herself and is the direct observer for both, so her
SEXTANT belief is correctly FOOTLOCKER; but she never left FORE_CABIN,
so she never saw the t3 barometer move and her BAROMETER belief is
stuck at the briefed starting value RUCKSACK. Doran never witnessed
either FORE_CABIN sextant move (blind to both t1 and t4, having stayed
in AFT_CABIN throughout), so his SEXTANT belief falls back to the t0
briefed value FOOTLOCKER — which happens to match current reality only
because the sextant moved out and back. Doran performed the t3
barometer move himself, so his BAROMETER belief is correctly COFFER.

Knowledge cells, applying the operative definition: Ezra's SEXTANT
belief (DUFFEL) is factually wrong, failing the "correct" clause
outright, so Ezra does NOT know the sextant's location — NO. Doran's
SEXTANT belief (FOOTLOCKER) happens to be correct, but Doran never
observed the sextant at any point after t0 and cannot rule out an
unobserved move — in fact two occurred — so his belief is unjustified
true belief, not knowledge (a Gettier case) — NO.

Nested: Vika directly saw Ezra present for the t1 DUFFEL move and knows
Ezra left for AFT_CABIN before her own t4 move-back (which Ezra never
saw), so Vika attributes DUFFEL to Ezra. Ezra knows Vika remained in
FORE_CABIN throughout and never entered AFT_CABIN to see the t3
barometer move, so Ezra attributes the stale briefed value RUCKSACK to
Vika. Doran, blind to both FORE_CABIN sextant moves throughout, has
only the shared t0 briefing to go on and has no way to know Vika ever
changed and reverted the sextant, so Doran attributes the briefed
starting value FOOTLOCKER to Vika.

Two central traps: (1) knowledge-vs-correct-belief — Doran's answer
equals reality yet is not knowledge under the embedded definition,
since it is unjustified by observation; a naive reader marks YES. (2)
recency-over-volume — Ezra has one direct sextant observation versus
Doran's zero, yet Ezra holds a false belief while Doran is
coincidentally correct; a reader should not assume more observation
automatically means a more accurate current belief.

### Objective check notes

- **obj-1**: eight exact string matches (reality x2 items, plus three
  crew members x2 items); any single mismatch fails this check.
- **obj-2**: both knowledge cells must independently read NO; getting
  either to YES fails, including the tempting Doran=YES because his
  belief happens to be correct.
- **obj-3**: three exact string matches on the nested cells.
- **obj-4**: scan every location cell for exactly one token from
  {FOOTLOCKER, DUFFEL, COFFER, RUCKSACK} and every knowledge cell for
  exactly YES or NO, nothing else in the answer column; separately
  confirm `REASONING.md` exists and `wc -w` <= 500.

Because every objective check here is a verbatim cell-match (locations
against a closed four-token vocabulary, knowledge against a closed
two-token vocabulary), there are no prose PASS/FAIL phrasing examples
to give for the objective criteria.

### Subjective guidance

- **Room-gated belief and knowledge-attribution accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` show correct
  understanding of *why* Doran's correct SEXTANT belief still fails to
  count as knowledge (the Gettier structure), rather than treating
  "correct belief" and "knowledge" as interchangeable?
- **Time- and location-indexed observation bookkeeping**: does the
  submission track, for each crew member, both *which cabin* they
  occupied and *when* they moved between cabins, and apply that
  two-dimensional bookkeeping consistently across all thirteen cells
  (no crew member silently sees an event in a cabin they were not in)?
- **Reasoning quality**: does `REASONING.md` explicitly apply the
  operative KNOWS/BELIEVES definition's two clauses (correctness and
  observation-justification) to both knowledge cells by name, and call
  out the recency-over-volume trap, rather than only asserting the
  thirteen final answers?
