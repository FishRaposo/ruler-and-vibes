---
id: game-08c-gearcore-torque
category: game-design
title: Bounded-spin proof for a stackable gear-core kit
deliverables:
  - gearcores.json
  - PROOF.md
---

## Task

Design three stackable **gear-core families** for a fictional
clockwork-automaton building game, then PROVE with exact arithmetic
that the combined per-turn spin score cannot exceed a stated ceiling
under the seating rules below — the constructive inverse of hunting a
break: here you must build something and prove it stays bounded.

### Embedded seating rules

- Each turn, an automaton seats **exactly 3 gear cores**, chosen freely
  **with repetition** from your three families (so legal seatings
  include three-of-one-family, two-of-one-plus-one-of-another, or
  one-of-each).
- Each gear-core family has a flat integer **base torque**, added to a
  **base spin score of 8**.
- **Same-family stacking is diminishing**: the first copy of a family
  in a seating contributes its full base torque; each additional copy
  of the SAME family contributes at most **half of the previous
  copy's contribution, rounded down**, floored at 0 (i.e. for base
  `b`, `c` copies contribute `b + floor(b/2) + floor(b/4) + ...` for
  `c` terms).
- **Different families add independently** — no diminishing occurs
  across families, only within repeated copies of the same one.
- The total turn spin score must be **provably <= 52** for the
  **worst-case (spin-maximizing) legal 3-core seating** — where
  "worst case" means the maximum over **ALL legal size-3 multisets of
  your three families**, not merely three copies of a single family.
  A common mistake is checking only same-family triples and missing
  that a one-of-each (or two-plus-one) seating can produce a higher
  total when the families have different base torques.
- Your design must also allow **at least one legal seating reaching
  >= 36**, so the ceiling isn't trivially satisfied by tiny base
  torques that make the kit pointless.

## Deliverables

- `gearcores.json` — exactly 3 gear-core families, each `{ "name":
  string, "base": integer }`.
- `PROOF.md` (at most 500 words) that:
  - States the worst-case seating (which family counts) and its total
    spin score, computed as the true maximum over all legal size-3
    multisets — not just same-family triples.
  - Shows that worst-case total is <= 52.
  - Shows at least one seating reaching >= 36.
  - Shows the diminishing-stack arithmetic explicitly for at least one
    same-family triple (e.g. `b + floor(b/2) + floor(b/4)`), so the
    floor-division rule is visibly applied, not just asserted.

## Constraints

- `gearcores.json` must parse as valid JSON, loadable with `node`,
  with exactly 3 entries.
- The worst case must genuinely be the maximum over ALL size-3
  multisets (there are 10 for 3 families: 3 same-family triples, 6
  two-plus-one combinations, 1 one-of-each) — checking only same-
  family triples and skipping mixed multisets is the trap this test is
  built to catch.
- `PROOF.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you scanned the multiset space (by hand or with a
script).
