## Approach
Implement a single-pass merge: normalize each pair (swap inverted, reject
malformed), sort by start, then fold into an output list, extending the
last interval when the next start is <= the last end (covers overlap and
adjacency). Input is never mutated.

## Key decisions
- Throw on entries that aren't exactly two integers rather than coerce
  them, so invalid data is surfaced instead of silently producing wrong
  merges. This matches "decide and document how you treat" the bad-entry
  case.
- Use `lo <= last[1]` (not `<`) so adjacent ranges merge per the spec
  ([1,2]+[2,3] -> [1,3]).

## Trade-offs and limitations
- Sorts the input (O(n log n)); fine for the stated scale. A pre-sorted
  streaming variant would avoid it but isn't needed here.
- Rejection of malformed entries means partial/garbage input yields an
  error rather than a best-effort result; acceptable for this contract.

## Files read
tests/coding/coding-01-edge-cases.md
