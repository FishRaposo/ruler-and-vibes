---
id: ambig-03b-contradictory-deadline-brief
category: ambiguity
title: "Respond to a product brief with a contradictory timeline and scope"
deliverables:
  - response.md
---

## Task

You are advising a product manager. **This is the entire brief:**

> "We need a real-time multiplayer whiteboard. It must support 50
> concurrent users per room with sub-100ms latency. Every stroke must
> be fully undoable by any participant. The whiteboard must work on
> iPad, Android tablet, and web with identical feature parity. Export
> to PDF, SVG, and PNG at any canvas size. Accessibility: WCAG 2.1 AA
> across all platforms. Timeline: 8 weeks. Team: 1 frontend engineer."

The brief contains contradictions that make it impossible as stated:

1. **Real-time 50-user sync + sub-100ms latency + full undo** — a
   fully-undoable stroke means every participant's client must be
   able to revert any stroke to any prior state. With 50 concurrent
   users, the operational transform or CRDT state per stroke grows
   with participant count. Sub-100ms for 50 users on a single
   engineer's timeline is not achievable.
2. **Three-platform feature parity + one engineer + 8 weeks** — even
   without the real-time constraint, shipping identical behaviour
   across iOS, Android, and web with a single engineer in 8 weeks is
   implausible. Each platform needs platform-specific rendering,
   input handling, and accessibility work.
3. **WCAG 2.1 AA + freeform canvas** — a whiteboard with freeform
   drawing and WCAG AA compliance requires screen-reader descriptions
   of visual content that the system cannot automatically generate
   and that users produce ad-hoc. This is fundamentally a hard
   accessibility problem, not an engineering one.

Write `response.md` that:

- Names each contradiction explicitly with a short explanation of why
  it cannot be resolved as stated.
- For each contradiction, proposes one concrete trade-off the PM must
  choose (not "maybe we can…" — a real fork).
- Does **not** accept the brief as-is or start planning without
  surfacing the contradictions.

## Deliverables

- `response.md`

## Constraints

- 150–400 words.
- Must contain a section `## Contradictions` with ≥1 fork per
  contradiction.
- Must NOT propose a "we'll figure it out" non-answer.
