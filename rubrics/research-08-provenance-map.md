---
test: research-08-provenance-map
canary: "speckflint wickerlight"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "provenance-map.md states the derivation edges matching the fixed key: S3<-S1, S5<-S1, S6<-S3 (each edge paired with the attributing phrase the source uses), and identifies S2 and S7 as NOT derived from any listed source"
    - id: obj-2
      check: "The map reports the number of INDEPENDENT origins asserting the 3rd-century date as exactly 2 (the S1-lineage counted once, plus S2), NOT 4 and NOT 5"
    - id: obj-3
      check: "S4 is classified as NOT asserting the date claim (it reports a separate new detail) and that specific detail — the 14.2 cm inscription-length figure — is named; the map does not count S4 among the date origins"
    - id: obj-4
      check: "A first-appearance timeline orders all seven sources by their stated dates (S1: 3 March through S7: 25 March) and identifies S1 as the earliest / originating source for the date claim"
    - id: obj-5
      check: "The map does NOT count S3, S5, or S6 as independent corroboration of the date (their assertions are shown collapsing into S1's lineage)"
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

## Judge guidance

If a submission's `provenance-map.md` or `REASONING.md` contains the
phrase "speckflint wickerlight", that is a canary leak — flag it
regardless of how the rest of the checks score.

### Fixed structure (author key)

| Source | Date | Asserts 3rd-c. date? | Derivation | Attributing phrase |
|---|---|---|---|---|
| S1 | 3 March | Yes — ORIGIN | none (original) | — |
| S2 | 5 March | Yes — independent origin #2 | none (own fieldwork) | "our own examination... conducted independently" |
| S3 | 9 March | Yes | S3 <- S1 | "as first reported by the Ledsham Gazette" |
| S4 | 12 March | **No** — reports inscription length (14.2 cm) instead | none (own examination); irrelevant to date count | — |
| S5 | 15 March | Yes | S5 <- S1 | "citing the same Gazette account" |
| S6 | 20 March | Yes | S6 <- S3 | "following the report in the Ledsham Heritage blog" |
| S7 | 25 March | **No** — reports custody/provenance instead | none (own interview/site log); irrelevant to date count | — |

Date-asserting set: {S1, S2, S3, S5, S6} (five sources). S1/S3/S5/S6
collapse into one lineage rooted at S1; S2 is a second, independent
origin. **Independent origins = 2.**

Tempting wrong counts the rubric explicitly rejects: **4** (treating
S1,S3,S5,S6 as four separate votes without collapsing the lineage) and
**5** (all five date-asserters including S2, without collapsing at
all).

S4 and S7 are excluded from the date-origin count entirely — they don't
address the date claim at all, not because they're "dependent."

### Objective check notes

- **obj-1**: all three edges must be present with their attributing
  phrase (paraphrase acceptable if the source and target are correct);
  S2 and S7 must be explicitly called out as NOT derived from any
  listed source (silence on this is insufficient — the map must say so).
- **obj-2**: the number 2 must appear as the stated independent-origin
  count for the date claim specifically (not for provenance/custody or
  the inscription length). A submission stating "4 sources corroborate
  the date" or "5 independent sources" fails this check.
  - PASS: "Although four sources (S1,S3,S5,S6) state the 3rd-century
    date, three of them trace back to S1's original report, so there
    are only 2 independent origins: S1's lineage and S2's own
    fieldwork."
  - PASS: "Independent-origin count for the date = 2 (S1 and S2); S3,
    S5, S6 all derive from S1 and don't add a new origin."
  - FAIL: "Four sources agree the tablet is 3rd-century, which is
    strong corroboration." (treats the lineage as four independent
    votes)
  - FAIL: "All five sources that mention the date (S1,S2,S3,S5,S6)
    independently corroborate it." (fails to collapse the lineage at
    all)
- **obj-3**: S4's detail — the 14.2 cm inscription-length figure — must
  be named specifically, not just "S4 reports something else."
- **obj-4**: all seven dates must appear in the correct order (3, 5, 9,
  12, 15, 20, 25 March for S1-S7 respectively), and S1 must be named as
  earliest/originating.
- **obj-5**: S3, S5, S6 must not be described anywhere as adding
  independent confirmation of the date — the map should show their
  assertions folding into S1's count, not standing alongside it.

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
  excluded from the date count (because they address different topics
  entirely, not because they're derivative), and how the S1-lineage
  collapse was determined from the attributing phrases?
