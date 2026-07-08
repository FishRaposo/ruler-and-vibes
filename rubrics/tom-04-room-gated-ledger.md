---
test: tom-04-room-gated-ledger
canary: "mandolin banjo"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality MAP=CHEST TORCH=BIN; Sol MAP=SACK TORCH=BIN; Iris MAP=CHEST TORCH=HOOK; Rune MAP=CHEST TORCH=BIN"
    - id: obj-2
      check: "beliefs.md knowledge cells resolve by the embedded definition to: does Sol KNOW where the MAP is = NO (belief false) AND does Rune KNOW where the MAP is = NO (belief correct only by coincidence; the map moved twice unobserved, failing the observation clause)"
    - id: obj-3
      check: "beliefs.md nested answers are exactly Iris-thinks-Sol(MAP)=SACK, Sol-thinks-Iris(TORCH)=HOOK, Rune-thinks-Iris(MAP)=CHEST"
    - id: obj-4
      check: "every location cell contains exactly one verbatim token from {CHEST, SACK, BIN, HOOK}, every knowledge cell is exactly YES or NO, nothing else appears in the answer column, and REASONING.md exists and is at most 500 words by wc -w"
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

If the phrase "mandolin banjo" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality (MAP) | CHEST |
| 2 | Sol's belief (MAP) | SACK |
| 3 | Iris's belief (MAP) | CHEST |
| 4 | Rune's belief (MAP) | CHEST |
| 5 | Reality (TORCH) | BIN |
| 6 | Sol's belief (TORCH) | BIN |
| 7 | Iris's belief (TORCH) | HOOK |
| 8 | Rune's belief (TORCH) | BIN |
| 9 | Does Sol KNOW where the MAP is? | NO |
| 10 | Does Rune KNOW where the MAP is? | NO |
| 11 | Iris-thinks-Sol(MAP) | SACK |
| 12 | Sol-thinks-Iris(TORCH) | HOOK |
| 13 | Rune-thinks-Iris(MAP) | CHEST |

Hand-simulated timeline: t0 MAP=CHEST(A), TORCH=HOOK(B); Sol and Iris
in ROOM_A, Rune in ROOM_B; all three briefed on both starting
positions. t1 Iris moves MAP CHEST->SACK in ROOM_A while Sol also
present (Rune blind, in ROOM_B). t2 Sol travels ROOM_A -> ROOM_B. t3
Rune moves TORCH HOOK->BIN in ROOM_B while Sol is now present there too
(Iris blind, still in ROOM_A). t4 Iris, alone in ROOM_A, moves MAP
SACK->CHEST (Sol and Rune both blind, both now in ROOM_B).

First-order: reality is MAP=CHEST, TORCH=BIN. Sol witnessed the t1
move (so he knows SACK) but left for ROOM_B before the t4 move-back, so
his MAP belief is stuck at SACK — stale and now false. Sol was present
in ROOM_B for the t3 torch move, so his TORCH belief is correctly BIN.
Iris performed both MAP moves herself and is the direct observer for
both, so her MAP belief is correctly CHEST; but she never left ROOM_A,
so she never saw the t3 torch move and her TORCH belief is stuck at the
briefed starting value HOOK. Rune never witnessed either ROOM_A map
move (blind to both t1 and t4, having stayed in ROOM_B throughout), so
her MAP belief falls back to the t0 briefed value CHEST — which
happens to match current reality only because the map moved out and
back. Rune performed the t3 torch move herself, so her TORCH belief is
correctly BIN.

Knowledge cells, applying the operative definition: Sol's MAP belief
(SACK) is factually wrong, failing the "correct" clause outright, so
Sol does NOT know the MAP location — NO. Rune's MAP belief (CHEST)
happens to be correct, but Rune never observed the MAP at any point
after t0 and cannot rule out an unobserved move — in fact two occurred
— so her belief is unjustified true belief, not knowledge (a Gettier
case) — NO.

Nested: Iris directly saw Sol present for the t1 SACK move and knows
Sol left for ROOM_B before her own t4 move-back (which Sol never saw),
so Iris attributes SACK to Sol. Sol knows Iris remained in ROOM_A
throughout and never entered ROOM_B to see the t3 torch move, so Sol
attributes the stale briefed value HOOK to Iris. Rune, blind to both
ROOM_A map moves throughout, has only the shared t0 briefing to go on
and has no way to know Iris ever changed and reverted the map, so Rune
attributes the briefed starting value CHEST to Iris.

Two central traps: (1) knowledge-vs-correct-belief — Rune's answer
equals reality yet is not knowledge under the embedded definition,
since it is unjustified by observation; a naive reader marks YES. (2)
recency-over-volume — Sol has one direct MAP observation versus Rune's
zero, yet Sol holds a false belief while Rune is coincidentally
correct; a reader should not assume more observation automatically
means a more accurate current belief.

### Objective check notes

- **obj-1**: eight exact string matches (reality x2 items, plus three
  agents x2 items); any single mismatch fails this check.
- **obj-2**: both knowledge cells must independently read NO; getting
  either to YES fails, including the tempting Rune=YES because his
  belief happens to be correct.
- **obj-3**: three exact string matches on the nested cells.
- **obj-4**: scan every location cell for exactly one token from
  {CHEST, SACK, BIN, HOOK} and every knowledge cell for exactly YES or
  NO, nothing else in the answer column; separately confirm
  `REASONING.md` exists and `wc -w` <= 500.

Because every objective check here is a verbatim cell-match (locations
against a closed four-token vocabulary, knowledge against a closed
two-token vocabulary), there are no prose PASS/FAIL phrasing examples
to give for the objective criteria.

### Subjective guidance

- **Room-gated belief and knowledge-attribution accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` show correct
  understanding of *why* Rune's correct MAP belief still fails to
  count as knowledge (the Gettier structure), rather than treating
  "correct belief" and "knowledge" as interchangeable?
- **Time- and location-indexed observation bookkeeping**: does the
  submission track, for each agent, both *which room* they occupied and
  *when* they moved between rooms, and apply that two-dimensional
  bookkeeping consistently across all thirteen cells (no agent
  silently sees an event in a room they were not in)?
- **Reasoning quality**: does `REASONING.md` explicitly apply the
  operative KNOWS/BELIEVES definition's two clauses (correctness and
  observation-justification) to both knowledge cells by name, and call
  out the recency-over-volume trap, rather than only asserting the
  thirteen final answers?
