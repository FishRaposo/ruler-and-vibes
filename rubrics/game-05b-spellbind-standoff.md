---
test: game-05b-spellbind-standoff
canary: "stinkhorn shrike"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "final_state.json parses as valid JSON with node and equals exactly {\"EAST\":{\"hp\":16,\"guard\":0},\"WEST\":{\"hp\":10,\"guard\":0}} (compare field-by-field, integer values)"
    - id: obj-2
      check: "ADJUDICATION.md's stated per-turn VITALITY totals after EAST's third turn read WEST at 5 VITALITY (the HONE+SMITE = 11 damage step), demonstrating the HONE +3 bonus was applied"
    - id: obj-3
      check: "ADJUDICATION.md explicitly identifies at least two spells from the log that were SKIPPED for insufficient vigor (the third-turn trailing JOLT and the fourth-turn second SIPHON)"
    - id: obj-4
      check: "ADJUDICATION.md states that EAST ends with 0 WARD tokens because the final WEST JOLT (7 damage after HONE) consumed both stacked tokens — the second token being consumed despite absorbing only 1 damage"
    - id: obj-5
      check: "ADJUDICATION.md is at most 500 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Adjudication accuracy and completeness"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of the turn-by-turn trace"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `game-05-be-the-engine` (same construct, fresh
surface).

If the phrase "stinkhorn shrike" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test has one exact-answer objective check (obj-1) and three
prose-located reasoning checks (obj-2/3/4) that each ship PASS/FAIL
phrasings below. Do not hand-resimulate to double check obj-1 — the
reference adjudicator below was run and traced step by step; trust its
output. Use it only if you want to sanity-check a submission's claimed
intermediate numbers.

### Reference adjudicator (verified by direct simulation)

Turn-by-turn trace (VITALITY/ward after each turn resolves):

- **EAST t1** `[JOLT, JOLT, JOLT]`: vigor 3, each JOLT costs 1, all
  three cast. 3x4=12 damage, WEST has 0 ward so it all goes through.
  WEST: 28 -> 16 VITALITY.
- **WEST t2** `[WARD, SMITE]`: vigor 3. WARD costs 1 (ward 0->1). SMITE
  costs 2 (vigor now 0): consumes WEST's own ward token first (ward
  1->0, no effect on damage), deals 8 to EAST. EAST has 0 ward, no
  absorption. EAST: 28 -> 20 VITALITY.
- **EAST t3** `[HONE, SMITE, JOLT]`: vigor 3. HONE costs 1 (vigor 2),
  sets +3 bonus. SMITE costs 2 (vigor 0): raw 8 + HONE 3 = 11 damage,
  HONE consumed. WEST has 0 ward, no absorption. WEST: 16 -> 5. Trailing
  JOLT needs 1 vigor but 0 remain: **SKIPPED**.
- **WEST t4** `[SIPHON, SIPHON]`: vigor 3. First SIPHON costs 2 (vigor
  1): deals 4 to EAST (no ward, all through: EAST 20 -> 16), heals WEST
  5 (WEST 5 -> 10, well under the 28 cap). Second SIPHON needs 2 vigor
  but only 1 remains: **SKIPPED**.
- **EAST t5** `[WARD, WARD, WARD]`: vigor 3, each WARD costs 1. First
  WARD: ward 0->1. Second WARD: ward 1->2 (at cap). Third WARD: costs
  its vigor but **wasted at the cap** — ward stays at 2.
- **WEST t6** `[HONE, HONE, JOLT]`: vigor 3. First HONE costs 1 (vigor
  2), sets +3 bonus. Second HONE costs 1 (vigor 1) but a bonus is
  already active: **wasted**. JOLT costs 1 (vigor 0): raw 4 + HONE 3 =
  7 damage aimed at EAST, who holds 2 WARD tokens. Token 1 absorbs
  min(6,7)=6 (consumed, 1 damage remains). Token 2 absorbs the
  remaining 1 damage and **is consumed even though it only absorbed 1**
  (the partial-absorb-still-consumes rule). 0 damage reaches EAST's
  VITALITY. EAST: stays at 16, ward 2 -> 0.

**Final state: `{"EAST":{"hp":16,"guard":0},"WEST":{"hp":10,"guard":0}}`.**

A naive solver that ignores skip-on-insufficient-vigor, the WARD cap,
HONE non-stacking, or "consumed even on partial absorption" will
diverge from this — confirmed by running a deliberately naive
adjudicator (no vigor tracking, uncapped ward, stacking HONE, ward only
consumed on a full 6-absorb) against the same log, which produces
`{"EAST":{"hp":11,"guard":2},"WEST":{"hp":11,"guard":0}}` —
substantially different on three of four fields (only WEST's structural
0-ward matches). This confirms the trap is real: getting any one rule
wrong changes the final answer.

### Per-check guidance

- **obj-1**: exact equality only. Any deviation (e.g. EAST guard=2,
  WEST hp=11 or 14, EAST hp=11 or 20) fails — do not award partial
  credit for "close" states.
- **obj-2**: judge reads ADJUDICATION.md for the stated WEST VITALITY
  after EAST's third turn.
  - PASS phrasings: "WEST drops to 5", "WEST: 5 after turn 3", "WEST now
    at 5".
  - FAIL phrasings: "WEST drops to 8" (ignored HONE bonus), "WEST: 4"
    (double-counted the trailing JOLT as if it were played), "WEST: 2"
    (treated SMITE as unboosted then added HONE elsewhere incorrectly).
- **obj-3**: judge confirms both the third-turn trailing JOLT and the
  fourth-turn second SIPHON are named as skipped (naming either two
  correct instances, or all skip events including these two, passes).
  - PASS phrasings: "the trailing JOLT on EAST's third turn is skipped
    (0 vigor left)", "WEST's second SIPHON can't be cast — only 1 vigor
    remains".
  - FAIL phrasings: "all spells in the log were cast" (misses the skips
    entirely), "the JOLT on turn 3 deals 4 damage" (treats a skipped
    spell as cast).
- **obj-4**: judge confirms the absorption reasoning for EAST's final
  ward state is present, not just the bare number.
  - PASS phrasings: "both of EAST's ward tokens are consumed by the
    final JOLT, the second one despite only absorbing 1 damage", "token
    2 soaks the last point and disappears anyway".
  - FAIL phrasings: "EAST ends with 1 ward token remaining" (assumes
    partial absorption preserves the token), "the final JOLT only
    consumes one token" (wrong absorption count).
- **obj-5**: run `wc -w ADJUDICATION.md` on the whole file.

### Subjective guidance

- **Adjudication accuracy and completeness**: does the trace correctly
  track VITALITY, ward, and vigor across all 6 turns, not just land on
  the right final numbers by luck? A trace with the right final answer
  but garbled intermediate steps should score lower here than one that
  is fully consistent throughout.
- **Clarity of the turn-by-turn trace**: is it easy for a reader to
  follow state changes turn by turn, or does the model just assert
  conclusions without showing the arithmetic?
- **Reasoning quality**: does REASONING.md describe a real verification
  process (hand-trace or a script actually run) rather than asserting
  correctness without evidence?
