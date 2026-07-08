---
test: creative-01b-tidewater-cartography
canary: "sackbut mirepoix"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Valid SVG that renders in a browser; viewBox is 0 0 620 930"
    - id: obj-2
      check: "Event name, dates, and venue all present as text"
    - id: obj-3
      check: "No external references (images, fonts, stylesheets, scripts)"
    - id: obj-4
      check: "<= 140 lines"
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

Parallel form of `creative-01-svg-poster` (same construct, fresh surface).

If the phrase "sackbut mirepoix" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Open the file in a browser; judge what you see, not the code alone.

**obj-1 — Valid SVG that renders in a browser; viewBox is 0 0 620 930.**
The root must be `<svg>`, the markup well-formed, and the viewBox exactly
`0 0 620 930` (portrait).
- PASS: the root `<svg>` carries `viewBox="0 0 620 930"` and the file
  opens to a rendered poster with no XML parse error.
- PASS: values equivalent up to whitespace (e.g. `viewBox="0 0 620
  930"` with extra spaces) that a browser parses to the same 620×930
  box.
- PASS: every tag is closed and nested correctly; the browser shows
  artwork rather than a raw-source or error view.
- FAIL: viewBox is missing, or is a different box such as
  `0 0 600 900` or `0 0 620 900`.
- FAIL: the SVG is malformed — an unclosed tag or stray `<` — so the
  browser shows a parse error instead of the poster.
- FAIL: the artwork is authored in landscape (width greater than
  height) rather than the required portrait box.

**obj-2 — Event name, dates, and venue all present as text.** All three
must appear as real `<text>` (or `<tspan>`) content, not baked into a
shape or an image.
- PASS: the name "Tidewater Cartography Fair", the dates
  "9–11 August 2029", and the venue "Kettleford Pier" are all present
  as selectable text.
- PASS: the name is split across two `<text>` lines but reads as
  "Tidewater Cartography Fair"; the dates use an en dash or hyphen
  ("9-11 August 2029"); the venue may carry an extra locality
  (e.g. "Kettleford Pier · Weatherfell").
- PASS: all three facts are live text nodes even if styled, rotated,
  or letter-spaced.
- FAIL: the venue (or the dates, or the name) is absent entirely.
- FAIL: a required fact is drawn as outlined paths or embedded in a
  raster/`<image>` rather than being `<text>`.
- FAIL: the dates are wrong (e.g. "9–11 July 2029" or a different
  year) or the venue names some other place than Kettleford Pier.

**obj-3 — No external references (images, fonts, stylesheets, scripts).**
Everything is drawn in pure SVG. The `xmlns="http://www.w3.org/2000/svg"`
namespace declaration is required and does NOT count as an external
reference — only fetched resources do.
- PASS: no `<image>`, no `<script>`, no `@import`, no linked/remote
  font or stylesheet; visuals are gradients, paths, shapes, patterns.
- PASS: any `url(...)` or `href` points only to an in-document
  `#fragment` (a gradient or pattern id), never to a file or URL.
- PASS: the only `http(s)://` string in the file is the SVG/xlink
  namespace URI; nothing is actually fetched.
- FAIL: an `<image href="...jpg/png">` or a `data:image/...` URI
  supplies part of the artwork.
- FAIL: a web font or stylesheet is pulled in via `@import`,
  `<link>`, or an `href` to a `.css`/font file.
- FAIL: a `<script>` element (or an `on*` handler) appears anywhere in
  the file.

**obj-4 — <= 140 lines.** Count the lines of the delivered `poster.svg`.
- PASS: `wc -l poster.svg` reports 140 or fewer.
- PASS: the poster hits the brief within budget by reusing gradients,
  groups, and paths rather than one primitive per pixel.
- PASS: exactly 140 lines is within budget.
- FAIL: the file is 141 lines or more.
- FAIL: the artwork is padded out with hundreds of near-identical
  primitives that push it over 140 lines.
- FAIL: line count can only be met by deleting a required text fact or
  the third visual element — i.e. the submission is over budget as
  delivered.

- Composition & atmosphere: hierarchy (name dominates), a believable
  bright-nautical/daylight mood, and palette discipline — strong posters
  commit to a restrained scheme rather than scattering hues.
- SVG craftsmanship: sensible use of gradients/paths/groups vs. brute
  raster-thinking; clean coordinates.
- Reasoning quality: were composition and palette actual decisions in
  REASONING.md?
