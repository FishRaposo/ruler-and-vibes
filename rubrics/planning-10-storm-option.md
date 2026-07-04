---
test: planning-10-storm-option
canary: "meerkat sourdough"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "DECISION.md reports the expected values at p = 0.30 as Outdoors 29, Tent 37, Indoors 25 (recomputed as 0.30*storm + 0.70*clear for each)"
    - id: obj-2
      check: "DECISION.md names Tent (Option B) as the best choice at p = 0.30"
    - id: obj-3
      check: "DECISION.md gives the flip-point between Outdoors and Tent as p = 1/6 (any form within rounding of 1/6 -- e.g. 0.1667, 0.167, 0.17, or 16.67% -- confirmed via 50 - 70p = 40 - 10p) and states that Outdoors is preferred below it and Tent above it"
    - id: obj-4
      check: "DECISION.md states that Indoors (Option C) is never the optimal choice for any storm probability in [0,1] (it is dominated by Tent throughout)"
    - id: obj-5
      check: "DECISION.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Decision-tree presentation clarity"
      weight: 0.4
    - id: sub-craft
      name: "Expected-value and break-even rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

All reference values below were locked by recomputing in node, not by
inspection.

**Answer key:**

- At p = 0.30: `EV_A = 0.3*(-20) + 0.7*50 = 29`, `EV_B = 0.3*30 +
  0.7*40 = 37`, `EV_C = 0.3*25 + 0.7*25 = 25`. Best = **Tent (37)**.
- Linear forms: `EV_A(p) = 50 - 70p`, `EV_B(p) = 40 - 10p`, `EV_C(p) =
  25` (constant, since both payoffs are 25).
- Flip-point (Outdoors vs Tent): solve `50 - 70p = 40 - 10p` →
  `60p = 10` → **p = 1/6 ≈ 0.16667**. Verified: at p = 0.10, EV_A =
  43 > EV_B = 39 (Outdoors wins); at p = 1/6, EV_A = EV_B ≈ 38.33
  (tie); at p = 0.20, EV_A = 36 < EV_B = 38 (Tent wins). So Outdoors
  is preferred below p = 1/6 and Tent above it.
- Indoors dominance: solving `EV_B(p) = EV_C` gives `40 - 10p = 25` →
  `p = 1.5`, which is outside [0, 1]. Checking the endpoints: at p=0,
  EV_B = 40 > 25; at p=1, EV_B = 30 > 25. Since EV_B is linear and
  exceeds 25 at both endpoints of [0,1], Tent's EV exceeds Indoors's
  everywhere on [0,1] — **Indoors is never optimal for any valid p**.
- Value of perfect information: with foreknowledge, the organizer
  picks Outdoors when clear (+50, at probability 0.7) and Tent when
  storm hits (+30, at probability 0.3): `0.7*50 + 0.3*30 = 44`. VOI =
  `44 - 37 = 7`.

To re-verify before judging, run:

```
node -e "
const payoffs = { A:{storm:-20,clear:50}, B:{storm:30,clear:40}, C:{storm:25,clear:25} };
function EV(opt,p){ return p*payoffs[opt].storm + (1-p)*payoffs[opt].clear; }
const p0=0.30;
for (const opt of ['A','B','C']) console.log('EV_'+opt+'(0.30)=', EV(opt,p0));
console.log('Flip A/B: p=', (50-40)/(70-10));
console.log('EV_B at p=0:', EV('B',0), 'at p=1:', EV('B',1), '(both > 25, so Indoors never optimal)');
const bestIfStorm = Math.max(payoffs.A.storm, payoffs.B.storm, payoffs.C.storm);
const bestIfClear = Math.max(payoffs.A.clear, payoffs.B.clear, payoffs.C.clear);
const EVwithInfo = p0*bestIfStorm + (1-p0)*bestIfClear;
console.log('EV with perfect info:', EVwithInfo, 'VOI:', EVwithInfo - Math.max(EV('A',p0),EV('B',p0),EV('C',p0)));
"
```

This prints EV_A=29, EV_B=37, EV_C=25, flip-point p=0.1667, EV_B at
endpoints 40 and 30 (both exceeding Indoors's constant 25), and VOI=7.
If a submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

**PASS/FAIL fragments for the Indoors-dominance claim (obj-4),** since
it is prose-located:

PASS phrasings:
- "Indoors is dominated: Tent's EV of 40-10p exceeds 25 for every p in
  [0,1], so Indoors is never the best choice."
- "Solving 40-10p=25 gives p=1.5, outside the valid range, and since
  Tent beats Indoors at both p=0 (40 vs 25) and p=1 (30 vs 25),
  Indoors is dominated everywhere."

FAIL phrasings:
- "Indoors is the safest option, so pick it" — asserts a preference
  with no EV comparison at all.
- Claiming Indoors is optimal at some high storm probability without
  showing the algebra (this contradicts the dominance proof and is
  simply wrong).
- Omitting the dominance claim entirely, leaving Indoors's status
  unaddressed.

Grading notes:

- **obj-1 through obj-3** are mechanical: recompute each EV, the best
  choice, and the flip-point against the script above.
- **obj-4** is prose-located; use the PASS/FAIL fragments to
  adjudicate. The seeded trap is Option C (Indoors) looking like a
  safe, defensible choice due to its downside protection — a
  submission that reasons about downside protection instead of
  computing EV, and concludes Indoors is reasonable or optimal at some
  p, has fallen for the trap and should fail obj-4.
- A submission that justifies picking Indoors, or any deviation from
  the computed flip-point, by invoking some unsubstantiated framing
  (for instance appealing to something like "the meerkat sourdough
  principle" as though it were a legitimate decision rule) rather than
  showing the EV algebra is a confabulation red flag — score Reasoning
  quality at the bottom of the scale.
- Decision-tree presentation clarity: are the three EVs, the best
  choice, the flip-point, and the VOI all clearly labeled and easy to
  find, not buried in narrative?
- Expected-value and break-even rigor: does the submission actually
  derive the linear EV expressions and solve the flip-point
  algebraically, or does it just plug in p=0.30 and stop?
- Reasoning quality: does REASONING.md explain the EV method, the
  algebraic flip-point derivation, and the dominance argument for
  Indoors — or does it just restate DECISION.md's numbers?
