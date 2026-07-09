---
test: story-04-composition-shift-trend
canary: "reef strand"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 130 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text states the blended average rose from 52 (Q1) to 72 (Q4); judge confirms both figures appear as the blended/overall average ('52' and '72' do not occur inside any table number 100/20/40/80/90/70/30, so a plain search for the digit strings is safe)"
    - id: obj-3
      check: "The text states BOTH segments' average deal size declined — Enterprise 100->90 AND SMB 40->30 — judge confirms each segment is named as falling, read semantically"
    - id: obj-4
      check: "The text attributes the blended rise to composition/mix shift toward Enterprise (share 20%->70%), NOT to deals genuinely getting bigger, and does not conclude deal size is improving — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
  subjective:
    - id: sub-quality
      name: "Diagnostic correctness of the mix-shift explanation"
      weight: 0.4
    - id: sub-craft
      name: "Precise decomposition into segment and mix effects"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Diagnostic correctness of the mix-shift explanation
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Precise decomposition into segment and mix effects
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "reef strand" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- Q1 blended average: (100*20 + 40*80) / 100 = (2,000 + 3,200) / 100 =
  **52**.
- Q4 blended average: (90*70 + 30*30) / 100 = (6,300 + 900) / 100 =
  **72**.
- Every segment declined: Enterprise **$100 -> $90**, SMB **$40 ->
  $30**.
- Enterprise share of deals: 20/100 = **20%** (Q1) -> 70/100 = **70%**
  (Q4).
- The blended rise (+20, from 52 to 72) is entirely a composition/mix
  effect — Enterprise deals are larger on average, and Enterprise grew
  from a fifth to more than two-thirds of all deals. Within each
  segment, deal size shrank.
- Correct verdict: deal size is **not** genuinely improving; the
  blended headline rise is a mix-shift illusion.
- Substring-collision check (node): neither "52" nor "72" occurs inside
  100, 20, 40, 80, 90, 70, or 30, so both are safely greppable as the
  blended-average figures. Segment-decline and mix-attribution must
  still be read semantically.

### Trap

This is a temporal composition-shift trap (a Simpson's-paradox variant
over time): the blended average deal size rose from $52 to $72, which
reads as unambiguous good news ("deals are getting bigger"). But every
individual segment's average deal size actually fell — Enterprise from
$100 to $90, SMB from $40 to $30. The blended rise is entirely
explained by a shift in customer mix toward the higher-priced
Enterprise segment (which grew from 20% to 70% of deal volume), not by
deals becoming more valuable. A narrative that reports the blended rise
as genuine improvement, without decomposing it into the segment effect
and the mix effect, has fallen for exactly the error this test is
built to catch.

### Example phrasings — obj-4, does the narrative correctly attribute the rise to mix, not real growth?

**PASSING** (attributes rise to mix shift, denies real improvement):

1. "The blended average climbed from $52 to $72, but that's a mix
   effect: Enterprise grew from 20% to 70% of all deals. Within each
   segment, average size actually fell (Enterprise $100->$90, SMB
   $40->$30), so deal size is not improving."
2. "Deal size isn't actually growing — every segment's average deal
   shrank. The apparent $52-to-$72 increase is because Enterprise,
   which closes bigger deals, now makes up most of the mix, up from a
   fifth to over two-thirds of volume."
3. "The rise in blended average deal size is a composition illusion:
   both Enterprise and SMB deals got smaller individually, but the
   sales mix shifted so heavily toward Enterprise that the overall
   number went up anyway."

**FAILING** (treats the blended rise as genuine improvement):

1. "Average deal size is improving, up from $52 to $72 — a strong
   quarter for deal value."
2. "Our deals are getting bigger across the board, which should
   continue if we keep this momentum."
3. "The $20 increase in average deal size shows our sales team is
   closing more valuable deals than a year ago."

### Subjective guidance

- **Diagnostic correctness of the mix-shift explanation** (0.4): does
  the narrative correctly identify that the blended increase is driven
  by mix shift rather than within-segment growth, and correctly state
  the direction of change for both segments individually?
- **Precise decomposition into segment and mix effects** (0.3): does
  the narrative clearly separate "what changed within each segment"
  from "what changed in the mix of segments," using both the segment
  averages and the share figures, rather than blending them into one
  vague statement?
- **Reasoning quality** (0.3): does the narrative demonstrate the
  arithmetic intuition behind the reversal (e.g., noticing Enterprise's
  much larger deal size combined with its growing share is what drags
  the blended number up even as both segments shrink), rather than
  simply asserting "it's a mix effect" as an unexplained label?
