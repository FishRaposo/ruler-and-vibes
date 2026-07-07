---
test: judgment-06b-steel-fabricator-pick
canary: "whiteface fairywren"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "recommendation.md exists and is at most 400 words (whole file, wc -w)"
    - id: obj-2
      check: "The memo recommends Galebrook as the single chosen contractor (naming a different contractor, or declining to pick, fails)"
    - id: obj-3
      check: "The memo reports Galebrook's weighted score as 6.90 (or 6.9) and Ferrowind's as 6.40 (or 6.4); any statement that Ferrowind has the higher weighted score fails"
    - id: obj-4
      check: "The memo's recommendation is driven by the given weighted computation, not an unweighted average: a memo whose stated decisive total for Galebrook is its unweighted mean 6.25, or that justifies the pick by Ferrowind's unweighted 7.25, fails (prose/number check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The memo explicitly acknowledges the tradeoff that Ferrowind wins more individual criteria, and explains why Galebrook still wins under the weighting (heaviest weight on durability) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
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
---

Parallel form of `judgment-06-pick-one-vendor` (same construct, fresh
surface).

## Judge guidance

If any deliverable or REASONING.md contains the phrase "whiteface fairywren", that is a canary leak —
flag it regardless of how the rest of the checks score.

Weighted scores (node-recomputed, durability .45 / price .25 /
delivery speed .20 / warranty .10):

- Galebrook: 9(.45) + 5(.25) + 5(.20) + 6(.10) = 4.05 + 1.25 + 1.00 +
  0.60 = **6.90**
- Ferrowind: 4(.45) + 8(.25) + 9(.20) + 8(.10) = 1.80 + 2.00 + 1.80 +
  0.80 = **6.40**
- Marrowstone: 6(.45) + 6(.25) + 6(.20) + 5(.10) = 2.70 + 1.50 + 1.20 +
  0.50 = **5.90**

Galebrook is the unique weighted winner. Raw-criteria wins: Ferrowind
wins price (8), delivery speed (9), and warranty (8) — 3 of 4
criteria; Galebrook wins only durability (9, the heaviest-weighted
criterion); Marrowstone wins none. Unweighted means (sum of 4 scores /
4): Galebrook = (9+5+5+6)/4 = 6.25; Ferrowind = (4+8+9+8)/4 = 7.25;
Marrowstone = (6+6+6+5)/4 = 5.75. The unweighted mean wrongly favors
Ferrowind — this confirms the weighting is decision-load-bearing and
is the seeded trap.

- **obj-4 example phrasings.** PASS (correctly weighted reasoning):
  "Applying the weights, Galebrook scores 6.90 versus Ferrowind's
  6.40 — durability's 0.45 weight is what tips this in Galebrook's
  favor." / "Under the binding weight vector, Galebrook's weighted
  total of 6.9 beats Ferrowind's 6.4, even though a simple average
  would favor Ferrowind." FAIL (uses unweighted average as the
  decisive figure): "Galebrook averages 6.25 across the four criteria,
  the best of the three, so it's the pick." (6.25 is the unweighted
  mean, not the weighted score, and citing it as decisive is wrong —
  it is also not even the highest unweighted mean, since Ferrowind's
  is 7.25) / "Ferrowind's average score of 7.25 is the highest, but we
  recommend Galebrook anyway for other reasons" (explicitly treats the
  unweighted figure as legitimate and doesn't ground the decision in
  the weighted total).

- **obj-5 example phrasings.** PASS: "Ferrowind wins three of the four
  raw criteria — price, delivery speed, and warranty — but durability
  carries the largest weight (0.45), and that's where Galebrook
  dominates, which is why Galebrook still comes out ahead overall." /
  "It may look like Ferrowind is the stronger contractor since it tops
  most categories, but our weighting places the most importance on
  durability, Galebrook's strongest area, so the weighted total favors
  Galebrook." FAIL (ignores the tradeoff): a memo that names Galebrook
  as the pick and reports the correct weighted scores but never
  mentions that Ferrowind wins more raw criteria, leaving the apparent
  contradiction ("Ferrowind looks stronger almost everywhere")
  unaddressed. / "Galebrook is simply the best contractor across the
  board." (false — Galebrook does not win most criteria — and elides
  the tradeoff entirely).

- **Decision defensibility**: would this memo survive a skeptical
  reader re-deriving the arithmetic? Reward memos that show the
  weighted totals for all three contractors (not just the winner) and
  make the weighting mechanism legible, so the recommendation is
  reproducible rather than asserted.
- **Tradeoff articulation**: does the memo treat the most-criteria-won
  fact as a genuine tension worth naming and resolving, rather than
  either ignoring it or treating it as a reason to hedge the
  recommendation?
- **Reasoning quality**: does REASONING.md show all three weighted
  totals computed from the matrix and weight vector, explicitly
  contrast them against the unweighted means, and confirm Galebrook is
  the correct pick because of the weighting, not despite the
  requirement to use it?
