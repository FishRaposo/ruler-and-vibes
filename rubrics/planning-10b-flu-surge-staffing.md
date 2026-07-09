---
test: planning-10b-flu-surge-staffing
canary: "saddleback stitchbird"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "DECISION.md reports the expected values at r = 0.40 as Lean Roster 24, Flex Pool 31, Max Roster 20 (recomputed as 0.40*surge + 0.60*typical for each)"
    - id: obj-2
      check: "DECISION.md names Flex Pool (Option B) as the best choice at r = 0.40"
    - id: obj-3
      check: "DECISION.md gives the flip-point between Lean Roster and Flex Pool as r = 5/16 (any form within rounding of 5/16 -- e.g. 0.3125, 0.313, 31.25% -- confirmed via 60 - 90r = 35 - 10r) and states that Lean Roster is preferred below it and Flex Pool above it"
    - id: obj-4
      check: "DECISION.md states that Max Roster (Option C) is never the optimal choice for any surge probability in [0,1] (it is dominated by Flex Pool throughout)"
    - id: obj-5
      check: "DECISION.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
    - id: obj-6
      check: "DECISION.md reports the value of perfect information as exactly 15 (EV with perfect info = 0.6*60 + 0.4*25 = 46, minus the best EV at r=0.40 of 31, i.e. VOI = 46 - 31 = 15; recomputed via the embedded node script), accepting equivalent exact forms (15, 15k, $15k, etc.)"
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
anchors:
  - id: Decision-tree presentation clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Expected-value and break-even rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `planning-10-storm-option` (same construct, fresh
surface).

All reference values below were locked by recomputing in node, not by
inspection.

**Answer key:**

- At r = 0.40: `EV_A = 0.4*(-30) + 0.6*60 = 24`, `EV_B = 0.4*25 +
  0.6*35 = 31`, `EV_C = 0.4*20 + 0.6*20 = 20`. Best = **Flex Pool (31)**.
- Linear forms: `EV_A(r) = 60 - 90r`, `EV_B(r) = 35 - 10r`, `EV_C(r) =
  20` (constant, since both payoffs are 20).
- Flip-point (Lean Roster vs Flex Pool): solve `60 - 90r = 35 - 10r`
  → `25 = 80r` → **r = 5/16 = 0.3125**. Verified: at r = 0.25,
  EV_A = 37.5 > EV_B = 32.5 (Lean Roster wins); at r = 5/16,
  EV_A = EV_B = 31.875 (tie); at r = 0.35, EV_A = 28.5 < EV_B = 31.5
  (Flex Pool wins). So Lean Roster is preferred below r = 5/16 and
  Flex Pool above it.
- Max Roster dominance: solving `EV_B(r) = EV_C` gives `35 - 10r = 20`
  → `r = 1.5`, which is outside [0, 1]. Checking the endpoints: at
  r=0, EV_B = 35 > 20; at r=1, EV_B = 25 > 20. Since EV_B is linear
  and exceeds 20 at both endpoints of [0,1], Flex Pool's EV exceeds
  Max Roster's everywhere on [0,1] — **Max Roster is never optimal
  for any valid r**.
- Value of perfect information: with foreknowledge, the network picks
  Lean Roster when the season is typical (+60, at probability 0.6)
  and Flex Pool when a surge hits (+25, at probability 0.4):
  `0.6*60 + 0.4*25 = 46`. VOI = `46 - 31 = 15`.

To re-verify before judging, run:

```
node -e "
const payoffs = { A:{surge:-30,typical:60}, B:{surge:25,typical:35}, C:{surge:20,typical:20} };
function EV(opt,r){ return r*payoffs[opt].surge + (1-r)*payoffs[opt].typical; }
const r0=0.40;
for (const opt of ['A','B','C']) console.log('EV_'+opt+'(0.40)=', EV(opt,r0));
console.log('Flip A/B: r=', (60-35)/(90-10));
console.log('EV_B at r=0:', EV('B',0), 'at r=1:', EV('B',1), '(both > 20, so Max Roster never optimal)');
const bestIfSurge = Math.max(payoffs.A.surge, payoffs.B.surge, payoffs.C.surge);
const bestIfTypical = Math.max(payoffs.A.typical, payoffs.B.typical, payoffs.C.typical);
const EVwithInfo = r0*bestIfSurge + (1-r0)*bestIfTypical;
console.log('EV with perfect info:', EVwithInfo, 'VOI:', EVwithInfo - Math.max(EV('A',r0),EV('B',r0),EV('C',r0)));
"
```

This prints EV_A=24, EV_B=31, EV_C=20, flip-point r=0.3125, EV_B at
endpoints 35 and 25 (both exceeding Max Roster's constant 20), and
VOI=15. If a submission's numbers disagree with this script's output,
the submission is wrong — do not average or split the difference.

**PASS/FAIL fragments for the Max-Roster-dominance claim (obj-4),**
since it is prose-located:

PASS phrasings:
- "Max Roster is dominated: Flex Pool's EV of 35-10r exceeds 20 for
  every r in [0,1], so Max Roster is never the best choice."
- "Solving 35-10r=20 gives r=1.5, outside the valid range, and since
  Flex Pool beats Max Roster at both r=0 (35 vs 20) and r=1 (25 vs
  20), Max Roster is dominated everywhere."
- "Because EV_B(r) is a decreasing line running from 35 down to 25,
  both above Max Roster's flat 20, Max Roster can never be optimal on
  [0,1]."

FAIL phrasings:
- "Max Roster is the steady, fully-staffed option, so pick it" —
  asserts a preference with no EV comparison at all.
- Claiming Max Roster is optimal at some high surge probability
  without showing the algebra (this contradicts the dominance proof
  and is simply wrong).
- Omitting the dominance claim entirely, leaving Max Roster's status
  unaddressed.

Grading notes:

- **obj-1 through obj-3 and obj-6** are mechanical: recompute each EV,
  the best choice, the flip-point, and the VOI against the script
  above.
- **obj-4** is prose-located; use the PASS/FAIL fragments to
  adjudicate. The seeded trap is Option C (Max Roster) looking like a
  safe, defensible choice because it is fully staffed no matter what
  happens — a submission that reasons about staffing security instead
  of computing EV, and concludes Max Roster is reasonable or optimal
  at some r, has fallen for the trap and should fail obj-4.
- If the phrase "saddleback stitchbird" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Decision-tree presentation clarity: are the three EVs, the best
  choice, the flip-point, and the VOI all clearly labeled and easy to
  find, not buried in narrative?
- Expected-value and break-even rigor: does the submission actually
  derive the linear EV expressions and solve the flip-point
  algebraically, or does it just plug in r=0.40 and stop?
- Reasoning quality: does REASONING.md explain the EV method, the
  algebraic flip-point derivation, and the dominance argument for Max
  Roster — or does it just restate DECISION.md's numbers?
