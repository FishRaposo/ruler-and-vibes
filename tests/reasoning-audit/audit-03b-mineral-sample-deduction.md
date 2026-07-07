---
id: audit-03b-mineral-sample-deduction
category: reasoning-audit
title: Mineral Sample Deduction Validity Audit
deliverables:
  - AUDIT.md
---

## Task

Two fictional mineral-classification schemes each present a numbered
chain of premises and a conclusion. Every premise in both chains is
internally consistent (there is no contradiction hiding anywhere), and
every conclusion is a meaningful, non-self-contradictory statement.
Your job is pure deductive scrutiny: for each chain, determine whether
the conclusion is **validly entailed** by the stated premises (true in
every scenario where the premises hold) or whether the inference
contains a **logical gap** — a step that is not guaranteed by what
precedes it, even though it might happen to be true in some scenarios.

### Chain A

- **Premise A1**: All Drassine samples are Kelvorous.
- **Premise A2**: All Kelvorous samples are Nembrite.
- **Premise A3**: Some Nembrite samples are Voxilar.
- **Step A4 (inference)**: Therefore, some Drassine samples are
  Voxilar.

### Chain B

- **Premise B1**: All Drassine samples are Kelvorous.
- **Premise B2**: All Kelvorous samples are Nembrite.
- **Step B3 (inference)**: Therefore, all Drassine samples are
  Nembrite.

## Deliverables

- `AUDIT.md` containing, for **each** chain (A and B) in order:
  - A verdict: either "INVALID" or "VALID".
  - If INVALID: the exact step label of the first invalid inference
    (e.g. "Step A4"), a one-to-two-sentence explanation of why the
    inference does not follow from the premises above it, a specific
    counterexample — a concrete assignment of properties to one or more
    named samples under which every premise in the chain holds true but
    the chain's conclusion is false — and a statement of what
    conclusion (if any) **does** validly follow from the same premises.
  - If VALID: a one-line justification naming the logical rule or
    pattern that makes the inference sound (e.g. which premises combine
    and how).

## Constraints

- Exactly one of the two chains contains an invalid inference; the
  other is fully valid. Do not flag both, and do not flag neither.
- The counterexample must be concrete (name specific samples and state
  which properties each one has or lacks) and must be checked against
  every premise in that chain, not just asserted.
- Do not conflate "invalid" with "false" or "contradictory" — an
  invalid conclusion here is not ruled out by the premises, it is
  simply not guaranteed by them. Your counterexample must show the
  premises holding while the conclusion fails; it must not attempt to
  show the premises are themselves contradictory.
