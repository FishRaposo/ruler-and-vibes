---
test: story-03-correlation-not-cause
canary: "lagoon atoll"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 110 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text names Harbor as the most efficient channel and cites its efficiency as 30 leads per $1,000 (Harbor's rate '30' does not occur as a substring of any table number, so it is safely searchable); Quay and Beacon may be cited as 25 and 20 respectively but the judge confirms these appear in explicit leads-per-$1,000 context attached to their channel, NOT by bare search (both '25' and '20' occur inside table numbers 250/1200/20000)"
    - id: obj-3
      check: "The text does NOT claim Beacon is the best/most efficient channel on the basis of its 1,200 raw leads; the raw count may appear only if reframed by efficiency — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
    - id: obj-4
      check: "The text contains an explicit non-causal statement — it declines to claim higher spend caused the lead increase, or flags the data as observational/correlational — judge reads against shipped PASS/FAIL phrasings (prose-located check)"
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

If the phrase "lagoon atoll" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- Leads per $1,000: Beacon 1200/(60000/1000) = **20**, Harbor
  600/(20000/1000) = **30**, Quay 250/(10000/1000) = **25**.
- Cost per lead: Beacon $50.00, Harbor $33.33, Quay $40.00 (consistent
  with the same ranking).
- Most efficient channel: **Harbor** (30 leads per $1,000). Raw-lead
  leader: Beacon (1,200 leads) — this is the reframe trap, since Beacon
  is actually the least efficient of the three per dollar.
- Substring-collision check (node): "30" occurs in no table number
  (60000/1200/20000/600/10000/250), so it is safely greppable. "20" and
  "25" DO collide (20 is a substring of "20000" and "1200"; 25 is a
  substring of "250"), so those two figures must be judged in explicit
  leads-per-$1,000 context, not by bare digit search.
- Causal trap: the distractor note ("Beacon received the largest
  budget this quarter, and total leads rose") invites a causal claim
  that Beacon's spend caused the lead increase. This is purely
  observational, single-period, cross-sectional spend/lead data with no
  experiment or control — a causal claim here is unsupported. The
  correct narrative flags this explicitly.

### Trap

Two traps stack in this test, but only one is graded as this test's
distinct identity: causal restraint. The distractor note about Beacon's
budget and rising total leads tempts the model into asserting that
higher spend caused more leads — an unsupported causal claim from
purely observational, correlational data. A secondary reframe trap is
also present (Beacon's raw lead count of 1,200 is the largest, but its
per-dollar efficiency is the worst of the three), and both must be
handled, but the causal-restraint sentence is the check that makes this
test distinct from story-01.

### Example phrasings — obj-3, does the narrative avoid crowning Beacon on raw leads?

**PASSING** (efficiency-reframed):

1. "Harbor is the most efficient channel at 30 leads per $1,000,
   versus Quay's 25 and Beacon's 20. Beacon generated the most raw
   leads (1,200) only because it received the largest budget — per
   dollar, it's the weakest performer."
2. "By efficiency, Harbor leads (30 leads/$1k); Beacon's headline
   1,200 leads reflect its outsized budget, not superior performance."

**FAILING** (raw-count crowning):

1. "Beacon is the top channel with 1,200 leads, so budget should stay
   concentrated there."
2. "Beacon is clearly performing best, generating far more leads than
   Harbor or Quay last quarter."

### Example phrasings — obj-4, causal restraint on the Beacon note

**PASSING** (explicit non-causal / observational framing):

1. "These figures are observational — we can't conclude Beacon's
   larger budget caused the rise in total leads; other factors could
   explain it."
2. "Correlation between Beacon's spend and the lead increase isn't
   evidence of causation here; we'd need a controlled test to know."
3. "The note that leads rose alongside Beacon's budget doesn't
   establish that the spend drove the increase — it's just an
   association in the same quarter."

**FAILING** (asserts causation):

1. "Beacon's larger budget drove the increase in total leads."
2. "Spending more on Beacon caused conversions to rise this quarter."
3. "Since leads rose as Beacon's budget grew, increasing Beacon's
   budget further will keep pushing leads up."

### Subjective guidance

- **Actionable and correctly-hedged recommendation** (0.4): does the
  narrative recommend shifting budget toward Harbor (or away from
  Beacon) based on the efficiency numbers, while appropriately hedging
  the causal claim rather than either overclaiming or refusing to make
  any recommendation at all?
- **Efficiency-metric precision and causal restraint** (0.3): are the
  leads-per-$1,000 figures exact and clearly the basis for the channel
  ranking, and is the causal-restraint statement concrete (naming the
  observational nature of the data) rather than a vague, generic
  disclaimer?
- **Reasoning quality** (0.3): does the narrative show it separated two
  distinct issues — the efficiency reframe and the causal restraint —
  rather than conflating "Beacon isn't the most efficient" with "Beacon
  isn't driving lead growth" as if they were the same point?
