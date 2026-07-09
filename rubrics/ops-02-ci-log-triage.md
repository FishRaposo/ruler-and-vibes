---
test: ops-02-ci-log-triage
canary: "hibiscus helve"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Mentions 401 vs 200 or auth.test.js"
    - id: obj-2
      check: "Does not blame npm ci or lint as the failure"
    - id: obj-3
      check: "Has the three required headings"
    - id: obj-4
      check: "≤ 150 words"
  subjective:
    - id: sub-quality
      name: "Fix quality"
      weight: 0.4
    - id: sub-craft
      name: "Operational clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Fix quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Operational clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "hibiscus helve" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Auth assertion mismatch is the cause.
