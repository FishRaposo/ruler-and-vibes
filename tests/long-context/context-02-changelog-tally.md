---
id: context-02-changelog-tally
category: long-context
title: Cross-version aggregation over a changelog
deliverables:
  - TALLY.md
---

## Task

Below is a changelog for "Lumenfall Studio," a desktop design tool,
covering releases v2.0 through v3.2. Read it carefully — some of the
information needed to answer the questions below is scattered across
multiple entries, and one entry is listed out of chronological order.
Produce `TALLY.md` containing exactly these labeled lines and a table, in
this order:

- An `A:` line answering Question A.
- A `B:` line answering Question B.
- A `C:` line answering Question C.
- An `Excluded:` line naming every item you excluded from your counts and
  why.
- A markdown table with one row per release that reported completed
  scheduled-maintenance downtime, with columns for the version and the
  minutes of downtime.

### Lumenfall Studio — Changelog (v2.0 through v3.2)

Lumenfall Studio is a desktop design tool for vector and raster
illustration, used primarily by independent designers and small studios.
This changelog covers every release from v2.0 through v3.2, in the order
released, with one exception noted below: the v2.4.1 hotfix is listed
after v2.6 in this document because it was cherry-picked from an older
branch and merged out of its normal chronological position in our
release-tracking system. Readers reconstructing a strict timeline should
note that v2.4.1 was actually released between v2.4 and v2.5 in wall-clock
time, but appears later in this document's ordering.

Each release entry lists new features, bug fixes, and any scheduled or
cancelled maintenance windows associated with that release's rollout. A
"Year in Review" recap section appears near the end of this document,
summarizing selected highlights already described in earlier entries; it
introduces no new information and should not be treated as a source of
new facts.

This changelog is maintained by the release-engineering team and is
published alongside each release to the public changelog archive and to
the in-app "What's New" panel. Internally, the team also maintains a more
detailed engineering changelog with commit-level detail, but that
document is not distributed externally and is out of scope for this
summary. Readers who need to reconcile a specific customer-reported issue
against a release should use this document as the authoritative public
record of what shipped, what was reverted, and what maintenance windows
affected service availability during each release's rollout.

#### v2.0

Initial tracked release for this changelog's coverage window.

New features: canvas rulers and guides, basic layer grouping, a redesigned
color picker with saved swatches.

Bug fixes: Fixed Export module: SVG export crashing on empty layers. Fixed
a crash on startup when the last-used template file had been deleted. Fixed
incorrect cursor icon when using the eyedropper tool over a locked layer.

Scheduled maintenance downtime: 60 minutes. This covered a migration of
the license-verification backend to new infrastructure and was completed
without incident. The migration was planned over several weeks by the
infrastructure team, who coordinated the maintenance window with the
support team to ensure customers were notified at least 72 hours in
advance through the in-app notification banner and the status page.

#### v2.1

New features: introduced the autosave.interval setting, default value 5
minutes. This setting controls how frequently the application silently
saves an in-progress document to a recovery file, and it can be adjusted
by the user in the Preferences dialog under the General tab. The setting
was added after several support tickets described lost work following
unexpected application crashes, and the release-engineering team chose 5
minutes as a conservative default balancing recovery safety against disk
write frequency on lower-end hardware. Also introduced a new gradient-mesh
tool for advanced raster blending, supporting up to sixteen independently
colored mesh points per object.

Bug fixes: Fixed Export module: PNG export ignoring custom DPI setting.
Fixed a memory leak when repeatedly opening and closing the brush-preset
panel. Fixed incorrect keyboard shortcut conflict between "Duplicate
Layer" and the operating system's screenshot shortcut on some platforms.

No scheduled maintenance this release.

#### v2.2

New features: added support for importing legacy .lfp2 project files from
the discontinued Lumenfall Classic product line. This was one of the
most-requested features on the community forum, filed by users migrating
from the older product who had accumulated large libraries of legacy
project files and needed a reliable path to bring their work into the
current application without manually recreating every layer and effect.
The import process preserves layer structure, blend modes, and most
effect parameters, though a small number of legacy effects with no direct
equivalent in the current tool are flattened into raster layers with a
warning shown to the user during import.

Bug fixes: Fixed Export module: batch export skipping locked layers. Fixed
a rendering artifact when zooming past 800% on documents using the
gradient-mesh tool introduced last release. Fixed a crash when undoing a
layer-merge operation immediately after a batch export.

Scheduled maintenance downtime: 45 minutes. This covered a database index
rebuild for the cloud asset library used by the stock-image browser
panel.

#### v2.3

New features: added a new "Focus Mode" that hides all panels except the
canvas and a minimal toolbar.

Bug fixes: Fixed Export module: CMYK export producing incorrect color
profile when the document's working color space was set to a custom ICC
profile. Fixed a crash when applying a drop-shadow effect to a text layer
with a variable font. Fixed the ruler guides snapping to the wrong grid
increment after switching measurement units mid-session.

Settings: Changed autosave.interval from 5 minutes to 3 minutes based on
user feedback about data loss on crashes. Several users on the community
forum reported losing more than five minutes of work after unexpected
crashes, and this change was made in direct response to that feedback.
The release-engineering team weighed the tradeoff between more frequent
autosaving and the small performance cost of writing recovery files more
often, and concluded that 3 minutes was an acceptable middle ground for
most users while the team continued to investigate the underlying causes
of the crashes being reported.

No scheduled maintenance this release.

#### v2.4

New features: added a symmetry-drawing mode for the vector pen tool,
supporting up to eight-way radial symmetry. Illustrators working on
mandala-style and pattern-based artwork had long requested this feature,
and the implementation allows the symmetry origin to be repositioned
mid-drawing without losing previously drawn strokes. The feature also
integrates with the existing gradient-mesh tool, allowing symmetric
gradient fills, though this combination surfaced the alignment bug noted
below when used on very large canvases.

Bug fixes: Fixed Export module: PDF export corrupting embedded fonts when
the document used more than one font family in a single text layer. Fixed
a crash when applying symmetry mode to a canvas larger than 8000 pixels on
either axis. Fixed incorrect thumbnail generation for documents saved from
the new Focus Mode.

No scheduled maintenance this release.

#### v2.5

New features: added customizable brush textures with support for
user-imported texture packs. Users can now import their own texture
images in PNG or TIFF format and assign them to any brush, with controls
for texture scale, rotation jitter, and opacity blending against the base
brush stroke. A starter pack of twenty textures, contributed by community
artists during the beta program, ships with the application by default.

Bug fixes: Fixed Export module: export queue hanging on network drives
when the export destination became unreachable mid-export. Fixed a
tooltip rendering issue in Focus Mode. Fixed the symmetry-drawing mode
introduced last release producing misaligned strokes when the canvas
origin had been manually recentered.

Scheduled maintenance downtime: 90 minutes. This covered a major upgrade
of the collaborative-editing relay servers used by the real-time
co-editing feature, and users of that feature experienced a brief service
interruption during the window.

#### v2.6

New features: added a new "Quick Export" panel providing one-click export
presets for common social-media image sizes, including presets sized for
several popular platforms' current image and story dimensions. Users can
also define and save their own custom presets, which persist across
projects and sync across devices for users signed into a Lumenfall
account.

Bug fixes: Fixed Export module: transparent-background PNG export
flattening alpha channels incorrectly when the document contained nested
clipping masks. Fixed a crash when duplicating a symmetry-mode brush
stroke across an odd number of radial segments. Fixed incorrect
color-profile embedding in the new Quick Export panel's presets.

Planned maintenance window (cancelled): 120 minutes. A planned upgrade
to the asset-library search index was scheduled for this release but was
cancelled before it began, after an internal review determined the
existing index was performing within acceptable limits and the upgrade
could be deferred. No downtime occurred in connection with this release.

#### v2.4.1 (hotfix)

This hotfix release addresses a regression discovered shortly after v2.4
shipped and was released between v2.4 and v2.5 in wall-clock time, though
it is listed here, after v2.6, due to how it was merged into this
changelog's tracking system from an older maintenance branch.

Bug fixes: Fixed a regression in the symmetry-drawing mode (introduced in
v2.4) that caused the application to freeze when symmetry mode was
combined with the gradient-mesh tool on canvases larger than 4000 pixels.

Scheduled maintenance downtime: 25 minutes. A short emergency window was
taken to roll out this hotfix to the update-distribution servers ahead of
the next scheduled release.

#### v2.7

New features: added a new "Batch Rename" utility for exported file
sequences, letting users define a naming template with sequence numbers,
date stamps, and custom text fields, then apply it across an entire batch
of exported files in one operation. This was developed in response to
requests from studios exporting large numbers of assets for game
development pipelines, where consistent, predictable file naming across
hundreds of exported frames is essential for downstream tooling.

Bug fixes: Fixed Export module: watermark overlay misaligned on rotated
canvases when the canvas had been rotated by a non-multiple-of-90-degree
angle. Fixed a crash in the Batch Rename utility when the naming pattern
contained unsupported characters. Fixed the Quick Export panel's presets
resetting to default after an application update.

Settings: Changed autosave.interval from 3 minutes to 2 minutes.

No scheduled maintenance this release.

#### v2.8

New features: added support for exporting animated GIF sequences directly
from frame-based artboards, removing the need to round-trip through a
third-party animation tool for simple looping animations. The exporter
supports configurable frame delay, loop count, and an optional
dithering mode for reducing banding in gradient-heavy frames.

Bug fixes: Reverted the v2.7 watermark overlay fix for rotated canvases;
it introduced a worse regression on multi-page documents where every page
after the first would silently lose its watermark entirely, and the fix
is no longer in effect as of this release. Fixed a crash when exporting an
animated GIF sequence containing more than 200 frames. Fixed incorrect
frame-timing metadata in exported GIF files.

Scheduled maintenance downtime: 75 minutes. This covered a certificate
rotation for the application's auto-update signing infrastructure.

#### v2.9

New features: added a dark-mode variant for the entire application
interface, including all panels and dialogs, plus a system-following
option that switches automatically based on the operating system's
appearance setting. Dark mode was the single most-requested feature in
the company's annual user survey, and its rollout was coordinated with
accessibility testing to ensure sufficient contrast across every panel.

Bug fixes: Fixed Export module: JPEG export applying double compression on
re-export when a previously exported JPEG was re-opened and exported
again without modification. Fixed dark-mode contrast issues in the color
picker's saved-swatches panel. Fixed a crash when toggling dark mode while
a modal dialog was open.

Documentation update: clarified in the user guide how the autosave.interval
setting (currently 2 minutes) affects battery usage on laptops. No change
to the setting's value; this was a wording clarification in the user
guide's power-management section only.

No scheduled maintenance this release.

#### v3.0

New features: introduced a new document-history timeline panel showing a
visual scrubber through a document's autosave snapshots, letting users
preview and restore any prior autosave point without leaving the current
document. The panel builds directly on the autosave.interval setting
introduced earlier in the year, since more frequent autosaving produces a
denser and more useful history for this feature to draw on.

Bug fixes: Fixed a crash when opening the new document-history panel on a
document with more than 500 autosave snapshots, which primarily affected
long-running projects that had been open continuously for many days.
Fixed incorrect snapshot thumbnails in the document-history panel for
documents using custom color profiles, where thumbnails were rendered
using the default sRGB profile instead of the document's actual working
profile. Fixed a memory leak in the real-time co-editing relay client
introduced in v2.5's server upgrade, which had gone unnoticed until
several studios reported gradually increasing memory usage during very
long collaborative editing sessions.

Scheduled maintenance downtime: 90 minutes. This covered a full migration
of the document-history snapshot storage to a new backend designed to
support the new panel's scrubbing feature at scale. The migration was
staged in three phases across the maintenance window, with read-only
access to existing snapshots preserved throughout most of the window and
only a brief final cutover requiring a full service pause.

#### v3.1

New features: added support for custom keyboard shortcut profiles that
can be exported and shared between team members, useful for studios
standardizing shortcut layouts across a team or for users migrating from
other design tools who want to replicate a familiar shortcut scheme.
Profiles are stored as a portable file format that can be version
controlled alongside other studio configuration files.

Bug fixes: Fixed Export module: export presets not persisting after app
restart when the presets had been created in the Quick Export panel.
Fixed a conflict between custom keyboard shortcut profiles and the
operating system's accessibility shortcuts. Fixed the document-history
timeline panel failing to load snapshots older than 30 days.

Settings: Changed autosave.interval from 2 minutes to 10 minutes after
user reports that frequent autosaving caused stutter during large-canvas
edits on lower-end hardware. The new default better balances data-loss
risk against editing responsiveness for most users, though power users
working primarily on smaller documents can still lower the interval back
down in Preferences if they prefer more frequent autosaving.

No scheduled maintenance this release.

#### v3.2

New features: added a new "Version Compare" tool allowing side-by-side
visual comparison of two autosave snapshots, with a synchronized zoom and
pan so users can inspect the same region of the canvas across both
versions simultaneously. This closes out the document-history feature
arc that began earlier in the year with the timeline panel, giving users
a complete workflow for reviewing and restoring prior states of a
document.

Bug fixes: Fixed a crash in the Version Compare tool when comparing
snapshots of different canvas sizes, which previously caused the
application to terminate unexpectedly rather than showing a graceful
error explaining that comparison across differently sized canvases is
not yet supported. Fixed incorrect zoom synchronization between the two
panes of the Version Compare tool, where zooming one pane would sometimes
apply the wrong zoom factor to the other. Fixed a rendering artifact in
Version Compare when one snapshot used dark mode and the other did not,
which had caused the light-mode snapshot's canvas background to render
with incorrect color values in the side-by-side view.

No scheduled maintenance this release.

#### Year in Review: Highlights from v2.0 through v3.2

This recap section summarizes selected highlights from the releases
above for readers who want a quick overview of the year's progress. It
does not introduce any new fixes, features, or settings changes beyond
what is described in the version entries above.

Export reliability was a major theme this year. Early in the year, the
PNG export DPI-setting bug was fixed, and later the transparent-background
PNG flattening issue was resolved as well. On the settings side, the
autosave interval was tuned more than once during the year, most recently
landing at 10 minutes after users reported stutter on large canvases. The
JPEG double-compression issue was also resolved, improving fidelity for
users who frequently re-export the same asset.

Other notable highlights included the introduction of dark mode across
the entire interface, the new document-history timeline panel with its
snapshot scrubber, and the Version Compare tool that closed out the year.
The team also thanks the community forum for the feedback that shaped
several of this year's settings changes and bug-fix priorities.

Looking back, the release-engineering team is proudest of the steady
cadence maintained across all fourteen releases this year, with no
release slipping its planned date by more than a few days. The team also
highlights the collaborative-editing relay upgrade, the document-history
snapshot storage migration, and the certificate rotation for the
auto-update signing infrastructure as examples of behind-the-scenes
maintenance work that kept the product reliable without requiring
customer-facing announcements beyond the standard release notes. Looking
ahead to next year, the team plans to focus on performance improvements
for very large documents and continued refinement of the collaborative
co-editing experience introduced in earlier releases. Thank you to every
user who filed a bug report, posted on the community forum, or
participated in the beta program this year — this changelog would be far
shorter without your help finding and describing these issues clearly.

## Questions

- **Question A**: How many Export-module bug fixes are in effect as of
  v3.2 — that is, shipped and not subsequently reverted?
- **Question B**: What is the total completed scheduled-maintenance
  downtime, in minutes, across all releases?
- **Question C**: List, in order, every version in which the value of
  the `autosave.interval` setting changed from a previous value. (A
  version that merely introduces the setting for the first time, or
  that mentions it without changing its value, does not count.)

## Deliverables

- `TALLY.md` containing, in order: an `A:` line, a `B:` line, a `C:`
  line, an `Excluded:` line, and a markdown table of completed
  scheduled-maintenance downtime by version.

## Constraints

- `TALLY.md`'s markdown table must include one row per release that
  reported *completed* scheduled-maintenance downtime (do not include
  releases with no scheduled maintenance, and do not include the
  cancelled window), and its minutes column must sum to your stated `B:`
  total.
- The `Excluded:` line must name every item you left out of your counts
  and state why, so a reader can audit your work without re-reading the
  whole changelog.
