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

### obj-3 — exactly one extended analogy

The analogy must be developed (multiple sentences building out the
comparison), not a single throwaway clause, and there must be exactly
one — not zero, not two competing ones.

**PASSING** (one analogy, developed across several sentences):

1. A restaurant-order-ticket analogy: the kitchen accepts your order
   the instant you place it, but the printed ticket on the wall board
   only gets updated a moment later — nobody loses the order, it just
   takes a beat for every copy to show the same thing.
2. A group-text analogy: you send the news to a group chat and each
   friend's phone buzzes at a slightly different moment depending on
   their signal, but everyone ends up seeing the same message.
3. A newsletter-mailing analogy: the newsletter is finalized the moment
   it's sent, but it lands in different inboxes a few seconds apart
   depending on each mail server, even though every copy is identical.

**FAILING**:

1. No analogy at all — the piece stays in literal, technical terms
   throughout ("the system uses eventually consistent replication
   across nodes with convergence guarantees").
2. Two unrelated analogies — opens with the group-text comparison, then
   switches midway to a relay-race handoff comparison. Even if both are
   well drawn, "exactly one" is violated.
3. A single passing mention that is never developed ("it's a bit like
   texting someone") with no elaboration — too brief to count as
   "extended."

### obj-4 — explicitly answers the safety question

The explainer must directly state whether the owner's data is safe
during the lag, not merely gesture at the system resolving itself.

**PASSING** (an explicit, on-point answer):

1. "Yes — your sales data is completely safe; the dashboard is just
   slow to catch up, nothing about the sale itself is at risk."
2. "To be clear: none of your data is in danger here. This delay is
   only about how quickly the number on your screen updates, not
   whether the sale was recorded."
3. "So the short answer is yes, you're covered: every sale is recorded
   the moment it happens, and the dashboard simply takes a few seconds
   to show it."

**FAILING** (never lands on an explicit answer):

1. Explains eventual consistency thoroughly and accurately, but never
   circles back to say whether the data is safe — leaves the reader to
   infer it.
2. Generic reassurance that doesn't address the actual worry: "Don't
   worry, everything will be fine — these things always work out!"
   (never mentions the data or sales specifically).
3. Evasive hedging: "It really depends on how your system is set up" —
   never commits to an answer for this owner's situation.

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
