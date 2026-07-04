---
id: logic-04-ninefold-league
category: math-logic
title: The Ninefold League
deliverables:
  - PROOF.md
---

## Task

A fictional sporting league has exactly 9 clubs, numbered 1 through 9.
Any two clubs may play each other at most once in a season (so a
"match" is an unordered pair of distinct clubs, and no pair plays
twice).

Answer all four parts below.

- **Part A**: What is the maximum possible number of matches in a
  season? Show the count.
- **Part B**: Prove in prose that it is **impossible** for every one of
  the 9 clubs to play exactly 5 matches in a season.
- **Part C**: Exhibit an explicit schedule (a specific list of matches)
  in which every club plays **exactly 4 matches**. Format the schedule
  as one match per line, in the exact form `i-j` where `i` and `j` are
  club numbers from 1 to 9 and `i < j` (e.g. `1-2`). List only match
  lines in this section — no other text on those lines.
- **Part D**: Prove that in any season where every club plays at least
  one match, **two clubs must play the same number of matches**.

## Deliverables

- `PROOF.md` (at most 600 words) — containing all four parts, clearly
  labeled `## Part A`, `## Part B`, `## Part C`, `## Part D`, with Part
  C's match list in the exact `i-j` one-per-line format specified
  above.

## Constraints

- At most 600 words (whole file, `wc -w`).
- Part C requires an actual exhibited schedule, not just an assertion
  that one exists. Any valid schedule where every club plays exactly 4
  matches is accepted — it does not need to match any particular
  construction.
- Parts B and D must be prose proofs, not just assertions of the
  conclusion.
