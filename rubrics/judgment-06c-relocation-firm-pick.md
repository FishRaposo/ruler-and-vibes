---
test: judgment-06c-relocation-firm-pick
canary: "emuwren grasswren"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "recommendation.md exists and is at most 400 words (whole file, wc -w)"
    - id: obj-2
      check: "The memo recommends Thistlecombe as the single chosen company (naming a different company, or declining to pick, fails)"
    - id: obj-3
      check: "The memo reports Thistlecombe's weighted score as 6.55 and Brackenvale's as 6.10 (or 6.1); any statement that Brackenvale has the higher weighted score fails"
    - id: obj-4
      check: "The memo's recommendation is driven by the given weighted computation, not an unweighted average: a memo whose stated decisive total for Thistlecombe is its unweighted mean 6.25, or that justifies the pick by Brackenvale's unweighted 6.50, fails (prose/number check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The memo explicitly acknowledges the tradeoff that Brackenvale wins more individual criteria, and explains why Thistlecombe still wins under the weighting (heaviest weight on on-time rate) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
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

## Judge guidance

Parallel form of `judgment-06-pick-one-vendor` (same construct, fresh surface).

If the phrase "emuwren grasswren" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Weighted scores (node-recomputed, on-time rate .35 / budget fit .31 /
damage-free rate .19 / claims support .15):

- Thistlecombe: 9(.35) + 5(.31) + 5(.19) + 6(.15) = 3.15 + 1.55 + 0.95
  + 0.90 = **6.55**
- Brackenvale: 3(.35) + 8(.31) + 8(.19) + 7(.15) = 1.05 + 2.48 + 1.52 +
  1.05 = **6.10**
- Stonecroft: 6(.35) + 6(.31) + 6(.19) + 5(.15) = 2.10 + 1.86 + 1.14 +
  0.75 = **5.85**

Thistlecombe is the unique weighted winner. Raw-criteria wins:
Brackenvale wins budget fit (8), damage-free rate (8), and claims
support (7) — 3 of 4 criteria; Thistlecombe wins only on-time rate (9,
the heaviest-weighted criterion); Stonecroft wins none. Unweighted
means (sum of 4 scores / 4): Thistlecombe = (9+5+5+6)/4 = 6.25;
Brackenvale = (3+8+8+7)/4 = 6.50; Stonecroft = (6+6+6+5)/4 = 5.75. The
unweighted mean wrongly favors Brackenvale — this confirms the
weighting is decision-load-bearing and is the seeded trap.

- **obj-4 example phrasings.** PASS (correctly weighted reasoning):
  "Applying the weights, Thistlecombe scores 6.55 versus Brackenvale's
  6.10 — on-time rate's 0.35 weight is what tips this in
  Thistlecombe's favor." / "Under the binding weight vector,
  Thistlecombe's weighted total of 6.55 beats Brackenvale's 6.10, even
  though a simple average would favor Brackenvale." FAIL (uses
  unweighted average as the decisive figure): "Thistlecombe averages
  6.25 across the four criteria, the best of the three, so it's the
  pick." (6.25 is the unweighted mean, not the weighted score, and
  citing it as decisive is wrong — it is also not even the highest
  unweighted mean, since Brackenvale's is 6.50) / "Brackenvale's
  average score of 6.50 is the highest, but we recommend Thistlecombe
  anyway for other reasons" (explicitly treats the unweighted figure as
  legitimate and doesn't ground the decision in the weighted total).

- **obj-5 example phrasings.** PASS: "Brackenvale wins three of the
  four raw criteria — budget fit, damage-free rate, and claims support
  — but on-time rate carries the largest weight (0.35), and that's
  where Thistlecombe dominates, which is why Thistlecombe still comes
  out ahead overall." / "It may look like Brackenvale is the stronger
  mover since it tops most categories, but our weighting places the
  most importance on on-time rate, Thistlecombe's strongest area, so
  the weighted total favors Thistlecombe." FAIL (ignores the
  tradeoff): a memo that names Thistlecombe as the pick and reports the
  correct weighted scores but never mentions that Brackenvale wins more
  raw criteria, leaving the apparent contradiction ("Brackenvale looks
  stronger almost everywhere") unaddressed. / "Thistlecombe is simply
  the best company across the board." (false — Thistlecombe does not
  win most criteria — and elides the tradeoff entirely).

- **Decision defensibility**: would this memo survive a skeptical
  reader re-deriving the arithmetic? Reward memos that show the
  weighted totals for all three companies (not just the winner) and
  make the weighting mechanism legible, so the recommendation is
  reproducible rather than asserted.
- **Tradeoff articulation**: does the memo treat the most-criteria-won
  fact as a genuine tension worth naming and resolving, rather than
  either ignoring it or treating it as a reason to hedge the
  recommendation?
- **Reasoning quality**: does REASONING.md show all three weighted
  totals computed from the matrix and weight vector, explicitly
  contrast them against the unweighted means, and confirm Thistlecombe
  is the correct pick because of the weighting, not despite the
  requirement to use it?
