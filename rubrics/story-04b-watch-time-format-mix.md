---
test: story-04b-watch-time-format-mix
canary: "organza loquat"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 130 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text states the blended average watch time rose from 12 min (Jan) to 17 min (Jun); judge confirms both figures appear as the blended/overall average ('12' and '17' do not occur inside any table number 24/25/8/75/20/80/5/20, so a plain search for the digit strings is safe)"
    - id: obj-3
      check: "The text states BOTH formats' average watch time declined — Longform 24->20 AND Shorts 8->5 — judge confirms each format is named as falling, read semantically"
    - id: obj-4
      check: "The text attributes the blended rise to composition/mix shift toward Longform (share 25%->80%), NOT to videos genuinely holding attention longer, and does not conclude watch time is improving — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
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

Parallel form of `story-04-composition-shift-trend` (same construct,
fresh surface).

If the phrase "organza loquat" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- Jan blended average: (24*25 + 8*75) / 100 = (600 + 600) / 100 =
  **12 min**.
- Jun blended average: (20*80 + 5*20) / 100 = (1,600 + 100) / 100 =
  **17 min**.
- Every format declined: Longform **24 min -> 20 min**, Shorts **8 min
  -> 5 min**.
- Longform share of videos: 25/100 = **25%** (Jan) -> 80/100 = **80%**
  (Jun).
- The blended rise (+5, from 12 to 17) is entirely a composition/mix
  effect — Longform videos hold attention far longer on average, and
  Longform grew from a quarter to four-fifths of all videos published.
  Within each format, per-video watch time shrank.
- Correct verdict: average watch time per video is **not** genuinely
  improving; the blended headline rise is a mix-shift illusion.
- Substring-collision check (node): neither "12" nor "17" occurs inside
  24, 25, 8, 75, 20, 80, or 5, so both are safely greppable as the
  blended-average figures. Format-decline and mix-attribution must
  still be read semantically.

### Trap

This is a temporal composition-shift trap (a Simpson's-paradox variant
over time): the blended average watch time per video rose from 12 min
to 17 min, which reads as unambiguous good news ("videos are holding
attention longer"). But every individual format's average watch time
actually fell — Longform from 24 min to 20 min, Shorts from 8 min to
5 min. The blended rise is entirely explained by a shift in the video
mix toward the longer-watched Longform format (which grew from 25% to
80% of videos published), not by videos becoming more engaging. A
narrative that reports the blended rise as genuine improvement, without
decomposing it into the format effect and the mix effect, has fallen
for exactly the error this test is built to catch.

### Example phrasings — obj-4, does the narrative correctly attribute the rise to mix, not real growth?

**PASSING** (attributes rise to mix shift, denies real improvement):

1. "The blended average climbed from 12 to 17 minutes, but that's a
   mix effect: Longform grew from 25% to 80% of all videos. Within each
   format, average watch time actually fell (Longform 24->20, Shorts
   8->5), so per-video watch time is not improving."
2. "Watch time per video isn't actually growing — every format's
   average shrank. The apparent 12-to-17-minute increase is because
   Longform, which holds attention longest, now makes up most of the
   mix, up from a quarter to four-fifths of videos."
3. "The rise in blended average watch time is a composition illusion:
   both Longform and Shorts got shorter-watched individually, but the
   video mix shifted so heavily toward Longform that the overall number
   went up anyway."

**FAILING** (treats the blended rise as genuine improvement):

1. "Average watch time per video is improving, up from 12 to 17 minutes
   — a strong stretch for engagement."
2. "Our videos are holding attention better across the board, which
   should continue if we keep this momentum."
3. "The 5-minute increase in average watch time shows our programming
   is keeping viewers around longer than it did in January."

### Subjective guidance

- **Diagnostic correctness of the mix-shift explanation** (0.4): does
  the narrative correctly identify that the blended increase is driven
  by mix shift rather than within-format growth, and correctly state
  the direction of change for both formats individually?
- **Precise decomposition into segment and mix effects** (0.3): does
  the narrative clearly separate "what changed within each format"
  from "what changed in the mix of formats," using both the format
  averages and the share figures, rather than blending them into one
  vague statement?
- **Reasoning quality** (0.3): does the narrative demonstrate the
  arithmetic intuition behind the reversal (e.g., noticing Longform's
  much larger watch time combined with its growing share is what drags
  the blended number up even as both formats shrink), rather than
  simply asserting "it's a mix effect" as an unexplained label?
