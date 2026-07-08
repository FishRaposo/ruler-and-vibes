---
test: sched-02c-logistics-hub-reconciliation-call
canary: "twinkle glisten"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Each center's HT window is correct: Portmere [450,930] (07:30-15:30), Eastholt [510,810] (08:30-13:30), Brackenford [420,900] (07:00-15:00), Nullwick [270,810] (04:30-13:30), minutes from HT-midnight"
    - id: obj-2
      check: "The all-available intersection is stated as HT 08:30-13:30 (510 to 810 minutes)"
    - id: obj-3
      check: "The valid 50-minute-call HT start range is stated as 08:30 to 12:40 inclusive (810 minus 50 = 760 minutes as the latest start)"
    - id: obj-4
      check: "reconciliation-window.md or REASONING.md demonstrates the correct sign convention HT = local - lag, e.g. by showing Eastholt's -90 lag shifting 07:00-12:00 local to 08:30-13:30 HT (prose-located)"
    - id: obj-5
      check: "reconciliation-window.md correctly accounts for the call-end constraint by subtracting the 50-minute duration from the intersection end to get the latest start, rather than using the intersection start and end directly as the start range (prose-located)"
  subjective:
    - id: sub-quality
      name: "Correctness of all four conversions and the final start range"
      weight: 0.4
    - id: sub-craft
      name: "Legibility of the conversion table and boundary reasoning"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sched-02-cross-zone-meeting-window` (same construct,
fresh surface).

If the phrase "twinkle glisten" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

```
node -e "
function hm(h,m){return h*60+m;}
const C={Portmere:{lag:210,s:hm(11,0),e:hm(19,0)},Eastholt:{lag:-90,s:hm(7,0),e:hm(12,0)},Brackenford:{lag:150,s:hm(9,30),e:hm(17,30)},Nullwick:{lag:-30,s:hm(4,0),e:hm(13,0)}};
const HT={};
for(const [id,p] of Object.entries(C)){HT[id]=[p.s-p.lag,p.e-p.lag];console.log(id,HT[id]);}
const lo=Math.max(...Object.values(HT).map(w=>w[0]));
const hi=Math.min(...Object.values(HT).map(w=>w[1]));
console.log('intersection',lo,hi,'latest start',hi-50);
"
```

This prints `Portmere [450,930]`, `Eastholt [510,810]`, `Brackenford
[420,900]`, `Nullwick [270,810]`, `intersection 510 810`, `latest start
760`. In clock time: intersection HT 08:30-13:30, valid 50-minute
start range 08:30 to 12:40 inclusive.

Feeding the same windows through the WRONG sign (`HT = local + lag`)
gives `Portmere [870,1350]`, `Eastholt [330,630]`, `Brackenford
[720,1200]`, `Nullwick [210,750]`, whose intersection is `max=870,
min=630` — inverted (lo > hi), i.e. empty. This is a clean,
mechanically checkable tell that the sign was flipped.

If a submission's numbers disagree with the correct-sign script above,
the submission is wrong — do not average or split the difference.

### Trap

Two independent traps are seeded. First, the sign convention: the
relation is `local = HT + lag`, so converting FROM local TO HT
requires SUBTRACTING the lag (`HT = local - lag`). A solver who adds
the lag instead flips every window, and — as shown above — produces an
inverted/empty intersection on this exact data, which is detectable
without needing the correct answer key. Second, the call-length trap:
even with correct windows, a solver who reports the "valid start
range" as the raw intersection (08:30 to 13:30) has ignored that a
50-minute call starting at 13:29 would run past 13:30 — the call must
END by the window close, so the latest valid START is
intersection-end minus 50 minutes (12:40, not 13:30).

### Example phrasings — obj-4, correct sign convention demonstrated

PASSING:
- "Eastholt is at lag -90, meaning Eastholt's local clock reads 1.5
  hours behind Hub Time, so to get back to HT we subtract the negative
  lag — effectively adding 1.5 hours: 07:00 local becomes 08:30 HT."
- "Since local = HT + lag, solving for HT gives HT = local - lag. For
  Brackenford (lag +150), 09:30 local minus 2.5 hours lands at 07:00
  HT."
- "Portmere sits at lag +210 (3.5 hours ahead of HT), so subtracting
  3.5 hours from its 11:00 local start gives 07:30 HT — consistent
  with HT = local - lag."

FAILING:
- "Eastholt's lag is -90, so we add that to the local time, giving
  07:00 - 1:30 = 05:30 HT for the window start."
- "To convert to Hub Time we just add each center's lag to its local
  time, since lag represents how far ahead the center is."
- "Since Brackenford's lag is +150 (2.5 hours ahead), we add 2.5 hours
  to its 09:30 local start, giving 12:00 HT."

### Example phrasings — obj-5, call-end boundary correctly subtracted

PASSING:
- "The four-way window is open until 13:30 HT, but since the call
  needs a full 50 minutes and can't run past that cutoff, the latest
  it can start is 12:40 — 13:30 minus the call length."
- "A call starting at the very end of the window, say 13:15, would
  spill 15 minutes past the 13:30 cutoff, so we cap valid starts at
  intersection-end minus duration, i.e. 12:40."
- "Since the intersection closes at 13:30 and the call runs 50
  minutes, the latest permissible start is 13:30 - 0:50 = 12:40, not
  13:30 itself."

FAILING:
- "Since everyone is free until 13:30, the call can be scheduled any
  time from 08:30 to 13:30."
- "The valid start window is the same as the intersection window,
  08:30-13:30, since that's when everyone overlaps."
- "The call can start as late as 13:30 because that's when the last
  center's window ends."

### Subjective guidance

- **Correctness of all four conversions and the final start range**
  (0.4): all four HT windows correct, intersection correct, and the
  50-minute-adjusted start range correct; any single wrong conversion
  should meaningfully cap this score even if the rest is right.
- **Legibility of the conversion table and boundary reasoning** (0.3):
  is each center's conversion shown step-by-step (not just the final
  HT window asserted), and is the boundary (window-end vs. call-end)
  reasoning easy to follow?
- **Reasoning quality** (0.3): does the submission explain the sign
  convention correctly and independently verify it (e.g. by sanity
  checking one center), rather than silently asserting converted
  numbers?
