# Ruler & Vibes

**Ruler & Vibes** is a zero-infrastructure benchmark kit for comparing AI
models — every rubric mixes objective checks (the ruler) with judged
criteria (the vibes). It spans six categories:
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
lies in its manifest evades all of this. Design docs under `docs/` quote
the rubrics, so the protocols treat reading anything outside `tests/`
and the run's own results folder as a violation. Optional hardening if you want
it: deny rubric reads at the harness level for run sessions (e.g. Claude
Code permission deny rules), or save the run session's transcript and
give it to the judge to audit.

## Adding a test

1. Add `tests/<category>/<test-id>.md` (frontmatter: id, category, title,
   deliverables; body: Task / Deliverables / Constraints).
2. Add `rubrics/<test-id>.md` with a fresh unique canary phrase.
3. Mirror the criteria in the `TESTS` config block at the top of the
   script in `report/index.html`.
