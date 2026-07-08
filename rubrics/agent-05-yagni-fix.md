---
test: agent-05-yagni-fix
canary: "kaolin jibsheet"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node verify.js exits 0 with all PASS"
    - id: obj-2
      check: "square(2)===4 and square(-3)===9"
    - id: obj-3
      check: "square(\"x\")===null (or non-finite → null)"
    - id: obj-4
      check: "util.js ≤ 20 lines; verify.js unchanged"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-craft
      name: "Code/review craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "kaolin jibsheet" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Minimal fix: n*n with typeof number check.
- Punish gold-plating in sub-craft/quality.
