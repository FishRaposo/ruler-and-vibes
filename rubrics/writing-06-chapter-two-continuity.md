---
test: writing-06-chapter-two-continuity
canary: "thornhedge tollgate"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "chapter-two.md is between 450 and 550 words inclusive, verified with wc -w (whole file)"
    - id: obj-2
      check: "chapter-two.md contradicts none of the six frozen canon facts: Wren's scar is on her LEFT hand (not right), she does not swim / her water-fear is not negated, Cass is her OLDER brother (not younger), the town is named Millrace, the season stays autumn, and the missing object remains a single brass key (not plural keys) — judge each against the canon sheet; contradicting any one fails this check"
    - id: obj-3
      check: "All named entities from chapter one that reappear are spelled and related consistently (Wren, Cass, Millrace) — no renamed or re-gendered characters"
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
anchors:
  - id: Narrative advancement and scene craft
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Voice and tone continuity with chapter one
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "thornhedge tollgate" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Author-verified anchors for each canon fact, as stated in Chapter One
(use these to judge contradiction, not paraphrase-matching):

1. Left-hand scar — "Wren kept her left hand in her coat pocket... The
   scar ran from the base of her thumb to her wrist." A contradiction
   is any statement that the scar is on her right hand, or that she
   favors/pockets her right hand for the same habit.
2. Never learned to swim / fears deep water — "She had never learned
   to swim... Wren had panicked in the shallows." A contradiction is
   Chapter Two showing her swimming, crossing water by swimming, or
   stating she is now comfortable in deep water. She may still
   approach water's edge, wade in shallows reluctantly, or be rescued
   from water — that does not contradict the fear, but confident
   swimming does.
3. Cass is older (four years) — a contradiction is calling Cass
   younger than Wren, or reversing their birth order.
4. Town is Millrace — a contradiction is renaming the town or
   introducing an inconsistent second town name for the same place.
5. Season is autumn — a contradiction is explicitly shifting to
   winter, spring, or summer without narrative justification (a
   single scene spanning into a later season across a time-skip is a
   judgment call; flag only a clear, unexplained contradiction).
6. Single brass key — a contradiction is referring to "the keys"
   (plural) as the missing object, or introducing a second key that
   also opens the strongbox. The trap: a careless continuation may
   slip into "the keys" out of habit; watch specifically for this.

For obj-2 (canon contradiction), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: chapter two refers throughout to "the key" (singular) and to
  Wren's own left hand/pocket habit without ever switching sides.
- PASS: chapter two shows Wren reluctantly wading into the shallows at
  the millpond's edge but not swimming out into deep water, still
  visibly afraid.
- PASS: Cass is referred to as older throughout, and the town is
  called Millrace consistently, with the season staying autumn.
- FAIL: chapter two has Wren swimming confidently across the millpond
  to retrieve something herself.
- FAIL: chapter two refers to "the missing keys" or introduces a
  second key that also opens the strongbox.
- FAIL: chapter two calls Cass "her younger brother" or otherwise
  reverses the sibling order.

For obj-3 (entity consistency), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: Wren and Cass keep their names, spellings, and sibling
  relationship consistent throughout chapter two.
- PASS: Millrace is referred to consistently as the town's name, with
  no alternate name introduced for the same place.
- FAIL: a character is introduced as "Wren's sister" instead of her
  brother, or Cass is renamed "Cassian" partway through the chapter.
- FAIL: the town is called "Millrace" in one paragraph and a different
  name in another without explanation.

For obj-4 (plot advancement), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: chapter two opens with Wren and Cass searching the mill
  office the next morning and finding a second ledger entry that
  contradicts the first.
- PASS: chapter two introduces Mrs. Aldridge's account of the key's
  last known location, moving the mystery forward with new
  information.
- PASS: a new complication arises (e.g. the county lawyer sets a
  deadline, or someone else is shown searching the mill at night).
- FAIL: chapter two mostly re-describes the millpond scene from
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
  setting.
- **Voice and tone continuity**: does the prose match chapter one's
  register (spare, close third person, quiet dread under ordinary
  detail) rather than shifting into a different genre or register
  (e.g. suddenly comic, or overwrought purple prose)? A continuation
  that reads as if dropped in from a different book — however
  well-written on its own — should score lower here.
- **Reasoning quality**: does the model's process show it extracted
  the six canon constraints before drafting, explicitly checked the
  never-learned-to-swim and single-key traps, and planned a scene
  that moves the mystery forward rather than stalling?
