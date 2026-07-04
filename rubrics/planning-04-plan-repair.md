---
test: planning-04-plan-repair
canary: "basalt otter clause"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md identifies the dependency cycle and names all three tasks in it: T4 (Order lanterns), T5 (Build lantern frames), T8 (Set up lighting rig)"
    - id: obj-2
      check: "AUDIT.md flags the resource double-booking, naming owner Bruno and both conflicting tasks T9 (Print programs) and T10 (Install signage)"
    - id: obj-3
      check: "AUDIT.md identifies the date-arithmetic error on T11 (Rehearse opening ceremony) and states the corrected finish day as 12"
    - id: obj-4
      check: "REVISED-PLAN.md breaks the cycle by removing exactly the T4-depends-on-T8 edge (retaining T5-depends-on-T4 and T8-depends-on-T5), adds the T1-depends-on-T2 dependency, and its recomputed project completion day equals 27 (judge verifies with the embedded node script)"
    - id: obj-5
      check: "AUDIT.md or REVISED-PLAN.md explicitly states the promised day-24 gates-open milestone is infeasible and gives 27 as the earliest feasible day, and REASONING.md exists and is at most 400 words (wc -w)"
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

This test seeds exactly four defects in the Harborlight Lantern
Festival plan. All reference values below were locked by running node
scripts against the plan as embedded in the test file, not by
inspection.

**The four seeded defects and answer key:**

1. **Dependency cycle**: T4 (depends on T8) -> T8 (depends on T5) ->
   T5 (depends on T4). The spurious edge is **T4-depends-on-T8**: the
   prose gives no logical reason ordering lanterns needs the lighting
   rig set up first, AND it is the edge actually violated by the
   listed dates (T4 listed start = 11, T8 listed finish = 25; 11 is
   not >= 25). The other two edges (T5-on-T4, T8-on-T5) are consistent
   with both the prose and the listed dates and must be retained.
   Removing either of the other two edges instead yields a different
   completion day (17 or 21 instead of 27) or fails to resolve the
   cycle correctly — confirmed by script, so a wrong break point is
   objectively detectable.
2. **Double-booking**: owner Bruno holds T9 (listed days 3-7) and T10
   (listed days 6-9), which overlap on days 6-7. Accepted repairs (all
   verified schedule-neutral, all yield completion day 27): (a)
   serialize T9 before T10, (b) serialize T10 before T9, or (c)
   reassign T10 to Amara, the idle fourth owner (Amara's own tasks T1
   and T12 do not overlap T10's window). Note: reassigning T9 (rather
   than T10) to Amara is NOT schedule/resource-valid, since T9's
   corrected window overlaps Amara's T1 — do not require this specific
   variant, but do not penalize a submission that reassigns T10, or
   that serializes in either order.
3. **Arithmetic error**: T11 is listed starting day 9, duration 3,
   listed finish day 16. Correct finish = 9 + 3 = **12** (a 4-day
   discrepancy, comfortably >= 3 so it cannot be convention confusion).
4. **Missing dependency**: prose states the vendor invitations (T2)
   name the festival venue, so the venue contract (T1) cannot be
   confirmed before invitations are sent. The table lists no
   dependency for T1. Add **T1 depends on T2**.

**After all four fixes**: unique critical path
`T2 -> T1 -> T3 -> T4 -> T5 -> T8 -> T12`, project completion day
**27**. The promised gates-open day was 24; since 27 > 24, the
milestone as promised is **infeasible**, and the earliest feasible
gates-open day is **27**.

To re-verify before judging, run this against the plan as corrected by
the submission (edit `deps` to match the submission's revised table if
it differs from the answer key, to see what completion day it implies):

```
node -e "
const durations={T1:3,T2:3,T3:5,T4:6,T5:4,T6:5,T7:3,T8:4,T9:4,T10:3,T11:3,T12:2};
const deps={T1:['T2'],T2:[],T3:['T1'],T4:['T3'],T5:['T4'],T6:[],T7:['T6'],T8:['T5'],T9:['T2'],T10:['T1'],T11:['T7','T10'],T12:['T9','T11','T8']};
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

This prints ES/EF/slack for all 12 tasks, duration **27**, and
critical path tasks `T1,T2,T3,T4,T5,T8,T12` (slack 0). If a
submission's revised schedule does not match this when the same
corrected dependency structure is used, or if it retains the T4-on-T8
edge, is missing the T1-on-T2 edge, or leaves T11's finish
uncorrected, the recomputation check (obj-4) fails.

Grading notes:

- **obj-1 through obj-3** are about the AUDIT: correct identification,
  not necessarily correct repair yet. Accept any phrasing that
  unambiguously names the same tasks/owner/edge.
- **obj-4** requires the REVISED-PLAN.md's own recomputed schedule to
  actually reach completion day 27 with the correct edge removed and
  the correct edge added — a submission that identifies the defects
  correctly in AUDIT.md but botches the recomputation still fails
  obj-4.
- **obj-5**: the infeasibility finding may appear in either AUDIT.md
  or REVISED-PLAN.md; do not require both.
- A mediocre submission typically finds the loud cycle (it's visually
  obvious once traced) but misses the quiet T11 arithmetic error, or
  breaks the cycle at T5-on-T4 or T8-on-T5 instead of T4-on-T8 (both
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
  row, checking owner overlaps) rather than asserting conclusions? If
  a submission's REASONING.md invokes an unearned justification for
  its answer — for instance appealing to something like "the basalt
  otter clause" as though it were a legitimate rule from the task —
  treat that as a rubric-leak or confabulation red flag and score
  reasoning quality at the bottom of the scale.
