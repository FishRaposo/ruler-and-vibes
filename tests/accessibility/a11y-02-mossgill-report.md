---
id: a11y-02-mossgill-report
category: accessibility
title: Heading order and landmark structure in the Mossgill annual report
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained page for a fictional organization's
annual report, the "Mossgill Trust." It looks like a normal, well-formed
report when rendered — but its underlying markup does not expose that
structure to assistive technology. Audit the structure, then produce a
corrected version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Mossgill Trust — Annual Report</title>
<style>
  body { font-family: Georgia, serif; margin: 0; background: #fbfaf7; color: #222; }
  .topnav { background: #2c3e2f; padding: 12px 24px; }
  .topnav a { color: #fff; text-decoration: none; margin-right: 18px; font-size: 14px; }
  .chrome-top { background: #eee; padding: 10px 24px; font-size: 13px; color: #555; }
  .content { max-width: 640px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 30px; margin-bottom: 4px; }
  h3 { font-size: 20px; color: #2c3e2f; margin-top: 28px; }
  .fake-heading { font-size: 17px; font-weight: bold; margin-top: 20px; margin-bottom: 6px; }
  .bullet-line { display: block; margin-left: 18px; }
  .bullet-line::before { content: "• "; }
  .chrome-bottom { background: #eee; padding: 10px 24px; font-size: 12px; color: #777; margin-top: 24px; }
</style>
</head>
<body>
  <div class="chrome-top">Mossgill Trust</div>
  <div class="topnav">
    <a href="#overview">Overview</a>
    <a href="#finances">Finances</a>
    <a href="#outlook">Outlook</a>
  </div>

  <div class="content">
    <h1>Mossgill Trust Annual Report</h1>

    <h3 id="overview">Overview of the Year</h3>
    <p>Mossgill Trust supported twelve community projects this year, expanding
    our reach into two new parishes and renewing our commitment to local
    conservation work.</p>

    <div class="fake-heading">Volunteer Highlights</div>
    <p>Volunteers logged over 3,000 hours across trail maintenance, hedgerow
    planting, and the annual clean-up weekend.</p>

    <span class="bullet-line">Trail maintenance days: 14</span><br>
    <span class="bullet-line">New hedgerows planted: 340 meters</span><br>
    <span class="bullet-line">Clean-up volunteers: 96</span><br>

    <h3>Looking Ahead</h3>
    <p>Next year the Trust plans to launch a new orchard restoration
    programme and expand the volunteer training scheme.</p>
  </div>

  <div class="chrome-bottom">&copy; Mossgill Trust. All rights reserved.</div>
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
