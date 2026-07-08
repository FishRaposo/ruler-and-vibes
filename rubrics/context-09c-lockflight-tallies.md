---
test: context-09c-lockflight-tallies
canary: "platypus kudu"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "TALLY.md's 'h:' line states 6 — final value of tally-board h under value-copy semantics (h copied g when g=6, before g was rewritten to 15); an answer of 15 (live-alias trap) fails; judge confirms against the reference trace"
    - id: obj-2
      check: "TALLY.md's 'g:' line states 15 — g's final value after its last rewriting"
    - id: obj-3
      check: "TALLY.md's 'k:' line states 15 — k's final value after being set from d"
    - id: obj-4
      check: "TALLY.md contains exactly three labeled lines 'h:' 'g:' 'k:' in order and no other tally-value line that could be mistaken for an answer — judge parses the three lines with node"
    - id: obj-5
      check: "The 'h:' and 'g:' lines hold DIFFERENT values (h=6, g=15): a submission that reports h equal to g is exhibiting the live-alias error — judge confirms the two parsed values differ AND that h equals the keyed 6 (this is an independent format+distinctness gate, not a restatement of check 1, which only pins h's value)"
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

If the phrase "platypus kudu" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

### Reference trace (verified with a node interpreter against the shipped narrative)

Assignment order, in document order (all "the value X carries at this
point" snapshot semantics, never a live alias):

```
b = 6                    // baseline paddle-gear count at the tail lock
k = copy(b)   -> 6       // snapshot at the first chamber
w = 21                   // unrelated slab tally; never read from again
b = 15                   // rewritten at the third chamber
g = copy(k)   -> 6       // snapshot at the mid-flight rest
d = copy(b)   -> 15      // snapshot at the sixth step
j = 8                    // unrelated sack tally; never read from again
h = copy(g)   -> 6       // snapshot out on the summit pound
k = copy(d)   -> 15      // rewriting at the cutting entrance
g = copy(k)   -> 15      // final rewriting near the far end of the cutting
```

Final values: `b=15, w=21, j=8, d=15, k=15, g=15, h=6`. The account
never states these final values together in one place — the judge (and
the model) must replay the chain from the individual assignment
sentences scattered through the narrative.

The trap: `h` copied `g` when `g` carried 6, well before `g` was later
rewritten to 15. Under the account's explicit value-copy-at-assignment
semantics ("the value X carries at that moment" / "a snapshot, once
chalked and set aside, does not follow later changes to the board it was
copied from" — stated explicitly in the task instructions and reinforced
in the narrative after `b`'s first rewriting), `h` stays 6 permanently.
A submission reporting `h: 15` has treated `h` as a live alias to `g`
rather than a frozen snapshot — the classic live-alias error this test
targets.

### Objective check notes

- **obj-1**: 6 is correct. 15 is the live-alias trap answer.
  - PASS phrasings: `h: 6`; `h:  6`; `h:6` — any line matching
    `/^h:\s*6$/`.
  - FAIL phrasings: `h: 15` (live-alias trap); `h: 21` (grabbed the
    `w` distractor); `h: 8` (grabbed the `j` distractor).
- **obj-2**: 15 is correct — `g`'s own final rewriting (copy of `k` at
  15) happens near the end of the narrative, after `h` has already taken
  its snapshot.
  - PASS phrasings: `g: 15`; `g:15`; `g:  15`.
  - FAIL phrasings: `g: 6` (missed `g`'s final rewriting); `g: 21`;
    `g: 8`.
- **obj-3**: 15 is correct — `k` is rewritten from `d` (which carried
  15) at the cutting entrance, overwriting `k`'s earlier value of 6.
  - PASS phrasings: `k: 15`; `k:15`; `k:  15`.
  - FAIL phrasings: `k: 6` (missed `k`'s rewriting); `k: 21`; `k: 8`.
- **obj-4**: parse `TALLY.md` with node: exactly three lines matching
  `/^(h|g|k):\s*-?\d+$/` in the order h, g, k, with nothing else in the
  file (no `b:`, `d:`, `w:`, or `j:` line, and no prose).
  - PASS phrasings: the three lines `h: 6` / `g: 15` / `k: 15` and
    nothing else; the same three with only surrounding blank lines.
  - FAIL phrasings: an extra `d: 15` line appended; a leading prose
    sentence such as "Here are the final values:"; the three lines
    printed out of order (`k:` before `h:`).
- **obj-5**: an independent gate from obj-1: confirm
  `parsed.h !== parsed.g` AND `parsed.h === 6`. A submission that reports
  `h: 15, g: 15` fails this even though it might otherwise look
  internally consistent, because it collapses the snapshot/live-alias
  distinction the whole test is built around.
  - PASS phrasings: any file whose parsed `h` (6) differs from its
    parsed `g` (15).
  - FAIL phrasings: `h: 15` with `g: 15` (equal, and h wrong); `h: 6`
    with `g: 6` (equal — g not advanced to its rewriting); any file where
    `h` and `g` parse to the same number.

Check script (run standalone from the repo root with
`node check-context-09c.js path/to/TALLY.md`):

```js
// check-context-09c.js
const fs = require('fs');
const raw = fs.readFileSync(process.argv[2], 'utf8');
const lines = raw.replace(/\r\n/g, '\n').split('\n').filter(l => l.trim() !== '');
const KEY = { h: 6, g: 15, k: 15 };
const re = /^(h|g|k):\s*(-?\d+)\s*$/;
const order = [];
const parsed = {};
let extraneous = false;
for (const l of lines) {
  const m = l.match(re);
  if (!m) { extraneous = true; continue; }
  order.push(m[1]);
  parsed[m[1]] = parseInt(m[2], 10);
}
const obj4 = order.join(',') === 'h,g,k' && !extraneous && lines.length === 3;
const results = {
  'obj-1': parsed.h === KEY.h,
  'obj-2': parsed.g === KEY.g,
  'obj-3': parsed.k === KEY.k,
  'obj-4': obj4,
  'obj-5': parsed.h !== undefined && parsed.g !== undefined
           && parsed.h !== parsed.g && parsed.h === KEY.h,
};
console.log(JSON.stringify({ parsed, results }, null, 2));
```

### Subjective guidance

- **State-tracing accuracy**: does `REASONING.md` show an actual replay
  of the assignment chain in document order (ideally identifying each of
  `b`, `k`, `g`, `d`, `h`'s values at each assignment point), rather than
  asserting the three final numbers without showing the intermediate
  states?
- **Trace-report clarity**: is `TALLY.md` exactly the three requested
  lines with no hedging, and would a reader be able to audit which
  tally-board was copied from which without re-reading the whole account,
  if the reasoning file is consulted alongside it?
- **Reasoning quality**: does the reasoning explicitly notice the
  value-copy-vs-live-alias distinction and explain why `h` does not
  follow `g`'s later rewriting, or does it read as if the model guessed
  the numbers without engaging with that distinction? Also reward
  reasoning that correctly identifies `w` and `j` as distractors that
  never feed the queried chain.
