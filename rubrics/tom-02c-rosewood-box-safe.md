---
test: tom-02c-rosewood-box-safe
canary: "brazier harpoon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality=TRUNK, Mireille=TRUNK, Tobias=SAFE, Briony=BENCH"
    - id: obj-2
      check: "beliefs.md nested answers are exactly Mireille-thinks-Tobias=SAFE, Mireille-thinks-Briony=BENCH, Tobias-thinks-Briony=BENCH, Briony-thinks-Tobias=BENCH"
    - id: obj-3
      check: "beliefs.md third-order Tobias-thinks-Mireille-thinks-Briony=BENCH, and Tobias's first-order answer is SAFE (NOT updated to TRUNK despite Tobias being co-present with Mireille at t5)"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {BENCH, SAFE, TRUNK} and nothing else in the answer column, and REASONING.md exists and is at most 450 words by wc -w"
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
anchors:
  - id: Nested and third-order attribution accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Per-agent observation-window bookkeeping
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `tom-02-asymmetry-nest` (same construct, fresh surface).

If the phrase "brazier harpoon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | TRUNK |
| 2 | Mireille's belief | TRUNK |
| 3 | Tobias's belief | SAFE |
| 4 | Briony's belief | BENCH |
| 5 | Mireille-thinks-Tobias | SAFE |
| 6 | Mireille-thinks-Briony | BENCH |
| 7 | Tobias-thinks-Briony | BENCH |
| 8 | Briony-thinks-Tobias | BENCH |
| 9 | Tobias-thinks-Mireille-thinks-Briony | BENCH |

Hand-simulated timeline: t0 ROSEWOOD_BOX on BENCH, all three present
(common knowledge); t1 Briony exits and can observe nothing thereafter
until she returns (she never does within the scene); t2 Mireille moves
BENCH->SAFE with Mireille and Tobias present, Briony already gone; t3
Tobias exits and can observe nothing thereafter until he returns; t4
Mireille, alone, moves SAFE->TRUNK; t5 Tobias returns, Mireille says
nothing about the box or either move, and Tobias does not look in any
spot.

First-order: reality is TRUNK (final state). Mireille performed both
moves and is TRUNK. Tobias saw the first move (to SAFE) but left before
the second move and gains no update on return (Mireille silent, Tobias
doesn't look), so Tobias stays at SAFE. Briony left before any move and
has had no contact since, so Briony stays at BENCH.

Nested: Mireille, who witnessed both Tobias's exit-timing and Briony's
exit-timing, can correctly attribute Tobias's belief as SAFE (Tobias's
last-seen state) and Briony's belief as BENCH (Briony's last-seen
state). Tobias directly watched Briony leave at t1, before the SAFE
move, so Tobias attributes BENCH to Briony. Briony left at t1 before
ever seeing the SAFE move happen to anyone, so from Briony's
perspective the last shared state for herself and Tobias alike was
BENCH — Briony attributes BENCH to Tobias.

Third-order: Tobias was present at t1 and personally watched Mireille
watch Briony leave (Mireille and Tobias were both in the workshop
together when Briony exited), so Tobias can correctly reason that
Mireille knows Briony's belief is stuck at BENCH — Tobias-thinks-
Mireille-thinks-Briony is BENCH.

The two central traps: (1) reality-bias/belief-collapse — a reader who
assumes all three agents converge on the final TRUNK state will mark
Tobias=TRUNK and Briony=TRUNK, both wrong. (2) privileged-info leakage
at t5 — Tobias is physically back in the same workshop as Mireille,
but Mireille says nothing and Tobias does not look, so no transfer of
information occurs; Tobias's belief must stay SAFE even though a
careless reader might assume co-presence alone updates Tobias to
TRUNK.

### Objective check notes

- **obj-1**: four exact string matches (reality, Mireille, Tobias,
  Briony); any mismatch fails.
- **obj-2**: four exact string matches on the second-order nested
  cells.
- **obj-3**: this is the trap check — it requires both the correct
  third-order value AND that Tobias's own first-order belief was not
  silently "corrected" to TRUNK elsewhere in the table; a submission
  that gets the third-order cell right but drifts Tobias's first-order
  answer to TRUNK still fails this check.
- **obj-4**: scan every cell for exactly one token from {BENCH, SAFE,
  TRUNK} with nothing else in the answer column; separately confirm
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
  explicitly track, for each of Mireille, Tobias, and Briony, the
  interval during which they were present versus absent, and use that
  bookkeeping consistently across all nine cells (no agent silently
  regains information they had no way to receive)?
- **Reasoning quality**: does `REASONING.md` explicitly flag the t5
  co-presence trap (Tobias returns to a workshop with Mireille, but
  Mireille stays silent and Tobias does not look, so no update occurs)
  and the belief-collapse trap (three agents end the scene with three
  different first-order beliefs, not one shared belief), rather than
  merely listing the nine answers?
