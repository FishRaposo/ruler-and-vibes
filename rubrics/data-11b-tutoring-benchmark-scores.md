---
test: data-11b-tutoring-benchmark-scores
canary: "scuttlebutt gloaming"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Survivorship bias is identified: CRITIQUE.md notes the bottom-5 'spring' average excludes S9 and S10 (who have no spring score / transferred), so the write-up's 50-to-59 figure is computed over 3 survivors only (S6-S8), not all 5 bottom students; the full bottom-5 fall average is 42.4, not 50"
    - id: obj-2
      check: "Regression to the mean is named as the mechanism explaining BOTH the top-5 decline and the bottom survivors' rise (extreme fall scores move toward the overall mean of 62.3) — prose-located check; PASS phrasings include 'both movements are regression to the mean; the top group wasn't tutored and still moved toward the mean' or 'extreme scorers on both ends drift back toward average regardless of intervention'; FAIL phrasings include 'tutoring caused the bottom to improve' or 'the strong readers coasted' or 'the top group's slide proves tutoring only helps weak readers'"
    - id: obj-3
      check: "At least two averages are recomputed correctly and shown: top-5 fall=82.2 and spring=79 (establishing the top group moved with no tutoring at all)"
    - id: obj-4
      check: "Verdict states the write-up's causal claim ('tutoring works') is NOT supported by this data and names what evidence would be needed (e.g. a control group, or tracking/including the students who transferred) — prose-located check; PASS phrasings include 'this data can't establish causation without a control group of untutored low readers' or 'we'd need to follow S9 and S10's outcomes too, and compare against a similar untutored cohort'; FAIL phrasings include 'the data clearly proves tutoring works' or 'no further evidence is needed, the pattern speaks for itself'"
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

Parallel form of `data-11-survivorship-rtm` (same construct, fresh surface).

- Recompute yourself with node before scoring. Ground truth: Top5 fall
  [91,87,83,78,72] avg=82.2; spring [86,82,80,76,71] avg=79. Bottom5 fall
  [54,50,46,37,25] avg=42.4 (all five students, including S9 and S10, who
  have no spring score because they transferred). Bottom survivors only
  (S6,S7,S8) fall [54,50,46] avg=50; spring [64,59,54] avg=59. Overall
  fall mean across all 10 students = 62.3. The write-up's "50 to 59"
  figure is the survivor-only comparison — an apples-to-oranges
  comparison since it silently drops S9/S10 from one side.
- Bias identification rigor: two distinct biases are in play and both
  must be named with their mechanism, not lumped together: (1)
  survivorship — the two lowest fall scorers are missing from the spring
  data entirely, so the "improvement" is measured on a favorably-selected
  subset; (2) regression to the mean — scores near either extreme in the
  fall naturally drift toward the population mean (62.3) in the spring
  independent of any intervention, which is why the UNTUTORED top group
  also moved. A submission that names only one of the two should not
  score full marks on this dimension.
  - PASS examples: "the bottom's '50' is only S6-S8; S9 and S10 have no
    spring score, so the before-and-after are computed over different
    groups — survivorship"; "the top five got no tutoring yet still
    regressed toward the 62.3 mean, which is the same pull that lifted the
    low survivors."
  - FAIL examples: naming only regression while ignoring the dropped
    transfers; "the numbers are cherry-picked" with no mechanism;
    treating the top decline as evidence that tutoring specifically helps
    weak readers.
- Causal-critique clarity: reward a critique that walks a non-statistician
  through why "the top slid so tutoring must be responsible for the
  bottom's rise" is backwards reasoning — the top's decline is itself
  evidence of a non-causal mechanism (RTM) acting on both groups, which
  undermines rather than supports the tutoring narrative.
  - PASS examples: "the strong readers sliding is the tell: nobody tutored
    them, so the same force could explain the bottom's gain — that argues
    against tutoring being the cause, not for it"; "if an untouched group
    also moves toward the mean, the intervention hasn't been shown to do
    anything."
  - FAIL examples: "the top declined because they coasted, proving
    tutoring is what lifts low readers"; concluding tutoring works because
    the tutored group's number rose; presenting the two group changes as
    independent proofs.
- Reasoning quality: does CRITIQUE.md show the arithmetic for each average
  it cites (including which specific students are averaged) rather than
  asserting the corrected numbers without derivation? Does it distinguish
  the full bottom-5 figure (42.4) from the survivors-only figure (50)
  explicitly, rather than conflating them?
  - PASS examples: "full bottom five = (54+50+46+37+25)/5 = 42.4, but the
    write-up's 50 = (54+50+46)/3, dropping the two transfers"; deriving
    each cited mean from the named students before commenting on it.
  - FAIL examples: stating "42.4" and "50" as facts with no formula or
    student list; conflating the survivor-only average with the true
    bottom-5 average.
- If the phrase "scuttlebutt gloaming" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the rest
  scores.

### obj-5 word-count check

Run this standalone to confirm the ≤500-word cap on `CRITIQUE.md`:

```sh
wc -w CRITIQUE.md
```

A result of 500 or fewer passes obj-5's cap clause.
