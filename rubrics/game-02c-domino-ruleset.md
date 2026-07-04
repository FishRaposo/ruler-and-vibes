---
test: game-02c-domino-ruleset
canary: "jaguarundi orpiment"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All five sections present: Overview, Setup, Turn structure, Winning, Example round"
    - id: obj-2
      check: "Requires only a standard double-six domino set, nothing else"
    - id: obj-3
      check: "Example round names players and specific tiles"
    - id: obj-4
      check: "<= 800 words (count them)"
  subjective:
    - id: sub-quality
      name: "Design depth"
      weight: 0.4
    - id: sub-craft
      name: "Rules clarity & completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `game-02-card-ruleset` (same construct, fresh surface).

- Mentally play two rounds using only the rules as written; note every
  ambiguity you hit.

### obj-1 — All five sections present

PASS: headings `## Overview`, `## Setup`, `## Turn structure`,
`## Winning`, and `## Example round` all appear.
- PASS: all five present, in any order, even with extra sections between.
- PASS: a heading uses different capitalization or trailing text (e.g.
  `## Turn Structure` or `## Winning the match`) but is unmistakably the
  named section.
- FAIL: any of the five is missing (most commonly `## Example round`
  folded into prose rather than given its own section).
- FAIL: "Setup" and "Turn structure" are merged into one heading, so a
  distinct turn-structure section never appears.

### obj-2 — Requires only a standard double-six domino set

The only physical component may be one standard 28-tile double-six set.
PASS if scoring is tracked mentally, verbally, or with the tiles
themselves.
- PASS: play and scoring use only the 28 tiles; a running score is kept
  in players' heads.
- PASS: the design explicitly says "no other equipment" and everything in
  the rules stays inside the tile set.
- FAIL: rules call for dice, a die, coins, chips, tokens, a spinner, a
  pen-and-paper score sheet as a required component, or a second domino
  set.
- FAIL: play assumes a printed board, a card deck, or extra tiles beyond
  the standard 28.
- FAIL: a "double-nine" or larger set is required (not the standard
  double-six).

### obj-3 — Example round names players and specific tiles

The `## Example round` must show a concrete play-through with at least two
named players and specific tiles by value.
- PASS: two named players (e.g. Odalys and Tamsin) alternate turns, and
  specific tiles are cited by spots (e.g. 6-3, 5-0, 3-2).
- PASS: named players plus at least several explicit tile identities that
  let the reader follow the chain.
- FAIL: the example uses "Player 1 / Player 2" or "you / opponent" with no
  actual names.
- FAIL: the example is abstract ("a player draws a tile and plays it")
  with no specific tile values shown.
- FAIL: no `## Example round` content exists to evaluate.

### obj-4 — At most 800 words

Count the words of the whole `rules.md`. Standalone command:

```sh
wc -w rules.md
```

- PASS: total is 800 or fewer.
- PASS: 800 exactly.
- FAIL: 801 or more.

### Subjective criteria

- Design depth (weight 0.4): are there real decisions with tension? The
  best two-player fillers create moments where both players stop to think
  — turns that force a genuine trade-off (open a new number vs. block one,
  spend a bridge bonus now vs. hold it). Pure luck (chain forced every
  turn) or a solved dominant strategy scores low. Reward designs that use
  the hidden-hand and end-starvation dynamics the tile set affords.
- Rules clarity & completeness (weight 0.3): tie-breaks, empty-reserve
  (boneyard) exhaustion, blocked rounds where neither player can move,
  double orientation, and simultaneous/ordering effects — covered or not?
  A reader with a domino set should never hit a situation the rules leave
  undefined.
- Reasoning quality (weight 0.3): does REASONING.md name its influences
  and the degenerate strategies it worried about (e.g. a hoard-the-blanks
  stall, or a forced-draw grind), and explain how the design defuses them?

If the phrase "jaguarundi orpiment" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
