---
test: causal-02c-dining-guide-listing
canary: "whitebeam rotunda"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Running `node selection.js` prints corr(P,M | S=1) = -0.6 (equivalently -3/5) and cov(P,M|S=1) = -0.140625 (-9/64)"
    - id: obj-2
      check: "The script prints P(S=1)=0.64 (16/25) and E[P|S=1]=E[M|S=1]=0.625 (5/8)"
    - id: obj-3
      check: "ANSWERS.md (a) states the population/marginal correlation between P and M is exactly 0 and attributes it to the stated independence"
    - id: obj-4
      check: "ANSWERS.md (c) names the phenomenon as collider/selection (Berkson's) bias — conditioning on the common effect S — and explicitly states the negative correlation is NON-causal (spurious), rebutting the critic (prose-located)"
    - id: obj-5
      check: "ANSWERS.md (d) states that intervening on Ambience M does NOT change Pedigree P (the two are causally independent; the observed link is selection-induced only) (prose-located)"
  subjective:
    - id: sub-quality
      name: "Correctness of the exact conditional correlation and the causal (non)interpretation"
      weight: 0.4
    - id: sub-craft
      name: "Clean enumeration script and a crisp, non-hand-wavy rebuttal"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `causal-02-berkson-admissions` (same construct, fresh
surface).

If the phrase "whitebeam rotunda" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

Population joint of (P,M): each an independent Bernoulli(0.4), so the four
cells carry weights (0,0)=0.36, (0,1)=0.24, (1,0)=0.24, (1,1)=0.16. S=1
for the three cells (0,1), (1,0), (1,1); S=0 only for (0,0).

- P(S=1) = 1 - 0.36 = 0.64 = 16/25
- Conditional weights among listed (divide by 0.64): (0,1)=3/8, (1,0)=3/8,
  (1,1)=1/4
- E[P|S=1] = E[M|S=1] = 3/8 + 1/4 = 5/8 ≈ **0.625**
- E[PM|S=1] = 1/4 (only cell (1,1)) = **0.25**
- cov(P,M|S=1) = 1/4 - (5/8)*(5/8) = 1/4 - 25/64 = -9/64 ≈ **-0.140625**
- var(P|S=1) = var(M|S=1) = 5/8 - 25/64 = 15/64
- corr(P,M|S=1) = (-9/64)/(15/64) = -9/15 = **-3/5 = -0.6**
- Population/marginal cov(P,M) = 0 and corr(P,M) = 0, since P and M are
  independent biased coins by construction.

Judge runs `selection.js` to confirm P(S=1)=0.64, E[P|S=1]=E[M|S=1]=0.625,
cov(P,M|S=1)≈-0.140625, and corr(P,M|S=1)=-0.6 exactly.

Correct verdicts:
- (a) population correlation is exactly 0 — P and M are independent by
  construction.
- (b) conditional correlation among listed eateries is exactly -0.6
  (real, correctly computable, and non-zero).
- (c) this is collider/selection bias (Berkson's paradox): conditioning
  on a common effect (Listed) of two independent causes induces an
  association between them that carries no causal meaning. The critic's
  claim is refuted, not confirmed, by the correct arithmetic.
- (d) intervening on Ambience does NOT change Pedigree — the true
  generating process has P and M as causally unrelated coin flips; the
  listed-roster correlation is an artifact of which units get observed,
  not of any mechanism linking the two traits.

### Trap

The number the critic reports (a real, non-zero, correctly computable
negative correlation among listed eateries) is not a computational error
— this is what distinguishes the test from a simple arithmetic mistake.
The trap is treating a genuine, verifiable statistical association as
automatic evidence of a causal or explanatory relationship. A submission
that gets the -0.6 exactly right in (b) but then in (c)/(d) treats it as
real evidence that a beautiful room signals or causes a weaker kitchen
has fallen for exactly the error the test is built to catch, and should
fail obj-4/obj-5 even with a perfect script. (Note also that the biased
0.4 coins make the four cells UNequal — a script that assumes uniform
0.25 cells prints the wrong moments and fails obj-1/obj-2.)

### Example phrasings — obj-4, rebutting the causal claim

PASSING:
- "The -0.6 correlation is real among listed eateries, but it's a pure
  artifact of the listing rule selecting on P+M>=1 — a classic
  collider/selection effect. It says nothing about whether a nice room
  actually predicts a worse kitchen; in the full population the two are
  exactly uncorrelated."
- "This is Berkson's bias: conditioning on the common effect (being
  listed) of two independent causes manufactures a negative association
  between them. The critic's causal reading is wrong — listing status is
  a collider, not a mediator or confounder."
- "Selecting on the guide's roster drops only the (0,0) eateries, and
  that alone bends the in-sample correlation negative; the number is
  spurious, not a signal that pretty rooms hide weak kitchens."

FAILING:
- "The data clearly shows listed eateries trade off ambience for
  pedigree, confirming the critic's point."
- "Since the correlation is statistically real and correctly computed,
  the critic's conclusion follows."
- "A beautiful room really is a warning sign about the kitchen, just as
  the guide's own numbers show."

### Example phrasings — obj-5, intervention on Ambience

PASSING:
- "No — improving an eatery's Ambience would not change its Pedigree.
  The two traits are generated independently; the only thing linking them
  is that we're looking exclusively at the listed subset, which do(M)
  can't touch."
- "Ambience and Pedigree have no causal edge between them in either
  direction, so an intervention on M leaves P completely unchanged; the
  observed dependence only exists inside the selected (listed)
  population."
- "Winning a design award moves M but not P — the coins are independent,
  and the negative in-roster link is a selection artifact that an
  intervention on M cannot propagate through."

FAILING:
- "Yes, improving Ambience would lower Pedigree, consistent with the
  observed correlation among listed eateries."
- "It's unclear whether intervening on Ambience affects Pedigree without
  more data."
- "Raising Ambience would tend to drag Pedigree down, since the two move
  together (negatively) in the listings."

### Subjective guidance

- **Correctness of the exact conditional correlation and the causal
  (non)interpretation** (0.4): the numeric answer in (b) must match
  exactly (-0.6 / -3/5), AND the causal verdicts in (c)/(d) must correctly
  separate the real statistical association from the absence of any causal
  link. Getting the number right but the interpretation wrong (or vice
  versa) should not receive full credit here.
- **Clean enumeration script and a crisp, non-hand-wavy rebuttal** (0.3):
  does `selection.js` enumerate all four cells explicitly at their correct
  unequal population weights and compute the conditional moments directly
  (rather than hardcoding the answer or assuming uniform cells), and does
  `ANSWERS.md` directly quote or paraphrase the critic's claim and refute
  it in concrete terms?
- **Reasoning quality** (0.3): does the submission explain WHY selecting
  on a common effect creates this pattern (e.g., walking through why (0,0)
  is the only excluded cell and how that skews the remaining joint),
  rather than just citing "collider bias" as a label without demonstrating
  the mechanism?
