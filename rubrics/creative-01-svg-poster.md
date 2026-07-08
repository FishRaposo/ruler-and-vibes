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
