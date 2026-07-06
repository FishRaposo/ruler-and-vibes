---
id: a11y-01c-larkhill-stargazing
category: accessibility
title: Text alternatives and labels for the Larkhill stargazing RSVP page
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained event RSVP page for a fictional group,
the "Larkhill Observatory Society." It renders fine visually, but it has
real accessibility problems in how it presents images and form controls to
assistive technology. Audit it, then produce a corrected version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Larkhill Observatory Society — Stargazing Evening RSVP</title>
<style>
  body { font-family: sans-serif; background: #eef1f7; margin: 0; padding: 24px; }
  .card { max-width: 420px; margin: 0 auto; background: #ffffff; border: 1px solid #d5d9e4; padding: 24px; }
  .logo { display: block; margin: 0 auto 12px; }
  .skymap { display: block; margin: 12px auto; width: 100%; }
  .divider { display: block; margin: 16px auto; width: 100%; height: 10px; }
  .field { margin-bottom: 14px; }
  .caption { display: block; font-size: 13px; color: #333; margin-bottom: 4px; }
  input[type="email"], input[type="text"] { width: 100%; padding: 8px; box-sizing: border-box; }
  .rsvp-btn { display: block; margin: 12px auto 0; background: #1b2a4a; border: none; padding: 10px 16px; cursor: pointer; }
  .rsvp-btn svg { display: block; }
</style>
</head>
<body>
  <div class="card">
    <img class="logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzAiIGhlaWdodD0iNjAiPjxyZWN0IHdpZHRoPSIxMzAiIGhlaWdodD0iNjAiIGZpbGw9IiMxYjJhNGEiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNiIgZmlsbD0iI2U4YzQ2OSIvPjx0ZXh0IHg9Ijc4IiB5PSIzNSIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGFya2hpbGw8L3RleHQ+PC9zdmc+">

    <h1 style="text-align:center; font-size:20px;">Larkhill Observatory Society Stargazing Evening</h1>
    <p style="text-align:center; font-size:14px;">Reserve a spot for our next dark-sky viewing night and telescope walkthrough.</p>

    <img class="skymap" alt="photo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iMTQwIj48cmVjdCB3aWR0aD0iMzYwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iIzBiMTIyNiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMzAiIHI9IjMiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxMTAiIGN5PSI1NSIgcj0iNCIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjM1IiByPSIzIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMjUwIiBjeT0iNzAiIHI9IjUiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIzMTAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNCIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjIyMCIgY3k9IjExNSIgcj0iMyIgZmlsbD0iI2ZmZiIvPjxsaW5lIHgxPSI0MCIgeTE9IjMwIiB4Mj0iMTEwIiB5Mj0iNTUiIHN0cm9rZT0iIzZiN2ZiNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjExMCIgeTE9IjU1IiB4Mj0iMTgwIiB5Mj0iMzUiIHN0cm9rZT0iIzZiN2ZiNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjE4MCIgeTE9IjM1IiB4Mj0iMjUwIiB5Mj0iNzAiIHN0cm9rZT0iIzZiN2ZiNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjI1MCIgeTE9IjcwIiB4Mj0iMzEwIiB5Mj0iNDAiIHN0cm9rZT0iIzZiN2ZiNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjExMCIgeTE9IjU1IiB4Mj0iMTUwIiB5Mj0iMTAwIiBzdHJva2U9IiM2YjdmYjUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==">

    <img class="divider" alt="row of little decorative stars" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iMTAiPjxyZWN0IHdpZHRoPSIzNjAiIGhlaWdodD0iMTAiIGZpbGw9IiNlOWVkZjYiLz48Y2lyY2xlIGN4PSI5MCIgY3k9IjUiIHI9IjIiIGZpbGw9IiM5YWE3YzQiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSI1IiByPSIyIiBmaWxsPSIjOWFhN2M0Ii8+PGNpcmNsZSBjeD0iMjcwIiBjeT0iNSIgcj0iMiIgZmlsbD0iIzlhYTdjNCIvPjwvc3ZnPg==">

    <form>
      <div class="field">
        <span class="caption">Email address</span>
        <input type="email" id="email-input" name="email" placeholder="you@example.com">
      </div>
      <div class="field">
        <label for="attendee-name-field">Your name</label>
        <input type="text" id="name-input" name="name" placeholder="Full name">
      </div>
      <button class="rsvp-btn" type="submit">
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
opens fine from `file://` and looks like a normal RSVP form, but several of
its images and form controls do not expose the right information to screen
readers and other assistive technology.

## Deliverables

- `AUDIT.md` — a numbered list of every accessibility defect you find in
  the layer of images, alt text, and form-control labeling. For each
  defect, state: what it is, which element it affects (describe it clearly
  enough to locate, e.g. by class name or position), which WCAG success
  criterion it violates, and the practical risk to a screen reader user.
- `fixed.html` — the same page with every defect from your audit repaired,
  and with no other visual or content changes. It must remain a single
  self-contained file that opens from `file://`.

## Constraints

- `fixed.html` must be one file with no external resources: no CDN links,
  no remote stylesheets or fonts, no `<img src>` pointing at a URL. Inline
  CSS and inline SVG (or `data:` URIs) only.
- Do not add, remove, or reorder any visible content — the logo, the two
  paragraphs of copy, the star-map image, the divider, both form fields,
  and the RSVP control must all still be present and look the same.
- Distinguish carefully between images that convey information and images
  that are purely decorative — they do not get the same kind of fix, and
  treating them identically is itself an accessibility error.
- Every form input needs a real, programmatically-associated name (not just
  something that looks like a label next to it).
