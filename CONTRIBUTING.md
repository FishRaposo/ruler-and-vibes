# Contributing

Ruler & Vibes is a **personal model-chooser kit**, not an official public
leaderboard. Contributions that keep the kit easy to run and honest to
score are welcome.

## Roles (do not mix in one session)

| Role | Protocol | Skill |
|------|----------|--------|
| Model under test | `RUN.md` | `running-the-benchmark` |
| Judge | `JUDGE.md` | `judging-benchmark-results` |
| Parallel form author | `AUTHOR.md` | `generating-parallel-tests` |
| Second-pass review | `REVIEW.md` | — |

Runners must never read `rubrics/`, `report/`, `docs/`, or `JUDGE.md`.

## Before you open a PR

From the repo root:

```
node tools/validate.js
node tools/canary-audit.js
```

Both should pass with no issues.

## Adding or changing tests

1. Follow **Adding a test** in `README.md` (test + rubric + report `TESTS`
   entry + canary registry).
2. New general-map depth usually goes to **Extended** first (`tiers.json`),
   not Core. Core stays small and stable.
3. Parallel forms (b/c) are **Full-only** — never add them to Core or
   Extended. See `AUTHOR.md` for the equivalence contract and review gate.
4. After editing `tiers.json`, run `node tools/sync-tiers-to-report.js`.

## Results

Do not commit personal `results/` or judgment dumps unless the maintainers
explicitly want a sample run. Keep `report/data.js` empty (`runs: {}`) for
upstream unless documenting an official sample.

## Scope

Out of scope: harness-specific permission deny rules, live web evals, and
turning this kit into a competitive leaderboard product.
