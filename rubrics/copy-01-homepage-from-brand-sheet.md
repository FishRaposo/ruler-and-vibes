---
test: copy-01-homepage-from-brand-sheet
canary: "beryl scullery"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Hero, ## Benefits, ## CTA"
    - id: obj-2
      check: "Benefits has exactly 3 bullets"
    - id: obj-3
      check: "Mentions free-for-up-to-4 or 4 housemates, CSV export, and beta receipt scan (all three fact families)"
    - id: obj-4
      check: "Contains none of: seamless, revolutionary, disrupt, leverage, magical (case-insensitive)"
    - id: obj-5
      check: "Does not invent bank integrations, AI copilot, or specific user-count metrics"
    - id: obj-6
      check: "80–200 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Persuasion within facts"
      weight: 0.4
    - id: sub-craft
      name: "Brand voice and scannability"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "beryl scullery" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Invented features fail obj-5.
- Dry fact dump without craft costs subjective points.
