---
test: writing-02-registers
canary: "brindle dappled"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three sections present: ## Formal, ## Friendly, ## Summary"
    - id: obj-2
      check: "All four facts present in every version"
    - id: obj-3
      check: "Summary is one sentence of <= 25 words (count them)"
    - id: obj-4
      check: "No invented facts in any version"
  subjective:
    - id: sub-quality
      name: "Register fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Register fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Concision
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "brindle dappled" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Register fidelity: each version unmistakable for its audience — the
  pivot between tones must feel deliberate, not a synonym swap. Formal is
  not stiff; friendly is not unserious.
- Concision: every version should be materially tighter than the
  original paragraph, measured by word count against it. A formal
  register may spend a few words on convention and still come in under.
- On obj-4: conventional register scaffolding ("we will keep you
  updated") is not an invented fact; new specifics — names, causes,
  dates, numbers — are.
- Reasoning quality: did REASONING.md discuss tone choices per audience
  and what was deliberately dropped?

### Example phrasings — obj-2, does every version keep all four facts?

**PASSING** (a version that carries cause, both dates, and the discount):

1. "Technical complications integrating the new payment system have
   pushed our launch from March 3 to April 14; customers who pre-ordered
   will receive a 15% discount."
2. "We hit some snags getting the new payment system working, so we're
   moving launch day from March 3 to April 14 — and if you already
   pre-ordered, you'll get 15% off."
3. "Because of technical issues integrating payments, the March 3 launch
   is now April 14; pre-order customers get a 15% discount for the
   wait."

**FAILING** (a version missing one or more of the four facts):

1. "We've hit a delay and the launch is now April 14. Thanks for your
   patience!" (drops the cause, the original March 3 date, AND the 15%
   discount)
2. "The launch is moving from March 3 to April 14 due to some technical
   work; pre-order customers will be taken care of." ("taken care of" is
   vague — the 15% discount fact is gone)
3. "Due to integration problems, launch is postponed and pre-order
   customers get a discount." (drops both dates entirely)

### Example phrasings — obj-4, did the version invent facts?

Conventional register scaffolding ("we appreciate your patience", "we'll
keep you posted") is **not** an invented fact. New specifics — names,
causes, dates, numbers, partners — that were not in the source paragraph
**are**.

**PASSING** (only scaffolding added, no new specifics):

1. "We're grateful for your patience as we get this right." (pure
   goodwill scaffolding)
2. "Investors will receive a further update ahead of the new launch
   date." (procedural framing, invents no fact)
3. "Thanks for bearing with us through this change." (register glue, no
   new specifics)

**FAILING** (smuggles in a specific that was never given):

1. "We've also partnered with Meridian Bank to guarantee same-day
   processing at launch." (invents a partner and a guarantee)
2. "The new April 14 date has been confirmed with our board of
   directors." (invents a board confirmation not in the source)
3. "Pre-order customers get a 15% discount plus a free three-month
   subscription." (invents a perk not in the source).
