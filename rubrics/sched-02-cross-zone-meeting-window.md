---
test: sched-02-cross-zone-meeting-window
canary: "fiddle rebec"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Each participant's AT window is correct: P1 [420,900] (07:00-15:00), P2 [660,900] (11:00-15:00), P3 [480,960] (08:00-16:00), P4 [360,900] (06:00-15:00), minutes from AT-midnight"
    - id: obj-2
      check: "The all-available intersection is stated as AT 11:00-15:00 (660 to 900 minutes)"
    - id: obj-3
      check: "The valid 60-minute-meeting AT start range is stated as 11:00 to 14:00 inclusive (900 minus 60 = 840 minutes as the latest start)"
    - id: obj-4
      check: "window.md or REASONING.md demonstrates the correct sign convention AT = local - offset, e.g. by showing P2's -180 offset shifting 08:00-12:00 local to 11:00-15:00 AT (prose-located)"
    - id: obj-5
      check: "window.md correctly accounts for the meeting-end constraint by subtracting the 60-minute duration from the intersection end to get the latest start, rather than using the intersection start and end directly as the start range (prose-located)"
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

If the phrase "fiddle rebec" appears anywhere in a deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (verified with node during authoring)

```
node -e "
function hm(h,m){return h*60+m;}
const P={P1:{offset:120,s:hm(9,0),e:hm(17,0)},P2:{offset:-180,s:hm(8,0),e:hm(12,0)},P3:{offset:300,s:hm(13,0),e:hm(21,0)},P4:{offset:0,s:hm(6,0),e:hm(15,0)}};
const AT={};
for(const [id,p] of Object.entries(P)){AT[id]=[p.s-p.offset,p.e-p.offset];console.log(id,AT[id]);}
const lo=Math.max(...Object.values(AT).map(w=>w[0]));
const hi=Math.min(...Object.values(AT).map(w=>w[1]));
console.log('intersection',lo,hi,'latest start',hi-60);
"
```

This prints `P1 [420,900]`, `P2 [660,900]`, `P3 [480,960]`, `P4
[360,900]`, `intersection 660 900`, `latest start 840`. In clock time:
intersection AT 11:00-15:00, valid 60-minute start range 11:00 to
14:00 inclusive.

Feeding the same windows through the WRONG sign (`AT = local +
offset`) gives `P1 [660,1140]`, `P2 [300,540]`, `P3 [1080,1560]`, `P4
[360,900]`, whose intersection is `max=1080, min=540` — inverted
(lo > hi), i.e. empty. This is a clean, mechanically checkable tell
that the sign was flipped.

If a submission's numbers disagree with the correct-sign script above,
the submission is wrong — do not average or split the difference.

### Trap

Two independent traps are seeded. First, the sign convention: the
relation is `local = AT + offset`, so converting FROM local TO AT
requires SUBTRACTING the offset (`AT = local - offset`). A solver who
adds the offset instead flips every window, and — as shown above —
produces an inverted/empty intersection on this exact data, which is
detectable without needing the correct answer key. Second, the
meeting-length trap: even with correct windows, a solver who reports
the "valid start range" as the raw intersection (11:00 to 15:00) has
ignored that a 60-minute meeting starting at 14:59 would run past
15:00 — the meeting must END by the window close, so the latest valid
START is intersection-end minus 60 minutes (14:00, not 15:00).

### Example phrasings — obj-4, correct sign convention demonstrated

PASSING:
- "P2 is at offset -180, meaning P2's local clock reads 3 hours behind
  Anchor Time, so to get back to AT we subtract the negative offset —
  effectively adding 3 hours: 08:00 local becomes 11:00 AT."
- "Since local = AT + offset, solving for AT gives AT = local - offset.
  For P3 (offset +300), 13:00 local minus 5 hours lands at 08:00 AT."

FAILING:
- "P2's offset is -180, so we add that to the local time, giving 08:00
  - 3:00 = 05:00 AT for the window start."
- "To convert to Anchor Time we just add each participant's offset to
  their local time, since offset represents how far ahead they are."

### Example phrasings — obj-5, meeting-end boundary correctly subtracted

PASSING:
- "The four-way window is open until 15:00 AT, but since the meeting
  needs a full 60 minutes and can't run past that cutoff, the latest
  it can start is 14:00 — 15:00 minus the meeting length."
- "A meeting starting at the very end of the window, say 14:45, would
  spill 15 minutes past the 15:00 cutoff, so we cap valid starts at
  intersection-end minus duration, i.e. 14:00."

FAILING:
- "Since everyone is free until 15:00, the meeting can be scheduled
  any time from 11:00 to 15:00."
- "The valid start window is the same as the intersection window,
  11:00-15:00, since that's when everyone overlaps."

### Subjective guidance

- **Correctness of all four conversions and the final start range**
  (0.4): all four AT windows correct, intersection correct, and the
  60-minute-adjusted start range correct; any single wrong conversion
  should meaningfully cap this score even if the rest is right.
- **Legibility of the conversion table and boundary reasoning** (0.3):
  is each participant's conversion shown step-by-step (not just the
  final AT window asserted), and is the boundary (window-end vs.
  meeting-end) reasoning easy to follow?
- **Reasoning quality** (0.3): does the submission explain the sign
  convention correctly and independently verify it (e.g. by sanity
  checking one participant), rather than silently asserting converted
  numbers?
