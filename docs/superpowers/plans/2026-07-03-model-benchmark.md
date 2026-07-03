# Model Benchmark Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the zero-infrastructure model-benchmark kit specified in `docs/superpowers/specs/2026-07-03-model-benchmark-design.md`: protocols, 12 tests + 12 rubrics, and a self-contained HTML radar report.

**Architecture:** Everything is markdown in a fixed folder layout plus one static `report/index.html` (inline CSS/JS) that reads a sibling `report/data.js` via `<script src>`. No build step, no dependencies, works from `file://`. Because most deliverables are prose/protocol files, tasks use write → verify-against-checklist → commit instead of classic TDD; the JS-bearing artifacts (report page, smoke-run outputs) get executable verification with `node` and a browser.

**Tech Stack:** Markdown, hand-written HTML/CSS/JS (ES2017, no libraries), git.

## Global Constraints

- No external dependencies anywhere: no CDN, fonts, images, fetch, or npm. `report/index.html` must open by double-click from `file://`.
- Test IDs use a short category slug prefix: `coding-`, `writing-`, `planning-`, `creative-`, `game-`, `business-`; the authoritative category is the `category:` frontmatter field. Full ID form: `<slug>-<nn>-<name>` (e.g. `coding-01-edge-cases`).
- All 12 rubrics use section weights `objective: 0.5 / subjective: 0.5` and subjective criteria ids `sub-quality` (0.4), `sub-craft` (0.3), `sub-reasoning` (0.3). Display names vary per rubric; ids never do. Every rubric's `sub-reasoning` is named "Reasoning quality".
- Every rubric has a unique `canary:` frontmatter phrase, woven verbatim into its `## Judge guidance` body, never present in the test file.
- Objective checks: pass = 10, fail = 0. Subjective: 0–10. Category score = mean of attempted, non-invalidated tests.
- Runners never read `rubrics/`, `report/`, or other runs' `results/` folders, and never write outside `results/<run-id>/`.
- `report/data.js` stores only raw criterion scores + notes + integrity fields — never computed totals.
- Commit after every task. Working directory is `C:\Projects\model-benchmark`.

---

### Task 1: Scaffold + README.md

**Files:**
- Create: `README.md`, `tests/coding/.gitkeep`, `tests/writing/.gitkeep`, `tests/planning-reasoning/.gitkeep`, `tests/creative-visual/.gitkeep`, `tests/game-design/.gitkeep`, `tests/business-planning/.gitkeep`, `rubrics/.gitkeep`, `results/.gitkeep`, `report/judgments/.gitkeep`

**Interfaces:**
- Produces: the folder layout every later task writes into; README section "Adding a test" names the `TESTS` config block that Task 10 creates in `report/index.html`.

- [ ] **Step 1: Create the folder skeleton**

```bash
cd "C:/Projects/model-benchmark"
mkdir -p tests/coding tests/writing tests/planning-reasoning tests/creative-visual tests/game-design tests/business-planning rubrics results report/judgments
touch tests/coding/.gitkeep tests/writing/.gitkeep tests/planning-reasoning/.gitkeep tests/creative-visual/.gitkeep tests/game-design/.gitkeep tests/business-planning/.gitkeep rubrics/.gitkeep results/.gitkeep report/judgments/.gitkeep
```

- [ ] **Step 2: Write `README.md`** with exactly this content:

````markdown
# Model Benchmark

A zero-infrastructure kit for comparing AI models across six categories:
coding, writing, planning & reasoning, creative visual, game design, and
business planning. Everything is markdown plus one self-contained HTML
report. No APIs, no scripts, no build step.

## How it works

1. **Run.** Open any agent CLI in this repo with the model you want to
   test and say: *"Follow RUN.md as `<run-id>`"* (see RUN.md for the
   run-id format), optionally listing tests or categories. The model
   writes its outputs to `results/<run-id>/`.
2. **Judge.** In a separate session — ideally with the strongest model
   available — say: *"Follow JUDGE.md"*. The judge scores every run
   against the rubrics and updates `report/data.js`.
3. **View.** Double-click `report/index.html`: radar chart, score tables,
   integrity badges.

A **run** = model + reasoning effort + harness, because the same model can
score differently at different efforts or in different harnesses.

## Layout

```
tests/<category>/<test-id>.md   the tasks (runners read ONLY these)
rubrics/<test-id>.md            scoring criteria (runners must never read)
results/<run-id>/               one folder per run; meta.json + outputs
report/judgments/<run-id>/      the judge's full written reasoning
report/data.js                  raw scores (window.BENCH_DATA)
report/index.html               the report page
```

## Scoring

- Objective checks: binary, pass = 10 / fail = 0; section score = mean.
- Subjective criteria: 0–10 with mandatory written justification; every
  rubric grades **Reasoning quality** from the run's `REASONING.md`.
- Test total = 0.5 × objective + 0.5 × subjective.
- Category = mean of attempted tests only; coverage is shown honestly
  (e.g. "1/2 tests run"). The report can show combined, objective-only,
  or subjective-only views.

## Cheating detection (best-effort)

Tiered. **Hard evidence** — a rubric canary phrase leaking into output,
forbidden paths confessed in the run's `## Files read` manifest, or writes
outside the run's folder — invalidates the test (re-run at your
discretion). **Soft evidence** — output suspiciously shaped like the
rubric — flags it with a ⚠ badge but scores normally.

**Known limits:** a careful cheater who reads a rubric, paraphrases, and
lies in its manifest evades all of this. Optional hardening if you want
it: deny rubric reads at the harness level for run sessions (e.g. Claude
Code permission deny rules), or save the run session's transcript and
give it to the judge to audit.

## Adding a test

1. Add `tests/<category>/<test-id>.md` (frontmatter: id, category, title,
   deliverables; body: Task / Deliverables / Constraints).
2. Add `rubrics/<test-id>.md` with a fresh unique canary phrase.
3. Mirror the criteria in the `TESTS` config block at the top of the
   script in `report/index.html`.
````

- [ ] **Step 3: Verify**

Run: `ls tests/coding tests/writing tests/planning-reasoning tests/creative-visual tests/game-design tests/business-planning rubrics results report/judgments && head -5 README.md`
Expected: all directories listed without error; README title prints.

- [ ] **Step 4: Commit**

```bash
git add README.md tests rubrics results report
git commit -m "Add folder skeleton and README"
```

---

### Task 2: RUN.md protocol

**Files:**
- Create: `RUN.md`

**Interfaces:**
- Produces: the `meta.json` shape `{model, effort, harness, date}` and the `REASONING.md` section contract (`## Approach`, `## Key decisions`, `## Trade-offs and limitations`, `## Files read`) that JUDGE.md (Task 3) and the smoke run (Task 11) rely on.

- [ ] **Step 1: Write `RUN.md`** with exactly this content:

````markdown
# RUN.md — Protocol for the model under test

You are being benchmarked. Follow these steps exactly.

## Inputs (from the user)

- `<run-id>`: a kebab-case slug for this run. Suggested form
  `<model>--<effort>--<harness>`, e.g. `claude-fable-5--high--claude-code`.
- Optionally, a list of tests or categories to run. Default: every test
  in `tests/`.

## Rules — read these first

1. Read ONLY: this file, files under `tests/`, and your own
   `results/<run-id>/` folder. **Never** read `rubrics/`, `report/`, or
   any other folder under `results/`. Doing so invalidates your run.
2. **Never** write outside `results/<run-id>/`.
3. Overwriting your own previous outputs is fine (re-runs replace).
4. Do not self-grade or speculate about scoring criteria anywhere in
   your outputs.

## Steps

1. Create `results/<run-id>/` and write `meta.json` first:

   ```json
   { "model": "<model name>", "effort": "<effort or 'unspecified'>",
     "harness": "<harness or 'unspecified'>", "date": "<YYYY-MM-DD>" }
   ```

   `model` is required — take it from the user, or from your own session
   context if the user didn't say. Use `"unspecified"` for effort or
   harness when unknown.

2. For each assigned test:
   1. Read `tests/<category>/<test-id>.md`. Keep note of every repo file
      you read while working.
   2. Create `results/<run-id>/<test-id>/`.
   3. Produce EXACTLY the deliverable files the test names, in that
      folder — same filenames, nothing extra required.
   4. Write `REASONING.md` in the same folder with these sections, in
      this order:
      - `## Approach` — what you chose and why
      - `## Key decisions` — the calls you made, alternatives you
        rejected
      - `## Trade-offs and limitations` — what you gave up, what is weak
      - `## Files read` — every repo file you consulted for this test,
        one relative path per line, excluding files you created. This
        section is required and is checked.

      `REASONING.md` is itself graded — on honesty and depth, not
      length.

## Checklist before you finish

- [ ] `results/<run-id>/meta.json` exists and has a `model` value
- [ ] Every assigned test folder contains all deliverables the test names
- [ ] Every test folder has `REASONING.md` ending with `## Files read`
- [ ] You read nothing under `rubrics/`, `report/`, or other runs
- [ ] You wrote nothing outside `results/<run-id>/`
````

- [ ] **Step 2: Verify**

Run: `grep -c "## Files read" RUN.md`
Expected: `2` (steps section + checklist).

- [ ] **Step 3: Commit**

```bash
git add RUN.md
git commit -m "Add RUN.md protocol for the model under test"
```

---

### Task 3: JUDGE.md protocol

**Files:**
- Create: `JUDGE.md`

**Interfaces:**
- Consumes: `meta.json` and `REASONING.md` contracts from Task 2; rubric format (canary frontmatter, criteria ids) from Tasks 4–9.
- Produces: the `data.js` entry shape (raw criterion scores keyed by `obj-*`/`sub-*` ids, `note`, optional `integrity`/`integrityNote`, run metadata + `judgedBy`/`judgedOn`) that `report/index.html` (Task 10) consumes, and the judgment-file template used in Task 12.

- [ ] **Step 1: Write `JUDGE.md`** with exactly this content:

````markdown
# JUDGE.md — Protocol for the evaluator model

You are judging benchmark runs. Be strict, cite evidence, follow the
rubric — nothing else.

## Inputs

- Runs to judge: the user names them, or default to every folder under
  `results/`.
- Judge metadata: your model name and today's date. Ask the user if you
  cannot determine them from your session.

## Per run

1. Read `results/<run-id>/meta.json`. If missing or unreadable, ASK the
   user for the run's model/effort/harness — never guess — before
   writing any scores.
2. **Integrity — write check.** Run `git status` (and `git diff` where
   needed). Runner changes outside `results/<run-id>/` — especially to
   `rubrics/`, `tests/`, or `report/` — are HARD evidence against the
   affected tests. If several uncommitted runs make attribution unclear,
   report the stray writes to the user instead of invalidating
   (committing between runs keeps this check sharp).

## Per test in the run

3. Read the deliverables, `REASONING.md`, and `rubrics/<test-id>.md`.
4. **Integrity check**, before scoring:
   - **Manifest:** the `## Files read` section lists anything under
     `rubrics/`, `report/`, or another run's `results/` folder → HARD.
   - **Canary:** the rubric's `canary` phrase, or near-verbatim rubric
     criterion wording, appears in any deliverable or `REASONING.md`
     → HARD.
   - **Alignment (SOFT):** the output mirrors the rubric's structure or
     criterion order, hits every obscure objective check, `REASONING.md`
     is organized around criterion names, or the manifest is implausibly
     clean for the work shown.
   - Missing `## Files read` section entirely → SOFT flag
     ("unverifiable"), and count it against the Reasoning quality
     criterion.
   - HARD → record the test as invalidated with the evidence; do not
     score it. SOFT → note it; score normally.
5. **Score** (skip if invalidated):
   - Each objective check: pass = 10 / fail = 0, with one line of
     evidence. Actually verify — run JS files with `node`, open HTML/SVG
     files, count words when a rubric sets a limit.
   - Each subjective criterion: 0–10 with a written justification citing
     concrete evidence from the output. No score without a comment.
   - Missing deliverable → every objective check fails and every
     subjective criterion is 0, with a note explaining why (test total
     becomes 0).
   - Missing `REASONING.md` → `sub-reasoning` = 0; score the rest
     normally.
6. Write the full judgment to `report/judgments/<run-id>/<test-id>.md`
   using the template at the bottom of this file.
7. Update `report/data.js` (format below): add or replace this run's
   entry, and set the top-level `updated` field to today's date. Store
   only raw criterion scores, notes, and integrity fields — never
   computed totals; the report page does that math.

## Anti-bias rules

- Score strictly against the rubric. Judge the output, not the model's
  reputation or name.
- Don't let one criterion bleed into another — a beautiful deliverable
  with shallow reasoning gets a low `sub-reasoning`, and vice versa.
- Re-judging a run replaces its previous `data.js` entry and judgment
  files.

## When you finish

Summarize per run: tests judged, soft flags, and any INVALIDATED tests —
list those explicitly so the user can decide whether to re-run them. A
re-run replaces the invalidated entry.

## data.js entry format

`report/data.js` is a plain JS file defining `window.BENCH_DATA`. Add or
replace `runs["<run-id>"]` like this (criterion ids come from the
rubric):

```js
"<run-id>": {
  model: "deepseek-v4", effort: "high", harness: "claude-code",
  date: "2026-07-03",
  judgedBy: "claude-fable-5", judgedOn: "2026-07-03",
  tests: {
    "coding-01-edge-cases": {
      objective: { "obj-1": 10, "obj-2": 10, "obj-3": 0, "obj-4": 10 },
      subjective: { "sub-quality": 7, "sub-craft": 8, "sub-reasoning": 6 },
      note: "Solid merge logic; adjacency case missed."
      // integrity: "flagged" | "invalidated"   (omit when clean)
      // integrityNote: "one line of evidence"  (required with integrity)
      // an invalidated test carries NO objective/subjective scores
    }
  }
}
```

## Judgment file template

```markdown
# <test-id> — <run-id>

**Judged by:** <judge model> on <YYYY-MM-DD>

## Integrity
<"Clean.", or the evidence for a flag / invalidation>

## Objective checks
- obj-1 (<check text>): PASS|FAIL — <one line of evidence>
- ...

## Subjective criteria
- sub-quality (<name>): <n>/10 — <justification citing concrete evidence>
- sub-craft (<name>): <n>/10 — <justification>
- sub-reasoning (Reasoning quality): <n>/10 — <justification>

## Verdict
<one paragraph: overall quality, standout strengths, main weaknesses>
```
````

- [ ] **Step 2: Verify**

Run: `grep -c "HARD" JUDGE.md && grep -c "sub-reasoning" JUDGE.md`
Expected: first count ≥ 3, second count ≥ 3.

- [ ] **Step 3: Commit**

```bash
git add JUDGE.md
git commit -m "Add JUDGE.md protocol with integrity checks and data.js format"
```

---

### Task 4: Coding tests + rubrics

**Files:**
- Create: `tests/coding/coding-01-edge-cases.md`, `tests/coding/coding-02-refactor.md`, `rubrics/coding-01-edge-cases.md`, `rubrics/coding-02-refactor.md`

**Interfaces:**
- Produces: test ids `coding-01-edge-cases`, `coding-02-refactor`; deliverables `solution.js`, `refactored.js` + `CHANGES.md`; objective ids `obj-1..obj-4`; subjective ids `sub-quality`/`sub-craft`/`sub-reasoning` — mirrored by Task 10's `TESTS` config and consumed by Tasks 11–12.

- [ ] **Step 1: Write `tests/coding/coding-01-edge-cases.md`**

````markdown
---
id: coding-01-edge-cases
category: coding
title: Robust function with edge cases
deliverables:
  - solution.js
---

## Task

Implement `mergeRanges(ranges)` in plain JavaScript (Node-compatible).
Input: an array of `[start, end]` integer pairs — possibly unsorted,
overlapping, adjacent, inverted (`start > end`), duplicated, or empty.
Output: a NEW array of merged, non-overlapping ranges sorted ascending.
Adjacent ranges merge: `[1,2]` and `[2,3]` become `[1,3]`. Normalize
inverted pairs by swapping. Decide and document how you treat entries
that are not two-integer arrays.

## Deliverables

- `solution.js` — the function plus a self-test block that runs with
  `node solution.js` and prints one `PASS`/`FAIL` line per case for at
  least 6 distinct cases, which must include: empty input, a single
  range, adjacency, and an inverted pair.

## Constraints

- Single file, no dependencies, at most 120 lines.
````

- [ ] **Step 2: Write `rubrics/coding-01-edge-cases.md`**

````markdown
---
test: coding-01-edge-cases
canary: "sentinel sweep"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node solution.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "Empty input and single-range input return correct results"
    - id: obj-3
      check: "Adjacent ranges are merged ([1,2] + [2,3] -> [1,3])"
    - id: obj-4
      check: "Single file, no dependencies, <= 120 lines"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Run the file with node. Verify obj-2/obj-3 yourself with cases beyond
  the self-tests: inverted pairs, duplicates, negatives, already-merged
  input.
- Solution quality: sort-then-single-pass merging (what we privately call
  the "sentinel sweep" shape) is the clean baseline; repeated re-scanning
  loops or mutating the input array should cost points. Weigh how invalid
  entries are handled and whether the choice is documented.
- Code clarity: naming, structure, no cleverness for its own sake.
- Reasoning quality: real decisions and honest limitations in
  REASONING.md, not boilerplate.
````

- [ ] **Step 3: Write `tests/coding/coding-02-refactor.md`**

````markdown
---
id: coding-02-refactor
category: coding
title: Behavior-preserving refactor
deliverables:
  - refactored.js
  - CHANGES.md
---

## Task

Refactor the function below into clean, maintainable code WITHOUT
changing its behavior. Same inputs, same outputs, exactly.

```js
function calc(o){
  var t=0;
  for(var i=0;i<o.items.length;i++){
    var it=o.items[i];
    if(it.type=="book"){t=t+it.price*it.qty*0.9;}
    else{if(it.type=="food"){t=t+it.price*it.qty;}else{t=t+it.price*it.qty*1.2;}}
  }
  if(o.coupon){if(o.coupon=="TEN"){t=t*0.9}else{if(o.coupon=="HALF"){t=t*0.5}}}
  if(t>100){t=t-5}
  return Math.round(t*100)/100;
}
```

## Deliverables

- `refactored.js` — the refactored `calc` plus a self-test block runnable
  with `node refactored.js` that checks AT LEAST these five inputs and
  prints one PASS/FAIL line per case:
  1. `{items:[{type:"book",price:10,qty:2}]}`
  2. `{items:[{type:"food",price:5,qty:3}]}`
  3. `{items:[{type:"gadget",price:50,qty:2}]}`
  4. `{items:[{type:"book",price:100,qty:1}],coupon:"HALF"}`
  5. `{items:[{type:"gadget",price:100,qty:1}],coupon:"TEN"}`
- `CHANGES.md` — what you changed, why, and how you know behavior is
  preserved.

## Constraints

- Plain JavaScript, no dependencies, `refactored.js` at most 100 lines.
- The quirks are behavior, not bugs: the flat 5-unit discount above 100
  applies AFTER the coupon, and unknown coupons do nothing. Keep them.
````

- [ ] **Step 4: Write `rubrics/coding-02-refactor.md`**

The five reference outputs (judge verifies these): case 1 → `18`,
case 2 → `15`, case 3 → `115`, case 4 → `45`, case 5 → `103`.

````markdown
---
test: coding-02-refactor
canary: "ledger-thin naming"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node refactored.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 18, 15, 115, 45, 103 (verify independently)"
    - id: obj-3
      check: "Quirks preserved: coupon before the >100 discount; unknown coupons ignored"
    - id: obj-4
      check: "No dependencies, refactored.js <= 100 lines"
  subjective:
    - id: sub-quality
      name: "Refactor quality"
      weight: 0.4
    - id: sub-craft
      name: "CHANGES.md clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Run the self-tests, then verify the five reference outputs yourself
  with node — do not trust the self-test block blindly.
- Refactor quality: decomposition into intention-revealing units; prefer
  ledger-thin naming (names so precise the code needs no comments) over
  comment-heavy patches. Penalize behavior drift disguised as cleanup.
- CHANGES.md clarity: does it say what changed AND the evidence behavior
  held?
- Reasoning quality: honest trade-offs (e.g. readability vs. the line
  budget), not a restatement of the diff.
````

- [ ] **Step 5: Verify the reference outputs and canary hygiene**

```bash
node -e "function calc(o){var t=0;for(var i=0;i<o.items.length;i++){var it=o.items[i];if(it.type=='book'){t=t+it.price*it.qty*0.9;}else{if(it.type=='food'){t=t+it.price*it.qty;}else{t=t+it.price*it.qty*1.2;}}}if(o.coupon){if(o.coupon=='TEN'){t=t*0.9}else{if(o.coupon=='HALF'){t=t*0.5}}}if(t>100){t=t-5}return Math.round(t*100)/100;}console.log([calc({items:[{type:'book',price:10,qty:2}]}),calc({items:[{type:'food',price:5,qty:3}]}),calc({items:[{type:'gadget',price:50,qty:2}]}),calc({items:[{type:'book',price:100,qty:1}],coupon:'HALF'}),calc({items:[{type:'gadget',price:100,qty:1}],coupon:'TEN'})].join(','));"
```

Expected output: `18,15,115,45,103` (must match rubric obj-2 exactly).
Then: `grep -rl "sentinel sweep\|ledger-thin" tests/` — expected: no
output (canaries never appear in test files).

- [ ] **Step 6: Commit**

```bash
git add tests/coding rubrics/coding-01-edge-cases.md rubrics/coding-02-refactor.md
git commit -m "Add coding tests and rubrics"
```

---

### Task 5: Writing tests + rubrics

**Files:**
- Create: `tests/writing/writing-01-explainer.md`, `tests/writing/writing-02-registers.md`, `rubrics/writing-01-explainer.md`, `rubrics/writing-02-registers.md`

**Interfaces:**
- Produces: test ids `writing-01-explainer`, `writing-02-registers`; deliverables `explainer.md`, `rewrite.md` — mirrored by Task 10's `TESTS` config; `writing-02-registers` is used in the smoke run (Task 11).

- [ ] **Step 1: Write `tests/writing/writing-01-explainer.md`**

````markdown
---
id: writing-01-explainer
category: writing
title: Technical concept for a lay audience
deliverables:
  - explainer.md
---

## Task

Explain **eventual consistency** to a small-business owner who uses
cloud apps daily but has no technical background. They just read a
support answer saying "your dashboard may take a minute to reflect
recent sales — our system is eventually consistent" and want to know
what that means and whether their data is safe.

## Deliverables

- `explainer.md` — a titled piece of continuous prose (a single `#`
  title, no other headings, no bullet lists) between 250 and 400 words,
  containing exactly one extended analogy drawn from everyday life, and
  explicitly answering whether their data is safe.

## Constraints

- No unexplained jargon: any technical term must be explained in the
  same sentence or dropped.
````

- [ ] **Step 2: Write `rubrics/writing-01-explainer.md`**

````markdown
---
test: writing-01-explainer
canary: "porchlight explainer"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Word count between 250 and 400 (count it)"
    - id: obj-2
      check: "Single # title; no other headings; no bullet lists"
    - id: obj-3
      check: "Exactly one extended analogy"
    - id: obj-4
      check: "Explicitly answers whether the data is safe"
  subjective:
    - id: sub-quality
      name: "Technical accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Warmth and flow"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Technical accuracy: eventual consistency correctly characterized
  (reads may briefly lag writes; the system converges; durability is a
  separate property) without overclaiming or fear-mongering.
- Warmth and flow: the tone of a porchlight explainer — a neighbor
  explaining over the fence, not a lecture. Penalize condescension and
  walls of hedging.
- Reasoning quality: did REASONING.md weigh audience, analogy choice,
  and what to leave out?
````

- [ ] **Step 3: Write `tests/writing/writing-02-registers.md`**

````markdown
---
id: writing-02-registers
category: writing
title: One message, three registers
deliverables:
  - rewrite.md
---

## Task

The paragraph below announces a launch delay. Rewrite it three times:

1. **Formal** — for an investor update.
2. **Friendly** — for the customer newsletter.
3. **One-sentence summary** — 25 words or fewer.

> Due to the fact that the integration of the new payment system
> encountered unforeseen complications of a technical nature, it has
> been decided by the team that the launch, which was originally
> scheduled to occur on March 3rd, will now be postponed until
> April 14th, and customers who have already made pre-orders will be
> receiving a discount of 15% as compensation for the delay that has
> occurred.

All four facts must survive every version: (a) the cause is
payment-system integration problems, (b) the old date was March 3,
(c) the new date is April 14, (d) pre-order customers get 15% off.

## Deliverables

- `rewrite.md` — the three versions under headings `## Formal`,
  `## Friendly`, `## Summary`.

## Constraints

- The summary is one sentence of at most 25 words. No new facts invented
  in any version.
````

- [ ] **Step 4: Write `rubrics/writing-02-registers.md`**

````markdown
---
test: writing-02-registers
canary: "register hinge"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three sections present: ## Formal, ## Friendly, ## Summary"
    - id: obj-2
      check: "All four facts present in every version"
    - id: obj-3
      check: "Summary is one sentence of <= 25 words (count them)"
    - id: obj-4
      check: "No invented facts in any version"
  subjective:
    - id: sub-quality
      name: "Register fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Register fidelity: each version unmistakable for its audience — the
  pivot between tones (the register hinge) must feel deliberate, not a
  synonym swap. Formal is not stiff; friendly is not unserious.
- Concision: every version should be materially tighter than the
  original paragraph.
- Reasoning quality: did REASONING.md discuss tone choices per audience
  and what was deliberately dropped?
````

- [ ] **Step 5: Verify canary hygiene**

Run: `grep -rl "porchlight\|register hinge" tests/` — expected: no output.

- [ ] **Step 6: Commit**

```bash
git add tests/writing rubrics/writing-01-explainer.md rubrics/writing-02-registers.md
git commit -m "Add writing tests and rubrics"
```

---

### Task 6: Planning & reasoning tests + rubrics

**Files:**
- Create: `tests/planning-reasoning/planning-01-tradeoff.md`, `tests/planning-reasoning/planning-02-estimate.md`, `rubrics/planning-01-tradeoff.md`, `rubrics/planning-02-estimate.md`

**Interfaces:**
- Produces: test ids `planning-01-tradeoff`, `planning-02-estimate`; deliverables `decision.md`, `estimate.md` — mirrored by Task 10's `TESTS` config.

- [ ] **Step 1: Write `tests/planning-reasoning/planning-01-tradeoff.md`**

````markdown
---
id: planning-01-tradeoff
category: planning-reasoning
title: Build vs buy decision memo
deliverables:
  - decision.md
---

## Task

An 8-person travel agency needs a booking-management system. The
options:

- **SaaS**: $400/month, live next week, data lives with the vendor,
  per-seat pricing jumps sharply at 15 seats.
- **Custom build**: a contractor quotes $30,000 up front plus about
  $500/month maintenance, 4 months to deliver, full ownership.
- **Self-hosted open source**: free license, about $150/month hosting,
  an estimated $6,000 of paid setup (3 weeks), then ongoing maintenance
  falling on the office's one tech-savvy employee.

Write a decision memo for the agency's owner.

## Deliverables

- `decision.md` — must contain: a weighted decision matrix with at least
  4 criteria you choose and justify, one clear recommendation, and a
  risks-and-mitigations section for the recommended option.

## Constraints

- At most 600 words. Use the numbers given; state any additional
  assumptions explicitly.
````

- [ ] **Step 2: Write `rubrics/planning-01-tradeoff.md`**

````markdown
---
test: planning-01-tradeoff
canary: "quarry matrix"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Decision matrix with >= 4 criteria, each with an explicit weight"
    - id: obj-2
      check: "Exactly one explicit recommendation"
    - id: obj-3
      check: "Risks-and-mitigations section for the recommended option"
    - id: obj-4
      check: "<= 600 words; given numbers used without contradiction"
  subjective:
    - id: sub-quality
      name: "Decision rigor"
      weight: 0.4
    - id: sub-craft
      name: "Memo clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Decision rigor: are the criterion weights defended, not decorative? A
  matrix quarried to justify a pre-picked winner (the quarry matrix
  smell) scores low — check whether plausible alternative weights would
  flip the result and whether that risk is acknowledged.
- Memo clarity: an owner with five minutes should get the answer, the
  cost picture, and the biggest risk.
- Reasoning quality: does REASONING.md engage with multi-year cost math
  and the staffing reality, not just restate the memo?
````

- [ ] **Step 3: Write `tests/planning-reasoning/planning-02-estimate.md`**

````markdown
---
id: planning-02-estimate
category: planning-reasoning
title: Fermi estimate with stated assumptions
deliverables:
  - estimate.md
---

## Task

A photo-sharing app has 50,000 monthly active users. Estimate its
monthly **storage growth** (new data added per month) and **egress
bandwidth**. Use no external data: invent reasonable assumptions and
state every one.

## Deliverables

- `estimate.md` — must contain, in this order: `## Assumptions` (every
  number you assume, one per line), `## Calculation` (arithmetic shown
  step by step), `## Result` (a range, not a point estimate, for both
  quantities), `## Sensitivity` (the single assumption that moves the
  result most, and why).

## Constraints

- At most 500 words. All arithmetic must be checkable from what is on
  the page.
````

- [ ] **Step 4: Write `rubrics/planning-02-estimate.md`**

````markdown
---
test: planning-02-estimate
canary: "anchor-and-fan"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All four sections present in order: Assumptions, Calculation, Result, Sensitivity"
    - id: obj-2
      check: "Arithmetic is correct as written (recompute it)"
    - id: obj-3
      check: "Result gives a range for BOTH storage growth and egress"
    - id: obj-4
      check: "Sensitivity names one specific assumption with a why"
  subjective:
    - id: sub-quality
      name: "Estimation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Estimation judgment: plausible assumption values (posting rates, photo
  sizes, view multipliers) and sound structure — good estimates anchor on
  one defensible number and fan the rest out from it (anchor-and-fan),
  rather than stacking six wild guesses.
- Transparency: could you rebuild the whole estimate from the page alone?
- Reasoning quality: does REASONING.md admit which assumptions are
  weakest?
````

- [ ] **Step 5: Verify canary hygiene**

Run: `grep -rl "quarry matrix\|anchor-and-fan" tests/` — expected: no output.

- [ ] **Step 6: Commit**

```bash
git add tests/planning-reasoning rubrics/planning-01-tradeoff.md rubrics/planning-02-estimate.md
git commit -m "Add planning-reasoning tests and rubrics"
```

---

### Task 7: Creative-visual tests + rubrics

**Files:**
- Create: `tests/creative-visual/creative-01-svg-poster.md`, `tests/creative-visual/creative-02-css-scene.md`, `rubrics/creative-01-svg-poster.md`, `rubrics/creative-02-css-scene.md`

**Interfaces:**
- Produces: test ids `creative-01-svg-poster`, `creative-02-css-scene`; deliverables `poster.svg`, `scene.html` — mirrored by Task 10's `TESTS` config.

- [ ] **Step 1: Write `tests/creative-visual/creative-01-svg-poster.md`**

````markdown
---
id: creative-01-svg-poster
category: creative-visual
title: Hand-coded SVG event poster
deliverables:
  - poster.svg
---

## Task

Hand-write an SVG poster for a fictional event: **Aurora Nights Music
Festival, 12–14 February 2027, Harbor Park**. Dark, atmospheric,
readable at a glance.

## Deliverables

- `poster.svg` — portrait orientation with `viewBox="0 0 600 900"`,
  containing the event name, the dates, and the venue as text, plus at
  least three distinct non-text visual elements (shapes, gradients,
  patterns).

## Constraints

- Pure SVG: no external images, fonts, stylesheets, or scripts.
- At most 150 lines. Must render in a browser opened from `file://`.
````

- [ ] **Step 2: Write `rubrics/creative-01-svg-poster.md`**

````markdown
---
test: creative-01-svg-poster
canary: "amber-grid composition"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Valid SVG that renders in a browser; viewBox is 0 0 600 900"
    - id: obj-2
      check: "Event name, dates, and venue all present as text"
    - id: obj-3
      check: "No external references (images, fonts, stylesheets, scripts)"
    - id: obj-4
      check: "<= 150 lines"
  subjective:
    - id: sub-quality
      name: "Composition & atmosphere"
      weight: 0.4
    - id: sub-craft
      name: "SVG craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Open the file in a browser; judge what you see, not the code alone.
- Composition & atmosphere: hierarchy (name dominates), believable
  aurora/night mood, and palette discipline — strong posters commit to a
  restrained scheme (an amber-grid composition, say) rather than
  scattering hues.
- SVG craftsmanship: sensible use of gradients/paths/groups vs. brute
  raster-thinking; clean coordinates.
- Reasoning quality: were composition and palette actual decisions in
  REASONING.md?
````

- [ ] **Step 3: Write `tests/creative-visual/creative-02-css-scene.md`**

````markdown
---
id: creative-02-css-scene
category: creative-visual
title: Pure-CSS animated scene
deliverables:
  - scene.html
---

## Task

Build a single-file, pure-CSS illustrated scene: **a lighthouse on a
cliff at dusk**, with at least one continuous CSS animation (light beam
sweeping, waves, twinkling stars — your choice).

## Deliverables

- `scene.html` — one file, inline CSS only.

## Constraints

- No JavaScript, no images of any kind (no `<img>`, no
  `background-image: url(...)`, no data URIs), no external resources.
  Gradients, shapes, shadows, and transforms only. Must work opened from
  `file://`.
````

- [ ] **Step 4: Write `rubrics/creative-02-css-scene.md`**

````markdown
---
test: creative-02-css-scene
canary: "dusk parallax discipline"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "No JavaScript anywhere in the file"
    - id: obj-2
      check: "No images or external resources (img tags, url(...), data URIs)"
    - id: obj-3
      check: "At least one continuous CSS animation runs"
    - id: obj-4
      check: "Single file; renders from file://"
  subjective:
    - id: sub-quality
      name: "Scene readability & charm"
      weight: 0.4
    - id: sub-craft
      name: "CSS technique"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Open in a browser and watch for at least 15 seconds.
- Scene readability & charm: is it unmistakably a lighthouse on a cliff
  at dusk? Depth layering matters — dusk parallax discipline (background
  quieter than foreground) beats a flat sticker collage.
- CSS technique: economical shapes, gradients earning their keep,
  animation that eases rather than snaps.
- Reasoning quality: did REASONING.md pick what NOT to draw?
````

- [ ] **Step 5: Verify canary hygiene**

Run: `grep -rl "amber-grid\|dusk parallax" tests/` — expected: no output.

- [ ] **Step 6: Commit**

```bash
git add tests/creative-visual rubrics/creative-01-svg-poster.md rubrics/creative-02-css-scene.md
git commit -m "Add creative-visual tests and rubrics"
```

---

### Task 8: Game-design tests + rubrics

**Files:**
- Create: `tests/game-design/game-01-microgame.md`, `tests/game-design/game-02-card-ruleset.md`, `rubrics/game-01-microgame.md`, `rubrics/game-02-card-ruleset.md`

**Interfaces:**
- Produces: test ids `game-01-microgame`, `game-02-card-ruleset`; deliverables `game.html`, `rules.md` — mirrored by Task 10's `TESTS` config (note: `game-01-microgame` has FIVE objective checks, `obj-1..obj-5`); `game-02-card-ruleset` is used in the smoke run (Task 11).

- [ ] **Step 1: Write `tests/game-design/game-01-microgame.md`**

````markdown
---
id: game-01-microgame
category: game-design
title: One-file browser microgame
deliverables:
  - game.html
---

## Task

Build a playable arcade microgame in a single HTML file. Genre is your
choice (dodge, catch, reflex, ...), but it must have: a visible score, a
fail state, and restart without reloading the page.

## Deliverables

- `game.html` — one file, inline CSS/JS, with the controls explained on
  screen before or during play.

## Constraints

- No external resources or libraries. Keyboard OR mouse controls (state
  which). Must run from `file://`. Sixty seconds of play should be
  enough to understand and enjoy it.
````

- [ ] **Step 2: Write `rubrics/game-01-microgame.md`**

````markdown
---
test: game-01-microgame
canary: "pip-loop pacing"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Single file, no external resources or libraries"
    - id: obj-2
      check: "Score is visible during play"
    - id: obj-3
      check: "A fail state is reachable in normal play"
    - id: obj-4
      check: "Restart works without reloading the page"
    - id: obj-5
      check: "Controls are explained on screen"
  subjective:
    - id: sub-quality
      name: "Fun & game feel"
      weight: 0.4
    - id: sub-craft
      name: "Polish"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Play it for at least two minutes. Reach the fail state, restart, play
  again.
- Fun & game feel: does difficulty ramp? Tight microgames earn replay
  through pip-loop pacing — short escalating beats — rather than a flat
  endless loop. Responsiveness of controls matters more than graphics.
- Polish: readable state changes (start/fail/restart), no console
  errors, nothing half-wired.
- Reasoning quality: did REASONING.md justify the genre choice for the
  60-second constraint?
````

- [ ] **Step 3: Write `tests/game-design/game-02-card-ruleset.md`**

````markdown
---
id: game-02-card-ruleset
category: game-design
title: Print-and-play card game rules
deliverables:
  - rules.md
---

## Task

Design a two-player game using ONLY a standard 52-card deck (no jokers,
nothing printed or added). It must involve meaningful decisions — not
pure luck — and a match should take 10–20 minutes.

## Deliverables

- `rules.md` with sections: `## Overview`, `## Setup`,
  `## Turn structure`, `## Winning`, `## Example round` (a concrete
  play-through of at least one full round with named players and
  specific cards).

## Constraints

- At most 800 words. The rules must be complete: a reader with a deck
  should never face a situation the rules do not cover.
````

- [ ] **Step 4: Write `rubrics/game-02-card-ruleset.md`**

````markdown
---
test: game-02-card-ruleset
canary: "table-hush"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All five sections present: Overview, Setup, Turn structure, Winning, Example round"
    - id: obj-2
      check: "Requires only a standard 52-card deck, nothing else"
    - id: obj-3
      check: "Example round names players and specific cards"
    - id: obj-4
      check: "<= 800 words (count them)"
  subjective:
    - id: sub-quality
      name: "Design depth"
      weight: 0.4
    - id: sub-craft
      name: "Rules clarity & completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Mentally play two rounds using only the rules as written; note every
  ambiguity you hit.
- Design depth: are there real decisions with tension? The best
  two-player fillers create table-hush moments — turns where both
  players stop to think. Pure luck or a solved dominant strategy scores
  low.
- Rules clarity & completeness: tie-breaks, empty-deck, simultaneous
  effects — covered or not?
- Reasoning quality: does REASONING.md name its influences and the
  degenerate strategies it worried about?
````

- [ ] **Step 5: Verify canary hygiene**

Run: `grep -rl "pip-loop\|table-hush" tests/` — expected: no output.

- [ ] **Step 6: Commit**

```bash
git add tests/game-design rubrics/game-01-microgame.md rubrics/game-02-card-ruleset.md
git commit -m "Add game-design tests and rubrics"
```

---

### Task 9: Business-planning tests + rubrics

**Files:**
- Create: `tests/business-planning/business-01-launch-plan.md`, `tests/business-planning/business-02-pricing.md`, `rubrics/business-01-launch-plan.md`, `rubrics/business-02-pricing.md`

**Interfaces:**
- Produces: test ids `business-01-launch-plan`, `business-02-pricing`; deliverables `plan.md`, `pricing.md` — mirrored by Task 10's `TESTS` config.

- [ ] **Step 1: Write `tests/business-planning/business-01-launch-plan.md`**

````markdown
---
id: business-01-launch-plan
category: business-planning
title: 90-day launch plan
deliverables:
  - plan.md
---

## Task

A solo founder is launching a specialty-coffee subscription in a
mid-size city. Budget: $15,000. Goal: 100 paying subscribers within 90
days. Write the launch plan.

## Deliverables

- `plan.md` — must contain: a 90-day timeline with at least 3 dated
  milestones, a budget table whose line items sum to at most $15,000
  (show the total row), and at least 3 KPIs with numeric targets.

## Constraints

- At most 800 words. Every budgeted dollar assigned to a line item.
````

- [ ] **Step 2: Write `rubrics/business-01-launch-plan.md`**

````markdown
---
test: business-01-launch-plan
canary: "runway lattice"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: ">= 3 milestones with dates or day numbers within the 90 days"
    - id: obj-2
      check: "Budget table sums correctly (recompute it) and totals <= $15,000"
    - id: obj-3
      check: ">= 3 KPIs with numeric targets"
    - id: obj-4
      check: "<= 800 words (count them)"
  subjective:
    - id: sub-quality
      name: "Realism"
      weight: 0.4
    - id: sub-craft
      name: "Prioritization"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Recompute the budget total yourself; a table that does not add up
  fails obj-2 regardless of how it is labeled.
- Realism: implied CAC vs. budget, plausible channel mix for a solo
  founder, dependencies sequenced sanely — milestones should interlock
  like a runway lattice, each funding confidence in the next, not float
  independently.
- Prioritization: is there a clear "do this first and most" or is
  everything priority one?
- Reasoning quality: does REASONING.md confront the weakest assumption
  (usually conversion rate)?
````

- [ ] **Step 3: Write `tests/business-planning/business-02-pricing.md`**

````markdown
---
id: business-02-pricing
category: business-planning
title: SaaS pricing proposal
deliverables:
  - pricing.md
---

## Task

A B2B SaaS scheduling tool has variable costs of $6 per user per month
and fixed costs of $8,000 per month. Its two competitors charge $19 and
$49 per user per month. Propose a three-tier pricing structure.

## Deliverables

- `pricing.md` — must contain: three tiers with prices and feature
  fences, a break-even calculation (users needed at your prices, with
  the arithmetic shown), and a positioning paragraph explaining where
  you sit versus the two competitors and why.

## Constraints

- At most 700 words. Use the given numbers; state extra assumptions
  explicitly.
````

- [ ] **Step 4: Write `rubrics/business-02-pricing.md`**

````markdown
---
test: business-02-pricing
canary: "keel margin"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Three tiers, each with a price and feature fences"
    - id: obj-2
      check: "Break-even arithmetic shown and correct (recompute it)"
    - id: obj-3
      check: "Positioning addresses BOTH competitors ($19 and $49)"
    - id: obj-4
      check: "<= 700 words (count them)"
  subjective:
    - id: sub-quality
      name: "Strategic soundness"
      weight: 0.4
    - id: sub-craft
      name: "Quantitative rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Recompute break-even from $6 variable and $8,000 fixed at the proposed
  prices; a mix-based calculation is fine if its assumptions are stated.
- Strategic soundness: sensible fences (who upgrades and why), and a
  keel margin on the floor tier — the cheapest price must still clear
  variable cost with room to steer, not race to $6.01.
- Quantitative rigor: numbers used consistently; no contradictions
  between tiers, break-even, and positioning.
- Reasoning quality: does REASONING.md defend price points against BOTH
  anchors rather than splitting the difference by reflex?
````

- [ ] **Step 5: Verify canary hygiene**

Run: `grep -rl "runway lattice\|keel margin" tests/` — expected: no output.

- [ ] **Step 6: Commit**

```bash
git add tests/business-planning rubrics/business-01-launch-plan.md rubrics/business-02-pricing.md
git commit -m "Add business-planning tests and rubrics"
```

---

### Task 10: Report page (`data.js` + `index.html`)

**Files:**
- Create: `report/data.js`, `report/index.html`

**Interfaces:**
- Consumes: rubric criteria/ids from Tasks 4–9 (the `TESTS` config below mirrors them exactly — any mismatch is a bug) and the data.js entry shape from Task 3.
- Produces: `window.BENCH_DATA` scaffold that JUDGE.md sessions append runs to; the report page itself.

- [ ] **Step 1: Write `report/data.js`** with exactly this content:

```js
// Raw benchmark scores. Written by JUDGE.md sessions — see that file for
// the entry format. Totals are computed by index.html, never stored here.
window.BENCH_DATA = {
  updated: "2026-07-03",
  runs: {}
};
```

- [ ] **Step 2: Write `report/index.html`** with exactly this content:

````html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Model Benchmark Report</title>
<style>
:root{
  --bg:#0a0d13;--panel:#111622;--line:#242c3d;--text:#dce3f2;--dim:#8b94ab;
}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--text);
  font:14px/1.5 "Segoe UI",system-ui,sans-serif;padding:24px;
  max-width:1100px;margin:0 auto}
h1{font-size:22px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 4px}
h2{font-size:16px;margin:32px 0 8px}
.sub{color:var(--dim);font-size:12px}
.controls{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0;align-items:center}
.controls label{color:var(--dim);font-size:12px;margin-right:6px}
select{background:var(--panel);color:var(--text);border:1px solid var(--line);
  border-radius:6px;padding:4px 8px}
.panel{background:var(--panel);border:1px solid var(--line);
  border-radius:12px;padding:16px}
#legend{display:flex;gap:14px;flex-wrap:wrap;margin:12px 0}
.leg{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px}
.swatch{width:12px;height:12px;border-radius:3px;display:inline-block}
table{border-collapse:collapse;width:100%;margin:8px 0 20px;font-size:13px}
th,td{border:1px solid var(--line);padding:5px 8px;text-align:center}
th{color:var(--dim);font-weight:500}
td.run,th.run{text-align:left;white-space:nowrap}
.pass{color:#7dffa8}.fail{color:#ff7d8a}
.total{font-weight:600}
.flag{cursor:help}
tr.invalidated td{color:var(--dim);text-decoration:line-through}
tr.invalidated td.note-cell{text-decoration:none;color:#ff7d8a;text-align:left}
details{text-align:left}
summary{cursor:pointer;color:var(--dim)}
a{color:#7db9ff}
.coverage{color:var(--dim);font-size:12px;margin:2px 0 6px}
svg text{fill:var(--dim);font-size:12px}
.empty{color:var(--dim);padding:24px;text-align:center}
</style>
</head>
<body>
<h1>Model Benchmark</h1>
<div class="sub" id="updated"></div>
<div class="controls">
  <span><label>View</label>
    <select id="view">
      <option value="combined">Combined</option>
      <option value="objective">Objective only</option>
      <option value="subjective">Subjective only</option>
    </select></span>
  <span><label>Harness</label><select id="harness"></select></span>
  <span><label>Effort</label><select id="effort"></select></span>
</div>
<div id="legend"></div>
<div class="panel"><svg id="radar" viewBox="0 0 640 520" width="100%"></svg></div>
<div id="tables"></div>
<script src="data.js"></script>
<script>
"use strict";
/* ---------- config: keep in sync with rubrics/ ---------- */
const CATEGORIES=[
  {id:"coding",label:"Coding"},
  {id:"writing",label:"Writing"},
  {id:"planning-reasoning",label:"Planning & Reasoning"},
  {id:"creative-visual",label:"Creative Visual"},
  {id:"game-design",label:"Game Design"},
  {id:"business-planning",label:"Business Planning"},
];
const WEIGHTS={objective:0.5,subjective:0.5};
const TESTS={
"coding-01-edge-cases":{category:"coding",title:"Robust function with edge cases",
 objective:[["obj-1","Self-tests pass"],["obj-2","Empty/single handled"],["obj-3","Adjacent merged"],["obj-4","1 file, ≤120 lines"]],
 subjective:[["sub-quality","Solution quality",0.4],["sub-craft","Code clarity",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"coding-02-refactor":{category:"coding",title:"Behavior-preserving refactor",
 objective:[["obj-1","Self-tests pass"],["obj-2","5 cases correct"],["obj-3","Quirks preserved"],["obj-4","No deps, ≤100 lines"]],
 subjective:[["sub-quality","Refactor quality",0.4],["sub-craft","CHANGES.md clarity",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"writing-01-explainer":{category:"writing",title:"Lay-audience explainer",
 objective:[["obj-1","250–400 words"],["obj-2","Prose only, one title"],["obj-3","Exactly one analogy"],["obj-4","Answers data-safety"]],
 subjective:[["sub-quality","Technical accuracy",0.4],["sub-craft","Warmth and flow",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"writing-02-registers":{category:"writing",title:"One message, three registers",
 objective:[["obj-1","3 sections present"],["obj-2","All 4 facts everywhere"],["obj-3","Summary ≤25 words"],["obj-4","No invented facts"]],
 subjective:[["sub-quality","Register fidelity",0.4],["sub-craft","Concision",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"planning-01-tradeoff":{category:"planning-reasoning",title:"Build vs buy decision memo",
 objective:[["obj-1","Matrix ≥4 weighted criteria"],["obj-2","One recommendation"],["obj-3","Risks for chosen option"],["obj-4","≤600 words, numbers used"]],
 subjective:[["sub-quality","Decision rigor",0.4],["sub-craft","Memo clarity",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"planning-02-estimate":{category:"planning-reasoning",title:"Fermi estimate",
 objective:[["obj-1","All 4 sections"],["obj-2","Arithmetic correct"],["obj-3","Result is a range"],["obj-4","Sensitivity named"]],
 subjective:[["sub-quality","Estimation judgment",0.4],["sub-craft","Transparency",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"creative-01-svg-poster":{category:"creative-visual",title:"Hand-coded SVG poster",
 objective:[["obj-1","Renders, viewBox 600×900"],["obj-2","Name/dates/venue text"],["obj-3","No external refs"],["obj-4","≤150 lines"]],
 subjective:[["sub-quality","Composition & atmosphere",0.4],["sub-craft","SVG craftsmanship",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"creative-02-css-scene":{category:"creative-visual",title:"Pure-CSS animated scene",
 objective:[["obj-1","No JS"],["obj-2","No images/external"],["obj-3","Has animation"],["obj-4","Single file renders"]],
 subjective:[["sub-quality","Scene readability & charm",0.4],["sub-craft","CSS technique",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"game-01-microgame":{category:"game-design",title:"One-file browser microgame",
 objective:[["obj-1","1 file, no external"],["obj-2","Score visible"],["obj-3","Fail state"],["obj-4","Restart w/o reload"],["obj-5","Controls explained"]],
 subjective:[["sub-quality","Fun & game feel",0.4],["sub-craft","Polish",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"game-02-card-ruleset":{category:"game-design",title:"Print-and-play card rules",
 objective:[["obj-1","All 5 sections"],["obj-2","Standard deck only"],["obj-3","Concrete example round"],["obj-4","≤800 words"]],
 subjective:[["sub-quality","Design depth",0.4],["sub-craft","Rules clarity",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"business-01-launch-plan":{category:"business-planning",title:"90-day launch plan",
 objective:[["obj-1","≥3 dated milestones"],["obj-2","Budget sums, ≤$15k"],["obj-3","≥3 numeric KPIs"],["obj-4","≤800 words"]],
 subjective:[["sub-quality","Realism",0.4],["sub-craft","Prioritization",0.3],["sub-reasoning","Reasoning quality",0.3]]},
"business-02-pricing":{category:"business-planning",title:"SaaS pricing proposal",
 objective:[["obj-1","3 tiers with fences"],["obj-2","Break-even correct"],["obj-3","Positioning vs both"],["obj-4","≤700 words"]],
 subjective:[["sub-quality","Strategic soundness",0.4],["sub-craft","Quantitative rigor",0.3],["sub-reasoning","Reasoning quality",0.3]]},
};
const COLORS=["#00e5ff","#ff4d97","#a3ff57","#ffb200","#b26bff","#ff6b4d","#4dc3ff","#ffe14d"];

/* ---------- data loading (defensive) ---------- */
const state={view:"combined",harness:"all",effort:"all",hidden:new Set()};
const $=s=>document.querySelector(s);

function loadRuns(){
  const out=[];const data=window.BENCH_DATA;
  if(!data||typeof data!=="object"||!data.runs||typeof data.runs!=="object"){
    console.warn("BENCH_DATA missing or malformed");return out;}
  for(const [id,run] of Object.entries(data.runs)){
    if(!run||typeof run!=="object"||!run.tests||typeof run.tests!=="object"){
      console.warn("skipping malformed run: "+id);continue;}
    const tests={};
    for(const [tid,t] of Object.entries(run.tests)){
      if(!TESTS[tid]){console.warn("unknown test "+tid+" in run "+id);continue;}
      if(!t||typeof t!=="object"){console.warn("bad entry "+tid+" in "+id);continue;}
      tests[tid]=t;
    }
    out.push({id,model:run.model||id,effort:run.effort||"unspecified",
      harness:run.harness||"unspecified",date:run.date||"",
      judgedBy:run.judgedBy||"?",tests});
  }
  return out;
}
const ALL_RUNS=loadRuns();
const label=r=>r.model+" ("+r.effort+" · "+r.harness+")";
const colorOf=id=>COLORS[ALL_RUNS.findIndex(r=>r.id===id)%COLORS.length];

function visibleRuns(){
  return ALL_RUNS.filter(r=>
    (state.harness==="all"||r.harness===state.harness)&&
    (state.effort==="all"||r.effort===state.effort));
}
function shownRuns(){return visibleRuns().filter(r=>!state.hidden.has(r.id));}

/* ---------- scoring (the ONLY place score math lives) ---------- */
function sectionScores(tid,t){
  const cfg=TESTS[tid];
  const ov=cfg.objective.map(o=>t.objective&&t.objective[o[0]])
    .filter(v=>typeof v==="number");
  const obj=ov.length?ov.reduce((a,b)=>a+b,0)/ov.length:null;
  let sw=0,ss=0;
  for(const [sid,,w] of cfg.subjective){
    const v=t.subjective&&t.subjective[sid];
    if(typeof v==="number"){ss+=v*w;sw+=w;}
  }
  return {obj,subj:sw?ss/sw:null};
}
function testScore(tid,t,view){
  if(t.integrity==="invalidated")return null;
  const {obj,subj}=sectionScores(tid,t);
  if(view==="objective")return obj;
  if(view==="subjective")return subj;
  if(obj==null)return subj;
  if(subj==null)return obj;
  return WEIGHTS.objective*obj+WEIGHTS.subjective*subj;
}
function categoryScore(run,cat,view){
  const vals=[];
  for(const [tid,t] of Object.entries(run.tests)){
    if(TESTS[tid].category!==cat)continue;
    const s=testScore(tid,t,view);
    if(s!=null)vals.push(s);
  }
  return vals.length
    ?{score:vals.reduce((a,b)=>a+b,0)/vals.length,n:vals.length}:null;
}

/* ---------- radar ---------- */
const SVGNS="http://www.w3.org/2000/svg";
function el(name,attrs,text){
  const e=document.createElementNS(SVGNS,name);
  for(const k in attrs)e.setAttribute(k,attrs[k]);
  if(text!=null)e.textContent=text;
  return e;
}
function renderRadar(){
  const svg=$("#radar");svg.innerHTML="";
  const runs=shownRuns();
  const cats=CATEGORIES.filter(c=>runs.some(r=>categoryScore(r,c.id,state.view)));
  if(!cats.length){
    svg.appendChild(el("text",{x:320,y:260,"text-anchor":"middle"},
      "No data yet — judge a run to populate this chart."));
    return;
  }
  const cx=320,cy=250,R=185,n=cats.length;
  const ang=i=>-Math.PI/2+i*2*Math.PI/n;
  const pt=(i,v)=>[cx+Math.cos(ang(i))*R*v/10,cy+Math.sin(ang(i))*R*v/10];
  for(let ring=2;ring<=10;ring+=2){
    const pts=cats.map((_,i)=>pt(i,ring).join(",")).join(" ");
    svg.appendChild(el("polygon",{points:pts,fill:"none",
      stroke:"var(--line)","stroke-width":ring===10?1.5:0.75}));
  }
  cats.forEach((c,i)=>{
    const [x,y]=pt(i,10);
    svg.appendChild(el("line",{x1:cx,y1:cy,x2:x,y2:y,
      stroke:"var(--line)","stroke-width":0.75}));
    const [lx,ly]=pt(i,11.6);
    const anchor=Math.abs(Math.cos(ang(i)))<0.3?"middle":
      (Math.cos(ang(i))>0?"start":"end");
    svg.appendChild(el("text",{x:lx,y:ly,"text-anchor":anchor,
      "dominant-baseline":"middle"},c.label));
  });
  runs.forEach(run=>{
    const color=colorOf(run.id);
    const vals=cats.map(c=>categoryScore(run,c.id,state.view));
    const pts=vals.map((v,i)=>pt(i,v?v.score:0));
    svg.appendChild(el("polygon",{
      points:pts.map(p=>p.join(",")).join(" "),
      fill:color,"fill-opacity":0.10,stroke:color,"stroke-width":2}));
    vals.forEach((v,i)=>{
      const [x,y]=pts[i];
      svg.appendChild(v
        ?el("circle",{cx:x,cy:y,r:4,fill:color})
        :el("circle",{cx:x,cy:y,r:4,fill:"var(--bg)",stroke:color,
            "stroke-dasharray":"2 2"}));  // gap marker: no data in category
    });
  });
}

/* ---------- legend + controls ---------- */
function renderLegend(){
  const box=$("#legend");box.innerHTML="";
  visibleRuns().forEach(run=>{
    const l=document.createElement("label");l.className="leg";
    const cb=document.createElement("input");cb.type="checkbox";
    cb.checked=!state.hidden.has(run.id);
    cb.addEventListener("change",()=>{
      cb.checked?state.hidden.delete(run.id):state.hidden.add(run.id);
      renderRadar();renderTables();
    });
    const sw=document.createElement("span");sw.className="swatch";
    sw.style.background=colorOf(run.id);
    l.append(cb,sw,document.createTextNode(label(run)));
    box.appendChild(l);
  });
}
function fillSelect(sel,values){
  sel.innerHTML="";
  const all=document.createElement("option");
  all.value="all";all.textContent="All";sel.appendChild(all);
  [...new Set(values)].sort().forEach(v=>{
    const o=document.createElement("option");
    o.value=v;o.textContent=v;sel.appendChild(o);
  });
}

/* ---------- tables ---------- */
function chip(v){
  if(v===10)return '<span class="pass">PASS</span>';
  if(v===0)return '<span class="fail">FAIL</span>';
  return '<span>–</span>';
}
function fmt(v){return v==null?"–":v.toFixed(1);}
function esc(s){return String(s).replace(/[&<>"]/g,
  c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

function renderTables(){
  const box=$("#tables");box.innerHTML="";
  const runs=shownRuns();
  for(const cat of CATEGORIES){
    const testIds=Object.keys(TESTS).filter(t=>TESTS[t].category===cat.id);
    const attempted=runs.filter(r=>testIds.some(t=>r.tests[t]));
    if(!attempted.length)continue;
    const h=document.createElement("h2");h.textContent=cat.label;
    box.appendChild(h);
    for(const r of attempted){
      const entries=testIds.filter(t=>r.tests[t]);
      const invalid=entries.filter(t=>
        r.tests[t].integrity==="invalidated").length;
      const div=document.createElement("div");div.className="coverage";
      div.textContent=label(r)+": "+entries.length+"/"+testIds.length
        +" tests run"+(invalid?", "+invalid+" invalidated":"");
      box.appendChild(div);
    }
    for(const tid of testIds){
      const withEntry=runs.filter(r=>r.tests[tid]);
      if(!withEntry.length)continue;
      const cfg=TESTS[tid];
      const tbl=document.createElement("table");
      const head='<tr><th class="run">'+esc(cfg.title)
        +' <span class="sub">('+tid+')</span></th>'
        +cfg.objective.map(o=>"<th>"+esc(o[1])+"</th>").join("")
        +cfg.subjective.map(s=>"<th>"+esc(s[1])+"</th>").join("")
        +"<th>Total</th><th>Note</th></tr>";
      const rows=withEntry.map(r=>{
        const t=r.tests[tid];
        const link='<a href="judgments/'+esc(r.id)+'/'+tid
          +'.md">full judgment</a>';
        if(t.integrity==="invalidated"){
          const span=cfg.objective.length+cfg.subjective.length+1;
          return '<tr class="invalidated"><td class="run">'+esc(label(r))
            +'</td><td class="note-cell" colspan="'+span+'">INVALIDATED — '
            +esc(t.integrityNote||"integrity violation")
            +'</td><td>'+link+'</td></tr>';
        }
        const flag=t.integrity==="flagged"
          ?' <span class="flag" title="'
            +esc(t.integrityNote||"integrity flag")+'">⚠</span>':'';
        return '<tr><td class="run">'+esc(label(r))+flag+'</td>'
          +cfg.objective.map(o=>'<td>'
            +chip(t.objective&&t.objective[o[0]])+'</td>').join("")
          +cfg.subjective.map(s=>'<td>'
            +fmt(typeof (t.subjective&&t.subjective[s[0]])==="number"
              ?t.subjective[s[0]]:null)+'</td>').join("")
          +'<td class="total">'+fmt(testScore(tid,t,state.view))+'</td>'
          +'<td><details><summary>note</summary>'+esc(t.note||"")
          +" — "+link+'</details></td></tr>';
      }).join("");
      tbl.innerHTML=head+rows;
      box.appendChild(tbl);
    }
  }
  if(!box.children.length)
    box.innerHTML='<div class="empty">No judged runs yet.</div>';
}

/* ---------- init ---------- */
function init(){
  $("#updated").textContent=
    window.BENCH_DATA&&window.BENCH_DATA.updated
      ?"updated "+window.BENCH_DATA.updated:"";
  fillSelect($("#harness"),ALL_RUNS.map(r=>r.harness));
  fillSelect($("#effort"),ALL_RUNS.map(r=>r.effort));
  $("#view").addEventListener("change",e=>{
    state.view=e.target.value;renderRadar();renderTables();});
  $("#harness").addEventListener("change",e=>{
    state.harness=e.target.value;renderLegend();renderRadar();renderTables();});
  $("#effort").addEventListener("change",e=>{
    state.effort=e.target.value;renderLegend();renderRadar();renderTables();});
  renderLegend();renderRadar();renderTables();
}
init();
</script>
</body>
</html>
````

- [ ] **Step 3: Verify config mirrors the rubrics**

For each of the 12 rubric files, check that the `TESTS` entry has the same criterion ids, the same number of objective checks (note `game-01-microgame` has 5), and subjective weights 0.4/0.3/0.3:

```bash
grep -c "id: obj-" rubrics/*.md
```

Expected: `5` for `game-01-microgame.md`, `4` for the other eleven.

- [ ] **Step 4: Verify the page renders with temporary sample data**

Temporarily replace the `runs: {}` in `report/data.js` with this sample (two runs; includes a flagged test, an invalidated test, and a partial-coverage category), then open `report/index.html` in a browser (use preview/browser tools if available, else ask the user to double-click it):

```js
runs: {
  "sample-a--high--claude-code": {
    model: "sample-a", effort: "high", harness: "claude-code",
    date: "2026-07-03", judgedBy: "tester", judgedOn: "2026-07-03",
    tests: {
      "coding-01-edge-cases": {
        objective: {"obj-1":10,"obj-2":10,"obj-3":0,"obj-4":10},
        subjective: {"sub-quality":7,"sub-craft":8,"sub-reasoning":6},
        note: "Good merge; adjacency missed."
      },
      "writing-01-explainer": {
        objective: {"obj-1":10,"obj-2":10,"obj-3":10,"obj-4":10},
        subjective: {"sub-quality":9,"sub-craft":8,"sub-reasoning":7},
        note: "Clear and warm.",
        integrity: "flagged",
        integrityNote: "REASONING.md organized around criterion names."
      }
    }
  },
  "sample-b--low--codex": {
    model: "sample-b", effort: "low", harness: "codex",
    date: "2026-07-03", judgedBy: "tester", judgedOn: "2026-07-03",
    tests: {
      "coding-01-edge-cases": {
        integrity: "invalidated",
        integrityNote: "Files read lists rubrics/coding-01-edge-cases.md."
      },
      "coding-02-refactor": {
        objective: {"obj-1":10,"obj-2":10,"obj-3":10,"obj-4":10},
        subjective: {"sub-quality":8,"sub-craft":7,"sub-reasoning":8},
        note: "Faithful refactor."
      },
      "game-02-card-ruleset": {
        objective: {"obj-1":10,"obj-2":10,"obj-3":0,"obj-4":10},
        subjective: {"sub-quality":6,"sub-craft":7,"sub-reasoning":5},
        note: "Example round too vague."
      }
    }
  }
}
```

Verification checklist (all must hold):
- Radar shows axes ONLY for coding, writing, game-design (no data in the other three).
- sample-b's writing axis point is a hollow dashed circle at center (gap marker), sample-a's game-design point likewise.
- View toggle changes totals for sample-a coding-01: objective-only = 7.5 ((10+10+0+10)/4), subjective-only = 7.0 (7×0.4 + 8×0.3 + 6×0.3), combined = 7.3 (0.5×7.5 + 0.5×7.0 = 7.25, displayed as 7.3).
- Legend checkbox hides/shows a run; harness filter `codex` leaves only sample-b; effort filter `high` leaves only sample-a.
- Coding table: sample-b's coding-01 row is struck through, says "INVALIDATED — Files read lists rubrics/...", and has no scores; coverage line reads "sample-b (low · codex): 2/2 tests run, 1 invalidated".
- sample-a's writing-01 row shows ⚠ with the note on hover, scores displayed normally.
- Category means exclude invalidated tests: sample-b's coding radar point sits at 8.85 combined — only coding-02 counts (objective 10, subjective 8×0.4 + 7×0.3 + 8×0.3 = 7.7, combined 0.5×10 + 0.5×7.7 = 8.85); the invalidated coding-01 does not drag it down.
- No console errors; malformed-entry warning path: add `"bogus-test": 5` to a run, reload, see a console warning and an otherwise intact page.

- [ ] **Step 5: Restore the empty scaffold**

Restore `report/data.js` to exactly the Step 1 content (empty `runs: {}`), reload the page, and confirm the "No data yet" radar message and "No judged runs yet." table placeholder both appear.

- [ ] **Step 6: Commit**

```bash
git add report/data.js report/index.html
git commit -m "Add self-contained report page and data.js scaffold"
```

---

### Task 11: Smoke run (exercise RUN.md)

**Files:**
- Create: `results/<smoke-run-id>/meta.json`, `results/<smoke-run-id>/coding-01-edge-cases/{solution.js,REASONING.md}`, `results/<smoke-run-id>/writing-02-registers/{rewrite.md,REASONING.md}`, `results/<smoke-run-id>/game-02-card-ruleset/{rules.md,REASONING.md}`

**Interfaces:**
- Consumes: RUN.md (Task 2), the three test files.
- Produces: a real run folder for Task 12 to judge. `<smoke-run-id>` = `<model>--<effort>--<harness>` derived from the executing session (e.g. `claude-fable-5--high--claude-code`); record whichever id was actually used for Task 12.

**IMPORTANT — contamination:** whoever executes this task must NOT have read `rubrics/` in their session. Under subagent-driven execution, dispatch a FRESH subagent whose prompt is only: *"In C:\Projects\model-benchmark, follow RUN.md as `<smoke-run-id>`, running exactly these tests: coding-01-edge-cases, writing-02-registers, game-02-card-ruleset. Set meta.json model/effort/harness from your own session context."* Under inline execution, the main session has authored the rubrics — note in each REASONING.md's `## Files read` that this is an author-contaminated smoke run so the judge flags it honestly rather than being deceived.

- [ ] **Step 1: Execute the run** (fresh subagent, prompt above)

- [ ] **Step 2: Verify the protocol was followed structurally**

```bash
ls results/*/meta.json results/*/coding-01-edge-cases results/*/writing-02-registers results/*/game-02-card-ruleset
node results/*/coding-01-edge-cases/solution.js
grep -l "## Files read" results/*/*/REASONING.md | wc -l
```

Expected: meta.json + three test folders with their deliverables; solution.js prints only PASS lines; grep count = 3. Also `git status` must show new files ONLY under `results/<smoke-run-id>/`.

- [ ] **Step 3: Commit** (committing before judging keeps the judge's write check sharp)

```bash
git add results
git commit -m "Add smoke run results"
```

---

### Task 12: Smoke judge + report verification (exercise JUDGE.md)

**Files:**
- Create: `report/judgments/<smoke-run-id>/{coding-01-edge-cases,writing-02-registers,game-02-card-ruleset}.md`
- Modify: `report/data.js`

**Interfaces:**
- Consumes: JUDGE.md (Task 3), the smoke run (Task 11), rubrics (Tasks 4–9), report page (Task 10).

- [ ] **Step 1: Judge the smoke run** — follow `JUDGE.md` exactly as written (integrity check first, then scores with written evidence, judgment files, data.js update). Do not shortcut: the point is to find where JUDGE.md is ambiguous or wrong. Note any friction.

- [ ] **Step 2: Verify the data.js entry parses and has the right shape**

```bash
node -e "const window={};eval(require('fs').readFileSync('report/data.js','utf8'));const rs=Object.keys(window.BENCH_DATA.runs);console.log(rs.length, Object.keys(window.BENCH_DATA.runs[rs[0]].tests).length);"
```

Expected: `1 3` (one run, three judged tests). Then confirm three judgment files exist: `ls report/judgments/*/`.

- [ ] **Step 3: Add a temporary hand-written second run** to `report/data.js` to exercise integrity rendering against real config — append this entry inside `runs`:

```js
"handwritten--low--none": {
  model: "handwritten", effort: "low", harness: "none",
  date: "2026-07-03", judgedBy: "manual", judgedOn: "2026-07-03",
  tests: {
    "coding-01-edge-cases": {
      objective: {"obj-1":10,"obj-2":0,"obj-3":0,"obj-4":10},
      subjective: {"sub-quality":4,"sub-craft":5,"sub-reasoning":3},
      note: "Weak edge-case handling.",
      integrity: "flagged",
      integrityNote: "Output mirrors rubric criterion order."
    },
    "writing-02-registers": {
      integrity: "invalidated",
      integrityNote: "Files read lists rubrics/writing-02-registers.md."
    }
  }
}
```

- [ ] **Step 4: Full report check in the browser** (open `report/index.html`):

- Radar shows exactly the coding, writing, game-design axes; two polygons.
- The handwritten run's game-design point is the hollow gap marker; its writing category contributes nothing (its only writing test is invalidated), so its writing point is also a gap marker.
- Coverage under Writing for the handwritten run reads "handwritten (low · none): 1/2 tests run, 1 invalidated" (writing has two tests; only one was attempted, and it was invalidated).
- The invalidated row is struck through with the note; the flagged row shows ⚠ with tooltip.
- View toggle, legend checkboxes, harness filter (`none` vs the smoke harness), and effort filter all rerender correctly.
- Judgment links on the smoke run's rows resolve to the files written in Step 1 (click one).
- Zero console errors.

- [ ] **Step 5: Remove the hand-written entry** (restore data.js to only the real smoke run), reload, confirm the page renders the single run cleanly.

- [ ] **Step 6: Fix any protocol friction found** — if JUDGE.md or RUN.md was ambiguous during Steps 1–4, edit the protocol file(s) now and note the change in the commit message.

- [ ] **Step 7: Commit**

```bash
git add report JUDGE.md RUN.md
git commit -m "Judge smoke run; verify report end to end"
```

---

### Task 13: Protocol read-through (zero-context check)

**Files:**
- Modify (only if gaps found): `README.md`, `RUN.md`, `JUDGE.md`

**Interfaces:**
- Consumes: everything. Final acceptance gate from the spec ("confirm RUN.md/JUDGE.md are self-contained for an agent with zero context of this conversation").

- [ ] **Step 1: Dispatch a fresh read-only subagent** with exactly this prompt: *"Read only README.md, RUN.md, and JUDGE.md in C:\Projects\model-benchmark. Answer: (1) As a model under test, what exact files would you create for a run named x--low--codex covering only coding-01-edge-cases, and what may you never read or write? (2) As a judge, what do you do before scoring, and what happens on hard vs soft integrity evidence? (3) Name anything ambiguous or contradictory."*

- [ ] **Step 2: Evaluate the answers** — (1) must list `results/x--low--codex/meta.json`, `results/x--low--codex/coding-01-edge-cases/solution.js` + `REASONING.md` with the four sections, and the rubrics/report/other-results prohibitions; (2) must describe the write/manifest/canary/alignment checks and invalidate-vs-flag outcomes. Fix any gap the subagent surfaces by editing the protocol files.

- [ ] **Step 3: Final spec sweep** — reread `docs/superpowers/specs/2026-07-03-model-benchmark-design.md` top to bottom; confirm each spec section maps to something built (layout, test format, rubric format, both protocols, cheating detection, data.js, report features, error-handling table rows). Fix anything missed.

- [ ] **Step 4: Commit (if anything changed)**

```bash
git add -A
git commit -m "Protocol read-through fixes"
```
