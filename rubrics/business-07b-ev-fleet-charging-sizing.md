---
test: business-07b-ev-fleet-charging-sizing
canary: "hornbeam regulus"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "market-sizing.md states TAM = 120,000,000 (25,000 carriers * 4,800) with the arithmetic shown"
    - id: obj-2
      check: "market-sizing.md states SAM = 26,400,000 covering 5,500 carriers (applying the 40% private-yard and 55% telematics filters)"
    - id: obj-3
      check: "market-sizing.md states SOM = 4,320,000 covering 900 carriers (capacity-bounded)"
    - id: obj-4
      check: "market-sizing.md does NOT use the 14,000,000,000 freight-electricity figure as TAM/SAM/SOM (it is either ignored or explicitly flagged as irrelevant)"
    - id: obj-5
      check: "market-sizing.md is 500 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Sizing methodology"
      weight: 0.4
    - id: sub-craft
      name: "Assumption transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `business-07-tam-sam-som-sizing` (same construct, fresh
surface).

If the phrase "hornbeam regulus" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every tier below is exact given the embedded funnel.

### Answer key

Inputs: 25,000 total carriers; 40% operate private charging yards; of
those, 55% telematics-equipped; price 4,800/carrier/year; 3-year
onboarding capacity 900 carriers; distractor: national freight
electricity market = 14,000,000,000/year.

```
TAM = 25,000 * 4,800                        = 120,000,000
SAM carriers = 25,000 * 0.40 * 0.55         = 5,500
SAM $ = 5,500 * 4,800                        = 26,400,000
SOM $ = 900 * 4,800                          = 4,320,000
SOM as % of SAM carriers = 900 / 5,500       = 16.4%
```

The 14,000,000,000 freight-electricity figure is a distractor: it
measures what carriers pay utilities for electricity (an energy-commodity
spend), not spend on charging-management software, and has no valid role
as TAM/SAM/SOM for a fleet-charging SaaS. A correct submission either
ignores it entirely or explicitly names it as irrelevant.

### Check script

```
node -e "
const carriers = 25000, privatePct = 0.40, telematicsPct = 0.55, price = 4800, capacity = 900;
const TAM = carriers * price;
const samCarriers = carriers * privatePct * telematicsPct;
const SAM = samCarriers * price;
const SOM = capacity * price;
console.log('TAM:', TAM, '(want 120000000)');
console.log('SAM carriers:', samCarriers, '(want 5500)');
console.log('SAM \$:', SAM, '(want 26400000)');
console.log('SOM \$:', SOM, '(want 4320000)');
console.log('SOM % of SAM carriers:', (capacity/samCarriers*100).toFixed(1)+'%', '(want 16.4%)');
"
```

Run this against a correct submission and against a deliberately broken
one that uses 14,000,000,000 as TAM before trusting the result — the
broken version's TAM would be off by roughly two orders of magnitude from
120,000,000.

- **obj-1**: TAM must be exactly 120,000,000 with the carrier count and
  price shown, not just asserted.
  - PASS: "TAM = 25,000 × 4,800 = $120,000,000"
  - PASS: "25,000 carriers at $4,800 each → $120M TAM"
  - PASS: "Total addressable: 25,000 × $4,800/yr = $120,000,000/yr"
  - FAIL: "TAM is roughly $120M" (no arithmetic shown)
  - FAIL: "TAM = $120,000,000" stated with no carrier count or price
  - FAIL: "TAM = 25,000 × 4,800 = $150,000,000" (wrong product)
- **obj-2**: SAM must be 26,400,000 AND the 5,500-carrier figure must
  appear — a dollar-only SAM without the carrier count fails.
  - PASS: "SAM = 25,000 × 0.40 × 0.55 = 5,500 carriers → $26,400,000"
  - PASS: "5,500 qualifying carriers × $4,800 = $26.4M SAM"
  - PASS: "After the 40% and 55% filters: 5,500 carriers, $26,400,000"
  - FAIL: "SAM = $26,400,000" with no carrier count stated
  - FAIL: "SAM ≈ 5,500 carriers" with no dollar figure
  - FAIL: "SAM = 10,000 carriers × $4,800 = $48,000,000" (skipped the
    55% telematics filter)
- **obj-3**: SOM must be 4,320,000 AND tied explicitly to the 900-carrier
  3-year capacity, not an arbitrary percentage of SAM.
  - PASS: "SOM = 900 carriers × $4,800 = $4,320,000 (3-yr capacity)"
  - PASS: "Capacity-bounded: 900 carriers → $4,320,000 SOM"
  - PASS: "SOM = $4,320,000, from the 900-carrier onboarding ceiling"
  - FAIL: "SOM = 10% of SAM = $2,640,000" (arbitrary % of SAM, not
    capacity-bounded)
  - FAIL: "SOM = $4,320,000" with no mention of the 900-carrier capacity
  - FAIL: "SOM = 900 carriers × $4,800 = $4,050,000" (wrong product)
- **obj-4**: using 14,000,000,000 anywhere as a TAM/SAM/SOM value is a
  hard fail, even if the correct funnel figures are also present
  elsewhere in the document.
  - PASS: "The $14B electricity figure is excluded — it is energy spend,
    not software spend."
  - PASS: submission never references the $14B figure at all
  - PASS: "We ignore the $14,000,000,000 as a category mismatch."
  - FAIL: "TAM = $14,000,000,000 (national freight electricity market)"
  - FAIL: "SAM = $14B × 40% × 55% = $3.08B"
  - FAIL: any tier value derived from or set equal to 14,000,000,000
- **obj-5**: whole-file `wc -w` for the 500-word cap.
  - PASS: file is 480 words
  - PASS: file is 305 words
  - FAIL: file is 540 words
  - FAIL: file is 610 words

### Subjective guidance

- **Sizing methodology**: does the submission use a proper top-down
  funnel (TAM -> SAM -> SOM) with each filter clearly attached to a
  specific tier, rather than three independently-derived numbers that
  don't nest?
- **Assumption transparency**: are the private-yard %, telematics %, and
  capacity assumptions called out explicitly enough for a stakeholder to
  challenge any one of them individually?
- **Reasoning quality**: does REASONING.md explain why the $14B
  freight-electricity figure was rejected (category mismatch: energy
  spend vs. software spend) rather than merely not using it without
  comment?
