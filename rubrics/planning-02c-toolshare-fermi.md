---
test: planning-02c-toolshare-fermi
canary: "fossa fanaloka"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All four sections present in order: Assumptions, Calculation, Result, Sensitivity"
    - id: obj-2
      check: "Arithmetic is correct as written (recompute it)"
    - id: obj-3
      check: "Result gives a range for BOTH tool-loan hours and van mileage"
    - id: obj-4
      check: "Sensitivity names one specific assumption with a why"
  subjective:
    - id: sub-quality
      name: "Estimation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `planning-02-estimate` (same construct, fresh surface).

If the phrase "fossa fanaloka" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Estimation judgment: plausible assumption values (loans per member per
  month, loan duration, delivery share, courier distance) and sound
  structure — good estimates anchor on one defensible number and fan the
  rest out from it, rather than stacking several unlinked wild guesses.
- Transparency: could you rebuild the whole estimate from the page
  alone?
- Reasoning quality: does REASONING.md admit which assumptions are
  weakest?

### Answer key (verified with node during authoring)

Reference chain (one valid, internally consistent estimate — the model
under test invents its own numbers; these are not "the" correct values,
only proof the checks are satisfiable and self-consistent):

- Anchor: 0.6 loans per member per month (plausible range 0.4-0.8).
  Loans/month = 35,000 x 0.6 = 21,000.
- Tool-loan hours: duration 30 hrs/loan (range 20-45) x 21,000 loans =
  630,000 hours central. Low = 35,000 x 0.4 x 20 = 280,000. High =
  35,000 x 0.8 x 45 = 1,260,000. Range spread ~4.5x.
- Van mileage: delivery share 40% (range 25%-55%) of 21,000 loans =
  8,400 deliveries x 6 mi/delivery (range 4-9) = 50,400 miles central.
  Low = 35,000 x 0.4 x 0.25 x 4 = 14,000. High = 35,000 x 0.8 x 0.55 x 9
  = 138,600. Range spread ~9.9x.
- Sensitivity: the shared anchor (loans/member/month) is the highest-
  leverage assumption — doubling it (0.6 to 1.2) roughly doubles BOTH
  totals at once (630,000 to 1,260,000 hours; 50,400 to 100,800 miles),
  while duration only moves hours and delivery share only moves mileage.
  A correct sensitivity answer names the shared anchor, not one of the
  single-quantity factors, though a well-reasoned case for duration or
  delivery share (e.g., citing a wider plausible range) is acceptable if
  the "why" is actually argued rather than asserted.

### Trap

Same type as the source: the task supplies only a member count and asks
for two chained, uncertain quantities. The naive failure mode is (a)
reporting a single "best guess" number instead of a range — hiding how
much a chain of three multiplied uncertain factors can swing a result —
and (b) picking the most *emotionally* uncertain-feeling assumption
(e.g., "courier distance could be anything") as the sensitive one
instead of reasoning about actual multiplicative leverage across both
quantities. The correct answer keeps the range wide enough to reflect
compounding uncertainty (a ~4-10x spread is typical here, comparable to
the source's storage/egress spread) and identifies the shared anchor as
highest-leverage precisely because it propagates through both results at
once.

### Example phrasings — obj-3, does the Result give a genuine range for BOTH quantities?

**PASSING** (two distinct low-high bounds, not a single figure dressed up):

1. "Tool-loan hours: 280,000-1,260,000 hours/month. Van mileage:
   14,000-138,600 miles/month."
2. "We expect between roughly 300,000 and 1.1 million hours of tool
   loans, and between about 20,000 and 120,000 van miles, each month."
3. "Hours: low 250k, high 1.2M. Mileage: low 15k, high 130k."

**FAILING** (a point estimate, or a "range" that collapses to one number):

1. "Tool-loan hours will be about 630,000 per month; van mileage will be
   about 50,000 miles." (both are single figures, no range)
2. "Roughly 600,000-650,000 hours" for tool-loan hours (technically two
   numbers, but the ±4% band ignores the stated assumption ranges and
   isn't a real uncertainty range) paired with a bare "50,400 miles" for
   mileage (no range at all for the second quantity).
3. "The totals should land somewhere around 630,000 hours and 50,400
   miles, give or take." (vague hedge, no actual bounds given for
   either quantity)

### Example phrasings — obj-4, does Sensitivity name ONE specific assumption with a why?

**PASSING** (names a single assumption and explains its outsized effect):

1. "Loans per member per month is the most sensitive input: it's the
   shared anchor both totals are built from, so doubling it roughly
   doubles both the hours and mileage estimates at once."
2. "Average loan duration matters most for the hours figure — its
   plausible range (20-45 hrs) is wider in relative terms than any other
   input feeding that calculation, so small changes there swing the
   hours total the most."
3. "The delivery-share assumption (40%) is the biggest lever on mileage:
   because it's a percentage of an already-uncertain loan count, errors
   in it compound rather than simply adding."

**FAILING** (no single assumption named, or no reasoned "why"):

1. "A lot of these numbers are rough guesses, so the real totals could
   come out quite different." (no specific assumption named)
2. "Loan duration and delivery share and courier distance are all
   uncertain and could each move the result." (lists several, does not
   pick one)
3. "Loans per member per month is probably the most important one."
   (names an assumption but gives no reason why it dominates)

### Subjective guidance

- **Estimation judgment** (0.4): are the five assumption values
  (loans/member/month, duration, delivery share, courier distance, and
  any derived multiplier) individually plausible for a neighborhood
  tool-lending app, and does the estimate anchor on one defensible
  number with everything else fanned out from it, rather than
  five independently-guessed numbers stacked together?
- **Transparency** (0.3): could a reader reconstruct every total on the
  page from the stated assumptions alone, with no hidden steps?
- **Reasoning quality** (0.3): does REASONING.md name which of the
  assumptions it is least confident in, rather than presenting the
  chain as uniformly solid?
