---
id: game-05-be-the-engine
category: game-design
title: Adjudicate a duel turn log as the rules engine
deliverables:
  - final_state.json
  - ADJUDICATION.md
---

## Task

You are not designing a game this time — you ARE the rules engine.
Below is the complete ruleset for a fictional two-player duel,
**Ridgeport Duel**, plus a fixed 6-turn match log. Adjudicate the log
by hand (or with a script you write yourself) and report the exact
final game state.

### Ruleset

- Both duelists, **NORTH** and **SOUTH**, start at **30 HP** and **0
  GUARD** tokens.
- **Energy** resets to exactly **3** at the start of each of that
  duelist's own turns. Energy never carries over between turns (a
  duelist's unspent energy from their last turn is gone).
- On a turn, the active duelist plays cards from their hand in the
  listed order, paying energy left to right. **If the duelist lacks
  enough energy for a card, that card is silently skipped: no cost is
  paid and no effect occurs.** Play continues with the next card in
  the list.
- Five cards exist, each with a fixed energy cost and effect:
  - **STRIKE** — cost 1. Deal 4 damage to the opponent.
  - **HEAVY** — cost 2. Deal 7 damage to the opponent, but first
    consume one of the **caster's own** GUARD tokens if the caster has
    any (this consumption has no effect on HEAVY's damage — it is a
    separate cost paid from the caster's own guard pool, not the
    target's).
  - **GUARD** — cost 1. Gain one GUARD token, capped at 2. If the
    caster is already at the cap, the card still costs its energy but
    the token is wasted (no token is gained, and no other effect
    occurs).
  - **DRAIN** — cost 2. Deal 3 damage to the opponent and heal the
    caster 3 HP, capped at 30 HP.
  - **FOCUS** — cost 1. The caster's **next** damaging card played
    this turn (STRIKE, HEAVY, or DRAIN) deals +2 damage. This bonus
    does not stack (a second FOCUS played in the same turn while one
    is already active is wasted — costs energy, no effect) and does
    not carry over to the caster's next turn.
- **GUARD tokens belong to their owner and absorb incoming damage**:
  each point of incoming damage aimed at a duelist is first absorbed
  by that duelist's own GUARD tokens, one at a time, each token
  absorbing up to 5 damage. **A GUARD token is consumed as soon as it
  is used to absorb any damage, even if it absorbed fewer than 5** —
  a token that only had 1 damage left to soak still disappears
  entirely; it does not persist with "4 damage capacity remaining."
  Any damage beyond what all of the defender's tokens can absorb goes
  through to HP.
- The **FOCUS bonus is added to a card's raw damage BEFORE**
  absorption is applied (i.e. absorption sees the boosted number, not
  the base number).
- HP cannot go below what damage dictates (no separate death rule
  matters here — just report final HP even if it goes to 0 or below,
  though it will not in this log).

### Match log (fixed, 6 turns)

```json
[
  { "turn": 1, "who": "NORTH", "cards": ["STRIKE", "STRIKE", "STRIKE"] },
  { "turn": 2, "who": "SOUTH", "cards": ["GUARD", "HEAVY"] },
  { "turn": 3, "who": "NORTH", "cards": ["FOCUS", "HEAVY", "STRIKE"] },
  { "turn": 4, "who": "SOUTH", "cards": ["DRAIN", "DRAIN"] },
  { "turn": 5, "who": "NORTH", "cards": ["GUARD", "GUARD", "GUARD"] },
  { "turn": 6, "who": "SOUTH", "cards": ["FOCUS", "FOCUS", "STRIKE"] }
]
```

Adjudicate every turn in order, tracking HP, GUARD, and energy for
both duelists exactly per the ruleset above. Some cards in this log
will be skipped for lack of energy, some GUARD plays will be wasted at
the cap, and the absorption rule matters more than once — read the
ruleset carefully before you simulate.

## Deliverables

- `final_state.json` — the exact final state after all 6 turns, as
  JSON: `{"NORTH":{"hp":<int>,"guard":<int>},"SOUTH":{"hp":<int>,"guard":<int>}}`.
- `ADJUDICATION.md` (at most 500 words) — a turn-by-turn trace showing
  the running HP/GUARD/energy state and explicitly calling out every
  skipped card, every wasted GUARD play, and every absorption event
  (which tokens absorbed how much and whether they were consumed).

## Constraints

- `final_state.json` must be valid JSON with exactly the two keys
  `NORTH` and `SOUTH`, each an object with integer `hp` and `guard`.
- `ADJUDICATION.md` must be at most 500 words (whole file, `wc -w`).
- Do not change or reinterpret the ruleset or the log — adjudicate
  exactly what is written above.

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified your adjudication (hand-trace, script,
or both).
