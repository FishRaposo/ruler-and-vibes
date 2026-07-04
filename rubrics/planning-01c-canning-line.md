---
test: planning-01c-canning-line
canary: "agouti fuchsine"
reviewed: "pass 2026-07-04 (independent gate)"
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
---

## Judge guidance

Parallel form of `planning-01-tradeoff` (same construct, fresh surface).

If the phrase "agouti fuchsine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

### Objective checks

- **obj-1 — Decision matrix with >= 4 criteria, each with an explicit
  weight.** A matrix (table or clearly-structured equivalent) comparing
  the three options across four or more named criteria, and each
  criterion carries a stated numeric weight.
  - PASS: "a five-row table with weights 0.30 / 0.20 / 0.20 / 0.15 / 0.15
    down a weight column and a weighted total per option"
  - PASS: "four criteria each prefixed with an explicit weight, e.g.
    '3-yr cost (30%)', '(20%)', '(30%)', '(20%)'"
  - PASS: "six weighted criteria scored 1–10 per option with a computed
    weighted sum row"
  - FAIL: "a comparison table with four criteria but no weights anywhere"
  - FAIL: "criteria discussed only in prose with no matrix and no weights"
  - FAIL: "a matrix with weights on only three of its five criteria"

- **obj-2 — Exactly one explicit recommendation.** The memo names a
  single recommended option unambiguously.
  - PASS: "Recommendation: refurbish a used line and train staff."
  - PASS: "We should go with the mobile canning contract."
  - PASS: "My call is the new in-house line, for the reasons below."
  - FAIL: "both the mobile contract and the refurbished line are strong
    finalists worth piloting side by side"
  - FAIL: "the owner should weigh what matters most and decide" (defers,
    names no single pick)
  - FAIL: "we recommend the refurbished line, though the new line may be
    better if you grow" (two picks presented as co-equal)

- **obj-3 — Risks-and-mitigations section for the recommended option.** A
  section that names risks specific to the recommended option and pairs
  each with a mitigation.
  - PASS: "Risks & mitigations: maintenance on one staffer → service
    contract + cross-train a second person; used gear fails → 90-day
    parts warranty + a booked mobile fallback"
  - PASS: "a bulleted 'What could go wrong' list where every bullet ends
    with a concrete 'to reduce this, we will …'"
  - PASS: "three named risks for the chosen option, each with a paired
    countermeasure"
  - FAIL: "a general 'risks of canning' paragraph not tied to the chosen
    option"
  - FAIL: "risks listed with no mitigations attached"
  - FAIL: "mitigations for a rejected option, none for the recommended one"

- **obj-4 — <= 600 words; given numbers used without contradiction.**
  Word count of `decision.md` is 600 or fewer, and the memo uses the
  supplied figures consistently (no invented or self-contradicting
  numbers). Word-count command (run from the repo root):
  `wc -w results/<run-id>/planning-01c-canning-line/decision.md`
  - PASS: "540 words; cites $430/mo mobile, $34,000 + $520/mo new line,
    $6,800 + $175/mo refurbished, and the 700-case cliff, all consistent"
  - PASS: "an assumption is stated ('~600 cases/month') and every quoted
    figure matches the task"
  - PASS: "590 words that restate each option's cost exactly as given"
  - FAIL: "640 words"
  - FAIL: "says the new line costs '$3,400 up front' (mangles $34,000)"
  - FAIL: "claims mobile is '$430/mo at any volume', contradicting the
    stated jump to $780 above 700 cases/month"

### Subjective criteria

- **Decision rigor (0.4):** are the criterion weights defended, not
  decorative? A matrix reverse-engineered to justify a pre-picked winner
  scores low — check whether plausible alternative weights would flip the
  result and whether that risk is acknowledged. Strong memos engage the
  three-year total cost of ownership (up-front plus monthly over a stated
  horizon), the volume cliff at 700 cases/month, and the fact that the
  cheapest monthly option carries the heaviest staffing burden.
- **Memo clarity (0.3):** an owner with five minutes should get the
  answer, the cost picture, and the biggest risk.
- **Reasoning quality (0.3):** does REASONING.md engage with the
  multi-year cost math (not just first-month sticker) and the staffing
  reality, rather than restating the memo?
