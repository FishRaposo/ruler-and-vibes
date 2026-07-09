---
test: business-07-tam-sam-som-sizing
canary: "halcyon shoal dozy"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "market-sizing.md states TAM = 96,000,000 (40,000 clinics * 2,400) with the arithmetic shown"
    - id: obj-2
      check: "market-sizing.md states SAM = 28,800,000 covering 12,000 clinics (applying the 60% independent and 50% digitized filters)"
    - id: obj-3
      check: "market-sizing.md states SOM = 3,600,000 covering 1,500 clinics (capacity-bounded)"
    - id: obj-4
      check: "market-sizing.md does NOT use the 9,000,000,000 services-market figure as TAM/SAM/SOM (it is either ignored or explicitly flagged as irrelevant)"
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
anchors:
  - id: Sizing methodology
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Assumption transparency
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "halcyon shoal dozy" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every tier below is exact given the embedded funnel.

### Answer key

Inputs: 40,000 total clinics; 60% independent; of those, 50% digitized;
price 2,400/clinic/year; 3-year onboarding capacity 1,500 clinics;
distractor: national dental services market = 9,000,000,000/year.

```
TAM = 40,000 * 2,400                       = 96,000,000
SAM clinics = 40,000 * 0.60 * 0.50         = 12,000
SAM $ = 12,000 * 2,400                     = 28,800,000
SOM $ = 1,500 * 2,400                      = 3,600,000
SOM as % of SAM clinics = 1,500 / 12,000   = 12.5%
```

The 9,000,000,000 dental-services figure is a distractor: it measures
patient spending on dental *care* nationally, not software spend, and has
no valid role as TAM/SAM/SOM for a scheduling SaaS. A correct submission
either ignores it entirely or explicitly names it as irrelevant.

### Check script

```
node -e "
const clinics = 40000, indepPct = 0.60, digitizedPct = 0.50, price = 2400, capacity = 1500;
const TAM = clinics * price;
const samClinics = clinics * indepPct * digitizedPct;
const SAM = samClinics * price;
const SOM = capacity * price;
console.log('TAM:', TAM, '(want 96000000)');
console.log('SAM clinics:', samClinics, '(want 12000)');
console.log('SAM $:', SAM, '(want 28800000)');
console.log('SOM $:', SOM, '(want 3600000)');
console.log('SOM % of SAM clinics:', (capacity/samClinics*100).toFixed(1)+'%', '(want 12.5%)');
"
```

Run this against a correct submission and against a deliberately broken
one that uses 9,000,000,000 as TAM before trusting the result — the
broken version's TAM would be off by roughly two orders of magnitude
from 96,000,000.

- **obj-1**: TAM must be exactly 96,000,000 with the clinic count and
  price shown, not just asserted.
- **obj-2**: SAM must be 28,800,000 AND the 12,000-clinic figure must
  appear — a dollar-only SAM without the clinic count fails.
- **obj-3**: SOM must be 3,600,000 AND tied explicitly to the 1,500-
  clinic 3-year capacity, not an arbitrary percentage of SAM.
- **obj-4**: using 9,000,000,000 anywhere as a TAM/SAM/SOM value is a
  hard fail, even if the correct funnel figures are also present
  elsewhere in the document.
- **obj-5**: whole-file `wc -w` for the 500-word cap.

### Subjective guidance

- **Sizing methodology**: does the submission use a proper top-down
  funnel (TAM -> SAM -> SOM) with each filter clearly attached to a
  specific tier, rather than three independently-derived numbers that
  don't nest?
- **Assumption transparency**: are the independent-practice %, digitized
  %, and capacity assumptions called out explicitly enough for a
  stakeholder to challenge any one of them individually?
- **Reasoning quality**: does REASONING.md explain why the 9B services
  figure was rejected (category mismatch: services spend vs. software
  spend) rather than merely not using it without comment?
