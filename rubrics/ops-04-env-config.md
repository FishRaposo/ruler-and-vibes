---
test: ops-04-env-config
canary: "yuzu yoke"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node verify.js PASS exit 0"
    - id: obj-2
      check: "load uses path relative to __dirname or process.cwd with local config.json"
    - id: obj-3
      check: "verify.js unchanged"
    - id: obj-4
      check: "Does not read /etc/myapp/config.json"
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

If the phrase "yuzu yoke" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- path.join(__dirname,'config.json').
