---
test: causal-03c-kilnford-quench-do
canary: "dogwood belvedere"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Running `node intervene.js` prints P(C=1|do(Q=1)) = 0.5900 (using the prior P(M))"
    - id: obj-2
      check: "Running `node intervene.js` prints P(C=1|Q=1) = 0.6833 (0.683333...) using the posterior P(M|Q=1)"
    - id: obj-3
      check: "ANSWERS.md reports the observational value 0.6833 and interventional value 0.5900 with the difference exactly 0.0933 (positive), and states the observational estimate is biased UPWARD (prose-located)"
    - id: obj-4
      check: "ANSWERS.md (a) shows the Bayes inversion, giving P(M=1|Q=1)=0.6667 (2/3) used in the observational sum"
    - id: obj-5
      check: "ANSWERS.md (d) gives the backdoor adjustment set as {M} and states do(Q) breaks the M->Q edge so the intervention sums over the prior P(M), not P(M|Q=1)"
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

If the phrase "dogwood belvedere" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

CPTs: P(M=1)=0.40; P(Q=1|M=1)=0.75, P(Q=1|M=0)=0.25; P(C=1|Q=1,M=1)=0.80,
P(C=1|Q=1,M=0)=0.45, P(C=1|Q=0,M=1)=0.35, P(C=1|Q=0,M=0)=0.10.

- P(Q=1) = 0.40*0.75 + 0.60*0.25 = 0.30 + 0.15 = **0.45**
- P(M=1|Q=1) = 0.30/0.45 = **0.666666... ≈ 0.6667** (= 2/3)
- Observational P(C=1|Q=1) = 0.80*0.6667 + 0.45*0.3333 = 0.53336 +
  0.14999 = **0.68333... ≈ 0.6833**
- Interventional P(C=1|do(Q=1)) = 0.80*0.40 (prior P(M=1)) + 0.45*0.60
  (prior P(M=0)) = 0.32 + 0.27 = **0.5900**
- Gap = 0.6833 - 0.5900 = **0.0933** (positive — observational estimate
  is biased upward relative to the true causal effect)

Judge runs `intervene.js` to confirm both printed values (0.6833 and
0.5900, or equivalently the exact fraction forms) and the difference.

Correct verdicts:
- (a) observational P(C=1|Q=1) = 0.6833, via Bayes inversion
  P(M=1|Q=1) = 2/3 ≈ 0.6667.
- (b) interventional P(C=1|do(Q=1)) = 0.5900, summing over the PRIOR
  P(M) because do(Q) severs the M->Q edge — a part's Melt-grade no
  longer determines its (forced) Quench-treatment status under the
  intervention.
- (c) the gap is +0.0933; the observational quantity over-states
  (biases upward) the true causal effect of Quench-treatment on
  Cracking, because parts that actually received the quench are
  disproportionately the ones cast from a premium melt (M=1, which also
  raises Crack risk directly) — confounding inflates the naive estimate.
- (d) backdoor adjustment set is {M}; conditioning on M (summed over its
  prior) and cutting the M->Q edge is exactly what do(Q=1) represents
  structurally.

### Trap

The test is built so the fluent, "obvious" analysis path — filter to
Q=1, compute the Crack rate — produces a real, correctly computable
number (0.6833) that is nonetheless the WRONG answer to "does the quench
cause the crack, and by how much." The trap is presenting 0.6833 (or any
observational conditional) as the causal effect size. A submission that
computes both numbers correctly but then answers the "how much does
Quench cause Cracking" framing with 0.6833 rather than 0.5900 has fallen
into the trap and should fail obj-3 regardless of arithmetic accuracy
elsewhere.

### Example phrasings — obj-3, upward bias explanation

PASSING:
- "The observational 0.6833 overstates the causal effect versus the true
  interventional 0.5900 — parts that already received the quench are
  disproportionately premium-melt parts, so the naive filter bakes in
  the melt-grade's direct effect on Cracking on top of the quench's own
  effect."
- "0.6833 is inflated relative to 0.5900 by +0.0933 because conditioning
  on Q=1 pulls in more M=1 parts than the population base rate, and M
  independently raises Crack risk — that confound has to be removed to
  see the Quench's true causal contribution."
- "Because premium melts both attract the quench step and crack more on
  their own, filtering to Q=1 mixes the quench's effect with melt-grade
  bias; the +0.0933 gap is that upward inflation, and 0.5900 is the
  debiased causal number."

FAILING:
- "The two numbers are close enough that the difference doesn't matter —
  the quench clearly causes cracking at roughly a 68% rate."
- "0.6833 and 0.5900 both roughly show the quench raises crack risk, so
  it doesn't matter which one you use for the causal claim."
- "The observational value understates the effect, so 0.5900 is the
  conservative causal estimate."

### Example phrasings — obj-5, backdoor set and edge-severing

PASSING:
- "The backdoor set is {M}. Structurally, do(Q=1) deletes the M->Q arrow
  and pins Q=1 for every part, so the sum has to run over M's own prior
  distribution (0.40/0.60) rather than the distribution of M among parts
  that happened to already receive the quench."
- "Adjusting for M alone blocks the only backdoor path Q<-M->C; that's
  exactly what do(Q) achieves mechanically by cutting incoming edges to
  Q and forcing the summation onto P(M) instead of P(M|Q=1)."
- "You adjust for {M}: intervening on Q means overriding the M->Q
  mechanism, which is why the do-sum weights by the prior P(M) and not
  by the quench-selected posterior."

FAILING:
- "You'd need to adjust for M and C together to get the causal effect."
- "The backdoor set doesn't matter here since Q and C are directly
  connected anyway."
- "Adjust for Q itself, since Q is the treatment whose effect we want."

### Subjective guidance

- **Correctness of both probabilities and the observational-vs-
  interventional distinction** (0.4): both numeric values must be
  exactly right (0.6833 and 0.5900, matching the script), and the
  submission must correctly identify which one answers the causal
  question. A submission that swaps which number is "the causal effect"
  should score near zero here even with perfect arithmetic.
- **Faithful formula-to-code mapping and a clear explanation of why the
  two sums differ** (0.3): does `intervene.js` clearly compute the Bayes
  inversion and the two weighted sums as distinct, readable steps? Does
  `ANSWERS.md` explain, not just assert, why one sum uses P(M|Q=1) and
  the other uses P(M)?
- **Reasoning quality** (0.3): does the submission articulate the
  mechanism of confounding bias here — that Melt-grade drives both the
  Quench-treatment and the Cracking, so naively conditioning on the
  quench lets the melt-grade's direct effect leak into the estimate —
  rather than merely restating "there's a confounder"?
