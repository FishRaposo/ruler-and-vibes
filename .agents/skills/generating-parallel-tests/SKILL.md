---
name: generating-parallel-tests
description: Use when asked to generate, mint, or author additional parallel test forms for the Ruler & Vibes benchmark (this repo) — e.g. to run more than 3 runs on a facet, or to replace a form a model has already seen.
---

# Generating Parallel Tests

You are on the **evaluator / author** side, minting a fresh instance of
an existing test (same construct, new surface) so a model can be scored
across more distinct runs without replaying the identical item.

You are **NOT** the model under test.

## If you are mid-run (scored benchmark)

Stop. Skill files are on the runner allowlist and contain no scoring
info, but everything this skill points to — `AUTHOR.md`, `rubrics/`,
`docs/`, `report/` — is **outside** the runner allowlist. Opening them
**invalidates** the run. If you already did, list paths in `## Files
read` and tell the user.

## The one rule

Open **`AUTHOR.md` first** and follow it exactly: form-id convention
(`facet` → `…-01b-<fresh-slug>`, `…-01c-…`), equivalence contract,
authoring loop, canary rules, and **independent review gate**. This
skill only adds discipline the protocol cannot enforce alone.

## Kit facts you must respect

- **Parallel forms are Full-only** for multi-run medians. Do **not** add
  b/c forms to Core or Extended (`tiers.json` / Core list in RUN.md).
  Core and Extended stay base forms only.
- A form is a **draft** until a **fresh session** (that did not author
  it) re-derives the key and signs off per AUTHOR.md. Do not use drafts
  in scored evaluation.
- After authoring: unique canary, `tests/` + `rubrics/` files, registry
  via `node tools/canary-audit.js`, `TESTS` entry in `report/index.html`
  (mirror source structure). Run `node tools/validate.js` clean.
- Target multi-run depth is `RUNS_TARGET` (default 3) — a + b + c is the
  usual set; mint d+ only when needed.

## Key first, prose second

Never write scenario prose before the full answer key computes cleanly
(in `node` when numeric; reference + PASS/FAIL exemplars when not).
Every past defect wave traced to prose-first, numbers retrofitted.

## Verify in both directions

Reference solution must pass every objective check. A **deliberate
violator** must fail the checks it was built to fail. A check that
cannot catch its violator is decoration — fix it before shipping.

## Fresh means fresh

New domain, proper nouns, numbers, and canary. Zero reuse of the
source's scenario vocabulary. Same construct, shape, weights, and
**identical** subjective criterion names (including `Reasoning quality`)
so facet medians stay meaningful.

## You don't review your own form

Do not skip the gate because the form "looks obviously right." Your
confidence is not the gate.

## Red flags — stop

| Thought | Reality |
|---|---|
| "I'll just tweak the source slug" | Slug must be fresh; scenario must change. |
| "Close enough difficulty" | Equivalence contract requires same construct + comparable difficulty. |
| "Skip canary-audit this once" | Not optional; collisions invalidate the kit invariant. |
| "Add this parallel to Core" | Never. Parallels are not Core/Extended. |
| "I'm also the runner in this session" | Do not mint forms and take the benchmark in one contaminated context. |
