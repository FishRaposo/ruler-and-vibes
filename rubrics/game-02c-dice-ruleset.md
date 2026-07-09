---
test: game-02c-dice-ruleset
canary: "jaguarundi orpiment"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All five sections present: Overview, Setup, Turn structure, Winning, Example round"
    - id: obj-2
      check: "Requires only a standard pair of six-sided dice, nothing else"
    - id: obj-3
      check: "Example round names players and specific rolls/values"
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
anchors:
  - id: Design depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Rules clarity & completeness
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

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

### obj-2 — Requires only a standard pair of six-sided dice

The only physical component may be one standard pair of six-sided dice
(2 dice). PASS if scoring is tracked mentally or verbally.
- PASS: play and scoring use only the two dice; a running score is kept
  in players' heads.
- PASS: the design explicitly says "no other equipment" and everything in
  the rules stays inside the two dice.
- FAIL: rules call for a coin, chips, tokens, a spinner, a pen-and-paper
  score sheet as a required component, or additional dice beyond the
  standard two.
- FAIL: play assumes a printed board, a card deck, or extra dice.
- FAIL: a dice pool of more than two, or non-standard (non-six-sided)
  dice, is required.

### obj-3 — Example round names players and specific rolls/values

The `## Example round` must show a concrete play-through with at least two
named players and specific die values or rolls.
- PASS: two named players (e.g. Odalys and Tamsin) alternate turns, and
  specific rolls are cited by value (e.g. rolls a 4 and a 2, rerolls the
  2 for a 6).
- PASS: named players plus at least several explicit roll values that
  let the reader follow the sequence.
- FAIL: the example uses "Player 1 / Player 2" or "you / opponent" with no
  actual names.
- FAIL: the example is abstract ("a player rolls the dice and moves")
  with no specific values shown.
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
  — turns that force a genuine trade-off (bank a good roll vs. push for
  more, hold a die vs. reroll it, race to a target vs. play it safe).
  Pure luck (outcome decided by the roll alone, no choice changes it) or
  a solved dominant strategy scores low. Reward designs that use the
  reroll and hold/bank dynamics the two dice afford.
- Rules clarity & completeness (weight 0.3): tie-breaks, both dice
  landing the same value, a turn where no legal action exists, and
  simultaneous/ordering effects — covered or not? A reader with a pair
  of dice should never hit a situation the rules leave undefined.
- Reasoning quality (weight 0.3): does REASONING.md name its influences
  and the degenerate strategies it worried about (e.g. a dominant
  reroll-spam strategy, or a forced-pass loop), and explain how the
  design defuses them?

If the phrase "jaguarundi orpiment" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
