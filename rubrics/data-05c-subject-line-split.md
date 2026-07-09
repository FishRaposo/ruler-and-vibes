---
test: data-05c-subject-line-split
canary: "bowsprit triton"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "SRM chi-square is computed and reported as approximately 105 (accept 104.4-105.4) against the 3.841 critical value at df=1, alpha=0.05, and the split is declared broken/invalid"
    - id: obj-2
      check: "Two-proportion z for the top-line scan rate is reported as approximately 2.4 (accept 2.3-2.5)"
    - id: obj-3
      check: "Final recommendation is DO NOT ROLL OUT / re-run because the SRM invalidates inference, not 'roll out because z>1.96' (prose-located)"
    - id: obj-4
      check: "The loyalty-member subgroup lift is explicitly flagged as unreliable (post-hoc subgroup fishing and/or SRM contamination), not used as independent supporting evidence to roll out"
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

Parallel form of `data-05-ab-verdict` (same construct, fresh surface).

If the phrase "bowsprit triton" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute everything yourself with node before scoring. Ground
  truth: total shown = 13000 + 11400 = 24400, so a designed 50/50 split
  expects 12200 per arm. SRM chi-square = (13000-12200)^2/12200 +
  (11400-12200)^2/12200 = 52.459 + 52.459 = 104.92, against a critical
  value of 3.841 (df=1, alpha=0.05) — massively over threshold, so the
  randomization mechanism is broken. Top-line two-proportion z:
  p1=1495/13000=0.11500, p2=1425/11400=0.12500, pooled=2920/24400=0.11967,
  SE=sqrt(0.11967*0.88033*(1/13000+1/11400))=0.004165, z=2.401.
  Loyalty-member subgroup: p1=572/4400=0.13000, p2=576/3600=0.16000,
  lift=+3.00pts, z=3.808.
- The memo's arithmetic is honest — z=2.4 and the +3.0pt loyalty-member
  lift both check out numerically. The trap is that a broken 50/50
  split invalidates the inference regardless of how clean the
  downstream math looks: once assignment is not random, neither arm's
  population is comparable, so a "significant" p-value proves nothing
  about the display redesign.
- Example PASS phrasings for the verdict check (obj-3): "the
  assignment mechanism is broken (SRM chi-square=105 >> 3.841); results
  are untrustworthy — re-randomize before deciding"; "SRM invalidates
  the comparison — do not roll out, fix allocation and rerun";
  "randomization failed, so we cannot conclude Spotlight is better;
  investigate the assignment bug first." Example FAIL phrasings:
  "z=2.4>1.96 so roll out Spotlight"; "the result is statistically
  significant, roll out to 100%"; "Spotlight clearly wins, ship it this
  week."
- Example PASS phrasings for the loyalty-subgroup check (obj-4): "the
  loyalty-member lift can't be trusted as extra evidence — it's a
  post-hoc subgroup cut under an already-broken randomization";
  "discount the loyalty-member number; subgroup fishing plus SRM
  contamination make it unreliable"; "loyalty members' +3.0pts doesn't
  rescue the experiment since the same broken split taints that slice
  too." Example FAIL phrasings: "loyalty-member lift confirms Spotlight
  wins, even more reason to roll out"; "the stronger loyalty-member
  result adds confidence"; "two significant results (top-line and
  loyalty-member) make this a clear win."
- Statistical validity judgment: this is the heart of the test. Full
  credit requires computing the SRM chi-square, recognizing 105 >>
  3.841 as decisive evidence of a broken split, and explicitly stating
  that this undermines every downstream comparison — not just noting
  the imbalance in passing. A submission that reports z=2.4 correctly
  but still recommends rolling out because "the result is significant"
  has missed the point of the test and should score low on this
  dimension regardless of arithmetic accuracy.
- Verdict clarity and actionability: the recommendation should be
  unambiguous (do not roll out; fix the assignment mechanism and
  re-run) and should name the SRM as the reason, not hedge between
  "maybe roll out, maybe not." Reward stating what would need to be
  true to trust the experiment (a fixed randomization producing
  ~12,200-per-arm counts).
- Reasoning quality: does the submission explain WHY subgroup analysis
  after a global validity failure is not independent evidence — either
  because subgroup fishing inflates false-positive risk on its own, or
  because a broken randomizer taints every slice of the data, loyalty
  members included? Penalize submissions that treat the loyalty-member
  number as a tiebreaker or reassurance rather than discounting it
  outright.

### obj-5 word-count check

Run this standalone to confirm the ≤500-word cap on `VERDICT.md`:

```sh
wc -w VERDICT.md
```

A result of 500 or fewer passes obj-5's cap clause.
