# REASONING.md — audit-01-aquifer-recharge-calculation

## Approach

I verified each derivation step-by-step, checking the km²-to-m² conversion first (the most common source of error in such problems). Derivation A's Step A2 uses 10^5 instead of 10^6, a factor-of-10 error.

## Key decisions

- Flagged Step A2 as the first error point (not later steps that carry the error forward).
- Showed full re-derivation arithmetic as required.

## Trade-offs and limitations

- None — the problem has a single planted error and the arithmetic is straightforward.

## Files read

- tests/reasoning-audit/audit-01-aquifer-recharge-calculation.md
