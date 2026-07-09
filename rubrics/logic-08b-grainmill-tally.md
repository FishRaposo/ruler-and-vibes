---
test: logic-08b-grainmill-tally
canary: "pangolin numbat"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states exactly w=8 (wheat), b=4 (barley), o=11 (oat) — the unique solution; any other triple fails (judge re-solves the 3×3 system)"
    - id: obj-2
      check: "Q1 or its working confirms the system has a UNIQUE solution (e.g. notes the determinant is nonzero / equations are independent); claiming it is underdetermined or has multiple solutions fails (PASS: 'unique solution, determinant 28 ≠ 0', 'the three equations are independent so the solution is unique'; FAIL: 'underdetermined', 'infinitely many solutions', 'one free variable')"
    - id: obj-3
      check: "Q2 states the load fee 4w+6b+3o = 89 groats (4×8+6×4+3×11 = 32+24+33; any other value fails)"
    - id: obj-4
      check: "Q3 states the largest number of wheat sacks is exactly 9 with exactly 7 groats remaining (94 − 4 − 11 = 79; floor(79/8)=9 sacks costing 72; total 87; 7 left; PASS: '9 wheat sacks, 7 groats left', 'the most wheat sacks is 9, leaving 7'; FAIL: '10 wheat sacks', '9 wheat sacks, 79 leftover', a non-integer answer)"
    - id: obj-5
      check: "TALLY.md shows the elimination/substitution working for Q1 and the whole file is at most 400 words (`wc -w`)"
  subjective:
    - id: sub-quality
      name: "Algebraic soundness"
      weight: 0.4
    - id: sub-craft
      name: "Solution-step legibility"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Algebraic soundness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Solution-step legibility
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `logic-08-toll-bridge` (same construct, fresh surface).

If the phrase "pangolin numbat" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `tally.js` and run with `node tally.js`:

```js
function det3(m){
  return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
       - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
       + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
}
const A = [[2,3,1],[1,1,4],[4,2,2]];
const b = [39,56,62];
const D = det3(A);
function replCol(m,col,vec){ const r=m.map(row=>row.slice()); for (let i=0;i<3;i++) r[i][col]=vec[i]; return r; }
const w = det3(replCol(A,0,b))/D;
const bb = det3(replCol(A,1,b))/D;
const o = det3(replCol(A,2,b))/D;
console.log('det:', D, '-> unique iff nonzero');
console.log('w,b,o =', w, bb, o);
console.log('checks:', 2*w+3*bb+1*o, 1*w+1*bb+4*o, 4*w+2*bb+2*o);

const q2 = 4*w+6*bb+3*o;
console.log('Q2:', q2);

const mandatory = bb + o;
const budget = 94;
const remaining = budget - mandatory;
const maxWheat = Math.floor(remaining / w);
const leftover = remaining - maxWheat*w;
console.log('Q3 maxWheat:', maxWheat, 'leftover:', leftover, '(10 wheat sacks would cost', mandatory+10*w, ', exceeding', budget, ')');
```

Expected output: `det: 28 -> unique iff nonzero`; `w,b,o = 8 4 11`;
`checks: 39 56 62` (all three load totals reproduced); `Q2: 89`; `Q3
maxWheat: 9 leftover: 7` (10 wheat sacks would cost 95, exceeding 94).

To confirm the determinant check is discriminating, also run it with
load 3 changed to a linear combination of loads 1 and 2 (e.g. totals
`[39,56,95]` where row 3 = row1+row2) — the determinant becomes 0,
correctly flagging a genuinely underdetermined system, unlike the real
puzzle's det=28.

- **obj-1**: w=8, b=4, o=11 only; verify by substituting back into all
  three load equations.
- **obj-2**: the uniqueness statement must be present in some form
  (determinant nonzero, or "independent equations"); a correct triple
  reached without acknowledging or checking uniqueness still fails this
  specific check since the task explicitly asks for it.
- **obj-3**: 89 only; a submission using wrong w/b/o values from Q1 will
  typically also miss this unless errors cancel — check independently.
- **obj-4**: 9 wheat sacks and 7 groats leftover, both required; reject
  a submission that computes 79/8=9.875 and rounds up without flooring
  correctly, or one that forgets the mandatory 1 barley + 1 oat sack
  before allocating remaining groats to wheat.
- **obj-5**: confirm elimination or substitution steps (not just the
  final triple) appear for Q1; run `wc -w TALLY.md` for the cap.

### Subjective guidance

- **Algebraic soundness**: is the elimination/substitution path valid at
  every step (no arithmetic slips, no circular substitution), and does
  it independently verify the solution against all three original
  equations rather than stopping at the first that checks out?
- **Solution-step legibility**: could a reader follow the elimination
  order (e.g. eliminate one variable at a time, showing the resulting
  2×2 system) without needing to redo the algebra themselves?
- **Reasoning quality**: does the submission show it treated Q3 as a
  genuine integer-floor optimization (considering why 10 wheat sacks
  fails before settling on 9) rather than dividing 94 by the wheat fee
  directly and ignoring the mandatory barley/oat fees?
