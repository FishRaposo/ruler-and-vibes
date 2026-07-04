---
id: research-02-conflict-brief
category: research-synthesis
title: Reconciling conflicting accounts into a cited brief
deliverables:
  - brief.md
---

## Task

Below are five sources describing a ferry incident at Port Maren. They
disagree on several key facts. Write `brief.md` (300–450 words) that
reconciles these accounts into a single coherent account, with inline
`[S#]` citations for every factual claim you make.

Your brief must include a "Disputed points" table with columns `Point`,
`Competing accounts (with sources)`, and `Accepted finding (with
rationale)`, covering the three points where sources disagree: number
aboard, departure time, and cause.

Your brief must also explicitly address, for each of these four facts,
either the accepted finding with citations or state that it is "not
established by any source": number aboard, departure time, cause, and
number of injuries.

### Sources

#### S1 — Port Maren Wire, news-wire dispatch, filed 06:50 the morning of the incident

BREAKING: A ferry near Port Maren experienced an onboard incident this
morning, according to early accounts from witnesses at the dock. Sources
at the scene say 42 passengers were aboard at the time. The ferry's
departure was recorded at 06:40. Witnesses reported seeing smoke and
flames near the engine compartment shortly after departure, and the
preliminary account from dockside observers points to an engine fire as
the likely cause. This is a developing story and the Port Maren Wire
will update as more information becomes available from the ferry
operator and local authorities. No official statement has yet been
issued by the ferry operator or by maritime safety officials.

#### S2 — Statement from the ferry operator, issued the day after the incident

The ferry operator can now confirm that 51 people were aboard the vessel
at the time of the incident, revising the figure reported in some early
news accounts. We are not in a position to state a cause at this time,
as that determination is the responsibility of the maritime safety
authority's ongoing investigation, and we do not want to speculate ahead
of their findings. We thank our crew for their swift response and thank
passengers for their patience during an unsettling morning. We will
share further updates as the official investigation progresses and will
cooperate fully with investigators throughout.

#### S3 — Official maritime-safety report, issued two weeks after the incident

This report presents the maritime safety authority's findings following
a two-week investigation. The vessel had 51 persons aboard at departure,
corroborating the ferry operator's statement. Departure occurred at
07:10, not 06:40 as some early accounts reported. Physical evidence from
the engine room indicates the cause was an electrical fault in the
auxiliary generator, not an engine fire. Investigators determined that
the smoke observed by dockside witnesses originated from this electrical
fault and was mistaken in the moment for signs of an open flame; no fire
damage consistent with a genuine engine fire was found anywhere in the
engine compartment. This report is based on physical inspection of the
vessel and interviews conducted after the incident, not on dockside
witness impressions alone.

#### S4 — Independent marine engineer's blog post, published after the official report

Having reviewed the official maritime-safety report's findings, I want to
walk through why an electrical fault in the auxiliary generator is fully
consistent with the physical damage described. Auxiliary generator
faults of this type commonly produce dense smoke with little or no
visible flame, which readily explains why dockside witnesses reported
seeing what looked like fire. The damage pattern described in the report
— concentrated wiring and insulation damage rather than the more
diffuse, high-heat scorching typical of a true engine-compartment fire —
matches known electrical-fault cases I've examined before. I'll defer to
the official report on headcount and departure time, since I have no
independent basis to confirm or dispute either figure myself.

#### S5 — Aggregator news article, published the same day as the initial dispatch

According to the Port Maren Wire, a ferry near Port Maren experienced an
incident this morning with 42 passengers aboard. The Port Maren Wire
reports the vessel departed at 06:40 and that witnesses observed what
appeared to be an engine fire shortly after departure. Details remain
limited at this early hour, and neither the ferry operator nor maritime
safety officials have yet issued a statement of their own, so readers
should treat these early figures as preliminary pending confirmation
from an official source. We will continue to monitor this developing
story and will update our coverage as the Port Maren Wire and other
outlets report further details throughout the day.

## Deliverables

- `brief.md` (300–450 words): a cited, reconciled account of the
  incident, including the mandatory "Disputed points" table and coverage
  of all four required facts (number aboard, departure time, cause,
  injuries).

## Constraints

- Every factual claim in the brief must carry an inline `[S#]` citation.
- The "Disputed points" table must cover all three disputed points
  (headcount, departure time, cause) with columns `Point`, `Competing
  accounts (with sources)`, `Accepted finding (with rationale)`.
- `brief.md` word count (whole file, `wc -w`) must be between 300 and
  450.
