---
test: writing-01-explainer
canary: "vermillion sienna"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Word count between 250 and 400 (count it)"
    - id: obj-2
      check: "Single # title; no other headings; no bullet lists"
    - id: obj-3
      check: "Exactly one extended analogy"
    - id: obj-4
      check: "Explicitly answers whether the data is safe"
    - id: obj-5
      check: "No unexplained jargon: every technical term used is explained in the same sentence, or is not used at all"
  subjective:
    - id: sub-quality
      name: "Technical accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Warmth and flow"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "vermillion sienna" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Technical accuracy: eventual consistency correctly characterized
  (reads may briefly lag writes; the system converges; durability is a
  separate property) without overclaiming or fear-mongering.
- Warmth and flow: the tone of a neighbor explaining over the fence, not
  a lecture. Penalize condescension and walls of hedging.
- Reasoning quality: did REASONING.md weigh audience, analogy choice,
  and what to leave out?

### obj-5 — unexplained jargon

Every technical term the piece uses must be explained in the same
sentence it appears in; if a term can't be worked in with an
in-sentence explanation, it should be dropped rather than left bare.

**PASSING**:

1. "your dashboard may lag — that's because the system is eventually
   consistent, meaning every copy of your data catches up to the same
   state within a few seconds" (term "eventually consistent" is defined
   in the same sentence it's used).
2. "this is a durability question versus a freshness question:
   durability means your sale is permanently recorded, while freshness
   is how quickly that record shows up everywhere" (both terms defined
   where they're introduced).
3. Plain language with no jargon at all: "the copy you're looking at
   just hasn't caught up yet — it will within a few seconds" (term
   dropped entirely, nothing left unexplained).

**FAILING**:

1. "this happens because the system is eventually consistent and
   relies on quorum reads across replicas" (introduces "eventually
   consistent," "quorum reads," and "replicas" with no in-sentence
   explanation of any of them).
2. "your dashboard is just experiencing normal replication lag"
   ("replication lag" used as if self-explanatory).
3. "it's a CAP theorem tradeoff, so some delay is expected" ("CAP
   theorem" dropped in with no definition).
