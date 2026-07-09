---
test: data-05-ab-verdict
canary: "thornwick vaneglass"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "SRM chi-square is computed and reported as approximately 50 (accept 49.5-50.5) against the 3.841 critical value at df=1, alpha=0.05, and the split is declared broken/invalid"
    - id: obj-2
      check: "Two-proportion z for the top-line conversion is reported as approximately 2.5 (accept 2.4-2.6)"
    - id: obj-3
      check: "Final recommendation is DO NOT SHIP / re-run because the SRM invalidates inference, not 'ship because z>1.96' (prose-located)"
    - id: obj-4
      check: "The mobile subgroup lift is explicitly flagged as unreliable (post-hoc subgroup fishing and/or SRM contamination), not used as independent supporting evidence to ship"
    - id: obj-5
      check: "VERDICT.md is at most 500 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Statistical validity judgment"
      weight: 0.4
    - id: sub-craft
      name: "Verdict clarity and actionability"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Statistical validity judgment
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Verdict clarity and actionability
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "thornwick vaneglass" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute everything yourself with node before scoring. Ground
  truth: SRM chi-square = (10500-10000)^2/10000 + (9500-10000)^2/10000
  = 25 + 25 = 50, against a critical value of 3.841 (df=1, alpha=0.05)
  — massively over threshold, so the randomization mechanism is
  broken. Top-line two-proportion z: p1=840/10500=0.0800,
  p2=855/9500=0.0900, pooled=1695/20000=0.08475,
  SE=sqrt(0.08475*0.91525*(1/10500+1/9500))=0.003944, z=2.536. Mobile
  subgroup: p1=300/3500=0.08571, p2=360/3200=0.1125, lift=+2.68pts,
  z=3.675.
- The memo's arithmetic is honest — z=2.5 and the +2.7pt mobile lift
  both check out numerically. The trap is that a broken 50/50 split
  invalidates the inference regardless of how clean the downstream
  math looks: once assignment is not random, neither arm's population
  is comparable, so a "significant" p-value proves nothing about the
  treatment.
- Example PASS phrasings for the verdict check (obj-3): "the
  assignment mechanism is broken (SRM chi-square=50 >> 3.841); results
  are untrustworthy — re-randomize before deciding"; "SRM invalidates
  the comparison — do not ship, fix allocation and rerun"; "randomization
  failed, so we cannot conclude treatment is better; investigate the
  assignment bug first." Example FAIL phrasings: "z=2.5>1.96 so ship
  treatment"; "the result is statistically significant, roll out to
  100%"; "treatment clearly wins, ship it this week."
- Example PASS phrasings for the mobile-subgroup check (obj-4): "the
  mobile lift can't be trusted as extra evidence — it's a post-hoc
  subgroup cut under an already-broken randomization"; "discount the
  mobile number; subgroup fishing plus SRM contamination make it
  unreliable"; "mobile's +2.7pts doesn't rescue the experiment since
  the same broken split taints that slice too." Example FAIL
  phrasings: "mobile lift confirms treatment wins, even more reason to
  ship"; "the stronger mobile result adds confidence"; "two significant
  results (top-line and mobile) make this a clear win."
- Statistical validity judgment: this is the heart of the test. Full
  credit requires computing the SRM chi-square, recognizing 50 >>
  3.841 as decisive evidence of a broken split, and explicitly stating
  that this undermines every downstream comparison — not just noting
  the imbalance in passing. A submission that reports z=2.5 correctly
  but still recommends shipping because "the result is significant"
  has missed the point of the test and should score low on this
  dimension regardless of arithmetic accuracy.
- Verdict clarity and actionability: the recommendation should be
  unambiguous (do not ship; fix the assignment mechanism and re-run)
  and should name the SRM as the reason, not hedge between "maybe
  ship, maybe not." Reward stating what would need to be true to trust
  the experiment (a fixed randomization producing ~50/50 counts).
- Reasoning quality: does the submission explain WHY subgroup analysis
  after a global validity failure is not independent evidence — either
  because subgroup fishing inflates false-positive risk on its own, or
  because a broken randomizer taints every slice of the data, mobile
  included? Penalize submissions that treat the mobile number as a
  tiebreaker or reassurance rather than discounting it outright.
