---
test: data-05b-newsletter-subject-split
canary: "capstan nereid"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "SRM chi-square is computed and reported as approximately 50 (accept 49.9-50.9) against the 3.841 critical value at df=1, alpha=0.05, and the split is declared broken/invalid"
    - id: obj-2
      check: "Two-proportion z for the top-line open rate is reported as approximately 2.5 (accept 2.4-2.6)"
    - id: obj-3
      check: "Final recommendation is DO NOT ROLL OUT / re-run because the SRM invalidates inference, not 'roll out because z>1.96' (prose-located)"
    - id: obj-4
      check: "The new-subscriber segment lift is explicitly flagged as unreliable (post-hoc subgroup fishing and/or SRM contamination), not used as independent supporting evidence to roll out"
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
---

## Judge guidance

Parallel form of `data-05-ab-verdict` (same construct, fresh surface).

If the phrase "capstan nereid" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute everything yourself with node before scoring. Ground truth:
  SRM chi-square = (12550-12000)^2/12000 + (11450-12000)^2/12000 = 25.208
  + 25.208 = 50.42, against a critical value of 3.841 (df=1, alpha=0.05)
  — massively over threshold, so the randomization mechanism is broken.
  Top-line two-proportion z: p1=2510/12550=0.2000,
  p2=2440/11450=0.21310, pooled=4950/24000=0.20625,
  SE=sqrt(0.20625*0.79375*(1/12550+1/11450))=0.005229, z=2.505.
  New-subscriber segment: p1=984/4100=0.2400, p2=1052/3800=0.27684,
  lift=+3.68pts, z=3.741.
- The memo's arithmetic is honest — z=2.5 and the +3.7pt segment lift
  both check out numerically. The trap is that a broken 50/50 split
  invalidates the inference regardless of how clean the downstream math
  looks: once assignment is not random, neither arm's population is
  comparable, so a "significant" p-value proves nothing about the
  subject line.
- Example PASS phrasings for the verdict check (obj-3): "the assignment
  mechanism is broken (SRM chi-square=50.4 >> 3.841); results are
  untrustworthy — re-randomize before deciding"; "SRM invalidates the
  comparison — do not roll out, fix the allocation and rerun";
  "randomization failed, so we cannot conclude the variant is better;
  investigate the assignment bug first." Example FAIL phrasings:
  "z=2.5>1.96 so roll out the variant"; "the result is statistically
  significant, send to the full list"; "variant clearly wins, roll it
  out this morning."
- Example PASS phrasings for the segment check (obj-4): "the
  new-subscriber lift can't be trusted as extra evidence — it's a
  post-hoc segment cut under an already-broken randomization"; "discount
  the new-subscriber number; subgroup fishing plus SRM contamination
  make it unreliable"; "the segment's +3.7pts doesn't rescue the
  experiment since the same broken split taints that slice too." Example
  FAIL phrasings: "the segment lift confirms the variant wins, even more
  reason to roll out"; "the stronger new-subscriber result adds
  confidence"; "two significant results (top-line and segment) make this
  a clear win."
- Statistical validity judgment: this is the heart of the test. Full
  credit requires computing the SRM chi-square, recognizing 50.4 >>
  3.841 as decisive evidence of a broken split, and explicitly stating
  that this undermines every downstream comparison — not just noting the
  imbalance in passing. A submission that reports z=2.5 correctly but
  still recommends rolling out because "the result is significant" has
  missed the point of the test and should score low on this dimension
  regardless of arithmetic accuracy.
- Verdict clarity and actionability: the recommendation should be
  unambiguous (do not roll out; fix the assignment mechanism and re-run)
  and should name the SRM as the reason, not hedge between "maybe roll
  out, maybe not." Reward stating what would need to be true to trust the
  experiment (a fixed randomization producing ~50/50 counts).
- Reasoning quality: does the submission explain WHY segment analysis
  after a global validity failure is not independent evidence — either
  because subgroup fishing inflates false-positive risk on its own, or
  because a broken randomizer taints every slice of the data,
  new subscribers included? Penalize submissions that treat the segment
  number as a tiebreaker or reassurance rather than discounting it
  outright.
