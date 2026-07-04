---
id: context-09-variable-tracking
category: long-context
title: Variable-tracking chain resolution through filler
deliverables:
  - TRACE.md
---

## Task

Below is a fictional narrative describing a survey team's use of a set
of sealed "lockbox" registers during an expedition into the Verrent
Hollow, a fictional cave system. Each lockbox is identified by a single
letter and holds a numeric value that is assigned and reassigned over
the course of the story. Every assignment is stated explicitly in
plain prose, always as either a literal number written into the
lockbox, or an explicit snapshot copy of the value another lockbox
holds *at that moment* (never a live link — once copied, a value does
not change again unless the lockbox is explicitly reassigned).

Read the narrative carefully and trace the value each relevant lockbox
holds at each point, then report the FINAL values (at the end of the
story) of lockboxes `t`, `r`, and `q` in `TRACE.md`, as three labeled
lines: a `t:` line, an `r:` line, and a `q:` line, each holding only
the final numeric value.

### The Verrent Hollow Expedition

The survey team's first descent into the Verrent Hollow began on a
grey morning in the town of Ashcombe Mire, where the expedition had
spent three days provisioning at the local outfitter's shop. The lead
surveyor, a methodical woman named Odalys Fenn, had spent the previous
winter mapping the Hollow's entrance shaft from old mining-company
surveys, none of which agreed with each other on the shaft's true
depth. She had brought with her a case of sealed lockbox registers,
each a small brass cylinder with a hand-turned dial, used by the
expedition's cartographer to record running tallies during the
descent — depths, rope lengths, air-quality readings — whatever needed
tracking without relying on memory in the dark.

The three days of provisioning had themselves been unremarkable, spent
mostly checking rope for wear, testing the team's headlamps against a
spare battery supply, and negotiating with the outfitter over the
price of a replacement harness after Bertrand's old one had finally
frayed past the point he trusted it. The outfitter, a weathered man
who had supplied gear to most of the expeditions that came through
Ashcombe Mire over the past two decades, warned them again about the
Hollow's reputation for disagreement among its surveyors, joking that
no two maps of the place had ever matched and he doubted theirs would
either. Odalys took the joke in good humor but privately hoped this
expedition's survey, anchored as it was by the sealed lockbox readings
rather than memory or hasty field notes, might finally produce
something more reliable than what had come before. Ines, newer to
these expeditions than either Bertrand or Odalys, spent much of the
three days simply absorbing as much as she could about the Hollow's
history from anyone in town willing to talk about it, filling a
notebook of her own with rumors and half-remembered stories that had
nothing to do with the actual survey work ahead.

On the morning of the descent itself, the weather forecast had called
for a dry day, which made the drizzle that greeted them at the trailhead
a mild disappointment. The team loaded their packs at the shaft
entrance under a canvas awning borrowed from the outfitter, checking
each other's harnesses twice before committing to the first rappel, a
habit Odalys insisted on regardless of how routine the first section of
any descent might seem. Bertrand handled the rope rigging at the
entrance personally, a task he'd performed on enough expeditions that
he barely needed to look at his hands while doing it, while Ines
double-checked the packing list one final time against the gear
actually loaded into each pack.

At the mouth of the shaft, before the ropes were even rigged, the
cartographer set lockbox `p` to hold the value 4. This was the
expedition's baseline reading — the number of support anchors the team
had counted at the surface staging area, a small but important tally
since each anchor would need to be checked again on the way back up.
Odalys noted the number in her logbook alongside the date and the
weather, which had turned to a light drizzle by midmorning.

Shortly after, at the first rigging point some twenty meters down the
shaft, the team set lockbox `q` to hold the value lockbox `p` held at
that point. Lockbox `p` still held 4, so lockbox `q` now held 4 as
well — a snapshot, taken and sealed, of the anchor count as it stood
at that moment. The cartographer remarked that this snapshot would let
them compare the anchor count at the first rigging point against
whatever the count became later, since more anchors were expected to
be added as the descent continued and additional rigging points were
established deeper in the shaft.

The descent continued for several more hours. The shaft narrowed
considerably below the second rigging point, forcing the team to pass
their packs hand over hand through a constriction barely wide enough
for a person turned sideways. Two members of the support team, a quiet
man named Bertrand Oyelaran and a younger surveyor named Ines Calloway,
took turns describing the rock formations they passed for the
expedition's photographic log, since the camera's flash was proving
unreliable in the humid air and many shots would need to be
rediscovered by description alone later. A separate lockbox, `m`, was
set to hold the value 12 around this time — a count of rope
carabiners issued to the descent team — but this tally was never
revisited again for the remainder of the expedition, and no later
lockbox ever copies from `m`.

Once the team reached the second rigging point, roughly sixty meters
below the surface, the anchor count was updated: lockbox `p` was
reassigned to hold the value 9, reflecting the additional anchors
placed at both rigging points combined. This reassignment did not
change what lockbox `q` held — `q` had already taken its snapshot of
`p`'s earlier value back at the first rigging point, and a snapshot,
once sealed, does not follow later changes to the lockbox it was
copied from. Lockbox `q` therefore still held 4, even though `p` now
held 9.

The team paused here for a meal and to check the humidity readings on
a separate instrument unrelated to the lockboxes. Ines Calloway
recorded the ambient temperature at 14 degrees, colder than the
surface by a wide margin, and Bertrand noted that the drip rate from
the ceiling had increased noticeably since their descent began,
suggesting they were nearing a section of the cave with active water
flow somewhere above. Odalys cross-referenced this with the old
mining-company surveys, which mentioned a "weeping gallery" at
approximately this depth, though none of the surveys agreed on exactly
how far below the second rigging point that gallery actually was.

At this same rest stop, the cartographer set lockbox `r` to hold the
value lockbox `q` held at that point. Since `q` held 4, lockbox `r`
now held 4 as well — another snapshot, taken at the rest stop, of the
anchor-count value as `q` held it, which was itself a snapshot from
much earlier at the first rigging point. Odalys remarked, half in
jest, that the lockboxes were starting to resemble a chain of relayed
messages, each one only as current as the moment it was sealed.

The descent resumed after the meal break. The passage beyond the rest
stop dropped steeply, and the team rigged a second rope line to
supplement the first, a precaution Odalys insisted on after the old
surveys' disagreement about the gallery's exact position made her
wary of an unexpected drop. Bertrand went first, testing each foothold
before committing his weight, while Ines followed with the equipment
bag slung across her back. The passage was narrow enough in places
that conversation became difficult, and the team fell into a rhythm of
hand signals rather than shouted instructions.

Roughly forty minutes later, at a point the team had started calling
the "second landing," the anchor count was updated again: lockbox `s`
was set to hold the value lockbox `p` held at that point. Lockbox `p`
still held 9 (it had not been reassigned again since the second
rigging point), so lockbox `s` now held 9. The cartographer noted this
in the logbook as the "post-landing anchor snapshot," distinguishing
it from the earlier snapshots taken at the first rigging point and the
rest stop.

The team spent a considerable amount of time at the second landing,
partly because the passage beyond it forked in two directions, and
Odalys wanted to survey a short distance down each fork before
committing the whole team to one route. She and Bertrand took the
left fork, which narrowed quickly into a crawl too tight for the
equipment bags, while Ines stayed at the landing to keep the lockbox
log current and to monitor the rope tension for the two exploring the
fork. The left fork, it turned out, ended in a small chamber with no
further passage, and Odalys and Bertrand returned after perhaps twenty
minutes, reporting nothing of note beyond some old flowstone formations
and a scatter of what looked like decades-old surveying tape, a relic
of one of the earlier mining-company expeditions whose survey had
disagreed with all the others.

While Odalys and Bertrand were exploring the left fork, Ines used the
time to reorganize the equipment bag and re-coil a section of rope
that had become tangled during the descent. She also recorded a
separate, unrelated tally in a new lockbox, `n`, setting it to hold
the value 7, representing a count of unused rope stakes remaining in
the bag. Like lockbox `m` earlier, this tally was never revisited
again, and no later lockbox copies from `n` either. The expedition's
logbook would later note that lockboxes `m` and `n` were "bookkeeping
dead ends" — useful in the moment, but not part of the anchor-count
chain that the cartographer was building through lockboxes `p`, `q`,
`r`, `s`, and eventually `t`.

Ines passed some of the waiting time examining the tape left behind by
the earlier mining-company expedition, turning the brittle roll over
in her hands and trying to guess its age from the fading of its
printed markings. She found no date on it, only a faint stenciled
company name she didn't recognize, one of several defunct outfits that
had apparently tried and failed to fully chart the Hollow over the
decades. She mentioned it to Odalys when the pair returned from the
left fork, and Odalys said she'd seen the same company's name on one of
the three disagreeing old surveys, though she couldn't recall which one
without checking her notes back at the surface. Bertrand, only half
listening, was more interested in whether the flowstone in the small
dead-end chamber might be worth a longer look on a future trip, purely
for its own sake rather than for any surveying value, and he sketched a
rough note to that effect in the margin of his own field notebook,
entirely separate from the cartographer's lockbox log.

The three of them spent a few more minutes deciding how best to mark
the left fork's dead end for any future expedition that might pass this
way, eventually settling on a small cairn of loose stones just inside
the passage mouth, a low-tech solution Odalys preferred over the
reflective tape markers some other survey teams used, on the grounds
that tape degraded in the humidity while stacked stone did not.
Bertrand grumbled good-naturedly that a cairn was also invisible in
poor light, but built one anyway, three stones high, while Ines
finished re-coiling the tangled rope section and checked that all four
of the anchor points placed so far were still holding tension properly,
a physical check unrelated to any lockbox reading and not itself
recorded anywhere in the log.

With both forks now explored and the right fork chosen as the route
forward, the team regrouped and pressed on. The right fork descended
more gently than the left had climbed, opening after a while into a
wider gallery where the drip Bertrand had noticed earlier became a
thin, steady trickle running down one wall into a shallow pool. Odalys
suspected this was the "weeping gallery" the old surveys had
mentioned, though she noted in her log that its position relative to
the second rigging point did not match any of the three disagreeing
survey estimates particularly well, which she found more amusing than
concerning at this point in the expedition.

The team rested briefly at the edge of the pool, refilling water
bottles from a separate, tested source rather than the pool itself,
and Ines used the pause to sketch the gallery's rough dimensions for
the expedition's map. Bertrand busied himself checking the group's
remaining rope length against the distance they expected still to
travel, a calculation that had nothing to do with the anchor-count
lockboxes and did not touch any of `p`, `q`, `r`, `s`, `t`, `m`, or `n`.
Odalys, meanwhile, reviewed her notes on the old mining surveys once
more, still turning over the discrepancy in the weeping gallery's
position, though she eventually set the question aside, reasoning that
the expedition's own survey would settle it more reliably than three
old documents that could not agree among themselves.

After the rest at the weeping gallery, the team continued deeper,
descending a series of short, awkward drops that required careful
rope work but no further rigging changes. The passage here was
noticeably drier than the gallery above, and the drip sound faded
behind them within a few minutes of continued descent. Ines commented
that the change in acoustics alone told her they had left the weeping
gallery's influence behind, well before Odalys confirmed it against
her instruments.

It was during this stretch, well past the weeping gallery and with the
second landing now a considerable distance behind the team, that the
cartographer set lockbox `t` to hold the value lockbox `r` held at
that point. Lockbox `r` held 4 — it had not been reassigned since the
rest stop, where it had taken its snapshot of `q`'s then-current value
of 4. So lockbox `t` now held 4, a snapshot sealed at this point in the
descent and never to be revisited by any later reassignment. Odalys
noted this in the log simply as "t taken from r," without further
comment, since by this point in the expedition the anchor-count chain
had become routine bookkeeping rather than anything requiring
discussion.

The team continued their descent for what felt like a long stretch of
uneventful, careful progress. The passage widened gradually, and the
rock underfoot changed character from the slick flowstone near the
gallery to a drier, grittier surface that gave better footing. Bertrand
took the lead again, calling out foothold conditions to Ines, who
relayed them back to Odalys bringing up the rear with the last of the
equipment. Nobody spoke of the lockboxes during this stretch; the
conversation instead turned to speculation about how much further the
passage might run before opening into whatever chamber the old surveys
had hinted might lie at the bottom, though as before, the three old
surveys disagreed sharply on both the distance and the nature of that
final chamber, if it existed at all.

Ines mentioned that her boots had started to let in water somewhere
during the crawl through the left-fork detour, and Bertrand offered a
spare pair of socks from his own pack, a small kindness that briefly
lightened the mood. Odalys, walking last, found herself thinking about
how many expeditions before theirs had turned back at exactly this
kind of unremarkable, tiring stretch — not because of any dramatic
obstacle, but simply because the accumulated fatigue of hours
underground made every additional meter feel heavier than the last.
She resolved not to let that happen to this expedition, at least not
without a clearer reason than tiredness alone.

To pass the time during the long, uneventful stretch, Bertrand began
recounting an old story about a previous expedition he had taken part
in years earlier, in an entirely different cave system on the far side
of the country, where a similar chain of hand-tallied counts had once
caused a minor argument between two surveyors who disagreed about
whether a rope had been recoiled once or twice. Ines found the story
more amusing than instructive, since none of it involved lockboxes at
all, only a disputed memory neither surveyor could resolve without a
written record, which Bertrand offered as his reason for trusting
Odalys's insistence on sealed, written snapshots over anyone's
recollection. Odalys, still bringing up the rear, laughed and admitted
that the story was likely exaggerated in Bertrand's retelling, as most
of his cave stories tended to be, but agreed with the underlying point
regardless.

The conversation drifted afterward to lighter subjects entirely: the
meal they planned to have once back at the surface, a running
disagreement between Bertrand and Ines about the best route back to
Ashcombe Mire from the trailhead, and a brief, half-serious debate about
whether the drizzle from the morning would have turned to full rain by
the time they emerged. None of this touched the lockbox log in any way,
and the cartographer made no entries during this stretch of the
descent, the log remaining exactly as it had been left after `t` took
its snapshot from `r` some time before.

The passage eventually leveled out at what the team began calling the
"long gallery," a relatively straight, walkable stretch that ran, by
Bertrand's rough pacing count, for perhaps three hundred meters before
bending out of sight. It was here, well after `t` had already taken its
snapshot from `r`, that the anchor count changed one more time.
Reviewing her notes at the entrance to the long gallery, Odalys
realized that two additional anchors had in fact been placed back at
the second landing, during the fork exploration, that had not yet been
logged into the running count. To correct this, the cartographer set
lockbox `q` to hold the value lockbox `s` held at that point. Lockbox
`s` held 9 — its snapshot of `p` taken at the second landing — so
lockbox `q` was now reassigned to hold 9, replacing its earlier value
of 4. This was a genuine reassignment of `q`, not a new lockbox; the
cartographer was explicit in the log that "q now holds what s holds,
overwriting q's earlier reading."

The team pressed on through the long gallery, which lived up to its
name by taking nearly forty minutes to traverse even at a comfortable
walking pace. Ines used the flat, easy stretch to recount the group's
remaining food rations, a tally that had nothing to do with any
lockbox, while Bertrand occupied himself by counting his own paces
against Odalys's earlier rough estimate, eventually confirming her
figure of roughly three hundred meters to within what he considered a
reasonable margin of error for pacing alone. Odalys, for her part, used
the walk to sketch a cleaner version of the gallery's shape than she
had managed at the weeping pool earlier, wanting to make sure the
expedition's final map would not simply repeat the disagreements of
the old mining surveys.

Near the far end of the long gallery, with the passage beginning to
narrow again and the air growing noticeably cooler, the cartographer
made the final lockbox change of the expedition. Lockbox `r` was
reassigned to hold the value lockbox `q` held at that point. Lockbox
`q` now held 9 — its value after the correction made back at the
entrance to the long gallery — so lockbox `r` was reassigned to hold
9, replacing its earlier value of 4. The cartographer's log entry read,
in full: "r reassigned, now takes q's current reading of 9, superseding
r's earlier value." No lockbox was touched again for the remainder of
the expedition.

The team reached their planned turnaround point shortly afterward, a
low chamber where the passage split into several narrow leads too
tight to explore without specialized equipment they had not brought on
this trip. Odalys declared the descent a success regardless, noting in
her final log entry that the expedition had reached a depth well beyond
what any of the three old mining surveys had described with any
confidence, and that the running anchor-count lockboxes, whatever their
quirks, had at least given the team a reliable way to track a number
that mattered without relying on memory after a long day underground.
No lockbox was reassigned again after the long gallery, and the
readings stood exactly where the last change had left each of them for
the remainder of the descent and the ascent that followed.

The turnaround chamber itself was smaller than any of the galleries
they had passed through, its ceiling low enough that Bertrand had to
duck in places, and its several narrow leads disappeared into
darkness that the team's headlamps couldn't fully penetrate. Odalys
spent a few minutes photographing the leads for a future expedition's
benefit, noting their approximate compass headings in her field
notebook rather than in any lockbox, since these were exploratory notes
rather than confirmed tallies. Ines used the pause to eat the last of
her rations for the descent, saving nothing for the ascent on the
theory that the climb back up would go faster than the way down had,
while Bertrand double-checked the rope anchors one final time before
the team began its return.

The ascent, as expected, was faster than the descent had been, since
the route was now familiar and the team no longer paused to survey or
debate which fork to take. They passed the long gallery, the weeping
gallery, the second landing, and the rest stop each in turn, checking
the anchors installed at each rigging point along the way but making no
further lockbox entries at any of them. Conversation on the way up
turned mostly to plans for the following season's expedition, which
Odalys hoped might finally push past the turnaround chamber's narrow
leads with the right specialized equipment, assuming funding could be
arranged before the next survey window opened. The team emerged at
Ashcombe Mire well after dark, tired but satisfied, with the lockbox
log closed out for the day and left for Odalys to transcribe properly
once everyone had eaten and dried off.

## Deliverables

- `TRACE.md` containing exactly three labeled lines, in this order: a
  `t:` line, an `r:` line, and a `q:` line, each holding only the final
  numeric value of that lockbox.

## Constraints

- Report the value each lockbox holds at the very end of the
  expedition, after every assignment described in the narrative.
- Do not include lockboxes `p`, `s`, `m`, or `n` in `TRACE.md`.
- `TRACE.md` must contain no lines beyond the three requested.
