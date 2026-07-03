# Model Benchmark — Design Spec

**Date:** 2026-07-03
**Status:** Approved pending user review
**Location:** `C:\Projects\model-benchmark\` — standalone repo, independent of the Zap Viagens workspace.

## Purpose

A reusable, zero-infrastructure benchmark kit for comparing AI models across
use cases (coding, writing, planning, creative visual, game design, business
planning). Any agentic model runs the tests by following a markdown protocol;
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
│   ├── writing/
│   ├── planning-reasoning/
│   ├── creative-visual/
│   ├── game-design/
│   └── business-planning/
├── rubrics/                  # <test-id>.md — runners must not read these
├── results/                  # dedicated outputs folder
│   └── <model-name>/
│       └── <test-id>/
│           ├── (deliverable files: .md, .html, .svg, .js ...)
│           └── REASONING.md  # required
├── report/
│   ├── judgments/
│   │   └── <model-name>/<test-id>.md   # judge's full written reasoning
│   ├── data.js               # numeric scores + short notes (window.BENCH_DATA)
│   └── index.html            # self-contained dark radar-chart report
└── docs/superpowers/specs/   # this spec and future design docs
```

## Test format

One markdown file per test: `tests/<category>/<test-id>.md`, where
`<test-id>` = `<category-slug>-<nn>-<slug>` (e.g. `coding-01-edge-cases`).
Initial set: **2 tests per category, 12 total.** New tests are just new files.

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

Scoring math:

- Objective section score = mean of check scores (each 0 or 10).
- Subjective section score = weighted mean of criteria (weights sum to 1).
- Test total = `objective_weight × objective_score + subjective_weight × subjective_score` (0–10).
- Category score = plain mean of the model's **attempted** tests in that
  category (0–10). Skipped tests don't count; coverage is reported.

## RUN.md protocol (model under test)

The user opens any agent CLI (Claude Code with a chosen model, Codex, Gemini
CLI, ...) in the repo and says: *"Follow RUN.md as `<model-name>`"*, optionally
listing which tests/categories to run (default: all).

The protocol instructs the model to:

1. Use the given `<model-name>` as its results folder slug (kebab-case).
2. For each assigned test, read only `tests/<category>/<test-id>.md`.
3. Create `results/<model-name>/<test-id>/` and write the exact deliverable
   files named by the test.
4. Write `REASONING.md` in the same folder covering: approach chosen, key
   decisions, trade-offs considered, and known limitations. This file is
   graded.
5. **Never** read `rubrics/`, `report/`, or other models' `results/` folders.
6. **Never** write outside `results/<model-name>/`.
7. Overwriting its own previous results is allowed (re-runs replace).

## JUDGE.md protocol (evaluator model)

Run in a separate session, ideally with the strongest model available. The
protocol instructs the judge to:

1. Enumerate `results/<model-name>/` folders (or judge only the models the
   user names).
2. For each model × test: read the deliverables, `REASONING.md`, and the
   test's rubric.
3. Score every objective check (pass/fail with one-line evidence) and every
   subjective criterion (0–10 with a written justification citing concrete
   evidence from the output — no score without a comment).
4. Write the full judgment to `report/judgments/<model-name>/<test-id>.md`:
   per-criterion scores, evidence, comments, and an overall verdict paragraph.
5. Update `report/data.js`: add/replace that model's entry with per-criterion
   numeric scores, a one-line note per test, and metadata (judge model name,
   date — provided by the user or session context). Section scores and totals
   are NOT stored — the report page computes them from raw scores and weights,
   so the math lives in one place.
6. Anti-bias rules: score strictly against the rubric; judge the output, not
   the model's reputation; missing deliverable → test total 0 with a note;
   missing `REASONING.md` → reasoning criterion 0.
7. Re-judging a model replaces its previous entry and judgment files.

## report/data.js format

A plain JS file (works from `file://`, no fetch):

```js
window.BENCH_DATA = {
  updated: "2026-07-03",
  models: {
    "deepseek-v4": {
      judgedBy: "claude-fable-5",
      judgedOn: "2026-07-03",
      tests: {
        "coding-01-edge-cases": {
          objective: { "obj-1": 10, "obj-2": 0 },
          subjective: { "sub-quality": 7, "sub-clarity": 8, "sub-reasoning": 6 },
          note: "Solid solution, missed the dependency constraint."
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
  data; one colored polygon per model; legend with per-model toggle. A model
  with no data in a category renders a gap/zero point with a visual partial
  marker rather than faking coverage.
- **View toggle**: Combined / Objective only / Subjective only — recomputes
  the radar and tables from raw criterion scores.
- **Score tables**: per category → per test → per criterion, showing
  pass/fail for objective checks, 0–10 for subjective, the one-line note, and
  coverage ("2/2" / "1/2 tests run").
- **Judge notes**: expandable per-test note; full reasoning stays in
  `report/judgments/` (linked by relative path).
- Defensive rendering: malformed or unknown entries in `data.js` are skipped
  with a console warning, never a broken page.

## Error handling summary

| Failure | Behavior |
| --- | --- |
| Missing deliverable file | Test total 0, judge notes why |
| Missing `REASONING.md` | Reasoning criterion 0, rest scored normally |
| Test skipped by runner | Excluded from category mean; coverage shows it |
| Category with no data for any model | Axis omitted from radar |
| Malformed `data.js` entry | Skipped by the page with console warning |
| Runner reads rubrics (detected by judge from output) | Judge notes it in the verdict |

## Testing the kit

1. **Smoke run:** Claude (this session or a subagent) follows `RUN.md` as a
   sample model on 2–3 tests, then follows `JUDGE.md`, producing real entries
   in `data.js`.
2. **Report check:** open `report/index.html` in the browser and verify the
   radar, toggles, tables, and partial-coverage rendering against the sample
   data plus a hand-written second model entry.
3. **Protocol read-through:** confirm `RUN.md`/`JUDGE.md` are self-contained
   for an agent with zero context of this conversation.

## Out of scope (YAGNI)

- API harnesses, automated model invocation, CI.
- Score history/versioning beyond git.
- Blind judging (folder names reveal model identity; anti-bias rules mitigate).
- More than 2 tests per category initially.
