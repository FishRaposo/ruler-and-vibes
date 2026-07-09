---
test: logic-01b-cablecar-flour-ledger
canary: "citadel stockade"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "A1 states exactly 14 runs (fails on 13 from an unrounded 469/36=13.03, or on 12 from a capacity-40 miscalculation)"
    - id: obj-2
      check: "A2 states exactly 780 coins (14 runs, 2 free of traction fee, 12 paid x 65; fails on 910 = free-run discount forgotten, or any other free-count)"
    - id: obj-3
      check: "A3 states power 448 coins, grand total 1228 coins, and per-sack cost 2.62 (judge recomputes in node: 14*4*8=448; 780+448=1228; 1228/469=2.6183 -> 2.62)"
    - id: obj-4
      check: "A4 states 12 runs and 2 runs saved (ceil(469/40)=12; 14-12=2)"
    - id: obj-5
      check: "ANSWERS.md contains all four 'A1:'/'A2:'/'A3:'/'A4:' answer lines and is at most 300 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Working clarity"
      weight: 0.4
    - id: sub-craft
      name: "Trap navigation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Working clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Trap navigation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `logic-01-ferry-ledger` (same construct, fresh
surface).

If the phrase "citadel stockade" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently before grading; do not trust the
runner's stated numbers. Reference computation (verified in node):

```
sacks = 469
capPerRun = 40 - 4 = 36
A1 = ceil(469 / 36) = ceil(13.027...) = 14

freeRuns = floor(14 / 6) = 2   // runs 6, 12
paidRuns = 14 - 2 = 12
A2 = 12 * 65 = 780              // trap: 14*65=910 if discount forgotten

powerPerRun = 4 * 8 = 32        // billed on EVERY run, including free ones
powerTotal = 14 * 32 = 448
grandTotal = 780 + 448 = 1228
perSack = 1228 / 469 = 2.61834... -> 2.62

A4: ballast-free cabin at 40/run -> ceil(469/40) = ceil(11.725...) = 12
saved = 14 - 12 = 2
```

- **obj-1**: the ballast-capacity trap (36, not 40, sacks per run) and
  the ceiling-division trap (round up, not down or truncate) both have
  to be navigated correctly; 13 runs is the tell that the ceiling was
  missed and 12 is the tell that the ballast reduction was ignored.
  PASS phrasings: "40 - 4 = 36 usable, 469/36 = 13.03, round up to 14";
  "at most 36 per run, so 14 runs are needed"; "ceil(469/36) = 14".
  FAIL phrasings: "469/40 = 11.7, so 12 runs"; "469/36 = 13.03, so 13
  runs"; "40 sacks a run means 12 runs".
- **obj-2**: the free-run trap is the every-6th-run waiver; 910 is the
  exact tell for a submission that charged all 14 runs instead of 12.
  PASS phrasings: "runs 6 and 12 are free, 12 paid x 65 = 780";
  "floor(14/6) = 2 free, so 12 * 65 = 780"; "2 of the 14 runs waived,
  780 coins". FAIL phrasings: "14 runs x 65 = 910"; "every run costs
  65, total 910"; "13 paid runs x 65 = 845".
- **obj-3**: power must be charged on all 14 runs, not just the 12 paid
  ones — a submission that only powers paid runs would show 12*32=384
  and a grand total of 1164, both wrong. Per-sack must be rounded to
  exactly 2 decimals (2.62), not truncated (2.61) or left unrounded.
  PASS phrasings: "14 * 32 = 448 power, grand 1228, 1228/469 = 2.62";
  "power on all runs = 448, per sack 2.62"; "1228 / 469 = 2.618 ~ 2.62".
  FAIL phrasings: "power only on paid runs, 12 * 32 = 384"; "grand total
  1164"; "1228/469 = 2.61" (truncated).
- **obj-4**: this is a check on whether the model can vary one
  assumption (capacity 40 vs 36) and redo the ceiling division cleanly;
  12 and "2 runs saved" are both required, not just one. PASS phrasings:
  "469/40 = 11.7 -> 12 runs, 14 - 12 = 2 fewer"; "ceil(469/40) = 12, a
  saving of 2 runs"; "12 runs, 2 fewer than 14". FAIL phrasings: "still
  14 runs, 0 saved"; "12 runs" with no comparison; "469/40 = 11.7 ~ 11
  runs, 3 saved".
- **obj-5**: run `wc -w ANSWERS.md` on the whole file.

### Subjective guidance

- **Working clarity**: each of the four answers should show the
  arithmetic that produced it (not just the final number), in an order
  a reader can re-derive by hand.
- **Trap navigation**: does the submission explicitly acknowledge the
  ballast-capacity constraint, the need to round up (not down), and the
  every-6th-run waiver, rather than silently landing on the right
  numbers by luck? Penalize a submission that gets correct numbers with
  working that doesn't actually justify them (e.g. rounds down but still
  writes 14).
- **Reasoning quality**: does REASONING.md name which of the three traps
  it had to watch for and how it double-checked itself (e.g.
  recomputing 1228/469 to confirm the second decimal)?
