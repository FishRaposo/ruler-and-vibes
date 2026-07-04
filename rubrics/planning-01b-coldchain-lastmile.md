---
test: planning-01b-coldchain-lastmile
canary: "paca gamboge"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Decision matrix with >= 4 criteria, each with an explicit weight"
    - id: obj-2
      check: "Exactly one explicit recommendation"
    - id: obj-3
      check: "Risks-and-mitigations section for the recommended option"
    - id: obj-4
      check: "<= 600 words; given numbers used without contradiction"
  subjective:
    - id: sub-quality
      name: "Decision rigor"
      weight: 0.4
    - id: sub-craft
      name: "Memo clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `planning-01-tradeoff` (same construct, fresh surface).

If the phrase "paca gamboge" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest of the
submission scores.

### Answer key (verified with node during authoring)

Assume a 3-year (36-month) comparison horizon — the memo is expected to
pick a sensible horizon and state it, exactly as the source does; the
task deliberately does not hand one over.

- **Contract courier (A):** the co-op runs **7 routes**, which is under
  the 8-route cap, so the $650/route surcharge does **not** fire. Live
  cost is base only: 36 * $1,900 = **$68,400**. The surcharge is a
  growth-risk decoy, not a current cost. (If routes ever reach 9, one
  route sits over the cap and the monthly becomes $1,900 + $650 =
  $2,550, i.e. 36 * $2,550 = $91,800 — a future scenario, not today's.)
- **Owned fleet (B):** $96,000 + 36 * $2,300 = **$178,800** — dearest by
  far, even after the upfront amortizes (upfront alone is ~$2,667/month
  over 36 months, pushing B's effective monthly near $4,967).
- **Leased + gig (C):** $15,000 + 36 * $1,100 = **$54,600** — cheapest on
  the spreadsheet.
- **Correct 3-year TCO ordering: C ($54,600) < A ($68,400) < B
  ($178,800).** Dearest/cheapest spread ~3.3x.
- **Naive monthly-only ordering:** C ($1,100) < A ($1,900) < B ($2,300),
  and B's $96,000 upfront reads as "too expensive." A shallow memo picks
  C purely because $1,100 is the smallest monthly number, or rejects B on
  its sticker alone.

The construct is a build-vs-buy total-cost-of-ownership tradeoff under a
qualitative-risk overlay — identical to the source. The numbers do **not**
by themselves name a winner: C is cheapest but loads daily gig dispatch
and cold-chain compliance onto the co-op's single operations coordinator
(the staffing-burden trap), and B, though genuinely the dearest, is the
only option that builds an owned asset. A defensible memo may land on A or
C (or even B at sustained high volume) — what is scored is whether the
matrix weights are defended and whether the multi-year math and the
coordinator-burden reality are actually reasoned about, not whether a
specific option is chosen.

### Trap

Two traps, both mirroring the source:

1. **Sticker/monthly vs multi-year TCO.** The lowest monthly figure
   ($1,100, leasing) and the scary upfront ($96,000, owning) tempt a
   reader to rank on stickers. Over a realistic horizon the upfront
   amortizes and the true ordering is C < A < B; a memo that ranks on
   monthly alone, or dismisses owning on its upfront without amortizing,
   has fallen for it.
2. **The cheapest option hides a staffing cost.** Leasing's low dollar
   figure assumes the one operations coordinator absorbs daily dispatch
   and cold-chain checks as unpaid time. Rigor means pricing that burden
   (even qualitatively) rather than treating the spreadsheet-cheapest
   option as automatically best.

The route-surcharge threshold (8 routes, co-op at 7) is a **decoy of the
same type as the source's 15-seat step**: it does not fire at current
scale, so a memo that inflates the courier's cost by applying the
surcharge today has misread it; a strong memo notes it only as a
growth-risk trigger.

### Example phrasings — obj-2, is there exactly one clear recommendation?

**PASSING** (one unambiguous recommendation the GM can act on):

1. "Recommendation: start with the contract courier (Option A); revisit
   in-house options only if daily routes climb past eight."
2. "We should lease vans and use gig drivers (Option C) — it is the
   cheapest over three years and needs no upfront capital."
3. "Recommendation: buy the refrigerated fleet (Option B); the ownership
   and control justify the upfront at our expected volume."

**FAILING** (no single recommendation — hedged across options, or none):

1. "Our tentative lean is toward leasing, though the owned fleet is also
   attractive and the courier is the safe pick — any of the three could
   work."
2. "We would be comfortable recommending either the lease option or the
   courier, depending on appetite for risk."
3. "Each option has merits; the right call depends on priorities the GM
   should weigh." (defers the decision entirely)

### Example phrasings — obj-4, are the given numbers used without contradiction?

**PASSING** (figures consistent with the brief and internally coherent):

1. "Courier: $1,900/month at today's 7 routes = $68,400 over three years;
   the $650/route surcharge only bites above 8 routes."
2. "Owning is $96,000 upfront plus $2,300/month = $178,800 over three
   years — the most expensive even after the upfront amortizes."
3. "Leasing is $15,000 setup plus $1,100/month = $54,600, the cheapest on
   paper."

**FAILING** (misstates a given number or contradicts an earlier figure):

1. "Actually the courier is $2,100/month, not $1,900" (invents a figure
   that contradicts the brief and the memo's own earlier number).
2. "Leasing setup runs closer to $40,000 once you add everything" (the
   brief states $15,000; no stated assumption justifies the change).
3. "Owning costs $96,000, which is cheaper monthly than the courier" (the
   $96,000 is a one-time upfront, not a monthly — category error).

### Subjective guidance

- **Decision rigor** (0.4): are the criterion weights defended, not
  decorative? A matrix reverse-engineered to justify a pre-picked winner
  scores low — check whether plausible alternative weights would flip the
  result and whether that risk is acknowledged. Does the memo engage the
  multi-year total cost (not just monthly stickers) and the coordinator-
  burden reality behind the cheapest option?
- **Memo clarity** (0.3): a GM with five minutes should get the answer,
  the cost picture, and the biggest risk without hunting.
- **Reasoning quality** (0.3): does REASONING.md engage with the 3-year
  cost math, the surcharge threshold (that it does not fire at 7 routes),
  and the staffing reality — rather than just restating the memo?
