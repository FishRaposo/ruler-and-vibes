---
test: sched-03b-render-node-contention
canary: "windbreak underbrush"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The makespan is stated as exactly 17"
    - id: obj-2
      check: "The assignment matches the deterministic rule: R1 g0 [0,6], R2 g1 [0,4], R4 g1 [4,7], R3 g0 [6,13], R5 g1 [7,11], R7 g1 [11,17], R6 g0 [13,16]"
    - id: obj-3
      check: "Every job's start is >= the max finish of its predecessors (precedence respected, e.g. R6 starts at 13 = max(R3=13, R4=7))"
    - id: obj-4
      check: "No two jobs on the same node overlap in time (verifiable by scanning each node's interval list)"
    - id: obj-5
      check: "The submission's account of the assignment (in render-schedule.md or REASONING.md) reflects event-driven assignment honoring the priority list, not a duration-sorted (e.g. shortest-job-first) or unlimited-parallelism approach (prose-located)"
  subjective:
    - id: sub-quality
      name: "Correctness and completeness of the machine assignment and makespan"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of the step-by-step scheduler simulation trace"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sched-03-two-machine-makespan` (same construct, fresh
surface).

If the phrase "windbreak underbrush" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

```
node -e "
const jobs={R1:{dur:6,deps:[]},R2:{dur:4,deps:[]},R3:{dur:7,deps:['R1']},R4:{dur:3,deps:['R2']},R5:{dur:4,deps:['R2']},R6:{dur:3,deps:['R3','R4']},R7:{dur:6,deps:['R5']}};
const order=['R1','R2','R3','R4','R5','R6','R7'];
const finish={},start={},nodeOf={};
const free=[0,0];let idle=[true,true];let remaining=new Set(order);let time=0;
function ready(t){return order.filter(id=>remaining.has(id)&&jobs[id].deps.every(d=>finish[d]!==undefined&&finish[d]<=t)).sort((a,b)=>order.indexOf(a)-order.indexOf(b));}
while(remaining.size){
  const freeNodes=[0,1].filter(n=>idle[n]);
  if(freeNodes.length){
    const r=ready(time);
    for(const n of freeNodes){ if(!r.length) break; const id=r.shift(); start[id]=time; finish[id]=time+jobs[id].dur; nodeOf[id]=n; free[n]=finish[id]; idle[n]=false; remaining.delete(id);}
  }
  if(!remaining.size) break;
  const busy=[0,1].filter(n=>!idle[n]).map(n=>free[n]);
  time=Math.min(...busy);
  for(const n of [0,1]) if(!idle[n]&&free[n]===time) idle[n]=true;
}
for(const id of order) console.log(id,'g'+nodeOf[id],'['+start[id]+','+finish[id]+']');
console.log('Makespan:',Math.max(...Object.values(finish)));
"
```

This discrete-event simulation (priority order R1..R7 breaks ties among
ready jobs; lower-indexed node breaks ties among free nodes; a freed
node with no ready job idle-waits to the next completion event)
produces exactly:

```
R1 g0 [0,6]
R2 g1 [0,4]
R3 g0 [6,13]
R4 g1 [4,7]
R5 g1 [7,11]
R6 g0 [13,16]
R7 g1 [11,17]
Makespan: 17
```

Precedence check passes for all 7 jobs (each job's start equals or
exceeds the max finish of its predecessors — e.g. R6 depends on R3
(finish 13) and R4 (finish 7), so R6's start of 13 is exactly the
max, not the sum of the two and not just R4's earlier finish).
Machine-overlap check passes for both nodes (g0:
R1[0,6]->R3[6,13]->R6[13,16]; g1: R2[0,4]->R4[4,7]->R5[7,11]->R7[11,17],
each back-to-back or gapped, never overlapping).

The idle-wait branch of the rule never actually triggers on this
instance (a ready job is always available whenever a node frees up —
including the moment R5 becomes ready-but-waiting at t=4, since some
other job is always available to occupy whichever node frees next), so
the answer is robust to that rule detail — it's stated in the test
purely to make the rule unambiguous, not because this instance
exercises it.

If a submission's assignment or makespan disagrees with the values
above, the submission is wrong — do not average or split the
difference, even if the submission's own internal logic is
self-consistent.

### Trap

A solver who ignores the two-node capacity and treats this like
unlimited-parallelism scheduling (as in sched-01) computes a
longest-path makespan of 16 (via R1->R3->R6 = 6+7+3) — smaller than
the correct 17, and invalid because it silently assumes more than two
jobs can render at once: in the naive unlimited-parallelism schedule,
R1 [0,6], R4 [4,7], and R5 [4,8] are all simultaneously "running"
during the window [4,6) — three jobs needing three render nodes at
once, one more than the two actually available. A solver who
reorders jobs by shortest-duration-first instead of following the
pinned priority list will also diverge from the assignment above (for
instance, at t=0 a duration-sorted rule would prefer R2 (dur 4) over R1
(dur 6) for node g0, which contradicts placing the highest-priority
ready job on the lower-indexed free node first). Either deviation
should fail obj-1/obj-2 regardless of how cleanly the (wrong)
simulation is presented.

### Example phrasings — obj-5, event-driven assignment honoring the priority list

PASSING:
- "At t=0 both nodes are free and R1 and R2 are the only ready jobs (no
  predecessors); by priority order R1 outranks R2, so R1 goes to the
  lower-indexed node g0 and R2 takes g1 — not because R1 is longer or
  shorter, just because it's earlier in the priority list."
- "When g1 frees at t=4, both R4 and R5 are ready (both depend only on
  R2), and R4 outranks R5 in the priority list, so R4 takes g1; R5
  stays ready but has to keep waiting since g0 is still busy with R1
  until t=6."
- "At t=6, g0 frees and both R3 (newly ready) and R5 (ready since t=4)
  are candidates; R3 outranks R5 in the priority list, so g0 takes R3
  and R5 continues to wait for the next free node."

FAILING:
- "I sorted all seven jobs by duration, shortest first, and assigned
  them to whichever node was free next, since that tends to minimize
  makespan."
- "Since there are 7 jobs and unlimited effective parallelism across
  the dependency graph, I computed the longest path through the
  precedence graph and used that as the makespan."
- "R5 starts as soon as R2 finishes at t=4, running alongside R1 on
  whichever node is convenient, since both are ready at that point."

### Subjective guidance

- **Correctness and completeness of the machine assignment and
  makespan** (0.4): all 7 jobs correctly assigned with correct
  node/start/end, and correct makespan; any single wrong interval
  should meaningfully cap this score.
- **Clarity of the step-by-step scheduler simulation trace** (0.3): can
  a reader follow, event by event, why each job was assigned to which
  node at which time — including the moments where a job becomes ready
  and where a node becomes free?
- **Reasoning quality** (0.3): does the submission demonstrate genuine
  event-driven simulation (tracking ready sets and free nodes over
  time) rather than a static heuristic like shortest-job-first or an
  unlimited-parallelism longest-path calculation?
