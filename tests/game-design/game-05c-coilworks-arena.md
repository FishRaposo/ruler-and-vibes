---
id: game-05c-coilworks-arena
category: game-design
title: Adjudicate a battlebot bout log as the rules engine
deliverables:
  - final_state.json
  - ADJUDICATION.md
---

## Task

You are not designing a game this time — you ARE the rules engine.
Below is the complete ruleset for a fictional two-robot arena bout,
**Coilworks Arena**, plus a fixed 6-turn match log. Adjudicate the log
by hand (or with a script you write yourself) and report the exact
final game state.

### Ruleset

- Both battlebots, **HAMMER** and **PIVOT**, start at **26 HULL** and
  **0 PLATE** tokens.
- **Power** resets to exactly **4** at the start of each of that bot's
  own turns. Power never carries over between turns (a bot's unspent
  power from its last turn is gone).
- On a turn, the active bot fires cards from its loadout in the listed
  order, paying power left to right. **If the bot lacks enough power
  for a card, that card is silently skipped: no cost is paid and no
  effect occurs.** Play continues with the next card in the list.
- Five cards exist, each with a fixed power cost and effect:
  - **JAB** — cost 1. Deal 3 damage to the opponent.
  - **SLAM** — cost 2. Deal 6 damage to the opponent, but first
    consume one of the **caster's own** PLATE tokens if the caster has
    any (this consumption has no effect on SLAM's damage — it is a
    separate cost paid from the caster's own plate pool, not the
    target's).
  - **BRACE** — cost 1. Gain one PLATE token, capped at 2. If the
    caster is already at the cap, the card still costs its power but
    the token is wasted (no token is gained, and no other effect
    occurs).
  - **MEND** — cost 2. Deal 2 damage to the opponent and repair the
    caster 2 HULL, capped at 26 HULL.
  - **PRIME** — cost 1. The caster's **next** damaging card fired this
    turn (JAB, SLAM, or MEND) deals +3 damage. This bonus does not
    stack (a second PRIME fired in the same turn while one is already
    active is wasted — costs power, no effect) and does not carry over
    to the caster's next turn.
- **PLATE tokens belong to their owner and absorb incoming damage**:
  each point of incoming damage aimed at a bot is first absorbed by
  that bot's own PLATE tokens, one at a time, each token absorbing up
  to 4 damage. **A PLATE token is consumed as soon as it is used to
  absorb any damage, even if it absorbed fewer than 4** — a token that
  only had 1 damage left to soak still disappears entirely; it does
  not persist with "3 damage capacity remaining." Any damage beyond
  what all of the defender's tokens can absorb goes through to HULL.
- The **PRIME bonus is added to a card's raw damage BEFORE** absorption
  is applied (i.e. absorption sees the boosted number, not the base
  number).
- HULL cannot go below what damage dictates (no separate destruction
  rule matters here — just report final HULL even if it goes to 0 or
  below, though it will not in this log).

### Match log (fixed, 6 turns)

```json
[
  { "turn": 1, "who": "HAMMER", "cards": ["JAB", "JAB", "JAB", "JAB"] },
  { "turn": 2, "who": "PIVOT",  "cards": ["BRACE", "SLAM"] },
  { "turn": 3, "who": "HAMMER", "cards": ["PRIME", "SLAM", "SLAM"] },
  { "turn": 4, "who": "PIVOT",  "cards": ["MEND", "JAB", "MEND"] },
  { "turn": 5, "who": "HAMMER", "cards": ["BRACE", "BRACE", "BRACE"] },
  { "turn": 6, "who": "PIVOT",  "cards": ["PRIME", "PRIME", "JAB"] }
]
```

Adjudicate every turn in order, tracking HULL, PLATE, and power for
both bots exactly per the ruleset above. Some cards in this log will be
skipped for lack of power, some BRACE plays will be wasted at the cap,
and the absorption rule matters more than once — read the ruleset
carefully before you simulate.

## Deliverables

- `final_state.json` — the exact final state after all 6 turns, as
  JSON: `{"HAMMER":{"hull":<int>,"plate":<int>},"PIVOT":{"hull":<int>,"plate":<int>}}`.
- `ADJUDICATION.md` (at most 500 words) — a turn-by-turn trace showing
  the running HULL/PLATE/power state and explicitly calling out every
  skipped card, every wasted BRACE play, and every absorption event
  (which tokens absorbed how much and whether they were consumed).

## Constraints

- `final_state.json` must be valid JSON with exactly the two keys
  `HAMMER` and `PIVOT`, each an object with integer `hull` and `plate`.
- `ADJUDICATION.md` must be at most 500 words (whole file, `wc -w`).
- Do not change or reinterpret the ruleset or the log — adjudicate
  exactly what is written above.

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified your adjudication (hand-trace, script,
or both).
