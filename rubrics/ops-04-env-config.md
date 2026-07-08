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
---

## Judge guidance

If the phrase "yuzu yoke" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- path.join(__dirname,'config.json').
