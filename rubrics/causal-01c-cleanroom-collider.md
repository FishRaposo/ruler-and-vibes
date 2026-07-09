---
test: causal-01c-cleanroom-collider
canary: "treecreeper coley"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md (a) states N is the confounder AND that H and V are NOT marginally independent (prose-located)"
    - id: obj-2
      check: "ANSWERS.md (b) states H is independent of V given N (conditionally independent), citing that N blocks the only path H<-N->V, a fork (prose-located)"
    - id: obj-3
      check: "ANSWERS.md (c) gives the backdoor adjustment set exactly as {N} and names the back-door path H<-N->V->D"
    - id: obj-4
      check: "ANSWERS.md (d) identifies D as a collider on H->D<-V and states that conditioning on D induces (opens) an association between H and V (prose-located)"
    - id: obj-5
      check: "Running `node verify.js` prints P(H=1)=0.38, P(V=1)=0.55, P(H=1,V=1)=0.128, and product=0.209, demonstrating 0.128 != 0.209 (marginal dependence)"
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
anchors:
  - id: Correctness and completeness of the structural causal reasoning
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.
  - id: Clarity of path/blocking justifications and readable verification script
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `causal-01-garden-dag` (same construct, fresh surface).

If the phrase "treecreeper coley" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

CPTs: P(N=1)=0.4; P(H=1|N=1)=0.65, P(H=1|N=0)=0.20; P(V=1|N=1)=0.10,
P(V=1|N=0)=0.85. H and V are conditionally independent given N (the CPTs
generate H and V independently once N is fixed).

- P(H=1) = 0.4*0.65 + 0.6*0.20 = **0.38**
- P(V=1) = 0.4*0.10 + 0.6*0.85 = **0.55**
- P(H=1,V=1) = 0.4*(0.65*0.10) + 0.6*(0.20*0.85) = 0.4*0.065 +
  0.6*0.17 = **0.128**
- product = 0.38*0.55 = **0.209**
- 0.128 != 0.209, so H and V are marginally DEPENDENT despite being
  conditionally independent given N — this is the correct verdict for
  (a).

Correct verdicts:
- (a) confounder is N; H and V are marginally DEPENDENT (not
  independent) — the naive reflex of calling two variables
  "independent" because they share no direct edge is wrong here.
- (b) H and V ARE independent given N, because the only path between
  them, H<-N->V, is a fork and conditioning on the fork's root (N)
  blocks it.
- (c) backdoor adjustment set for the effect of H on D is {N}; it
  blocks the back-door path H<-N->V->D.
- (d) D is a collider on H->D<-V; conditioning on D OPENS (induces) an
  association between H and V that isn't there marginally-blocked —
  i.e., it creates a spurious dependence, the opposite of what
  conditioning does to a fork.

Judge runs `verify.js` to confirm the four printed numbers match
exactly (0.38, 0.55, 0.128, 0.209); the structural verdicts (a)-(d) are
checked by reading them against the DAG and CPTs above, not by running
code.

### Trap

The test is built so a data-analysis reflex gets (a) backwards: seeing
that H and V are conditionally independent given N (true, and the
correct answer to (b)) invites the mistaken leap that H and V are
therefore independent, full stop — ignoring that the marginal
(unconditional) relationship is the opposite. A submission that
answers (a) with "H and V are independent" (marginally) has fallen into
this trap and should fail obj-1 even if (b) is otherwise correct.
Likewise, (d) tests whether the submission understands that
conditioning on a collider (D) does the opposite of conditioning on a
fork (N) — opening rather than closing an association — rather than
applying a blanket "conditioning always removes confounding" rule.

### Example phrasings — obj-1, marginal dependence of H and V

PASSING:
- "H and V are not independent overall — the shift drives both of them
  in opposite directions, so seeing a humid bay still shifts the odds
  on the ventilation boost even before you condition on anything."
- "Unconditionally, H and V are dependent; N is the common cause behind
  both, which shows up as a real (if confounded) correlation between
  them."
- "They are marginally dependent: N is a confounder, so H and V carry a
  spurious association until you hold the shift fixed."

FAILING:
- "H and V are independent since there's no direct edge between them."
- "Because H and V are independent given N, they're independent,
  period."
- "There's no arrow from H to V, so the two are unrelated marginally."

### Example phrasings — obj-2, H independent of V given N

PASSING:
- "Once you fix the shift, H and V become independent: the only path
  connecting them, H<-N->V, is a fork, and conditioning on its root N
  blocks it."
- "Given N, there's no remaining association between H and V — N is a
  common cause (fork), so holding it constant screens off the two."
- "Condition on N and the fork H<-N->V is blocked, leaving H and V
  independent within each shift."

FAILING:
- "H and V stay dependent even after conditioning on N." (wrong: the
  fork is blocked once N is fixed)
- "They're independent given N because D lies between them." (wrong
  mechanism: cites the collider D, not the fork at N; the blocking path
  is H<-N->V, not anything through D)
- "Conditioning on N opens the path, so H and V are dependent given N."
  (wrong: conditioning on a fork's root closes it, it does not open it)

### Example phrasings — obj-4, collider opens association

PASSING:
- "D is a collider here — H and V both point into it — so if you
  condition on the defect, you'll manufacture an association between
  humidity and ventilation that isn't there marginally (given N)."
- "Conditioning on D has the opposite effect of conditioning on N: it
  opens up a spurious H-V link rather than closing one down."
- "D is where H and V collide; selecting on it induces a dependence
  between the two parents that the fork alone would not."

FAILING:
- "D is a mediator, so conditioning on it blocks the H-V path like any
  other control variable would."
- "Since D is downstream of both H and V, conditioning on it has no
  effect on their relationship."
- "D is a collider, so conditioning on it further removes any H-V
  association." (wrong direction: it opens, not closes)

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
  H<-N->V, H->D<-V) rather than gesturing vaguely at "confounding"?
  Is `verify.js` a clean, direct encoding of the CPTs with readable
  variable names, not an opaque one-liner?
- **Reasoning quality** (0.3): does the submission explain, in its own
  words, why conditioning on a fork's root blocks a path while
  conditioning on a collider opens one — showing it understands the
  underlying rule rather than pattern-matching the specific graph
  shown here?
