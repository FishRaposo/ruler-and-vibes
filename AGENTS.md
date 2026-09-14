# AGENTS.md — agent orientation for Ruler & Vibes

This repository is a **zero-infrastructure personal model benchmark and chooser kit**.
You run models yourself, judge their outputs, and keep or publish your own results.
It is not an official public leaderboard and has no hosted service, API, or build step.

## Self-sufficiency

Everything needed to operate the kit lives in this repo:

- **Run** a benchmark session — follow `RUN.md`
- **Judge** completed runs — follow `JUDGE.md`
- **Review / adjudicate** when useful — `REVIEW.md`, `ADJUDICATE.md`
- **View results** — open `report/index.html` after judging writes `report/data.js`

Career-hub may nest a clone of this repo for portfolio context. That nesting does
not change how the kit works: agents should run and judge from **this checkout**,
using the protocols and files here. Do not depend on career-hub scripts or paths.

## Operating docs (read these first)

| Doc | Role |
| --- | --- |
| `README.md` | Overview, layout, scoring model, health checks |
| `RUN.md` | Protocol for the model under test |
| `JUDGE.md` | Protocol for the evaluator model |
| `AUTHOR.md` | Minting parallel test forms (evaluator-only) |
| `CONTRIBUTING.md` | Adding tests and repo conventions |

Project skills under `.agents/skills/` mirror the run, judge, review, and
adjudicate flows. Runners must not read evaluator protocols, rubrics, or design docs.

## Git discipline

- Commit benchmark work **in this repository** (runs under `results/`, judgments
  under `report/`, doc and kit changes on branches as usual).
- Commit between runs when possible so integrity checks stay sharp (`JUDGE.md`).
- No requirement to invoke career-hub or external orchestration to use the kit.

## What not to assume

- Do not invent benchmark scores, leaderboard ranks, or claims about model performance
  that are not present in this repo's `results/` and `report/data.js`.
- Do not treat README tier counts, suite lists, or coverage as authoritative without
  checking generated config (`benchmark.json`, `tiers.json`, `node tools/validate.js`).
- When unsure, read the linked protocol and follow it literally rather than improvising.
