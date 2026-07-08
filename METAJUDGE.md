# METAJUDGE.md — Cross-run consistency audit

You are a meta-evaluator. You do not judge individual tests. You look
for patterns of inconsistency across an entire judged run that suggest
judge error, even when primary judge and reviewer agreed.

## Why this exists

A single judge can make systematic mistakes. A reviewer can miss them.
Two people agreeing on a wrong answer doesn't make it right. The
metajudge looks at patterns: scores that don't match the objective
evidence, justifications that contradict the output, and inconsistencies
between tests that should logically produce related scores.

## Inputs

- A judged (and optionally reviewed) run. The user names the run or you
  default to every folder under `results/` that has `report/judgments/`
  entries.
- Your model name and today's date.

## What you examine

### 1. Objective-subjective asymmetry

For each test in the run, look at the objective score vs the subjective
scores. A model that failed 3/5 objective checks but got 9/10 on
solution quality? That's a red flag. The judge may be anchoring on the
model's reputation rather than the output.

Flag any test where:
- Objective average ≤ 6 AND any subjective criterion ≥ 8
- Objective average ≥ 8 AND any subjective criterion ≤ 3
- The judge's verdict note (in the judgment.md) contradicts the scores

### 2. Across-criterion contradictions

For each test, compare the three subjective scores against each other.
Common inconsistency patterns:
- `sub-quality` = 9 but `sub-reasoning` = 3: the model produced a great
  output but couldn't explain how? Possible, but unusual.
- All three subjective scores are identical across many tests (e.g.,
  9/9/8 everywhere): the judge is not differentiating.
- Scores are in lockstep (9-9-8, then 8-8-7, then 7-7-6): the judge
  is using a single overall impression and distributing across
  criteria mechanically.

### 3. Within-category consistency

Look at tests in the same category. If `data-02-decision-metrics` got
9/9/8 but `data-03-segment-paradox` (same category, similar difficulty)
got 7/7/8, check whether the gap is justified by the actual output.
Category-adjacent tests should have correlated but not identical scores.
A model that aces one test in a category shouldn't bomb the next one
without a clear reason visible in the output.

### 4. Between-model ranking inversion

If runs for multiple models exist, check whether the subjective ranking
between models inverts across tests in the same category in ways that
contradict the objective evidence. Example: model A outscores model B
on 4/5 objective checks for a test, but model B gets a higher subjective
score. The judge may be biased.

### 5. Reviewer agreement pattern

If reviews exist, look at the pattern of disagreements:
- All disagreements in one direction (reviewer always scores lower):
  the reviewer may be systematically harsher, not actually disagreeing
  with specific evidence.
- No disagreements at all on a run with boilerplate primary judgments:
  the reviewer rubber-stamped without reading.
- Disagreements cluster in one category: the primary judge may have
  misunderstood that category's rubric.

## Deliverable

Write your findings to `report/metajudgments/<run-id>.md`.

Template:

```markdown
# Metajudgment — <run-id>

**Primary judge:** <model>
**Reviewer:** <model> (if applicable)
**Metajudged by:** <your model> on <YYYY-MM-DD>

## Summary

<One paragraph: overall confidence in this run's scores. High/medium/low
with specific reasoning.>

## Red flags found

<Number of flags. If 0: "No pattern-level red flags detected.">

<For each flag:>
- **<test-id>**: <what the pattern is and why it's suspicious. Cite
  specific scores and evidence from the output/judgment.>

## Recommendations

- <Any tests that should be re-judged, with specific instructions for
  the re-judge session.>
- <Any systematic bias the judge should correct in future runs.>
```

## When you finish

Update `report/data.js`: add `metajudgedBy` and `metajudgedOn` at the
run level.

Run `node tools/validate.js` — the flag count and metajudgment fields
are audited.
