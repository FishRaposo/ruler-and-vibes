---
id: context-02c-tram-headway-tally
category: long-context
title: Cross-revision aggregation over a transit service bulletin
deliverables:
  - TALLY.md
---

## Task

Below is the service bulletin for the "Verith Tramway," a municipal
light-rail network, covering timetable revisions R1.0 through R3.2. Read
it carefully — some of the information needed to answer the questions
below is scattered across multiple entries, and one entry is listed out
of chronological order. Produce `TALLY.md` containing exactly these
labeled lines and a table, in this order:

- An `A:` line answering Question A.
- A `B:` line answering Question B.
- A `C:` line answering Question C.
- An `Excluded:` line naming every item you excluded from your counts and
  why.
- A markdown table with one row per revision that reported a completed
  track-possession closure, with columns for the revision and the minutes
  of the closure.

### Verith Tramway — Service Bulletin (R1.0 through R3.2)

The Verith Tramway is a municipal light-rail network serving the riverside
and hill districts, operated by a regional transit authority and used
daily by commuters and schools. This bulletin covers every timetable
revision from R1.0 through R3.2, in the order published, with one
exception noted below: the R2.4.1 patch revision is listed after R1.6 in
this document because it was reconstructed from an older maintenance
branch and merged out of its normal chronological position in our
revision-tracking system. Readers reconstructing a strict timeline should
note that R2.4.1 was actually published between R1.4 and R1.5 in
calendar time, but appears later in this document's ordering.

Each revision entry lists new service changes, junction-signalling fixes,
and any scheduled or cancelled track-possession closures associated with
that revision's rollout. A "Season in Review" recap section appears near
the end of this document, summarizing selected highlights already
described in earlier entries; it introduces no new information and should
not be treated as a source of new facts.

This bulletin is maintained by the network-control team and is published
alongside each revision to the public service archive and to the rider
information boards at every stop. Internally, the team also maintains a
more detailed operations log with signal-level detail, but that log is
not distributed externally and is out of scope for this summary. Readers
who need to reconcile a specific rider-reported disruption against a
revision should use this document as the authoritative public record of
what shipped, what was rolled back, and what closures affected service
availability during each revision's rollout.

#### R1.0

Initial tracked revision for this bulletin's coverage window.

New service changes: added the riverside express pattern, restored the
hill-district loop, and a redesigned connection map with saved journey
favourites.

Bug fixes: Fixed Junction signalling: the Weirgate interlocking dropping a
route call when the platform track circuit was already occupied. Also
corrected an incorrect approach aspect at the Cloister curve when a service
ran early, and fixed a stuck point detector at the Millrace crossover.

Scheduled track-possession closure: 50 minutes. This covered a relay
replacement at the Weirgate interlocking and was completed without
incident. The possession was planned over several weeks by the
infrastructure team, who coordinated the window with the operations desk
to ensure riders were notified at least 72 hours in advance through the
stop information boards and the network status page.

#### R1.1

New service changes: introduced the headway.target setting, default value
120 seconds. This setting controls how frequently the control system aims
to dispatch a tram from the terminus during peak service, and it can be
adjusted by the operations desk in the dispatch console under the Service
tab. The setting was added after several riders described long gaps
following bunched arrivals, and the network-control team chose 120 seconds
as a conservative default balancing platform crowding against depot
turnaround pressure on the shared fleet. Also introduced a new
short-turn pattern for the riverside branch, supporting up to sixteen
independently timed short-turn slots per peak window.

Bug fixes: Fixed Junction signalling: the Cloister curve signal ignoring a
custom overlap timing. Also fixed a slow-order marker that failed to clear
after a temporary restriction was lifted, and corrected a command conflict
between the "Duplicate Slot" action and the dispatch console's
emergency-hold command on some workstations.

No scheduled possession this revision.

#### R1.2

New service changes: added support for importing legacy .vtt1 timetable
files from the discontinued Verith Interurban service. This was one of the
most-requested capabilities from the scheduling team, filed by planners
migrating from the older service who had accumulated large libraries of
legacy timetables and needed a reliable path to bring their work into the
current tooling without manually re-entering every trip. The import
process preserves trip structure, layover rules, and most connection
constraints, though a small number of legacy patterns with no direct
equivalent in the current tooling are flattened into generic hold slots
with a warning shown to the planner during import.

Bug fixes: Fixed Junction signalling: batch route-setting skipping locked
crossovers. Also fixed a display artifact when zooming past 800% on
diagrams using the short-turn pattern introduced last revision, and
corrected a fault when undoing a trip-merge operation immediately after a
batch route-set.

Scheduled track-possession closure: 35 minutes. This covered a track-circuit
recalibration for the hill-district loop used by the connection planner.

#### R1.3

New service changes: added a new "Focus Board" view that hides all panels
except the live line diagram and a minimal dispatch toolbar.

Bug fixes: Fixed Junction signalling: the CMYK-coded platform indicator
producing an incorrect aspect profile when the stop's working lighting mode
was set to a custom night profile. Also fixed a fault when applying a hold
marker to a trip with a variable dwell time, and fixed the platform guides
snapping to the wrong grid increment after switching distance units
mid-session.

Settings: Changed headway.target from 120 seconds to 90 seconds based on
rider feedback about bunched arrivals. Several riders on the community
board reported waits of more than two minutes between trams during peak,
and this change was made in direct response to that feedback. The
network-control team weighed the tradeoff between tighter headways and the
small added pressure on depot turnaround, and concluded that 90 seconds
was an acceptable middle ground for most peak windows while the team
continued to investigate the underlying causes of the bunching being
reported.

No scheduled possession this revision.

#### R1.4

New service changes: added a mirrored-branch dispatch mode for the
riverside pattern, supporting up to eight paired departure slots.
Planners working on symmetric event-day service had long requested this
capability, and the implementation allows the pairing origin to be
repositioned mid-window without discarding previously assigned slots. The
capability also integrates with the existing short-turn pattern, allowing
mirrored short-turns, though this combination surfaced the alignment fault
noted below when used on very long peak windows.

Bug fixes: Fixed Junction signalling: the archive export corrupting
embedded route tables when a trip used more than one signalling region in a
single pattern. Also fixed a fault when applying mirrored dispatch to a
window longer than 8000 trip-seconds, and fixed incorrect preview
generation for patterns saved from the new Focus Board view.

No scheduled possession this revision.

#### R1.5

New service changes: added customizable dispatch profiles with support for
planner-imported rule packs. Teams can now import their own rule
definitions in a portable format and assign them to any pattern, with
controls for layover tolerance, jitter margin, and priority blending
against the base pattern. A starter pack of twenty profiles, contributed
by scheduling-team members during trials, ships with the tooling by
default.

Bug fixes: Fixed Junction signalling: the route-set queue hanging on
network archives when the archive destination became unreachable mid-write.
Also fixed a display issue in the Focus Board view, and fixed the
mirrored-branch dispatch mode introduced last revision producing misaligned
slots when the pairing origin had been manually recentered.

Scheduled track-possession closure: 70 minutes. This covered a major
overhaul of the Weirgate junction motors used by the primary approach, and
services scheduled on that approach experienced a brief interruption
during the window.

#### R1.6

New service changes: added a new "Quick Pattern" panel providing one-click
templates for common event-day service shapes, including templates sized
for several partner venues' current crowd profiles. Teams can also define
and save their own custom templates, which persist across seasons and sync
across consoles for planners signed into an authority account.

Bug fixes: Fixed Junction signalling: the overlay indicator flattening
priority aspects incorrectly when a pattern contained nested route
reservations. Also fixed a fault when duplicating a mirrored-branch slot
across an odd number of paired departures, and fixed incorrect region
embedding in the new Quick Pattern panel's templates.

Planned track possession (cancelled): 100 minutes. A planned upgrade to
the archive search index was scheduled for this revision but was cancelled
before it began, after an internal review determined the existing index
was performing within acceptable limits and the upgrade could be deferred.
No closure occurred in connection with this revision.

#### R2.4.1 (patch)

This patch revision addresses a regression discovered shortly after R1.4
shipped and was published between R1.4 and R1.5 in calendar time, though
it is listed here, after R1.6, due to how it was merged into this
bulletin's tracking system from an older maintenance branch.

Bug fixes: Fixed a regression in the mirrored-branch dispatch mode
(introduced in R1.4) that caused the dispatch console to stall when
mirrored dispatch was combined with the short-turn pattern on windows
longer than 4000 trip-seconds.

Scheduled track-possession closure: 20 minutes. A short emergency
possession was taken to roll out this patch to the trackside controllers
ahead of the next scheduled revision.

#### R1.7

New service changes: added a new "Batch Retime" utility for archived
pattern sequences, letting teams define a naming template with sequence
numbers, date stamps, and custom text fields, then apply it across an
entire batch of archived patterns in one operation. This was developed in
response to requests from partner agencies ingesting large numbers of
patterns for downstream planning, where consistent, predictable naming
across hundreds of archived patterns is essential for automated ingest.

Bug fixes: Fixed Junction signalling: the slow-order overlay misaligned on
reversed patterns when the pattern had been reversed by a non-standard
turnback point. Also fixed a fault in the Batch Retime utility when the
naming pattern contained unsupported characters, and fixed the Quick
Pattern panel's templates resetting to default after a tooling update.

Settings: Changed headway.target from 90 seconds to 60 seconds.

No scheduled possession this revision.

#### R1.8

New service changes: added support for generating animated line-run
previews directly from pattern-based diagrams, removing the need to
round-trip through a third-party visualization tool for simple loop
previews. The generator supports configurable frame cadence, loop count,
and an optional smoothing mode for reducing stepping in dense-frame
previews.

Bug fixes: Rolled back the R1.7 slow-order overlay fix for reversed
patterns; it introduced a worse regression on multi-branch patterns where
every branch after the first would silently lose its slow-order overlay
entirely, and the fix is no longer in effect as of this revision. Also
fixed a fault when generating a preview containing more than 200 frames,
and fixed incorrect frame-timing metadata in generated preview files.

Scheduled track-possession closure: 85 minutes. This covered a signalling
firmware rotation for the network's route-setting infrastructure.

#### R1.9

New service changes: added a dark-panel variant for the entire dispatch
console, including all panels and dialogs, plus a system-following option
that switches automatically based on the workstation's appearance setting.
A dark panel was the single most-requested item in the operations team's
annual tooling survey, and its rollout was coordinated with readability
testing to ensure sufficient contrast across every panel.

Bug fixes: Fixed Junction signalling: the compressed route table applying
double compression on re-export when a previously exported table was
re-opened and exported again without modification. Also fixed dark-panel
contrast issues in the connection map's saved-favourites panel, and fixed a
fault when toggling dark panel while a modal dialog was open.

Documentation update: clarified in the operator guide how the
headway.target setting (currently 60 seconds) affects depot turnaround
budgeting on shared fleet days. No change to the setting's value; this was
a wording clarification in the operator guide's dispatch section only.

No scheduled possession this revision.

#### R3.0

New service changes: introduced a new run-history timeline panel showing a
visual scrubber through a revision's saved dispatch snapshots, letting
planners preview and restore any prior snapshot point without leaving the
current session. The panel builds directly on the headway.target setting
introduced earlier in the year, since tighter headways produce a denser
and more useful history for this feature to draw on.

Bug fixes: Fixed a fault when opening the new run-history panel on a
revision with more than 500 dispatch snapshots, which primarily affected
long-running seasons that had been open continuously for many days. Also
fixed incorrect snapshot previews in the run-history panel for patterns
using custom night profiles, where previews were rendered using the default
day profile instead of the pattern's actual working profile, and fixed a
memory leak in the route-setting relay client introduced in R1.5's junction
overhaul, which had gone unnoticed until several seasons reported gradually
increasing memory usage during very long dispatch sessions.

Scheduled track-possession closure: 115 minutes. This covered a full
migration of the dispatch-snapshot storage to a new backend designed to
support the new panel's scrubbing feature at scale. The migration was
staged in three phases across the possession, with read-only access to
existing snapshots preserved throughout most of the window and only a
brief final cutover requiring a full service pause.

#### R3.1

New service changes: added support for custom console-shortcut profiles
that can be exported and shared between planners, useful for teams
standardizing shortcut layouts across a shift or for planners migrating
from other dispatch systems who want to replicate a familiar shortcut
scheme. Profiles are stored as a portable file format that can be version
controlled alongside other authority configuration files.

Bug fixes: Fixed Junction signalling: dispatch templates not persisting
after console restart when the templates had been created in the Quick
Pattern panel. Also fixed a conflict between custom console-shortcut
profiles and the workstation's accessibility shortcuts, and fixed the
run-history timeline panel failing to load snapshots older than 30 days.

Settings: Changed headway.target from 60 seconds to 200 seconds after
planner reports that very tight headways caused depot turnaround
contention during large event-day seasons on the shared fleet. The new
default better balances platform-crowding risk against fleet availability
for most windows, though planners working primarily on short off-peak
patterns can still lower the headway back down in the dispatch console if
they prefer tighter service.

No scheduled possession this revision.

#### R3.2

New service changes: added a new "Revision Compare" tool allowing
side-by-side visual comparison of two dispatch snapshots, with a
synchronized zoom and pan so planners can inspect the same segment of the
line across both snapshots simultaneously. This closes out the run-history
feature arc that began earlier in the year with the timeline panel, giving
planners a complete workflow for reviewing and restoring prior states of a
revision.

Bug fixes: Fixed a fault in the Revision Compare tool when comparing
snapshots of different line lengths, which previously caused the console to
terminate unexpectedly rather than showing a graceful error explaining that
comparison across differently sized lines is not yet supported. Also fixed
incorrect zoom synchronization between the two panes of the Revision
Compare tool, where zooming one pane would sometimes apply the wrong zoom
factor to the other, and fixed a rendering artifact in Revision Compare
when one snapshot used dark panel and the other did not.

No scheduled possession this revision.

#### Season in Review: Highlights from R1.0 through R3.2

This recap section summarizes selected highlights from the revisions above
for readers who want a quick overview of the year's progress. It does not
introduce any new fixes, service changes, or settings changes beyond what
is described in the revision entries above.

Signalling reliability was a major theme this year. Early on, the Cloister
curve overlap-timing fix landed, and later the nested-reservation overlay
flattening issue was resolved as well. On the settings side, the headway
target was tuned more than once during the year, most recently landing at
200 seconds after planners reported depot turnaround contention on large
event-day seasons. The compressed route-table double-compression issue was
also resolved, improving fidelity for teams who frequently re-export the
same table.

Other notable highlights included the introduction of a dark panel across
the entire console, the new run-history timeline panel with its snapshot
scrubber, and the Revision Compare tool that closed out the year. The team
also thanks the scheduling team for the feedback that shaped several of
this year's settings changes and fix priorities.

Looking back, the network-control team is proudest of the steady cadence
maintained across all fourteen revisions this year, with no revision
slipping its planned date by more than a few days. The team also
highlights the Weirgate junction-motor overhaul, the dispatch-snapshot
storage migration, and the signalling firmware rotation as examples of
behind-the-scenes maintenance work that kept the network reliable without
requiring rider-facing announcements beyond the standard service notes.
Looking ahead to next year, the team plans to focus on performance
improvements for very large seasons and continued refinement of the
dispatch experience introduced in earlier revisions. Thank you to every
rider who filed a disruption report, posted on the community board, or
took part in the trials this year — this bulletin would be far shorter
without your help finding and describing these issues clearly.

## Questions

- **Question A**: How many junction-signalling fixes are in effect as of
  R3.2 — that is, shipped and not subsequently rolled back?
- **Question B**: What is the total completed track-possession closure
  time, in minutes, across all revisions?
- **Question C**: List, in order, every revision in which the value of the
  `headway.target` setting changed from a previous value. (A revision that
  merely introduces the setting for the first time, or that mentions it
  without changing its value, does not count.)

## Deliverables

- `TALLY.md` containing, in order: an `A:` line, a `B:` line, a `C:` line,
  an `Excluded:` line, and a markdown table of completed track-possession
  closure time by revision.

## Constraints

- `TALLY.md`'s markdown table must include one row per revision that
  reported a *completed* track-possession closure (do not include
  revisions with no scheduled possession, and do not include the cancelled
  window), and its minutes column must sum to your stated `B:` total.
- The `Excluded:` line must name every item you left out of your counts and
  state why, so a reader can audit your work without re-reading the whole
  bulletin.
