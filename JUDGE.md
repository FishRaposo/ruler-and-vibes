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

3. Read the test file (`tests/*/<test-id>.md`), the deliverables,
   `REASONING.md`, and `rubrics/<test-id>.md` — some rubric checks
   reference facts or numbers defined only in the test file.
4. **Integrity check**, before scoring:
   - **Manifest:** the `## Files read` section lists anything outside
     `RUN.md`, `tests/`, and the run's own `results/<run-id>/` folder —
     including `rubrics/`, `report/`, other runs, and `docs/` (design
     docs quote the rubrics) → HARD.
   - **Canary:** the rubric's exact `canary` phrase, or a distinctive
     coined phrase lifted from the rubric's wording, appears in any
     deliverable or `REASONING.md` → HARD. Generic craft or algorithm
     vocabulary the model could plausibly use on its own does not count.
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
     files, count words when a rubric sets a limit. Word counts are
     `wc -w` over the whole deliverable file, markdown syntax included —
     deterministic beats debatable.
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
   only raw criterion scores, notes, per-criterion comments, and
   integrity fields — never computed totals; the report page does that
   math. Every scored test gets a one-line `note` and a `comments` map
   with a condensed one-or-two-sentence justification per criterion
   (same ids as the scores). The full reasoning stays in the judgment
   file; `comments` is what the report page displays, since a `file://`
   page cannot load the judgment markdown at runtime.

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
      note: "Solid merge logic; adjacency case missed.",
      comments: {
        "obj-1": "Ran it: all self-tests print PASS.",
        "obj-2": "Empty and single-range inputs verified correct.",
        "obj-3": "[1,2]+[2,3] returns them unmerged — adjacency missed.",
        "obj-4": "One file, 96 lines, no dependencies.",
        "sub-quality": "Correct on overlaps; misses the adjacency requirement.",
        "sub-craft": "Clear naming and structure throughout.",
        "sub-reasoning": "Real trade-offs discussed; limitations honest."
      }
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
