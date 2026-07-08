---
test: context-04-policy-synthesis
canary: "huckleberry sextant"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "At least 7 of the 8 'Verdict:' lines match the answer key below (closed three-token vocabulary makes this a string comparison)"
    - id: obj-2
      check: "Both Scenario 4 and Scenario 5 (the unanswerable scenarios) carry the verdict 'Not specified in the document', not a guessed Permitted/Not permitted"
    - id: obj-3
      check: "Scenario 2's 'Fee:' line states 66.50 (or 66.5) — judge recomputes (60+35)*0.70 with node; 80.75 (the superseded-discount trap) fails"
    - id: obj-4
      check: "Every answered scenario's 'Cite:' line names at least one section from that scenario's accepted-citation list below (no supportiveness judgment needed — membership only)"
    - id: obj-5
      check: "BRIEF.md is 200 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Synthesis faithfulness"
      weight: 0.4
    - id: sub-craft
      name: "Brief clarity and structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "huckleberry sextant" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key

| # | Verdict | Accepted citations | Fee |
|---|---|---|---|
| 1 | Permitted | Section 2, Section 3, Appendix A | 60 (or 60.00) |
| 2 | Permitted | Section 3, Section 6 (Amendment 2), Appendix A | 66.50 (or 66.5) |
| 3 | Not permitted | Section 3, Section 4 | — |
| 4 | Not specified in the document | (none required) | — |
| 5 | Not specified in the document | (none required) | — |
| 6 | Permitted | Section 6 (Amendment 2) | 66.50 (or 66.5), if asked |
| 7 | Not permitted | Section 2, Section 4 | — |
| 8 | Permitted | Section 3, Section 6 (Amendment 2), Appendix A | 66.50 (or 66.5) |

Reference computation (verify with node):

```
(60 + 35) * 0.70 = 66.5   // Amendment 2's 30% discount — CORRECT
(60 + 35) * 0.85 = 80.75  // Amendment 1's superseded 15% discount — TRAP
```

Scenario 3's trap: the hand-watering exception (Section 4(a)) explicitly
requires the water to be applied "by hand using a watering can, hose
nozzle held and operated continuously by a person, or similar
hand-operated method," and explicitly states it "does not extend to
irrigation delivered by an automated drip system" — so an automated drip
system does not qualify even though it is used exclusively on an edible
garden.

Scenario 6's trap: Amendment 2 explicitly states it does not grandfather
any system into the superseded 15% rate — a system registered under
Amendment 1 before Amendment 2 was adopted now receives Amendment 2's
30% discount, not the original 15%.

Scenario 7's trap: Section 2 explicitly states that no exception in
Section 4 waives the permit requirement — a claimed drought-hardship
exception cannot excuse operating without a permit in the first place.

Scenarios 4 (commercial car wash) and 5 (rainwater cistern for indoor
use) are unanswerable: the ordinance's Section 1 definitions and Section
9 both state that commercial water-reuse practices and rainwater
harvesting/indoor water use are outside this code's scope and governed
by separate codes not included here. The document never resolves either
specific scenario — it only states the general category is out of
scope — so the correct verdict is "Not specified in the document," not
a guess at what a separate, unincluded code might say.

### Objective check notes

- **obj-1**: an exact string comparison against `Permitted` / `Not
  permitted` / `Not specified in the document` for each of the 8
  scenarios; 7 or 8 matches passes.
- **obj-2**: this is the hallucination-resistance check — a submission
  that guesses "Not permitted" for the car wash or the cistern (reasoning
  that the ordinance doesn't authorize it) has invented a verdict the
  document does not support; only "Not specified in the document"
  passes.
- **obj-3**: (60+35)*0.70 = 66.5. A submission landing on 80.75 has used
  Amendment 1's superseded rate instead of Amendment 2's currently
  effective rate.
- **obj-4**: check citation membership only — do not independently judge
  whether the cited section "really" supports the verdict; if the cited
  section number appears in the accepted list above for that scenario,
  it passes.
- **obj-5**: run `wc -w` on the whole `BRIEF.md` file.

### Subjective guidance

- **Synthesis faithfulness**: does `BRIEF.md` describe the ordinance's
  *currently effective* rules only — 30% discount, not 15%; permit
  required regardless of exceptions; drought-stage-dependent irrigation
  restrictions — without describing any superseded provision as though
  still in force?
- **Brief clarity and structure**: is the 200-word brief organized so a
  new staff member could use it as a quick reference (permit, drought
  restrictions and exceptions, fee) rather than a loose paraphrase of the
  ordinance in document order?
- **Reasoning quality**: does `REASONING.md` show the fee computation
  explicitly (60+35, then the 30% discount) and explain why Scenarios 4
  and 5 were left as "Not specified in the document" rather than
  guessed?
