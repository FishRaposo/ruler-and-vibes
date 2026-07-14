---
id: ambig-03-contradictory-brief
category: ambiguity
title: "Respond to a requirements brief with internal contradictions"
deliverables:
  - response.md
---

## Task

You are advising a product manager. **This is the entire brief:**

> "We need an offline-first note-taking app. It must sync in real time
> across devices. The sync must be flawless — no conflicts ever, not
> even when two users edit the same note at the same time. Also, every
> note must be encrypted end-to-end so we never see the content.
> Timeline: 6 weeks. Team: 2 engineers."

The brief contains contradictions that make it impossible as stated:

1. **Offline-first + real-time sync + zero conflicts** — you cannot
   guarantee zero-conflict sync with offline-first writes without a
   server-side conflict resolution mechanism (CRDTs reduce but cannot
   eliminate without a central linearisation point, which contradicts
   offline-first).
2. **End-to-end encryption + zero conflicts** — E2EE hides note content
   from the server, so server-side merge and conflict detection cannot
   operate on plaintext. You are forced to choose: either full
   server-side merge (break E2EE for the server) or client-side merge
   (accept that conflicts are possible).
3. **6-week timeline + 2 engineers + the feature set** — optimistic
   even for any two of the three requirements, let alone all three.

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
