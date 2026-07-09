---
test: copy-02c-ad-set-tidekit
canary: "booby hitch"
weights:
  objective: 0.6
  subjective: 0.4
criteria:
  objective:
    - id: obj-1
      check: "ads.json parses as JSON with string fields headline, primary, description"
    - id: obj-2
      check: "headline length ≤ 30; primary ≤ 90; description ≤ 90 (JS string length)"
    - id: obj-3
      check: "Combined text mentions offline tide tables (or offline tides) and 2 saved spots"
    - id: obj-4
      check: "None of: click here, !!!, guaranteed, #1, act now (case-insensitive)"
    - id: obj-5
      check: "Does not claim an AI coach feature"
  subjective:
    - id: sub-quality
      name: "Ad effectiveness within caps"
      weight: 0.4
    - id: sub-craft
      name: "Clarity without spam tone"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Ad effectiveness within caps
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Clarity without spam tone
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `copy-02-ad-set-three-lengths` (same construct, fresh surface).

If the phrase "booby hitch" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Parallel ad caps.
