# Model Benchmark — Design Spec

**Date:** 2026-07-03
**Status:** Approved pending user review
**Location:** `C:\Projects\model-benchmark\` — standalone repo, independent of the Zap Viagens workspace.

## Purpose

A reusable, zero-infrastructure benchmark kit for comparing AI models across
use cases (coding, debugging, writing, planning, data analysis, instruction
following, creative visual, game design, business planning). Any agentic
model runs the tests by following a markdown protocol;
an evaluator model judges the outputs against rubrics; a static HTML report
renders a radar chart and score tables comparing all benchmarked models.

No APIs, no scripts, no build step. The only executable artifact is one
self-contained HTML report page.

## Core principles

1. **Convention over code.** Tests, rubrics, results, and judgments are
   markdown files in a fixed folder layout. Protocols (`RUN.md`, `JUDGE.md`)
   are instructions any capable agent can follow.
2. **Reasoning is mandatory on both sides.** The model under test must write a
   `REASONING.md` per test (approach, key decisions, trade-offs). The judge
   must justify every score in writing, citing evidence from the output.
   Reasoning quality is itself a graded criterion.
3. **Ruler + vibes.** Every rubric has both objective checks (binary,
   verifiable) and subjective criteria (0–10 with written comments). The
   report can show combined, objective-only, or subjective-only views.
4. **Everything optional.** A model can run any subset of tests. The report
   adapts: category scores average only attempted tests, and coverage is
   displayed honestly (e.g. "1/2 tests run").

## Folder layout

```
model-benchmark/
├── README.md                 # overview + quickstart for both roles
├── RUN.md                    # protocol for the model under test
├── JUDGE.md                  # protocol for the evaluator model
├── tests/
│   ├── coding/               # coding-01-<slug>.md, coding-02-<slug>.md
│   ├── debugging/            # debug-01-…, debug-02-…
│   ├── writing/
│   ├── planning-reasoning/
│   ├── data-analysis/        # data-01-…, data-02-…
│   ├── instruction-following/ # precision-01-…, precision-02-…
│   ├── creative-visual/
│   ├── game-design/
│   └── business-planning/
├── rubrics/                  # <test-id>.md — runners must not read these
├── results/                  # dedicated outputs folder
│   └── <run-id>/             # one run = model + reasoning effort + harness
│       ├── meta.json         # { model, effort, harness, date } — required
│       └── <test-id>/
│           ├── (deliverable files: .md, .html, .svg, .js ...)
│           └── REASONING.md  # required
├── report/
│   ├── judgments/
│   │   └── <run-id>/<test-id>.md   # judge's full written reasoning
│   ├── data.js               # numeric scores + short notes (window.BENCH_DATA)
│   └── index.html            # self-contained dark radar-chart report
└── docs/superpowers/specs/   # this spec and future design docs
```

## Test format

One markdown file per test: `tests/<category>/<test-id>.md`, where
`<test-id>` = `<category-slug>-<nn>-<slug>` (e.g. `coding-01-edge-cases`).
Initial set: **2 tests per category** (9 categories, 18 total after the
2026-07-04 expansion adding debugging, data-analysis, and
instruction-following). New tests are just new files.

Section weights are per rubric: most tests use objective 0.5 /
subjective 0.5, but instruction-following tests weigh 0.7 / 0.3 —
precision IS the mechanical part. The report's `TESTS` config carries an
optional per-test `weights` override; the global 0.5/0.5 is the default.

Frontmatter:

```yaml
---
id: coding-01-edge-cases
category: coding
title: Robust function with edge cases
deliverables:
  - solution.md   # or .html, .svg, .js as the test demands
---
```

Body sections:

- **Task** — what to build/write/solve, self-contained, no external resources.
- **Deliverables** — exact file names to produce in the results folder.
- **Constraints** — scope/size limits so runs stay quick and comparable.

Tests never contain scoring criteria — those live in `rubrics/` so the model
under test is not graded on a rubric it just read.

## Rubric format

One file per test: `rubrics/<test-id>.md`. Two sections:

1. **Objective checks** — binary, verifiable items (e.g. "handles empty
   input", "single file, no external dependencies", "word count 150–300").
   Each check: pass = 10, fail = 0.
2. **Subjective criteria** — 3–4 named criteria scored 0–10, each requiring a
   written judge comment. Every rubric includes **Reasoning quality** as a
   subjective criterion, grading the `REASONING.md` (missing file → 0 on that
   criterion).

Frontmatter declares weights:

```yaml
---
test: coding-01-edge-cases
canary: "lattice-fold retry"   # invented phrase unique to this rubric
weights:
  objective: 0.5        # weight of the objective section in the test total
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Handles empty input without error"
    - id: obj-2
      check: "No external dependencies"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-clarity
      name: "Clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---
```

Canary rules: the canary is an invented-but-plausible detail (an example
value, a coined term) woven into one criterion's wording. It appears **only**
in the rubric — never in the test file. Criteria are also phrased
distinctively rather than generically, so a near-verbatim echo in a runner's
output is meaningful evidence of rubric access (see Cheating detection).

Scoring math:

- Objective section score = mean of check scores (each 0 or 10).
- Subjective section score = weighted mean of criteria (weights sum to 1).
- Test total = `objective_weight × objective_score + subjective_weight × subjective_score` (0–10).
- Category score = plain mean of the run's **attempted** tests in that
  category (0–10). Skipped tests don't count; coverage is reported.

## RUN.md protocol (model under test)

The user opens any agent CLI (Claude Code with a chosen model, Codex, Gemini
CLI, ...) in the repo and says: *"Follow RUN.md as `<run-id>`"*, optionally
listing which tests/categories to run (default: all).

A **run** is identified by model + reasoning effort + harness, because the
same model can score differently at different efforts or in different
harnesses. The run-id is a kebab-case slug the user picks (suggested form:
`<model>--<effort>--<harness>`, e.g. `claude-fable-5--high--claude-code`).

The protocol instructs the model to:

1. Use the given `<run-id>` as its results folder slug (kebab-case).
2. Write `results/<run-id>/meta.json` first, from values the user supplies
   (or its own session context):

   ```json
   { "model": "claude-fable-5", "effort": "high",
     "harness": "claude-code", "date": "2026-07-03" }
   ```

   `model` is required; `effort` and `harness` default to `"unspecified"`
   when unknown.
3. For each assigned test, read only `tests/<category>/<test-id>.md`.
4. Create `results/<run-id>/<test-id>/` and write the exact deliverable
   files named by the test.
5. Write `REASONING.md` in the same folder covering: approach chosen, key
   decisions, trade-offs considered, and known limitations. This file is
   graded. It must end with a required `## Files read` section listing every
   repo file the runner consulted for that test (excluding its own outputs).
6. **Never** read `rubrics/`, `report/`, or other runs' `results/` folders.
7. **Never** write outside `results/<run-id>/`.
8. Overwriting its own previous results is allowed (re-runs replace).

## JUDGE.md protocol (evaluator model)

Run in a separate session, ideally with the strongest model available. The
protocol instructs the judge to:

1. Enumerate `results/<run-id>/` folders (or judge only the runs the user
   names), reading each run's `meta.json`.
2. For each run × test: read the deliverables, `REASONING.md`, and the
   test's rubric.
3. Run the integrity check (see Cheating detection) before scoring. A test
   with hard evidence is recorded as `invalidated` and not scored; soft
   evidence adds an integrity note but scoring proceeds normally.
4. Score every objective check (pass/fail with one-line evidence) and every
   subjective criterion (0–10 with a written justification citing concrete
   evidence from the output — no score without a comment).
5. Write the full judgment to `report/judgments/<run-id>/<test-id>.md`:
   per-criterion scores, evidence, comments, and an overall verdict paragraph.
6. Update `report/data.js`: add/replace that run's entry with the run's
   `meta.json` fields (model, effort, harness, date), per-criterion numeric
   scores, a one-line note per test, a condensed per-criterion `comments`
   map, a `reasoning` object faithfully condensing the runner's own
   REASONING.md (approach/decisions/limitations, no judge evaluation —
   the report shows both sides; a `file://` page cannot load the
   markdown files at runtime), and judge metadata (judge model name,
   date — provided by the user or session context). Section scores and totals
   are NOT stored — the report page computes them from raw scores and weights,
   so the math lives in one place.
7. Anti-bias rules: score strictly against the rubric; judge the output, not
   the model's reputation; missing deliverable → test total 0 with a note;
   missing `REASONING.md` → reasoning criterion 0.
8. Re-judging a run replaces its previous entry and judgment files.
9. Missing or unreadable `meta.json` → judge asks the user for the run's
   model/effort/harness before writing the `data.js` entry (never guesses).
10. The judge's final summary lists any invalidated tests so the user can
    decide whether to re-run them; a re-run replaces the invalidated entry.

## Cheating detection

Best-effort, tiered. Reliably catches honest-but-sloppy agents that wander
into forbidden folders; raises the cost of deliberate gaming without claiming
to prevent it. Evidence is either **hard** (near-certain) or **soft**
(judgment call).

Integrity check, run by the judge before scoring:

1. **Write check** (once per run): `git status` / diff. Runner changes
   outside `results/<run-id>/` — especially to `rubrics/` or `report/` —
   → hard. When several uncommitted runs make attribution unclear, the judge
   reports the stray writes to the user instead of invalidating (committing
   between runs keeps this check sharp).
2. **Manifest check** (per test): `rubrics/`, `report/`, or other runs'
   folders listed in `## Files read` → hard (the runner honestly confessed).
3. **Canary check** (per test): the rubric's canary phrase, or near-verbatim
   rubric criterion wording, appears in a deliverable or `REASONING.md`
   → hard.
4. **Alignment heuristics** (per test): output mirrors the rubric's
   structure or criterion order, hits every obscure objective check,
   `REASONING.md` is shaped around criterion names, or the manifest is
   implausibly clean for the work shown → soft.

Outcomes:

- **Hard** → the test is recorded as `integrity: "invalidated"` with no
  scores. The judgment file documents the evidence. Excluded from category
  means (like a skipped test) and surfaced to the user for a discretionary
  retry.
- **Soft** → scored normally, recorded as `integrity: "flagged"` with a
  one-line `integrityNote`.
- Missing `## Files read` section → soft flag ("unverifiable") and counts
  against the Reasoning-quality criterion.

Known limits (documented in the README): a careful cheater who reads the
rubric, paraphrases, and lies in the manifest evades all of the above.
Optional hardening — harness-level read-deny rules for run sessions,
transcript audit by the judge — is mentioned in the README but is not part
of the protocols.

## report/data.js format

A plain JS file (works from `file://`, no fetch):

```js
window.BENCH_DATA = {
  updated: "2026-07-03",
  runs: {
    "deepseek-v4--high--claude-code": {
      model: "deepseek-v4",
      effort: "high",
      harness: "claude-code",
      date: "2026-07-03",
      judgedBy: "claude-fable-5",
      judgedOn: "2026-07-03",
      tests: {
        "coding-01-edge-cases": {
          objective: { "obj-1": 10, "obj-2": 0 },
          subjective: { "sub-quality": 7, "sub-clarity": 8, "sub-reasoning": 6 },
          note: "Solid solution, missed the dependency constraint.",
          comments: { "obj-1": "Verified empty input.", /* one per criterion */ },
          // optional integrity fields; absent = clean
          integrity: "flagged",            // or "invalidated" (then no scores)
          integrityNote: "REASONING.md structured around criterion names."
        }
      }
    }
  }
};
```

Category structure, weights, and labels are embedded in `index.html`'s own
config block (kept in sync with rubrics by the judge when tests change —
acceptable at this scale). The page computes section scores and totals from
the raw criterion scores so the math lives in one place.

## report/index.html

Fully self-contained (inline CSS/JS, no CDN, no server): opens by
double-clicking the file.

- **Dark theme** styled after the inspiration image (near-black background,
  neon model colors, light grid).
- **SVG radar chart**: axes = categories that have at least one score in the
  data; one colored polygon per **run**; legend with per-run toggle, labeled
  `model (effort · harness)`. A run with no data in a category renders a
  gap/zero point with a visual partial marker rather than faking coverage.
- **View toggle**: Combined / Objective only / Subjective only — recomputes
  the radar and tables from raw criterion scores.
- **Harness filter (optional toggle)**: filter the chart/tables to runs from
  a specific harness (or effort); defaults to showing all runs.
- **Score tables**: per category → per test → per criterion, showing
  pass/fail for objective checks, 0–10 for subjective, the one-line note, and
  coverage ("2/2" / "1/2 tests run").
- **Judge notes**: expandable per-test note; full reasoning stays in
  `report/judgments/` (linked by relative path).
- **Integrity rendering**: invalidated tests are excluded from category
  means and the radar (like skipped), shown struck-through in tables with
  the integrity note, and counted in coverage (e.g. "1/2 run, 1
  invalidated"). Flagged tests score normally but show a ⚠ badge with the
  note on hover.
- Defensive rendering: malformed or unknown entries in `data.js` are skipped
  with a console warning, never a broken page.

## Error handling summary

| Failure | Behavior |
| --- | --- |
| Missing deliverable file | Test total 0, judge notes why |
| Missing `REASONING.md` | Reasoning criterion 0, rest scored normally |
| Test skipped by runner | Excluded from category mean; coverage shows it |
| Missing/unreadable `meta.json` | Judge asks the user for model/effort/harness before writing scores |
| Category with no data for any model | Axis omitted from radar |
| Malformed `data.js` entry | Skipped by the page with console warning |
| Canary phrase / rubric wording in output | Hard — test invalidated, evidence in judgment |
| Forbidden path in `## Files read` | Hard — test invalidated |
| Runner wrote outside `results/<run-id>/` | Hard — affected tests invalidated, noted per run |
| Missing `## Files read` section | Soft flag, counts against Reasoning quality |
| Output suspiciously rubric-aligned | Soft flag, scored normally with note |

## Testing the kit

1. **Smoke run:** Claude (this session or a subagent) follows `RUN.md` as a
   sample model on 2–3 tests, then follows `JUDGE.md`, producing real entries
   in `data.js`.
2. **Report check:** open `report/index.html` in the browser and verify the
   radar, toggles (view, run visibility, harness filter), tables, and
   partial-coverage rendering against the sample data plus a hand-written
   second run entry that includes one `flagged` and one `invalidated` test.
3. **Protocol read-through:** confirm `RUN.md`/`JUDGE.md` are self-contained
   for an agent with zero context of this conversation.

## Out of scope (YAGNI)

- API harnesses, automated model invocation, CI.
- Score history/versioning beyond git.
- Blind judging (folder names reveal model identity; anti-bias rules mitigate).
- More than 2 tests per category initially.
