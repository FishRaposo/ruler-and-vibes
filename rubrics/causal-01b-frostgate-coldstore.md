---
test: causal-01b-frostgate-coldstore
canary: "nuthatch pollack"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md (a) states D is the confounder AND that C and B are NOT marginally independent (prose-located)"
    - id: obj-2
      check: "ANSWERS.md (b) states C is independent of B given D (conditionally independent), citing that D blocks the only path C<-D->B, a fork (prose-located)"
    - id: obj-3
      check: "ANSWERS.md (c) gives the backdoor adjustment set exactly as {D} and names the back-door path C<-D->B->F"
    - id: obj-4
      check: "ANSWERS.md (d) identifies F as a collider on C->F<-B and states that conditioning on F induces (opens) an association between C and B (prose-located)"
    - id: obj-5
      check: "Running `node verify.js` prints P(C=1)=0.33, P(B=1)=0.48, P(C=1,B=1)=0.066, and product=0.1584, demonstrating 0.066 != 0.1584 (marginal dependence)"
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

Parallel form of `causal-01-garden-dag` (same construct, fresh surface).

If the phrase "nuthatch pollack" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

CPTs: P(D=1)=0.4; P(C=1|D=1)=0.75, P(C=1|D=0)=0.05; P(B=1|D=1)=0.15,
P(B=1|D=0)=0.70. C and B are conditionally independent given D (the CPTs
generate C and B independently once D is fixed).

- P(C=1) = 0.4*0.75 + 0.6*0.05 = **0.33**
- P(B=1) = 0.4*0.15 + 0.6*0.70 = **0.48**
- P(C=1,B=1) = 0.4*(0.75*0.15) + 0.6*(0.05*0.70) = 0.4*0.1125 +
  0.6*0.035 = **0.066**
- product = 0.33*0.48 = **0.1584**
- 0.066 != 0.1584, so C and B are marginally DEPENDENT despite being
  conditionally independent given D — this is the correct verdict for
  (a).

Correct verdicts:
- (a) confounder is D; C and B are marginally DEPENDENT (not
  independent) — the naive reflex of calling two variables
  "independent" because they share no direct edge is wrong here.
- (b) C and B ARE independent given D, because the only path between
  them, C<-D->B, is a fork and conditioning on the fork's root (D)
  blocks it.
- (c) backdoor adjustment set for the effect of C on F is {D}; it
  blocks the back-door path C<-D->B->F.
- (d) F is a collider on C->F<-B; conditioning on F OPENS (induces) an
  association between C and B that is marginally absent given D —
  i.e., it creates a spurious dependence, the opposite of what
  conditioning does to a fork.

Judge runs `verify.js` to confirm the four printed numbers match
exactly (0.33, 0.48, 0.066, 0.1584); the structural verdicts (a)-(d)
are checked by reading them against the DAG and CPTs above, not by
running code.

### Trap

The test is built so a data-analysis reflex gets (a) backwards: seeing
that C and B are conditionally independent given D (true, and the
correct answer to (b)) invites the mistaken leap that C and B are
therefore independent, full stop — ignoring that the marginal
(unconditional) relationship is the opposite. A submission that answers
(a) with "C and B are independent" (marginally) has fallen into this
trap and should fail obj-1 even if (b) is otherwise correct. Likewise,
(d) tests whether the submission understands that conditioning on a
collider (F) does the opposite of conditioning on a fork (D) — opening
rather than closing an association — rather than applying a blanket
"conditioning always removes confounding" rule.

### Example phrasings — obj-1, marginal dependence of C and B

PASSING:
- "C and B are not independent overall — the demand shift drives both
  of them in opposite directions, so seeing the compressor engaged
  still shifts the odds on the brine loop even before you condition on
  anything."
- "Unconditionally, C and B are dependent; D is the common cause behind
  both, which shows up as a real (if confounded) correlation between
  them."
- "Marginally the two are linked: D is a shared driver, so P(C=1,B=1)
  differs from P(C=1)*P(B=1)."

FAILING:
- "C and B are independent since there's no direct edge between them."
- "Because C and B are independent given D, they're independent,
  period."
- "There is no confounder and C and B are marginally independent."

### Example phrasings — obj-2, C independent of B given D

PASSING:
- "Once you fix the demand shift, C and B become independent: the only
  path connecting them, C<-D->B, is a fork, and conditioning on its
  root D blocks it."
- "Given D, there's no remaining association between C and B — D is a
  common cause (fork), so holding it constant screens off the two."
- "Conditioning on D d-separates C and B; the fork at D is the sole
  connecting path and fixing D closes it."

FAILING:
- "C and B stay dependent even after conditioning on D." (wrong: the
  fork is blocked once D is fixed)
- "They're independent given D because F lies between them." (wrong
  mechanism: cites the collider F, not the fork at D; the blocking path
  is C<-D->B, not anything through F).
- "D is a collider, so conditioning on it is what links C and B."
  (wrong: D is a fork, not a collider)

### Example phrasings — obj-4, collider opens association

PASSING:
- "F is a collider here — C and B both point into it — so if you
  condition on the frozen setpoint, you'll manufacture an association
  between the compressor and the brine loop that isn't there marginally
  (given D)."
- "Conditioning on F has the opposite effect of conditioning on D: it
  opens up a spurious C-B link rather than closing one down."
- "Because both C and B feed into F, holding F fixed induces a
  dependence between C and B (collider / selection effect)."

FAILING:
- "F is a mediator, so conditioning on it blocks the C-B path like any
  other control variable would."
- "Since F is downstream of both C and B, conditioning on it has no
  effect on their relationship."
- "F is a chain node, so adjusting for it removes the C-B association."

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
  C<-D->B, C->F<-B) rather than gesturing vaguely at "confounding"?
  Is `verify.js` a clean, direct encoding of the CPTs with readable
  variable names, not an opaque one-liner?
- **Reasoning quality** (0.3): does the submission explain, in its own
  words, why conditioning on a fork's root blocks a path while
  conditioning on a collider opens one — showing it understands the
  underlying rule rather than pattern-matching the specific graph
  shown here?
