---
test: causal-03-genemark-do-operator
canary: "quartz citrine"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Running `node intervene.js` prints P(D=1|do(H=1)) = 0.62 (using the prior P(G))"
    - id: obj-2
      check: "Running `node intervene.js` prints P(D=1|H=1) = 0.7526 (0.7526315...) using the posterior P(G|H=1)"
    - id: obj-3
      check: "ANSWERS.md reports the observational value 0.7526 and interventional value 0.62 with the difference exactly 0.1326 (positive), and states the observational estimate is biased UPWARD (prose-located)"
    - id: obj-4
      check: "ANSWERS.md (a) shows the Bayes inversion, giving P(G=1|H=1)=0.6316 (12/19) used in the observational sum"
    - id: obj-5
      check: "ANSWERS.md (d) gives the backdoor adjustment set as {G} and states do(H) breaks the G->H edge so the intervention sums over the prior P(G), not P(G|H=1)"
  subjective:
    - id: sub-quality
      name: "Correctness of both probabilities and the observational-vs-interventional distinction"
      weight: 0.4
    - id: sub-craft
      name: "Faithful formula-to-code mapping and a clear explanation of why the two sums differ"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Correctness of both probabilities and the observational-vs-interventional distinction
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Faithful formula-to-code mapping and a clear explanation of why the two sums differ
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "quartz citrine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

CPTs: P(G=1)=0.3; P(H=1|G=1)=0.8, P(H=1|G=0)=0.2; P(D=1|H=1,G=1)=0.9,
P(D=1|H=1,G=0)=0.5, P(D=1|H=0,G=1)=0.4, P(D=1|H=0,G=0)=0.1.

- P(H=1) = 0.3*0.8 + 0.7*0.2 = 0.24 + 0.14 = **0.38**
- P(G=1|H=1) = 0.24/0.38 = **0.631578... ≈ 0.6316** (= 12/19)
- Observational P(D=1|H=1) = 0.9*0.6316 + 0.5*0.3684 = 0.56842 + 0.18421
  = **0.75263... ≈ 0.7526**
- Interventional P(D=1|do(H=1)) = 0.9*0.3 (prior P(G=1)) + 0.5*0.7
  (prior P(G=0)) = 0.27 + 0.35 = **0.62**
- Gap = 0.7526 - 0.62 = **0.1326** (positive — observational estimate
  is biased upward relative to the true causal effect)

Judge runs `intervene.js` to confirm both printed values (0.7526 and
0.62, or equivalently the exact fraction forms) and the difference.

Correct verdicts:
- (a) observational P(D=1|H=1) = 0.7526, via Bayes inversion
  P(G=1|H=1) = 12/19 ≈ 0.6316.
- (b) interventional P(D=1|do(H=1)) = 0.62, summing over the PRIOR
  P(G) because do(H) severs the G->H edge — an individual's Genotype no
  longer determines their (forced) Habit status under the intervention.
- (c) the gap is +0.1326; the observational quantity over-states
  (biases upward) the true causal effect of Habit on Disease, because
  people who naturally have the Habit are disproportionately the ones
  whose Genotype already predisposes them to the Habit (G=1, which also
  raises Disease risk directly) — confounding inflates the naive
  estimate.
- (d) backdoor adjustment set is {G}; conditioning on G (summed over
  its prior) and cutting the G->H edge is exactly what do(H=1)
  represents structurally.

### Trap

The test is built so the fluent, "obvious" analysis path — filter to
H=1, compute the Disease rate — produces a real, correctly computable
number (0.7526) that is nonetheless the WRONG answer to "does the habit
cause the disease, and by how much." The trap is presenting 0.7526 (or
any observational conditional) as the causal effect size. A submission
that computes both numbers correctly but then answers the "how much
does Habit cause Disease" framing with 0.7526 rather than 0.62 has
fallen into the trap and should fail obj-3 regardless of arithmetic
accuracy elsewhere.

### Example phrasings — obj-3, upward bias explanation

PASSING:
- "The observational 0.7526 overstates the causal effect versus the
  true interventional 0.62 — people who already have the habit are
  disproportionately high-genotype-risk individuals, so the naive
  filter bakes in genotype's direct effect on Disease on top of
  Habit's own effect."
- "0.7526 is inflated relative to 0.62 by +0.1326 because conditioning
  on H=1 pulls in more G=1 individuals than the population base rate,
  and G independently raises Disease risk — that confound has to be
  removed to see Habit's true causal contribution."

FAILING:
- "The two numbers are close enough that the difference doesn't
  matter — Habit clearly causes Disease at roughly a 75% rate."
- "0.7526 and 0.62 both roughly show Habit raises Disease risk, so it
  doesn't matter which one you use for the causal claim."

### Example phrasings — obj-5, backdoor set and edge-severing

PASSING:
- "The backdoor set is {G}. Structurally, do(H=1) deletes the G->H
  arrow and pins H=1 for everyone, so the sum has to run over G's own
  prior distribution (0.3/0.7) rather than the distribution of G among
  people who happened to already have the habit."
- "Adjusting for G alone blocks the only backdoor path H<-G->D; that's
  exactly what do(H) achieves mechanically by cutting incoming edges to
  H and forcing the summation onto P(G) instead of P(G|H=1)."

FAILING:
- "You'd need to adjust for G and D together to get the causal effect."
- "The backdoor set doesn't matter here since H and D are directly
  connected anyway."

### Subjective guidance

- **Correctness of both probabilities and the observational-vs-
  interventional distinction** (0.4): both numeric values must be
  exactly right (0.7526 and 0.62, matching the script), and the
  submission must correctly identify which one answers the causal
  question. A submission that swaps which number is "the causal
  effect" should score near zero here even with perfect arithmetic.
- **Faithful formula-to-code mapping and a clear explanation of why the
  two sums differ** (0.3): does `intervene.js` clearly compute the
  Bayes inversion and the two weighted sums as distinct, readable
  steps? Does `ANSWERS.md` explain, not just assert, why one sum uses
  P(G|H=1) and the other uses P(G)?
- **Reasoning quality** (0.3): does the submission articulate the
  mechanism of confounding bias here — that Genotype drives both the
  Habit and the Disease, so naively conditioning on Habit lets
  Genotype's direct effect leak into the estimate — rather than merely
  restating "there's a confounder"?
