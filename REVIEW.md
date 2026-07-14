# REVIEW.md — Independent subjective review protocol

You are a second reviewer. Independently score every subjective criterion
before comparing your score with the primary judge. Review subjective evidence
only; objective checks remain mechanical.

## Why this exists

A second judge supplies real inter-rater evidence. The benchmark preserves both
scores, reports agreement statistics, and sends material disagreements to
adjudication. A reviewer score never replaces or averages the primary score.

## Inputs

- Review the runs named by the user, or every run with primary judgments.
- Record the reviewer model and date.
- Read `results/<run-id>/meta.json`, the test, deliverables, `REASONING.md`, and
  rubric. Use `report/judgments/<run-id>/<test-id>.md` only after recording your
  independent criterion score.

## Per criterion

For every subjective criterion, including Worklog quality (`sub-reasoning`):

1. Examine the deliverable and rubric without reading the primary conclusion.
2. Record an independent score from 0–10 and concrete, test-specific evidence.
3. Read the primary score and evidence and compare the two trails.
4. Use `agree` when your score is within one point of the primary.
5. Use `disagree` only when your score differs by at least two points and your
   comment identifies the overlooked, over-weighted, or misinterpreted evidence.

Do not manufacture a disagreement over a harmless one-point calibration
preference. Do not use generic comments. If two tests in a run have identical
review comments, rewrite one.

## Storage

Write the narrative review to
`report/reviews/<run-id>/<test-id>.md`. Add `reviewedBy` and `reviewedOn` to the
run and a complete `reviews` object to the test in `report/data.js`:

```js
reviews: {
  "sub-quality": {
    verdict: "agree",
    score: 8,
    comment: "Concrete evidence supporting the same calibration band."
  },
  "sub-craft": {
    verdict: "disagree",
    score: 6,
    comment: "Concrete evidence the primary judge missed."
  },
  "sub-reasoning": {
    verdict: "agree",
    score: 7,
    comment: "Concrete evidence from REASONING.md."
  }
}
```

Every verdict includes the reviewer’s independent score. The report uses these
values only for auditability and primary-versus-reviewer reliability. Effective
score precedence remains adjudication, then primary.

A non-reasoning disagreement makes ability and combined results provisional. A
reasoning-only disagreement makes only Worklog quality provisional. Direct the
next evaluator to `ADJUDICATE.md` for every unresolved disagreement.

Run-level fields:

```js
reviewedBy: "reviewer-model",
reviewedOn: "2026-07-10",
```

## Review file template

```markdown
# <test-id> — review of <run-id>

**Primary judge:** <model> on <date>
**Reviewed by:** <model> on <YYYY-MM-DD>

## <criterion-id> (<criterion name>) — primary score: <n>/10

**Verdict:** AGREE | DISAGREE
**Reviewer score:** <n>/10

<Concrete, test-specific evidence>

## Summary

Agreed on X/Y criteria. List every disagreement and its evidence gap.
```

## Completion

Run `node tools/validate.js`. Report tests reviewed, agreement rate, and all
unresolved disagreements. Agreement is a reliability signal, not a score.
