---
test: story-03c-vaccination-clinic-efficiency
canary: "chenille feijoa"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 110 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text names Tarnwick as the most efficient clinic and cites its efficiency as 19 doses per $1,000 (Tarnwick's rate '19' does not occur as a substring of any table number, so it is safely searchable); Redmarsh and Marlcroft may be cited as 14 and 12 respectively but the judge confirms these appear in explicit doses-per-$1,000 context attached to their clinic, NOT by bare search ('14' occurs inside 14000 and '12' inside 112)"
    - id: obj-3
      check: "The text does NOT claim Marlcroft is the best/most efficient clinic on the basis of its 360 raw doses; the raw count may appear only if reframed by efficiency — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
    - id: obj-4
      check: "The text contains an explicit non-causal statement — it declines to claim higher spend caused the increase in total doses, or flags the data as observational/correlational — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
  subjective:
    - id: sub-quality
      name: "Actionable and correctly-hedged recommendation"
      weight: 0.4
    - id: sub-craft
      name: "Efficiency-metric precision and causal restraint"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `story-03-correlation-not-cause` (same construct, fresh
surface).

If the phrase "chenille feijoa" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

- Doses per $1,000: Marlcroft 360/(30000/1000) = **12**, Tarnwick
  266/(14000/1000) = **19**, Redmarsh 112/(8000/1000) = **14**.
- Cost per dose: Marlcroft $83.33, Tarnwick $52.63, Redmarsh $71.43
  (consistent with the same ranking — the doses-per-$1,000 order and the
  cost-per-dose order are inverses of each other, no contradiction).
- Most efficient clinic: **Tarnwick** (19 doses per $1,000). Raw-dose
  leader: Marlcroft (360 doses) — this is the reframe trap, since
  Marlcroft is actually the least efficient of the three per dollar (12
  doses per $1,000), carrying the largest budget (57.7% of total spend).
- Substring-collision check (node): "19" occurs in no table number
  (30000/360/14000/266/8000/112), so it is safely greppable. "12" and
  "14" DO collide (12 is a substring of "112"; 14 is a substring of
  "14000"), so those two figures must be judged in explicit
  doses-per-$1,000 context, not by bare digit search.
- Causal trap: the distractor note ("Marlcroft received the largest
  budget this quarter, and total doses administered rose") invites a
  causal claim that Marlcroft's spend caused the dose increase. This is
  purely observational, single-period, cross-sectional spend/dose data
  with no experiment or control — a causal claim here is unsupported.
  The correct narrative flags this explicitly.

### Trap

Two traps stack in this test, but only one is graded as this test's
distinct identity: causal restraint. The distractor note about
Marlcroft's budget and rising total doses tempts the model into
asserting that higher spend caused more doses — an unsupported causal
claim from purely observational, correlational data. A secondary reframe
trap is also present (Marlcroft's raw dose count of 360 is the largest,
but its per-dollar efficiency is the worst of the three), and both must
be handled, but the causal-restraint sentence is the check that makes
this test distinct from story-01.

### Example phrasings — obj-3, does the narrative avoid crowning Marlcroft on raw doses?

**PASSING** (efficiency-reframed):

1. "Tarnwick is the most efficient clinic at 19 doses per $1,000, versus
   Redmarsh's 14 and Marlcroft's 12. Marlcroft administered the most raw
   doses (360) only because it received the largest budget — per dollar,
   it's the weakest performer."
2. "By efficiency, Tarnwick leads (19 doses/$1k); Marlcroft's headline
   360 doses reflect its outsized budget, not superior performance."

**FAILING** (raw-count crowning):

1. "Marlcroft is the top clinic with 360 doses, so budget should stay
   concentrated there."
2. "Marlcroft is clearly performing best, administering far more doses
   than Tarnwick or Redmarsh last quarter."

### Example phrasings — obj-4, causal restraint on the Marlcroft note

**PASSING** (explicit non-causal / observational framing):

1. "These figures are observational — we can't conclude Marlcroft's
   larger budget caused the rise in total doses; other factors could
   explain it."
2. "Correlation between Marlcroft's spend and the dose increase isn't
   evidence of causation here; we'd need a controlled test to know."
3. "The note that total doses rose alongside Marlcroft's budget doesn't
   establish that the spend drove the increase — it's just an
   association in the same quarter."

**FAILING** (asserts causation):

1. "Marlcroft's larger budget drove the increase in total doses."
2. "Spending more on Marlcroft caused doses to rise this quarter."
3. "Since doses rose as Marlcroft's budget grew, increasing Marlcroft's
   budget further will keep pushing doses up."

### Subjective guidance

- **Actionable and correctly-hedged recommendation** (0.4): does the
  narrative recommend shifting budget toward Tarnwick (or away from
  Marlcroft) based on the efficiency numbers, while appropriately
  hedging the causal claim rather than either overclaiming or refusing
  to make any recommendation at all?
- **Efficiency-metric precision and causal restraint** (0.3): are the
  doses-per-$1,000 figures exact and clearly the basis for the clinic
  ranking, and is the causal-restraint statement concrete (naming the
  observational nature of the data) rather than a vague, generic
  disclaimer?
- **Reasoning quality** (0.3): does the narrative show it separated two
  distinct issues — the efficiency reframe and the causal restraint —
  rather than conflating "Marlcroft isn't the most efficient" with
  "Marlcroft isn't driving dose growth" as if they were the same point?
