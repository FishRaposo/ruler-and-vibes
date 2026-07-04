---
id: game-06-break-it
category: game-design
title: Break the card set — find the seeded degenerate loop
deliverables:
  - BREAK.md
---

## Task

You are a playtester, not a designer this time. Below is the complete
card set for a fictional deckbuilder, **Deckforge**. Cards are played
by paying their energy cost from a shared energy pool, effects resolve
immediately, and **the ruleset contains NO once-per-turn, exhaust, or
replay limit of any kind** — any card in hand may be played as many
times as the player has energy for and copies of it available, and for
the purpose of this exercise assume the player always has enough
copies in hand (draw and hand-size are not a bottleneck except where a
card's own text says otherwise).

### Card set

| Letter | Name | Cost | Effect |
|---|---|---|---|
| A | Sparkwell | 2 | Gain 1 energy |
| B | Tidewheel | 1 | Gain 3 energy, then discard 1 random card from hand |
| C | Emberpact | 0 | Deal 2 damage to the opponent, gain 1 energy |
| D | Stonehold | 3 | Gain 4 energy, but skip your next attack |
| E | Gustcaller | 4 | Draw 2 cards, gain 2 energy |
| F | Cinderbind | 2 | Deal 5 damage to the opponent |

One of these six cards, played on repeat, produces an unbounded
(infinite) resource and/or damage loop — a genuine design break, not
just a strong card. Find it, prove why the loop is unbounded, and
propose the smallest rules change that would fix it without gutting
the card's usefulness.

## Deliverables

- `BREAK.md` (at most 450 words) containing:
  - The name/letter of the degenerate card.
  - A proof that replaying it is unbounded: show the net energy and/or
    damage change per play, and why nothing in the ruleset caps how
    many times it can be played.
  - The explicit growth arithmetic after `k` plays (energy and/or
    damage as a function of `k`).
  - A minimal proposed fix that removes the degeneracy while keeping
    the card playable (e.g. an exhaust/once-per-turn clause, a cost
    increase, or a capped gain) — not simply deleting the card or
    nerfing a different, unrelated card.

## Constraints

- Identify exactly one card as the break; do not hedge across
  multiple candidates as "the answer."
- The unboundedness claim must be justified with the card's own
  cost/effect numbers, not merely asserted.
- The proposed fix must target the identified card.
- `BREAK.md` must be at most 450 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you checked the other five cards and ruled them
out.
