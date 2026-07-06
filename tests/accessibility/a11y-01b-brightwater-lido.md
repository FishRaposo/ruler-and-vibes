---
id: a11y-01b-brightwater-lido
category: accessibility
title: Text alternatives and labels for the Brightwater Lido membership form
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained membership signup page for a fictional
open-water swimming club, the "Brightwater Lido." It renders fine visually,
but it has real accessibility problems in how it presents images and form
controls to assistive technology. Audit it, then produce a corrected
version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Brightwater Lido — Membership Signup</title>
<style>
  body { font-family: sans-serif; background: #eef4f5; margin: 0; padding: 24px; }
  .card { max-width: 420px; margin: 0 auto; background: #ffffff; border: 1px solid #d5dcdd; padding: 24px; }
  .logo { display: block; margin: 0 auto 12px; }
  .chart { display: block; margin: 12px auto; width: 100%; }
  .divider { display: block; margin: 16px auto; width: 100%; height: 8px; }
  .field { margin-bottom: 14px; }
  .caption { display: block; font-size: 13px; color: #333; margin-bottom: 4px; }
  input[type="email"], input[type="text"] { width: 100%; padding: 8px; box-sizing: border-box; }
  .join-btn { display: block; margin: 12px auto 0; background: #1f6f7a; border: none; padding: 10px 16px; cursor: pointer; }
  .join-btn svg { display: block; }
</style>
</head>
<body>
  <div class="card">
    <img class="logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzAiIGhlaWdodD0iNjAiPjxyZWN0IHdpZHRoPSIxMzAiIGhlaWdodD0iNjAiIGZpbGw9IiMxZjZmN2EiLz48dGV4dCB4PSI2NSIgeT0iMzUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJyaWdodHdhdGVyPC90ZXh0Pjwvc3ZnPg==">

    <h1 style="text-align:center; font-size:20px;">Brightwater Lido Membership</h1>
    <p style="text-align:center; font-size:14px;">Join the club for season passes, safety briefings, and dawn swim alerts.</p>

    <img class="chart" alt="image" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iMTIwIj48cmVjdCB3aWR0aD0iMzYwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YyZjdmOCIvPjxyZWN0IHg9IjIwIiB5PSI4NiIgd2lkdGg9IjMwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjMWY2ZjdhIi8+PHJlY3QgeD0iODAiIHk9IjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIGZpbGw9IiMxZjZmN2EiLz48cmVjdCB4PSIxNDAiIHk9IjUyIiB3aWR0aD0iMzAiIGhlaWdodD0iNTgiIGZpbGw9IiMxZjZmN2EiLz48cmVjdCB4PSIyMDAiIHk9IjM0IiB3aWR0aD0iMzAiIGhlaWdodD0iNzYiIGZpbGw9IiMxZjZmN2EiLz48cmVjdCB4PSIyNjAiIHk9IjE4IiB3aWR0aD0iMzAiIGhlaWdodD0iOTIiIGZpbGw9IiMxZjZmN2EiLz48L3N2Zz4=">

    <img class="divider" alt="blue wavy ripple divider line" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iOCI+PHJlY3Qgd2lkdGg9IjM2MCIgaGVpZ2h0PSI4IiBmaWxsPSIjYmZlMGU2Ii8+PC9zdmc+">

    <form>
      <div class="field">
        <span class="caption">Email address</span>
        <input type="email" id="email-input" name="email" placeholder="you@example.com">
      </div>
      <div class="field">
        <label for="member-name-field">Your name</label>
        <input type="text" id="name-input" name="name" placeholder="Full name">
      </div>
      <button class="join-btn" type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <path d="M2 10 L18 10 M12 4 L18 10 L12 16" stroke="#ffffff" stroke-width="2" fill="none"/>
        </svg>
      </button>
    </form>
  </div>
</body>
</html>
```

Save the block above as the starting point and treat it as a real page: it
opens fine from `file://` and looks like a normal signup form, but several
of its images and form controls do not expose the right information to
screen readers and other assistive technology.

## Deliverables

- `AUDIT.md` — a numbered list of every accessibility defect you find in
  the layer of images, alt text, and form-control labeling. For each
  defect, state: what it is, which element it affects (describe it
  clearly enough to locate, e.g. by class name or position), which WCAG
  success criterion it violates, and the practical risk to a screen
  reader user.
- `fixed.html` — the same page with every defect from your audit
  repaired, and with no other visual or content changes. It must remain a
  single self-contained file that opens from `file://`.

## Constraints

- `fixed.html` must be one file with no external resources: no CDN
  links, no remote stylesheets or fonts, no `<img src>` pointing at a
  URL. Inline CSS and inline SVG (or `data:` URIs) only.
- Do not add, remove, or reorder any visible content — the logo, the
  two lines of copy, the chart image, the divider, both form fields, and
  the submit control must all still be present and look the same.
- Distinguish carefully between images that convey information and
  images that are purely decorative — they do not get the same kind of
  fix, and treating them identically is itself an accessibility error.
- Every form input needs a real, programmatically-associated name (not
  just something that looks like a label next to it).
