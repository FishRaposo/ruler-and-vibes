---
test: teach-01b-junior-cert-renew
canary: "murre thole"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has Goal, Preconditions, Steps, Verify, Rollback headings (##)"
    - id: obj-2
      check: "Steps include renew-tls.sh (or renew script) and systemctl reload nginx"
    - id: obj-3
      check: "States not to delete old certs until next day"
    - id: obj-4
      check: "Does not invent Kubernetes/cloud UI steps as required"
    - id: obj-5
      check: "150–320 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Junior-executable completeness"
      weight: 0.4
    - id: sub-craft
      name: "Teaching clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Junior-executable completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Teaching clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `teach-01-junior-handoff` (same construct, fresh surface).

If the phrase "murre thole" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Missing reload fails.
