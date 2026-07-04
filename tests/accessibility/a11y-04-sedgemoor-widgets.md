---
id: a11y-04-sedgemoor-widgets
category: accessibility
title: ARIA misuse and keyboard support in the Sedgemoor toolbar widgets
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained toolbar for a fictional product, the
"Sedgemoor task board." It has a small inline script wiring up its
controls, and it works fine with a mouse — but its ARIA usage and
keyboard support have real problems. Audit it, then produce a corrected
version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sedgemoor Task Board — Toolbar</title>
<style>
  body { font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
  .toolbar { background: #ffffff; border: 1px solid #ddd; padding: 10px; display: flex; align-items: center; gap: 12px; }
  .archive-div { padding: 8px 14px; background: #e0e0e0; border-radius: 4px; cursor: pointer; }
  .filter-btn { padding: 8px 14px; }
  .pin-toggle { padding: 8px 14px; background: #dbe9ff; border-radius: 4px; cursor: pointer; }
  .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #2f9e44; margin-left: 8px; }
</style>
</head>
<body>
  <div class="toolbar" aria-labelledby="toolbar-title">
    <div class="archive-div" onclick="archiveSelected()">Archive</div>
    <button class="filter-btn" role="link" aria-checked="false" onclick="toggleFilter()">Filter</button>
    <span class="pin-toggle" aria-pressed="false" onclick="togglePin(this)">Pin</span>
    <span class="status-dot" aria-status="active" title=""></span>
  </div>

  <script>
    function archiveSelected() {
      console.log('archived');
    }
    function toggleFilter() {
      console.log('filter toggled');
    }
    function togglePin(el) {
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
