# coding-01-edge-cases — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Files read only `tests/coding/coding-01-edge-cases.md`. No canary "sentinel sweep".

## Objective checks
- obj-1 (`node solution.js` runs and every self-test line prints PASS): PASS — six lines all PASS (empty, single, adjacency, inverted, unsorted overlapping, duplicates).
- obj-2 (Empty input and single-range input return correct results): PASS — `[]` → `[]`; `[[3,7]]` → `[[3,7]]`.
- obj-3 (Adjacent ranges are merged ([1,2] + [2,3] -> [1,3])): PASS — verified `[[1,2],[2,3]]` → `[[1,3]]` via `curr[0] <= last[1]`.
- obj-4 (Single file, no dependencies, <= 120 lines): PASS — 40 lines, plain JS, no requires beyond self-export.

## Subjective criteria
- sub-quality (Solution quality): 9/10 — Clean sort-then-single-pass merge; normalizes inverted pairs with `Math.min`/`Math.max`; silently filters non-two-number arrays as documented. Does not mutate the original input.
- sub-craft (Code clarity): 9/10 — Short `cleaned`/`merged` pipeline, readable `test` helper with JSON equality, no cleverness.
- sub-reasoning (Reasoning quality): 8/10 — Explicitly chooses silent skip over throw for bad entries and notes adjacency uses `<=`; honest that callers won't learn about malformed input.

## Verdict
Strong baseline mergeRanges: all objective checks pass, adjacency and inversion handled correctly, code under 40 lines with clear self-tests and documented invalid-entry policy.
