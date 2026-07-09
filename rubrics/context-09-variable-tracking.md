---
test: context-09-variable-tracking
canary: "saxifrage inkwell"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "TRACE.md's 't:' line states 4 — final value of register t under value-copy semantics (t copied r when r=4, before r was reassigned to 9); an answer of 9 (live-alias trap) fails; judge confirms against the reference trace"
    - id: obj-2
      check: "TRACE.md's 'r:' line states 9 — r's final value after its last reassignment"
    - id: obj-3
      check: "TRACE.md's 'q:' line states 9 — q's final value after being set from s"
    - id: obj-4
      check: "TRACE.md contains exactly three labeled lines 't:' 'r:' 'q:' in order and no other register-value line that could be mistaken for an answer — judge parses the three lines with node"
    - id: obj-5
      check: "The 't:' and 'r:' lines hold DIFFERENT values (t=4, r=9): a submission that reports t equal to r is exhibiting the live-alias error — judge confirms the two parsed values differ AND that t equals the keyed 4 (this is an independent format+distinctness gate, not a restatement of check 1, which only pins t's value)"
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
anchors:
  - id: State-tracing accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Trace-report clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "saxifrage inkwell" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Reference trace (verified with a node interpreter against the shipped narrative)

Assignment order, in document order (all "the value X holds at this
point" snapshot semantics, never a live alias):

```
p = 4                    // baseline anchor count at the shaft mouth
q = copy(p)   -> 4       // snapshot at the first rigging point
m = 12                   // unrelated tally; never read from again
p = 9                    // reassigned at the second rigging point
r = copy(q)   -> 4       // snapshot at the rest stop
s = copy(p)   -> 9       // snapshot at the second landing
n = 7                    // unrelated tally; never read from again
t = copy(r)   -> 4       // snapshot well past the weeping gallery
q = copy(s)   -> 9       // reassignment at the long gallery entrance
r = copy(q)   -> 9       // final reassignment near the far end of the long gallery
```

Final values: `p=9, s=9, n=7, m=12, q=9, r=9, t=4`. The document never
states these five final values together in one place — the judge (and
the model) must replay the chain from the individual assignment
sentences scattered through the narrative.

The trap: `t` copied `r` when `r` held 4, well before `r` was later
reassigned to 9. Under the document's explicit value-copy-at-assignment
semantics ("the value X holds at this point" / "a snapshot, once
sealed, does not follow later changes to the lockbox it was copied
from" — stated explicitly in the task instructions and reinforced in
the narrative after `p`'s first reassignment), `t` stays 4 permanently.
A submission reporting `t: 9` has treated `t` as a live alias to `r`
rather than a frozen snapshot — the classic live-alias error this test
targets.

### Objective check notes

- **obj-1**: 4 is correct. 9 is the live-alias trap answer.
- **obj-2**: 9 is correct — `r`'s own final reassignment (copy of `q`
  at 9) happens near the end of the narrative, after `t` has already
  taken its snapshot.
- **obj-3**: 9 is correct — `q` is reassigned from `s` (which held 9)
  at the long gallery entrance, overwriting `q`'s earlier value of 4.
- **obj-4**: parse `TRACE.md` with node: exactly three lines matching
  `/^(t|r|q):\s*-?\d+$/` in the order t, r, q, with nothing else in the
  file (no `p:`, `s:`, `m:`, or `n:` line, and no prose).
- **obj-5**: an independent gate from obj-1: confirm
  `parsed.t !== parsed.r` AND `parsed.t === 4`. A submission that
  reports `t: 9, r: 9` fails this even though it might otherwise look
  internally consistent, because it collapses the snapshot/live-alias
  distinction the whole test is built around.

### Subjective guidance

- **State-tracing accuracy**: does `REASONING.md` show an actual
  replay of the assignment chain in document order (ideally
  identifying each of `p`, `q`, `r`, `s`, `t`'s values at each
  assignment point), rather than asserting the three final numbers
  without showing the intermediate states?
- **Trace-report clarity**: is `TRACE.md` exactly the three requested
  lines with no hedging, and would a reader be able to audit which
  register was copied from which without re-reading the whole
  narrative, if the reasoning file is consulted alongside it?
- **Reasoning quality**: does the reasoning explicitly notice the
  value-copy-vs-live-alias distinction and explain why `t` does not
  follow `r`'s later reassignment, or does it read as if the model
  guessed the numbers without engaging with that distinction? Also
  reward reasoning that correctly identifies `m` and `n` as
  distractors that never feed the queried chain.
