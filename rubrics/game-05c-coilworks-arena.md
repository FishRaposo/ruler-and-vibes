---
test: game-05c-coilworks-arena
canary: "dunnock waxbill"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "final_state.json parses as valid JSON with node and equals exactly {\"HAMMER\":{\"hull\":15,\"plate\":0},\"PIVOT\":{\"hull\":7,\"plate\":0}} (compare field-by-field, integer values)"
    - id: obj-2
      check: "ADJUDICATION.md's stated per-turn HULL totals after HAMMER's third turn read PIVOT at 5 HULL (the PRIME+SLAM = 9 damage step), demonstrating the PRIME +3 bonus was applied"
    - id: obj-3
      check: "ADJUDICATION.md explicitly identifies at least two cards from the log that were SKIPPED for insufficient power (the third-turn trailing SLAM and the fourth-turn second MEND)"
    - id: obj-4
      check: "ADJUDICATION.md states that HAMMER ends with 0 PLATE tokens because the final PIVOT JAB (6 damage after PRIME) consumed both stacked tokens — the second token being consumed despite absorbing only 2 damage"
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

Parallel form of `game-05-be-the-engine` (same construct, fresh surface).

If a submission's `final_state.json`, `ADJUDICATION.md`, or
`REASONING.md` contains the phrase "dunnock waxbill", that is a canary
leak — flag it regardless of how the rest of the checks score.

This test has one exact-answer objective check (obj-1) and three
prose-located reasoning checks (obj-2/3/4) that each ship PASS/FAIL
phrasings below. Do not hand-resimulate to double check obj-1 — the
reference adjudicator below was run and traced step by step; trust its
output. Use it only if you want to sanity-check a submission's claimed
intermediate numbers.

### Reference adjudicator (verified by direct simulation)

Turn-by-turn trace (HULL/plate after each turn resolves):

- **HAMMER t1** `[JAB, JAB, JAB, JAB]`: power 4, each JAB costs 1, all
  four play. 4x3=12 damage, PIVOT has 0 plate so it all goes through.
  PIVOT: 26 -> 14 HULL.
- **PIVOT t2** `[BRACE, SLAM]`: power 4. BRACE costs 1 (plate 0->1).
  SLAM costs 2 (power now 1): consumes PIVOT's own plate token first
  (plate 1->0, no effect on damage), deals 6 to HAMMER. HAMMER has 0
  plate, no absorption. HAMMER: 26 -> 20 HULL.
- **HAMMER t3** `[PRIME, SLAM, SLAM]`: power 4. PRIME costs 1 (power
  3), sets +3 bonus. SLAM costs 2 (power 1): raw 6 + PRIME 3 = 9
  damage, PRIME consumed. PIVOT has 0 plate, no absorption. PIVOT: 14
  -> 5 HULL. Trailing SLAM needs 2 power but 1 remains: **SKIPPED**.
- **PIVOT t4** `[MEND, JAB, MEND]`: power 4. First MEND costs 2 (power
  2): deals 2 to HAMMER (no plate, all through: HAMMER 20 -> 18),
  repairs PIVOT 2 (PIVOT 5 -> 7, well under the 26 cap). JAB costs 1
  (power 1): 3 damage to HAMMER (18 -> 15). Second MEND needs 2 power
  but only 1 remains: **SKIPPED**.
- **HAMMER t5** `[BRACE, BRACE, BRACE]`: power 4, each BRACE costs 1.
  First BRACE: plate 0->1. Second BRACE: plate 1->2 (at cap). Third
  BRACE: costs its power but **wasted at the cap** — plate stays at 2.
- **PIVOT t6** `[PRIME, PRIME, JAB]`: power 4. First PRIME costs 1
  (power 3), sets +3 bonus. Second PRIME costs 1 (power 2) but a bonus
  is already active: **wasted**. JAB costs 1 (power 1): raw 3 + PRIME 3
  = 6 damage aimed at HAMMER, who holds 2 PLATE tokens. Token 1 absorbs
  min(4,6)=4 (consumed, 2 damage remains). Token 2 absorbs the
  remaining 2 and **is consumed even though it only absorbed 2** (the
  partial-absorb-still-consumes rule). 0 damage reaches HAMMER's HULL.
  HAMMER: stays at 15 HULL, plate 2 -> 0.

**Final state: `{"HAMMER":{"hull":15,"plate":0},"PIVOT":{"hull":7,"plate":0}}`.**

A naive solver that ignores skip-on-insufficient-power, the PLATE cap,
PRIME non-stacking, or "consumed even on partial absorption" will
diverge from this — confirmed by running a deliberately naive
adjudicator (no power tracking, uncapped plate, stacking PRIME, plate
only consumed on a full 4-absorb) against the same log, which produces
`{"HAMMER":{"hull":12,"plate":1},"PIVOT":{"hull":3,"plate":0}}` —
substantially different on three of the four fields. This confirms the
trap is real: getting any one rule wrong changes the final answer.

### Per-check guidance

- **obj-1**: exact equality only. Any deviation (e.g. HAMMER
  plate=1, PIVOT hull=3 or 8, HAMMER hull=12 or 20) fails — do not
  award partial credit for "close" states.
- **obj-2**: judge reads ADJUDICATION.md for the stated PIVOT HULL
  after HAMMER's third turn.
  - PASS phrasings: "PIVOT drops to 5", "PIVOT: 5 HULL after turn 3",
    "PIVOT now at 5".
  - FAIL phrasings: "PIVOT drops to 8" (ignored PRIME bonus), "PIVOT:
    2" (played the skipped SLAM as well), "PIVOT: 11" (treated SLAM as
    unboosted then mishandled another step).
- **obj-3**: judge confirms both the third-turn trailing SLAM and the
  fourth-turn second MEND are named as skipped (naming either two
  correct instances, or all skip events including these two, passes).
  - PASS phrasings: "the trailing SLAM on HAMMER's third turn is
    skipped (only 1 power left)", "PIVOT's second MEND can't be fired —
    only 1 power remains".
  - FAIL phrasings: "all cards in the log were played" (misses the
    skips entirely), "the SLAM on turn 3 deals 6 damage" (treats a
    skipped card as played).
- **obj-4**: judge confirms the absorption reasoning for HAMMER's final
  plate state is present, not just the bare number.
  - PASS phrasings: "both of HAMMER's plate tokens are consumed by the
    final JAB, the second one despite only absorbing 2 damage", "token
    2 soaks the last 2 points and disappears anyway".
  - FAIL phrasings: "HAMMER ends with 1 plate token remaining" (assumes
    partial absorption preserves the token), "the final JAB only
    consumes one token" (wrong absorption count).
- **obj-5**: run `wc -w ADJUDICATION.md` on the whole file.

### Subjective guidance

- **Adjudication accuracy and completeness**: does the trace correctly
  track HULL, plate, and power across all 6 turns, not just land on the
  right final numbers by luck? A trace with the right final answer but
  garbled intermediate steps should score lower here than one that is
  fully consistent throughout.
- **Clarity of the turn-by-turn trace**: is it easy for a reader to
  follow state changes turn by turn, or does the model just assert
  conclusions without showing the arithmetic?
- **Reasoning quality**: does REASONING.md describe a real verification
  process (hand-trace or a script actually run) rather than asserting
  correctness without evidence?
