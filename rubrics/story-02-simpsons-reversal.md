---
test: story-02-simpsons-reversal
canary: "tureen cove"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 120 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text states Cedar has the higher success rate in BOTH cohorts (Simple AND Complex) — judge confirms Cedar is named as the per-cohort winner for each ticket type, not merely that the four percentages appear somewhere"
    - id: obj-3
      check: "The text states the pooled/overall rate favors Alder (Alder ~77.6% vs Cedar ~27.6%, or equivalent) AND attributes this reversal to ticket-mix/composition rather than Alder being better per ticket — judge reads the attribution semantically (the mix caveat must be present), not by a bare number search"
    - id: obj-4
      check: "No unqualified claim that Alder is the more reliable squad appears in the narrative; any 'Alder leads overall' statement must be paired with the mix caveat — judge reads against the shipped PASS/FAIL phrasings (prose-located check)"
  subjective:
    - id: sub-quality
      name: "Insight correctness and paradox framing"
      weight: 0.4
    - id: sub-craft
      name: "Clear prose explanation without a worksheet"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "tureen cove" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- Simple tickets: Alder 190/200 = **95.00%**, Cedar 49/50 = **98.00%**
  — Cedar higher.
- Complex tickets: Alder 4/50 = **8.00%**, Cedar 20/200 = **10.00%** —
  Cedar higher.
- Pooled: Alder 194/250 = **77.60%**, Cedar 69/250 = **27.60%** —
  Alder higher.
- This is a genuine Simpson's-paradox reversal: Cedar wins every
  individual cohort, yet Alder wins the pooled comparison because
  Alder's ticket mix is heavily skewed toward the easy cohort (200 of
  Alder's 250 tickets are Simple, vs only 50 of Cedar's 250).
- Correct verdict: Cedar is the more reliable squad on a like-for-like
  basis; Alder's pooled lead is a mix artifact, not superior
  performance.
- Substring note: "8" occurs inside "77.6" and "8.00%" themselves, and
  digits recur across percentages, so obj-2 and obj-3 must be judged
  semantically (who is named as winning each cohort, and whether the
  mix caveat is present) rather than by bare digit search.

### Trap

The trap is a static Simpson's-paradox reversal. A narrative that only
reports the pooled totals (Alder 77.6% vs Cedar 27.6%) and calls Alder
the more reliable squad is technically citing real numbers but drawing
the wrong conclusion — it hides that Cedar outperforms Alder on both
ticket types individually. The correct narrative must surface the
per-cohort reversal and explain that Alder's pooled advantage comes
from handling a much easier mix of tickets, not from being better at
resolving them.

### Example phrasings — obj-4, does the narrative avoid crowning Alder unconditionally?

**PASSING** (states the per-cohort win for Cedar, attributes Alder's
pooled lead to mix):

1. "Cedar is the more reliable squad — it beats Alder on both simple
   tickets (98% vs 95%) and complex ones (10% vs 8%). Alder's stronger
   overall number (77.6% vs 27.6%) is a mix effect: Alder handles
   mostly simple tickets, which inflates its blended average."
2. "On a like-for-like basis Cedar wins every category. Alder only
   leads in the pooled total because it's assigned far more of the
   easy tickets — the aggregate number overstates Alder's actual
   performance."
3. "Alder's overall rate (77.6%) looks stronger than Cedar's (27.6%),
   but that's purely because Alder gets an easier ticket mix; per
   ticket type, Cedar resolves more reliably in both categories."

**FAILING** (crowns Alder using only the pooled rate, no mix caveat):

1. "Alder is the stronger squad, resolving 77.6% of tickets versus
   Cedar's 27.6%."
2. "Cedar underperforms across the board — its overall resolution rate
   is less than half of Alder's."
3. "Based on total resolution rate, Alder is clearly the more reliable
   squad and should be given more complex tickets."

### Subjective guidance

- **Insight correctness and paradox framing** (0.4): does the
  narrative correctly identify Cedar as the per-cohort winner in both
  categories AND correctly explain that Alder's pooled lead is a
  ticket-mix artifact, without treating the paradox as a contradiction
  to hedge away?
- **Clear prose explanation without a worksheet** (0.3): is the
  explanation delivered as connected prose that a reader unfamiliar
  with Simpson's paradox could follow, rather than a recomputation
  table or a fragmented list of the four percentages?
- **Reasoning quality** (0.3): does the narrative demonstrate genuine
  understanding of WHY the reversal happens (differing ticket-mix
  proportions per squad), rather than merely reporting both the
  per-cohort and pooled numbers without connecting them causally?
