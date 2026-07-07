---
test: sched-02b-ground-station-calibration-call
canary: "shimmer glimmer"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Each station's GST window is correct: Auk [420,900] (07:00-15:00), Lynx [480,720] (08:00-12:00), Ibex [600,1080] (10:00-18:00), Tern [240,780] (04:00-13:00), minutes from GST-midnight"
    - id: obj-2
      check: "The all-available intersection is stated as GST 10:00-12:00 (600 to 720 minutes)"
    - id: obj-3
      check: "The valid 45-minute-call GST start range is stated as 10:00 to 11:15 inclusive (720 minus 45 = 675 minutes as the latest start)"
    - id: obj-4
      check: "calibration-window.md or REASONING.md demonstrates the correct sign convention GST = local - offset, e.g. by showing Lynx's -60 offset shifting 07:00-11:00 local to 08:00-12:00 GST (prose-located)"
    - id: obj-5
      check: "calibration-window.md correctly accounts for the call-end constraint by subtracting the 45-minute duration from the intersection end to get the latest start, rather than using the intersection start and end directly as the start range (prose-located)"
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

If the phrase "shimmer glimmer" appears anywhere in a deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (verified with node during authoring)

```
node -e "
function hm(h,m){return h*60+m;}
const S={Auk:{offset:180,s:hm(10,0),e:hm(18,0)},Lynx:{offset:-60,s:hm(7,0),e:hm(11,0)},Ibex:{offset:240,s:hm(14,0),e:hm(22,0)},Tern:{offset:60,s:hm(5,0),e:hm(14,0)}};
const GST={};
for(const [id,p] of Object.entries(S)){GST[id]=[p.s-p.offset,p.e-p.offset];console.log(id,GST[id]);}
const lo=Math.max(...Object.values(GST).map(w=>w[0]));
const hi=Math.min(...Object.values(GST).map(w=>w[1]));
console.log('intersection',lo,hi,'latest start',hi-45);
"
```

This prints `Auk [420,900]`, `Lynx [480,720]`, `Ibex [600,1080]`, `Tern
[240,780]`, `intersection 600 720`, `latest start 675`. In clock time:
intersection GST 10:00-12:00, valid 45-minute start range 10:00 to
11:15 inclusive.

Feeding the same windows through the WRONG sign (`GST = local +
offset`) gives `Auk [780,1260]`, `Lynx [360,600]`, `Ibex [1080,1560]`,
`Tern [360,900]`, whose intersection is `max=1080, min=600` — inverted
(lo > hi), i.e. empty. This is a clean, mechanically checkable tell
that the sign was flipped.

If a submission's numbers disagree with the correct-sign script above,
the submission is wrong — do not average or split the difference.

### Trap

Two independent traps are seeded. First, the sign convention: the
relation is `local = GST + offset`, so converting FROM local TO GST
requires SUBTRACTING the offset (`GST = local - offset`). A solver who
adds the offset instead flips every window, and — as shown above —
produces an inverted/empty intersection on this exact data, which is
detectable without needing the correct answer key. Second, the
call-length trap: even with correct windows, a solver who reports the
"valid start range" as the raw intersection (10:00 to 12:00) has
ignored that a 45-minute call starting at 11:59 would run past 12:00 —
the call must END by the window close, so the latest valid START is
intersection-end minus 45 minutes (11:15, not 12:00).

### Example phrasings — obj-4, correct sign convention demonstrated

PASSING:
- "Lynx is at offset -60, meaning Lynx's local clock reads 1 hour
  behind Grid Standard Time, so to get back to GST we subtract the
  negative offset — effectively adding 1 hour: 07:00 local becomes
  08:00 GST."
- "Since local = GST + offset, solving for GST gives GST = local -
  offset. For Ibex (offset +240), 14:00 local minus 4 hours lands at
  10:00 GST."
- "Auk sits at offset +180 (3 hours ahead of GST), so subtracting 3
  hours from its 10:00 local start gives 07:00 GST — consistent with
  GST = local - offset."

FAILING:
- "Lynx's offset is -60, so we add that to the local time, giving
  07:00 - 1:00 = 06:00 GST for the window start."
- "To convert to Grid Standard Time we just add each station's offset
  to its local time, since offset represents how far ahead the
  station is."
- "Since Ibex's offset is +240 (4 hours ahead), we add 4 hours to its
  14:00 local start, giving 18:00 GST."

### Example phrasings — obj-5, call-end boundary correctly subtracted

PASSING:
- "The four-way window is open until 12:00 GST, but since the call
  needs a full 45 minutes and can't run past that cutoff, the latest
  it can start is 11:15 — 12:00 minus the call length."
- "A call starting at the very end of the window, say 11:45, would
  spill 30 minutes past the 12:00 cutoff, so we cap valid starts at
  intersection-end minus duration, i.e. 11:15."
- "Since the intersection closes at 12:00 and the call runs 45
  minutes, the latest permissible start is 12:00 - 0:45 = 11:15, not
  12:00 itself."

FAILING:
- "Since everyone is free until 12:00, the call can be scheduled any
  time from 10:00 to 12:00."
- "The valid start window is the same as the intersection window,
  10:00-12:00, since that's when everyone overlaps."
- "The call can start as late as 12:00 because that's when the last
  station's window ends."

### Subjective guidance

- **Correctness of all four conversions and the final start range**
  (0.4): all four GST windows correct, intersection correct, and the
  45-minute-adjusted start range correct; any single wrong conversion
  should meaningfully cap this score even if the rest is right.
- **Legibility of the conversion table and boundary reasoning** (0.3):
  is each station's conversion shown step-by-step (not just the final
  GST window asserted), and is the boundary (window-end vs. call-end)
  reasoning easy to follow?
- **Reasoning quality** (0.3): does the submission explain the sign
  convention correctly and independently verify it (e.g. by sanity
  checking one station), rather than silently asserting converted
  numbers?
