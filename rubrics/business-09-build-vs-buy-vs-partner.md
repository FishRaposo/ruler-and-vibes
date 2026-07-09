---
test: business-09-build-vs-buy-vs-partner
canary: "wren zephyr dell"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decision.md evaluates all THREE options (build, buy, partner) with at least one pro and one con each drawn from the embedded facts"
    - id: obj-2
      check: "decision.md names time-to-market (competitor launching next quarter) AND the non-differentiating/table-stakes nature of the capability as decision factors"
    - id: obj-3
      check: "decision.md makes exactly ONE unambiguous recommendation (a single chosen option, not a hedged 'it depends')"
    - id: obj-4
      check: "decision.md's recommendation is consistent with the binding constraints -- it does not recommend BUILD while conceding time-to-market is binding and in-house fraud/compliance expertise is absent"
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
anchors:
  - id: Strategic soundness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Decision structure
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "wren zephyr dell" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test's primary deliverable is a qualitative strategy memo — there is
no single computed number to check, but the correct call is structurally
determined by the embedded constraints.

### Answer key

Cost anchors (for context, not the primary basis for the recommendation):

```
Build Year 1 (4 eng * 180,000/yr * 9/12, then stepped down to
             2 eng * 180,000/yr * 3/12 for the remaining quarter):
  = 4*180000*(9/12) + 2*180000*(3/12)
  = 540,000 + 90,000
  = 630,000
Build Years 2-3 (2 eng * 180,000/yr * 2 years) = 720,000
Build 3-year TCO = 630,000 + 720,000 = 1,350,000

Buy 3-year TCO = 6,000/month * 36 months = 216,000

Partner cost = 15% of recovered fraud -- volume-variable, not directly
  comparable without a fraud-loss-volume assumption; treat as
  qualitatively costed, not a fixed TCO line.
```

Buy is roughly 6.25x cheaper than build over 3 years on headcount cost
alone, but **the recommendation should not rest on TCO alone** — the
binding facts (table-stakes capability, competitor launching next
quarter, no in-house fraud/compliance expertise, mandatory regulatory
certification) all point the same direction:

**Correct call: BUY.** A proven, already-certified vendor resolves the
certification risk, ships in 8 weeks (fastest path against the
competitor's next-quarter launch), and doesn't require the team to build
expertise it lacks in a domain that isn't a differentiator anyway.

**PARTNER is acceptable only if** the memo explicitly and convincingly
resolves the certification question (i.e., argues the partner firm's own
certification covers Ridgeline, or that 12 weeks still beats the
competitive window) and directly engages the deeper-integration-risk
con — a partner recommendation that ignores certification or
time-to-market should be scored down on obj-4-adjacent subjective
grounds even if it technically names all the facts.

**BUILD is the trap.** A submission that recommends building in-house
while still conceding time-to-market is binding and that the team lacks
fraud/compliance expertise is internally inconsistent and fails obj-4
outright, regardless of how well the rest of the memo is written.

### Check script

There is no single script that scores the recommendation itself (this is
a qualitative call), but the cost anchors can be re-verified mechanically:

```
node -e "
const salary = 180000;
const buildYear1 = 4*salary*(9/12) + 2*salary*(3/12);
const buildYears2and3 = 2*salary*2;
const buildTotal = buildYear1 + buildYears2and3;
const buyTotal = 6000*36;
console.log('Build Year 1:', buildYear1, '(want 630000)');
console.log('Build Years 2-3:', buildYears2and3, '(want 720000)');
console.log('Build 3yr TCO:', buildTotal, '(want 1350000)');
console.log('Buy 3yr TCO:', buyTotal, '(want 216000)');
console.log('Buy cheaper by factor:', (buildTotal/buyTotal).toFixed(2), '(want ~6.25)');
"
```

Run this and confirm 1,350,000 / 216,000 before trusting any cost figures
quoted in a submission; a submission that quotes a wildly different
build TCO (e.g. treating all 3 years at 4-engineer headcount, ~2.16M) has
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
    choice is Option 2 (Buy)." / "Partner is the right call here, for
    the following reasons..." (a single named option, even if partner)
  - **PASS**: "Buy. Full stop — building doesn't make sense given the
    timeline." (terse but unambiguous)
  - **FAIL**: "It depends on how much leadership values control versus
    speed." (no pick made)
  - **FAIL**: "Build could work if we can hire fast, but buy is safer
    for now — worth revisiting either way." (hedged, no single winner)
  - **FAIL**: "We recommend a phased approach: buy now, build later."
    (this names two options as sequential winners, not one call for the
    current decision)
- **obj-4**: this is a **prose-located binary check**. Examples:
  - **PASS**: "Given the competitor launch next quarter and our lack of
    in-house compliance depth, we recommend Buy." (consistent)
  - **PASS**: "We recommend Partner: it resolves certification through
    the partner's existing accreditation and still beats the competitor's
    timeline at 12 weeks." (explicitly resolves the tension)
  - **FAIL**: "Even though the competitor is launching next quarter and
    we have no fraud expertise in-house, we recommend building — it
    gives us more control long-term." (recommends build while conceding
    the exact constraints that rule it out)
  - **FAIL**: "Build is the right call since we already have engineers
    on staff and want to own the roadmap." (ignores the certification and
    time-to-market constraints entirely while still landing on build)
- **obj-5**: whole-file `wc -w` for the 600-word cap.

### Subjective guidance

- **Strategic soundness**: does the memo weigh the four binding
  constraints as constraints (things that rule options out) rather than
  as one input among many to be traded off freely?
- **Decision structure**: is the memo organized so a board member can
  find the recommendation, the reasoning, and the alternatives considered
  without hunting through prose?
- **Reasoning quality**: does REASONING.md show genuine engagement with
  why build is tempting (sunk-cost-adjacent "we have engineers" framing)
  and explicitly reject it, rather than dismissing build in one line?
