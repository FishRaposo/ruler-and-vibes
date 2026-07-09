# Judge Guide — writing discriminating scores

The validator (`node tools/validate.js`) catches mechanical problems in
your judgments. This guide explains *why* those problems matter and how
to avoid them.

## The problem with boilerplate

If every subjective comment says "Scored from correctness of the
deliverable against the rubric," then all three models on the report
page look identical. The radar chart shows the same shape, the table
shows the same text, and the benchmark can't tell anyone which model
is actually better.

Boilerplate happens when you stop reading the deliverable and start
writing from memory. The fix is simple: **name one concrete detail
per comment.**

### Bad comment (boilerplate — the validator catches this)

```
"sub-quality": "Subjective quality reflects the number and seriousness
of rubric misses in the deliverable."
```

This is identical across every test the judge has ever scored.

### Good comment (specific)

```
"sub-quality": "The merge logic handles overlaps correctly but misses
adjacent-range merging — [1,2] and [2,3] are returned as two ranges
instead of one merged [1,3]. That's a specific miss on obj-3."
```

This tells the reader:
- What the model did right (overlap handling)
- What it did wrong (adjacency)
- Which specific check it failed (obj-3)
- Why the score is what it is

## What to name in each criterion

For every test you judge, find one detail:

- **From the objective checks you ran**: "Ran `node solution.js` — all
  6 self-tests print PASS, including the inverted-pair case `[5,1]`."
  Even objective comments should be specific.

- **From the code/HTML/SVG the runner produced**: "Used `textContent`
  for the title element but missed the `aria-label` on the submit
  button, which is why obj-4 fails."

- **From `REASONING.md`**: "Honestly notes they chose `O(n²)` because
  the spec says ≤120 lines and `O(n log n)` would push past the budget
  — a real trade-off, not hand-waving."

- **From the decision or limitation the runner stated**: Quote it.
  Don't summarize the task constraints — those belong to the rubric,
  not to the runner's reasoning.

## Reasoning summaries (the `reasoning` object)

The `reasoning` section in data.js is where you faithfully condense
what the RUNNER said — not where you judge. Three fields:

| Field | What goes there |
|---|---|
| `approach` | One sentence summarizing the runner's Approach section. Strip the `## Approach` heading — make it a plain sentence. |
| `decisions` | One specific decision the runner made, in their own words or close paraphrase. Never: "The runner describes applying the task constraints…" |
| `limitations` | One limitation the runner acknowledged. If they stated none, write `"Runner stated no limitations."` — never invent one. |

### Example from `coding-01-edge-cases`

The runner's REASONING.md says:

> I implemented mergeRanges as a small pure function: filter/normalize
> input into clean [start, end] integer pairs, sort by start, then do a
> single linear sweep merging into an accumulator array.

> **Key decisions:** I merge when start <= last[1] — this exactly
> matches the spec's own example [1,2] and [2,3] merging into [1,3].
> I deliberately did NOT extend this to consecutive integers with no
> gap between them.

> **Trade-offs:** Silently dropping malformed entries means a caller
> gets no signal that some input was ignored. A stricter API would
> surface data problems better.

Good `reasoning` entry:

```js
reasoning: {
  approach: "Filter/normalize integer pairs, sort by start, then single-pass linear sweep merging.",
  decisions: "Chose to merge only at shared boundary values (start <= last[1]), not consecutive integers with no gap — the narrower, less surprising interpretation of the spec.",
  limitations: "Silently drops malformed entries rather than surfacing errors to the caller."
}
```

Bad `reasoning` entry (the validator catches this):

```js
reasoning: {
  approach: "## Approach\n\nI implemented mergeRanges as a small pure function…", // raw markdown, not condensed
  decisions: "The runner describes applying the task constraints…", // boilerplate
  limitations: "Limitations are only those explicitly present…" // boilerplate
}
```

## Flat scores are indecision

If a model gets 9/9/8 on every test, or all three models get 9/9/8 on
the same test, the benchmark can't distinguish them. The problem is
usually:

1. **You're judging the model, not the output.** A strong model's
   reputation doesn't make a sloppy deliverable good. A weak model's
   reputation doesn't make a clean deliverable bad. Score what's in
   the file.

2. **You're using 7–9 as your default range.** A subjective 0–10 scale
   with 0 reserved for missing deliverables means you have 11 points.
   Use them. A 4 means "below average for a capable model." A 2 means
   "barely attempted." A 10 means "I can't imagine a better answer
   given the constraints."

3. **You're not naming a specific flaw or strength.** Without a named
   detail, every score drifts toward the middle because you have no
   anchor.

### The calibration check

After 5 tests, look at your subjective score spread. If all scores are
within 2 points (e.g., 7–9), you're not differentiating. Go back and
ask: which output was noticeably better or worse? Bump the better one
up and the worse one down until the gap reflects what you actually saw.

Run `node tools/validate.js` when you finish. It warns when a model's
subjective scores have a standard deviation below 0.5.

## Common failure modes

### Judge fatigue

After 20+ tests, you'll start writing faster, which means thinner
comments. Break judging into batches of 10 tests. Between batches,
run `node tools/validate.js` and scan your own comment text. If you
see the same phrase repeating, re-judge the test you judged most
recently in that batch.

### One model's run is incomplete

If a run has only a few of the Core (34) or Extended (89) tests, the
validator warns PROVISIONAL — that's not the judge's problem to fix.
Judge what's there. The coverage gap shows honestly in the report;
incomplete Core/Extended must not be read as a finished general map
(ladder: Core ⊂ Extended ⊂ Full; see TIERS.md).

### Format blind spot

The `reasoning.approach` field should be a plain sentence, not a
markdown heading. The validator flags entries starting with `## Approach`.
This happens when you paste the runner's REASONING.md verbatim instead
of condensing it.

### "All objective checks passed, nothing to say"

Even a perfect objective run has a story:
- Which edge case did the runner handle that others might miss?
- Was the code unusually short/clean? "40 lines including tests" is
  different from "118 lines with verbose error handling."
- Did REASONING.md show real deliberation or just restate the task?

## Running the validator

```
node tools/validate.js         # warnings + errors
node tools/validate.js --strict  # warnings treated as errors
```

A clean run means:
- 0 issues (rubric-TESTS alignment, data.js structure)
- 0 boilerplate warnings (all comments are unique and specific)
- 0 variance warnings (scores are properly spread)
- 0 raw-markdown warnings (all approach fields are condensed)

Boilerplate warnings will be the last to clear — they mean you need to
re-judge tests with specific comments. Start there.
