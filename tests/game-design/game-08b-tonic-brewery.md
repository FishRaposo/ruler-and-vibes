---
id: game-08b-tonic-brewery
category: game-design
title: Bounded-strength proof for a stackable tonic set
deliverables:
  - tonics.json
  - PROOF.md
---

## Task

Design three stackable **tonic lines** for a fictional cozy
apothecary-crafting game's "brewing" system, then PROVE with exact
arithmetic that the combined per-round batch strength cannot exceed a
stated ceiling under the stacking rules below — the constructive inverse
of hunting for a break: here you must build something and prove it stays
bounded.

### Embedded stacking rules

- Each round, a brewer fills **exactly 3 flask slots** with tonic doses,
  chosen freely **with repetition** from your three lines (so legal
  batches include three-of-one-line, two-of-one-plus-one-of-another, or
  one-of-each).
- Each tonic line has a flat integer **base bonus**, added to a
  **base batch strength of 10**.
- **Same-line stacking is diminishing**: the first dose of a line in a
  batch contributes its full base value; each additional dose of the
  SAME line contributes at most **half of the previous dose's
  contribution, rounded down**, floored at 0 (i.e. for base `b`, `c`
  doses contribute `b + floor(b/2) + floor(b/4) + ...` for `c` terms).
- **Different lines add independently** — no diminishing occurs across
  lines, only within repeated doses of the same one.
- The total batch strength must be **provably <= 45** for the
  **worst-case (strength-maximizing) legal 3-dose batch** — where
  "worst case" means the maximum over **ALL legal size-3 multisets of
  your three lines**, not merely three doses of a single line. A common
  mistake is checking only same-line triples and missing that a
  one-of-each (or two-plus-one) batch can produce a higher total when
  the lines have different base values.
- Your design must also allow **at least one legal batch reaching
  >= 30**, so the ceiling isn't trivially satisfied by tiny bonuses that
  make the system pointless.

## Deliverables

- `tonics.json` — exactly 3 tonic lines, each `{ "name": string,
  "base": integer }`.
- `PROOF.md` (at most 500 words) that:
  - States the worst-case batch (which line counts) and its total
    strength, computed as the true maximum over all legal size-3
    multisets — not just same-line triples.
  - Shows that worst-case total is <= 45.
  - Shows at least one batch reaching >= 30.
  - Shows the diminishing-stack arithmetic explicitly for at least one
    same-line triple (e.g. `b + floor(b/2) + floor(b/4)`), so the
    floor-division rule is visibly applied, not just asserted.

## Constraints

- `tonics.json` must parse as valid JSON, loadable with `node`, with
  exactly 3 entries.
- The worst case must genuinely be the maximum over ALL size-3 multisets
  (there are 10 for 3 lines: 3 same-line triples, 6 two-plus-one
  combinations, 1 one-of-each) — checking only same-line triples and
  skipping mixed multisets is the trap this test is built to catch.
- `PROOF.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you scanned the multiset space (by hand or with a
script).
