---
id: context-02b-orbiter-downlink-tally
category: long-context
title: Cross-phase aggregation over a mission operations log
deliverables:
  - TALLY.md
---

## Task

Below is the mission operations bulletin for the "Areion" Mars orbiter, a
robotic science spacecraft, covering its science phases P1.0 through P3.2.
Read it carefully — some of the information needed to answer the questions
below is scattered across multiple entries, and one entry is listed out of
chronological order. Produce `TALLY.md` containing exactly these labeled
lines and a table, in this order:

- An `A:` line answering Question A.
- A `B:` line answering Question B.
- A `C:` line answering Question C.
- An `Excluded:` line naming every item you excluded from your counts and
  why.
- A markdown table with one row per phase that reported a completed
  safe-mode maintenance pause, with columns for the phase and the minutes
  of the pause.

### Areion Orbiter — Mission Operations Bulletin (P1.0 through P3.2)

Areion is a robotic Mars-orbiting science spacecraft operated by a
multi-institution flight team, carrying an imaging suite, a thermal
spectrometer, and a subsurface radar sounder. This bulletin covers every
science phase from P1.0 through P3.2, in the order flown, with one
exception noted below: the P2.4.1 contingency phase is listed after P1.6
in this document because it was reconstructed from an older recovery
branch and merged out of its normal chronological position in our
phase-tracking system. Readers reconstructing a strict timeline should
note that P2.4.1 actually flew between P1.4 and P1.5 in spacecraft-clock
time, but appears later in this document's ordering.

Each phase entry lists new science activities, downlink-pipeline fixes,
and any scheduled or cancelled safe-mode maintenance pauses associated
with that phase's operations. A "Mission Recap" section appears near the
end of this document, summarizing selected highlights already described in
earlier entries; it introduces no new information and should not be
treated as a source of new facts.

This bulletin is maintained by the flight-operations team and is published
alongside each phase transition to the public mission archive and to the
project's outreach dashboard. Internally, the team also maintains a more
detailed engineering log with command-level detail, but that log is not
distributed externally and is out of scope for this summary. Readers who
need to reconcile a specific data anomaly against a phase should use this
document as the authoritative public record of what shipped, what was
rolled back, and what maintenance pauses affected science collection
during each phase.

#### P1.0

Initial tracked phase for this bulletin's coverage window.

New activities: first mapping-orbit imaging swaths, initial thermal
spectrometer calibration passes, and a redesigned onboard scheduler with
saved observation templates.

Downlink-pipeline fixes: Fixed Downlink pipeline: telemetry frame decoder
crashing on empty science packets. Fixed a fault-protection trigger on
startup when the last-used sequence file had been purged. Fixed incorrect
timestamp tagging when the radar sounder wrote to a locked buffer.

Safe-mode maintenance pause: 40 minutes. This covered a checkout of the
newly commissioned mapping orbit and was completed without incident. The
pause was planned over several weeks by the navigation team, who
coordinated the maintenance window with the science team to ensure
principal investigators were notified at least 72 hours in advance through
the operations bulletin and the mission status page.

#### P1.1

New activities: introduced the downlink.cadence setting, default value 6
hours. This setting controls how frequently the spacecraft empties its
onboard science recorder to the ground during a pass, and it can be
adjusted by the operations team in the sequencing console under the
Downlink tab. The setting was added after several passes described lost
science frames following unexpected recorder overruns, and the
flight-operations team chose 6 hours as a conservative default balancing
recorder safety against downlink-station contention on a shared deep-space
network. Also introduced a new mosaic-stitching mode for wide-area imaging,
supporting up to sixteen independently registered image tiles per mosaic.

Downlink-pipeline fixes: Fixed Downlink pipeline: image product ignoring
custom compression setting. Fixed a memory leak when repeatedly opening and
closing the pass-planning panel. Fixed an incorrect command-sequence
conflict between "Duplicate Observation" and the ground system's abort
command on some consoles.

No scheduled maintenance this phase.

#### P1.2

New activities: added support for ingesting legacy .arn1 sequence files
from the discontinued Areion Pathfinder precursor mission. This was one of
the most-requested capabilities from the science team, filed by
investigators migrating from the older mission who had accumulated large
libraries of legacy sequences and needed a reliable path to bring their
work into the current tooling without manually recreating every command.
The ingest process preserves timing structure, instrument modes, and most
constraint parameters, though a small number of legacy modes with no
direct equivalent in the current tooling are flattened into generic
placeholders with a warning shown to the operator during ingest.

Downlink-pipeline fixes: Fixed Downlink pipeline: batch product generation
skipping locked buffers. Fixed a rendering artifact when zooming past 800%
on mosaics using the stitching mode introduced last phase. Fixed a fault
when undoing a product-merge operation immediately after a batch generation.

Safe-mode maintenance pause: 55 minutes. This covered a reaction-wheel
firmware update for the attitude-control subsystem used by the pointing
controller.

#### P1.3

New activities: added a new "Focus Track" mode that suppresses all
non-essential subsystems except the imager and a minimal housekeeping
channel.

Downlink-pipeline fixes: Fixed Downlink pipeline: radiometric product
producing incorrect calibration profile when the observation's reference
frame was set to a custom body-fixed frame. Fixed a fault when applying a
deconvolution pass to a thermal product with a variable integration time.
Fixed the pointing guides snapping to the wrong grid increment after
switching angular units mid-pass.

Settings: Changed downlink.cadence from 6 hours to 4 hours based on
science-team feedback about data loss on recorder overruns. Several
investigators reported losing more than one full pass of science after
unexpected overruns, and this change was made in direct response to that
feedback. The flight-operations team weighed the tradeoff between more
frequent downlinks and the small operational cost of scheduling recorder
dumps more often, and concluded that 4 hours was an acceptable middle
ground for most passes while the team continued to investigate the
underlying causes of the overruns being reported.

No scheduled maintenance this phase.

#### P1.4

New activities: added a symmetric-scan mode for the imaging pointing
controller, supporting up to eight-way radial coverage. Investigators
working on crater-survey and terrain-pattern campaigns had long requested
this capability, and the implementation allows the scan origin to be
repositioned mid-pass without discarding previously acquired swaths. The
capability also integrates with the existing mosaic-stitching mode,
allowing symmetric mosaics, though this combination surfaced the alignment
fault noted below when used on very wide swaths.

Downlink-pipeline fixes: Fixed Downlink pipeline: archive bundle corrupting
embedded ephemeris when the observation used more than one reference frame
in a single product. Fixed a fault when applying symmetric-scan mode to a
swath wider than 8000 kilometers of ground track. Fixed incorrect preview
generation for products saved from the new Focus Track mode.

No scheduled maintenance this phase.

#### P1.5

New activities: added customizable observation profiles with support for
operator-imported constraint packs. Teams can now import their own
constraint definitions in a portable format and assign them to any
observation, with controls for timing tolerance, jitter margin, and
priority blending against the base observation. A starter pack of twenty
profiles, contributed by science-team members during commissioning, ships
with the tooling by default.

Downlink-pipeline fixes: Fixed Downlink pipeline: product queue hanging on
network archives when the archive destination became unreachable mid-write.
Fixed a display issue in Focus Track mode. Fixed the symmetric-scan mode
introduced last phase producing misaligned swaths when the scan origin had
been manually recentered.

Safe-mode maintenance pause: 80 minutes. This covered a major service of
the high-gain antenna gimbal used by the primary downlink path, and passes
scheduled on that path experienced a brief collection interruption during
the window.

#### P1.6

New activities: added a new "Quick Product" panel providing one-click
generation presets for common data-product formats, including presets sized
for several partner archives' current ingest specifications. Teams can also
define and save their own custom presets, which persist across campaigns
and sync across consoles for operators signed into a project account.

Downlink-pipeline fixes: Fixed Downlink pipeline: transparent-overlay
product flattening quality layers incorrectly when the observation
contained nested region masks. Fixed a fault when duplicating a
symmetric-scan observation across an odd number of radial segments. Fixed
incorrect reference-frame embedding in the new Quick Product panel's presets.

Planned maintenance window (cancelled): 110 minutes. A planned upgrade to
the archive search index was scheduled for this phase but was cancelled
before it began, after an internal review determined the existing index was
performing within acceptable limits and the upgrade could be deferred. No
downtime occurred in connection with this phase.

#### P2.4.1 (contingency)

This contingency phase addresses a regression discovered shortly after
P1.4 flew and was executed between P1.4 and P1.5 in spacecraft-clock time,
though it is listed here, after P1.6, due to how it was merged into this
bulletin's tracking system from an older recovery branch.

Downlink-pipeline fixes: Fixed a regression in the symmetric-scan mode
(introduced in P1.4) that caused the pointing controller to stall when
symmetric-scan mode was combined with the mosaic-stitching mode on swaths
wider than 4000 kilometers of ground track.

Safe-mode maintenance pause: 30 minutes. A short contingency window was
taken to uplink this recovery patch to the flight-software staging area
ahead of the next scheduled phase.

#### P1.7

New activities: added a new "Batch Retag" utility for archived product
sequences, letting teams define a naming template with sequence numbers,
epoch stamps, and custom text fields, then apply it across an entire batch
of archived products in one operation. This was developed in response to
requests from partner archives ingesting large numbers of products for
downstream pipelines, where consistent, predictable product naming across
hundreds of archived frames is essential for automated ingest.

Downlink-pipeline fixes: Fixed Downlink pipeline: provenance stamp
misaligned on reprojected products when the product had been reprojected by
a non-multiple-of-90-degree rotation. Fixed a fault in the Batch Retag
utility when the naming pattern contained unsupported characters. Fixed the
Quick Product panel's presets resetting to default after a flight-software
update.

Settings: Changed downlink.cadence from 4 hours to 3 hours.

No scheduled maintenance this phase.

#### P1.8

New activities: added support for generating animated flyover sequences
directly from swath-based products, removing the need to round-trip through
a third-party visualization tool for simple orbit flyovers. The generator
supports configurable frame cadence, loop count, and an optional smoothing
mode for reducing stepping in gradient-heavy frames.

Downlink-pipeline fixes: Rolled back the P1.7 provenance-stamp fix for
reprojected products; it introduced a worse regression on multi-tile
products where every tile after the first would silently lose its
provenance stamp entirely, and the fix is no longer in effect as of this
phase. Fixed a fault when generating a flyover sequence containing more
than 200 frames. Fixed incorrect frame-timing metadata in generated flyover
files.

Safe-mode maintenance pause: 65 minutes. This covered a recalibration of the
star tracker used by the attitude-determination subsystem.

#### P1.9

New activities: added a dark-theme variant for the entire operations
console, including all panels and dialogs, plus a system-following option
that switches automatically based on the workstation's appearance setting.
A dark theme was the single most-requested item in the flight team's annual
tooling survey, and its rollout was coordinated with readability testing to
ensure sufficient contrast across every panel.

Downlink-pipeline fixes: Fixed Downlink pipeline: compressed product
applying double compression on regeneration when a previously generated
product was re-opened and regenerated again without modification. Fixed
dark-theme contrast issues in the scheduler's saved-templates panel. Fixed a
fault when toggling dark theme while a modal dialog was open.

Documentation update: clarified in the operator guide how the
downlink.cadence setting (currently 3 hours) affects station-time budgeting
on shared passes. No change to the setting's value; this was a wording
clarification in the operator guide's scheduling section only.

No scheduled maintenance this phase.

#### P3.0

New activities: introduced a new pass-history timeline panel showing a
visual scrubber through a phase's recorder-dump snapshots, letting operators
preview and restore any prior dump point without leaving the current
sequencing session. The panel builds directly on the downlink.cadence
setting introduced earlier in the mission, since more frequent downlinks
produce a denser and more useful history for this feature to draw on.

Downlink-pipeline fixes: Fixed a fault when opening the new pass-history
panel on a phase with more than 500 recorder-dump snapshots, which primarily
affected long-running campaigns that had been open continuously for many
days. Fixed incorrect snapshot previews in the pass-history panel for
products using custom reference frames, where previews were rendered using
the default body-fixed frame instead of the product's actual working frame.
Fixed a memory leak in the downlink-station relay client introduced in
P1.5's antenna service, which had gone unnoticed until several campaigns
reported gradually increasing memory usage during very long sequencing
sessions.

Safe-mode maintenance pause: 95 minutes. This covered a full migration of
the recorder-dump snapshot storage to a new backend designed to support the
new panel's scrubbing feature at scale. The migration was staged in three
phases across the maintenance window, with read-only access to existing
snapshots preserved throughout most of the window and only a brief final
cutover requiring a full collection pause.

#### P3.1

New activities: added support for custom console-shortcut profiles that can
be exported and shared between operators, useful for teams standardizing
shortcut layouts across a shift or for operators migrating from other
ground systems who want to replicate a familiar shortcut scheme. Profiles
are stored as a portable file format that can be version controlled
alongside other project configuration files.

Downlink-pipeline fixes: Fixed Downlink pipeline: generation presets not
persisting after console restart when the presets had been created in the
Quick Product panel. Fixed a conflict between custom console-shortcut
profiles and the workstation's accessibility shortcuts. Fixed the
pass-history timeline panel failing to load snapshots older than 30 days.

Settings: Changed downlink.cadence from 3 hours to 12 hours after operator
reports that frequent downlinks caused station-time contention during large
mapping campaigns on a shared network. The new default better balances
data-loss risk against station availability for most passes, though
operators working primarily on short targeted campaigns can still lower the
cadence back down in the sequencing console if they prefer more frequent
downlinks.

No scheduled maintenance this phase.

#### P3.2

New activities: added a new "Phase Compare" tool allowing side-by-side
visual comparison of two recorder-dump snapshots, with a synchronized zoom
and pan so operators can inspect the same region of the ground track across
both dumps simultaneously. This closes out the pass-history feature arc
that began earlier in the mission with the timeline panel, giving operators
a complete workflow for reviewing and restoring prior states of a sequence.

Downlink-pipeline fixes: Fixed a fault in the Phase Compare tool when
comparing snapshots of different swath sizes, which previously caused the
console to terminate unexpectedly rather than showing a graceful error
explaining that comparison across differently sized swaths is not yet
supported. Fixed incorrect zoom synchronization between the two panes of the
Phase Compare tool, where zooming one pane would sometimes apply the wrong
zoom factor to the other. Fixed a rendering artifact in Phase Compare when
one snapshot used dark theme and the other did not, which had caused the
light-theme snapshot's background to render with incorrect values in the
side-by-side view.

No scheduled maintenance this phase.

#### Mission Recap: Highlights from P1.0 through P3.2

This recap section summarizes selected highlights from the phases above for
readers who want a quick overview of the mission's progress. It does not
introduce any new fixes, activities, or settings changes beyond what is
described in the phase entries above.

Downlink reliability was a major theme this mission. Early on, the image
product compression-setting fix landed, and later the transparent-overlay
product flattening issue was resolved as well. On the settings side, the
downlink cadence was tuned more than once during the mission, most recently
landing at 12 hours after operators reported station-time contention on
large campaigns. The compressed-product double-compression issue was also
resolved, improving fidelity for teams who frequently regenerate the same
product.

Other notable highlights included the introduction of a dark theme across
the entire console, the new pass-history timeline panel with its snapshot
scrubber, and the Phase Compare tool that closed out the mission arc. The
team also thanks the science team for the feedback that shaped several of
this mission's settings changes and fix priorities.

Looking back, the flight-operations team is proudest of the steady cadence
maintained across all fourteen phases this mission, with no phase slipping
its planned start by more than a few days. The team also highlights the
high-gain antenna gimbal service, the recorder-dump snapshot storage
migration, and the star-tracker recalibration as examples of behind-the-scenes
maintenance work that kept the spacecraft reliable without requiring
outreach announcements beyond the standard operations bulletin. Looking
ahead to the next mission, the team plans to focus on performance
improvements for very large campaigns and continued refinement of the
downlink-scheduling experience introduced in earlier phases. Thank you to
every investigator who filed an anomaly report, posted on the science-team
board, or participated in commissioning this mission — this bulletin would
be far shorter without your help finding and describing these issues clearly.

## Questions

- **Question A**: How many Downlink-pipeline fixes are in effect as of
  P3.2 — that is, shipped and not subsequently rolled back?
- **Question B**: What is the total completed safe-mode maintenance-pause
  time, in minutes, across all phases?
- **Question C**: List, in order, every phase in which the value of the
  `downlink.cadence` setting changed from a previous value. (A phase that
  merely introduces the setting for the first time, or that mentions it
  without changing its value, does not count.)

## Deliverables

- `TALLY.md` containing, in order: an `A:` line, a `B:` line, a `C:` line,
  an `Excluded:` line, and a markdown table of completed safe-mode
  maintenance-pause time by phase.

## Constraints

- `TALLY.md`'s markdown table must include one row per phase that reported
  a *completed* safe-mode maintenance pause (do not include phases with no
  scheduled maintenance, and do not include the cancelled window), and its
  minutes column must sum to your stated `B:` total.
- The `Excluded:` line must name every item you left out of your counts and
  state why, so a reader can audit your work without re-reading the whole
  bulletin.
