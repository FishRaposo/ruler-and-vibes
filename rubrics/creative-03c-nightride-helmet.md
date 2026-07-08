---
test: creative-03c-nightride-helmet
canary: "bodhran persillade"
reviewed: "pass 2026-07-04 (independent gate)"
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

Parallel form of `creative-03-landing-page` (same construct, fresh surface).

If the phrase "bodhran persillade" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Open it in a browser at both 375px and 1200px; judge what renders,
  not the source alone.

**obj-1 — Single file, opens from file://, zero external resources
(no CDN, fonts, images, icons; CSS/inline SVG only).** Everything ships
inside one `landing.html`; only fetched resources count as external, and
inline JS is allowed.
- PASS: one `.html` file with all CSS inline; every visual is drawn with
  CSS (gradients, borders, `box-shadow`, shaped elements) or inline
  `<svg>`, and it opens straight from disk.
- PASS: no `<link>`/`@import` to a font or stylesheet, no `<img>`, no
  `url(...)` pointing outside the document; any `url(...)`/`href` targets
  only an in-document `#fragment`.
- PASS: the page is unchanged offline — nothing is fetched over
  `http(s)://` (the SVG namespace URI does not count, since nothing is
  loaded from it).
- FAIL: a Google-Fonts (or other CDN) `<link>`, an `@import`, or a
  remote stylesheet/font is pulled in for the type or icons.
- FAIL: an `<img src="...">`, a `background-image: url("...png")`, or a
  `data:image/...` URI supplies part of the artwork instead of CSS/SVG.
- FAIL: the page needs a companion `.css`/`.js` file, a build step, or a
  server to render as intended.

**obj-2 — All required sections present in order: hero (headline +
subhead + CTA), three feature blocks, two fictional testimonials,
closing CTA, footer.** All five sections appear, and in this sequence.
- PASS: a hero carrying a headline, a supporting subhead, and a primary
  CTA button; then exactly three feature blocks; then two named
  testimonials; then a closing CTA repeating the action; then a footer —
  in that top-to-bottom order.
- PASS: each feature block is a distinct product strength, and each
  testimonial is one fictional person plus a single line of praise.
- PASS: the closing CTA restates the same action as the hero CTA (both
  may link to `#`), and the footer holds fictional contact info.
- FAIL: a required section is missing (e.g. no closing CTA, or no
  footer) or the hero lacks one of headline / subhead / CTA.
- FAIL: there are only two feature blocks (or four+), or only one
  testimonial, or the testimonials have no attributed names.
- FAIL: the sections appear out of the required order (e.g. testimonials
  placed above the feature blocks, or the footer above the closing CTA).

**obj-3 — Responsive: no horizontal scroll at 375px; feature blocks
stack on mobile and sit side-by-side on desktop.** Resize and check
both widths.
- PASS: at 375px nothing overflows horizontally (no sideways scrollbar),
  and the three feature blocks are stacked in a single column.
- PASS: at desktop width the same three feature blocks sit side by side
  (a 3-across row or equivalent multi-column layout).
- PASS: the reflow is driven by responsive CSS (a `max-width`
  media query, flex-wrap, or an auto-fitting grid), not by a fixed pixel
  width.
- FAIL: at 375px the page scrolls sideways because a fixed width
  (e.g. `width:1100px`) or an unwrapped row forces content past the
  viewport.
- FAIL: the feature blocks stay side-by-side on mobile (never stack), or
  stay stacked on desktop (never go side-by-side).
- FAIL: the layout is single-width only — no breakpoint or wrapping — so
  it looks identical (and broken) at 375px and 1200px.

**obj-4 — <= 400 lines.** Count the lines of the delivered
`landing.html`.
- PASS: `wc -l landing.html` reports 400 or fewer.
- PASS: the page meets the full brief within budget by reusing classes,
  gradients, and shared rules rather than repeating markup.
- PASS: exactly 400 lines is within budget.
- FAIL: the file is 401 lines or more.
- FAIL: the count is padded past 400 with near-duplicated blocks or
  dead CSS.
- FAIL: 400 lines can only be met by dropping a required section or the
  third feature block — i.e. the submission is over budget as delivered.

- Conversion craft: one single argument should run through the page — a
  through-line from headline to closing CTA, benefit-led copy tied to the
  given specs (rear turn signals, crash detection, 12-hour battery,
  USB-C, $149), CTA visually dominant. Penalize feature lists with no
  hierarchy and copy that never says what the product does for you.
- Visual design: deliberate palette and spacing, readable contrast,
  believable product presence via CSS/SVG. Penalize default-looking
  unstyled blocks and decoration that fights readability.
- Reasoning quality: does REASONING.md defend the chosen angle and what
  was cut?
