---
test: causal-02-berkson-admissions
canary: "jasper agate"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Running `node collider.js` prints corr(T,L | A=1) = -0.5 (equivalently -1/2) and cov(T,L|A=1) = -0.1111 (-1/9)"
    - id: obj-2
      check: "The script prints P(A=1)=0.75 and E[T|A=1]=E[L|A=1]=2/3 (0.6667)"
    - id: obj-3
      check: "ANSWERS.md (a) states the population/marginal correlation between T and L is exactly 0 and attributes it to the stated independence"
    - id: obj-4
      check: "ANSWERS.md (c) names the phenomenon as collider/selection (Berkson's) bias — conditioning on the common effect A — and explicitly states the negative correlation is NON-causal (spurious), rebutting the journalist (prose-located)"
    - id: obj-5
      check: "ANSWERS.md (d) states that intervening on Fortune L does NOT change Aptitude T (the two are causally independent; the observed link is selection-induced only) (prose-located)"
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

If the phrase "jasper agate" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

Joint is uniform over (T,L) in {0,1}^2 at 0.25 each. A=1 for the three
cells (0,1), (1,0), (1,1); A=0 only for (0,0).

- P(A=1) = 0.75
- E[T|A=1] = E[L|A=1] = 2/3 ≈ **0.6667**
- E[TL|A=1] = 1/3 (only cell (1,1), weight 0.25/0.75 = 1/3)
- cov(T,L|A=1) = 1/3 - (2/3)*(2/3) = 1/3 - 4/9 = -1/9 ≈ **-0.1111**
- var(T|A=1) = var(L|A=1) = 2/9 (both T and L take values {0,1,1} on
  the selected set)
- corr(T,L|A=1) = (-1/9)/(2/9) = **-0.5**
- Population/marginal cov(T,L) = 0 and corr(T,L) = 0, since T and L are
  independent fair coins by construction.

Judge runs `collider.js` to confirm P(A=1)=0.75, E[T|A=1]=E[L|A=1]≈0.6667,
cov(T,L|A=1)≈-0.1111, and corr(T,L|A=1)=-0.5 exactly.

Correct verdicts:
- (a) population correlation is exactly 0 — T and L are independent by
  construction.
- (b) conditional correlation among admits is exactly -0.5 (real,
  correctly computable, and non-zero).
- (c) this is collider/selection bias (Berkson's paradox): conditioning
  on a common effect (Admitted) of two independent causes induces an
  association between them that carries no causal meaning. The
  journalist's claim is refuted, not confirmed, by the correct
  arithmetic.
- (d) intervening on Fortune does NOT change Aptitude — the true
  generating process has T and L as causally unrelated coin flips; the
  admitted-cohort correlation is an artifact of which units get
  observed, not of any mechanism linking the two traits.

### Trap

The number the journalist reports (a real, non-zero, correctly
computable negative correlation among admits) is not a computational
error — this is what distinguishes the test from a simple arithmetic
mistake. The trap is treating a genuine, verifiable statistical
association as automatic evidence of a causal or explanatory
relationship. A submission that gets the -0.5 exactly right in (b) but
then in (c)/(d) treats it as real evidence that fortune trades off
against merit has fallen for exactly the error the test is built to
catch, and should fail obj-4/obj-5 even with a perfect script.

### Example phrasings — obj-4, rebutting the causal claim

PASSING:
- "The -0.5 correlation is real among admits, but it's a pure artifact
  of the admission rule selecting on T+L>=1 — a classic
  collider/selection effect. It says nothing about whether luck
  actually trades off against merit; in the full population the two
  are exactly uncorrelated."
- "This is Berkson's bias: conditioning on the common effect (being
  admitted) of two independent causes manufactures a negative
  association between them. The journalist's causal reading is wrong —
  admission status is a collider, not a mediator or confounder."

FAILING:
- "The data clearly shows admitted candidates trade off luck for merit,
  confirming the journalist's point."
- "Since the correlation is statistically real and correctly computed,
  the journalist's conclusion follows."

### Example phrasings — obj-5, intervention on Fortune

PASSING:
- "No — raising a candidate's Fortune would not change their Aptitude.
  The two traits are generated independently; the only thing linking
  them is that we're looking exclusively at the admitted subgroup,
  which do(L) can't touch."
- "Aptitude and Fortune have no causal edge between them in either
  direction, so an intervention on L leaves T completely unchanged;
  the observed dependence only exists inside the selected (admitted)
  population."

FAILING:
- "Yes, raising Fortune would lower Aptitude, consistent with the
  observed correlation among admits."
- "It's unclear whether intervening on Fortune affects Aptitude without
  more data."

### Subjective guidance

- **Correctness of the exact conditional correlation and the causal
  (non)interpretation** (0.4): the numeric answer in (b) must match
  exactly, AND the causal verdicts in (c)/(d) must correctly separate
  the real statistical association from the absence of any causal
  link. Getting the number right but the interpretation wrong (or vice
  versa) should not receive full credit here.
- **Clean enumeration script and a crisp, non-hand-wavy rebuttal**
  (0.3): does `collider.js` enumerate all four cells explicitly and
  compute the conditional moments directly (rather than hardcoding the
  answer), and does `ANSWERS.md` directly quote or paraphrase the
  journalist's claim and refute it in concrete terms?
- **Reasoning quality** (0.3): does the submission explain WHY
  selecting on a common effect creates this pattern (e.g., walking
  through why (0,0) is the only excluded cell and how that skews the
  remaining joint), rather than just citing "collider bias" as a label
  without demonstrating the mechanism?
