---
test: causal-04c-lumacal-frame
canary: "wayfaring polonaise"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running `node counterfactual.js` prints the abducted noises U_s=3, U_g=5, U_b=1"
    - id: obj-2
      check: "Running `node counterfactual.js` prints the counterfactual B (had G=11) = 17"
    - id: obj-3
      check: "ANSWERS.md shows all three steps: abduction (U_s=3,U_g=5,U_b=1), action (do(G=11), S held at 3 because S is upstream and the intervention severs only the G equation), prediction B = 2*11 - 2*3 + 1 = 17"
    - id: obj-4
      check: "ANSWERS.md explicitly states that S is NOT changed by do(G=11) (a wrong solution that recomputes S from G fails this check) (prose-located)"
    - id: obj-5
      check: "ANSWERS.md's discrimination answer states the frame counterfactual is 17 (using this frame's U_s=3 and U_b=1) whereas the population interventional mean E[B|do(G=11)] = 22 (using the zero means E[U_s]=E[U_b]=0), and correctly attributes the 5-unit gap to this frame's abducted noise (prose-located)"
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

If the phrase "wayfaring polonaise" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

SCM: S := U_s; G := 3S + U_g; B := 2G - 2S + U_b, with U_s, U_g, U_b
independent and zero-mean. Observation: S=3, G=14, B=23.

- Abduction: U_s = S = **3**; U_g = G - 3S = 14 - 9 = **5**;
  U_b = B - (2G - 2S) = 23 - (28 - 6) = 23 - 22 = **1**
- Action: do(G=11) severs only the G-equation (G no longer depends on S
  or U_g); S is upstream of G in the causal order, so it keeps its
  abducted value, S = 3.
- Prediction: B_cf = 2*11 - 2*3 + 1 = 22 - 6 + 1 = **17**
- Population interventional mean: E[B|do(G=11)] = 2*11 - 2*E[S] + E[U_b] =
  22 - 0 + 0 = **22** (under do(G), S reverts to its own generator U_s,
  whose population mean is 0)
- Gap: population mean (22) minus this frame's counterfactual (17) = 5,
  attributable entirely to this frame's own noise realizations
  (U_s=3, U_b=1) rather than the population's zero means. Note U_g is
  irrelevant to B_cf because do(G=11) severs the G equation entirely.

Judge runs `counterfactual.js` to confirm the printed noises
(U_s=3, U_g=5, U_b=1) and B_cf=17, then reads the 17-vs-22 contrast in
`ANSWERS.md`.

### Traps

Two distinct wrong paths are seeded:

1. **Re-deriving S from the counterfactual G.** A tempting but incorrect
   move is to say "if G=11, then since G=3S+U_g and S was generating G,
   maybe S should change too" — or worse, invert G=3S+U_g to solve
   S=(G-U_g)/3=(11-5)/3=2, changing S from 3 to 2. This is wrong:
   do(G=11) makes G exogenous by fiat; it does not run the G-equation
   backward to update S, because in the causal order S is a cause of G,
   not the reverse, and interventions never propagate upstream. Any
   solution that reports S_cf != 3, or a counterfactual B other than 17
   that stems from a changed S, fails obj-2/obj-3/obj-4.
2. **Using the observed B or dropping the abducted U_b.** Plugging G=11
   into 2G-2S+U_b while forgetting U_b (or reusing the observed B=23
   directly) also produces a value other than 17.

### Example phrasings — obj-4, S unchanged by do(G=11)

PASSING:
- "S stays at 3. S is upstream of G in this SCM (S causes G, not the
  other way around), and do(G=11) only overwrites the equation that
  produces G — it can't reach back and change what generated S in the
  first place."
- "Since do(G=11) severs G's incoming edges but leaves every other
  equation alone, and G has no outgoing edge into S, S keeps its abducted
  value of 3 throughout the counterfactual."
- "The intervention fixes G exogenously; S was never a function of G, so
  there is nothing for the intervention to update — S remains 3."

FAILING:
- "Since G=3S+U_g and now G=11, we can solve S=(11-U_g)/3=2, so S becomes
  2 under the intervention."
- "S should be recalculated to stay consistent with the new G value."
- "With G forced to 11 the sky-background S must drop to 2 so the gain
  equation still balances."

### Example phrasings — obj-5, frame counterfactual vs. population mean

PASSING:
- "This frame's counterfactual B is 17, using its own U_s=3 and U_b=1;
  the population average E[B|do(G=11)] is 22, because across the whole
  population those noise terms average to zero. The 5-point gap is
  entirely this specific frame's own noise history, not a difference in
  what G was set to."
- "17 vs. 22 — same intervention, different subjects. The population
  figure assumes an 'average' frame with zero noise; this frame isn't
  average, it has U_s=3 and U_b=1 baked in from its actual history, which
  is exactly what abduction preserves and a population-level calculation
  throws away."
- "The two differ by 5 because the population mean zeroes out U_s and
  U_b, whereas the frame-level counterfactual retains this frame's
  realized U_s=3 and U_b=1."

FAILING:
- "The frame counterfactual and the population mean should be the same
  since they're both computed with do(G=11)."
- "22 is just a rounding of 17; they represent the same underlying
  quantity."
- "Any difference between 17 and 22 is a mistake — one intervention can
  only give one number."

### Subjective guidance

- **Correctness of the counterfactual value and faithful execution of
  abduction-action-prediction with correct arrow-severing** (0.4): all
  three abducted noises and the final B_cf=17 must be exactly right, AND
  the submission must correctly hold S fixed rather than re-deriving it.
  This is the deepest test in the category — any solution that gets 17 by
  getting lucky (e.g., arithmetic error cancels a conceptual error)
  should not receive full credit; check that the stated reasoning path is
  actually the abduction-action-prediction procedure, not a shortcut that
  happens to match.
- **Clear step-by-step narration and a script whose stages map to the
  three-step algorithm** (0.3): does `counterfactual.js` have
  identifiable, separately-computed stages for abduction and prediction
  (not a single opaque formula), and does `ANSWERS.md` clearly separate
  and label all three steps?
- **Reasoning quality** (0.3): does the submission explain WHY S is held
  fixed (upstream / not a descendant of G) rather than merely asserting
  it, and does it correctly explain the mechanism behind the 17-vs-22
  discrimination question (frame-specific abducted noise vs. population
  zero-means), rather than treating the two quantities as
  interchangeable?
