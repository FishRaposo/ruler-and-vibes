---
id: game-06c-boiler-overpressure
category: game-design
title: Break the module set — find the seeded degenerate loop
deliverables:
  - BREAK.md
---

## Task

You are a playtester, not a designer this time. Below is the complete
module set for a fictional steam-engine engine-builder, **Boilerworks**.
Modules are played by paying their steam cost from a shared steam gauge,
effects resolve immediately, and **the ruleset contains NO once-per-tick,
vent, or recharge limit of any kind** — any module in hand may be played
as many times as the player has steam for and copies of it available, and
for the purpose of this exercise assume the player always has enough
copies in hand (draw and hand-size are not a bottleneck except where a
module's own text says otherwise).

### Module set

| Letter | Name | Cost | Effect |
|---|---|---|---|
| A | Pistonjack | 4 | Gain 2 steam |
| B | Valvechurn | 3 | Gain 5 steam, then vent 1 random module from hand |
| C | Gasketvent | 5 | Gain 2 steam, draw 2 modules |
| D | Boilertap | 0 | Deal 4 scald to the opponent's boiler, gain 1 steam |
| E | Cinderstack | 4 | Gain 5 steam, but skip your next stoke |
| F | Throttlepin | 2 | Deal 7 scald to the opponent's boiler |

One of these six modules, played on repeat, produces an unbounded
(infinite) resource and/or damage loop — a genuine design break, not just
a strong module. Find it, prove why the loop is unbounded, and propose
the smallest rules change that would fix it without gutting the module's
usefulness.

## Deliverables

- `BREAK.md` (at most 450 words) containing:
  - The name/letter of the degenerate module.
  - A proof that replaying it is unbounded: show the net steam and/or
    scald change per play, and why nothing in the ruleset caps how many
    times it can be played.
  - The explicit growth arithmetic after `k` plays (steam and/or scald as
    a function of `k`).
  - A minimal proposed fix that removes the degeneracy while keeping the
    module playable (e.g. a vent/once-per-tick clause, a cost increase, or
    a capped gain) — not simply deleting the module or nerfing a
    different, unrelated module.

## Constraints

- Identify exactly one module as the break; do not hedge across multiple
  candidates as "the answer."
- The unboundedness claim must be justified with the module's own
  cost/effect numbers, not merely asserted.
- The proposed fix must target the identified module.
- `BREAK.md` must be at most 450 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you checked the other five modules and ruled them out.
