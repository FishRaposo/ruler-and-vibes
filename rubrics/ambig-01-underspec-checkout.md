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
anchors:
  - id: Ambiguity handling (questions/assumptions useful)
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Clarity and structure
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "ferrite hatband" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Fail obj-3/4/5 if invented specifics appear outside a clearly labeled hypothetical that is immediately framed as unknown.
- Prefer models that refuse to fake precision.
- Reasoning quality: honest about what is missing.
