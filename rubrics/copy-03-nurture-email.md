---
test: copy-03-nurture-email
canary: "agate butterie"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Subject, ## Preview, ## Body, ## CTA"
    - id: obj-2
      check: "Mentions shared grocery list and iOS-only (or Android waitlist) without inventing an Android ship date"
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
---

## Judge guidance

If the phrase "agate butterie" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Spammy urgency fails.
- Invented Android GA date fails.
