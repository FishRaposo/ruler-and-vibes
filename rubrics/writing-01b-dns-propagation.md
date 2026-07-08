---
test: writing-01b-dns-propagation
canary: "mustardseed alcove"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Word count between 260 and 380 (count it)"
    - id: obj-2
      check: "Single # title; no other headings; no bullet lists"
    - id: obj-3
      check: "Exactly one extended analogy"
    - id: obj-4
      check: "Explicitly answers whether the store and orders are safe"
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

If the phrase "mustardseed alcove" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Technical accuracy: DNS propagation correctly characterized (cached
  copies of the domain's address, held by resolvers and networks around
  the world, expire and refresh on their own independent schedules; the
  visible symptom is that different visitors may briefly resolve to
  different servers; the store's actual data — listings, accounts,
  order history — lives on the host and is unaffected by this
  address-lookup delay) without overclaiming (e.g. "it's instant" or
  "there's nothing to ever worry about") or fear-mongering (e.g.
  implying orders could vanish or get duplicated).
- Warmth and flow: the tone of a neighbor explaining over the fence, not
  a lecture. Penalize condescension and walls of hedging.
- Reasoning quality: did REASONING.md weigh audience, analogy choice,
  and what to leave out?

### obj-1 — count the words

Word count is the body prose, 260–380 words inclusive; the single `#`
title line is not counted. A reference solution lands around 300 words
— comfortably clear of both ends, so the cap is reachable without
padding or over-trimming.

### obj-3 — exactly one extended analogy

The analogy must be developed (multiple sentences building out the
comparison), not a single throwaway clause, and there must be exactly
one — not zero, not two competing ones.

**PASSING** (one analogy, developed across several sentences):

1. A forwarded-mail/change-of-address analogy: the post office updates
   its own records immediately, but each of your correspondents still
   has your old address in their own address book and updates it on
   their own schedule — nobody's letter is lost, it just arrives a
   little later for some senders than others.
2. A phone-tree analogy: news of a schedule change spreads person to
   person, and different branches of the tree hear about it at
   different times, but everyone gets the update eventually.
3. A reprinted-directory analogy: a company reprints its address book
   and mails copies out, but readers keep using their old copy until
   the new one lands on their desk, so for a while different people are
   working from different editions.

**FAILING**:

1. No analogy at all — the piece stays in literal, technical terms
   throughout ("DNS records are updated at authoritative nameservers and
   resolvers cache them per their TTL").
2. Two unrelated analogies — opens with the change-of-address comparison,
   then switches midway to a relay-race handoff comparison. Even if both
   are well drawn, "exactly one" is violated.
3. A single passing mention that is never developed ("it's a bit like
   updating an address book") with no elaboration — too brief to count
   as "extended."

### obj-4 — explicitly answers the safety question

The explainer must directly state whether the store and its orders are
safe during the propagation window, not merely gesture at the process
resolving itself.

**PASSING** (an explicit, on-point answer):

1. "Yes — your store and every order placed during this window are
   completely safe; DNS only decides which door a visitor's browser
   knocks on, not what's stored behind it."
2. "To be clear: none of your data or orders are at risk here. This
   delay is only about which address people are momentarily pointed to
   — your shop's records live somewhere else entirely."
3. "So the short answer is yes, you're covered: nothing about this
   process touches your order history or your product listings."

**FAILING** (never lands on an explicit answer):

1. Explains DNS propagation thoroughly and accurately, but never
   circles back to say whether the store or its orders are safe —
   leaves the reader to infer it.
2. Generic reassurance that doesn't address the actual worry: "Don't
   worry, everything will be fine — these things always work out!"
   (never mentions the store or orders specifically).
3. Evasive hedging: "It really depends on how your host set things up"
   — never commits to an answer for this owner's situation.
