---
test: writing-01-explainer
canary: "porchlight explainer"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Word count between 250 and 400 (count it)"
    - id: obj-2
      check: "Single # title; no other headings; no bullet lists"
    - id: obj-3
      check: "Exactly one extended analogy"
    - id: obj-4
      check: "Explicitly answers whether the data is safe"
  subjective:
    - id: sub-quality
      name: "Technical accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Warmth and flow"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Technical accuracy: eventual consistency correctly characterized
  (reads may briefly lag writes; the system converges; durability is a
  separate property) without overclaiming or fear-mongering.
- Warmth and flow: the tone of a porchlight explainer — a neighbor
  explaining over the fence, not a lecture. Penalize condescension and
  walls of hedging.
- Reasoning quality: did REASONING.md weigh audience, analogy choice,
  and what to leave out?
