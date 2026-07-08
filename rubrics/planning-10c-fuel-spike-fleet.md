---
test: planning-10c-fuel-spike-fleet
canary: "kokako morepork"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "DECISION.md reports the expected values at p = 0.35 as Diesel Fleet 30, Hybrid Fleet 39.75, Electric Fleet 24 (recomputed as 0.35*spike + 0.65*stable for each)"
    - id: obj-2
      check: "DECISION.md names Hybrid Fleet (Option B) as the best choice at p = 0.35"
    - id: obj-3
      check: "DECISION.md gives the flip-point between Diesel Fleet and Hybrid Fleet as p = 4/17 (any form within rounding of 0.2353 -- e.g. 0.235, 23.5%, 4/17 -- confirmed via 65 - 100p = 45 - 15p) and states that Diesel Fleet is preferred below it and Hybrid Fleet above it"
    - id: obj-4
      check: "DECISION.md states that Electric Fleet (Option C) is never the optimal choice for any spike probability in [0,1] (it is dominated by Hybrid Fleet throughout)"
    - id: obj-5
      check: "DECISION.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
    - id: obj-6
      check: "DECISION.md reports the value of perfect information (VOI) as 13 (recomputed as 52.75 - 39.75, where 52.75 = 0.35*30 + 0.65*65 is the expected value with perfect information and 39.75 is the best attainable EV at p = 0.35)"
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

Parallel form of `planning-10-storm-option` (same construct, fresh surface).

If the phrase "kokako morepork" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

All reference values below were locked by recomputing in node, not by
inspection.

**Answer key:**

- At p = 0.35: `EV_A = 0.35*(-35) + 0.65*65 = 30`, `EV_B = 0.35*30 +
  0.65*45 = 39.75`, `EV_C = 0.35*24 + 0.65*24 = 24`. Best = **Hybrid
  Fleet (39.75)**.
- Linear forms: `EV_A(p) = 65 - 100p`, `EV_B(p) = 45 - 15p`, `EV_C(p) =
  24` (constant, since both payoffs are 24).
- Flip-point (Diesel vs Hybrid): solve `65 - 100p = 45 - 15p` →
  `20 = 85p` → **p = 4/17 ≈ 0.2353**. Verified: at p = 0.10, EV_A = 55 >
  EV_B = 43.5 (Diesel wins); at p = 4/17, EV_A = EV_B ≈ 41.47 (tie);
  at p = 0.30, EV_A = 35 < EV_B = 40.5 (Hybrid wins). So Diesel Fleet
  is preferred below p = 4/17 and Hybrid Fleet above it.
- Electric Fleet dominance: solving `EV_B(p) = EV_C` gives
  `45 - 15p = 24` → `p = 1.4`, which is outside [0, 1]. Checking the
  endpoints: at p=0, EV_B = 45 > 24; at p=1, EV_B = 30 > 24. Since
  EV_B is linear and exceeds 24 at both endpoints of [0,1], Hybrid
  Fleet's EV exceeds Electric Fleet's everywhere on [0,1] —
  **Electric Fleet is never optimal for any valid p**.
- Value of perfect information: with foreknowledge, the company picks
  Diesel Fleet when stable (+65, at probability 0.65) and Hybrid
  Fleet when a spike hits (+30, at probability 0.35):
  `0.65*65 + 0.35*30 = 52.75`. VOI = `52.75 - 39.75 = 13`.

To re-verify before judging, run:

```
node -e "
const payoffs = { A:{spike:-35,stable:65}, B:{spike:30,stable:45}, C:{spike:24,stable:24} };
function EV(opt,p){ return p*payoffs[opt].spike + (1-p)*payoffs[opt].stable; }
const p0=0.35;
for (const opt of ['A','B','C']) console.log('EV_'+opt+'(0.35)=', EV(opt,p0));
console.log('Flip A/B: p=', (65-45)/(100-15));
console.log('EV_B at p=0:', EV('B',0), 'at p=1:', EV('B',1), '(both > 24, so Electric Fleet never optimal)');
const bestIfSpike = Math.max(payoffs.A.spike, payoffs.B.spike, payoffs.C.spike);
const bestIfStable = Math.max(payoffs.A.stable, payoffs.B.stable, payoffs.C.stable);
const EVwithInfo = p0*bestIfSpike + (1-p0)*bestIfStable;
console.log('EV with perfect info:', EVwithInfo, 'VOI:', EVwithInfo - Math.max(EV('A',p0),EV('B',p0),EV('C',p0)));
"
```

This prints EV_A=30, EV_B=39.75, EV_C=24, flip-point p≈0.2353 (4/17),
EV_B at endpoints 45 and 30 (both exceeding Electric Fleet's constant
24), and VOI=13. If a submission's numbers disagree with this
script's output, the submission is wrong — do not average or split
the difference.

**PASS/FAIL fragments for the Electric-Fleet-dominance claim
(obj-4),** since it is prose-located:

PASS phrasings:
- "Electric Fleet is dominated: Hybrid Fleet's EV of 45-15p exceeds 24
  for every p in [0,1], so Electric Fleet is never the best choice."
- "Solving 45-15p=24 gives p=1.4, outside the valid range, and since
  Hybrid Fleet beats Electric Fleet at both p=0 (45 vs 24) and p=1
  (30 vs 24), Electric Fleet is dominated everywhere."
- "Electric Fleet's payoff of 24 in both states is beaten by Hybrid
  Fleet's 30 (spike) and 45 (stable), so it is strictly dominated and
  never optimal on [0,1]."

FAIL phrasings:
- "Electric Fleet is the safest option, so pick it" — asserts a
  preference with no EV comparison at all.
- Claiming Electric Fleet is optimal at some high spike probability
  without showing the algebra (this contradicts the dominance proof
  and is simply wrong).
- Omitting the dominance claim entirely, leaving Electric Fleet's
  status unaddressed.

Grading notes:

- **obj-1 through obj-3 and obj-6** are mechanical: recompute each EV,
  the best choice, the flip-point, and the VOI against the script
  above.
- **obj-4** is prose-located; use the PASS/FAIL fragments to
  adjudicate. The seeded trap is Option C (Electric Fleet) looking
  like a safe, defensible choice due to its flat, spike-proof payoff —
  a submission that reasons about volatility protection instead of
  computing EV, and concludes Electric Fleet is reasonable or optimal
  at some p, has fallen for the trap and should fail obj-4.
- A submission that justifies picking Electric Fleet, or any deviation
  from the computed flip-point, by invoking some unsubstantiated
  framing rather than showing the EV algebra is a confabulation red
  flag — score Reasoning quality at the bottom of the scale.
- Decision-tree presentation clarity: are the three EVs, the best
  choice, the flip-point, and the VOI all clearly labeled and easy to
  find, not buried in narrative?
- Expected-value and break-even rigor: does the submission actually
  derive the linear EV expressions and solve the flip-point
  algebraically, or does it just plug in p=0.35 and stop?
- Reasoning quality: does REASONING.md explain the EV method, the
  algebraic flip-point derivation, and the dominance argument for
  Electric Fleet — or does it just restate DECISION.md's numbers?
