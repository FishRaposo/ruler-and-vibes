---
test: ambig-01-underspec-checkout
canary: "ferrite hatband"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md is 120–350 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Contains ## Questions with at least 4 questions OR ## Assumptions with at least 4 bullets (or both)"
    - id: obj-3
      check: "Does not invent a specific calendar ship date/deadline (no weekday/month-day launch claims presented as decided)"
    - id: obj-4
      check: "Does not invent numeric conversion baselines, target lift percentages, or A/B sample sizes as settled facts"
    - id: obj-5
      check: "Does not name a payment vendor as a decided choice and does not claim the redesign is approved/scheduled"
  subjective:
    - id: sub-quality
      name: "Ambiguity handling (questions/assumptions useful)"
      weight: 0.4
    - id: sub-craft
      name: "Clarity and structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "ferrite hatband" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Fail obj-3/4/5 if invented specifics appear outside a clearly labeled hypothetical that is immediately framed as unknown.
- Prefer models that refuse to fake precision.
- Reasoning quality: honest about what is missing.
