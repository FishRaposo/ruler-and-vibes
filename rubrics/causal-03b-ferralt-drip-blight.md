---
test: causal-03b-ferralt-drip-blight
canary: "buckthorn pergola"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Running `node intervene.js` prints P(B=1|do(R=1)) = 0.6725 (using the prior P(S))"
    - id: obj-2
      check: "Running `node intervene.js` prints P(B=1|R=1) = 0.8136 (0.8136075...) using the posterior P(S|R=1)"
    - id: obj-3
      check: "ANSWERS.md reports the observational value 0.8136 and interventional value 0.6725 with the difference exactly 0.1411 (positive), and states the observational estimate is biased UPWARD (prose-located)"
    - id: obj-4
      check: "ANSWERS.md (a) shows the Bayes inversion, giving P(S=1|R=1)=0.7532 (119/158) used in the observational sum"
    - id: obj-5
      check: "ANSWERS.md (d) gives the backdoor adjustment set as {S} and states do(R) breaks the S->R edge so the intervention sums over the prior P(S), not P(S|R=1)"
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

Parallel form of `causal-03-genemark-do-operator` (same construct, fresh
surface).

If the phrase "buckthorn pergola" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

CPTs: P(S=1)=0.35; P(R=1|S=1)=0.85, P(R=1|S=0)=0.15; P(B=1|R=1,S=1)=0.90,
P(B=1|R=1,S=0)=0.55, P(B=1|R=0,S=1)=0.30, P(B=1|R=0,S=0)=0.05.

- P(R=1) = 0.35*0.85 + 0.65*0.15 = 0.2975 + 0.0975 = **0.3950**
- P(S=1|R=1) = 0.2975/0.3950 = **0.753164... ≈ 0.7532** (= 119/158)
- Observational P(B=1|R=1) = 0.9*0.7532 + 0.55*0.2468 = 0.67785 + 0.13576
  = **0.81361... ≈ 0.8136**
- Interventional P(B=1|do(R=1)) = 0.9*0.35 (prior P(S=1)) + 0.55*0.65
  (prior P(S=0)) = 0.315 + 0.3575 = **0.6725**
- Gap = 0.8136 - 0.6725 = **0.1411** (positive — observational estimate
  is biased upward relative to the true causal effect)

Judge runs `intervene.js` to confirm both printed values (0.8136 and
0.6725, or equivalently the exact fraction forms) and the difference.

Correct verdicts:
- (a) observational P(B=1|R=1) = 0.8136, via Bayes inversion
  P(S=1|R=1) = 119/158 ≈ 0.7532.
- (b) interventional P(B=1|do(R=1)) = 0.6725, summing over the PRIOR
  P(S) because do(R) severs the S->R edge — a block's Subsoil no longer
  determines its (forced) Retrofit status under the intervention.
- (c) the gap is +0.1411; the observational quantity over-states
  (biases upward) the true causal effect of the Retrofit on Blight,
  because blocks that naturally receive the Retrofit are
  disproportionately the ones whose Subsoil already predisposes them to
  the Retrofit (S=1, which also raises Blight risk directly) —
  confounding inflates the naive estimate.
- (d) backdoor adjustment set is {S}; conditioning on S (summed over
  its prior) and cutting the S->R edge is exactly what do(R=1)
  represents structurally.

### Trap

The test is built so the fluent, "obvious" analysis path — filter to
R=1, compute the Blight rate — produces a real, correctly computable
number (0.8136) that is nonetheless the WRONG answer to "does the drip
retrofit cause the blight, and by how much." The trap is presenting
0.8136 (or any observational conditional) as the causal effect size. A
submission that computes both numbers correctly but then answers the
"how much does the Retrofit cause Blight" framing with 0.8136 rather
than 0.6725 has fallen into the trap and should fail obj-3 regardless of
arithmetic accuracy elsewhere.

### Example phrasings — obj-3, upward bias explanation

PASSING:
- "The observational 0.8136 overstates the causal effect versus the
  true interventional 0.6725 — blocks that already have the retrofit are
  disproportionately high-subsoil-risk blocks, so the naive filter bakes
  in subsoil's direct effect on Blight on top of the Retrofit's own
  effect."
- "0.8136 is inflated relative to 0.6725 by +0.1411 because conditioning
  on R=1 pulls in more S=1 blocks than the population base rate, and S
  independently raises Blight risk — that confound has to be removed to
  see the Retrofit's true causal contribution."
- "The naive conditional runs +0.1411 high: filtering on R=1 selects a
  subsoil-enriched subpopulation, and since S drives Blight directly,
  the observational figure double-counts subsoil's contribution as if it
  were the Retrofit's."

FAILING:
- "The two numbers are close enough that the difference doesn't
  matter — the retrofit clearly causes blight at roughly an 81% rate."
- "0.8136 and 0.6725 both roughly show the retrofit raises blight risk,
  so it doesn't matter which one you use for the causal claim."
- "The observational number is lower than the interventional one, so
  filtering on R=1 understates the retrofit's true effect."

### Example phrasings — obj-5, backdoor set and edge-severing

PASSING:
- "The backdoor set is {S}. Structurally, do(R=1) deletes the S->R arrow
  and pins R=1 for every block, so the sum has to run over S's own prior
  distribution (0.35/0.65) rather than the distribution of S among
  blocks that happened to already have the retrofit."
- "Adjusting for S alone blocks the only backdoor path R<-S->B; that's
  exactly what do(R) achieves mechanically by cutting incoming edges to
  R and forcing the summation onto P(S) instead of P(S|R=1)."
- "Minimal adjustment set: {S}. Intervening severs S->R, so R no longer
  carries information about S; the weights revert to the prior P(S),
  which is what conditioning-plus-adjusting-on-S reproduces."

FAILING:
- "You'd need to adjust for S and B together to get the causal effect."
- "The backdoor set doesn't matter here since R and B are directly
  connected anyway."
- "Adjust for R itself — that's the variable we're intervening on."

### Subjective guidance

- **Correctness of both probabilities and the observational-vs-
  interventional distinction** (0.4): both numeric values must be
  exactly right (0.8136 and 0.6725, matching the script), and the
  submission must correctly identify which one answers the causal
  question. A submission that swaps which number is "the causal
  effect" should score near zero here even with perfect arithmetic.
- **Faithful formula-to-code mapping and a clear explanation of why the
  two sums differ** (0.3): does `intervene.js` clearly compute the
  Bayes inversion and the two weighted sums as distinct, readable
  steps? Does `ANSWERS.md` explain, not just assert, why one sum uses
  P(S|R=1) and the other uses P(S)?
- **Reasoning quality** (0.3): does the submission articulate the
  mechanism of confounding bias here — that Subsoil drives both the
  Retrofit and the Blight, so naively conditioning on the Retrofit lets
  Subsoil's direct effect leak into the estimate — rather than merely
  restating "there's a confounder"?
