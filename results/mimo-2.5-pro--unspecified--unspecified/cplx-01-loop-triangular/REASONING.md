# REASONING.md — cplx-01-loop-triangular

## Approach

I traced the nested loop bounds: outer i goes 1..n, inner j goes i..n. For each i, the inner body executes (n - i + 1) times. Summing 1 + 2 + ... + n gives n(n+1)/2.

## Key decisions

- Preserved the exact loop structure and bounds as specified.
- Exported `stepCost` via `module.exports` so the judge can `require()` and call it.
- Pinned inputs printed in the exact required format with no extras.

## Trade-offs and limitations

- None significant — the problem has a single correct closed-form answer.

## Files read

- tests/algorithmic-complexity/cplx-01-loop-triangular.md
