---
test: creative-03-landing-page
canary: "copper-thread"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Single file, opens from file://, zero external resources (no CDN, fonts, images, icons; CSS/inline SVG only)"
    - id: obj-2
      check: "All required sections present in order: hero (headline + subhead + CTA), three feature blocks, two fictional testimonials, closing CTA, footer"
    - id: obj-3
      check: "Responsive: no horizontal scroll at 375px; feature blocks stack on mobile and sit side-by-side on desktop (resize and check both)"
    - id: obj-4
      check: "<= 400 lines"
  subjective:
    - id: sub-quality
      name: "Conversion craft"
      weight: 0.4
    - id: sub-craft
      name: "Visual design"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Open it in a browser at both 375px and 1200px; judge what renders,
  not the source alone.
- Conversion craft: one copper-thread should run through the page — a
  single argument from headline to closing CTA, benefit-led copy tied
  to the given specs (8-day battery, 3 modes, USB-C charging, $79),
  CTA visually dominant. Penalize feature lists with no hierarchy and
  copy that never says what the product does for you.
- Visual design: deliberate palette and spacing, readable contrast,
  believable product presence via CSS/SVG. Penalize default-looking
  unstyled blocks and decoration that fights readability.
- Reasoning quality: does REASONING.md defend the chosen angle and
  what was cut?
