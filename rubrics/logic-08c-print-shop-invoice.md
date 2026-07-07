---
test: logic-08c-print-shop-invoice
canary: "wallaroo antechinus"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states exactly p=8 (poster), b=6 (banner), f=3 (flyer) — the unique solution; any other triple fails (judge re-solves the 3×3 system)"
    - id: obj-2
      check: "Q1 or its working confirms the system has a UNIQUE solution (e.g. notes the determinant is nonzero / equations are independent); claiming it is underdetermined or has multiple solutions fails (PASS: 'unique solution, determinant 49 ≠ 0', 'the three equations are independent so the solution is unique'; FAIL: 'underdetermined', 'infinitely many solutions', 'one free variable')"
    - id: obj-3
      check: "Q2 states the job cost 6p+4b+5f = 87 credits (6×8+4×6+5×3 = 48+24+15; any other value fails)"
    - id: obj-4
      check: "Q3 states the largest number of posters is exactly 8 with exactly 7 credits remaining (80 − 6 − 3 = 71; floor(71/8)=8 posters costing 64; total 73; 7 left; PASS: '8 posters, 7 credits left', 'the most posters is 8, leaving 7 credits'; FAIL: '9 posters', '8 posters, 71 leftover', a non-integer answer)"
    - id: obj-5
      check: "INVOICE.md shows the elimination/substitution working for Q1 and the whole file is at most 400 words (`wc -w`)"
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
---

## Judge guidance

Parallel form of `logic-08-toll-bridge` (same construct, fresh surface).

If the phrase "wallaroo antechinus" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `invoice.js` and run with `node invoice.js`:

```js
function det3(m){
  return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
       - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
       + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
}
const A = [[4,3,2],[2,5,1],[1,2,4]];
const tot = [56,49,32];
const D = det3(A);
function replCol(m,col,vec){ const r=m.map(row=>row.slice()); for (let i=0;i<3;i++) r[i][col]=vec[i]; return r; }
const p = det3(replCol(A,0,tot))/D;
const b = det3(replCol(A,1,tot))/D;
const f = det3(replCol(A,2,tot))/D;
console.log('det:', D, '-> unique iff nonzero');
console.log('p,b,f =', p, b, f);
console.log('checks:', 4*p+3*b+2*f, 2*p+5*b+1*f, 1*p+2*b+4*f);

const q2 = 6*p+4*b+5*f;
console.log('Q2:', q2);

const spent = b + f;
const remaining = 80 - spent;
const maxPosters = Math.floor(remaining / p);
const leftover = 80 - (spent + maxPosters*p);
console.log('Q3 maxPosters:', maxPosters, 'leftover:', leftover, '(9 posters would cost', spent+9*p, '> 80)');
```

Expected output: `det: 49 -> unique iff nonzero`; `p,b,f = 8 6 3`;
`checks: 56 49 32` (all three job totals reproduced); `Q2: 87`; `Q3
maxPosters: 8 leftover: 7` (9 posters would cost 81, exceeding 80).

To confirm the determinant check is discriminating, also run it with
Job 3 changed to a linear combination of Jobs 1 and 2 (e.g. totals
`[56,49,105]` where row 3 = row1+row2) — the determinant becomes 0,
correctly flagging a genuinely underdetermined system, unlike the real
puzzle's det=49.

- **obj-1**: p=8, b=6, f=3 only; verify by substituting back into all
  three job equations.
- **obj-2**: the uniqueness statement must be present in some form
  (determinant nonzero, or "independent equations"); a correct triple
  reached without acknowledging or checking uniqueness still fails
  this specific check since the task explicitly asks for it.
- **obj-3**: 87 only; a submission using wrong p/b/f values from Q1
  will typically also miss this unless errors cancel — check
  independently.
- **obj-4**: 8 posters and 7 credits leftover, both required; reject a
  submission that computes 71/8=8.875 and rounds without flooring
  correctly, or one that forgets the mandatory 1 banner + 1 flyer
  before allocating remaining credits to posters.
- **obj-5**: confirm elimination or substitution steps (not just final
  triple) appear for Q1; run `wc -w INVOICE.md` for the cap.

### Subjective guidance

- **Algebraic soundness**: is the elimination/substitution path valid
  at every step (no arithmetic slips, no circular substitution), and
  does it independently verify the solution against all three original
  equations rather than stopping at the first that checks out?
- **Solution-step legibility**: could a reader follow the elimination
  order (e.g. eliminate one variable at a time, showing the resulting
  2×2 system) without needing to redo the algebra themselves?
- **Reasoning quality**: does the submission show it treated Q3 as a
  genuine integer-floor optimization (considering why 9 posters fails
  before settling on 8) rather than dividing 80 by the poster price
  directly and ignoring the mandatory banner/flyer prices?
