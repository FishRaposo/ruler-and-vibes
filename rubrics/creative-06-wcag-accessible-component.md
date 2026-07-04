---
test: creative-06-wcag-accessible-component
canary: "windlass reverie"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "card.html renders from file:// as a single self-contained file with no external resources (no CDN, <link> stylesheet, remote font, or <img> src to a URL; inline CSS/SVG only) AND uses only flat solid colors behind text: no gradient, no rgba/hsla/alpha channel, no opacity<1, no background-image (judge greps the CSS to confirm each rule the pairing check relies on is a solid hex/rgb color)"
    - id: obj-2
      check: "Every normal-size text run meets >= 4.5:1 against its actual solid background, and the price heading (>=24px) and the button label each meet >= 3:1: the judge reads each text element's color and its single solid background hex from the CSS, recomputes the ratio with the WCAG relative-luminance formula, and confirms the failing 2.03:1 orange-on-white pair from the starter does not survive on any text"
    - id: obj-3
      check: "The action control is a real <button> element (or <a role=\"button\">) with a non-empty accessible name, not a bare clickable <div>/<span> (judge inspects the element and its text/aria-label)"
    - id: obj-4
      check: "Semantic structure present: the plan name is in a heading element (<h1>-<h6>) and the three features are marked up as <li> inside a <ul> or <ol> (judge parses the DOM/markup)"
    - id: obj-5
      check: "The required content appears as text: plan name 'Meridian', price '$29/mo', exactly three feature lines, and a button label (judge reads rendered text content)"
  subjective:
    - id: sub-quality
      name: "Visual design & readability"
      weight: 0.4
    - id: sub-craft
      name: "Semantic & accessible markup"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: windlass reverie.

- WCAG relative-luminance formula (sRGB, per-channel): for channel
  value `c` in [0,1], `cs = c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`;
  `L = 0.2126*Rs + 0.7152*Gs + 0.0722*Bs`; contrast ratio between two
  luminances `= (Lmax+0.05)/(Lmin+0.05)`.
- Author-verified reference values (recomputed with a node script
  implementing the formula above):
  - Starter's failing pair, `#f5a623` on `#ffffff` = **2.03:1** — below
    AA (4.5:1), confirms the seeded defect is real.
  - Reference fix: plan name `#0b7285` on `#ffffff` = **5.59:1** (PASS,
    needs 4.5); price `#1a5f7a` on `#ffffff` = **7.09:1** (PASS, needs
    3.0, >=24px heading); features `#595959` on `#ffffff` = **7.00:1**
    (PASS, needs 4.5); button label `#ffffff` on `#1a5f7a` = **7.09:1**
    (PASS, needs 3.0).
  - Extra fail example: `#aaaaaa` on `#ffffff` = **2.32:1** (FAIL, below
    4.5 for normal text).
  - All values reproduced independently with a node contrast script;
    the starter's 2.03:1 pair and the reference's four passing pairs
    both match exactly.
- PASS example pairings (compare submissions against these): "`#595959`
  text on `#ffffff` card background = 7.00:1, PASS (>=4.5 required)";
  "white `#ffffff` button label on `#1a5f7a` button background = 7.09:1,
  PASS (>=3.0 required, button label)"; "`#0b7285` heading on `#ffffff`
  = 5.59:1, PASS (>=4.5 required, normal text)".
- FAIL example pairings: "`#f5a623` body text on `#ffffff` = 2.03:1,
  FAIL (needs 4.5)"; "light-gray `#aaaaaa` on `#ffffff` = 2.32:1, FAIL
  (needs 4.5)"; "a gradient or `rgba()` background behind text = FAIL
  obj-1, the pairing is not decidable from a single solid literal
  regardless of the resulting ratio".
- Verified end-to-end with a node script that (a) extracts each
  selector's `color`/`background` from the embedded CSS, (b)
  recomputes contrast, and (c) checks semantic structure: run against
  the unedited starter, obj-2/obj-3/obj-4 all fail (every text pair is
  2.03:1, the control is a `<div onclick>`, no heading/list markup);
  run against a corrected reference using the four hex pairs above,
  every check passes. This confirms the starter's failure is real and
  the fix criteria are achievable with flat colors alone.
- **obj-1**: grep the `<style>` block for `gradient`, `rgba(`, `hsla(`,
  `opacity` values below 1, and `background-image`; confirm no `<link
  rel="stylesheet">`, no remote `src="http…"`/`href="http…"`.
- **obj-2**: for each text-bearing selector, pair its `color` with the
  nearest ancestor's solid `background`/`background-color` (default to
  the card's white background if unset), recompute contrast, and check
  against the 4.5:1 (normal) or 3:1 (>=24px heading / button label)
  threshold. The starter's uniform `#f5a623` must not appear on any
  normal-size text against `#ffffff` or any other passing-adjacent
  light background.
- **obj-3**: confirm a real `<button>` (or `<a role="button">`) exists
  with visible or `aria-label` text; a `<div>`/`<span>` with a click
  handler and no button semantics fails this even if visually
  identical.
- **obj-4**: confirm `Meridian` sits inside an `<h1>`-`<h6>` tag, and
  the three feature lines are `<li>` children of a `<ul>`/`<ol>`.
- **obj-5**: confirm the literal strings "Meridian" and "$29/mo"
  appear as text, exactly three feature lines exist, and the button has
  non-empty visible/aria-label text.
- **Visual design & readability**: does the corrected palette still
  read as a coherent, on-brand pricing card (not just AA-compliant but
  ugly gray-on-white with no hierarchy)? Reward a considered palette
  that keeps a design identity while meeting every threshold.
- **Semantic & accessible markup**: beyond the minimum structural
  checks, is the markup clean (single heading level used consistently,
  no redundant wrapper divs, sensible use of a `<section>`/`<article>`
  root, a real accessible name distinct from decorative text)?
- **Reasoning quality**: if the model explains its color choices (e.g.
  inline comments or prose), does it show genuine contrast reasoning
  (naming ratios or the AA thresholds) rather than just asserting the
  card "looks accessible now"?
