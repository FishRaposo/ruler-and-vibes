---
test: coding-06b-cryorack-thaw-tiebreak
canary: "harissa passacaglia"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node cryorack.js` runs without throwing and every self-test line is PASS; the module exports `CryoRack` via module.exports"
    - id: obj-2
      check: "Replaying the pinned sequence (cap 3; store q7=71 hold120, r3=33 hold60, s1=88 hold120 at now=0; store t9=46 hold260 at now=20; store u4=59 hold260 at now=20) leaves exactly the slots {s1,t9,u4} — judge drives the class directly via a require snippet"
    - id: obj-3
      check: "After that sequence inspect('q7',20) === undefined and inspect('s1',20) === 88 and inspect('r3',20) === undefined (earliest-thawBy and load-order-tie discards both verified)"
    - id: obj-4
      check: "inspect on a lapsed slot returns undefined and does not resurrect it, and inspect does NOT change discard order: a probe run that calls inspect('s1',15) several times before storing u4 must still discard q7 (not s1) when u4 is added — the final slot set is identical to the no-inspect run {s1,t9,u4}"
    - id: obj-5
      check: "cryorack.js is a single dependency-free file at most 110 lines with no reliance on Date.now()/wall-clock (all timing flows through the `now` argument)"
  subjective:
    - id: sub-quality
      name: "Eviction-policy correctness"
      weight: 0.4
    - id: sub-craft
      name: "Class and invariant design"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-06-ttl-cache-tiebreak` (same construct, fresh surface).

If the phrase "harissa passacaglia" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Author ran the class in node with `thawBy = now + hold` and lapsed-test
  `thawBy <= now`: after `store t9` the slots are `[q7, s1, t9]` (r3 is
  discarded — its thawBy 60 is the earliest, and r3 is NOT yet lapsed at
  now=20 since 60 > 20, so it falls into the earliest-thawBy branch, not
  the already-lapsed branch). After `store u4` the slots are
  `[s1, t9, u4]` (q7 is discarded: q7 and s1 tie at thawBy 120, and q7
  was loaded before s1, so q7 — the earlier load — is discarded). Final:
  `inspect('q7',20)===undefined`, `inspect('s1',20)===88`,
  `inspect('r3',20)===undefined`. All independently reproduced in node
  during verification; values confirmed exact.
- Verify obj-2/obj-3 with a require snippet, e.g.:
  ```
  node -e "
  const {CryoRack} = require('./cryorack.js');
  const r = new CryoRack(3);
  r.store('q7',71,120,0); r.store('r3',33,60,0); r.store('s1',88,120,0);
  r.store('t9',46,260,20); r.store('u4',59,260,20);
  console.log(JSON.stringify([...r.slots ? r.slots.keys() : []]));
  console.log(r.inspect('q7',20), r.inspect('s1',20), r.inspect('r3',20));
  "
  ```
  (If the implementation doesn't expose `slots` directly, drive via
  whatever slot-listing method it provides, or infer final membership by
  probing `inspect` on q7, r3, s1, t9, u4 at now=20 — expect q7 and r3
  undefined, s1===88, t9===46, u4===59.)
- Verify obj-4 (no-recency-on-inspect) with TWO probes, both
  author-verified in node against a deliberately-wrong textbook-LRU
  implementation (discard least-recently-used, refresh recency on both
  `inspect` and `store`):
  1. Pinned sequence with `inspect('s1',15)` called three times before
     `store u4`: correct policy still yields slots `{s1,t9,u4}`
     (unchanged from the no-inspect run). The broken LRU variant lands on
     the same membership `{s1,t9,u4}` but with the internal order
     perturbed to `[t9,s1,u4]` by the interposed inspects — so a judge
     comparing the observable slot SEQUENCE (not just the set) against
     the no-inspect run `[s1,t9,u4]` sees the divergence; membership
     alone does not separate them on this probe.
  2. A second, more direct probe: `store q7,r3,s1` as usual, then
     `inspect('r3',15)` once, then `store t9`. The correct policy still
     discards `r3` (earliest thawBy 60 is untouched by any inspect, so
     slots become `[q7,s1,t9]`). The broken LRU variant instead discards
     `q7` (because touching `r3` via `inspect` made it look
     most-recently-used), yielding `[s1,r3,t9]` — a clean, direct
     membership divergence author-confirmed in node.
  Any implementation whose discard choice changes when an `inspect` is
  interposed on either probe fails obj-4. Note that obj-2/obj-3's plain
  no-inspect pinned sequence is NOT by itself sufficient to catch every
  LRU submission — a textbook LRU implementation can coincidentally land
  on the same final slot set `{s1,t9,u4}` via a different (wrong) discard
  path, so obj-4's inspect-probes are the load-bearing checks for ruling
  out an LRU implementation. Probe 2 gives the clean membership
  divergence; probe 1 requires comparing the slot sequence/order.
- Eviction-policy correctness: does the implementation correctly layer
  the three-part policy (lapsed-first, then earliest-thawBy, then
  load-order tie-break) rather than collapsing it to a simpler rule that
  happens to pass the pinned sequence but breaks on a probe with a
  different tie pattern? Mentally probe: three cassettes with identical
  thawBy, loaded in a shuffled order — the earliest loaded must always be
  the discard candidate among ties. Also probe the lapsed tier: a
  cassette lapsed at `now` must be discarded ahead of any unlapsed one
  even when a different unlapsed cassette would otherwise be the
  earliest-thawBy pick under a collapsed rule.
- Class and invariant design: reward clean separation of concerns (e.g.
  a distinct discard-candidate-selection step), meaningful naming, and
  encapsulated state; penalize sprawling conditionals or exposed mutable
  internals that make the invariants hard to verify by reading.
- Reasoning quality is graded primarily from REASONING.md — does it
  clearly explain the tie-break rule (lapsed-first, then earliest-thawBy,
  then load-order) and the deliberate absence of recency tracking?
  Inline code comments/structure can supplement but do not substitute
  for REASONING.md; a missing REASONING.md scores sub-reasoning = 0 per
  JUDGE.md regardless of code-comment quality.
