---
test: business-07c-audiology-fitting-sizing
canary: "hawthorn bellatrix"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "market-sizing.md states TAM = 115,200,000 (32,000 clinics * 3,600) with the arithmetic shown"
    - id: obj-2
      check: "market-sizing.md states SAM = 33,696,000 covering 9,360 clinics (applying the 45% own-fitting-room and 65% cloud-connected filters)"
    - id: obj-3
      check: "market-sizing.md states SOM = 4,680,000 covering 1,300 clinics (capacity-bounded)"
    - id: obj-4
      check: "market-sizing.md does NOT use the 11,000,000,000 services-market figure as TAM/SAM/SOM (it is either ignored or explicitly flagged as irrelevant)"
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

If the phrase "hawthorn bellatrix" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every tier below is exact given the embedded funnel.

### Answer key

Inputs: 32,000 total clinics; 45% run their own on-site fitting room; of
those, 65% cloud-connected; price 3,600/clinic/year; 3-year onboarding
capacity 1,300 clinics; distractor: national hearing-care services market
= 11,000,000,000/year.

```
TAM = 32,000 * 3,600                        = 115,200,000
SAM clinics = 32,000 * 0.45 * 0.65          = 9,360
SAM $ = 9,360 * 3,600                        = 33,696,000
SOM $ = 1,300 * 3,600                        = 4,680,000
SOM as % of SAM clinics = 1,300 / 9,360      = 13.9%
```

The 11,000,000,000 hearing-care-services figure is a distractor: it
measures patient spending on exams, devices, and follow-up care (a
healthcare-services spend), not spend on fitting/tele-audiology software,
and has no valid role as TAM/SAM/SOM for Auricle's product. A correct
submission either ignores it entirely or explicitly names it as
irrelevant.

### Check script

```
node -e "
const clinics = 32000, ownRoomPct = 0.45, cloudPct = 0.65, price = 3600, capacity = 1300;
const TAM = clinics * price;
const samClinics = clinics * ownRoomPct * cloudPct;
const SAM = samClinics * price;
const SOM = capacity * price;
console.log('TAM:', TAM, '(want 115200000)');
console.log('SAM clinics:', samClinics, '(want 9360)');
console.log('SAM \$:', SAM, '(want 33696000)');
console.log('SOM \$:', SOM, '(want 4680000)');
console.log('SOM % of SAM clinics:', (capacity/samClinics*100).toFixed(1)+'%', '(want 13.9%)');
"
```

Run this against a correct submission and against a deliberately broken
one that uses 11,000,000,000 as TAM before trusting the result — the
broken version's TAM would be off by roughly two orders of magnitude from
115,200,000.

- **obj-1**: TAM must be exactly 115,200,000 with the clinic count and
  price shown, not just asserted.
  - PASS: "TAM = 32,000 × 3,600 = $115,200,000"
  - PASS: "32,000 clinics at $3,600 each → $115.2M TAM"
  - PASS: "Total addressable: 32,000 × $3,600/yr = $115,200,000/yr"
  - FAIL: "TAM is roughly $115M" (no arithmetic shown)
  - FAIL: "TAM = $115,200,000" stated with no clinic count or price
  - FAIL: "TAM = 32,000 × 3,600 = $96,000,000" (wrong product)
- **obj-2**: SAM must be 33,696,000 AND the 9,360-clinic figure must
  appear — a dollar-only SAM without the clinic count fails.
  - PASS: "SAM = 32,000 × 0.45 × 0.65 = 9,360 clinics → $33,696,000"
  - PASS: "9,360 qualifying clinics × $3,600 = $33.696M SAM"
  - PASS: "After the 45% and 65% filters: 9,360 clinics, $33,696,000"
  - FAIL: "SAM = $33,696,000" with no clinic count stated
  - FAIL: "SAM ≈ 9,360 clinics" with no dollar figure
  - FAIL: "SAM = 14,400 clinics × $3,600 = $51,840,000" (skipped the 65%
    cloud-connected filter)
- **obj-3**: SOM must be 4,680,000 AND tied explicitly to the 1,300-clinic
  3-year capacity, not an arbitrary percentage of SAM.
  - PASS: "SOM = 1,300 clinics × $3,600 = $4,680,000 (3-yr capacity)"
  - PASS: "Capacity-bounded: 1,300 clinics → $4,680,000 SOM"
  - PASS: "SOM = $4,680,000, from the 1,300-clinic onboarding ceiling"
  - FAIL: "SOM = 10% of SAM = $3,369,600" (arbitrary % of SAM, not
    capacity-bounded)
  - FAIL: "SOM = $4,680,000" with no mention of the 1,300-clinic capacity
  - FAIL: "SOM = 1,300 clinics × $3,600 = $4,860,000" (wrong product)
- **obj-4**: using 11,000,000,000 anywhere as a TAM/SAM/SOM value is a
  hard fail, even if the correct funnel figures are also present
  elsewhere in the document.
  - PASS: "The $11B services figure is excluded — it is patient-care
    spend, not software spend."
  - PASS: submission never references the $11B figure at all
  - PASS: "We ignore the $11,000,000,000 as a category mismatch."
  - FAIL: "TAM = $11,000,000,000 (national hearing-care services market)"
  - FAIL: "SAM = $11B × 45% × 65% = $3.22B"
  - FAIL: any tier value derived from or set equal to 11,000,000,000
- **obj-5**: whole-file `wc -w` for the 500-word cap.
  - PASS: file is 470 words
  - PASS: file is 295 words
  - FAIL: file is 540 words
  - FAIL: file is 615 words

### Subjective guidance

- **Sizing methodology**: does the submission use a proper top-down
  funnel (TAM -> SAM -> SOM) with each filter clearly attached to a
  specific tier, rather than three independently-derived numbers that
  don't nest?
- **Assumption transparency**: are the own-fitting-room %, cloud-connected
  %, and capacity assumptions called out explicitly enough for a
  stakeholder to challenge any one of them individually?
- **Reasoning quality**: does REASONING.md explain why the $11B
  hearing-care-services figure was rejected (category mismatch:
  patient-care spend vs. software spend) rather than merely not using it
  without comment?
