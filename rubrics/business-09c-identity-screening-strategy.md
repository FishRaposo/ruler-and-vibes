---
test: business-09c-identity-screening-strategy
canary: "sycamore alphard"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decision.md evaluates all THREE options (build, buy, partner) with at least one pro and one con each drawn from the embedded facts"
    - id: obj-2
      check: "decision.md names time-to-market (competitor entering this quarter / anchor-partner launch commitment) AND the non-differentiating/table-stakes nature of the capability as decision factors"
    - id: obj-3
      check: "decision.md makes exactly ONE unambiguous recommendation (a single chosen option, not a hedged 'it depends')"
    - id: obj-4
      check: "decision.md's recommendation is consistent with the binding constraints -- it does not recommend BUILD while conceding time-to-market is binding and in-house identity/AML expertise is absent"
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

Parallel form of `business-09-build-vs-buy-vs-partner` (same construct, fresh
surface).

If the phrase "sycamore alphard" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test's primary deliverable is a qualitative strategy memo — there is no
single computed number to check, but the correct call is structurally
determined by the embedded constraints.

### Answer key

Cost anchors (for context, not the primary basis for the recommendation):

```
Build Year 1 (6 eng * 150,000/yr * 8/12 to MVP, then stepped down to
             4 eng * 150,000/yr * 4/12 for the remainder of year 1):
  = 6*150000*(8/12) + 4*150000*(4/12)
  = 600,000 + 200,000
  = 800,000
Build Years 2-3 (4 eng * 150,000/yr * 2 years) = 1,200,000
Build 3-year TCO = 800,000 + 1,200,000 = 2,000,000

Buy 3-year TCO = 8,000/month * 36 months = 288,000

Partner cost = 10% of screened-onboarding revenue -- volume-variable, not
  directly comparable without an onboarding-volume assumption; treat as
  qualitatively costed, not a fixed TCO line.
```

Buy is roughly 6.9x cheaper than build over 3 years on headcount cost alone,
but **the recommendation should not rest on TCO alone** — the binding facts
(table-stakes capability, competitor entering this quarter plus the anchor-
partner launch commitment, no in-house identity/AML expertise, mandatory
regulatory registration) all point the same direction:

**Correct call: BUY.** A proven, already-certified vendor resolves the
registration risk, ships in 6 weeks (fastest path against the competitor's
this-quarter entry and the launch commitment), and doesn't require the team to
build expertise it lacks in a domain that isn't a differentiator anyway.

**PARTNER is acceptable only if** the memo explicitly and convincingly resolves
the registration question (i.e., argues the screening bureau's own
accreditation covers Fernbank, or that 11 weeks still beats the competitive/
launch window) and directly engages the deeper-integration-risk con — a partner
recommendation that ignores registration or time-to-market should be scored
down on obj-4-adjacent subjective grounds even if it technically names all the
facts.

**BUILD is the trap.** A submission that recommends building in-house while
still conceding time-to-market is binding and that the team lacks identity/AML
expertise is internally inconsistent and fails obj-4 outright, regardless of how
well the rest of the memo is written.

### Check script

There is no single script that scores the recommendation itself (this is a
qualitative call), but the cost anchors can be re-verified mechanically:

```
node -e "
const salary = 150000;
const buildYear1 = 6*salary*(8/12) + 4*salary*(4/12);
const buildYears2and3 = 4*salary*2;
const buildTotal = buildYear1 + buildYears2and3;
const buyTotal = 8000*36;
console.log('Build Year 1:', buildYear1, '(want 800000)');
console.log('Build Years 2-3:', buildYears2and3, '(want 1200000)');
console.log('Build 3yr TCO:', buildTotal, '(want 2000000)');
console.log('Buy 3yr TCO:', buyTotal, '(want 288000)');
console.log('Buy cheaper by factor:', (buildTotal/buyTotal).toFixed(2), '(want ~6.94)');
"
```

Run this and confirm 2,000,000 / 288,000 before trusting any cost figures
quoted in a submission; a submission that quotes a wildly different build TCO
(e.g. treating all 3 years at 6-engineer headcount, ~2.7M) has mis-modeled the
staffing step-down and should be flagged in Numerical/Strategic soundness even
though obj-1 through obj-4 are prose checks.

- **obj-1**: each option needs a pro AND a con grounded in the embedded facts
  (not generic pros/cons invented from nowhere) — e.g. Build's pro is control,
  con is the missing expertise; Buy's pro is speed/certification, con is data
  leaving the platform; Partner's pro is intermediate/deeper coverage, con is
  integration/coordination risk. Examples:
  - **PASS**: "Build gives us full control over the roadmap, but we lack
    in-house identity/AML expertise today." (pro and con, both grounded in
    the embedded facts)
  - **PASS**: "Buying gets us a registered vendor in 6 weeks, but our
    applicant data would live on a third party's platform." (speed pro,
    data-control con)
  - **PASS**: "Partnering gives deeper screening coverage than buy alone,
    but adds ongoing integration and coordination overhead with the
    bureau's network."
  - **FAIL**: "Build: pro is control. Buy: pro is speed. Partner: pro is
    flexibility." (a pro for every option, but no con anywhere)
  - **FAIL**: "Buy is faster and cheaper than building." (a comparison, not
    an option-specific pro/con tied to the embedded facts)
  - **FAIL**: memo covers Build and Buy in depth but never evaluates
    Partner at all (missing an entire option)
- **obj-2**: both factors must be named explicitly, not merely implied.
  Examples:
  - **PASS**: "A competitor enters this quarter and we have a fixed
    anchor-partner launch commitment, and identity screening is table
    stakes rather than a differentiator for us — both point to Buy."
    (both factors named)
  - **PASS**: "Two things drive this call: (1) the competitive/launch
    timeline is short, and (2) this capability doesn't differentiate us
    from anyone else in the market."
  - **FAIL**: "We need to move quickly here." (gestures at urgency without
    naming the competitor's this-quarter entry or the launch commitment)
  - **FAIL**: "This isn't really our core differentiator." (implies
    table-stakes without saying so, and never mentions time-to-market)
  - **FAIL**: memo discusses cost and team morale at length but never
    references the launch commitment, the competitor's timeline, or
    whether the capability differentiates the company
- **obj-3**: this is a **prose-located binary check**. Examples:
  - **PASS**: "We recommend buying the vendor solution." / "The clear choice is
    Option 2 (Buy)." / "Partner is the right call here, for the following
    reasons..." (a single named option, even if partner)
  - **PASS**: "Buy. Full stop — building doesn't make sense given the timeline."
    (terse but unambiguous)
  - **FAIL**: "It depends on how much leadership values control versus speed."
    (no pick made)
  - **FAIL**: "Build could work if we can hire fast, but buy is safer for now —
    worth revisiting either way." (hedged, no single winner)
  - **FAIL**: "We recommend a phased approach: buy now, build later." (this
    names two options as sequential winners, not one call for the current
    decision)
- **obj-4**: this is a **prose-located binary check**. Examples:
  - **PASS**: "Given the competitor entering this quarter and our lack of
    in-house AML depth, we recommend Buy." (consistent)
  - **PASS**: "We recommend Partner: it resolves registration through the
    bureau's existing accreditation and still beats the launch commitment at 11
    weeks." (explicitly resolves the tension)
  - **FAIL**: "Even though the competitor is entering this quarter and we have
    no identity/AML expertise in-house, we recommend building — it gives us more
    control long-term." (recommends build while conceding the exact constraints
    that rule it out)
  - **FAIL**: "Build is the right call since we already have engineers on staff
    and want to own the roadmap." (ignores the registration and time-to-market
    constraints entirely while still landing on build)
- **obj-5**: whole-file `wc -w` for the 600-word cap.

### Subjective guidance

- **Strategic soundness**: does the memo weigh the four binding constraints as
  constraints (things that rule options out) rather than as one input among
  many to be traded off freely?
- **Decision structure**: is the memo organized so a board member can find the
  recommendation, the reasoning, and the alternatives considered without
  hunting through prose?
- **Reasoning quality**: does REASONING.md show genuine engagement with why
  build is tempting (sunk-cost-adjacent "we already have engineers" framing) and
  explicitly reject it, rather than dismissing build in one line?
