## Approach
Audited each derivation independently, checking every arithmetic step. Derivation A's km² to m² conversion is wrong (used 10^5 instead of 10^6). Derivation B is fully correct. The task says exactly one derivation contains an error, and A's Step A2 is the first (and only) error.

## Key decisions
1 km² = (1000 m)² = 10^6 m², not 10^5 m². This is a factor-of-10 error. All subsequent steps in Derivation A correctly use the (wrong) value from A2, so A5 and A6 are not independently erroneous — they correctly compute from the wrong input. That's why A2 is the first (and only) step to flag.

## Files read
- tests/reasoning-audit/audit-01-aquifer-recharge-calculation.md
