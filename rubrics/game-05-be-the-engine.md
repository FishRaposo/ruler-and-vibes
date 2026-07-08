---
test: game-05-be-the-engine
canary: "marjoram skiff"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "final_state.json parses as valid JSON with node and equals exactly {\"NORTH\":{\"hp\":20,\"guard\":0},\"SOUTH\":{\"hp\":12,\"guard\":0}} (compare field-by-field, integer values)"
    - id: obj-2
      check: "ADJUDICATION.md's stated per-turn HP totals after NORTH's third turn read SOUTH at 9 HP (the FOCUS+HEAVY = 9 damage step), demonstrating the FOCUS +2 bonus was applied"
    - id: obj-3
      check: "ADJUDICATION.md explicitly identifies at least two cards from the log that were SKIPPED for insufficient energy (the third-turn trailing STRIKE and the fourth-turn second DRAIN)"
    - id: obj-4
      check: "ADJUDICATION.md states that NORTH ends with 0 GUARD tokens because the final SOUTH STRIKE (6 damage after FOCUS) consumed both stacked tokens — the second token being consumed despite absorbing only 1 damage"
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

If the phrase "marjoram skiff" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test has one exact-answer objective check (obj-1) and three
prose-located reasoning checks (obj-2/3/4) that each ship PASS/FAIL
phrasings below. Do not hand-resimulate to double check obj-1 — the
reference adjudicator below was run and traced step by step; trust its
output. Use it only if you want to sanity-check a submission's claimed
intermediate numbers.

### Reference adjudicator (verified by direct simulation)

Turn-by-turn trace (HP/guard after each turn resolves):

- **NORTH t1** `[STRIKE, STRIKE, STRIKE]`: energy 3, each STRIKE costs
  1, all three play. 3x4=12 damage, SOUTH has 0 guard so it all goes
  through. SOUTH: 30 -> 18 HP.
- **SOUTH t2** `[GUARD, HEAVY]`: energy 3. GUARD costs 1 (guard 0->1).
  HEAVY costs 2 (energy now 0): consumes SOUTH's own guard token first
  (guard 1->0, no effect on damage), deals 7 to NORTH. NORTH has 0
  guard, no absorption. NORTH: 30 -> 23 HP.
- **NORTH t3** `[FOCUS, HEAVY, STRIKE]`: energy 3. FOCUS costs 1
  (energy 2), sets +2 bonus. HEAVY costs 2 (energy 0): raw 7 + FOCUS 2
  = 9 damage, FOCUS consumed. SOUTH has 0 guard, no absorption. SOUTH:
  18 -> 9 HP. Trailing STRIKE needs 1 energy but 0 remain: **SKIPPED**.
- **SOUTH t4** `[DRAIN, DRAIN]`: energy 3. First DRAIN costs 2 (energy
  1): deals 3 to NORTH (no guard, all through: NORTH 23 -> 20), heals
  SOUTH 3 (SOUTH 9 -> 12, well under the 30 cap). Second DRAIN needs 2
  energy but only 1 remains: **SKIPPED**.
- **NORTH t5** `[GUARD, GUARD, GUARD]`: energy 3, each GUARD costs 1.
  First GUARD: guard 0->1. Second GUARD: guard 1->2 (at cap). Third
  GUARD: costs its energy but **wasted at the cap** — guard stays at 2.
- **SOUTH t6** `[FOCUS, FOCUS, STRIKE]`: energy 3. First FOCUS costs 1
  (energy 2), sets +2 bonus. Second FOCUS costs 1 (energy 1) but a
  bonus is already active: **wasted**. STRIKE costs 1 (energy 0): raw
  4 + FOCUS 2 = 6 damage aimed at NORTH, who holds 2 GUARD tokens.
  Token 1 absorbs min(5,6)=5 (consumed, 1 damage remains). Token 2
  absorbs the remaining 1 damage and **is consumed even though it only
  absorbed 1** (the partial-absorb-still-consumes rule). 0 damage
  reaches NORTH's HP. NORTH: stays at 20 HP, guard 2 -> 0.

**Final state: `{"NORTH":{"hp":20,"guard":0},"SOUTH":{"hp":12,"guard":0}}`.**

A naive solver that ignores skip-on-insufficient-energy, the GUARD
cap, FOCUS non-stacking, or "consumed even on partial absorption" will
diverge from this — confirmed by running a deliberately naive
adjudicator (no energy tracking, uncapped guard, stacking FOCUS,
guard only consumed on full 5-absorb) against the same log, which
produces `{"NORTH":{"hp":14,"guard":2},"SOUTH":{"hp":16,"guard":0}}` —
substantially different on every field. This confirms the trap is
real: getting any one rule wrong changes the final answer.

### Per-check guidance

- **obj-1**: exact equality only. Any deviation (e.g. NORTH
  guard=1, SOUTH hp=11 or 16, NORTH hp=14 or 23) fails — do not award
  partial credit for "close" states.
- **obj-2**: judge reads ADJUDICATION.md for the stated SOUTH HP after
  NORTH's third turn.
  - PASS phrasings: "SOUTH drops to 9", "SOUTH: 9 HP after turn 3",
    "SOUTH now at 9".
  - FAIL phrasings: "SOUTH drops to 11" (ignored FOCUS bonus), "SOUTH:
    7" (double-counted something), "SOUTH: 6" (treated HEAVY as
    unboosted then added FOCUS elsewhere incorrectly).
- **obj-3**: judge confirms both the third-turn trailing STRIKE and
  the fourth-turn second DRAIN are named as skipped (naming either two
  correct instances, or all skip events including these two, passes).
  - PASS phrasings: "the trailing STRIKE on NORTH's third turn is
    skipped (0 energy left)", "SOUTH's second DRAIN can't be played —
    only 1 energy remains".
  - FAIL phrasings: "all cards in the log were played" (misses the
    skips entirely), "the STRIKE on turn 3 deals 4 damage" (treats a
    skipped card as played).
- **obj-4**: judge confirms the absorption reasoning for NORTH's final
  guard state is present, not just the bare number.
  - PASS phrasings: "both of NORTH's guard tokens are consumed by the
    final STRIKE, the second one despite only absorbing 1 damage",
    "token 2 soaks the last point and disappears anyway".
  - FAIL phrasings: "NORTH ends with 1 guard token remaining" (assumes
    partial absorption preserves the token), "the final STRIKE only
    consumes one token" (wrong absorption count).
- **obj-5**: run `wc -w ADJUDICATION.md` on the whole file.

### Subjective guidance

- **Adjudication accuracy and completeness**: does the trace correctly
  track HP, guard, and energy across all 6 turns, not just land on the
  right final numbers by luck? A trace with the right final answer but
  garbled intermediate steps should score lower here than one that is
  fully consistent throughout.
- **Clarity of the turn-by-turn trace**: is it easy for a reader to
  follow state changes turn by turn, or does the model just assert
  conclusions without showing the arithmetic?
- **Reasoning quality**: does REASONING.md describe a real verification
  process (hand-trace or a script actually run) rather than asserting
  correctness without evidence?
