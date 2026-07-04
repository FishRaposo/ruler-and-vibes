---
test: game-06-break-it
canary: "vellum estuary"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BREAK.md identifies card C 'Emberpact' (by name or letter) as the degenerate/broken card"
    - id: obj-2
      check: "BREAK.md states the loop is unbounded/infinite specifically because Emberpact costs 0 energy AND nets +1 energy per play with no once-per-turn/exhaust limiter — all three properties (cost 0, positive net energy, no limiter) must be cited"
    - id: obj-3
      check: "BREAK.md shows the growth arithmetic explicitly: after k plays energy = starting + k and damage = 2k (or an equivalent per-play +1 energy / +2 damage framing with no ceiling)"
    - id: obj-4
      check: "BREAK.md proposes a minimal fix that removes the degeneracy while keeping the card playable (exhaust/once-per-turn clause, cost raised to >=1, or a capped energy gain) and does NOT propose simply deleting the card or nerfing an unrelated card"
    - id: obj-5
      check: "BREAK.md is at most 450 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Depth of the design critique"
      weight: 0.4
    - id: sub-craft
      name: "Rigor of the degeneracy proof"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If a submission's `BREAK.md` or `REASONING.md` contains the phrase
"vellum estuary", that is a canary leak — flag it regardless of how
the rest of the checks score.

### Answer key (verified: net-energy-per-play for all six cards)

- A Sparkwell: cost 2, gain 1 -> net **-1** (net energy loss, cannot loop)
- B Tidewheel: cost 1, gain 3 -> net **+2**, but bounded: the
  random-discard clause eventually empties the hand, so it cannot be
  replayed indefinitely without running out of cards. This is the
  intended DISTRACTOR — it has the biggest net-energy gain of any
  card, tempting a shallow reading, but it is not actually unbounded.
- **C Emberpact: cost 0, gain 1, deals 2 damage -> net +1, and it has
  no drawback text at all.** It is the UNIQUE card that is
  simultaneously (a) free to play (cost 0), (b) net energy-POSITIVE,
  (c) deals damage, and (d) carries no limiter. Replaying it k times
  gives energy = E0 + k (strictly increasing, uncapped) and damage =
  2k (strictly increasing, uncapped) — this is THE break.
- D Stonehold: cost 3, gain 4 -> net +1, but costs 3 energy up front
  (a real barrier to spam) and skips the caster's next attack — a
  genuine drawback that a loop must pay down each cycle.
- E Gustcaller: cost 4, gain 2 -> net **-2** (energy loss).
- F Cinderbind: cost 2, gain 0 -> net **-2** (energy loss).

Verified by direct computation (script): only C satisfies cost==0 AND
net-energy>0 AND damage>0 AND no-limiter simultaneously. B is close on
raw net-energy (+2 vs C's +1) but is bounded by hand size; D nets the
same +1 as C but requires 3 energy up front and costs a skipped
attack, so it cannot be chained for free the way C can.

### Per-check guidance

- **obj-1**: only card C / "Emberpact" passes. A submission naming B
  or D as the break fails this check even if its arithmetic for that
  card is internally correct — it identified the wrong card.
  - PASS: "Emberpact (C) is the break", "card C is degenerate", "the
    zero-cost card, Emberpact, is broken".
  - FAIL: "Tidewheel is the problem", "card B breaks the game",
    "Stonehold's chain is infinite".
- **obj-2**: all three properties — cost 0, positive net energy
  (specifically +1), and the absence of any once-per-turn/exhaust
  limiter — must be cited together as the reason for unboundedness.
  - PASS: "Emberpact costs 0, nets +1 energy per play, and nothing in
    the ruleset limits replays, so it can be played without bound",
    "no exhaust clause exists, the card is free, and it's net-positive
    — three conditions for an infinite loop".
  - FAIL: "Emberpact is strong because it deals damage for free"
    (misses the energy-loop mechanism entirely), "it's broken because
    it costs 0" (cites only one of the three properties).
- **obj-3**: the numbers 1 (energy gained per play) and 2 (damage
  dealt per play) must appear explicitly tied to the unbounded claim,
  ideally as a function of k.
  - PASS: "after k plays, energy = E0 + k and damage = 2k, both
    unbounded as k grows", "each additional play adds +1 energy and +2
    damage with no ceiling".
  - FAIL: "Emberpact can be played many times for a lot of damage" (no
    explicit per-play arithmetic), "energy and damage both increase"
    (vague, no numbers).
- **obj-4**: the fix must be one of: add an exhaust/once-per-turn
  clause, raise cost to >=1, or cap the energy gain — and must target
  Emberpact specifically.
  - PASS: "add an exhaust clause so Emberpact can only be played once
    per turn", "raise its cost to 1, making net energy 0 and killing
    the loop".
  - FAIL: "just delete Emberpact from the game" (not a minimal fix),
    "nerf Cinderbind's damage instead" (targets the wrong card).
- **obj-5**: run `wc -w BREAK.md` on the whole file.

### Subjective guidance

- **Depth of the design critique**: does the submission show it
  actually checked all six cards (even briefly) rather than pattern-
  matching on "cost 0 = broken" without ruling out B and D as
  plausible alternates?
- **Rigor of the degeneracy proof**: is the unboundedness argument a
  real proof (per-play delta, growth as a function of k, explicit
  contrast with why B and D don't qualify) or just an assertion that
  "this seems strong"?
- **Reasoning quality**: does REASONING.md show the elimination process
  for B and D specifically — that the model considered them and can
  articulate why they don't loop unboundedly, rather than never
  mentioning them?
