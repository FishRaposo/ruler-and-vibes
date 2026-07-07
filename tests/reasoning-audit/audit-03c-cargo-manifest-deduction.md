---
id: audit-03c-cargo-manifest-deduction
category: reasoning-audit
title: Cargo Manifest Deduction Validity Audit
deliverables:
  - AUDIT.md
---

## Task

Two fictional customs-classification schemes each present a numbered
chain of premises and a conclusion about freight containers passing
through a starport cargo office. Every premise in both chains is
internally consistent (there is no contradiction hiding anywhere), and
every conclusion is a meaningful, non-self-contradictory statement.
Your job is pure deductive scrutiny: for each chain, determine whether
the conclusion is **validly entailed** by the stated premises (true in
every scenario where the premises hold) or whether the inference
contains a **logical gap** — a step that is not guaranteed by what
precedes it, even though it might happen to be true in some scenarios.

### Chain A

- **Premise A1**: All Kessarin-class containers are Trevallic.
- **Premise A2**: All Trevallic containers are Ombrasive.
- **Premise A3**: Some Ombrasive containers are Vulkinated.
- **Step A4 (inference)**: Therefore, some Kessarin-class containers
  are Vulkinated.

### Chain B

- **Premise B1**: All Kessarin-class containers are Trevallic.
- **Premise B2**: All Trevallic containers are Ombrasive.
- **Step B3 (inference)**: Therefore, all Kessarin-class containers
  are Ombrasive.

## Deliverables

- `AUDIT.md` containing, for **each** chain (A and B) in order:
  - A verdict: either "INVALID" or "VALID".
  - If INVALID: the exact step label of the first invalid inference
    (e.g. "Step A4"), a one-to-two-sentence explanation of why the
    inference does not follow from the premises above it, a specific
    counterexample — a concrete assignment of properties to one or
    more named containers under which every premise in the chain holds
    true but the chain's conclusion is false — and a statement of what
    conclusion (if any) **does** validly follow from the same
    premises.
  - If VALID: a one-line justification naming the logical rule or
    pattern that makes the inference sound (e.g. which premises
    combine and how).

## Constraints

- Exactly one of the two chains contains an invalid inference; the
  other is fully valid. Do not flag both, and do not flag neither.
- The counterexample must be concrete (name specific containers and
  state which properties each one has or lacks) and must be checked
  against every premise in that chain, not just asserted.
- Do not conflate "invalid" with "false" or "contradictory" — an
  invalid conclusion here is not ruled out by the premises, it is
  simply not guaranteed by them. Your counterexample must show the
  premises holding while the conclusion fails; it must not attempt to
  show the premises are themselves contradictory.
