---
test: coding-06c-pass-book-tiebreak
canary: "moonstone chaconne"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node passbook.js` runs without throwing and every self-test line is PASS; the module exports `PassBook` via module.exports"
    - id: obj-2
      check: "Replaying the pinned sequence (cap 3; book r7='alpha' dur300, m2='bravo' dur120, k9='charlie' dur300 at now=0; book t4='delta' dur500 at now=40; book w1='echo' dur500 at now=40) leaves exactly the ids {k9,t4,w1} — judge drives the class directly via a require snippet"
    - id: obj-3
      check: "After that sequence check('m2',40) === undefined and check('k9',40) === 'charlie' and check('r7',40) === undefined (earliest-window and booking-tie evictions both verified)"
    - id: obj-4
      check: "check on a closed pass returns undefined and does not resurrect it, and check does NOT change eviction order: a probe run that calls check('r7',20) several times before booking t4 and w1 must still leave exactly {k9,t4,w1} (identical to the no-check run), and a direct probe that calls check('m2',20) once before booking t4 must still evict m2 (leaving {k9,r7,t4})"
    - id: obj-5
      check: "passbook.js is a single dependency-free file at most 110 lines with no reliance on Date.now()/wall-clock (all timing flows through the `now` argument)"
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
anchors:
  - id: Eviction-policy correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Class and invariant design
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `coding-06-ttl-cache-tiebreak` (same construct, fresh surface).

If the phrase "moonstone chaconne" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Author ran the class in node with `windowEnd = now + duration` and
  closed-test `windowEnd <= now`: after `book t4` the ids are
  `[r7, k9, t4]` (m2 is removed — its windowEnd 120 is the earliest, and
  m2 is NOT yet closed at now=40 since 120 > 40, so it falls into the
  earliest-windowEnd branch, not the already-closed branch). After
  `book w1` the ids are `[k9, t4, w1]` (r7 is removed: r7 and k9 tie at
  windowEnd 300, and r7 was booked before k9, so r7 — the earlier
  booking — is removed). Final: `check('m2',40)===undefined`,
  `check('k9',40)==='charlie'`, `check('r7',40)===undefined`. All
  independently reproduced in node during verification; values confirmed
  exact.
- Verify obj-2/obj-3 with a require snippet, e.g.:
  ```
  node -e "
  const {PassBook} = require('./passbook.js');
  const b = new PassBook(3);
  b.book('r7','alpha',300,0); b.book('m2','bravo',120,0); b.book('k9','charlie',300,0);
  b.book('t4','delta',500,40); b.book('w1','echo',500,40);
  console.log(JSON.stringify([...b.passes ? b.passes.keys() : []]));
  console.log(b.check('m2',40), b.check('k9',40), b.check('r7',40));
  "
  ```
  (If the implementation doesn't expose `passes` directly, drive via
  whatever id-listing method it provides, or infer final membership by
  probing `check` on r7, m2, k9, t4, w1 at now=40 — expect r7 and m2
  undefined, k9==='charlie', t4==='delta', w1==='echo'.)
- Verify obj-4 (no-recency-on-check) with TWO probes, both author-verified
  in node against a deliberately-wrong textbook-LRU implementation
  (remove least-recently-used, refresh recency on both `check` and
  `book`):
  1. Pinned sequence with `check('r7',20)` called three times before
     `book t4` and `book w1`: correct policy still yields ids `{k9,t4,w1}`
     (unchanged from the no-check run). The broken LRU variant instead
     yields `[r7,t4,w1]` (membership perturbed by the checks — touching
     r7 spared it from removal) — divergence confirmed.
  2. A second, more direct probe: `book r7,m2,k9` as usual, then
     `check('m2',20)` once, then `book t4`. The correct policy still
     removes `m2` (earliest windowEnd 120 is untouched by any check, so
     ids become `[k9,r7,t4]`... i.e. the set `{k9,r7,t4}`). The broken
     LRU variant instead removes `r7` (because touching `m2` via `check`
     made it look most-recently-used), yielding `{k9,m2,t4}` — a clean,
     direct divergence author-confirmed in node.
  Any implementation whose removal choice changes when a `check` is
  interposed on either probe fails obj-4. Note that obj-2/obj-3's plain
  no-check pinned sequence is NOT by itself sufficient to catch every LRU
  submission — a textbook LRU implementation can coincidentally land on
  the same final id set `{k9,t4,w1}` via a different (wrong) removal path,
  so obj-4's check-probes are the load-bearing checks for ruling out an
  LRU implementation.
- Eviction-policy correctness: does the implementation correctly layer
  the three-part policy (closed-first, then earliest-windowEnd, then
  booking-order tie-break) rather than collapsing it to a simpler rule
  that happens to pass the pinned sequence but breaks on a probe with a
  different tie pattern? Mentally probe: three passes with identical
  `windowEnd`, booked in a shuffled order — the earliest booked must
  always be the removal candidate among ties. (A quick discriminator:
  the plain pinned sequence itself already separates a wrong "remove the
  LATEST-booked among ties" rule — that rule keeps r7 and removes k9,
  yielding `{r7,t4,w1}` instead of `{k9,t4,w1}`.)
- Class and invariant design: reward clean separation of concerns (e.g.
  a distinct removal-candidate-selection step), meaningful naming, and
  encapsulated state; penalize sprawling conditionals or exposed mutable
  internals that make the invariants hard to verify by reading.
- Reasoning quality is graded primarily from REASONING.md (per JUDGE.md's
  standard sub-reasoning criteria): does it clearly explain the tie-break
  rule (closed-first, then earliest-windowEnd, then booking-order) and the
  deliberate absence of recency tracking? Inline code comments/structure
  can supplement but do not substitute for REASONING.md; a missing
  REASONING.md still scores sub-reasoning = 0 per JUDGE.md.

### PASS/FAIL phrasings for prose-decidable checks

These help calibrate the prose-decidable portions; drive the objective
checks by running node, but use these to adjudicate borderline wording.

- obj-3 (booking-order tie-break, `check('r7',40)`):
  - PASS: "r7 was booked before k9, so among the windowEnd-300 tie r7 is
    the one removed; check('r7',40) is undefined."
  - PASS: "the earlier booking (r7) loses the tie and is evicted, leaving
    k9; r7 reads back as undefined."
  - PASS: "tie on windowEnd 300 broken by booking order → r7 removed."
  - FAIL: "r7 is the most recently touched, so it survives and k9 is
    removed" (recency reasoning — wrong construct).
  - FAIL: "k9 is removed because it was booked last among the tie"
    (latest-booked tie-break — inverted rule).
  - FAIL: "check('r7',40) returns 'alpha'" (r7 was evicted; must be
    undefined).
- obj-4 (no recency on check):
  - PASS: "interposing check('r7',20) does not change the removal
    outcome; final ids remain {k9,t4,w1}."
  - PASS: "check never marks a pass as recently used, so the direct probe
    still removes m2 and leaves {k9,r7,t4}."
  - PASS: "reads are pure — eviction depends only on windowEnd and
    booking order, never on inspection."
  - FAIL: "after checking m2 it becomes most-recently-used and is spared,
    so r7 is removed instead" (LRU behavior).
  - FAIL: "calling check refreshes the pass so it survives the next
    eviction" (recency refresh — wrong).
  - FAIL: "the check-probe run and the no-check run end with different id
    sets" (recency leaked into eviction).
