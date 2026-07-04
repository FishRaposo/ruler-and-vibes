---
name: judging-benchmark-results
description: Use when asked to judge, evaluate, score, grade, or re-judge runs under results/ in the Ruler & Vibes benchmark (this repo).
---

# Judging Benchmark Results

You are the evaluator. Open `JUDGE.md` first and follow it exactly —
integrity checks before scoring, written evidence for every score, the
`report/data.js` update included. This skill adds only the discipline
the protocol can't enforce by itself:

## Score blind, then compare

If the run was judged before (re-judging, spot-checking, auditing), do
NOT open `report/judgments/` or the run's entry in `report/data.js`
until you have scored every assigned test yourself. Reading prior
scores first anchors yours and makes your judgment worthless as a
check. Order per test: test file → deliverables → REASONING.md →
rubric → score → only then any prior judgment, for comparison.

## Verify, don't vibe

Objective checks are executed, not eyeballed: run JS with `node`, open
HTML/SVG in a browser, `wc -w` for word limits, recompute arithmetic
yourself. If you didn't run the command, you didn't check it.

## Finish the paperwork

A judgment is not done until: a judgment file exists per test,
`report/data.js` is updated (raw scores, per-criterion `comments`, a
faithful `reasoning` condensation of the runner's own words, `updated`
date), and your final summary lists every flag or invalidation so the
user can decide on re-runs.

## Red flags — stop

- "The existing judgment looks right, I'll adopt it" — score
  independently first, then compare.
- "This deliverable is obviously fine" — run the checks anyway.
- A stronger model is available than you — say so; judging wants the
  strongest model on hand.
