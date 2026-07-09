---
test: writing-06c-bindery-seal-continuity
canary: "tidbit sliver"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "chapter-two.md is between 450 and 550 words inclusive, verified with wc -w (whole file)"
    - id: obj-2
      check: "chapter-two.md contradicts none of the six frozen canon facts: Senna's scar is on her RIGHT hand (not left), she does not descend fully into the sub-cellar with ease / her enclosed-space panic is not negated, Bastian is her OLDER brother (not younger), the town is named Corrow, the season stays winter, and the missing object remains a single silver seal-die (not plural seals) — judge each against the canon sheet; contradicting any one fails this check"
    - id: obj-3
      check: "All named entities from chapter one that reappear are spelled and related consistently (Senna, Bastian, Corrow) — no renamed or re-gendered characters"
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

Parallel form of `writing-06-chapter-two-continuity` (same construct, fresh
surface).

If the phrase "tidbit sliver" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

Author-verified anchors for each canon fact, as stated in Chapter One
(use these to judge contradiction, not paraphrase-matching):

1. Right-hand scar — "Senna kept her right hand tucked into her sleeve
   out of habit. The scar there ran shiny across two knuckles..." A
   contradiction is any statement that the scar is on her left hand, or
   that she favors/tucks her left hand for the same habit.
2. Cannot descend fully into the sub-cellar / panics in enclosed depths
   — "She had never been able to go all the way in... Senna had frozen
   on the fourth step, her chest clamping tight." A contradiction is
   Chapter Two showing her descending fully into the sub-cellar with
   ease, or stating she is now comfortable in enclosed depths. She may
   still approach the stairs, go partway down, or be led/carried
   through by someone else — that does not contradict the fear, but a
   calm, confident full descent under her own steam does.
3. Bastian is older (six years) — a contradiction is calling Bastian
   younger than Senna, or reversing their birth order.
4. Town is Corrow — a contradiction is renaming the town or introducing
   an inconsistent second town name for the same place.
5. Season is winter — a contradiction is explicitly shifting to spring,
   summer, or autumn without narrative justification (a single scene
   spanning into a later season across a time-skip is a judgment call;
   flag only a clear, unexplained contradiction).
6. Single silver seal-die — a contradiction is referring to "the seals"
   (plural) as the missing object, or introducing a second seal-die
   that also authenticates deeds. The trap: a careless continuation may
   slip into "the seals" out of habit; watch specifically for this.

For obj-2 (canon contradiction), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: chapter two refers throughout to "the seal-die" (singular) and
  to Senna's own right hand/sleeve habit without ever switching sides.
- PASS: chapter two shows Senna reluctantly descending partway down the
  sub-cellar stairs but stopping before the bottom, still visibly
  tense.
- PASS: Bastian is referred to as older throughout, and the town is
  called Corrow consistently, with the season staying winter.
- FAIL: chapter two has Senna descending fully into the sub-cellar
  with ease to retrieve something herself.
- FAIL: chapter two refers to "the missing seals" or introduces a
  second seal-die that also authenticates deeds.
- FAIL: chapter two calls Bastian "her younger brother" or otherwise
  reverses the sibling order.

For obj-3 (entity consistency), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: Senna and Bastian keep their names, spellings, and sibling
  relationship consistent throughout chapter two.
- PASS: Corrow is referred to consistently as the town's name, with no
  alternate name introduced for the same place.
- FAIL: a character is introduced as "Senna's sister" instead of her
  brother, or Bastian is renamed "Bastien" partway through the
  chapter.
- FAIL: the town is called "Corrow" in one paragraph and a different
  name in another without explanation.

For obj-4 (plot advancement), ship 2-3 PASS + 2-3 FAIL example
phrasings:

- PASS: chapter two opens with Senna and Bastian searching the workroom
  shelves the next morning and finding a second wax impression that
  contradicts the first.
- PASS: chapter two introduces Mr. Osgood's account of the seal-die's
  last known location, moving the mystery forward with new
  information.
- PASS: a new complication arises (e.g. the county notary sets a
  deadline, or someone else is shown searching the bindery at night).
- FAIL: chapter two mostly re-describes the impression-press scene from
  chapter one from a slightly different angle without adding new
  events.
- FAIL: chapter two opens with a lengthy recap of chapter one's plot
  points in narration before anything new happens.
- FAIL: chapter two ends in exactly the same unresolved state as
  chapter one with no new scene, discovery, or decision.

- **Narrative advancement and scene craft**: does chapter two feel like
  a real "next chapter" — a new scene, new information, or a
  meaningful decision — rather than padding or restatement? Reward
  concrete, sensory scene-building consistent with the established
  setting.
- **Voice and tone continuity**: does the prose match chapter one's
  register (spare, close third person, quiet dread under ordinary
  detail) rather than shifting into a different genre or register
  (e.g. suddenly comic, or overwrought purple prose)? A continuation
  that reads as if dropped in from a different book — however
  well-written on its own — should score lower here, the way a
  laminated instruction card glued into a hand-bound ledger reads as
  something wedged between covers it was never stitched into.
- **Reasoning quality**: does the model's process show it extracted
  the six canon constraints before drafting, explicitly checked the
  enclosed-space-panic and single-seal traps, and planned a scene that
  moves the mystery forward rather than stalling?
