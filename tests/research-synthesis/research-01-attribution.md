---
id: research-01-attribution
category: research-synthesis
title: Claim-to-source attribution table
deliverables:
  - attribution.md
---

## Task

Below are four short source excerpts about a fictional product recall,
followed by 10 numbered claims. For each claim, classify it as:

- **SUPPORTED** — at least one source states it, and no source is
  incompatible with it.
- **CONTRADICTED** — at least one source makes a statement incompatible
  with the claim. If a claim is asserted by one source but denied by
  another, classify it as CONTRADICTED — this takes precedence over
  SUPPORTED whenever both apply.
- **UNSUPPORTED** — no source addresses the claim at all.

Produce `attribution.md` containing a single markdown table with columns
`Claim`, `Verdict`, `Sources` — one row per claim, in order. For a
SUPPORTED or CONTRADICTED verdict, list every source ID (from `S1`–`S4`)
that supports or contradicts the claim. For an UNSUPPORTED verdict, put
exactly `none` in the Sources column.

### Sources

#### S1 — Company press release (Bramblewick Tea Co.)

Bramblewick Tea Co. today announced a voluntary recall of its Hillside
Chamomile blend, lot codes beginning BW-22, due to a possible
foreign-material contamination risk identified during routine quality
testing. Affected lots were pulled from retail shelves within 48 hours
of the issue being confirmed by our quality team. The recall lasted 13
days, concluding once all affected retailers confirmed full removal of
the product from shelves. No illnesses have been reported in connection
with this recall. We want to be clear: the company's own testing lab
identified this contamination risk during routine sampling, not a
customer complaint, and we are grateful to our quality team for catching
it before any wider issue could develop.

#### S2 — Regional newsletter article

The Hillside Gazette reports that Bramblewick Tea Co. has recalled its
Hillside Chamomile blend after the company's own press release cited a
possible contamination risk found during routine testing. The affected
blend is sold in more than 400 grocery stores across the region, making
it one of Bramblewick's widest-distributed products and a familiar sight
on local shelves. Readers may recall that a different regional tea
company faced a similar chamomile-blend recall two years ago; that
earlier incident was unrelated to Bramblewick and involved a different
contamination source entirely, according to state health records from
that time. The Gazette will continue to follow this story closely as
more details become available from the company and from state health
regulators overseeing the matter.

#### S3 — Internal inspection memo (Bramblewick quality team)

This memo documents the quality team's findings on the Hillside
Chamomile contamination issue. The contamination risk was identified
during a routine sampling audit conducted as part of our standard
quarterly testing cycle, not as a result of any customer complaint
received through our support channels. The recall lasted 13 days from
initial announcement to confirmed shelf-clearance across all affected
retail partners. Our investigation traced the contamination to a
packaging-line issue at one of our third-party suppliers, not to
Bramblewick's own manufacturing facility, which passed all internal
audits during the same period. No other Bramblewick product line was
affected by this contamination source; the issue was isolated entirely
to the affected lot codes of the Hillside Chamomile blend.

#### S4 — Customer forum post

Posted to a tea-enthusiast forum: "I bought a box of Hillside Chamomile
the week before the recall was announced and found small plastic
fragments in two of the tea bags. Pretty unsettling, honestly, since I'd
been drinking this stuff for years without any issue. I contacted the
company directly and they offered me a refund right away, which I
appreciated, and the support rep was polite and quick about the whole
thing. I don't know what caused it, but it made me wonder — I have no
idea if this is the first time something like this has happened to this
company, I'm just guessing out loud here since I don't have any real
information either way. Anyway, glad nobody I know got hurt, and the
refund process was quick and easy at least."

### Claims

1. Bramblewick Tea Co. recalled its Hillside Chamomile blend due to a
   possible contamination risk.
2. The recalled tea is sold in more than 400 grocery stores in the
   region.
3. The contamination was traced to Bramblewick's own manufacturing
   facility.
4. Bramblewick has issued a public apology letter to customers.
5. The contamination risk was identified through routine testing, not a
   customer complaint.
6. The recall lasted 30 days.
7. This was the company's first product recall.
8. A customer reported finding foreign material (plastic fragments) in
   the product.
9. The recall was triggered by a customer complaint about contamination,
   not by the company's own testing.
10. The supplier responsible for the contaminated packaging has been
    permanently dropped by Bramblewick.

## Deliverables

- `attribution.md`: a markdown table with columns `Claim`, `Verdict`,
  `Sources`, one row per claim (10 rows total), in order.

## Constraints

- Every `Verdict` cell must be exactly one of `SUPPORTED`, `CONTRADICTED`,
  or `UNSUPPORTED`.
- Every `Sources` cell for a SUPPORTED or CONTRADICTED row must list only
  source IDs from `{S1, S2, S3, S4}`.
- Every `Sources` cell for an UNSUPPORTED row must be exactly `none`.
