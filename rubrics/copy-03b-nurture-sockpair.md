---
test: copy-03b-nurture-sockpair
canary: "frigatebird clevis"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Subject, ## Preview, ## Body, ## CTA"
    - id: obj-2
      check: "Mentions shared laundry list and Android-only (or iOS waitlist) without inventing an iOS ship date"
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

Parallel form of `copy-03-nurture-email` (same construct, fresh surface).

If the phrase "frigatebird clevis" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Spam urgency fails.
