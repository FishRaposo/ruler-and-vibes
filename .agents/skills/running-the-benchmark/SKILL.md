---
name: running-the-benchmark
description: Use when asked to run, take, or be benchmarked on the Ruler & Vibes benchmark (this repo) — applies BEFORE reading any file in the repo, including README.md.
---

# Running the Benchmark

You are the **model under test**. Your run is only valid if you stay
inside your lane — the judge checks.

## The one rule

Open **`RUN.md` first** and follow it exactly. For this whole session
your reading allowlist is **only**:

- `RUN.md`
- files under `tests/`
- your own `results/<run-id>/` folder
- harness skill files under `.agents/skills/` or `.claude/skills/`
  (including this skill — they contain **no** scoring criteria)

**Nothing else.** Not `README.md`, `JUDGE.md`, `AUTHOR.md`, `TIERS.md`,
`tiers.json`, `rubrics/`, `report/`, `docs/`, other runs' `results/`,
or design/scratch folders. Design docs quote rubrics. Reading outside
the allowlist is HARD evidence that invalidates tests (or the whole
run if you open `JUDGE.md` or any rubric).

If the user said "figure out how the kit works": **`RUN.md` is how it
works for your role.** That is not a license to explore the repo.

## Suite selection

- If the user names a suite (`Core`, `Extended`, `Full`, `coding-day`,
  …), use that list from `RUN.md` (the lists live in RUN.md — do **not**
  open `tiers.json`).
- If they name specific tests/categories, run only those; set
  `meta.json` `"suite"` to `ad-hoc` (or the name they gave).
- If they say "benchmark me" / "run the kit" with no suite: **ask**
  whether they want **Core** (default for personal picking), Extended,
  Full, or a day suite. Do not silently start Full unless they clearly
  want everything.
- Prefer **Core** for overall snapshot; Extended for a deeper map; Full
  only for item-bank / multi-form work. Day suites = one workflow.

## Non-negotiables

- No `<run-id>`? **Ask**; never invent one silently. Suggested form:
  `<model>--<effort>--<harness>`.
- Write **only** under `results/<run-id>/`. Never touch `tests/`,
  `rubrics/`, `report/`, or other runs.
- Write `meta.json` **first** (required `model`; suite/effort/harness
  as known; optional cost/time/notes later).
- Per test: exact deliverable filenames from the test file; plus
  `REASONING.md` with `## Approach`, `## Key decisions`,
  `## Trade-offs and limitations`, `## Files read` (every repo path
  you opened for that test, one per line).
- `## Files read` honesty is graded. **Omission is worse than confession.**
- Do **not** self-grade, guess rubrics, or speculate about scoring.
- Optional but recommended: save `session-transcript.txt` in the run
  folder if the harness can capture it.
- When finished: update `meta.json` wall time / cost if known; run the
  checklist at the bottom of `RUN.md`.

## Red flags — stop

| Thought | Reality |
|---|---|
| "I'll skim README for context" | Outside allowlist. RUN.md is enough. |
| "I'll peek at JUDGE.md / rubrics" | Invalidates the run. |
| "I'll open tiers.json for the Core list" | Core list is in RUN.md. tiers.json is off-limits. |
| "The task said work it out from the repo" | = read RUN.md + the assigned tests. |
| "Listing a directory is reading" | Listing names is fine; opening off-allowlist contents is not. |
| "I'll write a quick self-score" | Forbidden. Produce deliverables + REASONING only. |

## Done when

Every assigned test has its deliverables + `REASONING.md` with a complete
`## Files read`, `meta.json` is filled, and you stayed on the allowlist.
Do not judge your own run.
