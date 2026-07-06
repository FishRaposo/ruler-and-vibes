---
test: causal-02b-copperkettle-nightmarket
canary: "laburnum cupola"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Running `node selection.js` prints corr(Z,P | F=1) = -0.6 (equivalently -3/5) and cov(Z,P|F=1) = -0.1406 (-9/64)"
    - id: obj-2
      check: "The script prints P(F=1)=0.64 and E[Z|F=1]=E[P|F=1]=5/8 (0.6250)"
    - id: obj-3
      check: "ANSWERS.md (a) states the population/marginal correlation between Z and P is exactly 0 and attributes it to the stated independence"
    - id: obj-4
      check: "ANSWERS.md (c) names the phenomenon as collider/selection (Berkson's) bias — conditioning on the common effect F — and explicitly states the negative correlation is NON-causal (spurious), rebutting the blogger (prose-located)"
    - id: obj-5
      check: "ANSWERS.md (d) states that intervening on Perch P does NOT change Zest Z (the two are causally independent; the observed link is selection-induced only) (prose-located)"
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

If the phrase "laburnum cupola" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

Joint over (Z,P) in {0,1}^2 with independent marginals P(Z=1)=P(P=1)=0.4,
so cell probabilities are the products: (0,0)=0.36, (0,1)=0.24,
(1,0)=0.24, (1,1)=0.16. F=1 for the three cells (0,1), (1,0), (1,1);
F=0 only for (0,0).

- P(F=1) = 1 - 0.36 = **0.64** (= 16/25)
- E[Z|F=1] = E[P|F=1] = 0.16+0.24 over 0.64 = 0.40/0.64 = 5/8 ≈ **0.6250**
- E[ZP|F=1] = 0.16/0.64 = 1/4 (only cell (1,1))
- cov(Z,P|F=1) = 1/4 - (5/8)*(5/8) = 1/4 - 25/64 = -9/64 ≈ **-0.1406**
- var(Z|F=1) = var(P|F=1) = 5/8 - (5/8)^2 = 15/64
- corr(Z,P|F=1) = (-9/64)/(15/64) = -9/15 = **-3/5 = -0.6**
- Population/marginal cov(Z,P) = 0 and corr(Z,P) = 0, since Z and P are
  independent by construction.

Judge runs `selection.js` to confirm P(F=1)=0.64, E[Z|F=1]=E[P|F=1]≈0.6250,
cov(Z,P|F=1)≈-0.1406, and corr(Z,P|F=1)=-0.6 exactly.

Correct verdicts:
- (a) population correlation is exactly 0 — Z and P are independent by
  construction.
- (b) conditional correlation among featured trucks is exactly -0.6
  (real, correctly computable, and non-zero).
- (c) this is collider/selection bias (Berkson's paradox): conditioning
  on a common effect (Featured) of two independent causes induces an
  association between them that carries no causal meaning. The blogger's
  claim is refuted, not confirmed, by the correct arithmetic.
- (d) intervening on Perch does NOT change Zest — the true generating
  process has Z and P as causally unrelated independent draws; the
  featured-lineup correlation is an artifact of which units get
  observed, not of any mechanism linking the two traits.

### Trap

The number the blogger reports (a real, non-zero, correctly computable
negative correlation among featured trucks) is not a computational
error — this is what distinguishes the test from a simple arithmetic
mistake. The trap is treating a genuine, verifiable statistical
association as automatic evidence of a causal or explanatory
relationship. A submission that gets the -0.6 exactly right in (b) but
then in (c)/(d) treats it as real evidence that zest trades off against
a good pitch has fallen for exactly the error the test is built to
catch, and should fail obj-4/obj-5 even with a perfect script.

### Example phrasings — obj-4, rebutting the causal claim

PASSING:
- "The -0.6 correlation is real among featured trucks, but it's a pure
  artifact of the banner rule selecting on Z+P>=1 — a classic
  collider/selection effect. It says nothing about whether zest actually
  trades off against a good pitch; in the full roster the two are
  exactly uncorrelated."
- "This is Berkson's bias: conditioning on the common effect (being
  featured) of two independent causes manufactures a negative
  association between them. The blogger's causal reading is wrong — the
  banner status is a collider, not a mediator or confounder."
- "Selecting on the banner drops only the (0,0) trucks, which skews the
  surviving joint; the negative number is spurious, not a real tradeoff
  between spice and placement."

FAILING:
- "The data clearly shows featured trucks trade off zest for placement,
  confirming the blogger's point."
- "Since the correlation is statistically real and correctly computed,
  the blogger's conclusion follows."
- "Zestier trucks really do pitch worse — the banner numbers prove it."

### Example phrasings — obj-5, intervention on Perch

PASSING:
- "No — winning a truck a better pitch would not change its Zest. The
  two traits are generated independently; the only thing linking them is
  that we're looking exclusively at the featured subgroup, which do(P)
  can't touch."
- "Zest and Perch have no causal edge between them in either direction,
  so an intervention on P leaves Z completely unchanged; the observed
  dependence only exists inside the selected (featured) population."
- "Setting do(P=1) for one truck moves nothing about its dish's spice
  score — the correlation lives in the selection, not in the trucks."

FAILING:
- "Yes, raising Perch would lower Zest, consistent with the observed
  correlation among featured trucks."
- "It's unclear whether intervening on Perch affects Zest without more
  data."
- "Giving the truck a better pitch would drag its spice score down a
  bit, matching the -0.6."

### Subjective guidance

- **Correctness of the exact conditional correlation and the causal
  (non)interpretation** (0.4): the numeric answer in (b) must match
  exactly, AND the causal verdicts in (c)/(d) must correctly separate
  the real statistical association from the absence of any causal link.
  Getting the number right but the interpretation wrong (or vice versa)
  should not receive full credit here.
- **Clean enumeration script and a crisp, non-hand-wavy rebuttal**
  (0.3): does `selection.js` enumerate all four cells explicitly and
  compute the conditional moments directly (rather than hardcoding the
  answer), and does `ANSWERS.md` directly quote or paraphrase the
  blogger's claim and refute it in concrete terms?
- **Reasoning quality** (0.3): does the submission explain WHY selecting
  on a common effect creates this pattern (e.g., walking through why
  (0,0) is the only excluded cell and how that skews the remaining
  joint), rather than just citing "collider bias" as a label without
  demonstrating the mechanism?
