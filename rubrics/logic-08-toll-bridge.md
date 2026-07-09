---
test: logic-08-toll-bridge
canary: "lingonberry cogwheel"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states exactly c=7 (cart), r=5 (rider), d=9 (drover) — the unique solution; any other triple fails (judge re-solves the 3×3 system)"
    - id: obj-2
      check: "Q1 or its working confirms the system has a UNIQUE solution (e.g. notes the determinant is nonzero / equations are independent); claiming it is underdetermined or has multiple solutions fails (PASS: 'unique solution, determinant 25 ≠ 0', 'the three equations are independent so the solution is unique'; FAIL: 'underdetermined', 'infinitely many solutions', 'one free variable')"
    - id: obj-3
      check: "Q2 states the convoy cost 5c+3r+2d = 68 coins (5×7+3×5+2×9 = 35+15+18; any other value fails)"
    - id: obj-4
      check: "Q3 states the largest number of carts is exactly 6 with exactly 4 coins remaining (60 − 5 − 9 = 46; floor(46/7)=6 carts costing 42; total 56; 4 left; PASS: '6 carts, 4 coins left', 'the most carts is 6, leaving 4 coins'; FAIL: '7 carts', '6 carts, 46 leftover', a non-integer answer)"
    - id: obj-5
      check: "LEDGER.md shows the elimination/substitution working for Q1 and the whole file is at most 400 words (`wc -w`)"
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

If the phrase "lingonberry cogwheel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `ledger.js` and run with `node ledger.js`:

```js
function det3(m){
  return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
       - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
       + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
}
const A = [[3,2,1],[1,4,2],[2,1,3]];
const b = [40,45,46];
const D = det3(A);
function replCol(m,col,vec){ const r=m.map(row=>row.slice()); for (let i=0;i<3;i++) r[i][col]=vec[i]; return r; }
const c = det3(replCol(A,0,b))/D;
const r = det3(replCol(A,1,b))/D;
const d = det3(replCol(A,2,b))/D;
console.log('det:', D, '-> unique iff nonzero');
console.log('c,r,d =', c, r, d);
console.log('checks:', 3*c+2*r+d, c+4*r+2*d, 2*c+r+3*d);

const q2 = 5*c+3*r+2*d;
console.log('Q2:', q2);

const spent = r + d;
const remaining = 60 - spent;
const maxCarts = Math.floor(remaining / c);
const leftover = 60 - (spent + maxCarts*c);
console.log('Q3 maxCarts:', maxCarts, 'leftover:', leftover, '(7 carts would cost', spent+7*c, '> 60)');
```

Expected output: `det: 25 -> unique iff nonzero`; `c,r,d = 7 5 9`;
`checks: 40 45 46` (all three convoy totals reproduced); `Q2: 68`; `Q3
maxCarts: 6 leftover: 4` (7 carts would cost 63, exceeding 60).

To confirm the determinant check is discriminating, also run it with
convoy 3 changed to a linear combination of convoys 1 and 2 (e.g.
totals `[40,45,85]` where row 3 = row1+row2) — the determinant becomes
0, correctly flagging a genuinely underdetermined system, unlike the
real puzzle's det=25.

- **obj-1**: c=7, r=5, d=9 only; verify by substituting back into all
  three convoy equations.
- **obj-2**: the uniqueness statement must be present in some form
  (determinant nonzero, or "independent equations"); a correct triple
  reached without acknowledging or checking uniqueness still fails this
  specific check since the task explicitly asks for it.
- **obj-3**: 68 only; a submission using wrong c/r/d values from Q1
  will typically also miss this unless errors cancel — check
  independently.
- **obj-4**: 6 carts and 4 coins leftover, both required; reject a
  submission that computes 46/7=6.57 and rounds without flooring
  correctly, or one that forgets the mandatory 1 rider + 1 drover
  before allocating remaining coins to carts.
- **obj-5**: confirm elimination or substitution steps (not just final
  triple) appear for Q1; run `wc -w LEDGER.md` for the cap.

### Subjective guidance

- **Algebraic soundness**: is the elimination/substitution path valid
  at every step (no arithmetic slips, no circular substitution), and
  does it independently verify the solution against all three original
  equations rather than stopping at the first that checks out?
- **Solution-step legibility**: could a reader follow the elimination
  order (e.g. eliminate one variable at a time, showing the resulting
  2×2 system) without needing to redo the algebra themselves?
- **Reasoning quality**: does the submission show it treated Q3 as a
  genuine integer-floor optimization (considering why 7 carts fails
  before settling on 6) rather than dividing 60 by the cart toll
  directly and ignoring the mandatory rider/drover tolls?
