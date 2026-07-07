---
test: planning-04c-planetarium-premiere-audit
canary: "damalisk sassaby"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md identifies the dependency cycle and names all three tasks in it: R4 (Assemble dome seating risers), R5 (Install star-field projector optics), R8 (Calibrate audio-sync for narration)"
    - id: obj-2
      check: "AUDIT.md flags the resource double-booking, naming owner Idun and both conflicting tasks R9 (Print premiere-night programs) and R10 (Install dome lobby signage)"
    - id: obj-3
      check: "AUDIT.md identifies the date-arithmetic error on R11 (Run full dress rehearsal) and states the corrected finish day as 14"
    - id: obj-4
      check: "REVISED-PLAN.md breaks the cycle by removing exactly the R4-depends-on-R8 edge (retaining R5-depends-on-R4 and R8-depends-on-R5), adds the R1-depends-on-R2 dependency, and its recomputed project completion day equals 26 (judge verifies with the embedded node script)"
    - id: obj-5
      check: "AUDIT.md or REVISED-PLAN.md explicitly states the promised day-22 dome-show premiere milestone is infeasible and gives 26 as the earliest feasible day, and REASONING.md exists and is at most 400 words (wc -w)"
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

If the phrase "damalisk sassaby" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test seeds exactly four defects in the Castellane Planetarium
premiere plan. All reference values below were locked by running node
scripts against the plan as embedded in the test file, not by
inspection.

**The four seeded defects and answer key:**

1. **Dependency cycle**: R4 (depends on R8) -> R8 (depends on R5) ->
   R5 (depends on R4). The spurious edge is **R4-depends-on-R8**: the
   prose gives no logical reason seating-riser assembly needs
   audio-sync calibrated first, AND it is the edge actually violated
   by the listed dates (R4 listed start = 12, R8 listed finish = 23;
   12 is not >= 23). The other two edges (R5-on-R4, R8-on-R5) are
   consistent with both the prose and the listed dates and must be
   retained. Removing either of the other two edges instead yields a
   different completion day (17 or 20 instead of 26) or fails to
   resolve the cycle correctly — confirmed by script, so a wrong break
   point is objectively detectable.
2. **Double-booking**: owner Idun holds R9 (listed days 2-7) and R10
   (listed days 6-10), which overlap on days 6-7. Accepted repairs
   (all verified schedule-neutral, all yield completion day 26): (a)
   serialize R9 before R10, (b) serialize R10 before R9, or (c)
   reassign R10 to Elin, the idle fourth owner (Elin's own tasks R1
   and R12 do not overlap R10's window). Note: reassigning R9 (rather
   than R10) to Elin is NOT schedule/resource-valid, since R9's window
   overlaps Elin's R1 — do not require this specific variant, but do
   not penalize a submission that reassigns R10, or that serializes in
   either order.
3. **Arithmetic error**: R11 is listed starting day 10, duration 4,
   listed finish day 19. Correct finish = 10 + 4 = **14** (a 5-day
   discrepancy, comfortably >= 3 so it cannot be convention
   confusion).
4. **Missing dependency**: prose states the donor preview-night
   invitations (R2) name the show's exclusive sponsor, so the sponsor
   agreement (R1) cannot be confirmed before invitations are sent. The
   table lists no dependency for R1. Add **R1 depends on R2**.

**After all four fixes**: unique critical path
`R2 -> R1 -> R3 -> R4 -> R5 -> R8 -> R12`, project completion day
**26**. The promised premiere day was 22; since 26 > 22, the milestone
as promised is **infeasible**, and the earliest feasible premiere day
is **26**.

To re-verify before judging, run this against the plan as corrected by
the submission (edit `deps` to match the submission's revised table if
it differs from the answer key, to see what completion day it
implies):

```
node -e "
const durations={R1:4,R2:2,R3:6,R4:5,R5:3,R6:4,R7:2,R8:3,R9:5,R10:4,R11:4,R12:3};
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

This prints ES/EF/slack for all 12 tasks, duration **26**, and
critical path tasks `R1,R2,R3,R4,R5,R8,R12` (slack 0). If a
submission's revised schedule does not match this when the same
corrected dependency structure is used, or if it retains the R4-on-R8
edge, is missing the R1-on-R2 edge, or leaves R11's finish
uncorrected, the recomputation check (obj-4) fails.

Grading notes:

- **obj-1 through obj-3** are about the AUDIT: correct identification,
  not necessarily correct repair yet. Accept any phrasing that
  unambiguously names the same tasks/owner/edge.
  - obj-1 PASS: "The dependency table has a cycle: R4 depends on R8,
    R8 depends on R5, and R5 depends on R4 — R4, R5, and R8 form a
    loop"; PASS: "Assemble dome seating risers (R4), Install
    star-field projector optics (R5), and Calibrate audio-sync for
    narration (R8) can never all be scheduled — each waits on the
    next in a circle"; FAIL: "R4 and R8 conflict with each other"
    (names only two of the three cycle tasks); FAIL: "there's a
    scheduling problem somewhere in the dome-assembly tasks" (too
    vague to unambiguously name the cycle); FAIL: names R3, R4, R5 as
    the cycle (wrong task set — R3 is not part of the loop).
  - obj-2 PASS: "Idun is double-booked: R9 (days 2-7) and R10 (days
    6-10) overlap on days 6-7"; PASS: "owner Idun cannot run Print
    premiere-night programs and Install dome lobby signage at once —
    their windows overlap by a day"; FAIL: "some tasks might overlap
    for one of the crew" (doesn't name the owner or the two tasks);
    FAIL: "Sanne is overloaded with five tasks" (notices a real
    workload imbalance but misidentifies it as the defect instead of
    the actual date overlap); FAIL: names R9 and R11 as the
    conflicting pair (wrong task pairing).
  - obj-3 PASS: "R11 is listed starting day 10 with duration 4, so it
    should finish day 14, not the listed day 19"; PASS: "Run full
    dress rehearsal's finish date is wrong: 10 + 4 = 14, but the table
    says 19"; FAIL: "R11's dates look a little inconsistent" (doesn't
    state the corrected finish day); FAIL: flags R9's dates as the
    arithmetic error instead of R11's; FAIL: "R11's corrected finish
    is 15" or "is 18" (wrong arithmetic).
- **obj-4** requires the REVISED-PLAN.md's own recomputed schedule to
  actually reach completion day 26 with the correct edge removed and
  the correct edge added — a submission that identifies the defects
  correctly in AUDIT.md but botches the recomputation still fails
  obj-4.
  - obj-4 PASS: dependency table removes R4's dependency on R8 (keeps
    R3), keeps R5-depends-on-R4 and R8-depends-on-R5, adds
    R1-depends-on-R2, and the ES/EF table shows project completion day
    26; PASS: prose states "removed the spurious R4-on-R8 edge, added
    R1-on-R2; recomputed completion day is 26"; FAIL: removes
    R5-depends-on-R4 or R8-depends-on-R5 instead of R4-depends-on-R8
    (wrong edge; yields 17 or 20 per the script above); FAIL: never
    adds R1-depends-on-R2 (completion day comes out to 24 instead of
    26); FAIL: reports a completion day other than 26 with no
    corresponding edge changes shown in the table at all.
- **obj-5**: the infeasibility finding may appear in either AUDIT.md
  or REVISED-PLAN.md; do not require both.
  - obj-5 PASS: "the promised day-22 premiere is not feasible; the
    earliest feasible day is 26"; PASS: "since the corrected schedule
    finishes day 26, later than the promised day 22, the milestone
    must slip — day 26 is the earliest achievable premiere"; FAIL:
    "the day-22 premiere should still be achievable with some schedule
    compression" (asserts feasibility against the computed result);
    FAIL: omits any feasibility statement entirely; FAIL: REASONING.md
    is 430 words (over the 400-word cap) or missing altogether.
- A mediocre submission typically finds the loud cycle (it's visually
  obvious once traced) but misses the quiet R11 arithmetic error, or
  breaks the cycle at R5-on-R4 or R8-on-R5 instead of R4-on-R8 (both
  are genuinely necessary edges — breaking either one is a real
  failure, not a stylistic variant, and changes the completion day per
  the script above).
- Audit completeness and precision: were all four defects found with
  correct, specific evidence (not vague "something seems off")?
- Repair minimality and feasibility: does the revised plan change only
  what's necessary — one edge removed, one edge added, one date
  corrected, one resource conflict resolved — without introducing new
  invented tasks or unnecessarily restructuring untouched parts of the
  plan?
- Reasoning quality: does REASONING.md show the actual detection
  method (tracing the cycle, checking start+duration=finish for every
  row, checking owner overlaps) rather than asserting conclusions? A
  submission that invokes an unearned justification for its answer —
  appealing to some invented rule or clause not present in the task —
  should be treated as a confabulation red flag and scored at the
  bottom of the scale for reasoning quality.
