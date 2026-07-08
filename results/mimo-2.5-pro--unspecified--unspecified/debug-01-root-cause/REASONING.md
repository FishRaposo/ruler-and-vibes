# REASONING.md — debug-01-root-cause

## Approach

I traced the function's execution for each test case to identify where the output diverged from the intended behavior. I found three bugs: incorrect discount scope, shipping check using post-discount total, and an off-by-one loop error.

## Key decisions

- Bug 1: Changed `total * 0.9` to `total - (total - 200) * 0.1` to discount only the excess above 200.
- Bug 2: Captured `subtotal` before the discount and used it for the shipping check. Also fixed `>` to `>=` per the spec ("100 or more").
- Bug 3: Changed `<=` to `<` in the wrap loop.

## Trade-offs and limitations

- Preserved the overall function structure as required, even though a cleaner approach would compute subtotal first and use it throughout.

## Files read

- tests/debugging/debug-01-root-cause.md
