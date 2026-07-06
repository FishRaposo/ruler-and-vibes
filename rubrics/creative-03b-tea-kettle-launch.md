---
test: creative-03b-tea-kettle-launch
canary: "kalimba gremolata"
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

If the phrase "kalimba gremolata" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Open it in a browser at both 375px and 1200px; judge what renders,
  not the source alone.

**obj-1 — Single file, opens from file://, zero external resources.**
Everything self-contained; visuals via CSS and inline SVG only. Inspect
the whole file, not just the `<style>` block.
- PASS: one `.html` file with inline CSS; opened directly from disk it
  renders fully with no network access.
- PASS: every icon or product visual is drawn with inline SVG, CSS
  shapes, gradients, or `box-shadow` — no raster or linked asset.
- PASS: no `<link>` stylesheet/font, no `@import`, no `http(s)://`, no
  `<img>`, no `data:` image URI, no `url(...)` pointing outside the
  document.
- FAIL: a `<link href="https://fonts.googleapis.com/...">` or any CDN
  stylesheet/reset is pulled in.
- FAIL: an `<img>` tag, `background-image:url("kettle.png")`, or a
  `data:` image URI supplies a visual instead of CSS/SVG.
- FAIL: the page needs a companion `.css`/`.js` file or a build step,
  or only looks right when served over `http(s)://`.

**obj-2 — All required sections present in order.** hero (headline +
subhead + CTA) → three feature blocks → two testimonials → closing CTA →
footer. Count them; order matters.
- PASS: hero has a headline, a distinct supporting subhead, and a
  primary CTA button, followed by exactly three feature blocks, then two
  named testimonials, then a repeated closing CTA, then a footer.
- PASS: all five section types appear once each in the specified
  sequence, with three feature blocks and two testimonials.
- PASS: the closing CTA restates the action (e.g. the same reserve/buy)
  and a footer with fictional contact info sits last.
- FAIL: only two feature blocks (or four), or only one testimonial, or
  the testimonials lack names.
- FAIL: the closing CTA section is missing, or the footer is absent.
- FAIL: sections are out of order (e.g. testimonials before the
  features, or the footer above the closing CTA).

**obj-3 — Responsive.** No horizontal scroll at 375px; feature blocks
stack on mobile and sit side-by-side on desktop. Resize and check both
widths.
- PASS: at 375px the page fits with no sideways scrollbar and the three
  feature blocks are stacked in one column.
- PASS: at a desktop width the feature blocks sit side-by-side (a row or
  multi-column grid), driven by a media query or intrinsic wrapping.
- PASS: no fixed-width element wider than the viewport; widths use
  percentages, `max-width`, `clamp()`, flex/grid, or similar.
- FAIL: a fixed-width container (e.g. `width:900px`) forces horizontal
  scrolling at 375px.
- FAIL: the feature blocks stay side-by-side at 375px (overflowing or
  crushed) and never restack.
- FAIL: the feature blocks are always stacked at every width and never
  go side-by-side on desktop.

**obj-4 — <= 400 lines.** Count the lines of the delivered file.
- PASS: the file is 400 lines or fewer.
- PASS: e.g. `wc -l launch.html` reports a count at or under 400.
- FAIL: the file exceeds 400 lines.
- FAIL: padding, duplicated blocks, or verbose inline SVG push it over
  400 lines.

- Conversion craft: one clear through-line should run through the page — a
  single argument from headline to closing CTA, benefit-led copy tied to
  the given specs (six steep presets, 1.2-litre capacity, ~90-second
  heat, $129), CTA visually dominant. Penalize feature lists with no
  hierarchy and copy that never says what the product does for you.
- Visual design: deliberate palette and spacing, readable contrast,
  believable product presence via CSS/SVG. Penalize default-looking
  unstyled blocks and decoration that fights readability.
- Reasoning quality: does REASONING.md defend the chosen angle and what
  was cut?
