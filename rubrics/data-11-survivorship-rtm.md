---
test: data-11-survivorship-rtm
canary: "riverslate kite"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Survivorship bias is identified: CRITIQUE.md notes the bottom-5 'after' average excludes R9 and R10 (who have no period-2 score / left), so the memo's 55-to-64 figure is computed over 3 survivors only (R6-R8), not all 5 bottom reps; the full bottom-5 period-1 average is 48, not 55"
    - id: obj-2
      check: "Regression to the mean is named as the mechanism explaining BOTH the top-5 decline and the bottom survivors' rise (extreme period-1 scores move toward the overall mean of 67.8) — prose-located check; PASS phrasings include 'both movements are regression to the mean; the top group wasn't coached and still moved toward the mean' or 'extreme scorers on both ends drift back toward average regardless of intervention'; FAIL phrasings include 'coaching caused the bottom to improve' or 'the top reps got complacent' or 'the top group's decline proves coaching only helps low performers'"
    - id: obj-3
      check: "At least two averages are recomputed correctly and shown: top-5 period-1=87.6 and period-2=83.8 (establishing the top group moved with no coaching at all)"
    - id: obj-4
      check: "Verdict states the memo's causal claim ('coaching works') is NOT supported by this data and names what evidence would be needed (e.g. a control group, or tracking/including the reps who quit) — prose-located check; PASS phrasings include 'this data can't establish causation without a control group of uncoached low performers' or 'we'd need to track R9 and R10's outcomes too, and compare to a similar uncoached cohort'; FAIL phrasings include 'the data clearly proves coaching works' or 'no further evidence is needed, the pattern speaks for itself'"
    - id: obj-5
      check: "CRITIQUE.md is at most 500 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Bias identification rigor"
      weight: 0.4
    - id: sub-craft
      name: "Causal-critique clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Bias identification rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Causal-critique clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "riverslate kite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute yourself with node before scoring. Ground truth: Top5
  period1 [95,90,88,85,80] avg=87.6; period2 [88,85,84,83,79]
  avg=83.8. Bottom5 period1 [60,55,50,40,35] avg=48 (all five reps,
  including R9 and R10, who have no period-2 score because they left).
  Bottom survivors only (R6,R7,R8) period1 [60,55,50] avg=55; period2
  [68,64,61] avg=64.33. Overall period-1 mean across all 10 reps =
  67.8. The memo's "55 to 64" figure is the survivor-only comparison
  (55 to 64.33, rounded) — an apples-to-oranges comparison since it
  silently drops R9/R10 from one side.
- Bias identification rigor: two distinct biases are in play and both
  must be named with their mechanism, not lumped together: (1)
  survivorship — the two lowest period-1 scorers are missing from the
  period-2 data entirely, so the "improvement" is measured on a
  favorably-selected subset; (2) regression to the mean — scores near
  either extreme in period 1 naturally drift toward the population
  mean (67.8) in period 2 independent of any intervention, which is
  why the UNCOACHED top group also moved. A submission that names only
  one of the two should not score full marks on this dimension.
  - PASS examples: "the bottom's '55' is only R6-R8; R9 and R10 have no
    period-2 score, so the before-and-after are computed over different
    groups — survivorship"; "the top five got no coaching yet still
    regressed toward the 67.8 mean, which is the same pull that lifted the
    low survivors."
  - FAIL examples: naming only regression while ignoring the dropped reps
    who quit; "the numbers are cherry-picked" with no mechanism; treating
    the top decline as evidence that coaching specifically helps low
    performers.
- Causal-critique clarity: reward a critique that walks a
  non-statistician through why "the top declined so coaching must be
  responsible for the bottom's rise" is backwards reasoning — the top's
  decline is itself evidence of a non-causal mechanism (RTM) acting on
  both groups, which undermines rather than supports the coaching
  narrative.
  - PASS examples: "the top reps declining is the tell: nobody coached
    them, so the same force could explain the bottom's gain — that argues
    against coaching being the cause, not for it"; "if an untouched group
    also moves toward the mean, the intervention hasn't been shown to do
    anything."
  - FAIL examples: "the top declined because they got complacent, proving
    coaching is what lifts low performers"; concluding coaching works
    because the coached group's number rose; presenting the two group
    changes as independent proofs.
- Reasoning quality: does CRITIQUE.md show the arithmetic for each
  average it cites (including which specific reps are averaged) rather
  than asserting the corrected numbers without derivation? Does it
  distinguish the full bottom-5 figure (48) from the survivors-only
  figure (55) explicitly, rather than conflating them?
  - PASS examples: "full bottom five = (60+55+50+40+35)/5 = 48, but the
    memo's 55 = (60+55+50)/3, dropping the two reps who quit"; deriving
    each cited mean from the named reps before commenting on it.
  - FAIL examples: stating "48" and "55" as facts with no formula or rep
    list; conflating the survivor-only average with the true bottom-5
    average.
