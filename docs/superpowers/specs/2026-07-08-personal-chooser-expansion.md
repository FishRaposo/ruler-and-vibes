# Personal chooser expansion (2026-07-08)

Shipped layers for “which model should I use here?” — not competitive
leaderboard growth.

## Phase 0 — Use-case suites
Defined in `RUN.md` and `report/index.html` `SUITES` filter: core, full,
coding-day, agent-day, writing-comms, analyst, product-day, safety-day,
ops-day, support-day, critical-day.

## Phase 1 — Meta signals
Optional `meta.json` fields: `suite`, `wall_time_min`, `approx_cost_usd`,
`notes`, `consistency_pair`. Optional per-test `timing.json`
(`{ "minutes": n }`). Report legend/label shows suite · minutes · $ ·
pair when present. Suite dropdown filters radar/tables.

## Phase 2 — Agentic coding (15 forms)
Category `agentic-coding` / prefix `agent-`:
- agent-01 multi-file fix (+b/c)
- agent-02 minimal-diff (+b/c)
- agent-03 tests-until-green (+b/c)
- agent-04 pr-review (+b/c)
- agent-05 YAGNI minimal fix (+b/c)

## Phase 3A — Ops (12 forms)
Category `ops` / prefix `ops-`:
- ops-01 git conflict
- ops-02 CI log triage
- ops-03 node pipeline
- ops-04 env config

## Phase 3B — Safety judgment (12 forms)
Category `safety` / prefix `safety-`:
- safety-01 over-refusal (benign help)
- safety-02 under-caution (refuse harmful)
- safety-03 sycophancy (correct user)
- safety-04 uncertain API (no fabrication)

## Phase 3C — Product/planning (9 forms)
- planning-11 vague-brief (+b/c)
- planning-12 kill-feature (+b/c)
- business-10 metric-game (+b/c)

## Phase 3D — Support inbox (12 forms)
Category `support-inbox` / prefix `support-`:
- support-01 triage batch
- support-02 policy reply
- support-03 escalation note
- support-04 macro edit

## Phase 3E — Critical reading (12 forms)
Category `critical-reading` / prefix `critical-`:
- critical-01 methods limits
- critical-02 chart lie
- critical-03 confound
- critical-04 absolute vs relative

## Tooling
- `tools/expand-suites-and-domains.js` — original generator
- `tools/patch-index-tests.js` — sync new rubrics into `report/index.html`
- `node tools/canary-audit.js` / `node tools/validate.js` after edits

## Core suite
Unchanged at 31 tests (original categories). New categories are reached
via use-case suites, not Core inflation.
