---
id: logic-03c-bead-tin
category: math-logic
title: Bead Tin Threading Game
deliverables:
  - ANSWERS.md
---

## Task

A tin holds 8 distinct physical glass beads: 4 coral beads (each worth
+6 points), 3 jet beads (each worth -5 points), and 1 prism bead. The
prism bead is worth 0 points itself, but it **doubles the combined
value of the other bead(s) threaded with it** (for example, threading
one coral bead and the prism bead scores 6 x 2 = 12).

**Threading A**: thread 2 beads from the tin without replacement (both
beads threaded are distinct physical beads, order doesn't matter).

- **Q1**: What is the exact expected score of Threading A, as a reduced
  fraction?
- **Q2**: What is P(score >= 12) and what is P(score < 0), each as a
  reduced fraction?

**Threading B**: identical scoring rules, but done **with
replacement**: thread one bead, note it, return it to the tin, then
thread again (the same physical bead can be threaded both times). If
the prism bead is threaded on both draws, the score is 0.

- **Q3**: What is the exact expected score of Threading B, as a reduced
  fraction?
- **Q4**: Which threading has the higher expected score, and by exactly
  how much (as a reduced fraction)?

Decimal-only answers do not count as answering Q1, Q3, or Q4 — exact
reduced fractions are required (decimals may appear alongside them,
but the fraction must be present).

## Deliverables

- `ANSWERS.md` — must contain:
  - A full case-enumeration table for Threading A covering the five
    unordered pair types (coral-coral, coral-jet, coral-prism, jet-jet,
    jet-prism), each with its count out of the total and its score.
  - A full case-enumeration table for Threading B covering the same
    five types plus the prism-prism outcome, each with its count out of
    the total and its score.
  - Answers to Q1-Q4, each on its own line labeled `Q1:`, `Q2:`, `Q3:`,
    `Q4:`, with the exact reduced fraction(s) required.

## Constraints

- At most 500 words (whole file, `wc -w`).
- All four answers must be exact fractions, not decimal approximations.
