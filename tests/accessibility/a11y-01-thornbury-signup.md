---
id: a11y-01-thornbury-signup
category: accessibility
title: Text alternatives and labels for the Thornbury signup form
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained newsletter signup page for a fictional
group, the "Thornbury Community Garden." It renders fine visually, but it
has real accessibility problems in how it presents images and form
controls to assistive technology. Audit it, then produce a corrected
version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Thornbury Community Garden — Newsletter Signup</title>
<style>
  body { font-family: sans-serif; background: #f6f4ee; margin: 0; padding: 24px; }
  .card { max-width: 420px; margin: 0 auto; background: #ffffff; border: 1px solid #ddd; padding: 24px; }
  .logo { display: block; margin: 0 auto 12px; }
  .chart { display: block; margin: 12px auto; width: 100%; }
  .divider { display: block; margin: 16px auto; width: 100%; height: 8px; }
  .field { margin-bottom: 14px; }
  .caption { display: block; font-size: 13px; color: #333; margin-bottom: 4px; }
  input[type="email"], input[type="text"] { width: 100%; padding: 8px; box-sizing: border-box; }
  .submit-btn { display: block; margin: 12px auto 0; background: #2f6b3a; border: none; padding: 10px 16px; cursor: pointer; }
  .submit-btn svg { display: block; }
</style>
</head>
<body>
  <div class="card">
    <img class="logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIGZpbGw9IiMyZjZiM2EiLz48dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRob3JuYnVyeTwvdGV4dD48L3N2Zz4=">

    <h1 style="text-align:center; font-size:20px;">Thornbury Community Garden Newsletter</h1>
    <p style="text-align:center; font-size:14px;">Join our monthly newsletter for planting tips and volunteer news.</p>

    <img class="chart" alt="image" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iMTIwIj48cmVjdCB3aWR0aD0iMzYwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZhZmFmYSIvPjxyZWN0IHg9IjIwIiB5PSI4MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMmY2YjNhIi8+PHJlY3QgeD0iODAiIHk9IjYwIiB3aWR0aD0iMzAiIGhlaWdodD0iNTAiIGZpbGw9IiMyZjZiM2EiLz48cmVjdCB4PSIxNDAiIHk9IjQwIiB3aWR0aD0iMzAiIGhlaWdodD0iNzAiIGZpbGw9IiMyZjZiM2EiLz48cmVjdCB4PSIyMDAiIHk9IjIwIiB3aWR0aD0iMzAiIGhlaWdodD0iOTAiIGZpbGw9IiMyZjZiM2EiLz48cmVjdCB4PSIyNjAiIHk9IjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMmY2YjNhIi8+PC9zdmc+">

    <img class="divider" alt="green leafy divider line" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iOCI+PHJlY3Qgd2lkdGg9IjM2MCIgaGVpZ2h0PSI4IiBmaWxsPSIjYzhkOWM4Ii8+PC9zdmc+">

    <form>
      <div class="field">
        <span class="caption">Email address</span>
        <input type="email" id="email-input" name="email" placeholder="you@example.com">
      </div>
      <div class="field">
        <label for="full-name-field">Your name</label>
        <input type="text" id="name-input" name="name" placeholder="Full name">
      </div>
      <button class="submit-btn" type="submit">
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
  two paragraphs of copy, the chart image, the divider, both form
  fields, and the submit control must all still be present and look the
  same.
- Distinguish carefully between images that convey information and
  images that are purely decorative — they do not get the same kind of
  fix, and treating them identically is itself an accessibility error.
- Every form input needs a real, programmatically-associated name (not
  just something that looks like a label next to it).
