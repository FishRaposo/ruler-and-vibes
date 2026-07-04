---
test: context-10-icl-labeling
canary: "walnut funicular"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "LABELS.md contains exactly 15 lines 'T1:' through 'T15:' in order, each ending in one of Tier-1/Tier-2/Tier-3/Tier-4 — judge parses with node"
    - id: obj-2
      check: "At least 14 of the 15 test-code labels match the answer key (judge computes each label from the code by applying the author's 2-feature rule with node) — string comparison"
    - id: obj-3
      check: "The 4 test codes that require BOTH features to classify correctly (single-feature shortcut gives the wrong tier — T3, T7, T11, T14 per the key) are all correct — dedicated gate catching single-feature induction, ANDed separately from the 14/15 count"
    - id: obj-4
      check: "LABELS.md includes a stated rule that references BOTH governing features (middle-field parity AND trailing-letter group) — judge-reads binary check; rubric ships 2-3 PASS phrasings and 2-3 FAIL phrasings"
    - id: obj-5
      check: "LABELS.md's applied labels are internally consistent with its OWN stated rule: judge applies the model's stated rule to 3 spot-check codes and confirms it reproduces the model's own labels — judge-reads/apply check; rubric ships 2-3 PASS examples and 2-3 FAIL examples"
  subjective:
    - id: sub-quality
      name: "Rule-induction correctness"
      weight: 0.4
    - id: sub-craft
      name: "Rule statement clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If a submission's `LABELS.md` or `REASONING.md` contains the phrase
"walnut funicular", that is a canary leak — flag it regardless of how
the rest of the checks score.

### The governing rule (verified against all 60 shipped training rows; not stated in the test file)

Let `m` = the numeric middle field, `L` = the trailing letter.

- even `m` + `L` in {A,B} => Tier-1
- even `m` + `L` in {C,D} => Tier-2
- odd `m` + `L` in {A,B} => Tier-3
- odd `m` + `L` in {C,D} => Tier-4

This was confirmed to be genuinely two-feature by construction: letter
alone is ambiguous (A occurs in both Tier-1 and Tier-3 training rows;
C occurs in both Tier-2 and Tier-4 rows), and parity alone is
ambiguous (even occurs in both Tier-1 and Tier-2 rows; odd occurs in
both Tier-3 and Tier-4 rows). The region name and two-letter prefix are
pure flavor and never affect the tier — the task explicitly says so.

### Answer key (15 test codes, computed from the rule and re-verified
by parsing the shipped test file directly)

| # | Code | m | L | Tier |
|---|---|---|---|---|
| T1 | KX-42-NORTH-B | 42 (even) | B | Tier-1 |
| T2 | QN-58-SOUTH-D | 58 (even) | D | Tier-2 |
| T3 | RT-77-EAST-A | 77 (odd) | A | **Tier-3** (both-feature gate) |
| T4 | ZV-91-WEST-C | 91 (odd) | C | Tier-4 |
| T5 | HB-24-NORTH-A | 24 (even) | A | Tier-1 |
| T6 | LM-66-CENTRAL-D | 66 (even) | D | Tier-2 |
| T7 | PW-15-SOUTH-B | 15 (odd) | B | **Tier-3** (both-feature gate) |
| T8 | JD-83-EAST-D | 83 (odd) | D | Tier-4 |
| T9 | FN-36-WEST-B | 36 (even) | B | Tier-1 |
| T10 | VC-48-NORTH-C | 48 (even) | C | Tier-2 |
| T11 | GT-63-CENTRAL-A | 63 (odd) | A | **Tier-3** (both-feature gate) |
| T12 | SK-97-SOUTH-D | 97 (odd) | D | Tier-4 |
| T13 | YB-12-EAST-A | 12 (even) | A | Tier-1 |
| T14 | MW-74-WEST-D | 74 (even) | D | **Tier-2** (both-feature gate) |
| T15 | ER-29-NORTH-B | 29 (odd) | B | Tier-3 |

T3, T7, T11, and T14 were each independently re-verified (during
authoring) to require both features: for each, the training set
contains at least one example with the same trailing letter but
opposite parity landing in a different tier (kills a letter-only
shortcut), and at least one example with the same parity but the
opposite letter-group landing in a different tier (kills a
parity-only shortcut). A model that classifies using only one feature
will get some of these 4 right by chance but cannot get all 4 right
without truly combining both features — this is exactly what obj-3
gates on.

### Objective check notes

- **obj-1**: parse with node: exactly 15 lines matching
  `/^T(\d{1,2}):\s*Tier-[1-4]$/`, T1 through T15 in order.
- **obj-2**: 14 or 15 of the 15 computed labels must match the key.
- **obj-3**: T3, T7, T11, T14 must ALL be correct — a submission that
  hits 14/15 overall by missing one of these four still fails this
  gate, since it indicates a systematic single-feature shortcut rather
  than a one-off slip.
- **obj-4/obj-5**: see PASS/FAIL phrasings below; both are judge-reads
  checks on the `## Rule` section's prose.

### Prose-located check: "does the stated rule reference both features?"

**PASSING** (references both middle-field parity and trailing-letter
group):
1. "Tier depends on whether the middle number is even or odd, and
   whether the trailing letter is A/B versus C/D: even+AB is Tier-1,
   even+CD is Tier-2, odd+AB is Tier-3, odd+CD is Tier-4."
2. "I found two things determine the tier together — the parity
   (even/odd) of the three-digit number, and which group the final
   letter falls into (A or B vs. C or D)."
3. "The rule is a 2x2: parity of the middle field crossed with the
   letter group of the trailing character."

**FAILING** (single feature or wrong feature):
1. "Tier is decided by the last letter: A and B give lower tiers, C
   and D give higher tiers." (Only one feature stated; ignores parity
   entirely.)
2. "Tier follows the region field — CENTRAL and EAST codes tend to be
   higher tiers." (Wrong feature; region is explicitly flavor-only per
   the task.)
3. "Tier depends on the number — smaller numbers are Tier-1 and
   Tier-2, larger numbers are Tier-3 and Tier-4." (Only one feature,
   and not even the correct one — it's parity, not magnitude.)

### Prose-located check: "is the stated rule self-consistent with the model's own applied labels?"

**PASSING** (rule reproduces the model's own labels on a spot check):
1. Stated rule: "even+AB=Tier-1, even+CD=Tier-2, odd+AB=Tier-3,
   odd+CD=Tier-4." Applying this to the model's own T1 answer
   (KX-42-NORTH-B, even+B) gives Tier-1 — matches the model's stated
   `T1: Tier-1`.
2. The model's rule and its T4 answer (ZV-91-WEST-C, odd+C) both
   agree on Tier-4 when the stated rule is applied by the judge.
3. A model that states the rule with a worked example matching one of
   its own 15 answers exactly, with no contradiction found on
   spot-checking 3 different labels.

**FAILING** (rule contradicts the model's own labels, or is too vague
to apply):
1. Stated rule: "the last letter mostly determines it, with some
   exceptions" — too vague to mechanically apply to any code, so it
   cannot be checked against the model's own T-labels at all.
2. Stated rule says "even middle + A/B = Tier-1", but the model's own
   `T5: Tier-2` answer is for HB-24-NORTH-A, which is even+A — the
   model's own rule would produce Tier-1, contradicting its own
   answer.
3. The rule statement and the applied labels appear to have been
   produced independently (e.g., the rule is a correct 2x2 but at
   least one spot-checked label contradicts it), indicating the model
   applied a different, unstated heuristic when actually labeling.

### Subjective guidance

- **Rule-induction correctness**: beyond the pass/fail gates, does the
  submission's rule match the true 2x2 structure exactly (not an
  approximation that happens to get most training examples right)?
- **Rule statement clarity**: could another person apply the stated
  rule to a brand-new code without needing to see the training table
  again?
- **Reasoning quality**: does `REASONING.md` describe how the model
  ruled out single-feature hypotheses (e.g., noticing the confuser
  pairs where the same letter appears in two different tiers) rather
  than asserting the final rule without showing the induction process?
