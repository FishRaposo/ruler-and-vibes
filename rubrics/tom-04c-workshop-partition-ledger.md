---
test: tom-04c-workshop-partition-ledger
canary: "pike lance"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality CHISEL=TOTE LADLE=BUCKET; Mott CHISEL=BASKET LADLE=BUCKET; Adaeze CHISEL=TOTE LADLE=CADDY; Perrin CHISEL=TOTE LADLE=BUCKET"
    - id: obj-2
      check: "beliefs.md knowledge cells resolve by the embedded definition to: does Mott KNOW where the CHISEL is = NO (belief false) AND does Perrin KNOW where the CHISEL is = NO (belief correct only by coincidence; the chisel moved twice unobserved, failing the observation clause)"
    - id: obj-3
      check: "beliefs.md nested answers are exactly Adaeze-thinks-Mott(CHISEL)=BASKET, Mott-thinks-Adaeze(LADLE)=CADDY, Perrin-thinks-Adaeze(CHISEL)=TOTE"
    - id: obj-4
      check: "every location cell contains exactly one verbatim token from {TOTE, BASKET, BUCKET, CADDY}, every knowledge cell is exactly YES or NO, nothing else appears in the answer column, and REASONING.md exists and is at most 500 words by wc -w"
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

If a submission's `beliefs.md` or `REASONING.md` contains the phrase
"pike lance", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality (CHISEL) | TOTE |
| 2 | Mott's belief (CHISEL) | BASKET |
| 3 | Adaeze's belief (CHISEL) | TOTE |
| 4 | Perrin's belief (CHISEL) | TOTE |
| 5 | Reality (LADLE) | BUCKET |
| 6 | Mott's belief (LADLE) | BUCKET |
| 7 | Adaeze's belief (LADLE) | CADDY |
| 8 | Perrin's belief (LADLE) | BUCKET |
| 9 | Does Mott KNOW where the CHISEL is? | NO |
| 10 | Does Perrin KNOW where the CHISEL is? | NO |
| 11 | Adaeze-thinks-Mott(CHISEL) | BASKET |
| 12 | Mott-thinks-Adaeze(LADLE) | CADDY |
| 13 | Perrin-thinks-Adaeze(CHISEL) | TOTE |

Hand-simulated timeline: t0 CHISEL=TOTE(STUDIO), LADLE=CADDY(ANNEX);
Mott and Adaeze in STUDIO, Perrin in ANNEX; all three briefed on both
starting positions. t1 Adaeze moves CHISEL TOTE->BASKET in STUDIO while
Mott also present (Perrin blind, in ANNEX). t2 Mott travels STUDIO ->
ANNEX. t3 Perrin moves LADLE CADDY->BUCKET in ANNEX while Mott is now
present there too (Adaeze blind, still in STUDIO). t4 Adaeze, alone in
STUDIO, moves CHISEL BASKET->TOTE (Mott and Perrin both blind, both now
in ANNEX).

First-order: reality is CHISEL=TOTE, LADLE=BUCKET. Mott witnessed the
t1 move (so he believes BASKET) but left for ANNEX before the t4
move-back, so his CHISEL belief is stuck at BASKET — stale and now
false. Mott was present in ANNEX for the t3 ladle move, so his LADLE
belief is correctly BUCKET. Adaeze performed both CHISEL moves herself
and is the direct observer for both, so her CHISEL belief is correctly
TOTE; but she never left STUDIO, so she never saw the t3 ladle move and
her LADLE belief is stuck at the briefed starting value CADDY. Perrin
never witnessed either STUDIO chisel move (blind to both t1 and t4,
having stayed in ANNEX throughout), so her CHISEL belief falls back to
the t0 briefed value TOTE — which happens to match current reality only
because the chisel moved out and back. Perrin performed the t3 ladle
move herself, so her LADLE belief is correctly BUCKET.

Knowledge cells, applying the operative definition: Mott's CHISEL
belief (BASKET) is factually wrong, failing the "correct" clause
outright, so Mott does NOT know the CHISEL location — NO. Perrin's
CHISEL belief (TOTE) happens to be correct, but Perrin never observed
the CHISEL at any point after t0 and cannot rule out an unobserved
move — in fact two occurred — so her belief is unjustified true belief,
not knowledge (a Gettier case) — NO.

Nested: Adaeze directly saw Mott present for the t1 BASKET move and
knows Mott left for ANNEX before her own t4 move-back (which Mott never
saw), so Adaeze attributes BASKET to Mott. Mott knows Adaeze remained
in STUDIO throughout and never entered ANNEX to see the t3 ladle move,
so Mott attributes the stale briefed value CADDY to Adaeze. Perrin,
blind to both STUDIO chisel moves throughout, has only the shared t0
briefing to go on and has no way to know Adaeze ever changed and
reverted the chisel, so Perrin attributes the briefed starting value
TOTE to Adaeze.

Two central traps: (1) knowledge-vs-correct-belief — Perrin's answer
equals reality yet is not knowledge under the embedded definition,
since it is unjustified by observation; a naive reader marks YES. (2)
recency-over-volume — Mott has one direct CHISEL observation versus
Perrin's zero, yet Mott holds a false belief while Perrin is
coincidentally correct; a reader should not assume more observation
automatically means a more accurate current belief.

### Objective check notes

- **obj-1**: eight exact string matches (reality x2 items, plus three
  members x2 items); any single mismatch fails this check.
- **obj-2**: both knowledge cells must independently read NO; getting
  either to YES fails, including the tempting Perrin=YES because his
  belief happens to be correct.
- **obj-3**: three exact string matches on the nested cells.
- **obj-4**: scan every location cell for exactly one token from
  {TOTE, BASKET, BUCKET, CADDY} and every knowledge cell for exactly
  YES or NO, nothing else in the answer column; separately confirm
  `REASONING.md` exists and `wc -w` <= 500.

Because every objective check here is a verbatim cell-match (locations
against a closed four-token vocabulary, knowledge against a closed
two-token vocabulary), there are no prose PASS/FAIL phrasing examples
to give for the objective criteria.

### Subjective guidance

- **Room-gated belief and knowledge-attribution accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` show correct
  understanding of *why* Perrin's correct CHISEL belief still fails to
  count as knowledge (the Gettier structure), rather than treating
  "correct belief" and "knowledge" as interchangeable?
- **Time- and location-indexed observation bookkeeping**: does the
  submission track, for each member, both *which workshop* they
  occupied and *when* they moved between workshops, and apply that
  two-dimensional bookkeeping consistently across all thirteen cells
  (no member silently sees an event in a workshop they were not in)?
- **Reasoning quality**: does `REASONING.md` explicitly apply the
  operative KNOWS/BELIEVES definition's two clauses (correctness and
  observation-justification) to both knowledge cells by name, and call
  out the recency-over-volume trap, rather than only asserting the
  thirteen final answers?
