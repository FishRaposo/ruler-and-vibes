---
test: writing-01c-batch-settlement
canary: "niche cranny"
reviewed: "pass 2026-07-04 (independent gate)"
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
      check: "Explicitly answers whether the money is safe"
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

Parallel form of `writing-01-explainer` (same construct, fresh surface).

If the phrase "niche cranny" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest of the
submission scores.

- Technical accuracy: batch settlement correctly characterized —
  authorization happens immediately and commits the sale, the total
  shown in the app only lags until the overnight batch settlement runs
  and folds it in, and settlement timing is a separate bookkeeping
  property from whether the sale itself is secured — without
  overclaiming ("it's 100% impossible for anything to ever go wrong")
  or fear-mongering ("your money might vanish until it settles").
- Warmth and flow: the tone of a neighbor explaining over the counter,
  not a lecture. Penalize condescension and walls of hedging.
- Reasoning quality: did REASONING.md weigh audience, analogy choice,
  and what to leave out?

### obj-1 — count the words

Judge counts every word in `explainer.md`, title included. Pass requires
250–400 words inclusive. A reference explainer threading the analogy,
the mechanism, and the direct safety answer lands comfortably around
330–340 words, so the band is reachable without padding — but only if
the writer doesn't also try to over-explain the settlement pipeline
end to end.

### obj-2 — structure check

Exactly one `#` heading (the title), no `##`/`###` headings anywhere,
and no bullet or numbered list markers. A model that organizes the
explainer into a "What this means" / "Is my money safe" two-part
structure with sub-headings fails this even if the content is accurate.

### Example phrasings — obj-3, is there exactly one extended analogy?

An *extended* analogy is a single comparison that gets developed with
specific, corresponding detail — not a one-clause aside, and not more
than one comparison run through the piece.

**PASSING** (one comparison, elaborated, appears once):

1. "It's like a farmers'-market stall where you hand over a receipt the
   instant someone pays, but the cash box itself isn't counted and
   locked into the day's ledger until the market closes for the
   night." (single comparison, carried through with matching detail)
2. "Think of it the way a post office handles a package: it's stamped
   'accepted' the moment you hand it over, even though tracking won't
   show 'delivered' until a courier scans it in at the depot that
   evening." (one elaborated comparison)
3. "Picture a relay race: the instant the baton changes hands, that leg
   of the race is final, even though the official split time isn't
   posted to the scoreboard until the timing booth cross-checks it
   after the race." (single developed analogy)

**FAILING** (zero analogies, a bare aside, or two separate ones):

1. "Transactions authorize immediately and post to your total once they
   settle in a batch." (no analogy at all, purely literal)
2. "It's a bit like a relay-race handoff. It's also a bit like a library
   book that's dropped in the return box but not marked returned until
   a librarian scans it back onto the shelf." (two separate extended
   analogies, not one)
3. "It's kind of like waiting in line, I guess." (a throwaway one-clause
   comparison, never developed — reads as filler, not an analogy that
   does explanatory work)

### Example phrasings — obj-4, does it explicitly answer whether the money is safe?

**PASSING** (a direct, correctly-scoped yes tied to the mechanism):

1. "So is your money safe? Yes — once a card is approved, the sale is
   already committed, and the delay you're seeing is bookkeeping, not
   risk."
2. "Your sales are not at risk during this window: approval is what
   makes a sale final; settlement only changes when the number on your
   screen updates."
3. "To be direct: nothing is lost. The lag is the batch catching up to
   what's already been approved, not a sign of money going missing."

**FAILING** (reassuring tone that never actually answers the question,
or answers something else):

1. "Systems like this are extremely reliable, so there's really nothing
   to worry about at all." (vague reassurance, never says whether the
   money itself is safe or why)
2. "These things tend to sort themselves out one way or another."
   (hedged, non-committal, dodges the question)
3. "It's a totally normal part of how modern payment apps work."
   (describes the mechanism, never answers the safety question asked)
