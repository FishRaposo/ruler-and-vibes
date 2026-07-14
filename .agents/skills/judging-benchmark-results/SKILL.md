---
name: judging-benchmark-results
description: Use when asked to judge, evaluate, score, grade, or re-judge runs under results/ in the Ruler & Vibes benchmark (this repo).
---

# Judging Benchmark Results

You are the **evaluator**. Open **`JUDGE.md` first** and follow it
exactly — integrity before scoring, written evidence for every score,
judgment files + `report/data.js` update. This skill adds discipline
the protocol cannot enforce by itself.

## Role boundary

- You **may** read: `JUDGE.md`, `tests/`, `rubrics/`, `results/` (runs
  under judgment), `report/` (to update data.js and write judgments),
  `docs/` if needed for registry/canary context, this skill.
- You are **not** the model under test. Do not "improve" their
  deliverables. Score what they wrote.
- If asked for a **second-pass subjective review** only, that is
  `REVIEW.md` — different protocol; do not re-score objectives from
  scratch unless the user wants a full re-judge.
- If asked to resolve an existing material disagreement, follow
  `ADJUDICATE.md` and the `adjudicating-benchmark-results` skill instead.

## Score blind, then compare

On re-judge / audit: do **not** open `report/judgments/` or that run's
`report/data.js` entry until you have scored every assigned test
yourself. Order per test: test file → deliverables → `REASONING.md` →
rubric → integrity → score → only then any prior judgment.

## Verify, don't vibe

Objective checks are **executed**, not eyeballed:

- Run JS with `node`; open HTML/SVG; `wc -w` for word caps; recompute
  arithmetic; parse JSON when required.
- Canary: exact rubric `canary` phrase (or distinctive coined leak) in
  deliverables/`REASONING.md` → HARD invalidation.
- Manifest / writes outside `results/<run-id>/` / forbidden paths →
  HARD or SOFT per JUDGE.md.
- If you did not run the command, you did not check it.

## Meta and suites

- Missing/unreadable `meta.json` model/suite/effort/harness: **ask the user**;
  never guess before writing scores.
- Copy optional `suite`, `wall_time_min`, `approx_cost_usd`, `notes`,
  `consistency_pair` into `report/data.js` when present.
- Incomplete **Core** or **Extended** coverage is not your bug to invent
  scores for — judge what exists; note provisional coverage in the
  finish summary (`k/34` Core, `k/123` Extended if relevant).

## Finish the paperwork

A judgment is not done until:

1. `report/judgments/<run-id>/<test-id>.md` exists per scored test
2. `report/data.js` remains schema version 2 and is updated with raw
   criterion scores only (no computed
   totals), one-line `note`, per-criterion `comments`, faithful
   `reasoning` condensation of the **runner's** REASONING.md (not your
   evaluation), integrity fields, top-level `updated` date. Raw
   `sub-reasoning` is reported as Worklog quality, separate from ability.
3. `node tools/validate.js` run; fix any issues you introduced
4. Final summary lists soft flags and every **INVALIDATED** test so the
   user can re-run

Second-pass reviews follow `REVIEW.md` and always preserve the reviewer's
independent 0–10 score for every verdict. Reviewer values are reliability
evidence; they do not replace or average the primary score.

Comment quality: every subjective comment names a **concrete,
test-specific** detail. No boilerplate. No identical comments across
tests. See JUDGE.md anti-bias and comment rules.

## Red flags — stop

- "The old judgment looks right — I'll copy it" → score independently first.  
- "Obviously fine" → still run objective checks.  
- Flat subjective scores (all 7–9) → recalibrate; differentiate.  
- A stronger model is available for judging → say so; prefer it.  
- Temptation to edit the runner's files to "make them pass" → never.
