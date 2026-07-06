---
test: causal-04b-sappledon-boil-counterfactual
canary: "spindletree bolero"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running `node counterfactual.js` prints the abducted noises U_d=6, U_b=1, U_s=-1"
    - id: obj-2
      check: "Running `node counterfactual.js` prints the counterfactual S (had B=13) = 31"
    - id: obj-3
      check: "ANSWERS.md shows all three steps: abduction (U_d=6,U_b=1,U_s=-1), action (do(B=13), D held at 6 because D is upstream and the intervention severs only the B equation), prediction S = 2*13 + 1*6 + (-1) = 31"
    - id: obj-4
      check: "ANSWERS.md explicitly states that D is NOT changed by do(B=13) (a wrong solution that recomputes D from B fails this check) (prose-located)"
    - id: obj-5
      check: "ANSWERS.md's discrimination answer states the unit counterfactual is 31 (using this batch's U_d=6 and U_s=-1) whereas the population interventional mean E[S|do(B=13)] = 26 (using the zero means E[U_d]=E[U_s]=0), and correctly attributes the 5-unit gap to this unit's abducted noise (prose-located)"
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
---

## Judge guidance

Parallel form of `causal-04-hydroyield-counterfactual` (same construct,
fresh surface).

If the phrase "spindletree bolero" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

SCM: D := U_d; B := 3D + U_b; S := 2B + D + U_s, with U_d, U_b, U_s
independent and zero-mean. Observation: D=6, B=19, S=43.

- Abduction: U_d = D = **6**; U_b = B - 3D = 19 - 18 = **1**;
  U_s = S - 2B - D = 43 - 38 - 6 = **-1**
- Action: do(B=13) severs only the B-equation (B no longer depends on D
  or U_b); D is upstream of B in the causal order, so it keeps its
  abducted value, D = 6.
- Prediction: S_cf = 2*13 + 6 + (-1) = 26 + 6 - 1 = **31**
- Population interventional mean: E[S|do(B=13)] = 2*13 + E[D] + E[U_s] =
  26 + 0 + 0 = **26** (under do(B), D reverts to its own generator U_d,
  whose population mean is 0)
- Gap: this unit's counterfactual (31) minus the population mean (26) =
  5, attributable entirely to this batch's own noise realizations
  (U_d=6, U_s=-1) rather than the population's zero means. Note U_b is
  irrelevant to S_cf because do(B=13) severs the B equation entirely.

Judge runs `counterfactual.js` to confirm the printed noises
(U_d=6, U_b=1, U_s=-1) and S_cf=31, then reads the 31-vs-26 contrast in
`ANSWERS.md`.

### Traps

Two distinct wrong paths are seeded:

1. **Re-deriving D from the counterfactual B.** A tempting but incorrect
   move is to say "if B=13, then since B=3D+U_b and D was generating B,
   maybe D should change too" — or worse, invert B=3D+U_b to solve
   D=(B-U_b)/3=(13-1)/3=4, changing D from 6 to 4. This is wrong:
   do(B=13) makes B exogenous by fiat; it does not run the B-equation
   backward to update D, because in the causal order D is a cause of B,
   not the reverse, and interventions never propagate upstream. Any
   solution that reports D_cf != 6, or a counterfactual S other than 31
   that stems from a changed D (e.g. S=29 from D=4), fails
   obj-2/obj-3/obj-4.
2. **Using the observed S or dropping the abducted U_s.** Plugging B=13
   into 2B+D+U_s while forgetting U_s (giving S=32) or reusing the
   observed S=43 directly also produces a value other than 31.

### Example phrasings — obj-4, D unchanged by do(B=13)

PASSING:
- "D stays at 6. D is upstream of B in this SCM (D causes B, not the
  other way around), and do(B=13) only overwrites the equation that
  produces B — it can't reach back and change what generated D in the
  first place."
- "Since do(B=13) severs B's incoming edges but leaves every other
  equation alone, and B has no outgoing edge into D, D keeps its
  abducted value of 6 throughout the counterfactual."
- "The intervention pins B at 13 and deletes B's structural equation; D
  is a parent of B, never a child, so nothing downstream can revise it —
  D remains 6."

FAILING:
- "Since B=3D+U_b and now B=13, we can solve D=(13-U_b)/3=4, so D becomes
  4 under the intervention."
- "D should be recalculated to stay consistent with the new B value."
- "Because B dropped from 19 to 13, D has to fall proportionally to keep
  the boil equation balanced."

### Example phrasings — obj-5, unit counterfactual vs. population mean

PASSING:
- "This batch's counterfactual S is 31, using its own U_d=6 and U_s=-1;
  the population average E[S|do(B=13)] is 26, because across the whole
  population those noise terms average to zero. The 5-point gap is
  entirely this specific batch's own noise history, not a difference in
  what B was set to."
- "31 vs. 26 — same intervention, different subjects. The population
  figure assumes an 'average' batch with zero noise; this batch isn't
  average, it has U_d=6 and U_s=-1 baked in from its actual history,
  which is exactly what abduction preserves and a population-level
  calculation throws away."
- "The unit value 31 sits 5 above the population mean 26 because this
  batch carries a high draft realization (U_d=6) plus U_s=-1; averaging
  over the population zeroes both out, leaving just 2*13=26."

FAILING:
- "The unit counterfactual and the population mean should be the same
  since they're both computed with do(B=13)."
- "26 is just a rounding of 31; they represent the same underlying
  quantity."
- "The gap comes from B being set differently in the two cases, not from
  this batch's noise."

### Subjective guidance

- **Correctness of the counterfactual value and faithful execution of
  abduction-action-prediction with correct arrow-severing** (0.4): all
  three abducted noises and the final S_cf=31 must be exactly right, AND
  the submission must correctly hold D fixed rather than re-deriving it.
  This is the deepest test in the category — any solution that gets 31
  by getting lucky (e.g., arithmetic error cancels a conceptual error)
  should not receive full credit; check that the stated reasoning path
  is actually the abduction-action-prediction procedure, not a shortcut
  that happens to match.
- **Clear step-by-step narration and a script whose stages map to the
  three-step algorithm** (0.3): does `counterfactual.js` have
  identifiable, separately-computed stages for abduction and prediction
  (not a single opaque formula), and does `ANSWERS.md` clearly separate
  and label all three steps?
- **Reasoning quality** (0.3): does the submission explain WHY D is held
  fixed (upstream / not a descendant of B) rather than merely asserting
  it, and does it correctly explain the mechanism behind the 31-vs-26
  discrimination question (unit-specific abducted noise vs. population
  zero-means), rather than treating the two quantities as
  interchangeable?
