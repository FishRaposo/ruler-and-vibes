---
test: writing-02-registers
canary: "brindle dappled"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three sections present: ## Formal, ## Friendly, ## Summary"
    - id: obj-2
      check: "All four facts present in every version"
    - id: obj-3
      check: "Summary is one sentence of <= 25 words (count them)"
    - id: obj-4
      check: "No invented facts in any version"
  subjective:
    - id: sub-quality
      name: "Register fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "brindle dappled" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Register fidelity: each version unmistakable for its audience — the
  pivot between tones must feel deliberate, not a synonym swap. Formal is
  not stiff; friendly is not unserious.
- Concision: every version should be materially tighter than the
  original paragraph, measured by word count against it. A formal
  register may spend a few words on convention and still come in under.
- On obj-4: conventional register scaffolding ("we will keep you
  updated") is not an invented fact; new specifics — names, causes,
  dates, numbers — are.
- Reasoning quality: did REASONING.md discuss tone choices per audience
  and what was deliberately dropped?
