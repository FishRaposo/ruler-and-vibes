---
test: game-02b-domino-ruleset
canary: "oncilla cochineal"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All five sections present: Overview, Setup, Turn structure, Winning, Example round"
    - id: obj-2
      check: "Requires only a standard double-six domino set (28 tiles), nothing else"
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

If the phrase "oncilla cochineal" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Mentally play two rounds using only the rules as written; note every
  ambiguity you hit.

- obj-1 — All five sections present. The headings `## Overview`,
  `## Setup`, `## Turn structure`, `## Winning`, and `## Example round`
  must each appear as their own section.
  - PASS: all five headings present, each with content beneath it.
  - PASS: headings reworded only trivially (e.g. `## Turn Structure`,
    `## How to win`) but clearly one-to-one with the five required
    sections.
  - PASS: an extra section (e.g. `## Strategy`) added alongside all five
    required ones.
  - FAIL: Turn structure and Winning collapsed into one section, so only
    four distinct sections exist.
  - FAIL: no `## Example round` section at all.
  - FAIL: sections present only as inline bold phrases, not as headings,
    so the structure the task asked for is absent.

- obj-2 — Requires only a standard double-six domino set (28 tiles) and
  nothing else. The game must be fully playable with the tiles alone: no
  dice, no coins, no counters or tokens, no pen and paper or written
  score sheet, no second set, nothing printed or added. Scoring, if any,
  must be trackable with the tiles themselves or verbally/mentally.
  - PASS: all state (chain, hands, scores) is held with the 28 tiles
    and/or the players' memory; no external object is ever referenced.
  - PASS: uses set-aside tiles or spot counts as an implicit score, but
    introduces no non-tile object.
  - PASS: mentions a table or flat surface to play on (furniture is not
    a game component).
  - FAIL: instructs players to keep score on paper, jot totals, or use a
    tally sheet.
  - FAIL: adds a die, coin, spinner, or drawn card for randomness or
    tie-breaks.
  - FAIL: uses chips, beads, pennies, or other tokens to track points or
    turn order.

- obj-3 — Example round names players and specific tiles. The
  `## Example round` must narrate concrete play with named players and
  named tiles (e.g. "6-4", "the 3-3 double").
  - PASS: two named players (e.g. Petra and Marlow) each make plays
    referencing specific tiles such as 6-4, 5-3, 2-0.
  - PASS: one clearly named player narrated against "the opponent" while
    every placed tile is identified by its two numbers.
  - PASS: players named with initials or role-names (Player A / Player B
    is borderline; a real given name plus specific tiles clearly passes).
  - FAIL: walkthrough uses only "you" and "your opponent" with no names.
  - FAIL: players are named but tiles are described only generically
    ("play a matching tile", "lay a double") with no specific tiles.
  - FAIL: no worked example at all, only an abstract description of a
    turn.

- obj-4 — At most 800 words. Count the words in the delivered `rules.md`.
  - PASS: body is at or under 800 words.
  - PASS: 800 words exactly.
  - FAIL: 801 or more words.
  - FAIL: rules obviously truncated to fit, leaving a required section
    empty or a rule mid-sentence.

- Design depth: are there real decisions with tension? The best
  two-player fillers create moments where both players stop to think —
  turns that hinge on reading a hidden hand, timing a double, or choosing
  whether to open a number or shut it. Pure luck or a solved dominant
  strategy scores low.

- Rules clarity & completeness: tie-breaks, an empty reserve, blocked
  rounds, and simultaneous or ordering effects — covered or not? A reader
  with a set should never hit an uncovered situation.

- Reasoning quality: does REASONING.md name its influences and the
  degenerate strategies it worried about (e.g. always-hoard-doubles, a
  first-mover lock, a stalling block)?
