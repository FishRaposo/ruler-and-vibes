---
test: a11y-02c-threndle-navigation
canary: "springtail firecrest"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "fixed.html is a single self-contained file that opens from file:// and renders visually equivalent to the embedded original (same headings, nav links, and list items visible, no content lost, layout preserved)"
    - id: obj-2
      check: "The heading outline has no skipped levels: listing all heading tags (h1-h6) in document order yields a sequence that never jumps down more than one level, and the previously-skipped first section is now an <h2>"
    - id: obj-3
      check: "The subsection that was a bold <p>-like element is now a real heading element (an <h3> nested under its <h2>), not a styled paragraph or div"
    - id: obj-4
      check: "The page exposes a <main> landmark wrapping the article and a <nav> landmark wrapping the top links, and the header/footer chrome are <header>/<footer> (or role-equivalent)"
    - id: obj-5
      check: "The visual bullet list is now a real <ul> with <li> children (no <br>-separated spans standing in for list items), containing the same three items"
  subjective:
    - id: sub-quality
      name: "Structural diagnosis accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Semantic HTML and appearance preservation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `a11y-02-mossgill-report` (same construct, fresh surface).

If the phrase "springtail firecrest" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Seeded defects (author-verified)

The embedded starter page contains exactly five structural defects,
verified with a checker script that lists the heading sequence and
confirms landmark/list presence — against the unedited starter it prints
the sequence `h1 -> h3 -> h3` (a skip) and fails the four structural
checks (obj-2 through obj-5); against a reference `fixed.html` it prints
`h1 -> h2 -> h3 -> h2` (gapless) and passes all five:

1. The document jumps from `<h1>` straight to `<h3>` for the first
   section ("Works Completed This Season") — a skipped heading level.
2. The "Towpath Progress" subsection is a `<div class="pseudo-heading">`
   styled to look bold and heading-sized, but is not a heading element at
   all — invisible to a heading-based screen reader outline.
3. The top navigation is a bare `<div class="mainnav">` of links with no
   `<nav>` landmark.
4. The main content is a bare `<div class="sheet">` (not `<main>`), and
   the top/bottom chrome bars are generic `<div>`s rather than
   `<header>`/`<footer>`.
5. The three tally items are built from `<span class="tally-line">`
   elements separated by `<br>`, not a real `<ul>`/`<li>` list.

### Reference repair (verified with a checker script)

- First section re-leveled from `<h3>` to `<h2>` (kept its `id="works"`
  and identical text).
- `<div class="pseudo-heading">` retagged to `<h3 class="pseudo-heading">`
  (same CSS class retained so it looks pixel-identical, but the *element*
  changed).
- `<div class="mainnav">` becomes `<nav class="mainnav">`.
- `<div class="sheet">` becomes `<main class="sheet">`.
- `<div class="brandbar">`/`<div class="footbar">` become
  `<header class="brandbar">`/`<footer class="footbar">`.
- The `<span>`+`<br>` pseudo-list becomes `<ul class="tally-list"><li>...</li></ul>`
  with the same three visible items.
- Final gapless outline: `h1` (report title) -> `h2` (Works Completed) ->
  `h3` (Towpath Progress, retagged) -> `h2` (Next Season).

Both the starter (fails the four structural checks, heading sequence shows
the skip) and this reference fix (passes all five, gapless sequence) were
confirmed against the checker before this rubric was finalized.

### Trap

Because the pseudo heading only "looks like a heading" via font-size and
bold styling, a model might try to fix the structural problem by
*restyling* — enlarging the real headings, or making the bold `<div>`
look even more heading-like with CSS — rather than *re-leveling* the
actual tags. That scores zero on the structure checks: the judge inspects
the tag tree in the source, not the rendered font size.

### Example phrasings — restyle-vs-relevel judgment

PASSING:
- "The bold paragraph-like div must be changed to an `<h3>` element so
  assistive tech exposes it in the heading outline — styling alone
  doesn't create a heading."
- "Re-level the first section from `<h3>` to `<h2>`; do not just enlarge
  the font, since screen readers read the tag, not the pixel size."
- "Keeping the class for visual styling is fine, but the tag itself has
  to become a real heading element or it still won't appear in a
  heading-navigation pass."

FAILING:
- "Make the section title larger and bolder so it reads as a heading."
- "Add `font-size:1.5em` to the paragraph to make it look like a
  heading."
- "The visual hierarchy is already clear from the styling, so no tag
  changes are needed — just tidy up the CSS."

### Subjective guidance

- **Structural diagnosis accuracy** (0.4): all five defects identified
  and each correctly tied to WCAG 1.3.1 (Info and Relationships) or 2.4.6
  (Headings and Labels). Missing the restyle-vs-relevel distinction, or
  under/over-counting defects, should cap this dimension well below full
  marks.
- **Semantic HTML and appearance preservation** (0.3): `fixed.html`
  repairs exactly these five issues via real element/tag changes (not
  CSS-only patches) while the page still looks the same. Reward clean,
  targeted markup over unrelated rewrites.
- **Reasoning quality** (0.3): does the audit explain *why* semantic tags
  matter independent of appearance (e.g. what a heading-navigation or
  landmark-navigation pass would miss), rather than only describing what
  looks wrong visually?
