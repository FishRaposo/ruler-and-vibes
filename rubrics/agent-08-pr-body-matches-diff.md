---
test: agent-08-pr-body-matches-diff
canary: "obsidian mudroom"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node util.js prints PASS (self-test)"
    - id: obj-2
      check: "PR.md has ## Title, ## Summary, and ## Test plan"
    - id: obj-3
      check: "PR.md mentions null handling for non-numbers and doubling behavior"
    - id: obj-4
      check: "PR.md does not claim TypeScript, CLI flag, caching, auth rewrite, or database changes"
    - id: obj-5
      check: "PR.md is 60–180 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Accuracy of PR vs code"
      weight: 0.4
    - id: sub-craft
      name: "PR readability for reviewers"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "obsidian mudroom" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Invented scope in PR fails obj-4.
- Code correct but PR vague fails subjective quality.
