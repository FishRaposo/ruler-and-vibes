# RUN.md — Protocol for the model under test

You are being benchmarked. Follow these steps exactly.

## Inputs (from the user)

- `<run-id>`: a kebab-case slug for this run. Suggested form
  `<model>--<effort>--<harness>`, e.g. `claude-fable-5--high--claude-code`.
- Optionally, a list of tests or categories to run. Default: every test
  in `tests/`.

## Rules — read these first

1. Read ONLY: this file, files under `tests/`, your own
   `results/<run-id>/` folder, and harness skill files under
   `.agents/skills/` or `.claude/skills/` (they contain no scoring
   information). **Never**
   read anything else in this repo — not `rubrics/`, not `report/`, not
   other runs' `results/` folders, and not `docs/` or scratch folders
   (design docs quote the rubrics). Doing so invalidates your run.
2. **Never** write outside `results/<run-id>/`.
3. Overwriting your own previous outputs is fine (re-runs replace).
4. Do not self-grade or speculate about scoring criteria anywhere in
   your outputs.

## Steps

1. Create `results/<run-id>/` and write `meta.json` first:

   ```json
   { "model": "<model name>", "effort": "<effort or 'unspecified'>",
     "harness": "<harness or 'unspecified'>", "date": "<YYYY-MM-DD>" }
   ```

   `model` is required — take it from the user, or from your own session
   context if the user didn't say. Use `"unspecified"` for effort or
   harness when unknown.

2. For each assigned test:
   1. Read the test file: `tests/<category>/<test-id>.md`. Test ids are
      unique, so `tests/*/<test-id>.md` finds it without browsing other
      tests. Keep note of every repo file you read while working.
   2. Create `results/<run-id>/<test-id>/`.
   3. Produce EXACTLY the deliverable files the test names, in that
      folder — same filenames, nothing extra required.
   4. Write `REASONING.md` in the same folder with these sections, in
      this order:
      - `## Approach` — what you chose and why
      - `## Key decisions` — the calls you made, alternatives you
        rejected
      - `## Trade-offs and limitations` — what you gave up, what is weak
      - `## Files read` — every repo file you consulted for this test,
        one relative path per line, excluding files you created. This
        section is required and is checked.

      `REASONING.md` is itself graded — on honesty and depth, not
      length.

## Checklist before you finish

- [ ] `results/<run-id>/meta.json` exists and has a `model` value
- [ ] Every assigned test folder contains all deliverables the test names
- [ ] Every test folder has `REASONING.md` ending with `## Files read`
- [ ] You read nothing under `rubrics/`, `report/`, or other runs
- [ ] You wrote nothing outside `results/<run-id>/`
