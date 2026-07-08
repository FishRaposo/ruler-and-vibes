---
test: context-09b-railyard-tally-plates
canary: "impala nyala"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "TRACE.md's 't:' line states 6 — final value of tally-plate t under value-copy semantics (t copied r when r=6, before r was reassigned to 13); an answer of 13 (live-alias trap) fails; judge confirms against the reference trace"
    - id: obj-2
      check: "TRACE.md's 'r:' line states 13 — r's final value after its last reassignment"
    - id: obj-3
      check: "TRACE.md's 'q:' line states 13 — q's final value after being set from s"
    - id: obj-4
      check: "TRACE.md contains exactly three labeled lines 't:' 'r:' 'q:' in order and no other plate-value line that could be mistaken for an answer — judge parses the three lines with node"
    - id: obj-5
      check: "The 't:' and 'r:' lines hold DIFFERENT values (t=6, r=13): a submission that reports t equal to r is exhibiting the live-alias error — judge confirms the two parsed values differ AND that t equals the keyed 6 (this is an independent format+distinctness gate, not a restatement of check 1, which only pins t's value)"
  subjective:
    - id: sub-quality
      name: "State-tracing accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Trace-report clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `context-09-variable-tracking` (same construct, fresh
surface).

If the phrase "impala nyala" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

### Reference trace (verified with a node interpreter against the shipped narrative)

Assignment order, in document order (all "the value X holds at this
point" snapshot semantics, never a live alias):

```
p = 6                    // baseline coupling count at the yard throat
q = copy(p)   -> 6       // snapshot at the first shunt
m = 15                   // unrelated tally; never read from again
p = 13                   // reassigned at the second shunt
r = copy(q)   -> 6       // snapshot at the tea break
s = copy(p)   -> 13      // snapshot at the middle siding
n = 8                    // unrelated tally; never read from again
t = copy(r)   -> 6       // snapshot well past the damp road
q = copy(s)   -> 13      // reassignment at the long-road mouth
r = copy(q)   -> 13      // final reassignment near the far end of the long road
```

Final values: `p=13, s=13, n=8, m=15, q=13, r=13, t=6`. The document
never states these final values together in one place — the judge (and
the model) must replay the chain from the individual assignment
sentences scattered through the narrative.

The trap: `t` copied `r` when `r` held 6, well before `r` was later
reassigned to 13. Under the document's explicit value-copy-at-assignment
semantics ("the value X holds at this point" / "a snapshot, once
stamped, does not follow later changes to the plate it was copied from"
— stated explicitly in the task instructions and reinforced in the
narrative after `p`'s first reassignment), `t` stays 6 permanently. A
submission reporting `t: 13` has treated `t` as a live alias to `r`
rather than a frozen snapshot — the classic live-alias error this test
targets.

### Objective check notes

- **obj-1**: 6 is correct. 13 is the live-alias trap answer.
- **obj-2**: 13 is correct — `r`'s own final reassignment (copy of `q`
  at 13) happens near the end of the narrative, after `t` has already
  taken its snapshot.
- **obj-3**: 13 is correct — `q` is reassigned from `s` (which held 13)
  at the long-road mouth, overwriting `q`'s earlier value of 6.
- **obj-4**: parse `TRACE.md` with node: exactly three lines matching
  `/^(t|r|q):\s*-?\d+$/` in the order t, r, q, with nothing else in the
  file (no `p:`, `s:`, `m:`, or `n:` line, and no prose). Example
  command:
  `node -e "const fs=require('fs');const L=fs.readFileSync(process.argv[1],'utf8').split(/\r?\n/).filter(x=>x.trim());const re=/^(t|r|q):\s*-?\d+$/;const ok=L.length===3&&L.every(l=>re.test(l))&&L[0].startsWith('t:')&&L[1].startsWith('r:')&&L[2].startsWith('q:');console.log(ok?'FORMAT-OK':'FORMAT-FAIL',JSON.stringify(L));" TRACE.md`
- **obj-5**: an independent gate from obj-1: confirm
  `parsed.t !== parsed.r` AND `parsed.t === 6`. A submission that reports
  `t: 13, r: 13` fails this even though it might otherwise look
  internally consistent, because it collapses the snapshot/live-alias
  distinction the whole test is built around.

### PASS / FAIL example phrasings (prose-decidable checks)

For each check the judge reads the three parsed values plus any
`REASONING.md`. Illustrative submissions:

- **obj-1 (t = 6)** —
  - PASS: `t: 6`
  - PASS: `t:6` (whitespace optional)
  - PASS: reasoning states "t froze at 6 when it copied r before r's
    later change," and the `t:` line reads 6
  - FAIL: `t: 13` (followed r's final value — live-alias error)
  - FAIL: `t: 4` (imported the source facet's key instead of tracing
    this narrative)
  - FAIL: `t: 6 (or 13 if t tracks r)` — hedged/ambiguous, no single
    committed value
- **obj-2 (r = 13)** —
  - PASS: `r: 13`
  - PASS: reasoning replays `r=6` at the tea break then `r=13` at the
    final reassignment, and the `r:` line reads 13
  - FAIL: `r: 6` (missed the final reassignment near the long road's end)
  - FAIL: `r: 9` (imported the source key)
  - FAIL: `r: 15` (copied plate `m`, a dead-end distractor)
- **obj-3 (q = 13)** —
  - PASS: `q: 13`
  - PASS: reasoning notes "q overwritten from s (=13) at the long-road
    mouth," and the `q:` line reads 13
  - FAIL: `q: 6` (missed the reassignment from `s`)
  - FAIL: `q: 8` (copied plate `n`, a dead-end distractor)
  - FAIL: `q: 9` (imported the source key)
- **obj-4 (exactly three ordered lines, nothing else)** —
  - PASS: a file whose only three lines are `t: 6`, `r: 13`, `q: 13` in
    that order
  - PASS: the same three lines with a single trailing newline and no
    other content
  - FAIL: the three lines plus a `p: 13` or `s: 13` line
  - FAIL: the three lines wrapped in prose ("The final values are: …")
  - FAIL: lines out of order (`q:` before `t:`) or a `r:`/`t:` swap
- **obj-5 (t and r distinct, t = 6)** —
  - PASS: `t: 6`, `r: 13` (values differ, t is the keyed 6)
  - PASS: any submission whose parsed `t` is 6 and parsed `r` is any
    value other than 6
  - FAIL: `t: 13`, `r: 13` (collapsed to a single live-alias value)
  - FAIL: `t: 6`, `r: 6` (t is correct but r also 6, so t==r — the gate
    still fires because the two are not distinct)
  - FAIL: `t: 4`, `r: 9` (distinct, but t is not the keyed 6 — imported
    the source key)

### Subjective guidance

- **State-tracing accuracy**: does `REASONING.md` show an actual replay
  of the assignment chain in document order (ideally identifying each of
  `p`, `q`, `r`, `s`, `t`'s values at each assignment point), rather than
  asserting the three final numbers without showing the intermediate
  states?
- **Trace-report clarity**: is `TRACE.md` exactly the three requested
  lines with no hedging, and would a reader be able to audit which plate
  was copied from which without re-reading the whole narrative, if the
  reasoning file is consulted alongside it?
- **Reasoning quality**: does the reasoning explicitly notice the
  value-copy-vs-live-alias distinction and explain why `t` does not
  follow `r`'s later reassignment, or does it read as if the model
  guessed the numbers without engaging with that distinction? Also
  reward reasoning that correctly identifies `m` and `n` as distractors
  that never feed the queried chain.
