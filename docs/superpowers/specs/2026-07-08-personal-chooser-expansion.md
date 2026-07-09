# Personal chooser expansion (2026-07-08)

Shipped layers for “which model should I use here?” — not competitive
leaderboard growth.

## Phase 0 — Use-case suites + breadth tiers
Breadth: `core`, `extended`, `full` (from `tiers.json`). Day suites in
`RUN.md` and `report/index.html` `SUITES`: coding-day, agent-day,
writing-comms, analyst, product-day, safety-day, ops-day, support-day,
critical-day.

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

## Breadth tiers (Core ⊂ Extended ⊂ Full)

Canonical lists: `tiers.json` / `TIERS.md`. Nested ladder for overall
comparison; day suites stay orthogonal.

| Tier | Size | Role |
|------|------|------|
| **Core** | 34 base | Fast general snapshot |
| **Extended** | 89 base (⊃ Core) | Serious multi-field map |
| **Full** | all forms | Item bank + parallel forms |

Core history: frozen at 31 original categories, then promoted three
axes (`agent-02-minimal-diff`, `safety-03-sycophancy`,
`critical-01-methods-limit`) → 34. Extended adds 55 base forms
(second coding/debug, ops, support, agent depth, product, safety
pairs, analysis depth, …). Parallel forms never join Core/Extended.
Incomplete Core/Extended → provisional in validate + report.
Sync: edit `tiers.json`, then `node tools/sync-tiers-to-report.js`.

## Next: gap closure roster (2026-07-09)

See `2026-07-09-gap-closure-roster.md` for:

- **Wave A** — 12 Extended promotions (calib/judgment/context/research/writing/agent/debug/planning gems already in the bank)
- **Wave B** — 10 new P0 facets (ambiguity, agent repair/archaeology/PR-match/migration, grounding, AI-output review, privacy redaction, commercial copy ×2)
- **Wave C** — optional P1
- Authoring order and “minimum viable closure”
