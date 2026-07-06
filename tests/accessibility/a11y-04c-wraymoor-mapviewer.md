---
id: a11y-04c-wraymoor-mapviewer
category: accessibility
title: ARIA misuse and keyboard support in the Wraymoor Atlas map toolbar
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained toolbar for a fictional product, the
"Wraymoor Atlas map viewer." It has a small inline script wiring up its
controls, and it works fine with a mouse — but its ARIA usage and
keyboard support have real problems. Audit it, then produce a corrected
version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Wraymoor Atlas — Map Toolbar</title>
<style>
  body { font-family: sans-serif; background: #eef2ec; margin: 0; padding: 20px; }
  .map-tools { background: #ffffff; border: 1px solid #cdd6c8; padding: 10px; display: flex; align-items: center; gap: 12px; }
  .bookmark-div { padding: 8px 14px; background: #d8e6cf; border-radius: 4px; cursor: pointer; }
  .measure-btn { padding: 8px 14px; }
  .labels-toggle { padding: 8px 14px; background: #cfe0ef; border-radius: 4px; cursor: pointer; }
  .scale-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #2f7d5b; margin-left: 8px; }
</style>
</head>
<body>
  <div class="map-tools" aria-labelledby="tools-heading">
    <div class="bookmark-div" onclick="saveBookmark()">Bookmark</div>
    <button class="measure-btn" role="link" aria-checked="false" onclick="toggleMeasure()">Measure</button>
    <span class="labels-toggle" aria-pressed="false" onclick="toggleLabels(this)">Labels</span>
    <span class="scale-dot" aria-scale-state="locked" title=""></span>
  </div>

  <script>
    function saveBookmark() {
      console.log('bookmark saved');
    }
    function toggleMeasure() {
      console.log('measure toggled');
    }
    function toggleLabels(el) {
      const pressed = el.getAttribute('aria-pressed') === 'true';
      el.setAttribute('aria-pressed', String(!pressed));
    }
  </script>
</body>
</html>
```

Treat the block above as a real page: it opens fine from `file://` and
every control responds to a mouse click, but reading the markup and
inline script closely reveals ARIA and keyboard-support problems that a
mouse test alone won't surface.

## Deliverables

- `AUDIT.md` — a numbered list of every ARIA/interactive-widget defect
  you find. For each: the misuse, the element it affects, and the
  relevant WCAG/ARIA rule (e.g. 4.1.2 Name, Role, Value; 2.1.1
  Keyboard), and the practical risk.
- `fixed.html` — the same toolbar with every defect repaired. Preserve
  the visible controls and the inline script's click behavior; add or
  fix what's needed for correct semantics and keyboard operability.

## Constraints

- `fixed.html` must remain a single self-contained file with the inline
  `<script>` intact, opening from `file://` with no external resources.
- Where a native HTML element already provides the right semantics and
  behavior, prefer it over layering ARIA attributes onto a generic
  element — invalid or redundant ARIA should be removed, not added to.
- Every interactive control must have both a correct accessible name and
  a working keyboard path (not mouse-only).
- Any `aria-labelledby`/`aria-describedby` reference must point at an id
  that actually exists in the document.
- Do not invent or leave in place any `aria-*` attribute that isn't part
  of the real ARIA specification.
