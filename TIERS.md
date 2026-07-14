# Breadth tiers: Core subset Extended subset Full

Ruler & Vibes uses a nested breadth ladder for general model comparison.
`tiers.json` is the canonical machine-readable ladder. `benchmark.json` is the
canonical source for the default suite, labels, domains, and day suites.

Core is the default whenever a suite is omitted. Full must be explicitly named.

| Tier | Purpose | Contents | Complete when |
|---|---|---|---|
| Core | Fast overall snapshot | 40 curated base forms | Every required test is scored and non-invalidated |
| Extended | Deeper general map | 124 base forms including all Core | Every required test is scored and non-invalidated |
| Full | Reliability and research | Every test form, including parallels | Every form is scored and non-invalidated |

Parallel forms never enter Core or Extended. Full is not the default for
personal model selection.

## Day suites and ad-hoc runs

Day suites answer which model fits one workflow. They may overlap the breadth
tiers. A day-suite result is complete only when every required test is scored
and non-invalidated. Explicit test/category subsets use `ad-hoc`; they receive
scores and coverage but no official-complete status.

## Reporting policy

Performance is an equal mean of represented category scores. Domains are an
explanatory grouping and do not add a weighting layer. Coverage, parallel-form
depth, integrity, and judgment status remain separate from performance.
Incomplete required coverage is provisional. Optional review is not required
for a complete primary-judged run.

## Editing configuration

1. Edit `tiers.json` for Core/Extended membership.
2. Edit `benchmark.json` for labels, domains, day suites, or `defaultSuite`.
3. Run `node tools/sync-config.js` to regenerate `report/config.js` and the
   marked suite section in `RUN.md`.
4. Run `node --test`, `node tools/validate.js`, and
   `node tools/canary-audit.js`.

`node tools/sync-tiers-to-report.js` is retained as a compatibility wrapper.

Current shipped counts are Core 40, Extended 124, and Full 759 forms. See
`docs/superpowers/specs/2026-07-09-gap-closure-roster.md` for the prior gap
closure roster.
