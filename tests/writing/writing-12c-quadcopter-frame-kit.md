---
id: writing-12c-quadcopter-frame-kit
category: writing
title: "Assembly manual from an unordered parts-and-steps dump"
deliverables:
  - manual.md
---

## Task

You are a technical writer producing the assembly manual for a
hobbyist quadcopter frame kit. Below is an **unordered dump**: a parts
list and a scrambled set of step facts, each carrying its own
prerequisites. Write a clear, correctly sequenced, numbered assembly
manual from this dump.

**PARTS LIST:**

> - Bottom hub plate (1)
> - Arm unit, left (1)
> - Arm unit, right (1)
> - Canopy shell (1)
> - Rear skid plate (1)
> - Wiring grommets (6)
> - Battery-latch clips (3)
> - Screws, type F (13) — used for arm-to-hub and canopy-to-arm joints
> - Screws, type P (9) — used ONLY for the battery-latch clips
> - Total screws: 13 F + 9 P = 22

**STEP FACTS (scrambled order; prerequisites stated explicitly):**

> - Assemble the hub by pressing the bottom hub plate onto the two
>   motor-mount posts until the pre-molded snap tabs engage (no screws
>   are used for this joint). This has no prerequisite and must happen
>   before the arm units can be joined to it.
> - Join the left and right arm units to the hub plate using type-F
>   screws, five per arm. This requires the hub to already be
>   assembled, and must happen before the rear skid plate is attached.
> - Thread the 6 wiring grommets into the pre-drilled channels in the
>   left and right arm units. This has no prerequisite of its own, but
>   must happen before the canopy shell is fixed in place, since the
>   grommets sit under where the canopy's inner lip will rest.
> - Fix the canopy shell to the assembled arm units using type-F
>   screws, three total. This requires the wiring grommets to already
>   be threaded in place.
> - Set the 3 battery-latch clips into the rear skid plate's mounting
>   slots using type-P screws, three per clip. This has no prerequisite
>   of its own, but must happen before the skid plate is attached,
>   since the clips cannot be seated once the skid plate is closed over
>   them.
> - Attach the rear skid plate to the back of the assembled frame,
>   engaging all three battery-latch clips. This requires both that the
>   arm units are already joined to the hub AND that the battery-latch
>   clips are already set into the skid plate.

**Correction note (already reflected above): the prerequisites define a
partial order, not one single unique sequence — more than one step
ordering can satisfy every prerequisite. Any ordering that respects all
stated prerequisites is valid; there is no single "correct" sequence to
match.**

## Deliverables

- `manual.md` — a numbered assembly manual (parts list plus numbered
  steps) whose step order respects every stated prerequisite.

## Constraints

- `manual.md` must present the parts list, then a numbered list of
  steps, in an order that respects every stated prerequisite: hub
  assembled before arm units are joined to it; arm units joined to the
  hub before the skid plate is attached; wiring grommets threaded
  before the canopy shell is fixed; battery-latch clips set before the
  skid plate is attached. Any ordering satisfying all four constraints
  is acceptable — the order does not need to match one specific
  canonical sequence.
- Type-P screws must be used only for the battery-latch clips; type-F
  screws must be used for the arm-to-hub and canopy-to-arm joints (the
  hub-to-motor-mount-post joint uses snap tabs, no screws at all). No
  step may call for type-F screws at the battery-latch clips or type-P
  screws at a joint.
- The total screws named across all steps must reconcile to 13 type-F +
  9 type-P = 22.
- Every step must be a single self-contained imperative instruction
  (starts with an action verb, names specific parts) — no step may
  bundle two independent actions ambiguously into one step.
- `manual.md` must be at most 350 words (whole file, `wc -w`).
