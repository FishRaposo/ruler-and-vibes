---
id: game-05b-spellbind-standoff
category: game-design
title: Adjudicate a spell-duel turn log as the rules engine
deliverables:
  - final_state.json
  - ADJUDICATION.md
---

## Task

You are not designing a game this time — you ARE the rules engine.
Below is the complete ruleset for a fictional two-player spell duel,
**Spellbind Standoff**, plus a fixed 6-turn match log. Adjudicate the
log by hand (or with a script you write yourself) and report the exact
final game state.

### Ruleset

- Both conjurers, **EAST** and **WEST**, start at **28 VITALITY** and
  **0 WARD** tokens.
- **Vigor** resets to exactly **3** at the start of each of that
  conjurer's own turns. Vigor never carries over between turns (a
  conjurer's unspent vigor from their last turn is gone).
- On a turn, the active conjurer casts spells from their hand in the
  listed order, paying vigor left to right. **If the conjurer lacks
  enough vigor for a spell, that spell is silently skipped: no cost is
  paid and no effect occurs.** Play continues with the next spell in
  the list.
- Five spells exist, each with a fixed vigor cost and effect:
  - **JOLT** — cost 1. Deal 5 damage to the opponent.
  - **SMITE** — cost 2. Deal 8 damage to the opponent, but first
    consume one of the **caster's own** WARD tokens if the caster has
    any (this consumption has no effect on SMITE's damage — it is a
    separate cost paid from the caster's own ward pool, not the
    target's).
  - **WARD** — cost 1. Gain one WARD token, capped at 2. If the caster
    is already at the cap, the spell still costs its vigor but the
    token is wasted (no token is gained, and no other effect occurs).
  - **SIPHON** — cost 2. Deal 4 damage to the opponent and heal the
    caster 5 VITALITY, capped at 28 VITALITY.
  - **HONE** — cost 1. The caster's **next** damaging spell cast this
    turn (JOLT, SMITE, or SIPHON) deals +3 damage. This bonus does not
    stack (a second HONE cast in the same turn while one is already
    active is wasted — costs vigor, no effect) and does not carry over
    to the caster's next turn.
- **WARD tokens belong to their owner and absorb incoming damage**:
  each point of incoming damage aimed at a conjurer is first absorbed
  by that conjurer's own WARD tokens, one at a time, each token
  absorbing up to 6 damage. **A WARD token is consumed as soon as it
  is used to absorb any damage, even if it absorbed fewer than 6** — a
  token that only had 1 damage left to soak still disappears entirely;
  it does not persist with "5 damage capacity remaining." Any damage
  beyond what all of the defender's tokens can absorb goes through to
  VITALITY.
- The **HONE bonus is added to a spell's raw damage BEFORE** absorption
  is applied (i.e. absorption sees the boosted number, not the base
  number).
- VITALITY cannot go below what damage dictates (no separate defeat
  rule matters here — just report final VITALITY even if it goes to 0
  or below, though it will not in this log).

### Match log (fixed, 6 turns)

```json
[
  { "turn": 1, "who": "EAST", "cards": ["JOLT", "JOLT", "JOLT"] },
  { "turn": 2, "who": "WEST", "cards": ["WARD", "SMITE"] },
  { "turn": 3, "who": "EAST", "cards": ["HONE", "SMITE", "JOLT"] },
  { "turn": 4, "who": "WEST", "cards": ["SIPHON", "SIPHON"] },
  { "turn": 5, "who": "EAST", "cards": ["WARD", "WARD", "WARD"] },
  { "turn": 6, "who": "WEST", "cards": ["HONE", "HONE", "JOLT"] }
]
```

Adjudicate every turn in order, tracking VITALITY, WARD, and vigor for
both conjurers exactly per the ruleset above. Some spells in this log
will be skipped for lack of vigor, some WARD casts will be wasted at
the cap, and the absorption rule matters more than once — read the
ruleset carefully before you simulate.

## Deliverables

- `final_state.json` — the exact final state after all 6 turns, as
  JSON: `{"EAST":{"hp":<int>,"guard":<int>},"WEST":{"hp":<int>,"guard":<int>}}`.
- `ADJUDICATION.md` (at most 500 words) — a turn-by-turn trace showing
  the running VITALITY/WARD/vigor state and explicitly calling out
  every skipped spell, every wasted WARD cast, and every absorption
  event (which tokens absorbed how much and whether they were
  consumed).

## Constraints

- `final_state.json` must be valid JSON with exactly the two keys
  `EAST` and `WEST`, each an object with integer `hp` and `guard`.
- `ADJUDICATION.md` must be at most 500 words (whole file, `wc -w`).
- Do not change or reinterpret the ruleset or the log — adjudicate
  exactly what is written above.

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified your adjudication (hand-trace, script,
or both).
