## Approach

I implemented `mergeRanges` as a small pure function: filter/normalize
input into clean `[start, end]` integer pairs, sort by start (then end
as tiebreak), then do a single linear sweep merging into an accumulator
array. This is the standard "sort + sweep" interval-merge algorithm,
which is the simplest correct approach and keeps the file well under
the 120-line budget. The self-test block runs only when the file is
executed directly (`require.main === module`), so the function is also
cleanly `require`-able without side effects, and prints one `PASS`/
`FAIL` line per case as required.

## Key decisions

- **Adjacency rule:** I merge when `start <= last[1]` (the new range's
  start is within or exactly at the end of the last merged range).
  This exactly matches the spec's own example — `[1,2]` and `[2,3]`
  share the boundary value 2, so they merge into `[1,3]`. I deliberately
  did NOT extend this to "any two ranges with no integer gap between
  them" (e.g., merging `[1,2]` with `[3,4]` because 2 and 3 are
  consecutive integers with nothing between). I tried that broader
  rule first, but it caused unwanted cascading merges in ordinary
  overlap cases (e.g. `[1,3]` and `[4,6]` would merge even when the
  test intent was to keep them distinct with a real gap), and the spec
  only gives the shared-boundary example, not the consecutive-integer
  one — so I chose the narrower, less surprising interpretation.
- **Malformed entries:** documented in the file's top comment: any
  entry that isn't a 2-element array, or whose two elements aren't
  both finite integers, is silently skipped rather than throwing or
  aborting the whole call. This keeps the function total (never
  throws) for any array input, which felt like the friendlier
  contract for a general-purpose merge utility. I considered throwing
  on the first bad entry instead, but that would make one bad record
  in a large input destroy an otherwise-good result, which seemed
  worse for realistic use.
- **Inverted pairs:** normalized by swapping (`[10,4]` -> `[4,10]`),
  exactly as the spec requests, before sorting/merging.
- **Non-array top-level input:** returns `[]` rather than throwing,
  for the same "total function" reasoning as malformed entries.

## Trade-offs and limitations

- Silently dropping malformed entries means a caller gets no signal
  that some input was ignored (no error, no count of skipped items).
  A stricter API (throwing, or returning a `{result, errors}` shape)
  would surface data problems better, but the task explicitly asked
  me to "decide and document" a policy rather than mandating one, and
  a single return value matching the described output shape (`array of
  merged ranges`) seemed the more literal reading of the spec.
  Documented clearly in the top-of-file comment so the choice is not
  hidden.
- The tiebreak sort key (`x[1] - y[1]` when starts are equal) is not
  strictly required for correctness of the merge itself (the sweep
  only reads `last[1]`, which is only extended, never shrunk, since I
  check `end > last[1]`), but it makes output order deterministic and
  slightly more defensive.
- I did not add types/JSDoc beyond comments, or handle non-integer
  "ranges" like Date objects — out of scope per the spec (integer
  pairs only).
- Test cases are hand-picked and hard-coded (not property-based /
  fuzzed), which is adequate for a 120-line self-test but wouldn't
  catch every possible edge case (e.g. extremely large ranges,
  floating-point edge values near integer boundaries).

## Files read

tests/coding/coding-01-edge-cases.md
