---
test: copy-03c-nurture-binnote
canary: "petrel turnbuckle"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Subject, ## Preview, ## Body, ## CTA"
    - id: obj-2
      check: "Mentions shared shopping list and web-only (or mobile waitlist) without inventing a mobile ship date"
    - id: obj-3
      check: "Banned phrases absent: open immediately, limited time, %%%, risk-free, dear friend"
    - id: obj-4
      check: "Subject line ≤ 60 characters"
    - id: obj-5
      check: "100–220 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Nurture usefulness"
      weight: 0.4
    - id: sub-craft
      name: "Email craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Nurture usefulness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Email craft
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `copy-03-nurture-email` (same construct, fresh surface).

If the phrase "petrel turnbuckle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Parallel nurture email.
