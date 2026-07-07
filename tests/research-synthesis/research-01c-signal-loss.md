---
id: research-01c-signal-loss
category: research-synthesis
title: Network outage claim attribution table
deliverables:
  - attribution.md
---

## Task

Below are four short source excerpts about a fictional regional network
outage, followed by 10 numbered claims. For each claim, classify it as:

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

#### S1 — Company press release (Fenwick Mobile)

Fenwick Mobile today confirmed a network outage affecting cellular
voice, text, and data service across the Cedar Hollow region, caused by
a severed fiber-optic trunk cable identified during routine network
monitoring. Automated alarms in our network operations center flagged
the fault within minutes of the cable being severed, and our field
crews restored full service within 14 hours of the alarm being raised.
No customer data was compromised and no injuries were reported in
connection with this incident. We want to be clear: our monitoring
systems detected this outage automatically through alarm signals, not
through customer support tickets, and we are grateful to our network
operations team for catching and resolving the fault so quickly. We
appreciate our customers' patience during the restoration effort.

#### S2 — Regional news article

The Cedar Hollow Courier reports that Fenwick Mobile experienced a
network outage across the region after the company's press release
cited a severed fiber cable found during routine monitoring. The
outage affected mobile service for more than 60,000 households across
the region, making it one of the most disruptive service interruptions
the company has had in the area. Readers may recall that a different
regional carrier experienced a similar network outage three years ago;
that earlier incident was unrelated to Fenwick and involved a separate
cable route entirely, according to state utility commission records
from that time. The Courier will continue to follow this story as more
details emerge from the company and from the state utility commission
overseeing the investigation.

#### S3 — Internal incident report (Fenwick network operations team)

This memo documents the network operations team's findings on the
Cedar Hollow fiber outage. The fault was identified automatically
through our standard monitoring-alarm system during a routine network
health check, not as a result of any customer support tickets received
through our call center. Service was fully restored within 14 hours of
the alarm being raised, consistent across all affected cell sites and
customer accounts. Our investigation traced the cable damage to
excavation work performed by Ashgrove Utility Contractors, a
third-party crew hired by the city for an unrelated water-main
project, not to any Fenwick maintenance activity; our own crew had
inspected the same conduit segment during a scheduled audit earlier
that month and found no faults. No other Fenwick service region was
affected by this incident; the outage was isolated entirely to the
cell sites served by the severed cable segment.

#### S4 — Customer forum post

Posted to a regional telecom-enthusiasts forum: "My phone had zero
signal for what felt like forever the day of the Fenwick outage — no
calls, no texts, nothing loaded. I'd been a customer for years without
any real problems before this. I called support once service came back
and they credited my account for the inconvenience without any hassle,
which I appreciated, and the rep I talked to was friendly and quick
about it. I don't know what caused it on their end, but it got me
wondering — I have no idea if Fenwick has had an outage this bad
before, I'm just guessing out loud here since I don't actually know
their outage history one way or another. Anyway, glad it didn't mess up
anything important for me, and the account credit was easy to get at
least."

### Claims

1. Fenwick Mobile experienced a network outage caused by a severed
   fiber-optic cable.
2. The outage affected mobile service for more than 60,000 households
   in the region.
3. The fiber cable was severed by Fenwick's own maintenance crew.
4. Fenwick Mobile has issued a public apology letter to customers.
5. The outage was detected automatically through network monitoring,
   not customer complaints.
6. The outage lasted 41 hours.
7. This was the first major network outage Fenwick has ever
   experienced.
8. A customer reported losing cellular service completely for several
   hours.
9. The outage was first detected because customers reported it to
   Fenwick's support line, not through internal monitoring.
10. The utility contractor responsible for severing the cable has been
    permanently banned from future city projects with Fenwick.

## Deliverables

- `attribution.md`: a markdown table with columns `Claim`, `Verdict`,
  `Sources`, one row per claim (10 rows total), in order.

## Constraints

- Every `Verdict` cell must be exactly one of `SUPPORTED`, `CONTRADICTED`,
  or `UNSUPPORTED`.
- Every `Sources` cell for a SUPPORTED or CONTRADICTED row must list only
  source IDs from `{S1, S2, S3, S4}`.
- Every `Sources` cell for an UNSUPPORTED row must be exactly `none`.
