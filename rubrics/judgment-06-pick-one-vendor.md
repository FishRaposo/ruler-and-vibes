---
test: judgment-06-pick-one-vendor
canary: "mossflit ashfleck"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "recommendation.md exists and is at most 400 words (whole file, wc -w)"
    - id: obj-2
      check: "The memo recommends Aldermarsh as the single chosen vendor (naming a different vendor, or declining to pick, fails)"
    - id: obj-3
      check: "The memo reports Aldermarsh's weighted score as 7.6 (or 7.60) and Brightfen's as 7.2 (or 7.20); any statement that Brightfen has the higher weighted score fails"
    - id: obj-4
      check: "The memo's recommendation is driven by the given weighted computation, not an unweighted average: a memo whose stated decisive total for Aldermarsh is its unweighted mean 7.0, or that justifies the pick by Brightfen's unweighted 7.75, fails (prose/number check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The memo explicitly acknowledges the tradeoff that Brightfen wins more individual criteria, and explains why Aldermarsh still wins under the weighting (heaviest weight on reliability) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
  subjective:
    - id: sub-quality
      name: "Decision defensibility"
      weight: 0.4
    - id: sub-craft
      name: "Tradeoff articulation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Decision defensibility
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Tradeoff articulation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "mossflit ashfleck" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Weighted scores (node-recomputed, reliability .40 / cost .30 /
integration .20 / support .10):

- Aldermarsh: 10(.40) + 6(.30) + 6(.20) + 6(.10) = 4.00 + 1.80 + 1.20 +
  0.60 = **7.60**
- Brightfen: 5(.40) + 9(.30) + 8(.20) + 9(.10) = 2.00 + 2.70 + 1.60 +
  0.90 = **7.20**
- Corvane: 7(.40) + 7(.30) + 7(.20) + 5(.10) = 2.80 + 2.10 + 1.40 +
  0.50 = **6.80**

Aldermarsh is the unique weighted winner. Raw-criteria wins: Brightfen
wins cost (9), integration (8), and support (9) — 3 of 4 criteria;
Aldermarsh wins only reliability (10, the heaviest-weighted
criterion); Corvane wins none. Unweighted means (sum of 4 scores / 4):
Aldermarsh = (10+6+6+6)/4 = 7.00; Brightfen = (5+9+8+9)/4 = 7.75;
Corvane = (7+7+7+5)/4 = 6.50. The unweighted mean wrongly favors
Brightfen — this confirms the weighting is decision-load-bearing and
is the seeded trap.

- **obj-4 example phrasings.** PASS (correctly weighted reasoning):
  "Applying the weights, Aldermarsh scores 7.60 versus Brightfen's
  7.20 — reliability's 0.40 weight is what tips this in Aldermarsh's
  favor." / "Under the binding weight vector, Aldermarsh's weighted
  total of 7.6 beats Brightfen's 7.2, even though a simple average
  would favor Brightfen." FAIL (uses unweighted average as the
  decisive figure): "Aldermarsh averages 7.0 across the four criteria,
  the best of the three, so it's the pick." (7.0 is the unweighted
  mean, not the weighted score, and citing it as decisive is wrong
  even though the vendor happens to be right) / "Brightfen's average
  score of 7.75 is the highest, but we recommend Aldermarsh anyway for
  other reasons" (explicitly treats the unweighted figure as
  legitimate and doesn't ground the decision in the weighted total).

- **obj-5 example phrasings.** PASS: "Brightfen wins three of the four
  raw criteria — cost, integration, and support — but reliability
  carries the largest weight (0.40), and that's where Aldermarsh
  dominates, which is why Aldermarsh still comes out ahead overall." /
  "It may look like Brightfen is the stronger vendor since it tops
  most categories, but our weighting places the most importance on
  reliability, Aldermarsh's strongest area, so the weighted total
  favors Aldermarsh." FAIL (ignores the tradeoff): a memo that names
  Aldermarsh as the pick and reports the correct weighted scores but
  never mentions that Brightfen wins more raw criteria, leaving the
  apparent contradiction ("Brightfen looks stronger almost everywhere")
  unaddressed. / "Aldermarsh is simply the best vendor across the
  board." (false — Aldermarsh does not win most criteria — and elides
  the tradeoff entirely).

- **Decision defensibility**: would this memo survive a skeptical
  reader re-deriving the arithmetic? Reward memos that show the
  weighted totals for all three vendors (not just the winner) and make
  the weighting mechanism legible, so the recommendation is
  reproducible rather than asserted.
- **Tradeoff articulation**: does the memo treat the most-criteria-won
  fact as a genuine tension worth naming and resolving, rather than
  either ignoring it or treating it as a reason to hedge the
  recommendation?
- **Reasoning quality**: does REASONING.md show all three weighted
  totals computed from the matrix and weight vector, explicitly
  contrast them against the unweighted means, and confirm Aldermarsh
  is the correct pick because of the weighting, not despite the
  requirement to use it?
