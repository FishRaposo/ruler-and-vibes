---
test: audit-03c-cargo-manifest-deduction
canary: "dab dover"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an INVALID verdict on Chain A and names Step A4 as the first invalid inference, matching the step label defined in the test file"
    - id: obj-2
      check: "AUDIT.md explains the fallacy as an invalid leap from 'some Ombrasive containers are Vulkinated' (A3) plus the Kessarin-Trevallic-Ombrasive chain (A1, A2) to 'some Kessarin-class containers are Vulkinated' — an undistributed-middle-style error where nothing forces the Vulkinated-Ombrasive containers to overlap with the Kessarin-class ones"
    - id: obj-3
      check: "AUDIT.md gives a concrete counterexample naming at least two containers where all of Premises A1-A3 hold but the Step A4 conclusion is false (e.g. one container that is Kessarin-class/Trevallic/Ombrasive but not Vulkinated, and a separate container that is Ombrasive/Vulkinated but not Kessarin-class/Trevallic)"
    - id: obj-4
      check: "AUDIT.md states the correct valid entailment available from Chain A's premises: that all Kessarin-class containers are Ombrasive (via Kessarin-class->Trevallic->Ombrasive)"
    - id: obj-5
      check: "AUDIT.md renders a VALID verdict on Chain B and names the applicable rule (hypothetical syllogism / transitivity: Kessarin-class->Trevallic, Trevallic->Ombrasive, therefore Kessarin-class->Ombrasive)"
  subjective:
    - id: sub-quality
      name: "Soundness of validity judgment and counterexample construction"
      weight: 0.4
    - id: sub-craft
      name: "Rigor and readability of the logical argument"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Soundness of validity judgment and counterexample construction
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Rigor and readability of the logical argument
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `audit-03-syllogistic-deduction-validity` (same
construct, fresh surface).

If the phrase "dab dover" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest of the
checks score.

### Answer key (node-confirmed during authoring, brute-force over boolean models)

- Chain A premises: P1 all Kessarin-class containers are Trevallic; P2
  all Trevallic containers are Ombrasive; P3 some Ombrasive containers
  are Vulkinated. Step A4 concludes "some Kessarin-class containers
  are Vulkinated" — **invalid**: P3 only guarantees *some*
  Ombrasive-and-Vulkinated container exists; nothing ties that
  container to the Kessarin-class subset of Ombrasive containers.
- Counterexample (node-confirmed to satisfy P1-P3 while falsifying
  A4): Container J-12 = {Kessarin-class, Trevallic, Ombrasive,
  not-Vulkinated}; Container R-58 = {not-Kessarin-class,
  not-Trevallic, Ombrasive, Vulkinated}. P1 holds (J-12 is
  Kessarin-class->Trevallic; R-58 is vacuously fine since it is not
  Kessarin-class). P2 holds similarly (J-12 is Trevallic->Ombrasive;
  R-58 is vacuously fine since it is not Trevallic). P3 holds (R-58 is
  Ombrasive and Vulkinated). The conclusion "some Kessarin-class
  containers are Vulkinated" is false (no container is both
  Kessarin-class and Vulkinated). The valid entailment "all
  Kessarin-class containers are Ombrasive" also holds in this same
  model, confirming it's a separate, sound consequence. Brute-force
  enumeration over all 2-container boolean models of
  {Kessarin-class, Trevallic, Ombrasive, Vulkinated} finds 24 distinct
  models satisfying P1-P3 while falsifying the Step A4 conclusion.
- Also node-confirmed: the flawed conclusion is **not**
  self-contradictory — a one-container model
  {Kessarin-class, Trevallic, Ombrasive, Vulkinated all true}
  satisfies P1-P3 AND makes "some Kessarin-class containers are
  Vulkinated" true (indeed 15 of the 2-container models satisfy P1-P3
  with the conclusion true too). This means the defect in Chain A is a
  genuine invalid *inference* (not logically forced either way by the
  premises), not a hidden contradiction — the counterexample must show
  the premises holding with the conclusion false, not attempt to show
  the premises are unsatisfiable.
- Chain B: P1/P2 (renumbered as B1/B2 in that chain) all Kessarin-class
  containers are Trevallic, all Trevallic containers are Ombrasive,
  therefore all Kessarin-class containers are Ombrasive — verified
  tautological by brute-force enumeration over all 8 boolean truth
  assignments of {Kessarin-class, Trevallic, Ombrasive}: zero rows
  exist where both premises are true and the conclusion is false. This
  is a textbook hypothetical syllogism / transitive chain.
- **Decoy trap**: Chain B's premises (B1, B2) are worded almost
  identically to Chain A's A1/A2, and a submission that pattern-matches
  on "this chain also mentions Kessarin-class, Trevallic, and
  Ombrasive containers, so it probably has the same flaw" may flag
  Chain B as invalid too, or hedge on its validity. Chain B contains no
  third premise about Vulkinated containers at all, so the
  undistributed-middle mechanism from Chain A cannot occur — Chain B
  is a clean two-step transitive chain and must be confirmed VALID.

### Per-check guidance

- **obj-1**: only Step A4 is an acceptable first-invalid-step label
  (there is no other candidate step in Chain A, but the check requires
  that the submission actually identify A4 by name/description rather
  than vaguely gesture at "the conclusion").
- **obj-2**: must name the specific mechanism — that P3's "some"
  doesn't guarantee overlap with the Kessarin-class subset. A
  submission that merely says "the logic doesn't work" without
  engaging with the quantifier/subset structure fails this check.
- **obj-3**: the counterexample must be concrete (named containers with
  explicit property assignments) and must make every one of P1, P2, P3
  true while making the Step A4 conclusion false. A counterexample that
  only shows the conclusion "seems unlikely" or that shows the premises
  contradictory fails this check.
- **obj-4**: must state "all Kessarin-class containers are Ombrasive"
  (or logically equivalent phrasing) as the sound consequence of
  P1+P2.
- **obj-5**: must name Chain B as valid using a recognizable
  transitivity / hypothetical-syllogism justification, not merely
  assert "it's fine."

### Example phrasings — naming the flawed step (Chain A)

**PASSING**:
1. "Step A4 is invalid: Premise A3 says *some* Ombrasive containers
   are Vulkinated, but that doesn't mean any of those specific
   Vulkinated-Ombrasive containers are also Kessarin-class.
   Counterexample: let J-12 be
   Kessarin-class/Trevallic/Ombrasive/not-Vulkinated, and R-58 be
   not-Kessarin-class/not-Trevallic/Ombrasive/Vulkinated. All three
   premises hold, but no container is both Kessarin-class and
   Vulkinated, so 'some Kessarin-class containers are Vulkinated' is
   false."
2. "The inference at Step A4 commits an undistributed-middle-style
   error: it treats 'all Kessarin-class containers are Ombrasive' and
   'some Ombrasive containers are Vulkinated' as if they must share
   the same Ombrasive containers. They need not — a model where the
   Vulkinated-Ombrasive container is distinct from every Kessarin-class
   container satisfies all premises and refutes the conclusion."

**FAILING**:
1. "Step A4 is wrong because customs containers probably aren't
   Vulkinated in real cargo systems." (Not a logical argument at all —
   ignores that this is a fictional classification scheme and gives no
   counterexample or quantifier analysis.)
2. "The premises contradict each other, so no conclusion can be
   drawn." (Misdiagnoses invalidity as inconsistency; the premises are
   jointly satisfiable, as the counterexample model shows — this fails
   to distinguish "invalid" from "premises are contradictory.")

### Example phrasings — confirming the control (Chain B)

**PASSING**:
1. "Chain B is valid: this is a hypothetical syllogism. Kessarin-class
   implies Trevallic, and Trevallic implies Ombrasive, so by
   transitivity Kessarin-class implies Ombrasive. There is no
   existential premise here, so the undistributed-middle issue from
   Chain A cannot arise."
2. "Valid — B1 and B2 chain via the shared middle term 'Trevallic' in
   a fully universal (all/all) pattern, which transitively yields 'all
   Kessarin-class containers are Ombrasive.' No particular ('some')
   premise is involved, unlike Chain A."

**FAILING**:
1. "Chain B looks like it has the same structure as Chain A, so it's
   probably invalid too." (Pattern-matches on surface vocabulary
   overlap rather than checking that Chain B lacks the existential
   premise that caused Chain A's error.)
2. "Chain B is mostly fine but a bit uncertain given how similar it is
   to Chain A." (Unwarranted hedging on a chain that is a textbook
   valid transitive inference with zero counterexamples.)

### Subjective guidance

- **Soundness of validity judgment and counterexample construction**:
  is the counterexample genuinely checked against every premise (not
  just asserted), and does the submission correctly distinguish
  "invalid" from "contradictory" throughout?
- **Rigor and readability of the logical argument**: is the
  explanation precise about which quantifiers and terms fail to
  connect, rather than a vague appeal to "the logic breaks down"?
- **Reasoning quality**: does the submission show it checked Chain B
  independently for the same flaw (and explain why it doesn't apply)
  rather than assuming validity/invalidity from surface resemblance to
  Chain A?
