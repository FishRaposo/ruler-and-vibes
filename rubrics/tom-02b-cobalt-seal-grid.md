---
test: tom-02b-cobalt-seal-grid
canary: "sconce chandelier"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality=LOCKER, Zora=LOCKER, Marek=VAULT, Talia=CABINET"
    - id: obj-2
      check: "beliefs.md nested answers are exactly Zora-thinks-Marek=VAULT, Zora-thinks-Talia=CABINET, Marek-thinks-Talia=CABINET, Talia-thinks-Marek=CABINET"
    - id: obj-3
      check: "beliefs.md third-order Marek-thinks-Zora-thinks-Talia=CABINET, and Marek's first-order answer is VAULT (NOT updated to LOCKER despite Marek being co-present with Zora at t5)"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {CABINET, VAULT, LOCKER} and nothing else in the answer column, and REASONING.md exists and is at most 450 words by wc -w"
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

Parallel form of `tom-02-asymmetry-nest` (same construct, fresh surface).

If the phrase "sconce chandelier" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | LOCKER |
| 2 | Zora's belief | LOCKER |
| 3 | Marek's belief | VAULT |
| 4 | Talia's belief | CABINET |
| 5 | Zora-thinks-Marek | VAULT |
| 6 | Zora-thinks-Talia | CABINET |
| 7 | Marek-thinks-Talia | CABINET |
| 8 | Talia-thinks-Marek | CABINET |
| 9 | Marek-thinks-Zora-thinks-Talia | CABINET |

Hand-simulated timeline: t0 COBALT_SEAL in CABINET, all three present
(common knowledge); t1 Talia exits and can observe nothing thereafter
until she returns (she never does within the scene); t2 Zora moves
CABINET->VAULT with Zora and Marek present, Talia already gone; t3
Marek exits and can observe nothing thereafter until he returns; t4
Zora, alone, moves VAULT->LOCKER; t5 Marek returns, Zora says nothing
about the seal or either move, and Marek does not look in any spot.

First-order: reality is LOCKER (final state). Zora performed both
moves and is LOCKER. Marek saw the first move (to VAULT) but left
before the second move and gains no update on return (Zora silent,
Marek doesn't look), so Marek stays at VAULT. Talia left before any
move and has had no contact since, so Talia stays at CABINET.

Nested: Zora, who witnessed both Marek's exit-timing and Talia's
exit-timing, can correctly attribute Marek's belief as VAULT (Marek's
last-seen state) and Talia's belief as CABINET (Talia's last-seen
state). Marek directly watched Talia leave at t1, before the VAULT
move, so Marek attributes CABINET to Talia. Talia left at t1 before
ever seeing the VAULT move happen to anyone, so from Talia's
perspective the last shared state for herself and Marek alike was
CABINET — Talia attributes CABINET to Marek.

Third-order: Marek was present at t1 and personally watched Zora watch
Talia leave (Zora and Marek were both in the room together when Talia
exited), so Marek can correctly reason that Zora knows Talia's belief
is stuck at CABINET — Marek-thinks-Zora-thinks-Talia is CABINET.

The two central traps: (1) reality-bias/belief-collapse — a reader who
assumes all three agents converge on the final LOCKER state will mark
Marek=LOCKER and Talia=LOCKER, both wrong. (2) privileged-info leakage
at t5 — Marek is physically back in the same room as Zora, but Zora
says nothing and Marek does not look, so no transfer of information
occurs; Marek's belief must stay VAULT even though a careless reader
might assume co-presence alone updates Marek to LOCKER.

### Objective check notes

- **obj-1**: four exact string matches (reality, Zora, Marek, Talia);
  any mismatch fails.
- **obj-2**: four exact string matches on the second-order nested
  cells.
- **obj-3**: this is the trap check — it requires both the correct
  third-order value AND that Marek's own first-order belief was not
  silently "corrected" to LOCKER elsewhere in the table; a submission
  that gets the third-order cell right but drifts Marek's first-order
  answer to LOCKER still fails this check.
- **obj-4**: scan every cell for exactly one token from {CABINET,
  VAULT, LOCKER} with nothing else in the answer column; separately
  confirm `REASONING.md` exists and `wc -w` <= 450.

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
  explicitly track, for each of Zora, Marek, and Talia, the interval
  during which they were present versus absent, and use that
  bookkeeping consistently across all nine cells (no agent silently
  regains information they had no way to receive)?
- **Reasoning quality**: does `REASONING.md` explicitly flag the t5
  co-presence trap (Marek returns to a room with Zora, but Zora stays
  silent and Marek does not look, so no update occurs) and the
  belief-collapse trap (three agents end the scene with three
  different first-order beliefs, not one shared belief), rather than
  merely listing the nine answers?
