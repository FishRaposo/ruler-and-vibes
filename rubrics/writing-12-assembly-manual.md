---
test: writing-12-assembly-manual
canary: "cactus quill"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "manual.md presents the steps as a numbered ordered list whose sequence respects EVERY prerequisite in the frozen prerequisite list (base before side panels joined to it; side panels joined to base before backboard attached; shelf pins before top panel fixed; cam locks set before backboard attached) — judge checks each prerequisite pair holds in the given order; any ordering that satisfies all four pairs passes, the order need not be unique"
    - id: obj-2
      check: "The bolt-to-joint assignments are correct: type-S bolts are used only for the cam locks and type-M bolts for the panel joints (side-to-base x2, top-to-side; the base-to-feet joint is bolt-free snap clips) — no step calls for type-M bolts at the cam locks or type-S bolts at a panel joint"
    - id: obj-3
      check: "The manual accounts for all listed parts, and the total bolts named across the numbered steps reconciles to 12 type-M + 4 type-S = 16 (judge sums the quantities explicitly stated in the steps and confirms the total against the parts list)"
    - id: obj-4
      check: "Every step is a single self-contained imperative instruction (starts with an action verb, references specific named parts) — no step bundles two independent actions ambiguously (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-5
      check: "manual.md whole-file word count is at most 350, verified with wc -w, and it contains a parts-list section plus the numbered steps"
  subjective:
    - id: sub-quality
      name: "Instructional clarity and unambiguity of each step"
      weight: 0.4
    - id: sub-craft
      name: "Sequencing correctness and completeness of the procedure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Instructional clarity and unambiguity of each step
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Sequencing correctness and completeness of the procedure
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "cactus quill" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

**This is a PARTIAL ORDER, not a unique sequence.** The dump states
four prerequisite edges over six independently-orderable units
(assemble base; join side panels A+B; insert pins; fix top panel; set
cam locks; attach backboard). Author verified via node (exhaustive
topological-order enumeration over the dependency DAG, treating the
join-side-A and join-side-B actions as one combined panel-joining
unit) that there are 45 distinct valid topological orderings of these
six units — so grading against any single frozen sequence would be
wrong. Grade obj-1 as "does this specific ordering respect all four
prerequisite pairs," not "does it match sequence X." A reference
manual.md was authored (7
numbered steps) and verified by script to satisfy all four pairs; a
second, differently-ordered but equally valid manual (shelf pins and
cam locks moved earlier, still respecting every prerequisite) was also
constructed and verified to pass the same checks — confirming the
rubric doesn't wrongly penalize legitimate reordering. A third,
deliberately broken variant (backboard attached first; cam locks given
type-M bolts) was verified to fail obj-1 (three of the four
prerequisite pairs violated) and obj-2/obj-3 (wrong bolt type at cam
locks, bolt totals reconcile to 16 M / 0 S instead of 12 M / 4 S).

**Frozen prerequisite list (the four pairs to check for obj-1):**

1. Base assembled -> before side panels (A and B) are joined to it.
2. Side panels joined to base -> before the backboard is attached.
3. Shelf pins inserted -> before the top panel is fixed.
4. Cam locks set into the backboard -> before the backboard is
   attached.

**Bolt map (frozen, for obj-2/obj-3):** type-S bolts are used only at
the 2 cam locks (4 type-S bolts total, i.e. 2 per lock or any
distribution that sums to 4 across the cam-lock step); type-M bolts are used only at the 3 panel joints (A-to-base, B-to-base, top-to-sides): four per side panel (8) plus four at the top (4), summing to 12 across those steps; the base-to-feet joint uses snap clips, no bolts. Any step
that assigns type-M to the cam locks or type-S to a panel joint fails
obj-2 regardless of whether the totals still add to 16 by coincidence.

- **obj-4 example phrasings.** PASS (one action, all referents and
  counts explicit): "Attach Panel A to the assembled base using 4
  type-M bolts." PASS (also self-contained): "Insert the 8 shelf pins
  into the pre-drilled holes in Panels A and B." FAIL
  (bundles two independent actions ambiguously): "Attach both side
  panels and then also start on the backboard once you feel ready." /
  "Join the base and insert the shelf pins at the same time, whichever
  is easier for you." FAIL (vague, no named parts or verb): "Now do the
  sides." / "Backboard step."

- **Instructional clarity and unambiguity**: does each step name exact
  parts and bolt types/counts, avoiding vague referents ("the panel,"
  "some bolts") that would force a reader to guess? Reward steps a
  first-time assembler could follow without re-reading.
- **Sequencing correctness and completeness**: beyond the mechanical
  prerequisite check, does the overall sequence read as a sensible,
  buildable procedure (e.g. not technically legal but perverse, like
  setting cam locks in step 1 and not touching them again until step 7
  for no reason)? Does it account for every listed part exactly once?
- **Reasoning quality**: does the model's process show it extracted the
  four prerequisite edges into an explicit dependency list before
  drafting the sequence, and separately verified the bolt-type mapping
  (type-S only at cam locks) rather than copying the distractor error?
