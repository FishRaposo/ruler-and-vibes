---
test: planning-01-tradeoff
canary: "equinox solstice"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Decision matrix with >= 4 criteria, each with an explicit weight"
    - id: obj-2
      check: "Exactly one explicit recommendation"
    - id: obj-3
      check: "Risks-and-mitigations section for the recommended option"
    - id: obj-4
      check: "<= 600 words; given numbers used without contradiction"
  subjective:
    - id: sub-quality
      name: "Decision rigor"
      weight: 0.4
    - id: sub-craft
      name: "Memo clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Decision rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Memo clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "equinox solstice" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

### Answer key (verified with node during authoring)

Assume a 3-year (36-month) comparison horizon — the memo is expected to
pick a sensible horizon and state it; the task deliberately does not
hand one over.

- **SaaS:** no upfront, 36 * $400 = **$14,400**. The per-seat price jump
  at 15 seats is a growth-risk decoy, not a current cost: the agency has
  8 people, well under the threshold.
- **Custom build:** $30,000 + 36 * $500 = **$48,000** — dearest by far.
- **Self-hosted open source:** $6,000 + 36 * $150 = **$11,400** —
  cheapest on the spreadsheet, but the ongoing maintenance load falls
  entirely on the office's one tech-savvy employee (the staffing-burden
  trap).
- **Correct 3-year TCO ordering: self-hosted ($11,400) < SaaS ($14,400)
  < custom build ($48,000).** Dearest/cheapest spread ~4.2x.
- **Naive monthly-only ordering:** self-hosted ($150) < SaaS ($400) <
  custom ($500) — same order here, but a shallow memo can still reject
  self-hosted or SaaS purely on the size of their upfront/setup numbers
  ($6,000 or $30,000) without amortizing over the horizon, or can treat
  the 15-seat cliff as a live cost today when it is not.

The numbers do not by themselves name a winner: self-hosted is cheapest
but loads maintenance onto a single staffer with no vendor backstop;
custom build is dearest but yields full ownership and no per-seat
growth risk; SaaS is fastest to live and shifts risk to the vendor. A
defensible memo may land on any of the three — what is scored is
whether the matrix weights are defended and whether the multi-year math
and the staffing-burden reality are actually reasoned about, not
whether a specific option is chosen.

### Objective checks

- **obj-1 — Decision matrix with >= 4 criteria, each with an explicit
  weight.**
  - PASS: "a five-row table with weights 0.30 / 0.25 / 0.25 / 0.20 down
    a weight column and a weighted total per option"
  - PASS: "four criteria each prefixed with an explicit weight, e.g.
    '3-yr cost (35%)', 'time to live (20%)', 'ownership (25%)',
    'staffing risk (20%)'"
  - FAIL: "a comparison table with four criteria but no weights anywhere"
  - FAIL: "criteria discussed only in prose with no matrix and no weights"

- **obj-2 — Exactly one explicit recommendation.**
  - PASS: "Recommendation: go with the SaaS option; revisit if seat
    count approaches 15."
  - PASS: "We should self-host the open-source system — it is cheapest
    over three years and the team can absorb the upkeep."
  - PASS: "My call is the custom build, for the ownership and control it
    buys us."
  - FAIL: "both the SaaS plan and the custom build are strong options
    worth piloting side by side"
  - FAIL: "the owner should weigh what matters most and decide" (defers,
    names no single pick)
  - FAIL: "we recommend self-hosting, though SaaS may be better if you
    scale" (two picks presented as co-equal)

- **obj-3 — Risks-and-mitigations section for the recommended option.**
  - PASS: "Risks & mitigations: sole maintainer leaves → cross-train a
    second employee and document the setup; open-source project goes
    unmaintained → budget a contingency migration"
  - PASS: "a bulleted 'What could go wrong' list where every bullet ends
    with a concrete 'to reduce this, we will …'"
  - FAIL: "a general 'risks of software' paragraph not tied to the
    chosen option"
  - FAIL: "risks listed with no mitigations attached"
  - FAIL: "mitigations for a rejected option, none for the recommended
    one"

- **obj-4 — <= 600 words; given numbers used without contradiction.**
  - PASS: "SaaS: $400/month = $14,400 over three years; the per-seat
    jump only bites above 15 seats, which we're nowhere near"
  - PASS: "Custom build is $30,000 upfront plus $500/month = $48,000
    over three years — the most expensive even after the upfront
    amortizes"
  - PASS: "Self-hosting is $6,000 setup plus $150/month = $11,400, the
    cheapest on paper"
  - FAIL: "Actually the custom build is $35,000, not $30,000" (invents a
    figure that contradicts the brief)
  - FAIL: "Self-hosting setup runs closer to $10,000 once you add
    everything" (the brief states $6,000; no stated assumption
    justifies the change)
  - FAIL: "The custom build costs $30,000, which is cheaper monthly than
    SaaS" (the $30,000 is a one-time upfront, not a monthly — category
    error)

### Subjective guidance

- Decision rigor: are the criterion weights defended, not decorative? A
  matrix reverse-engineered to justify a pre-picked winner scores low —
  check whether plausible alternative weights would flip the result and
  whether that risk is acknowledged. Does the memo engage the 3-year
  total cost (not just monthly stickers) and the staffing-burden reality
  behind the cheapest option?
- Memo clarity: an owner with five minutes should get the answer, the
  cost picture, and the biggest risk.
- Reasoning quality: does REASONING.md engage with multi-year cost math
  and the staffing reality, not just restate the memo?
