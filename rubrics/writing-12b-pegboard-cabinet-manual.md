---
test: writing-12b-pegboard-cabinet-manual
canary: "wreath ribbon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "manual.md presents the steps as a numbered ordered list whose sequence respects EVERY prerequisite in the frozen prerequisite list (base assembled before side panels joined to it; side panels joined to base before rear panel attached; shelf dowels inserted before lid panel fixed; latch locks set before rear panel attached) — judge checks each prerequisite pair holds in the given order; any ordering that satisfies all four pairs passes, the order need not be unique"
    - id: obj-2
      check: "The screw-to-joint assignments are correct: type-F screws are used only for the latch locks and type-H screws for the panel joints (side-to-base x2, lid-to-side; the base-to-glides joint is screw-free snap tabs) — no step calls for type-H screws at the latch locks or type-F screws at a panel joint"
    - id: obj-3
      check: "The manual accounts for all listed parts, and the total screws named across the numbered steps reconciles to 14 type-H + 6 type-F = 20 (judge sums the quantities explicitly stated in the steps and confirms the total against the parts list)"
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
---

## Judge guidance

Parallel form of `writing-12-assembly-manual` (same construct, fresh surface).

If any deliverable contains the phrase "wreath ribbon", that is a
canary leak (the phrase belongs only in this rubric) — flag it
regardless of how the rest of the checks score.

**This is a PARTIAL ORDER, not a unique sequence.** The dump states
four prerequisite pairs, six underlying prerequisite edges. Author
verified via node that with these six edges there are 168 distinct
valid topological orderings of the seven listed actions (assemble
base; join side L; join side R; insert dowels; fix lid; set latch
locks; attach rear panel) — so grading against any single frozen
sequence would be wrong. Grade obj-1 as "does this specific ordering
respect all four prerequisite pairs," not "does it match sequence X."
A reference manual.md was authored (7 numbered steps) and verified by
script to satisfy all four pairs; a second, differently-ordered but
equally valid manual (shelf dowels and latch locks moved earlier,
still respecting every prerequisite) was also constructed and verified
to pass the same checks — confirming the rubric doesn't wrongly
penalize legitimate reordering. A third, deliberately broken variant
(rear panel attached first, before the base is even assembled; latch
locks given type-H screws) was verified to fail obj-1 (three of the
four prerequisite pairs violated) and obj-2/obj-3 (wrong screw type at
the latch locks, screw totals reconcile to 20 type-H / 0 type-F
instead of 14 type-H / 6 type-F).

**Frozen prerequisite list (the four pairs to check for obj-1):**

1. Base assembled -> before side panels (L and R) are joined to it.
2. Side panels joined to base -> before the rear panel is attached.
3. Shelf dowels inserted -> before the lid panel is fixed.
4. Latch locks set into the rear panel -> before the rear panel is
   attached.

**Screw map (frozen, for obj-2/obj-3):** type-F screws are used only
at the 3 latch locks (6 type-F screws total, i.e. 2 per lock or any
distribution that sums to 6 across the latch-lock step); type-H
screws are used only at the 3 panel joints (L-to-base, R-to-base,
lid-to-sides): four per side panel (8) plus six at the lid, summing to
14 across those steps; the base-to-glides joint uses snap tabs, no
screws. Any step that assigns type-H to the latch locks or type-F to a
panel joint fails obj-2 regardless of whether the totals still add to
20 by coincidence.

- **obj-4 example phrasings.** PASS (one action, all referents and
  counts explicit): "Join Side Panel L to the assembled base using 4
  type-H screws." PASS (also self-contained): "Insert the 6 shelf
  dowels into the pre-drilled holes in Side Panel L and Side Panel
  R." FAIL (bundles two independent actions ambiguously): "Join both
  side panels and then also start on the rear panel once you feel
  ready." / "Fix the lid and insert the shelf dowels at the same time,
  whichever is easier for you." FAIL (vague, no named parts or verb):
  "Now do the sides."

- **Instructional clarity and unambiguity**: does each step name exact
  parts and screw types/counts, avoiding vague referents ("the panel,"
  "some screws") that would force a reader to guess? Reward steps a
  first-time assembler could follow without re-reading.
- **Sequencing correctness and completeness**: beyond the mechanical
  prerequisite check, does the overall sequence read as a sensible,
  buildable procedure (e.g. not technically legal but perverse, like
  setting the latch locks in step 1 and not touching them again until
  step 7 for no reason)? Does it account for every listed part exactly
  once?
- **Reasoning quality**: does the model's process show it extracted
  the four prerequisite edges into an explicit dependency list before
  drafting the sequence, and separately verified the screw-type
  mapping (type-F only at the latch locks) rather than copying the
  distractor error?
