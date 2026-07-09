---
test: creative-02-css-scene
canary: "astrolabe quadrant"
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
anchors:
  - id: Scene readability & charm
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: CSS technique
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "astrolabe quadrant" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Open in a browser and watch for at least 15 seconds.
- Scene readability & charm: is it unmistakably a lighthouse on a cliff
  at dusk? Depth layering matters — background quieter than foreground
  beats a flat sticker collage.
- CSS technique: economical shapes, gradients earning their keep,
  animation that eases rather than snaps.
- Reasoning quality: did REASONING.md pick what NOT to draw?
