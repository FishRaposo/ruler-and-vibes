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
   writing any scores.    Optional fields (`suite`, `wall_time_min`,
   `approx_cost_usd`, `notes`, `consistency_pair`) should be copied into
   `report/data.js` when present so the report can show practical
   cost/time context. Per-test `timing.json` files are informational
   only — do not invent scores from them.
2. **Integrity — write check.** Run `git status` (and `git diff` where
   needed). Runner changes outside `results/<run-id>/` — especially to
   `rubrics/`, `tests/`, or `report/` — are HARD evidence against the
   affected tests. If several uncommitted runs make attribution unclear,
   report the stray writes to the user instead of invalidating
   (committing between runs keeps this check sharp).
3. **Integrity — transcript check.** The runner is expected to save
   `results/<run-id>/session-transcript.txt` (required by RUN.md). Audit it:
   - If the file exists and is a real transcript: search for any file path
     outside the allowlist mentioned in the transcript (e.g., `rubrics/`,
     `report/`, `docs/`, other runs). Any found → HARD evidence against
     affected tests.
   - Cross-reference the transcript's file opens against the runner's
     `## Files read` manifest in each `REASONING.md`. Files opened in
     the transcript but missing from the manifest → SOFT flag
     ("incomplete manifest"). Files claimed in the manifest but never
     opened in the transcript → SOFT flag ("inflated manifest").
   - If the transcript exists but shows the runner reading this JUDGE.md
     or any rubric file, all tests are INVALIDATED — the run is
     compromised.
   - If the transcript is **absent** or contains only a
     `transcript-unavailable: <reason>` stub, you cannot independently
     verify the `## Files read` manifest. Record the run as **SOFT
     flagged** ("no transcript — manifest unverifiable") and score normally.
     Do not upgrade to HARD on this basis alone; note it in the finish
     summary so the user can decide whether to re-run with a transcript.

## Per test in the run

3. Read the test file (`tests/*/<test-id>.md`), the deliverables,
   `REASONING.md`, and `rubrics/<test-id>.md` — some rubric checks
   reference facts or numbers defined only in the test file.
4. **Integrity check**, before scoring:
   - **Manifest:** the `## Files read` section lists anything outside
     `RUN.md`, `tests/`, the run's own `results/<run-id>/` folder, and
     skill folders (`.agents/skills/`, `.claude/skills/`) — including
     `rubrics/`, `report/`, other runs, and `docs/` (design docs quote
     the rubrics) → HARD.
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
   Every scored test also gets a `reasoning` object — the RUNNER's own
   REASONING.md faithfully condensed to one or two sentences per
   section (`approach`, `decisions`, `limitations`), in the model's own
   voice. Do NOT evaluate there — your judgment belongs in `comments`;
   `reasoning` is a faithful summary of what the model said about its
   own work, so the report can show both sides.

## Anti-bias rules

- Score strictly against the rubric. Judge the output, not the model's
  reputation or name.
- Don't let one criterion bleed into another — a beautiful deliverable
  with shallow reasoning gets a low `sub-reasoning`, and vice versa.
- Re-judging a run replaces its previous `data.js` entry and judgment
  files.

## Comment quality rules

Boilerplate comments produce a flat report that fails to distinguish
between models. Every comment and reasoning entry below must pass these
checks — if it doesn't, rewrite it.

### Subjective comments (`comments.sub-quality`, `.sub-craft`, `.sub-reasoning`)

- Every comment MUST name **one concrete, test-specific detail** from
  the deliverable — a specific variable name, a design choice, a phrase
  the runner used, a particular edge case they handled or missed.
- Generic descriptions like "reflects clarity and structure" or "scored
  from correctness" are not acceptable. The report page has no other
  way to show *why* a model got a 7 vs a 9 without your words.
- Bad: "Clear structure and easy to verify." (applies to any test)
- Good: "The deduction chain for logic-02 correctly resolves clue 7's
  amber-blue-violet adjacency before placing Dima, avoiding a dead end
  three runners walked into."
- Bad: "Solution quality reflects rubric compliance." (circular)
- Good: "Fixed the prototype pollution by rejecting `__proto__` keys;
  the fix is concrete and one-line, but missed that `constructor` also
  needs blocking — that's why it's an 8, not a 10."
- If a model passed all objective checks with a clean deliverable, say
  what specifically was clean about it. If a model failed checks, name
  which check and what the model did wrong instead.

### Reasoning summaries (`reasoning.decisions`, `reasoning.limitations`)

- `decisions` must QUOTE or closely paraphrase **one specific decision**
  the runner actually stated in their `REASONING.md`. Never use the
  placeholder "The runner describes applying the task constraints…"
- If the runner's `## Key decisions` section is missing or empty:
  `"Runner stated no key decisions."`
- `limitations` must name **a limitation the runner actually stated**
  in their `## Trade-offs and limitations` section. If the runner stated
  none: `"Runner stated no limitations."` Never invent one, and never
  use the escape hatch "Limitations are only those explicitly present…"

### Before you write each data.js entry

Ask yourself: "Could this comment apply verbatim to a different test or
a different model?" If yes, rewrite it until the answer is no.

### Calibration check (after every 5 tests)

Look at the subjective scores you've given so far. Are they all within
2 points of each other (e.g., all 7–9)? A flat distribution means you
are not differentiating. Push harder: an output that is noticeably
worse than another should get a noticeably different score. Re-score
any batch whose scores span less than 3 points.

### Anti-duplicate scan (before writing data.js)

Read through your completed `tests` block. If any two tests share
identical comment text for the same criterion, re-judge one of them —
the comments must be unique to be meaningful. Run
`node tools/validate.js` when you finish to check this mechanically.

## When you finish

Summarize per run: tests judged, soft flags, and any INVALIDATED tests —
list those explicitly so the user can decide whether to re-run them. A
re-run replaces the invalidated entry.

## After judging: second-pass review (recommended)

Your judgments are one model's perspective. For stronger reliability,
have a different model follow `REVIEW.md` to corroborate or correct
your subjective scores. The reviewer only re-examines subjective
criteria — objective checks are mechanical and don't need a second pass.
Run `node tools/validate.js` after the review to check for structural
errors and boilerplate in review comments.

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
      },
      reasoning: {  // the runner's own words, condensed — no judging here
        approach: "Sorted the ranges, then merged in a single pass.",
        decisions: "Chose to throw on malformed entries to surface bad data.",
        limitations: "Acknowledges adjacency handling was not considered."
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
