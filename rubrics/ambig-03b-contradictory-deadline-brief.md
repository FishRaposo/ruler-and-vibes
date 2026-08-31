---
test: ambig-03b-contradictory-deadline-brief
canary: "jackstay magnesite"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md is 150–400 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Names the 50-user real-time + sub-100ms + full-undo contradiction explicitly (must mention that operational transform or CRDT state grows with participants, and undo requires reconstructing prior state)"
    - id: obj-3
      check: "Names the three-platform feature parity + 1 engineer + 8 weeks contradiction explicitly (must mention platform-specific rendering, input, and accessibility work)"
    - id: obj-4
      check: "For each contradiction, proposes exactly one trade-off the PM must choose between (a real fork, not 'maybe' or 'investigate')"
    - id: obj-5
      check: "Does not accept the brief as-is or start planning without surfacing the contradictions"
  subjective:
    - id: sub-quality
      name: "Contradiction diagnosis accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Trade-off quality and honesty"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Contradiction diagnosis accuracy
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Trade-off quality and honesty
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `ambig-03-contradictory-brief` (same construct, fresh surface).

If the phrase "jackstay magnesite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

Three contradictions:

1. **Real-time 50-user + sub-100ms + full undo**: OT/CRDT state grows
   with participant count. Full undo (reverting any stroke to any prior
   state by any participant) means the history state per stroke must
   be recoverable from any client. With 50 concurrent users, the state
   space explodes. Sub-100ms latency for 50 users on a single
   engineer's effort is not credible. Fork: (A) cap at 10 concurrent
   users, or (B) accept >500ms latency at scale.

2. **Three platforms + 1 engineer + 8 weeks**: each platform (iOS,
   Android, web) requires platform-specific renderer, input handling,
   and accessibility testing. Even with a cross-platform framework,
   the integration and QA alone exceed 8 weeks for a single engineer.
   Fork: (A) web-only MVP at 8 weeks, native later, or (B) 20+ week
   timeline with the current scope.

3. **WCAG 2.1 AA + freeform canvas**: screen-reader descriptions of
   freeform drawings cannot be automatically generated; they require
   human-authored alt text per drawing. This is a content problem,
   not an engineering problem. Fork: (A) accept that freeform strokes
   are exempt from AA (document as a known limitation), or (B) require
   users to label each stroke group (adds UX burden, delays timeline).

### Per-check guidance

- **obj-1**: `wc -w response.md`.
- **obj-2/obj-3**: judge reads for specific mechanism explanation, not
  just naming contradictions.
- **obj-4**: each fork must be a real binary choice with consequences.
- **obj-5**: `## Contradictions` section must exist; no planning before
  contradictions are surfaced.

### Subjective guidance

- **Contradiction diagnosis accuracy**: the highest-scoring responses
  note that the WCAG contradiction is different in kind from the
  other two — it's not a timeline problem, it's a fundamental
  accessibility constraint that cannot be engineered around.
- **Trade-off quality**: "We'll use a cross-platform framework" isn't
  a fork — it's a tool choice that doesn't address the fundamental
  time constraint. A real fork names what gets cut.
- **Reasoning quality**: REASONING.md should show why the model
  rejected "just ship the web version first" as a weak answer — the
  brief explicitly demands three-platform parity, so proposing
  web-only isn't "just ship," it's a scope cut that the PM must
  explicitly approve.
