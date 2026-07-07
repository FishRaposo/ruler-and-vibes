---
test: story-02b-phlebotomist-veins
canary: "calico graupel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 120 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text states Ferris has the higher first-stick rate in BOTH tiers (Routine AND Fragile) — judge confirms Ferris is named as the per-tier winner for each vein tier, not merely that the four percentages appear somewhere"
    - id: obj-3
      check: "The text states the pooled/overall rate favors Marlow (Marlow ~87.3% vs Ferris ~39%, or equivalent) AND attributes this reversal to patient-mix/caseload composition rather than Marlow being better per draw — judge reads the attribution semantically (the mix caveat must be present), not by a bare number search"
    - id: obj-4
      check: "No unqualified claim that Marlow is the more reliable phlebotomist appears in the narrative; any 'Marlow leads overall' statement must be paired with the mix caveat — judge reads against the shipped PASS/FAIL phrasings (prose-located check)"
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

Parallel form of `story-02-simpsons-reversal` (same construct, fresh
surface).

If the phrase "calico graupel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- Routine veins: Marlow 261/290 = **90.00%**, Ferris 93/100 =
  **93.00%** — Ferris higher.
- Fragile veins: Marlow 1/10 = **10.00%**, Ferris 24/200 = **12.00%**
  — Ferris higher.
- Pooled: Marlow 262/300 = **87.33%**, Ferris 117/300 = **39.00%** —
  Marlow higher.
- This is a genuine Simpson's-paradox reversal: Ferris wins every
  individual tier, yet Marlow wins the pooled comparison because
  Marlow's caseload is heavily skewed toward the easy tier (290 of
  Marlow's 300 attempts are Routine, vs only 100 of Ferris's 300).
- Correct verdict: Ferris is the more reliable phlebotomist on a
  like-for-like basis; Marlow's pooled lead is a mix artifact, not
  superior performance.
- Substring note: "90" occurs inside "290" and "10" occurs inside
  "100", and digits recur across percentages, so obj-2 and obj-3 must
  be judged semantically (who is named as winning each tier, and
  whether the mix caveat is present) rather than by bare digit search.

### Trap

The trap is a static Simpson's-paradox reversal. A narrative that only
reports the pooled totals (Marlow 87.3% vs Ferris 39%) and calls
Marlow the more reliable phlebotomist is technically citing real
numbers but drawing the wrong conclusion — it hides that Ferris
outperforms Marlow on both vein tiers individually. The correct
narrative must surface the per-tier reversal and explain that Marlow's
pooled advantage comes from working a much easier mix of veins, not
from being better at drawing blood.

### Example phrasings — obj-4, does the narrative avoid crowning Marlow unconditionally?

**PASSING** (states the per-tier win for Ferris, attributes Marlow's
pooled lead to mix):

1. "Ferris is the more reliable phlebotomist — Ferris beats Marlow on
   routine veins (93% vs 90%) and fragile ones (12% vs 10%). Marlow's
   stronger overall number (87% vs 39%) is a mix effect: Marlow works
   mostly routine veins, which inflates the blended average."
2. "Tier for tier Ferris wins every category. Marlow only leads in the
   pooled total because Marlow is handed far more of the easy routine
   draws — the aggregate number overstates Marlow's actual reliability."
3. "Marlow's overall rate (87%) looks stronger than Ferris's (39%),
   but that's purely because Marlow gets an easier vein mix; per tier,
   Ferris draws more reliably in both categories."

**FAILING** (crowns Marlow using only the pooled rate, no mix caveat):

1. "Marlow is the stronger phlebotomist, landing 87% of draws
   first-stick versus Ferris's 39%."
2. "Ferris underperforms across the board — the overall first-stick
   rate is less than half of Marlow's."
3. "Based on total first-stick rate, Marlow is clearly the more
   reliable phlebotomist and should take the harder fragile-vein
   patients."

### Subjective guidance

- **Insight correctness and paradox framing** (0.4): does the
  narrative correctly identify Ferris as the per-tier winner in both
  categories AND correctly explain that Marlow's pooled lead is a
  patient-mix artifact, without treating the paradox as a contradiction
  to hedge away?
- **Clear prose explanation without a worksheet** (0.3): is the
  explanation delivered as connected prose that a reader unfamiliar
  with Simpson's paradox could follow, rather than a recomputation
  table or a fragmented list of the four percentages?
- **Reasoning quality** (0.3): does the narrative demonstrate genuine
  understanding of WHY the reversal happens (differing vein-mix
  proportions per phlebotomist), rather than merely reporting both the
  per-tier and pooled numbers without connecting them causally?
