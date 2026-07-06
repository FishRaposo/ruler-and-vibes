---
id: a11y-02c-threndle-navigation
category: accessibility
title: Heading order and landmark structure in the Threndle Navigation season review
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained page for a fictional organization's
restoration season review, the "Threndle Navigation Trust." It looks like
a normal, well-formed report when rendered — but its underlying markup does
not expose that structure to assistive technology. Audit the structure,
then produce a corrected version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Threndle Navigation Trust — Restoration Season Review</title>
<style>
  body { font-family: Georgia, serif; margin: 0; background: #f6f8f6; color: #1f2320; }
  .brandbar { background: #eef0ee; padding: 10px 24px; font-size: 13px; color: #4a4f4a; }
  .mainnav { background: #23384a; padding: 12px 24px; }
  .mainnav a { color: #fff; text-decoration: none; margin-right: 18px; font-size: 14px; }
  .sheet { max-width: 660px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 30px; margin-bottom: 4px; }
  h3 { font-size: 20px; color: #23384a; margin-top: 28px; }
  .pseudo-heading { font-size: 17px; font-weight: bold; margin-top: 20px; margin-bottom: 6px; }
  .tally-line { display: block; margin-left: 18px; }
  .tally-line::before { content: "• "; }
  .footbar { background: #eef0ee; padding: 10px 24px; font-size: 12px; color: #6a6f6a; margin-top: 24px; }
</style>
</head>
<body>
  <div class="brandbar">Threndle Navigation Trust</div>
  <div class="mainnav">
    <a href="#works">Works</a>
    <a href="#funding">Funding</a>
    <a href="#next">Next Season</a>
  </div>

  <div class="sheet">
    <h1>Threndle Navigation Restoration Season Review</h1>

    <h3 id="works">Works Completed This Season</h3>
    <p>The Trust reopened one and a half miles of the lower cut this season,
    re-puddling two breached lengths and rehanging the gates at Baswick Lock
    with volunteer crews on eleven weekends.</p>

    <div class="pseudo-heading">Towpath Progress</div>
    <p>The towpath gangs regraded the northern bank and cleared silt from the
    feeder channel above the aqueduct, opening the walking route end to end
    for the first time in years.</p>

    <span class="tally-line">Working weekends held: 11</span><br>
    <span class="tally-line">Towpath resurfaced: 820 meters</span><br>
    <span class="tally-line">Volunteers on the register: 74</span><br>

    <h3>Next Season</h3>
    <p>Next year the Trust intends to dredge the Marrick pound and begin the
    survey work needed to restore the derelict lengthsman's cottage.</p>
  </div>

  <div class="footbar">&copy; Threndle Navigation Trust. All rights reserved.</div>
</body>
</html>
```

Treat the block above as a real page: it opens fine from `file://` and
reads like a normal report, but a screen reader user navigating by
headings, landmarks, or lists would find the structure underneath does
not match what's on screen.

## Deliverables

- `AUDIT.md` — a numbered list of every structural defect you find (in
  heading hierarchy, landmark regions, and list markup). For each: what
  it is, where it is, and which WCAG success criterion it violates.
- `fixed.html` — the same page with every structural defect repaired,
  preserving the exact same visual appearance (same fonts, sizes,
  colors, spacing) and all the same visible content and text. It must
  remain a single self-contained file that opens from `file://`.

## Constraints

- `fixed.html` must render visually equivalent to the original — same
  headings, nav links, and list items visible, same layout, nothing
  added or removed from the visible page.
- Fix structure by changing the actual underlying elements, not by
  changing how things look. A heading that visually looks right but is
  still the wrong element underneath is not fixed.
- The corrected heading hierarchy must be strictly gapless (no jumping
  from one level down more than one step at a time) in document order.
- The page must expose proper landmark regions and any bulleted content
  must be built from real list markup.
