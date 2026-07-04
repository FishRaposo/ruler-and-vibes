---
test: tom-02-asymmetry-nest
canary: "piccolo cornet"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality=CRATE, Ada=CRATE, Bo=DRAWER, Cy=SHELF"
    - id: obj-2
      check: "beliefs.md nested answers are exactly Ada-thinks-Bo=DRAWER, Ada-thinks-Cy=SHELF, Bo-thinks-Cy=SHELF, Cy-thinks-Bo=SHELF"
    - id: obj-3
      check: "beliefs.md third-order Bo-thinks-Ada-thinks-Cy=SHELF, and Bo's first-order answer is DRAWER (NOT updated to CRATE despite Bo being co-present with Ada at t5)"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {SHELF, DRAWER, CRATE} and nothing else in the answer column, and REASONING.md exists and is at most 450 words by wc -w"
  subjective:
    - id: sub-quality
      name: "Nested and third-order attribution accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Per-agent observation-window bookkeeping"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If a submission's `beliefs.md` or `REASONING.md` contains the phrase
"piccolo cornet", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | CRATE |
| 2 | Ada's belief | CRATE |
| 3 | Bo's belief | DRAWER |
| 4 | Cy's belief | SHELF |
| 5 | Ada-thinks-Bo | DRAWER |
| 6 | Ada-thinks-Cy | SHELF |
| 7 | Bo-thinks-Cy | SHELF |
| 8 | Cy-thinks-Bo | SHELF |
| 9 | Bo-thinks-Ada-thinks-Cy | SHELF |

Hand-simulated timeline: t0 RED_LEDGER on SHELF, all three present
(common knowledge); t1 Cy exits and can observe nothing thereafter
until she returns (she never does within the scene); t2 Ada moves
SHELF->DRAWER with Ada and Bo present, Cy already gone; t3 Bo exits and
can observe nothing thereafter until he returns; t4 Ada, alone, moves
DRAWER->CRATE; t5 Bo returns, Ada says nothing about the ledger or
either move, and Bo does not look in any spot.

First-order: reality is CRATE (final state). Ada performed both moves
and is CRATE. Bo saw the first move (to DRAWER) but left before the
second move and gains no update on return (Ada silent, Bo doesn't
look), so Bo stays at DRAWER. Cy left before any move and has had no
contact since, so Cy stays at SHELF.

Nested: Ada, who witnessed both Bo's exit-timing and Cy's exit-timing,
can correctly attribute Bo's belief as DRAWER (Bo's last-seen state)
and Cy's belief as SHELF (Cy's last-seen state). Bo directly watched Cy
leave at t1, before the DRAWER move, so Bo attributes SHELF to Cy. Cy
left at t1 before ever seeing the DRAWER move happen to anyone, so from
Cy's perspective the last shared state for herself and Bo alike was
SHELF — Cy attributes SHELF to Bo.

Third-order: Bo was present at t1 and personally watched Ada watch Cy
leave (Ada and Bo were both in the room together when Cy exited), so Bo
can correctly reason that Ada knows Cy's belief is stuck at SHELF —
Bo-thinks-Ada-thinks-Cy is SHELF.

The two central traps: (1) reality-bias/belief-collapse — a reader who
assumes all three agents converge on the final CRATE state will mark
Bo=CRATE and Cy=CRATE, both wrong. (2) privileged-info leakage at t5 —
Bo is physically back in the same room as Ada, but Ada says nothing
and Bo does not look, so no transfer of information occurs; Bo's
belief must stay DRAWER even though a careless reader might assume
co-presence alone updates Bo to CRATE.

### Objective check notes

- **obj-1**: four exact string matches (reality, Ada, Bo, Cy); any
  mismatch fails.
- **obj-2**: four exact string matches on the second-order nested
  cells.
- **obj-3**: this is the trap check — it requires both the correct
  third-order value AND that Bo's own first-order belief was not
  silently "corrected" to CRATE elsewhere in the table; a submission
  that gets the third-order cell right but drifts Bo's first-order
  answer to CRATE still fails this check.
- **obj-4**: scan every cell for exactly one token from {SHELF, DRAWER,
  CRATE} with nothing else in the answer column; separately confirm
  `REASONING.md` exists and `wc -w` <= 450.

Because every objective check here is a verbatim cell-match against a
closed three-token vocabulary, there are no prose PASS/FAIL phrasing
examples to give for the objective criteria.

### Subjective guidance

- **Nested and third-order attribution accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` show the submission
  understood *why* each nested and third-order cell takes its value —
  i.e., correctly identifying which agent witnessed which other
  agent's exit, rather than arriving at the right token by
  coincidence?
- **Per-agent observation-window bookkeeping**: does the submission
  explicitly track, for each of Ada, Bo, and Cy, the interval during
  which they were present versus absent, and use that bookkeeping
  consistently across all nine cells (no agent silently regains
  information they had no way to receive)?
- **Reasoning quality**: does `REASONING.md` explicitly flag the t5
  co-presence trap (Bo returns to a room with Ada, but Ada stays silent
  and Bo does not look, so no update occurs) and the belief-collapse
  trap (three agents end the scene with three different first-order
  beliefs, not one shared belief), rather than merely listing the nine
  answers?
