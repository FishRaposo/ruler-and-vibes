---
id: a11y-02b-marloe-belfry
category: accessibility
title: Heading order and landmark structure in the Marloe Belfry Guild report
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained page for a fictional bell-ringing
society's season report, the "Marloe Belfry Guild." It looks like a
normal, well-formed report when rendered — but its underlying markup does
not expose that structure to assistive technology. Audit the structure,
then produce a corrected version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Marloe Belfry Guild — Ringing Season Report</title>
<style>
  body { font-family: "Palatino Linotype", Palatino, serif; margin: 0; background: #f7f6f2; color: #1e1e1e; }
  .brandbar { background: #dfe2d9; padding: 10px 24px; font-size: 13px; color: #4a4a4a; }
  .menu { background: #34302a; padding: 12px 24px; }
  .menu a { color: #f2ede2; text-decoration: none; margin-right: 18px; font-size: 14px; }
  .wrap { max-width: 660px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 31px; margin-bottom: 4px; }
  h3 { font-size: 21px; color: #34302a; margin-top: 28px; }
  .pseudo-heading { font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 6px; }
  .tally-line { display: block; margin-left: 18px; }
  .tally-line::before { content: "\2013 "; }
  .footbar { background: #dfe2d9; padding: 10px 24px; font-size: 12px; color: #6a6a6a; margin-top: 24px; }
</style>
</head>
<body>
  <div class="brandbar">Marloe Belfry Guild</div>
  <div class="menu">
    <a href="#season">Season</a>
    <a href="#peals">Peals</a>
    <a href="#training">Training</a>
    <a href="#ahead">Ahead</a>
  </div>

  <div class="wrap">
    <h1>Marloe Belfry Guild Ringing Season Report</h1>

    <h3 id="season">The Ringing Season</h3>
    <p>The Guild rang at seven towers this season, welcoming two new bands and
    marking the recasting of the tenor bell at St Aldhelm's after forty years
    silent.</p>

    <div class="pseudo-heading">Peal Attempts</div>
    <p>Bands attempted nineteen quarter-peals and four full peals, ringing
    methods from Plain Bob through to Cambridge Surprise Major.</p>

    <span class="tally-line">Quarter-peals scored: 15</span><br>
    <span class="tally-line">Full peals scored: 3</span><br>
    <span class="tally-line">New ringers taught to handle: 22</span><br>

    <h3 id="ahead">Looking Ahead</h3>
    <p>Next season the Guild will host the district striking competition and
    open the restored ground-floor ring at Marloe Minster to visiting bands.</p>
  </div>

  <div class="footbar">&copy; Marloe Belfry Guild. Rung true since 1887.</div>
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
