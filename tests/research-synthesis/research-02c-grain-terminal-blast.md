---
id: research-02c-grain-terminal-blast
category: research-synthesis
title: Reconciling conflicting blast reports into a cited brief
deliverables:
  - brief.md
---

## Task

Below are five sources describing a dust explosion at the Harrowgate grain
terminal. They disagree on several key facts. Write `brief.md` (300–450
words) that reconciles these accounts into a single coherent account, with
inline `[S#]` citations for every factual claim you make.

Your brief must include a "Disputed points" table with columns `Point`,
`Competing accounts (with sources)`, and `Accepted finding (with
rationale)`, covering the three points where sources disagree: workers on
site, time of the blast, and cause.

Your brief must also explicitly address, for each of these four facts,
either the accepted finding with citations or state that it is "not
established by any source": workers on site, time of the blast, cause, and
tonnage of grain destroyed.

### Sources

#### S1 — Harrowgate Clarion, breaking news-wire dispatch, filed 14:20 the afternoon of the incident

BREAKING: A blast tore through a storage annex at the Harrowgate grain
terminal this afternoon, according to early accounts from workers gathered
outside the gate. People at the scene say 18 workers were on site when the
annex went up. The explosion was logged at 14:05 by observers near the
loading dock. Several bystanders described seeing a welding crew at work on
the annex frame shortly beforehand, and the preliminary account from those
at the gate points to a welding-crew spark as the likely cause. This is a
developing story and the Harrowgate Clarion will update as more emerges
from the terminal operator and the grain-safety authority. No official
statement has yet been issued by the terminal operator or by safety
investigators.

#### S2 — Statement from the terminal operator, issued the day after the incident

The terminal operator can now confirm that 23 workers were on site at the
time of the incident, revising the figure reported in some early news
accounts. We are not in a position to state a cause at this time, as that
determination is the responsibility of the grain-safety authority's ongoing
investigation, and we do not want to speculate ahead of their findings. We
thank our shift crew for their swift response and thank the wider workforce
for their patience during a distressing afternoon. We will share further
updates as the official investigation progresses and will cooperate fully
with investigators throughout.

#### S3 — Official grain-safety report, issued three weeks after the incident

This report presents the grain-safety authority's findings following a
three-week investigation. The terminal had 23 workers on site at the time
of the blast, corroborating the operator's statement. The explosion
occurred at 13:30, not 14:05 as some early accounts reported; the earlier
time came from a bystander's phone clock and the annex's own time-stamped
sensor log fixes the blast at 13:30. Physical evidence from the annex
indicates the cause was a static discharge that ignited suspended grain
dust, not a welding-crew spark. Investigators determined that no welding
work was underway on the annex that afternoon and that the sparks bystanders
recalled were from routine dock activity elsewhere on the site; the
static-ignition signature was consistent with the dust loading measured in
the annex. This report is based on physical inspection and sensor logs, not
on gate-side witness impressions alone.

#### S4 — Independent grain-handling engineer's blog post, published after the official report

Having reviewed the official grain-safety report's findings, I want to walk
through why a static discharge igniting suspended dust is fully consistent
with the physical damage described. Static-ignition events of this type in
grain handling commonly leave the localized deflagration pattern the report
describes, and they occur without any external flame source, which readily
explains why gate-side witnesses reached for the nearest visible activity to
account for the blast. The damage pattern in the report — a dust-cloud
overpressure signature rather than the point-source burn a welding torch
would leave — matches known static-ignition cases I've examined before.
I'll defer to the official report on the headcount and the time of the
blast, since I have no independent basis to confirm or dispute either figure
myself.

#### S5 — Aggregator news article, published the same day as the initial dispatch

According to the Harrowgate Clarion, a blast hit the Harrowgate grain
terminal this afternoon with 18 workers on site. The Harrowgate Clarion
reports the explosion occurred at 14:05 and that bystanders saw a welding
crew at work shortly before the annex went up. Details remain limited at
this early hour, and neither the terminal operator nor grain-safety
officials have yet issued a statement of their own, so readers should treat
these early figures as preliminary pending confirmation from an official
source. We will continue to monitor this developing story and will update
our coverage as the Harrowgate Clarion and other outlets report further
details throughout the day.

## Deliverables

- `brief.md` (300–450 words): a cited, reconciled account of the incident,
  including the mandatory "Disputed points" table and coverage of all four
  required facts (workers on site, time of the blast, cause, tonnage of
  grain destroyed).

## Constraints

- Every factual claim in the brief must carry an inline `[S#]` citation.
- The "Disputed points" table must cover all three disputed points (workers
  on site, time of the blast, cause) with columns `Point`, `Competing
  accounts (with sources)`, `Accepted finding (with rationale)`.
- `brief.md` word count (whole file, `wc -w`) must be between 300 and 450.
