---
test: causal-04-hydroyield-counterfactual
canary: "tanzanite malachite"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running `node counterfactual.js` prints the abducted noises U_z=4, U_x=2, U_y=-1"
    - id: obj-2
      check: "Running `node counterfactual.js` prints the counterfactual Y (had X=6) = 13"
    - id: obj-3
      check: "ANSWERS.md shows all three steps: abduction (U_z=4,U_x=2,U_y=-1), action (do(X=6), Z held at 4 because Z is upstream and the intervention severs only the X equation), prediction Y = 3*6 - 1*4 + (-1) = 13"
    - id: obj-4
      check: "ANSWERS.md explicitly states that Z is NOT changed by do(X=6) (a wrong solution that recomputes Z from X fails this check) (prose-located)"
    - id: obj-5
      check: "ANSWERS.md's discrimination answer states the unit counterfactual is 13 (using this plot's U_z=4 and U_y=-1) whereas the population interventional mean E[Y|do(X=6)] = 18 (using the zero means E[U_z]=E[U_y]=0), and correctly attributes the 5-unit gap to this unit's abducted noise (prose-located)"
  subjective:
    - id: sub-quality
      name: "Correctness of the counterfactual value and faithful execution of abduction-action-prediction with correct arrow-severing"
      weight: 0.4
    - id: sub-craft
      name: "Clear step-by-step narration and a script whose stages map to the three-step algorithm"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Correctness of the counterfactual value and faithful execution of abduction-action-prediction with correct arrow-severing
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Clear step-by-step narration and a script whose stages map to the three-step algorithm
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "tanzanite malachite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

SCM: Z := U_z; X := 2Z + U_x; Y := 3X - Z + U_y, with U_z, U_x, U_y
independent and zero-mean. Observation: Z=4, X=10, Y=25.

- Abduction: U_z = Z = **4**; U_x = X - 2Z = 10 - 8 = **2**;
  U_y = Y - 3X + Z = 25 - 30 + 4 = **-1**
- Action: do(X=6) severs only the X-equation (X no longer depends on Z
  or U_x); Z is upstream of X in the causal order, so it keeps its
  abducted value, Z = 4.
- Prediction: Y_cf = 3*6 - 4 + (-1) = 18 - 4 - 1 = **13**
- Population interventional mean: E[Y|do(X=6)] = 3*6 - E[Z] + E[U_y] =
  18 - 0 + 0 = **18** (under do(X), Z reverts to its own generator U_z,
  whose population mean is 0)
- Gap: population mean (18) minus this unit's counterfactual (13) = 5,
  attributable entirely to this plot's own noise realizations
  (U_z=4, U_y=-1) rather than the population's zero means. Note U_x is
  irrelevant to Y_cf because do(X=6) severs the X equation entirely.

Judge runs `counterfactual.js` to confirm the printed noises
(U_z=4, U_x=2, U_y=-1) and Y_cf=13, then reads the 13-vs-18 contrast in
`ANSWERS.md`.

### Traps

Two distinct wrong paths are seeded:

1. **Re-deriving Z from the counterfactual X.** A tempting but
   incorrect move is to say "if X=6, then since X=2Z+U_x and Z was
   generating X, maybe Z should change too" — or worse, invert
   X=2Z+U_x to solve Z=(X-U_x)/2=(6-2)/2=2, changing Z from 4 to 2. This
   is wrong: do(X=6) makes X exogenous by fiat; it does not run the
   X-equation backward to update Z, because in the causal order Z is a
   cause of X, not the reverse, and interventions never propagate
   upstream. Any solution that reports Z_cf != 4, or a counterfactual Y
   other than 13 that stems from a changed Z, fails obj-2/obj-3/obj-4.
2. **Using the observed Y or dropping the abducted U_y.** Plugging
   X=6 into 3X-Z+U_y while forgetting U_y (or reusing the observed
   Y=25 directly) also produces a value other than 13.

### Example phrasings — obj-4, Z unchanged by do(X=6)

PASSING:
- "Z stays at 4. Z is upstream of X in this SCM (Z causes X, not the
  other way around), and do(X=6) only overwrites the equation that
  produces X — it can't reach back and change what generated Z in the
  first place."
- "Since do(X=6) severs X's incoming edges but leaves every other
  equation alone, and X has no outgoing edge into Z, Z keeps its
  abducted value of 4 throughout the counterfactual."

FAILING:
- "Since X=2Z+U_x and now X=6, we can solve Z=(6-U_x)/2=2, so Z becomes
  2 under the intervention."
- "Z should be recalculated to stay consistent with the new X value."

### Example phrasings — obj-5, unit counterfactual vs. population mean

PASSING:
- "This plot's counterfactual Y is 13, using its own U_z=4 and U_y=-1;
  the population average E[Y|do(X=6)] is 18, because across the whole
  population those noise terms average to zero. The 5-point gap is
  entirely this specific plot's own noise history, not a difference in
  what X was set to."
- "13 vs. 18 — same intervention, different subjects. The population
  figure assumes an 'average' unit with zero noise; this plot isn't
  average, it has U_z=4 and U_y=-1 baked in from its actual history,
  which is exactly what abduction preserves and a population-level
  calculation throws away."

FAILING:
- "The unit counterfactual and the population mean should be the same
  since they're both computed with do(X=6)."
- "18 is just a rounding of 13; they represent the same underlying
  quantity."

### Subjective guidance

- **Correctness of the counterfactual value and faithful execution of
  abduction-action-prediction with correct arrow-severing** (0.4): all
  three abducted noises and the final Y_cf=13 must be exactly right,
  AND the submission must correctly hold Z fixed rather than
  re-deriving it. This is the deepest test in the category — any
  solution that gets 13 by getting lucky (e.g., arithmetic error
  cancels a conceptual error) should not receive full credit; check
  that the stated reasoning path is actually the abduction-action-
  prediction procedure, not a shortcut that happens to match.
- **Clear step-by-step narration and a script whose stages map to the
  three-step algorithm** (0.3): does `counterfactual.js` have
  identifiable, separately-computed stages for abduction and
  prediction (not a single opaque formula), and does `ANSWERS.md`
  clearly separate and label all three steps?
- **Reasoning quality** (0.3): does the submission explain WHY Z is
  held fixed (upstream / not a descendant of X) rather than merely
  asserting it, and does it correctly explain the mechanism behind the
  13-vs-18 discrimination question (unit-specific abducted noise vs.
  population zero-means), rather than treating the two quantities as
  interchangeable?
