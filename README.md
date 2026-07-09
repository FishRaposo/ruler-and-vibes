# Ruler & Vibes

**Ruler & Vibes** is a **zero-infrastructure, personal model-chooser
kit** — not an official public leaderboard. There is **no maintained
ranking** of models in this repo; you run models yourself, judge the
outputs, and keep scores locally (or publish your own runs).

Every rubric mixes objective checks (**the ruler**) with judged criteria
(**the vibes**). The bank spans **40 categories** and **759 test forms**
(most facets ship three parallel forms a/b/c — see `AUTHOR.md`), on an
easy→hard ladder across reasoning, software, language, analysis &
judgment, planning, creative work, agentic coding, ops, support, safety,
and more. Everything is markdown plus one self-contained HTML report.
No APIs, no build step. Optional tools under `tools/` validate structure
and canaries.

**License:** MIT (see `LICENSE`).

**Breadth tiers** (nested; see `TIERS.md` / `tiers.json`):

```
Core (34)  ⊂  Extended (123)  ⊂  Full (759 forms)
 snapshot      serious map       item bank + parallels
```

**Default for personal model-picking: Core.** Use Extended when the
decision is expensive; Full and parallel forms (b/c) for reliability
studies, not a first look. Incomplete Core or Extended runs are
**provisional** — do not treat partial radars as finished overall
scores. Parallel forms never join Core/Extended. **Day suites**
(`coding-day`, `agent-day`, `writing-comms`, `analyst`, `product-day`,
`safety-day`, `ops-day`, `support-day`, `copy-day`, `critical-day`) are
orthogonal workflow pickers — not tiers. Arbitrary subsets also work
(see RUN.md).

## How it works

1. **Run.** Open any agent CLI in this repo with the model you want to
   test and say: *"Follow RUN.md as `<run-id>` for suite Core"* (or
   Extended / a day suite — see RUN.md). The model writes outputs to
   `results/<run-id>/`.
2. **Judge.** In a separate session — ideally with the strongest model
   available — say: *"Follow JUDGE.md"*. The judge scores every run
   against the rubrics and updates `report/data.js`.
3. **View.** Double-click `report/index.html`: radar chart, score tables,
   integrity badges. Prefer the suite filter **core** for overall
   snapshots; incomplete tiers show a **PROVISIONAL** banner.

**Fast mode.** For iterative model comparison, set the **View** dropdown to
**Objective only** — it scores just the mechanically-verifiable checks
(`node`/`wc -w`/recompute), skipping the subjective half entirely. This is
judge-cheap and good enough to rank models on correctness without a full
subjective pass. Toggle **Category weight** to *Weighted (÷ facet count)*
so small categories don't dominate the radar.

A **run** = model + reasoning effort + harness, because the same model can
score differently at different efforts or in different harnesses.
Optional `meta.json` fields (`suite`, `wall_time_min`, `approx_cost_usd`,
`notes`) help personal “daily driver” choices beyond raw scores.

## Layout

```
TIERS.md / tiers.json           breadth ladder Core ⊂ Extended ⊂ Full
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
- Parallel forms (ids like `story-01b-…`, see `AUTHOR.md`) collapse to
  their facet's **median** — n distinct forms = n runs of one construct
  (target n per facet: `RUNS_TARGET` in `report/index.html`, default 3).
- Category = mean of attempted facets only; coverage is shown honestly
  (e.g. "1/2 tests run", or "1/4 facets run (2 runs incl. parallel
  forms)"). Incomplete **Core** or **Extended** runs are marked
  **provisional** — do not read a partial tier radar as a finished
  general map (Core ⊂ Extended ⊂ Full). The report can show combined,
  objective-only, or subjective-only views.

## Cheating detection (best-effort)

Tiered. **Hard evidence** — a rubric canary phrase leaking into output,
forbidden paths confessed in the run's `## Files read` manifest, or writes
outside the run's folder — invalidates the test (re-run at your
discretion). **Soft evidence** — output suspiciously shaped like the
rubric — flags it with a ⚠ badge but scores normally.

**Known limits:** a careful cheater who reads a rubric, paraphrases, and
lies in its manifest evades all of this. Design docs under `docs/` quote
the rubrics, so the protocols treat reading anything outside `tests/`
and the run's own results folder as a violation. This kit stays
**zero-infra by design** — integrity is protocol + skills + canaries +
optional session transcript for the judge, not harness-specific deny
rules (those need extra setup per agent and are out of scope here).
Saving `results/<run-id>/session-transcript.txt` when the harness can
capture it is the main optional upgrade.

## Skills (optional, recommended)

Three agent skills ship with the repo under `.agents/skills/` (the
cross-harness Agent Skills layout):

- **running-the-benchmark** — runner role: open `RUN.md` first; enforce
  the reading allowlist (no README/JUDGE/rubrics/tiers); suite choice
  (prefer Core for personal picks); meta.json + REASONING discipline.
- **judging-benchmark-results** — judge role: open `JUDGE.md` first;
  score blind on re-judge; execute objective checks; finish judgments +
  `data.js` + `validate.js`; note provisional Core/Extended coverage.
- **generating-parallel-tests** — author role only: open `AUTHOR.md`
  first; key-before-prose; both-direction verify; canary-audit; parallels
  stay Full-only (never Core/Extended); independent review gate.

**Install:**

- **Harnesses that support Agent Skills** (`.agents/skills/` project
  discovery): nothing to do when working inside this repo.
- **Claude Code:** recent versions discover `.agents/skills/`
  automatically; if yours doesn't, copy into the Claude layout —
  project: `cp -r .agents/skills/* .claude/skills/`, or global:
  `cp -r .agents/skills/running-the-benchmark ~/.claude/skills/`.
- **Anything else:** paste the relevant SKILL.md body into the
  session's context before starting; the protocols also work bare
  (RUN.md / JUDGE.md are self-contained), the skills just make role
  hygiene automatic.

Skill files are on the runner's reading allowlist; never put scoring
information in them.

## Health checks (optional)

From the repo root:

```
node tools/validate.js              # structure, tiers, data.js, orphans
node tools/canary-audit.js          # canary uniqueness + leak invariant
node tools/sync-tiers-to-report.js  # after editing tiers.json
```

Map design notes (gap-closure roster): see
`docs/superpowers/specs/2026-07-09-gap-closure-roster.md` and `TIERS.md`.

## Contributing

See `CONTRIBUTING.md`. Short version: keep runner/judge/author roles
separate, run `node tools/validate.js` and `node tools/canary-audit.js`
before PRs, and prefer Extended over Core inflation for new depth.

## Adding a test

1. Add `tests/<category>/<test-id>.md` (frontmatter: id, category, title,
   deliverables; body: Task / Deliverables / Constraints).
2. Add `rubrics/<test-id>.md` with a fresh unique canary phrase —
   consult and update the canary registry in
   `docs/superpowers/specs/2026-07-04-canary-registry.md` first.
3. Mirror the criteria in the `TESTS` config block at the top of the
   script in `report/index.html`.

House-style note: several tests deliberately reuse trap motifs (a
superseded item that must be excluded, a decoy that must NOT be
flagged, a stated total contradicting its own components). When adding
tests, vary or invert these motifs occasionally so a kit-aware model
can't game the pattern.

To add a *parallel form* of an existing test (same construct, fresh
surface — used for multi-run evaluation of a single facet), follow
`AUTHOR.md` instead: it covers the form-id convention (`story-01b-…`),
the equivalence contract, canary minting (`node tools/canary-audit.js`
verifies), and the independent review gate.
