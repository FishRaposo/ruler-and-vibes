---
id: writing-12-assembly-manual
category: writing
title: "Assembly manual from an unordered parts-and-steps dump"
deliverables:
  - manual.md
---

## Task

You are a technical writer producing the assembly manual for a
flat-pack bookshelf. Below is an **unordered dump**: a parts list and a
scrambled set of step facts, each carrying its own prerequisites. Write
a clear, correctly sequenced, numbered assembly manual from this dump.

**PARTS LIST:**

> - Panel A (left side panel)
> - Panel B (right side panel)
> - Panel C (base panel)
> - Panel D (top panel)
> - Backboard (1)
> - Shelf pins (8)
> - Cam locks (2)
> - Bolts, type M (12) — used for panel-to-panel joints
> - Bolts, type S (4) — used ONLY for the cam locks
> - Total bolts: 12 M + 4 S = 16

**STEP FACTS (scrambled order; prerequisites stated explicitly):**

> - Assemble the base by pressing Panel C onto the two feet brackets
>   until the pre-attached snap clips engage (no bolts are used for
>   this joint). This has no prerequisite and must happen before
>   side panels can be joined to it.
> - Join side panels A and B to the base (Panel C) using type-M bolts,
>   four per panel. This requires the base to already be assembled, and
>   must happen before the backboard is attached.
> - Insert the 8 shelf pins into the pre-drilled holes in panels A and
>   B. This has no prerequisite of its own, but must happen before the
>   top panel (Panel D) is fixed in place, since the pins sit under
>   where the top panel's edge will rest.
> - Fix the top panel (Panel D) to the assembled side panels using
>   type-M bolts, four total. This requires the shelf pins to already
>   be inserted.
> - Set the 2 cam locks into the backboard's mounting holes using
>   type-S bolts. This has no prerequisite of its own, but must happen
>   before the backboard is attached, since the locks cannot be
>   inserted once the backboard is closed over them.
> - Attach the backboard to the rear of the assembled unit, engaging
>   the cam locks. This requires both that the side panels are already
>   joined to the base AND that the cam locks are already set into the
>   backboard.

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
  steps, in an order that respects every stated prerequisite: base
  before side panels are joined to it; side panels joined to the base
  before the backboard is attached; shelf pins inserted before the top
  panel is fixed; cam locks set before the backboard is attached. Any
  ordering satisfying all four constraints is acceptable — the order
  does not need to match one specific canonical sequence.
- Type-S bolts must be used only for the cam locks; type-M bolts must
  be used for the panel joints (base-to-feet, side-to-base, top-to-side
  panels). No step may call for type-M bolts at the cam locks or
  type-S bolts at a panel joint.
- The total bolts named across all steps must reconcile to 12 type-M +
  4 type-S = 16.
- Every step must be a single self-contained imperative instruction
  (starts with an action verb, names specific parts) — no step may
  bundle two independent actions ambiguously into one step.
- `manual.md` must be at most 350 words (whole file, `wc -w`).
