# REASONING.md — coding-01-edge-cases

## Approach

I implemented mergeRanges by: (1) filtering and normalizing each entry (swapping inverted pairs, skipping invalid entries), (2) sorting by start then end, (3) merging overlapping/adjacent ranges in a single pass.

## Key decisions

- Adjacent ranges merge (s <= last[1] + 1), matching the spec.
- Invalid entries (non-array, wrong types, fewer than 2 elements) are silently skipped rather than throwing, keeping the function robust.
- Inverted pairs are normalized by swapping.
- Self-test includes 8 cases covering all required categories plus extras.

## Trade-offs and limitations

- Silently skipping invalid entries may hide bugs in caller code. An alternative would be to throw on invalid input.

## Files read

- tests/coding/coding-01-edge-cases.md
