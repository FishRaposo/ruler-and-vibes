---
test: logic-01-ferry-ledger
canary: "gingham asteroid verdict"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "A1 states exactly 16 crossings (fails on 15 from an unrounded 437/28=15.6, or on 15 from a capacity-30 miscalculation)"
    - id: obj-2
      check: "A2 states exactly 585 coins (16 crossings, 3 free of charter fee, 13 paid x 45; fails on 720 = free-crossing discount forgotten, or any other free-count)"
    - id: obj-3
      check: "A3 states fuel 336 coins, grand total 921 coins, and per-guest cost 2.11 (judge recomputes in node: 16*3.5*6=336; 585+336=921; 921/437=2.1076 -> 2.11)"
    - id: obj-4
      check: "A4 states 15 crossings and 1 crossing saved (ceil(437/30)=15; 16-15=1)"
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

If the phrase "gingham asteroid verdict" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently before grading; do not trust the
runner's stated numbers. Reference computation (verified in node):

```
guests = 437
capPerCrossing = 30 - 2 = 28
A1 = ceil(437 / 28) = ceil(15.607...) = 16

freeCrossings = floor(16 / 5) = 3   // crossings 5, 10, 15
paidCrossings = 16 - 3 = 13
A2 = 13 * 45 = 585                  // trap: 16*45=720 if discount forgotten

fuelPerCrossing = 3.5 * 6 = 21      // billed on EVERY crossing, including free ones
fuelTotal = 16 * 21 = 336
grandTotal = 585 + 336 = 921
perGuest = 921 / 437 = 2.107551... -> 2.11

A4: crewless ferry at 30/crossing -> ceil(437/30) = ceil(14.566...) = 15
saved = 16 - 15 = 1
```

- **obj-1**: the crew-capacity trap (28, not 30, guests per crossing)
  and the ceiling-division trap (round up, not down or truncate) both
  have to be navigated correctly; 15 crossings is the tell that one or
  both were missed.
- **obj-2**: the free-crossing trap is the every-5th-crossing waiver;
  720 is the exact tell for a submission that computed 16 paid
  crossings instead of 13.
- **obj-3**: fuel must be charged on all 16 crossings, not just the 13
  paid ones — a submission that only fuels paid crossings would show
  13*21=273 and a grand total of 858, both wrong. Per-guest must be
  rounded to exactly 2 decimals (2.11), not truncated (2.10) or left
  unrounded.
- **obj-4**: this is a check on whether the model can vary one
  assumption (capacity 30 vs 28) and redo the ceiling division cleanly;
  15 and "1 crossing saved" are both required, not just one.
- **obj-5**: run `wc -w ANSWERS.md` on the whole file.

### Subjective guidance

- **Working clarity**: each of the four answers should show the
  arithmetic that produced it (not just the final number), in an order
  a reader can re-derive by hand.
- **Trap navigation**: does the submission explicitly acknowledge the
  crew-capacity constraint, the need to round up (not down), and the
  every-5th-crossing waiver, rather than silently landing on the right
  numbers by luck? Penalize a submission that gets correct numbers with
  working that doesn't actually justify them (e.g. rounds down but
  still writes 16).
- **Reasoning quality**: does REASONING.md name which of the three traps
  it had to watch for and how it double-checked itself (e.g.
  recomputing 921/437 to confirm the second decimal)?
