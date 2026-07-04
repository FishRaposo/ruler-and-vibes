---
name: generating-parallel-tests
description: Use when asked to generate, mint, or author additional parallel test forms for the Ruler & Vibes benchmark (this repo) — e.g. to run more than 3 runs on a facet, or to replace a form a model has already seen.
---

# Generating Parallel Tests

You are the evaluator, minting a fresh instance of an existing test so
a model can be scored across more distinct runs. You are NOT the model
under test. If you are in the middle of a scored run right now, stop
here: reading this skill file is permitted (skill files are on the
runner's allowlist and contain no scoring information), but everything
it directs you to — `AUTHOR.md`, `rubrics/`, `docs/`, `report/` — is
outside your allowlist, and opening any of them invalidates your run.
If you already did, list them in your `## Files read` manifest and tell
the user.

## The one rule

Open `AUTHOR.md` first and follow it exactly — the form-id convention,
the equivalence contract, the authoring loop, and the review gate are
all defined there, not here. This skill adds only the discipline the
protocol can't enforce by itself:

## Key first, prose second

Never write a word of scenario prose before the full answer key
computes cleanly in `node`. Every defect wave this kit has ever
suffered traced back to prose written first and numbers retrofitted
after.

## Verify in both directions

A reference solution passing every check proves nothing by itself —
build the violating solution too, and make sure each check *fails* it.
A check that can't catch its own violator is decoration.

## Fresh means fresh

If any proper noun, scenario detail, or key value from the source test
survives into your form, the form is contaminated. When in doubt,
change it.

## You don't review your own form

The form is a draft until a fresh session — one that did not author it
— re-derives the key and signs off per `AUTHOR.md`. Do not use a draft
in a scored evaluation, and do not skip the gate because the form
"looks obviously right." Your confidence is not the gate.
