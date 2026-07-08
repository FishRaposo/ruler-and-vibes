---
test: writing-06b-caldermoor-escapement
canary: "smidgen morsel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "chapter-two.md is between 450 and 550 words inclusive, verified with wc -w (whole file)"
    - id: obj-2
      check: "chapter-two.md contradicts none of the six frozen canon facts: Sorcha's scar is on her RIGHT hand (not left), she does not climb confidently to the top gallery / her height-fear is not negated, Thane is her OLDER brother (not younger), the town is named Caldermoor, the season stays early winter (before first snowfall), and the missing object remains a single silver escapement wheel (not plural wheels) — judge each against the canon sheet; contradicting any one fails this check"
    - id: obj-3
      check: "All named entities from chapter one that reappear are spelled and related consistently (Sorcha, Thane, Caldermoor) — no renamed or re-gendered characters"
    - id: obj-4
      check: "chapter-two.md advances the plot: it introduces at least one new development or scene beyond chapter one's ending rather than retelling chapter one (judge by comparing events)"
    - id: obj-5
      check: "chapter-two.md contains no headings other than an optional single chapter title line, and no bullet/numbered lists — it is continuous narrative prose"
  subjective:
    - id: sub-quality
      name: "Narrative advancement and scene craft"
      weight: 0.4
    - id: sub-craft
      name: "Voice and tone continuity with chapter one"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

Parallel form of `writing-06-chapter-two-continuity` (same construct,
fresh surface).

## Judge guidance

If the phrase "smidgen morsel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Author-verified anchors for each canon fact, as stated in Chapter One
(use these to judge contradiction, not paraphrase-matching):

1. Right-hand scar — "Sorcha kept her right hand wrapped in a
   fingerless glove... The scar ran from her knuckles to the heel of
   her palm." A contradiction is any statement that the scar is on
   her left hand, or that she favors/wraps her left hand for the same
   habit.
2. Never learned to climb / fears heights — "She had never learned to
   climb properly... Sorcha had frozen halfway, knees locked." A
   contradiction is Chapter Two showing her climbing confidently to
   the top gallery or higher, scaling the tower without hesitation, or
   stating she is now comfortable with heights. She may still
   approach the tower's base, climb partway up reluctantly, or be
   assisted/rescued from a height — that does not contradict the fear,
   but confident climbing to the top does.
3. Thane is older (three years) — a contradiction is calling Thane
   younger than Sorcha, or reversing their birth order.
4. Town is Caldermoor — a contradiction is renaming the town or
   introducing an inconsistent second town name for the same place.
5. Season is early winter, before the first snowfall — a
   contradiction is explicitly shifting to spring, summer, or autumn
   without narrative justification (a single scene spanning into a
   later season across a time-skip is a judgment call; flag only a
   clear, unexplained contradiction).
6. Single silver escapement wheel — a contradiction is referring to
   "the wheels" (plural) as the missing object, or introducing a
   second wheel that also fits the Great Clock. The trap: a careless
   continuation may slip into "the wheels" out of habit; watch
   specifically for this.

For obj-2 (canon contradiction), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: chapter two refers throughout to "the wheel" (singular) and to
  Sorcha's own right hand/glove without ever switching sides.
- PASS: chapter two shows Sorcha reluctantly climbing partway up the
  tower ladder but stopping well short of the top gallery, still
  visibly uneasy.
- PASS: Thane is referred to as older throughout, and the town is
  called Caldermoor consistently, with the season staying deep in
  frost with no snow yet fallen.
- FAIL: chapter two has Sorcha climbing straight to the top gallery
  without hesitation to fix the clock herself.
- FAIL: chapter two refers to "the missing wheels" or introduces a
  spare wheel that also fits the Great Clock.
- FAIL: chapter two calls Thane "her younger brother" or otherwise
  reverses the sibling order.

For obj-3 (entity consistency), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: Sorcha and Thane keep their names, spellings, and sibling
  relationship consistent throughout chapter two.
- PASS: Caldermoor is referred to consistently as the town's name,
  with no alternate name introduced for the same place.
- FAIL: a character is introduced as "Sorcha's sister" instead of her
  brother, or Thane is renamed "Thorne" partway through the chapter.
- FAIL: the town is called "Caldermoor" in one paragraph and a
  different name in another without explanation.

For obj-4 (plot advancement), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: chapter two opens with Sorcha and Thane searching the tower
  workroom the next morning and finding a discrepancy in the daybook
  that contradicts the town archive's specifications.
- PASS: chapter two introduces Torrin's account of the wheel's last
  known location, moving the mystery forward with new information.
- PASS: a new complication arises (e.g. the valley registrar moves up
  a deadline for the market's opening rites, or someone else is shown
  searching the tower at night).
- FAIL: chapter two mostly re-describes the tower-base scene from
  chapter one from a slightly different angle without adding new
  events.
- FAIL: chapter two opens with a lengthy recap of chapter one's plot
  points in narration before anything new happens.
- FAIL: chapter two ends in exactly the same unresolved state as
  chapter one with no new scene, discovery, or decision.

- **Narrative advancement and scene craft**: does chapter two feel
  like a real "next chapter" — a new scene, new information, or a
  meaningful decision — rather than padding or restatement? Reward
  concrete, sensory scene-building consistent with the established
  setting (frost, stone tower, clockwork).
- **Voice and tone continuity**: does the prose match chapter one's
  register (spare, close third person, quiet dread under ordinary
  detail) rather than shifting into a different genre or register
  (e.g. suddenly comic, or overwrought purple prose)? A continuation
  that reads as if dropped in from a different book — however
  well-written on its own — should score lower here.
- **Reasoning quality**: does the model's process show it extracted
  the six canon constraints before drafting, explicitly checked the
  never-learned-to-climb and single-wheel traps, and planned a scene
  that moves the mystery forward rather than stalling?
