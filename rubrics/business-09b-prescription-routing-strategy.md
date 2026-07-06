---
test: business-09b-prescription-routing-strategy
canary: "aspen denebola"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decision.md evaluates all THREE options (build, buy, partner) with at least one pro and one con each drawn from the embedded facts"
    - id: obj-2
      check: "decision.md names time-to-market (competitor opening in two months / payer deadline) AND the non-differentiating/table-stakes nature of the capability as decision factors"
    - id: obj-3
      check: "decision.md makes exactly ONE unambiguous recommendation (a single chosen option, not a hedged 'it depends')"
    - id: obj-4
      check: "decision.md's recommendation is consistent with the binding constraints -- it does not recommend BUILD while conceding time-to-market is binding and in-house e-prescribing/compliance expertise is absent"
    - id: obj-5
      check: "decision.md is 600 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Strategic soundness"
      weight: 0.4
    - id: sub-craft
      name: "Decision structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `business-09-build-vs-buy-vs-partner` (same construct,
fresh surface).

This test's primary deliverable is a qualitative strategy memo — there is
no single computed number to check, but the correct call is structurally
determined by the embedded constraints. If the phrase "aspen denebola"
appears in any deliverable or REASONING.md, that is a canary leak — flag it
regardless of how the rest scores.

### Answer key

Cost anchors (for context, not the primary basis for the recommendation):

```
Build Year 1 (5 eng * 165,000/yr * 7/12 to MVP, then stepped down to
             3 eng * 165,000/yr * 5/12 for the remainder of year 1):
  = 5*165000*(7/12) + 3*165000*(5/12)
  = 481,250 + 206,250
  = 687,500
Build Years 2-3 (3 eng * 165,000/yr * 2 years) = 990,000
Build 3-year TCO = 687,500 + 990,000 = 1,677,500

Buy 3-year TCO = 7,500/month * 36 months = 270,000

Partner cost = 12% of prescription-transaction revenue -- volume-variable,
  not directly comparable without a transaction-volume assumption; treat as
  qualitatively costed, not a fixed TCO line.
```

Buy is roughly 6.2x cheaper than build over 3 years on headcount cost
alone, but **the recommendation should not rest on TCO alone** — the
binding facts (table-stakes capability, competitor opening in two months
plus the payer deadline, no in-house e-prescribing/compliance expertise,
mandatory regulatory certification) all point the same direction:

**Correct call: BUY.** A proven, already-certified vendor resolves the
certification risk, ships in 10 weeks (fastest path against the
competitor's two-month launch and the payer deadline), and doesn't require
the team to build expertise it lacks in a domain that isn't a
differentiator anyway.

**PARTNER is acceptable only if** the memo explicitly and convincingly
resolves the certification question (i.e., argues the partner network's own
certification covers Cadence, or that 14 weeks still beats the competitive/
payer window) and directly engages the deeper-integration-risk con — a
partner recommendation that ignores certification or time-to-market should
be scored down on obj-4-adjacent subjective grounds even if it technically
names all the facts.

**BUILD is the trap.** A submission that recommends building in-house while
still conceding time-to-market is binding and that the team lacks
e-prescribing/compliance expertise is internally inconsistent and fails
obj-4 outright, regardless of how well the rest of the memo is written.

### Check script

There is no single script that scores the recommendation itself (this is a
qualitative call), but the cost anchors can be re-verified mechanically:

```
node -e "
const salary = 165000;
const buildYear1 = 5*salary*(7/12) + 3*salary*(5/12);
const buildYears2and3 = 3*salary*2;
const buildTotal = buildYear1 + buildYears2and3;
const buyTotal = 7500*36;
console.log('Build Year 1:', buildYear1, '(want 687500)');
console.log('Build Years 2-3:', buildYears2and3, '(want 990000)');
console.log('Build 3yr TCO:', buildTotal, '(want 1677500)');
console.log('Buy 3yr TCO:', buyTotal, '(want 270000)');
console.log('Buy cheaper by factor:', (buildTotal/buyTotal).toFixed(2), '(want ~6.21)');
"
```

Run this and confirm 1,677,500 / 270,000 before trusting any cost figures
quoted in a submission; a submission that quotes a wildly different build
TCO (e.g. treating all 3 years at 5-engineer headcount, ~2.48M) has
mis-modeled the staffing step-down and should be flagged in Numerical/
Strategic soundness even though obj-1 through obj-4 are prose checks.

- **obj-1**: each option needs a pro AND a con grounded in the embedded
  facts (not generic pros/cons invented from nowhere) — e.g. Build's pro
  is control, con is the missing expertise; Buy's pro is speed/
  certification, con is data leaving the platform; Partner's pro is
  intermediate speed, con is integration/coordination risk.
- **obj-2**: both factors must be named explicitly, not merely implied.
- **obj-3**: this is a **prose-located binary check**. Examples:
  - **PASS**: "We recommend buying the vendor solution." / "The clear
    choice is Option 2 (Buy)." / "Partner is the right call here, for the
    following reasons..." (a single named option, even if partner)
  - **PASS**: "Buy. Full stop — building doesn't make sense given the
    timeline." (terse but unambiguous)
  - **FAIL**: "It depends on how much leadership values control versus
    speed." (no pick made)
  - **FAIL**: "Build could work if we can hire fast, but buy is safer for
    now — worth revisiting either way." (hedged, no single winner)
  - **FAIL**: "We recommend a phased approach: buy now, build later."
    (this names two options as sequential winners, not one call for the
    current decision)
- **obj-4**: this is a **prose-located binary check**. Examples:
  - **PASS**: "Given the competitor opening in two months and our lack of
    in-house compliance depth, we recommend Buy." (consistent)
  - **PASS**: "We recommend Partner: it resolves certification through the
    network's existing accreditation and still beats the payer deadline at
    14 weeks." (explicitly resolves the tension)
  - **FAIL**: "Even though the competitor is opening in two months and we
    have no e-prescribing expertise in-house, we recommend building — it
    gives us more control long-term." (recommends build while conceding the
    exact constraints that rule it out)
  - **FAIL**: "Build is the right call since we already have engineers on
    staff and want to own the roadmap." (ignores the certification and
    time-to-market constraints entirely while still landing on build)
- **obj-5**: whole-file `wc -w` for the 600-word cap.

### Subjective guidance

- **Strategic soundness**: does the memo weigh the four binding constraints
  as constraints (things that rule options out) rather than as one input
  among many to be traded off freely?
- **Decision structure**: is the memo organized so a board member can find
  the recommendation, the reasoning, and the alternatives considered
  without hunting through prose?
- **Reasoning quality**: does REASONING.md show genuine engagement with why
  build is tempting (sunk-cost-adjacent "we already have engineers"
  framing) and explicitly reject it, rather than dismissing build in one
  line?
