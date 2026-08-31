# Ruler & Vibes

**Ruler & Vibes** is a zero-infrastructure, personal model-chooser kit, not an
official public leaderboard. You run models yourself, judge their outputs, and
keep or publish your own results.

Every rubric combines objective checks (the ruler) with judged criteria (the
vibes). The bank spans 40 categories and 774 test forms, usually three parallel
forms per facet. The kit uses plain Markdown, JSON, JavaScript, Node built-ins,
and a zero-build static report bundle. It has no package manager, framework,
CDN, API, hosted service, or build step.

**License:** MIT (see `LICENSE`).

## Breadth and workflow suites

The nested breadth ladder is canonical in `tiers.json`:

```text
Core (40)  subset  Extended (124)  subset  Full (774 forms)
 snapshot              serious map             item bank + parallels
```

**Core is the execution and report default.** Full must always be named
explicitly. Parallel forms never enter Core or Extended. Day suites are
workflow views rather than breadth tiers; arbitrary explicit test/category
subsets use `ad-hoc`. Category labels, the eight-domain taxonomy, day suites,
and `defaultSuite` are canonical in `benchmark.json`.

## How it works

1. **Run.** In a fresh model session, say: `Follow RUN.md as <run-id>`.
   Omitted suite resolves to Core. The runner writes only to
   `results/<run-id>/` and records the resolved suite in `meta.json`.
2. **Judge.** In a separate evaluator session, say: `Follow JUDGE.md`.
   The judge writes evidence and raw criterion scores to `report/data.js`.
3. **Review when useful.** A second judge follows `REVIEW.md`. Agreement is
   corroborating evidence; a material disagreement is resolved by a fresh
   adjudicator following `ADJUDICATE.md`.
4. **View.** Open `report/index.html`. The report leads with a run comparison,
   eight-domain dots, and a numeric category heatmap, followed by criterion
   evidence and a bounded workflow profile.

## Scoring

- Objective section: mean of valid binary criterion scores (10 pass, 0 fail).
- Subjective ability: weighted mean of subjective criteria other than
  `sub-reasoning`; remaining weights are renormalized.
- Worklog quality: the raw `sub-reasoning` score, reported separately and never
  included in ability.
- Test ability: the rubric's objective/subjective section weights applied to
  objective and non-reasoning subjective ability.
- Facet: median of scored parallel forms.
- Category: equal mean of attempted facet scores.
- Domain: equal mean of represented category scores.
- Suite: equal mean of represented category scores. Domains explain the map;
  they are not another weighting layer.

There is no weighted-performance mode. Coverage, parallel depth, integrity,
and judgment status are separate evidence. The report shows exact expected and
scored counts, observed ranges when possible, and status rather than sampling
confidence intervals.

A Core, Extended, or day-suite result is officially complete only when every
required test is scored and non-invalidated. Full requires every form. Ad-hoc
runs receive scores but never an official-complete label. A complete run with
only its primary judgment remains valid; review is optional.

## Review and adjudication

Reviewer scores never replace or average with primary scores. `agree` means the
primary score is within a reasonable one-point calibration band. `disagree`
requires specific evidence and a proposed score at least two points away.

Effective score precedence is adjudication, then primary. Unresolved
non-reasoning disputes make ability provisional; a reasoning-only dispute makes
only Worklog quality provisional. Every review preserves an independent
reviewer score for reliability analysis. The report preserves primary, reviewer,
adjudicator, and effective values. Metajudging diagnoses patterns but never
changes a score.

## Data and layout

`report/data.js` uses `window.BENCH_DATA` schema version 2. It persists only raw
scores, comments, reasoning summaries, integrity fields, reviews,
adjudications, and run metadata. Totals, statuses, coverage, domains, and
aggregates are always derived.

```text
benchmark.json                   labels, domains, day suites, default suite
tiers.json / TIERS.md            Core subset Extended subset Full ladder
tests/<category>/<test-id>.md    runner-visible tasks
rubrics/<test-id>.md             evaluator-only scoring criteria
results/<run-id>/                runner outputs and required meta.json
report/data.js                   schema-v2 raw evidence
report/config.js                 generated benchmark configuration
report/tests.js                  generated rubric/test metadata
report/scoring.js                shared pure scoring implementation
report/app.js / styles.css       static report rendering and presentation
report/index.html                report markup and script loading
report/judgments/<run-id>/       primary written judgments
report/reviews/<run-id>/         optional second-pass evidence
report/adjudications/<run-id>/   disputed-criterion resolutions
```

## Integrity

Hard evidence such as a leaked rubric canary, forbidden files in the runner's
manifest, or writes outside the run folder invalidates the affected test. Soft
evidence flags a result but does not silently alter its score. Runners must save
the harness transcript when available, or an explicit unavailable stub when it
is not; this is required audit evidence, not an optional extra.

## Project skills

Skills under `.agents/skills/` cover running, judging, reviewing through the
protocol, adjudicating disputes, and minting parallel forms. Runner sessions
must never read evaluator protocols, rubrics, reports, or design docs.

## Health and calibration

Run from the repository root:

```text
node tools/sync-config.js         # regenerate RUN.md suite block + report/config.js
node --test                       # dependency-free test suite
node tools/validate.js            # structure, config, schema, coverage, reviews
node tools/canary-audit.js        # canary uniqueness and leak invariant
node tools/calibrate.js           # read-only empirical diagnostics
node tools/browser-qa.js          # responsive/static browser matrix + screenshots
```

`node tools/sync-tiers-to-report.js` remains a compatibility wrapper around
`sync-config.js`. Calibration defaults to all valid data, writes nothing, and
reports insufficient evidence until at least five comparable runs exist. It
only recommends `keep`, `review`, or `harden`; it never edits tests, rubrics,
tiers, or canaries.

## Contributing and adding tests

See `CONTRIBUTING.md` and `AUTHOR.md`. For a new base test:

1. Add `tests/<category>/<test-id>.md` and `rubrics/<test-id>.md` with a unique
   canary registered in the canary registry.
2. Run `node tools/gen-tests.js`; never hand-edit generated report metadata.
3. If configuration changed, edit `benchmark.json` or `tiers.json` as
   appropriate and run `node tools/sync-config.js`.
4. Run the full health checks above.

Map design notes: `docs/superpowers/specs/2026-07-09-gap-closure-roster.md`.
