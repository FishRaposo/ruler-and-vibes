# REASONING.md — pat-01-ipv4-octet

## Approach

I implemented the validator by splitting on dots, checking for exactly 4 segments, validating each segment for: non-empty, no leading zeros (except "0" itself), all digits, and numeric range 0-255. The full-string consumption is guaranteed by splitting on "." and checking segment count.

## Key decisions

- Used character-by-character digit check rather than parseInt alone, because parseInt silently ignores trailing non-digits (e.g., "1a" → 1), which would incorrectly accept "1.2.3.4a".
- Leading zero check: `seg.length > 1 && seg[0] === '0'` rejects "00", "01", etc. while allowing "0".

## Trade-offs and limitations

- Could have used a single regex for the entire validation, but the iterative approach is clearer and handles the range check (0-255) more naturally.

## Files read

- tests/formal-patterns/pat-01-ipv4-octet.md
