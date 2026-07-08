# REVIEW.md — Second-pass subjective review protocol

You are a second reviewer. You are NOT re-judging the run from scratch.
Your job is narrower: read the primary judge's work and either
corroborate it with specific evidence or correct it with specific
evidence.

## Why this exists

A single judge model produces a single perspective. The same run judged
by different models gets different subjective scores. A second pass from
a different model provides something close to inter-rater reliability
without doubling the full judging cost — you only review subjective
criteria, not the objective checks (which are mechanical).

## Inputs

- Runs to review: the user names them, or default to every folder under
  `results/` where `report/judgments/<run-id>/` exists.
- Your model name and today's date. Ask the user if you cannot determine
  them from your session context.

Not all runs need review. A run with boilerplate-heavy judgments (run
`node tools/validate.js` to check) benefits most from this protocol.

## Per run

1. Read `results/<run-id>/meta.json` to confirm the run's metadata.
2. Read `report/judgments/<run-id>/` — you need the primary judge's
   scores and comments, not just `data.js`. The judgment markdown files
   contain the judge's full reasoning.

## Per test in the run

3. Read the test file (`tests/*/<test-id>.md`), the deliverables,
   `REASONING.md`, `rubrics/<test-id>.md`, and the primary judgment file
   (`report/judgments/<run-id>/<test-id>.md`).
4. For **each subjective criterion** in the rubric (usually 3: the named
   quality criterion, the named craft criterion, and Reasoning quality):
   - Read the primary judge's score and comment for this criterion.
   - **Examine the deliverable yourself.** Do not trust the primary judge
     blindly. Read the runner's output, their code, their REASONING.md.
   - Decide: **AGREE** or **DISAGREE** with the primary judge's score.

### When you AGREE

- Your comment must state **what specific evidence in the deliverable
  supports the score.** Do not repeat the primary judge's words — find
  your own evidence, or explicitly note that the primary judge's
  evidence is correct and add one more detail they missed.
- Bad: "Agree with 8 — the reasoning quality is solid." (generic)
- Good: "Agree with 8 — the runner correctly identified the nested
  quantifier pattern in snippet C but their deduction chain for the
  logic puzzle skipped from clue 3 directly to clue 7 without
  establishing clue 5's placement first. That gap justifies an 8 rather
  than a 9 or 10."

### When you DISAGREE

- Give your own score (0–10).
- Explain **why the primary judge's score is wrong** using concrete
  evidence from the deliverable. Your disagreement must name a specific
  thing the primary judge overlooked, over-weighted, or misinterpreted.
- Bad: "Disagree — I'd give a 6. It's not that good." (no evidence)
- Good: "Disagree — the judge gave a 9 but missed that the 'one-line
  fix' for snippet E changes `innerHTML` to `innerText`, which strips
  legitimate HTML formatting the spec said to preserve. The
  textContent-based fix the rubric expects is different. That's a
  meaningful error. I'd give a 6."

### Scoring discipline

- Your scores use the same 0–10 scale as the primary judge.
- Your comments must name a concrete, test-specific detail — the same
  standard as the primary judge's comment quality rules in JUDGE.md.
- Never use boilerplate. "Agree with the score" without evidence is a
  failed review. The whole point of a second pass is independent
  corroboration.
- The anti-duplicate rule applies: if two tests in the same run have
  identical review comments, re-write one.

5. Write the review to `report/reviews/<run-id>/<test-id>.md` using the
   template at the bottom of this file.
6. Update `report/data.js`: add `reviewedBy` and `reviewedOn` at the
   run level, and add a `reviews` object inside each test entry (format
   below).

## data.js format — reviews field

Inside each test entry in `runs["<run-id>"].tests["<test-id>"]`, add:

```js
reviews: {
  "sub-quality": {
    verdict: "agree",
    comment: "Evidence supporting the primary judge's sub-quality score of 8."
  },
  "sub-craft": {
    verdict: "disagree",
    score: 6,
    comment: "Why the primary judge was wrong about sub-craft."
  },
  "sub-reasoning": {
    verdict: "agree",
    comment: "Evidence supporting the primary judge's sub-reasoning score."
  }
}
```

Key rules:
- `verdict` is always `"agree"` or `"disagree"`.
- `comment` is always present, always specific.
- `score` is present **only** when `verdict` is `"disagree"` — it's
  the reviewer's score for this criterion.
- When `verdict` is `"agree"`, do NOT include a `score` field — the
  report uses the primary judge's score.
- Include every subjective criterion from the rubric — no partial
  reviews.

## Run-level fields in data.js

Add at the top of the run entry (same level as `model`, `judgedBy`):

```js
reviewedBy: "claude-fable-5",
reviewedOn: "2026-07-08",
```

## Review file template

```markdown
# <test-id> — review of <run-id>

**Primary judge:** <judge model> on <judged date>
**Reviewed by:** <reviewer model> on <YYYY-MM-DD>

## sub-quality (<criterion name>) — primary score: <n>/10

**Verdict:** AGREE | DISAGREE
**<if disagree: Reviewer score: n/10>**

<Evidence — concrete, test-specific>

## sub-craft (<criterion name>) — primary score: <n>/10

**Verdict:** AGREE | DISAGREE
**<if disagree: Reviewer score: n/10>**

<Evidence>

## sub-reasoning (Reasoning quality) — primary score: <n>/10

**Verdict:** AGREE | DISAGREE
**<if disagree: Reviewer score: n/10>**

<Evidence>

## Summary

Agreed on X/3 criteria. <If any disagreements:> Disagreed on <criteria
names>. The primary discrepancies are: <one sentence per disagreement,
summarizing the evidence gap>.
```

## When you finish

- Run `node tools/validate.js` to check for structural errors or
  boilerplate in your review comments.
- Summarize per run: tests reviewed, agreements/disagreements per test,
  overall agreement rate (agreed criteria / total criteria reviewed).
- The agreement rate is a signal, not a score — a high rate means the
  primary judge was thorough; a low rate means the primary judge missed
  things or was systematically biased.
