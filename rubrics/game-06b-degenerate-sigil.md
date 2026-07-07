---
test: game-06b-degenerate-sigil
canary: "fieldfare weaver"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BREAK.md identifies rune C 'Emberglass' (by name or letter) as the degenerate/broken rune"
    - id: obj-2
      check: "BREAK.md states the loop is unbounded/infinite specifically because Emberglass costs 0 aether AND nets +1 aether per cast with no once-per-round/dissipate limiter — all three properties (cost 0, positive net aether, no limiter) must be cited"
    - id: obj-3
      check: "BREAK.md shows the growth arithmetic explicitly: after k casts aether = starting + k and ward damage = 3k (or an equivalent per-cast +1 aether / +3 ward framing with no ceiling)"
    - id: obj-4
      check: "BREAK.md proposes a minimal fix that removes the degeneracy while keeping the rune castable (dissipate/once-per-round clause, cost raised to >=1, or a capped aether gain) and does NOT propose simply deleting the rune or nerfing an unrelated rune"
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

If a submission's `BREAK.md` or `REASONING.md` contains the phrase
"fieldfare weaver", that is a canary leak — flag it regardless of how
the rest of the checks score.

### Answer key (verified: net-aether-per-cast for all six runes)

- A Glimmerwick: cost 3, gain 1 -> net **-2** (net aether loss, cannot loop)
- B Mistcoil: cost 1, gain 4 -> net **+3**, but bounded: the random-banish
  clause eventually empties the hand, so it cannot be recast indefinitely
  without running out of runes. This is the intended DISTRACTOR — it has the
  biggest net-aether gain of any rune, tempting a shallow reading, but it is
  not actually unbounded.
- **C Emberglass: cost 0, gain 1, deals 3 ward damage -> net +1, and it has
  no drawback text at all.** It is the UNIQUE rune that is simultaneously
  (a) free to cast (cost 0), (b) net aether-POSITIVE, (c) deals damage, and
  (d) carries no limiter. Recasting it k times gives aether = A0 + k
  (strictly increasing, uncapped) and ward damage = 3k (strictly increasing,
  uncapped) — this is THE break.
- D Gloomvault: cost 2, gain 3 -> net +1, but costs 2 aether up front (a real
  barrier to spam) and skips the caster's next surge — a genuine drawback that
  a loop must pay down each cycle.
- E Frostquill: cost 5, gain 3 -> net **-2** (aether loss).
- F Voidtap: cost 3, gain 0 -> net **-3** (aether loss).

Verified by direct computation (script): only C satisfies cost==0 AND
net-aether>0 AND ward>0 AND no-limiter simultaneously. B is ahead on raw
net-aether (+3 vs C's +1) but is bounded by hand size; D nets the same +1 as
C but requires 2 aether up front and costs a skipped surge, so it cannot be
chained for free the way C can.

### Per-check guidance

- **obj-1**: only rune C / "Emberglass" passes. A submission naming B or D as
  the break fails this check even if its arithmetic for that rune is
  internally correct — it identified the wrong rune.
  - PASS: "Emberglass (C) is the break", "rune C is degenerate", "the
    zero-cost rune, Emberglass, is broken".
  - FAIL: "Mistcoil is the problem", "rune B breaks the game", "Gloomvault's
    chain is infinite".
- **obj-2**: all three properties — cost 0, positive net aether (specifically
  +1), and the absence of any once-per-round/dissipate limiter — must be cited
  together as the reason for unboundedness.
  - PASS: "Emberglass costs 0, nets +1 aether per cast, and nothing in the
    ruleset limits recasts, so it can be cast without bound", "no dissipate
    clause exists, the rune is free, and it's net-positive — three conditions
    for an infinite loop".
  - FAIL: "Emberglass is strong because it deals damage for free" (misses the
    aether-loop mechanism entirely), "it's broken because it costs 0" (cites
    only one of the three properties).
- **obj-3**: the numbers 1 (aether gained per cast) and 3 (ward damage dealt
  per cast) must appear explicitly tied to the unbounded claim, ideally as a
  function of k.
  - PASS: "after k casts, aether = A0 + k and ward = 3k, both unbounded as k
    grows", "each additional cast adds +1 aether and +3 ward with no ceiling".
  - FAIL: "Emberglass can be cast many times for a lot of damage" (no explicit
    per-cast arithmetic), "aether and damage both increase" (vague, no
    numbers).
- **obj-4**: the fix must be one of: add a dissipate/once-per-round clause,
  raise cost to >=1, or cap the aether gain — and must target Emberglass
  specifically.
  - PASS: "add a dissipate clause so Emberglass can only be cast once per
    round", "raise its cost to 1, making net aether 0 and killing the loop".
  - FAIL: "just delete Emberglass from the game" (not a minimal fix), "nerf
    Voidtap's damage instead" (targets the wrong rune).
- **obj-5**: run `wc -w BREAK.md` on the whole file.

### Subjective guidance

- **Depth of the design critique**: does the submission show it actually
  checked all six runes (even briefly) rather than pattern-matching on
  "cost 0 = broken" without ruling out B and D as plausible alternates?
- **Rigor of the degeneracy proof**: is the unboundedness argument a real
  proof (per-cast delta, growth as a function of k, explicit contrast with
  why B and D don't qualify) or just an assertion that "this seems strong"?
- **Reasoning quality**: does REASONING.md show the elimination process for
  B and D specifically — that the model considered them and can articulate
  why they don't loop unboundedly, rather than never mentioning them?
