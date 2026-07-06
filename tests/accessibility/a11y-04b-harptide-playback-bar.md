---
id: a11y-04b-harptide-playback-bar
category: accessibility
title: ARIA misuse and keyboard support in the Harptide playback bar
deliverables:
  - AUDIT.md
  - fixed.html
---

## Task

Below is a complete, self-contained playback bar for a fictional product,
the "Harptide Audio player." It has a small inline script wiring up its
controls, and it works fine with a mouse — but its ARIA usage and
keyboard support have real problems. Audit it, then produce a corrected
version.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Harptide Audio — Playback Bar</title>
<style>
  body { font-family: sans-serif; background: #f7f7f7; margin: 0; padding: 24px; }
  .playback-bar { background: #ffffff; border: 1px solid #dcdcdc; padding: 12px; display: flex; align-items: center; gap: 14px; }
  .rewind-div { padding: 9px 15px; background: #e6e6e6; border-radius: 5px; cursor: pointer; }
  .mute-btn { padding: 9px 15px; }
  .loop-toggle { padding: 9px 15px; background: #dcecff; border-radius: 5px; cursor: pointer; }
  .live-dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: #2f9e44; margin-left: 8px; }
</style>
</head>
<body>
  <div class="playback-bar" aria-labelledby="bar-heading">
    <div class="rewind-div" onclick="rewindTrack()">Rewind</div>
    <button class="mute-btn" role="link" aria-checked="false" onclick="toggleMute()">Mute</button>
    <span class="loop-toggle" aria-pressed="false" onclick="toggleLoop(this)">Loop</span>
    <span class="live-dot" aria-state="live" title=""></span>
  </div>

  <script>
    function rewindTrack() {
      console.log('rewound');
    }
    function toggleMute() {
      console.log('mute toggled');
    }
    function toggleLoop(el) {
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
- `fixed.html` — the same playback bar with every defect repaired.
  Preserve the visible controls and the inline script's click behavior;
  add or fix what's needed for correct semantics and keyboard
  operability.

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
