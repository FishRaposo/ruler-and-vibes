---
test: writing-12c-quadcopter-frame-kit
canary: "flagstone millstone"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "manual.md presents the steps as a numbered ordered list whose sequence respects EVERY prerequisite in the frozen prerequisite list (hub assembled before arm units are joined to it; arm units joined to the hub before the skid plate is attached; wiring grommets threaded before the canopy shell is fixed; battery-latch clips set before the skid plate is attached) — judge checks each prerequisite pair holds in the given order; any ordering that satisfies all four pairs passes, the order need not be unique"
    - id: obj-2
      check: "The screw-to-joint assignments are correct: type-P screws are used only for the battery-latch clips and type-F screws for the arm-to-hub and canopy-to-arm joints (the hub-to-motor-mount-post joint is screw-free snap tabs) — no step calls for type-F screws at the battery-latch clips or type-P screws at a joint"
    - id: obj-3
      check: "The manual accounts for all listed parts, and the total screws named across the numbered steps reconciles to 13 type-F + 9 type-P = 22 (judge sums the quantities explicitly stated in the steps and confirms the total against the parts list)"
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

Parallel form of `writing-12-assembly-manual` (same construct, fresh
surface).

If the phrase "flagstone millstone" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

**This is a PARTIAL ORDER, not a unique sequence.** The dump states
four prerequisite edges over six independently-orderable units
(assemble hub; join arm units; thread grommets; fix canopy; set latch
clips; attach skid plate). Author verified via node (exhaustive
topological-order enumeration over the dependency DAG: hub->join,
join->skid-plate, grommets->canopy, latch-clips->skid-plate) that there
are 45 distinct valid topological orderings of these six units — so
grading against any single frozen sequence would be wrong. Grade obj-1
as "does this specific ordering respect all four prerequisite pairs,"
not "does it match sequence X." A reference manual.md was authored (6
numbered steps: hub, latch clips, grommets, join arms, canopy, skid
plate) and verified by script to satisfy all four pairs; a second,
differently-ordered but equally valid manual (grommets and latch clips
moved earlier: grommets, hub, latch clips, join arms, canopy, skid
plate) was also constructed and verified to pass the same checks —
confirming the rubric doesn't wrongly penalize legitimate reordering.
A third, deliberately broken variant (skid plate attached first; latch
clips given type-F screws) was verified to fail obj-1 (three of the
four prerequisite pairs violated: join-before-skid-plate,
grommets-before-canopy, and latch-clips-before-skid-plate all
violated, only hub-before-join survives) and obj-2/obj-3 (wrong screw
type at the latch clips; named screw totals reconcile to 22 type-F / 0
type-P instead of 13 type-F / 9 type-P — note the *grand* total of 22
still matches by coincidence even though the type breakdown is wrong,
so obj-3 must check the breakdown, not just the sum).

**Frozen prerequisite list (the four pairs to check for obj-1):**

1. Hub assembled -> before the arm units (left and right) are joined
   to it.
2. Arm units joined to hub -> before the skid plate is attached.
3. Wiring grommets threaded -> before the canopy shell is fixed.
4. Battery-latch clips set into the skid plate -> before the skid
   plate is attached.

**Screw map (frozen, for obj-2/obj-3):** type-P screws are used only at
the 3 battery-latch clips (9 type-P screws total, i.e. 3 per clip or
any distribution that sums to 9 across the latch-clip step); type-F
screws are used only at the 2 remaining joints (arm-to-hub, canopy-to-
arm): five per arm (10, across both arms) plus three at the canopy (3),
summing to 13 across those steps; the hub-to-motor-mount-post joint
uses snap tabs, no screws. Any step that assigns type-F to the latch
clips or type-P to a joint fails obj-2 regardless of whether the
totals still add to 22 by coincidence.

- **obj-4 example phrasings.** PASS (one action, all referents and
  counts explicit): "Join the left arm unit to the hub plate using 5
  type-F screws." PASS (also self-contained): "Thread the 6 wiring
  grommets into the pre-drilled channels in the arm units." FAIL
  (bundles two independent actions ambiguously): "Join both arm units
  and then also start on the skid plate once you feel ready." / "Press
  the hub together and seat the latch clips at the same time,
  whichever is easier for you." FAIL (vague, no named parts or verb):
  "Now do the arms." / "Skid plate step."

- **Instructional clarity and unambiguity**: does each step name exact
  parts and screw types/counts, avoiding vague referents ("the arm,"
  "some screws") that would force a reader to guess? Reward steps a
  first-time builder could follow without re-reading.
- **Sequencing correctness and completeness**: beyond the mechanical
  prerequisite check, does the overall sequence read as a sensible,
  buildable procedure (e.g. not technically legal but perverse, like
  seating the latch clips in step 1 and not touching the skid plate
  again until step 6 for no reason)? Does it account for every listed
  part exactly once?
- **Reasoning quality**: does the model's process show it extracted
  the four prerequisite edges into an explicit dependency list before
  drafting the sequence, and separately verified the screw-type
  mapping (type-P only at the latch clips) rather than copying the
  distractor error?
