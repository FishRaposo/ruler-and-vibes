---
id: game-08-combo-engine
category: game-design
title: Bounded-synergy proof for a stackable ability set
deliverables:
  - relics.json
  - PROOF.md
---

## Task

Design three stackable **relic families** for a fictional action-RPG
"relic" system, then PROVE with exact arithmetic that the combined
per-round output cannot exceed a stated ceiling under the stacking
rules below — the constructive inverse of hunting a break: here you
must build something and prove it stays bounded.

### Embedded stacking rules

- Each round, a character equips **exactly 3 relics**, chosen freely
  **with repetition** from your three families (so legal loadouts
  include three-of-one-family, two-of-one-plus-one-of-another, or
  one-of-each).
- Each relic family has a flat integer **base bonus**, added to a
  **base output of 10**.
- **Same-family stacking is diminishing**: the first copy of a family
  in a loadout contributes its full base value; each additional copy
  of the SAME family contributes at most **half of the previous
  copy's contribution, rounded down**, floored at 0 (i.e. for base
  `b`, `c` copies contribute `b + floor(b/2) + floor(b/4) + ...` for
  `c` terms).
- **Different families add independently** — no diminishing occurs
  across families, only within repeated copies of the same one.
- The total round output must be **provably <= 45** for the
  **worst-case (output-maximizing) legal 3-relic loadout** — where
  "worst case" means the maximum over **ALL legal size-3 multisets of
  your three families**, not merely three copies of a single family.
  A common mistake is checking only same-family triples and missing
  that a one-of-each (or two-plus-one) loadout can produce a higher
  total when the families have different base values.
- Your design must also allow **at least one legal loadout reaching
  >= 30**, so the ceiling isn't trivially satisfied by tiny bonuses
  that make the system pointless.

## Deliverables

- `relics.json` — exactly 3 relic families, each `{ "name": string,
  "base": integer }`.
- `PROOF.md` (at most 500 words) that:
  - States the worst-case loadout (which family counts) and its total
    output, computed as the true maximum over all legal size-3
    multisets — not just same-family triples.
  - Shows that worst-case total is <= 45.
  - Shows at least one loadout reaching >= 30.
  - Shows the diminishing-stack arithmetic explicitly for at least one
    same-family triple (e.g. `b + floor(b/2) + floor(b/4)`), so the
    floor-division rule is visibly applied, not just asserted.

## Constraints

- `relics.json` must parse as valid JSON, loadable with `node`, with
  exactly 3 entries.
- The worst case must genuinely be the maximum over ALL size-3
  multisets (there are 10 for 3 families: 3 same-family triples, 6
  two-plus-one combinations, 1 one-of-each) — checking only same-
  family triples and skipping mixed multisets is the trap this test is
  built to catch.
- `PROOF.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you scanned the multiset space (by hand or with a
script).
