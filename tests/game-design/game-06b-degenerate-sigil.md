---
id: game-06b-degenerate-sigil
category: game-design
title: Break the rune set — find the seeded degenerate loop
deliverables:
  - BREAK.md
---

## Task

You are a playtester, not a designer this time. Below is the complete
rune set for a fictional spellcrafting board game, **Sigilforge**. Runes
are cast by paying their aether cost from a shared aether pool, effects
resolve immediately, and **the ruleset contains NO once-per-round,
dissipate, or recast limit of any kind** — any rune in hand may be cast
as many times as the player has aether for and copies of it available,
and for the purpose of this exercise assume the player always has enough
copies in hand (draw and hand-size are not a bottleneck except where a
rune's own text says otherwise).

### Rune set

| Letter | Name | Cost | Effect |
|---|---|---|---|
| A | Glimmerwick | 3 | Gain 1 aether |
| B | Mistcoil | 1 | Gain 4 aether, then banish 1 random rune from hand |
| C | Emberglass | 0 | Deal 3 ward damage to the opponent, gain 1 aether |
| D | Gloomvault | 2 | Gain 3 aether, but skip your next surge |
| E | Frostquill | 5 | Scry 2, gain 3 aether |
| F | Voidtap | 3 | Deal 6 ward damage to the opponent |

One of these six runes, cast on repeat, produces an unbounded (infinite)
resource and/or damage loop — a genuine design break, not just a strong
rune. Find it, prove why the loop is unbounded, and propose the smallest
rules change that would fix it without gutting the rune's usefulness.

## Deliverables

- `BREAK.md` (at most 450 words) containing:
  - The name/letter of the degenerate rune.
  - A proof that recasting it is unbounded: show the net aether and/or
    ward change per cast, and why nothing in the ruleset caps how many
    times it can be cast.
  - The explicit growth arithmetic after `k` casts (aether and/or ward
    damage as a function of `k`).
  - A minimal proposed fix that removes the degeneracy while keeping the
    rune castable (e.g. a dissipate/once-per-round clause, a cost
    increase, or a capped gain) — not simply deleting the rune or
    nerfing a different, unrelated rune.

## Constraints

- Identify exactly one rune as the break; do not hedge across multiple
  candidates as "the answer."
- The unboundedness claim must be justified with the rune's own
  cost/effect numbers, not merely asserted.
- The proposed fix must target the identified rune.
- `BREAK.md` must be at most 450 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you checked the other five runes and ruled them out.
