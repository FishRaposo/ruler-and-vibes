## Approach
Read the function carefully against the intended-behavior spec. Traced each line of the code and compared against what the spec says should happen for the given test cases. Applied the smallest possible changes to fix each bug.

## Key decisions
The discount fix required tracking the pre-discount subtotal separately. The shipping fix naturally followed since the same pre-discount subtotal is needed for the threshold check. The gift-wrap off-by-one was a straightforward `<=` to `<` fix.

## Trade-offs and limitations
The fix preserves the original structure (single function, same rough shape) as required. Test cases were chosen from the given five inputs and verified against the spec's behavior, not the buggy code's output.

## Files read
- tests/debugging/debug-01-root-cause.md
