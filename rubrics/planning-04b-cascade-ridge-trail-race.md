---
test: planning-04b-cascade-ridge-trail-race
canary: "suni dikdik"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md identifies the dependency cycle and names all three tasks in it: R4 (Order finish-line arches), R5 (Assemble arch trusses), R8 (Install timing mats)"
    - id: obj-2
      check: "AUDIT.md flags the resource double-booking, naming owner Farrah and both conflicting tasks R9 (Print race-day maps) and R10 (Place mile-marker signage)"
    - id: obj-3
      check: "AUDIT.md identifies the date-arithmetic error on R11 (Rehearse starting-line announcement) and states the corrected finish day as 16"
    - id: obj-4
      check: "REVISED-PLAN.md breaks the cycle by removing exactly the R4-depends-on-R8 edge (retaining R5-depends-on-R4 and R8-depends-on-R5), adds the R1-depends-on-R2 dependency, and its recomputed project completion day equals 29 (judge verifies with the embedded node script)"
    - id: obj-5
      check: "AUDIT.md or REVISED-PLAN.md explicitly states the promised day-26 starting-gun milestone is infeasible and gives 29 as the earliest feasible day, and REASONING.md exists and is at most 400 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Audit completeness and precision"
      weight: 0.4
    - id: sub-craft
      name: "Repair minimality and feasibility"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `planning-04-plan-repair` (same construct, fresh
surface).

If the phrase "suni dikdik" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test seeds exactly four defects in the Cascade Ridge Trail Race
plan. All reference values below were locked by running node scripts
against the plan as embedded in the test file, not by inspection.

**The four seeded defects and answer key:**

1. **Dependency cycle**: R4 (depends on R8) -> R8 (depends on R5) ->
   R5 (depends on R4). The spurious edge is **R4-depends-on-R8**: the
   prose gives no logical reason ordering finish-line arches needs the
   timing mats installed first, AND it is the edge actually violated
   by the listed dates (R4 listed start = 14, R8 listed finish = 27;
   14 is not >= 27). The other two edges (R5-on-R4, R8-on-R5) are
   consistent with both the prose and the listed dates and must be
   retained. Removing either of the other two edges instead yields a
   different completion day (19 or 22 instead of 29) or fails to
   resolve the cycle correctly — confirmed by script, so a wrong break
   point is objectively detectable.
2. **Double-booking**: owner Farrah holds R9 (listed days 4-9) and R10
   (listed days 8-12), which overlap on days 8-9. Accepted repairs
   (all verified schedule-neutral, all yield completion day 29): (a)
   serialize R9 before R10, (b) serialize R10 before R9, or (c)
   reassign R10 to Soraya, the idle fourth owner (Soraya's own tasks
   R1 and R12 do not overlap R10's window). Note: reassigning R9
   (rather than R10) to Soraya is NOT schedule/resource-valid, since
   R9's corrected window overlaps Soraya's R1 (both occupy days 4-8)
   — do not require this specific variant, but do not penalize a
   submission that reassigns R10, or that serializes in either order.
3. **Arithmetic error**: R11 is listed starting day 12, duration 4,
   listed finish day 21. Correct finish = 12 + 4 = **16** (a 5-day
   discrepancy, comfortably >= 3 so it cannot be convention
   confusion).
4. **Missing dependency**: prose states the sponsor list (R2) must be
   finalized before the course-use permit (R1) can be secured, since
   the permit application must list confirmed sponsors. The table
   lists no dependency for R1. Add **R1 depends on R2**.

**After all four fixes**: unique critical path
`R2 -> R1 -> R3 -> R4 -> R5 -> R8 -> R12`, project completion day
**29**. The promised starting-gun day was 26; since 29 > 26, the
milestone as promised is **infeasible**, and the earliest feasible
starting-gun day is **29**.

To re-verify before judging, run this against the plan as corrected by
the submission (edit `deps` to match the submission's revised table if
it differs from the answer key, to see what completion day it
implies):

```
node -e "
const durations={R1:4,R2:4,R3:6,R4:5,R5:3,R6:6,R7:4,R8:5,R9:5,R10:4,R11:4,R12:2};
const deps={R1:['R2'],R2:[],R3:['R1'],R4:['R3'],R5:['R4'],R6:[],R7:['R6'],R8:['R5'],R9:['R2'],R10:['R1'],R11:['R7','R10'],R12:['R9','R11','R8']};
const order=Object.keys(durations);const visited={},temp={},topo=[];
function visit(id){if(visited[id])return;if(temp[id])throw new Error('cycle at '+id);temp[id]=true;for(const d of deps[id])visit(d);temp[id]=false;visited[id]=true;topo.push(id);}
for(const id of order)visit(id);
const ES={},EF={};for(const id of topo){ES[id]=deps[id].length?Math.max(...deps[id].map(d=>EF[d])):0;EF[id]=ES[id]+durations[id];}
const dur=Math.max(...Object.values(EF));
const succ={};for(const id of order)succ[id]=[];for(const id of order)for(const d of deps[id])succ[d].push(id);
const LF={},LS={};for(const id of [...topo].reverse()){LF[id]=succ[id].length?Math.min(...succ[id].map(s=>LS[s])):dur;LS[id]=LF[id]-durations[id];}
for(const id of order)console.log(id,'ES',ES[id],'EF',EF[id],'slack',LS[id]-ES[id]);
console.log('duration',dur,'critical',order.filter(id=>LS[id]-ES[id]===0).join(','));
"
```

This prints ES/EF/slack for all 12 tasks, duration **29**, and
critical path tasks `R1,R2,R3,R4,R5,R8,R12` (slack 0). If a
submission's revised schedule does not match this when the same
corrected dependency structure is used, or if it retains the R4-on-R8
edge, is missing the R1-on-R2 edge, or leaves R11's finish
uncorrected, the recomputation check (obj-4) fails.

Grading notes:

- **obj-1 through obj-3** are about the AUDIT: correct identification,
  not necessarily correct repair yet. Accept any phrasing that
  unambiguously names the same tasks/owner/edge.
- **obj-4** requires the REVISED-PLAN.md's own recomputed schedule to
  actually reach completion day 29 with the correct edge removed and
  the correct edge added — a submission that identifies the defects
  correctly in AUDIT.md but botches the recomputation still fails
  obj-4.
- **obj-5**: the infeasibility finding may appear in either AUDIT.md
  or REVISED-PLAN.md; do not require both.
- A mediocre submission typically finds the loud cycle (it's visually
  obvious once traced) but misses the quiet R11 arithmetic error, or
  breaks the cycle at R5-on-R4 or R8-on-R5 instead of R4-on-R8 (both
  are genuinely necessary edges — breaking either one is a real
  failure, not a stylistic variant, and changes the completion day per
  the script above).
- **obj-1 phrasing.** PASS: "The dependency cycle runs R4 (Order
  finish-line arches) -> R8 (Install timing mats) -> R5 (Assemble
  arch trusses) -> back to R4.", "R4, R5, and R8 form a circular
  dependency: R4 needs R8, R8 needs R5, and R5 needs R4.", "There's a
  three-task cycle involving Order finish-line arches, Assemble arch
  trusses, and Install timing mats." FAIL: "R4 and R8 conflict with
  each other." (only two of three tasks named), "There's a scheduling
  loop somewhere in the arch and timing-mat tasks." (vague, doesn't
  unambiguously name all three), "R3, R4, and R5 form a cycle." (wrong
  task set — R3 isn't in the cycle).
- **obj-2 phrasing.** PASS: "Farrah is double-booked: she owns both R9
  (Print race-day maps, days 4-9) and R10 (Place mile-marker signage,
  days 8-12), which overlap.", "Owner Farrah has two overlapping
  tasks, R9 and R10.", "R9 and R10 both belong to Farrah and their
  listed windows overlap on days 8-9." FAIL: "Otis is overbooked on R4
  and R5." (wrong owner and wrong tasks), "There's a resource conflict
  somewhere in the schedule." (no owner or tasks named), "Farrah's
  tasks are too tightly scheduled." (owner named but not the specific
  conflicting tasks).
- **obj-3 phrasing.** PASS: "R11 is listed finishing on day 21, but
  12 + 4 = 16, so the correct finish is day 16.", "The finish date for
  Rehearse starting-line announcement should be 16, not 21.", "R11's
  listed finish (21) doesn't match start+duration; the corrected
  finish is day 16." FAIL: "R11's dates look fine." (misses the error
  entirely), "R11 should finish on day 20." (wrong corrected value),
  "R10's finish date is wrong." (wrong task named).
- **obj-5 phrasing.** PASS: "The promised day-26 starting-gun is not
  feasible; the earliest the race can realistically start is day 29.",
  "Day 26 cannot be met — the corrected schedule completes on day
  29.", "Infeasible: 29 > 26, so the earliest feasible starting-gun
  day is 29." FAIL: "The day-26 milestone is feasible as planned."
  (misses the infeasibility), "The plan will complete by day 26 with
  minor tweaks." (contradicts the corrected schedule), "The earliest
  feasible day is 27." (wrong number).
- Audit completeness and precision: were all four defects found with
  correct, specific evidence (not vague "something seems off")?
- Repair minimality and feasibility: does the revised plan change only
  what's necessary — one edge removed, one edge added, one date
  corrected, one resource conflict resolved — without introducing new
  invented tasks or unnecessarily restructuring untouched parts of the
  plan?
- Reasoning quality: does REASONING.md show the actual detection
  method (tracing the cycle, checking start+duration=finish for every
  row, checking owner overlaps) rather than asserting conclusions?
