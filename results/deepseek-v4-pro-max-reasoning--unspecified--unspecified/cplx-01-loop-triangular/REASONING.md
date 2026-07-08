## Approach
Preserved the original stepCost function exactly (same loop structure, same bounds) and added a self-test block that prints the required 5 lines when run directly. The function is exported for the judge harness.

## Key decisions
Used `require.main === module` to detect direct execution vs. being required. The printed lines are exactly `n=<n> steps=<count>` in the specified order with no extra output.

## Trade-offs and limitations
The function doesn't memoize or optimize — it computes O(n²) each call, which is the intended behavior for this task (instrumentation, not optimization).

## Files read
- tests/algorithmic-complexity/cplx-01-loop-triangular.md
