---
test: creative-02-css-scene
canary: "dusk parallax discipline"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "No JavaScript anywhere in the file"
    - id: obj-2
      check: "No images or external resources (img tags, url(...), data URIs)"
    - id: obj-3
      check: "At least one continuous CSS animation runs"
    - id: obj-4
      check: "Single file; renders from file://"
  subjective:
    - id: sub-quality
      name: "Scene readability & charm"
      weight: 0.4
    - id: sub-craft
      name: "CSS technique"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Open in a browser and watch for at least 15 seconds.
- Scene readability & charm: is it unmistakably a lighthouse on a cliff
  at dusk? Depth layering matters — dusk parallax discipline (background
  quieter than foreground) beats a flat sticker collage.
- CSS technique: economical shapes, gradients earning their keep,
  animation that eases rather than snaps.
- Reasoning quality: did REASONING.md pick what NOT to draw?
