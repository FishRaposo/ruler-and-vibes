---
test: causal-01-garden-dag
canary: "opal onyx"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md (a) states S is the confounder AND that R and K are NOT marginally independent (prose-located)"
    - id: obj-2
      check: "ANSWERS.md (b) states R is independent of K given S (conditionally independent), citing that S blocks the only path R<-S->K, a fork (prose-located)"
    - id: obj-3
      check: "ANSWERS.md (c) gives the backdoor adjustment set exactly as {S} and names the back-door path R<-S->K->W"
    - id: obj-4
      check: "ANSWERS.md (d) identifies W as a collider on R->W<-K and states that conditioning on W induces (opens) an association between R and K (prose-located)"
    - id: obj-5
      check: "Running `node verify.js` prints P(R=1)=0.45, P(K=1)=0.40, P(R=1,K=1)=0.075, and product=0.18, demonstrating 0.075 != 0.18 (marginal dependence)"
  subjective:
    - id: sub-quality
      name: "Correctness and completeness of the structural causal reasoning"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of path/blocking justifications and readable verification script"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "opal onyx" appears anywhere in a deliverable, that is a
canary leak — flag it regardless of how the rest of the checks score.

### Answer key (verified with node during authoring)

CPTs: P(S=1)=0.5; P(R=1|S=1)=0.8, P(R=1|S=0)=0.1; P(K=1|S=1)=0.1,
P(K=1|S=0)=0.7. R and K are conditionally independent given S (the CPTs
generate R and K independently once S is fixed).

- P(R=1) = 0.5*0.8 + 0.5*0.1 = **0.45**
- P(K=1) = 0.5*0.1 + 0.5*0.7 = **0.40**
- P(R=1,K=1) = 0.5*(0.8*0.1) + 0.5*(0.1*0.7) = 0.5*0.08 + 0.5*0.07 =
  **0.075**
- product = 0.45*0.40 = **0.18**
- 0.075 != 0.18, so R and K are marginally DEPENDENT despite being
  conditionally independent given S — this is the correct verdict for
  (a).

Correct verdicts:
- (a) confounder is S; R and K are marginally DEPENDENT (not
  independent) — the naive reflex of calling two variables
  "independent" because they share no direct edge is wrong here.
- (b) R and K ARE independent given S, because the only path between
  them, R<-S->K, is a fork and conditioning on the fork's root (S)
  blocks it.
- (c) backdoor adjustment set for the effect of R on W is {S}; it
  blocks the back-door path R<-S->K->W.
- (d) W is a collider on R->W<-K; conditioning on W OPENS (induces) an
  association between R and K that isn't there marginally-blocked —
  i.e., it creates a spurious dependence, the opposite of what
  conditioning does to a fork.

Judge runs `verify.js` to confirm the four printed numbers match
exactly (0.45, 0.40, 0.075, 0.18); the structural verdicts (a)-(d) are
checked by reading them against the DAG and CPTs above, not by running
code.

### Trap

The test is built so a data-analysis reflex gets (a) backwards: seeing
that R and K are conditionally independent given S (true, and the
correct answer to (b)) invites the mistaken leap that R and K are
therefore independent, full stop — ignoring that the marginal
(unconditional) relationship is the opposite. A submission that
answers (a) with "R and K are independent" (marginally) has fallen into
this trap and should fail obj-1 even if (b) is otherwise correct.
Likewise, (d) tests whether the submission understands that
conditioning on a collider (W) does the opposite of conditioning on a
fork (S) — opening rather than closing an association — rather than
applying a blanket "conditioning always removes confounding" rule.

### Example phrasings — obj-1, marginal dependence of R and K

PASSING:
- "R and K are not independent overall — Season drives both of them in
  opposite directions, so seeing more rain still shifts the odds on
  sprinkler use even before you condition on anything."
- "Unconditionally, R and K are dependent; S is the common cause behind
  both, which shows up as a real (if confounded) correlation between
  them."

FAILING:
- "R and K are independent since there's no direct edge between them."
- "Because R and K are independent given S, they're independent,
  period."

### Example phrasings — obj-2, R independent of K given S

PASSING:
- "Once you fix the season, R and K become independent: the only path
  connecting them, R<-S->K, is a fork, and conditioning on its root S
  blocks it."
- "Given S, there's no remaining association between R and K — S is a
  common cause (fork), so holding it constant screens off the two."

FAILING:
- "R and K stay dependent even after conditioning on S." (wrong: the
  fork is blocked once S is fixed)
- "They're independent given S because W lies between them." (wrong
  mechanism: cites the collider W, not the fork at S; the blocking path
  is R<-S->K, not anything through W).

### Example phrasings — obj-4, collider opens association

PASSING:
- "W is a collider here — R and K both point into it — so if you
  condition on the wet path, you'll manufacture an association between
  rain and sprinkler use that isn't there marginally (given S)."
- "Conditioning on W has the opposite effect of conditioning on S: it
  opens up a spurious R-K link rather than closing one down."

FAILING:
- "W is a mediator, so conditioning on it blocks the R-K path like any
  other control variable would."
- "Since W is downstream of both R and K, conditioning on it has no
  effect on their relationship."

### Subjective guidance

- **Correctness and completeness of the structural causal reasoning**
  (0.4): all four verdicts must be correct and each must name the
  specific mechanism (fork/collider/backdoor path), not just assert a
  conclusion. Missing or reversing any one of (a)-(d) should cap this
  dimension well below full marks — especially reversing the marginal
  vs. conditional independence direction in (a)/(b), and reversing the
  collider-opens vs. fork-closes distinction in (d).
- **Clarity of path/blocking justifications and readable verification
  script** (0.3): does each answer name the actual path (e.g.
  R<-S->K, R->W<-K) rather than gesturing vaguely at "confounding"?
  Is `verify.js` a clean, direct encoding of the CPTs with readable
  variable names, not an opaque one-liner?
- **Reasoning quality** (0.3): does the submission explain, in its own
  words, why conditioning on a fork's root blocks a path while
  conditioning on a collider opens one — showing it understands the
  underlying rule rather than pattern-matching the specific graph
  shown here?
