---
id: research-02b-datacenter-outage
category: research-synthesis
title: Reconciling conflicting outage reports into a cited brief
deliverables:
  - brief.md
---

## Task

Below are five sources describing a service outage at the Calderwood Data
Center. They disagree on several key facts. Write `brief.md` (300–450
words) that reconciles these accounts into a single coherent account, with
inline `[S#]` citations for every factual claim you make.

Your brief must include a "Disputed points" table with columns `Point`,
`Competing accounts (with sources)`, and `Accepted finding (with
rationale)`, covering the three points where sources disagree: servers
affected, outage start time, and cause.

Your brief must also explicitly address, for each of these four facts,
either the accepted finding with citations or state that it is "not
established by any source": servers affected, outage start time, cause,
and number of customers affected.

### Sources

#### S1 — Calderwood Ops-Status Wire, automated status dispatch, posted 03:40 the morning of the outage

STATUS UPDATE: The Calderwood Data Center is experiencing a service
outage this morning, per early telemetry and on-floor operator reports.
On-floor staff indicate 118 servers are affected at this time. Telemetry
timestamps place the start of the disruption at 02:15. Operators observed
rack temperatures climbing sharply in the affected aisle shortly before
services dropped, and the preliminary read from the operations floor
points to a cooling failure as the likely cause. This is an evolving
situation and the status wire will update as more information becomes
available from Vantor and from the post-incident review. No formal
statement has yet been issued by Vantor or by the reliability review team.

#### S2 — Statement from Vantor, the operator, issued the day after the outage

Vantor can now confirm that 96 servers were affected during yesterday's
outage, revising the higher figure that appeared in some early status
feeds. We are not in a position to state a root cause at this time, as
that determination belongs to the ongoing post-incident review, and we do
not want to speculate ahead of its findings. We thank our on-call
engineers for their rapid response and thank affected customers for their
patience during the disruption. We will share further detail once the
review concludes and will publish its findings in full.

#### S3 — Official post-incident review, published twelve days after the outage

This review presents the reliability team's findings after a twelve-day
investigation. Log reconstruction confirms that 96 servers were affected,
corroborating Vantor's statement. The disruption began at 03:05, not 02:15
as some early status feeds recorded; the earlier timestamp came from a
monitoring node whose clock had drifted, and correlated logs across the
facility place the true start at 03:05. Physical inspection and power-rail
telemetry establish the cause as a firmware fault in a power distribution
unit, not a cooling failure. The rising rack temperatures noted early on
were a downstream effect of the power fault, not a coolant-loop defect; no
cooling-system failure was found. This review rests on log evidence and
physical inspection, not on the initial on-floor impressions.

#### S4 — Independent reliability engineer's blog post, published after the official review

Having read the Calderwood post-incident review, I want to walk through
why a power-distribution-unit firmware fault fully fits the evidence
described. Firmware faults of this class commonly trip a unit in a way
that spikes downstream load and drives rapid heat buildup in the affected
racks, which neatly explains why on-floor staff first read the event as a
cooling problem. The telemetry signature described in the review —
concentrated on the power rail rather than the coolant loop — matches
firmware-fault cases I have examined before. I defer to the review on the
server count and the start time, since I have no independent basis to
confirm or dispute either figure myself.

#### S5 — Aggregator tech-news article, published the same day as the initial dispatch

According to the Calderwood Ops-Status Wire, the Calderwood Data Center
suffered a service outage this morning affecting 118 servers. The status
wire reports the disruption began at 02:15 and that on-floor operators saw
signs pointing to a cooling failure shortly before services dropped.
Details remain limited at this early hour, and neither Vantor nor the
reliability review team has issued a statement of its own, so readers
should treat these early figures as preliminary pending confirmation from
an official source. We will keep monitoring this developing story and
update as the status wire and other outlets report further detail.

## Deliverables

- `brief.md` (300–450 words): a cited, reconciled account of the outage,
  including the mandatory "Disputed points" table and coverage of all four
  required facts (servers affected, outage start time, cause, customers
  affected).

## Constraints

- Every factual claim in the brief must carry an inline `[S#]` citation.
- The "Disputed points" table must cover all three disputed points
  (servers affected, outage start time, cause) with columns `Point`,
  `Competing accounts (with sources)`, `Accepted finding (with
  rationale)`.
- `brief.md` word count (whole file, `wc -w`) must be between 300 and 450.
