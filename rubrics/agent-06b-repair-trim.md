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
---

## Judge guidance

Parallel form of `agent-06-repair-from-feedback` (same construct, fresh surface).

If the phrase "manatee hawse" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run node trim.js. Full gold-plate rewrites cost craft.
