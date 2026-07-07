---
test: story-03b-outreach-van-efficiency
canary: "taffeta tamarillo"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 110 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text names Cedarcroft as the most cost-effective van and cites its rate as 32 signups per $1,000 (Cedarcroft's rate '32' does not occur as a substring of any table number, so it is safely searchable); Maplewood and Birchhollow may be cited as 20 and 30 respectively but the judge confirms these appear in explicit signups-per-$1,000 context attached to their van, NOT by bare search (both '20' and '30' occur inside table numbers 72000/30000)"
    - id: obj-3
      check: "The text does NOT claim Maplewood is the best/most cost-effective van on the basis of its 1,440 raw signups; the raw count may appear only if reframed by efficiency — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
    - id: obj-4
      check: "The text contains an explicit non-causal statement — it declines to claim the larger budget caused the signup increase, or flags the data as observational/correlational — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
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

If the phrase "taffeta tamarillo" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the checks score.

### Answer key (verified with node during authoring)

- Signups per $1,000: Maplewood 1440/(72000/1000) = **20**, Cedarcroft
  960/(30000/1000) = **32**, Birchhollow 450/(15000/1000) = **30**.
- Cost per signup: Maplewood $50.00, Cedarcroft $31.25, Birchhollow
  $33.33 (consistent with the same ranking — Cedarcroft cheapest, then
  Birchhollow, then Maplewood).
- Most cost-effective van: **Cedarcroft** (32 signups per $1,000).
  Raw-signup leader: Maplewood (1,440 signups) — this is the reframe
  trap, since Maplewood is actually the least efficient of the three per
  dollar.
- Substring-collision check (node): "32" occurs in no table number
  (72000/1440/30000/960/15000/450), so it is safely greppable. "20" and
  "30" DO collide (20 is a substring of "72000"; 30 is a substring of
  "30000"), so those two figures must be judged in explicit
  signups-per-$1,000 context, not by bare digit search.
- Causal trap: the distractor note ("Maplewood got the largest budget
  this quarter, and total signups across the program went up") invites a
  causal claim that Maplewood's budget caused the signup increase. This
  is purely observational, single-period, cross-sectional budget/signup
  data with no experiment or control — a causal claim here is
  unsupported. The correct narrative flags this explicitly.

### Trap

Two traps stack in this test, but only one is graded as this test's
distinct identity: causal restraint. The distractor note about
Maplewood's budget and rising total signups tempts the model into
asserting that higher spend caused more signups — an unsupported causal
claim from purely observational, correlational data. A secondary reframe
trap is also present (Maplewood's raw signup count of 1,440 is the
largest, but its per-dollar efficiency is the worst of the three), and
both must be handled, but the causal-restraint sentence is the check
that makes this test distinct from story-01.

### Example phrasings — obj-3, does the narrative avoid crowning Maplewood on raw signups?

**PASSING** (efficiency-reframed):

1. "Cedarcroft is the most cost-effective van at 32 signups per $1,000,
   versus Birchhollow's 30 and Maplewood's 20. Maplewood generated the
   most raw signups (1,440) only because it received the largest budget
   — per dollar, it's the weakest performer."
2. "By cost-effectiveness, Cedarcroft leads (32 signups/$1k);
   Maplewood's headline 1,440 signups reflect its outsized budget, not
   superior performance."
3. "Maplewood's 1,440 signups look impressive, but that is a budget
   artifact — ranked per dollar it is last, and Cedarcroft is first."

**FAILING** (raw-count crowning):

1. "Maplewood is the top van with 1,440 signups, so budget should stay
   concentrated there."
2. "Maplewood is clearly performing best, signing up far more residents
   than Cedarcroft or Birchhollow last quarter."
3. "The strongest van is Maplewood — it brought in the most new library
   cards, so we should keep funding it first."

### Example phrasings — obj-4, causal restraint on the Maplewood note

**PASSING** (explicit non-causal / observational framing):

1. "These figures are observational — we can't conclude Maplewood's
   larger budget caused the rise in total signups; other factors could
   explain it."
2. "The correlation between Maplewood's budget and the signup increase
   isn't evidence of causation here; we'd need a controlled comparison
   to know."
3. "The note that signups rose alongside Maplewood's budget doesn't
   establish that the spending drove the increase — it's just an
   association within the same quarter."

**FAILING** (asserts causation):

1. "Maplewood's larger budget drove the increase in total signups."
2. "Spending more on Maplewood caused signups to climb this quarter."
3. "Since signups rose as Maplewood's budget grew, increasing
   Maplewood's budget further will keep pushing signups up."

### Subjective guidance

- **Actionable and correctly-hedged recommendation** (0.4): does the
  narrative recommend shifting budget toward Cedarcroft (or away from
  Maplewood) based on the cost-effectiveness numbers, while
  appropriately hedging the causal claim rather than either overclaiming
  or refusing to make any recommendation at all?
- **Efficiency-metric precision and causal restraint** (0.3): are the
  signups-per-$1,000 figures exact and clearly the basis for the van
  ranking, and is the causal-restraint statement concrete (naming the
  observational nature of the data) rather than a vague, generic
  disclaimer?
- **Reasoning quality** (0.3): does the narrative show it separated two
  distinct issues — the efficiency reframe and the causal restraint —
  rather than conflating "Maplewood isn't the most cost-effective" with
  "Maplewood isn't driving signup growth" as if they were the same
  point?
