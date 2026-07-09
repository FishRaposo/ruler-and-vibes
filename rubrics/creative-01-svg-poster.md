---
test: creative-01-svg-poster
canary: "amber-grid composition"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Valid SVG that renders in a browser; viewBox is 0 0 600 900"
    - id: obj-2
      check: "Event name, dates, and venue all present as text"
    - id: obj-3
      check: "No external references (images, fonts, stylesheets, scripts)"
    - id: obj-4
      check: "<= 150 lines"
  subjective:
    - id: sub-quality
      name: "Composition & atmosphere"
      weight: 0.4
    - id: sub-craft
      name: "SVG craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Composition & atmosphere
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: SVG craftsmanship
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "amber-grid composition" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

- Open the file in a browser; judge what you see, not the code alone.
- Composition & atmosphere: hierarchy (name dominates), believable
  aurora/night mood, and palette discipline — strong posters commit to a
  restrained scheme rather than scattering hues.
- SVG craftsmanship: sensible use of gradients/paths/groups vs. brute
  raster-thinking; clean coordinates.
- Reasoning quality: were composition and palette actual decisions in
  REASONING.md?
