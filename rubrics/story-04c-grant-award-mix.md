---
test: story-04c-grant-award-mix
canary: "gabardine sloe"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 130 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text states the blended average award rose from 620 (first cycle) to 858 (second cycle); judge confirms both figures appear as the blended/overall average ('620' and '858' do not occur inside any table number 1100/19/946/56/500/76/410/11, so a plain search for the digit strings is safe)"
    - id: obj-3
      check: "The text states BOTH programs' average award declined — Studio 1100->946 AND Community 500->410 — judge confirms each program is named as falling, read semantically"
    - id: obj-4
      check: "The text attributes the blended rise to composition/mix shift toward Studio (share 20%->84%), NOT to grants genuinely getting bigger, and does not conclude the average grant is improving — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
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
---

## Judge guidance

Parallel form of `story-04-composition-shift-trend` (same construct, fresh surface).

If the phrase "gabardine sloe" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- First-cycle blended average: (1100*19 + 500*76) / 95 = (20,900 +
  38,000) / 95 = **620**.
- Second-cycle blended average: (946*56 + 410*11) / 67 = (52,976 +
  4,510) / 67 = **858**.
- Every program declined: Studio **$1,100 -> $946** (-14%), Community
  **$500 -> $410** (-18%).
- Studio share of funded grants: 19/95 = **20%** (first cycle) ->
  56/67 = **84%** (second cycle). Community: 80% -> 16%.
- The blended rise (+238, from 620 to 858) is entirely a
  composition/mix effect — Studio awards are much larger on average,
  and Studio grew from a fifth to more than four-fifths of all funded
  grants. Within each program, the average award shrank.
- Correct verdict: the average grant is **not** genuinely getting
  bigger; the blended headline rise is a mix-shift illusion.
- Substring-collision check (node): neither "620" nor "858" occurs
  inside 1100, 19, 946, 56, 500, 76, 410, or 11, so both are safely
  greppable as the blended-average figures. Program-decline and
  mix-attribution must still be read semantically.

### Trap

This is a temporal composition-shift trap (a Simpson's-paradox variant
over time): the blended average grant awarded rose from $620 to $858,
which reads as unambiguous good news ("grants are getting bigger"). But
every individual program's average award actually fell — Studio from
$1,100 to $946, Community from $500 to $410. The blended rise is
entirely explained by a shift in the funding mix toward the
higher-award Studio program (which grew from 20% to 84% of grant
volume), not by grants becoming more generous. A narrative that reports
the blended rise as genuine improvement, without decomposing it into
the program effect and the mix effect, has fallen for exactly the error
this test is built to catch.

### Example phrasings — obj-4, does the narrative correctly attribute the rise to mix, not real growth?

**PASSING** (attributes rise to mix shift, denies real improvement):

1. "The blended average climbed from $620 to $858, but that's a mix
   effect: Studio grew from 20% to 84% of funded grants. Within each
   program, average awards actually fell (Studio $1,100->$946,
   Community $500->$410), so grant size is not improving."
2. "Grant size isn't actually growing — every program's average award
   shrank. The apparent $620-to-$858 increase is because Studio, which
   makes bigger awards, now makes up most of the mix, up from a fifth
   to over four-fifths of volume."
3. "The rise in blended average award is a composition illusion: both
   Studio and Community grants got smaller individually, but the mix
   shifted so heavily toward Studio that the overall number went up
   anyway."

**FAILING** (treats the blended rise as genuine improvement):

1. "Average grant size is improving, up from $620 to $858 — a strong
   cycle for award value."
2. "Our grants are getting bigger across the board, which should
   continue if we keep this momentum."
3. "The $238 increase in average award shows we are funding more
   generous grants than earlier in the year."

### Subjective guidance

- **Diagnostic correctness of the mix-shift explanation** (0.4): does
  the narrative correctly identify that the blended increase is driven
  by mix shift rather than within-program growth, and correctly state
  the direction of change for both programs individually?
- **Precise decomposition into segment and mix effects** (0.3): does
  the narrative clearly separate "what changed within each program"
  from "what changed in the mix of programs," using both the program
  averages and the share figures, rather than blending them into one
  vague statement?
- **Reasoning quality** (0.3): does the narrative demonstrate the
  arithmetic intuition behind the reversal (e.g., noticing Studio's
  much larger award combined with its growing share is what drags the
  blended number up even as both programs shrink), rather than simply
  asserting "it's a mix effect" as an unexplained label?
