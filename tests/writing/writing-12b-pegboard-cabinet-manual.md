---
id: writing-12b-pegboard-cabinet-manual
category: writing
title: "Tool cabinet assembly manual from a scrambled parts-and-steps dump"
deliverables:
  - manual.md
---

## Task

You are a technical writer producing the assembly manual for a
flat-pack pegboard tool cabinet. Below is an **unordered dump**: a
parts list and a scrambled set of step facts, each carrying its own
prerequisites. Write a clear, correctly sequenced, numbered assembly
manual from this dump.

**PARTS LIST:**

> - Side Panel L (left side panel)
> - Side Panel R (right side panel)
> - Base Panel
> - Lid Panel (top panel)
> - Rear Pegboard Panel (1)
> - Shelf Dowels (6)
> - Latch Locks (3)
> - Screws, type H (14) — used for panel-to-panel joints
> - Screws, type F (6) — used ONLY for the latch locks
> - Total screws: 14 H + 6 F = 20

**STEP FACTS (scrambled order; prerequisites stated explicitly):**

> - Assemble the base by pressing the Base Panel onto the four corner
>   glides until the pre-attached snap tabs engage (no screws are used
>   for this joint). This has no prerequisite and must happen before
>   the side panels can be joined to it.
> - Join Side Panel L and Side Panel R to the Base Panel using type-H
>   screws, four per panel. This requires the base to already be
>   assembled, and must happen before the rear panel is attached.
> - Insert the 6 shelf dowels into the pre-drilled holes in Side Panel
>   L and Side Panel R. This has no prerequisite of its own, but must
>   happen before the lid panel is fixed in place, since the dowels
>   sit under where the lid panel's edge will rest.
> - Fix the lid panel to the assembled side panels using type-H
>   screws, six total. This requires the shelf dowels to already be
>   inserted.
> - Set the 3 latch locks into the rear pegboard panel's mounting
>   holes using type-F screws, two per lock. This has no prerequisite
>   of its own, but must happen before the rear panel is attached,
>   since the locks cannot be seated once the panel is closed over
>   them.
> - Attach the rear pegboard panel to the back of the assembled unit,
>   engaging the latch locks. This requires both that the side panels
>   are already joined to the base AND that the latch locks are
>   already set into the rear panel.

**Correction note (already reflected above): the prerequisites define
a partial order, not one single unique sequence — more than one step
ordering can satisfy every prerequisite. Any ordering that respects
all stated prerequisites is valid; there is no single "correct"
sequence to match.**

## Deliverables

- `manual.md` — a numbered assembly manual (parts list plus numbered
  steps) whose step order respects every stated prerequisite.

## Constraints

- `manual.md` must present the parts list, then a numbered list of
  steps, in an order that respects every stated prerequisite: base
  assembled before side panels are joined to it; side panels joined to
  the base before the rear panel is attached; shelf dowels inserted
  before the lid panel is fixed; latch locks set before the rear panel
  is attached. Any ordering satisfying all four constraints is
  acceptable — the order does not need to match one specific canonical
  sequence.
- Type-F screws must be used only for the latch locks; type-H screws
  must be used for the panel joints (base-to-glides, side-to-base,
  lid-to-side panels). No step may call for type-H screws at the latch
  locks or type-F screws at a panel joint.
- The total screws named across all steps must reconcile to 14 type-H
  + 6 type-F = 20.
- Every step must be a single self-contained imperative instruction
  (starts with an action verb, names specific parts) — no step may
  bundle two independent actions ambiguously into one step.
- `manual.md` must be at most 350 words (whole file, `wc -w`).
