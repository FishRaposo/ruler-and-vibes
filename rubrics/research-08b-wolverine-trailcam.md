---
test: research-08b-wolverine-trailcam
canary: "spruce yew"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "provenance-map.md states the derivation edges matching the fixed key: S3<-S1, S5<-S1, S6<-S3 (each edge paired with the attributing phrase the source uses), and identifies S2 and S7 as NOT derived from any listed source"
    - id: obj-2
      check: "The map reports the number of INDEPENDENT origins asserting the wolverine identification as exactly 2 (the S1-lineage counted once, plus S2), NOT 4 and NOT 5"
    - id: obj-3
      check: "S4 is classified as NOT asserting the identification claim (it reports a separate new detail) and that specific detail — the 9.8 cm front-paw print width figure — is named; the map does not count S4 among the identification origins"
    - id: obj-4
      check: "A first-appearance timeline orders all seven sources by their stated dates (S1: 2 April through S7: 29 April) and identifies S1 as the earliest / originating source for the identification claim"
    - id: obj-5
      check: "The map does NOT count S3, S5, or S6 as independent corroboration of the identification (their assertions are shown collapsing into S1's lineage)"
  subjective:
    - id: sub-quality
      name: "Independence reasoning"
      weight: 0.4
    - id: sub-craft
      name: "Provenance mapping"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

Parallel form of `research-08-provenance-map` (same construct, fresh
surface).

## Judge guidance

If the phrase "spruce yew" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

### Fixed structure (author key)

| Source | Date | Asserts wolverine ID? | Derivation | Attributing phrase |
|---|---|---|---|---|
| S1 | 2 April | Yes — ORIGIN | none (original) | — |
| S2 | 6 April | Yes — independent origin #2 | none (own review) | "our own review... conducted independently" |
| S3 | 11 April | Yes | S3 <- S1 | "as first reported by the Bramble Hollow Courier" |
| S4 | 15 April | **No** — reports front-paw print width (9.8 cm) instead | none (own examination); irrelevant to ID count | — |
| S5 | 19 April | Yes | S5 <- S1 | "citing the same Courier account" |
| S6 | 24 April | Yes | S6 <- S3 | "following the report on the Fernridge Naturalist blog" |
| S7 | 29 April | **No** — reports custody/chain-of-possession of the memory card instead | none (own interview/equipment log); irrelevant to ID count | — |

Identification-asserting set: {S1, S2, S3, S5, S6} (five sources).
S1/S3/S5/S6 collapse into one lineage rooted at S1; S2 is a second,
independent origin. **Independent origins = 2.**

Tempting wrong counts the rubric explicitly rejects: **4** (treating
S1,S3,S5,S6 as four separate votes without collapsing the lineage) and
**5** (all five identification-asserters including S2, without
collapsing at all).

S4 and S7 are excluded from the identification-origin count entirely —
they don't address the identification claim at all, not because they're
"dependent."

### Objective check notes

- **obj-1**: all three edges must be present with their attributing
  phrase (paraphrase acceptable if the source and target are correct);
  S2 and S7 must be explicitly called out as NOT derived from any
  listed source (silence on this is insufficient — the map must say so).
- **obj-2**: the number 2 must appear as the stated independent-origin
  count for the identification claim specifically (not for
  custody/provenance or the paw-print measurement). A submission stating
  "4 sources corroborate the identification" or "5 independent sources"
  fails this check.
  - PASS: "Although four sources (S1,S3,S5,S6) identify the animal as a
    wolverine, three of them trace back to S1's original report, so
    there are only 2 independent origins: S1's lineage and S2's own
    review."
  - PASS: "Independent-origin count for the identification = 2 (S1 and
    S2); S3, S5, S6 all derive from S1 and don't add a new origin."
  - FAIL: "Four sources agree the animal is a wolverine, which is strong
    corroboration." (treats the lineage as four independent votes)
  - FAIL: "All five sources that mention the identification (S1,S2,S3,
    S5,S6) independently corroborate it." (fails to collapse the
    lineage at all)
- **obj-3**: S4's detail — the 9.8 cm front-paw print width figure —
  must be named specifically, not just "S4 reports something else."
- **obj-4**: all seven dates must appear in the correct order (2, 6, 11,
  15, 19, 24, 29 April for S1-S7 respectively), and S1 must be named as
  earliest/originating.
- **obj-5**: S3, S5, S6 must not be described anywhere as adding
  independent confirmation of the identification — the map should show
  their assertions folding into S1's count, not standing alongside it.

### Subjective guidance

- **Independence reasoning**: does the submission correctly reason that
  a chain of attribution (S3<-S1, S5<-S1, S6<-S3) means these sources
  cannot be treated as separate votes, while still correctly crediting
  S2 as a genuinely separate, independently-sourced assertion?
- **Provenance mapping**: is the derivation map easy to follow — clear
  who derives from whom, with the specific attributing language quoted
  or closely paraphrased, rather than a vague "some sources repeat
  others" statement?
- **Reasoning quality**: does `REASONING.md` explain why S4 and S7 were
  excluded from the identification count (because they address
  different topics entirely, not because they're derivative), and how
  the S1-lineage collapse was determined from the attributing phrases?
