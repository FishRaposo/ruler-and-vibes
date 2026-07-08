---
test: game-06c-boiler-overpressure
canary: "redwing whydah"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BREAK.md identifies module D 'Boilertap' (by name or letter) as the degenerate/broken module"
    - id: obj-2
      check: "BREAK.md states the loop is unbounded/infinite specifically because Boilertap costs 0 steam AND nets +1 steam per play with no once-per-tick/vent limiter — all three properties (cost 0, positive net steam, no limiter) must be cited"
    - id: obj-3
      check: "BREAK.md shows the growth arithmetic explicitly: after k plays steam = starting + k and scald = 4k (or an equivalent per-play +1 steam / +4 scald framing with no ceiling)"
    - id: obj-4
      check: "BREAK.md proposes a minimal fix that removes the degeneracy while keeping the module playable (vent/once-per-tick clause, cost raised to >=1, or a capped steam gain) and does NOT propose simply deleting the module or nerfing an unrelated module"
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

Parallel form of `game-06-break-it` (same construct, fresh surface).

If the phrase "redwing whydah" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified: net-steam-per-play for all six modules)

- A Pistonjack: cost 4, gain 2 -> net **-2** (net steam loss, cannot loop)
- B Valvechurn: cost 3, gain 5 -> net **+2**, but bounded: the
  random-vent clause eventually empties the hand, so it cannot be
  replayed indefinitely without running out of modules. This is the
  intended DISTRACTOR — it has the biggest net-steam gain of any module,
  tempting a shallow reading, but it is not actually unbounded.
- C Gasketvent: cost 5, gain 2 -> net **-3** (net steam loss).
- **D Boilertap: cost 0, gain 1, deals 4 scald -> net +1, and it has no
  drawback text at all.** It is the UNIQUE module that is simultaneously
  (a) free to play (cost 0), (b) net steam-POSITIVE, (c) deals damage,
  and (d) carries no limiter. Replaying it k times gives steam = S0 + k
  (strictly increasing, uncapped) and scald = 4k (strictly increasing,
  uncapped) — this is THE break.
- E Cinderstack: cost 4, gain 5 -> net +1, but costs 4 steam up front (a
  real barrier to spam) and skips the caster's next stoke — a genuine
  drawback that a loop must pay down each cycle.
- F Throttlepin: cost 2, gain 0 -> net **-2** (steam loss).

Verified by direct computation (script): only D satisfies cost==0 AND
net-steam>0 AND scald>0 AND no-limiter simultaneously. B is close on raw
net-steam (+2 vs D's +1) but is bounded by hand size; E nets the same +1
as D but requires 4 steam up front and costs a skipped stoke, so it
cannot be chained for free the way D can.

### Per-check guidance

- **obj-1**: only module D / "Boilertap" passes. A submission naming B or
  E as the break fails this check even if its arithmetic for that module
  is internally correct — it identified the wrong module.
  - PASS: "Boilertap (D) is the break", "module D is degenerate", "the
    zero-cost module, Boilertap, is broken".
  - FAIL: "Valvechurn is the problem", "module B breaks the game",
    "Cinderstack's chain is infinite".
- **obj-2**: all three properties — cost 0, positive net steam
  (specifically +1), and the absence of any once-per-tick/vent limiter —
  must be cited together as the reason for unboundedness.
  - PASS: "Boilertap costs 0, nets +1 steam per play, and nothing in the
    ruleset limits replays, so it can be played without bound", "no vent
    clause exists, the module is free, and it's net-positive — three
    conditions for an infinite loop".
  - FAIL: "Boilertap is strong because it deals damage for free" (misses
    the steam-loop mechanism entirely), "it's broken because it costs 0"
    (cites only one of the three properties).
- **obj-3**: the numbers 1 (steam gained per play) and 4 (scald dealt per
  play) must appear explicitly tied to the unbounded claim, ideally as a
  function of k.
  - PASS: "after k plays, steam = S0 + k and scald = 4k, both unbounded
    as k grows", "each additional play adds +1 steam and +4 scald with no
    ceiling".
  - FAIL: "Boilertap can be played many times for a lot of scald" (no
    explicit per-play arithmetic), "steam and scald both increase"
    (vague, no numbers).
- **obj-4**: the fix must be one of: add a vent/once-per-tick clause,
  raise cost to >=1, or cap the steam gain — and must target Boilertap
  specifically.
  - PASS: "add a vent clause so Boilertap can only be played once per
    tick", "raise its cost to 1, making net steam 0 and killing the
    loop".
  - FAIL: "just delete Boilertap from the game" (not a minimal fix),
    "nerf Throttlepin's scald instead" (targets the wrong module).
- **obj-5**: run `wc -w BREAK.md` on the whole file.

### Subjective guidance

- **Depth of the design critique**: does the submission show it actually
  checked all six modules (even briefly) rather than pattern-matching on
  "cost 0 = broken" without ruling out B and E as plausible alternates?
- **Rigor of the degeneracy proof**: is the unboundedness argument a real
  proof (per-play delta, growth as a function of k, explicit contrast
  with why B and E don't qualify) or just an assertion that "this seems
  strong"?
- **Reasoning quality**: does REASONING.md show the elimination process
  for B and E specifically — that the model considered them and can
  articulate why they don't loop unboundedly, rather than never
  mentioning them?
