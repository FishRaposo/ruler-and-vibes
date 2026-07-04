---
test: audit-03-syllogistic-deduction-validity
canary: "pumice geode"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an INVALID verdict on Chain A and names Step A4 as the first invalid inference, matching the step label defined in the test file"
    - id: obj-2
      check: "AUDIT.md explains the fallacy as an invalid leap from 'some Pellid things are Quorvic' (A3) plus the Grelnick-Fumbrous-Pellid chain (A1, A2) to 'some Grelnicks are Quorvic' — an undistributed-middle-style error where nothing forces the Quorvic-Pellid individuals to overlap with the Grelnicks"
    - id: obj-3
      check: "AUDIT.md gives a concrete counterexample naming at least two entities where all of Premises A1-A3 hold but the Step A4 conclusion is false (e.g. one entity that is Grelnick/Fumbrous/Pellid but not Quorvic, and a separate entity that is Pellid/Quorvic but not Grelnick/Fumbrous)"
    - id: obj-4
      check: "AUDIT.md states the correct valid entailment available from Chain A's premises: that all Grelnicks are Pellid (via Grelnick->Fumbrous->Pellid)"
    - id: obj-5
      check: "AUDIT.md renders a VALID verdict on Chain B and names the applicable rule (hypothetical syllogism / transitivity: Grelnick->Fumbrous, Fumbrous->Pellid, therefore Grelnick->Pellid)"
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
---

## Judge guidance

If a submission's `AUDIT.md` contains the phrase "pumice geode", that
is a canary leak — flag it regardless of how the rest of the checks
score.

### Answer key (node-confirmed during authoring, brute-force over boolean models)

- Chain A premises: P1 all Grelnicks are Fumbrous; P2 all Fumbrous are
  Pellid; P3 some Pellid are Quorvic. Step A4 concludes "some Grelnicks
  are Quorvic" — **invalid**: P3 only guarantees *some* Pellid-and-Quorvic
  individual exists; nothing ties that individual to the Grelnick
  subset of Pellid things.
- Counterexample (node-confirmed to satisfy P1-P3 while falsifying A4):
  entity g = {Grelnick, Fumbrous, Pellid, not-Quorvic}; entity q =
  {not-Grelnick, not-Fumbrous, Pellid, Quorvic}. P1 holds (g is
  Grelnick->Fumbrous; q is vacuously fine since not Grelnick). P2 holds
  similarly. P3 holds (q is Pellid and Quorvic). The conclusion "some
  Grelnicks are Quorvic" is false (no entity is both Grelnick and
  Quorvic). The valid entailment "all Grelnicks are Pellid" also holds
  in this same model, confirming it's a separate, sound consequence.
- Also node-confirmed: the flawed conclusion is **not** self-contradictory
  — a one-entity model {Grelnick, Fumbrous, Pellid, Quorvic all true}
  satisfies P1-P3 AND makes "some Grelnicks are Quorvic" true. This
  means the defect in Chain A is a genuine invalid *inference* (not
  logically forced either way by the premises), not a hidden
  contradiction — the counterexample must show the premises holding
  with the conclusion false, not attempt to show the premises are
  unsatisfiable.
- Chain B: P1 (renumbered as B1/B2 in that chain) all Grelnicks are
  Fumbrous, all Fumbrous are Pellid, therefore all Grelnicks are Pellid
  — verified tautological by brute-force enumeration over all 8 boolean
  truth assignments of {Grelnick, Fumbrous, Pellid}: zero rows exist
  where both premises are true and the conclusion is false. This is a
  textbook hypothetical syllogism / transitive chain.
- **Decoy trap**: Chain B's premises (B1, B2) are worded almost
  identically to Chain A's P1/P2, and a submission that pattern-matches
  on "this chain also mentions Grelnicks, Fumbrous, and Pellid, so it
  probably has the same flaw" may flag Chain B as invalid too, or hedge
  on its validity. Chain B contains no third premise about Quorvic
  things at all, so the undistributed-middle mechanism from Chain A
  cannot occur — Chain B is a clean two-step transitive chain and must
  be confirmed VALID.

### Per-check guidance

- **obj-1**: only Step A4 is an acceptable first-invalid-step label
  (there is no other candidate step in Chain A, but the check requires
  that the submission actually identify A4 by name/description rather
  than vaguely gesture at "the conclusion").
- **obj-2**: must name the specific mechanism — that P3's "some" doesn't
  guarantee overlap with the Grelnick subset. A submission that merely
  says "the logic doesn't work" without engaging with the
  quantifier/subset structure fails this check.
- **obj-3**: the counterexample must be concrete (named entities with
  explicit property assignments) and must make every one of P1, P2, P3
  true while making the Step A4 conclusion false. A counterexample that
  only shows the conclusion "seems unlikely" or that shows the premises
  contradictory fails this check.
- **obj-4**: must state "all Grelnicks are Pellid" (or logically
  equivalent phrasing) as the sound consequence of P1+P2.
- **obj-5**: must name Chain B as valid using a recognizable transitivity
  / hypothetical-syllogism justification, not merely assert "it's fine."

### Example phrasings — naming the flawed step (Chain A)

**PASSING**:
1. "Step A4 is invalid: Premise A3 says *some* Pellid things are
   Quorvic, but that doesn't mean any of those specific Quorvic-Pellid
   individuals are also Grelnicks. Counterexample: let g be
   Grelnick/Fumbrous/Pellid/not-Quorvic, and q be
   not-Grelnick/not-Fumbrous/Pellid/Quorvic. All three premises hold,
   but no entity is both Grelnick and Quorvic, so 'some Grelnicks are
   Quorvic' is false."
2. "The inference at Step A4 commits an undistributed-middle-style
   error: it treats 'all Grelnicks are Pellid' and 'some Pellid are
   Quorvic' as if they must share the same Pellid individuals. They
   need not — a model where the Quorvic-Pellid entity is distinct from
   every Grelnick satisfies all premises and refutes the conclusion."

**FAILING**:
1. "Step A4 is wrong because Grelnicks probably aren't Quorvic in real
   life." (Not a logical argument at all — ignores that this is a
   fictional taxonomy and gives no counterexample or quantifier
   analysis.)
2. "The premises contradict each other, so no conclusion can be drawn."
   (Misdiagnoses invalidity as inconsistency; the premises are jointly
   satisfiable, as the counterexample model shows — this fails to
   distinguish "invalid" from "premises are contradictory.")

### Example phrasings — confirming the control (Chain B)

**PASSING**:
1. "Chain B is valid: this is a hypothetical syllogism. Grelnick implies
   Fumbrous, and Fumbrous implies Pellid, so by transitivity Grelnick
   implies Pellid. There is no existential premise here, so the
   undistributed-middle issue from Chain A cannot arise."
2. "Valid — B1 and B2 chain via the shared middle term 'Fumbrous' in a
   fully universal (all/all) pattern, which transitively yields 'all
   Grelnicks are Pellid.' No particular ('some') premise is involved,
   unlike Chain A."

**FAILING**:
1. "Chain B looks like it has the same structure as Chain A, so it's
   probably invalid too." (Pattern-matches on surface vocabulary overlap
   rather than checking that Chain B lacks the existential premise that
   caused Chain A's error.)
2. "Chain B is mostly fine but a bit uncertain given how similar it is
   to Chain A." (Unwarranted hedging on a chain that is a textbook valid
   transitive inference with zero counterexamples.)

### Subjective guidance

- **Soundness of validity judgment and counterexample construction**:
  is the counterexample genuinely checked against every premise (not
  just asserted), and does the submission correctly distinguish
  "invalid" from "contradictory" throughout?
- **Rigor and readability of the logical argument**: is the explanation
  precise about which quantifiers and terms fail to connect, rather
  than a vague appeal to "the logic breaks down"?
- **Reasoning quality**: does the submission show it checked Chain B
  independently for the same flaw (and explain why it doesn't apply)
  rather than assuming validity/invalidity from surface resemblance to
  Chain A?
