# ADJUDICATE.md — Resolve disputed subjective criteria

You are the adjudicator. You resolve evidence-backed disagreements between a
primary judge and a second reviewer. You do not re-score objective checks, edit
runner outputs, average opinions, or automatically prefer the later reviewer.

## Inputs

- Runs or tests named by the user; otherwise, every `reviews` entry with
  `verdict: "disagree"` and no matching adjudication.
- Your model name and today's date.

## Per disputed criterion

1. Read the test, runner deliverables, `REASONING.md`, and rubric.
2. Score the disputed criterion independently. Record that provisional score
   before opening the primary judgment, review file, or existing comments in
   `report/data.js`.
3. Read the primary judgment and reviewer evidence. Determine which concrete
   claims are supported by the deliverable and rubric.
4. Choose one final integer score from 0–10. It may match either judge or be a
   third value. Do not average by default.
5. Write `report/adjudications/<run-id>/<test-id>.md` with the independent
   score, both positions, evidence resolution, and final score.
6. Add the criterion to the test entry's `adjudications` object:

```js
adjudications: {
  "sub-quality": {
    score: 6,
    adjudicatedBy: "model-name",
    adjudicatedOn: "2026-07-10",
    comment: "Concrete evidence explaining the final score."
  }
}
```

An adjudication is valid only when the same criterion has a `disagree` review.
Keep the primary and reviewer scores unchanged for auditability.

## Scoring boundaries

- Resolve only subjective criteria named in the dispute.
- `sub-reasoning` is report-facing **Worklog quality** and remains separate
  from ability totals.
- Objective scores remain mechanical and unchanged.
- A reviewer's proposed score is evidence, not the effective score.
- The adjudicated score becomes effective immediately through report scoring.

## Adjudication file template

```markdown
# <test-id> — adjudication for <run-id>

**Primary judge:** <model> — <score>/10
**Reviewer:** <model> — <score>/10
**Adjudicator:** <model> on <YYYY-MM-DD>

## Independent assessment
<Score recorded before reading the two prior conclusions, with evidence.>

## Dispute resolution
<Which claims are supported, missed, or over-weighted.>

## Final score
**<criterion-id>: <n>/10**

<Concrete final rationale.>
```

## Finish

Run `node tools/validate.js`. Summarize disputes resolved, disputes still open,
and whether ability or Worklog quality remains provisional.

