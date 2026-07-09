---
test: agent-06b-repair-trim
canary: "manatee hawse"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node trim.js exits 0 and every self-test line prints PASS"
    - id: obj-2
      check: "trimBoth(\"  hi  \") returns \"hi\" (both sides trimmed)"
    - id: obj-3
      check: "Export remains trimBoth (module.exports)"
    - id: obj-4
      check: "File is ≤ 40 lines and has no dependencies"
  subjective:
    - id: sub-quality
      name: "Minimal correct repair"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Minimal correct repair
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Code clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `agent-06-repair-from-feedback` (same construct, fresh surface).

If the phrase "manatee hawse" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run node trim.js. Full gold-plate rewrites cost craft.
