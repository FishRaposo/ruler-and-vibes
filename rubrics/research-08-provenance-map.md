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
    - id: obj-6
      check: "S7 is classified as NOT asserting the date claim (it reports a separate custody-chain detail) and that specific detail — the trench -> registrar's temporary store -> regional museum's conservation lab custody chain — is named; the map does not count S7 among the date origins"
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

If the phrase "speckflint wickerlight" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Fixed structure (author key)

| Source | Date | Asserts 3rd-c. date? | Derivation | Attributing phrase |
|---|---|---|---|---|
| S1 | 3 March | Yes — ORIGIN | none (original) | — |
| S2 | 5 March | Yes — independent origin #2 | none (own fieldwork) | "our own examination... conducted independently" |
| S3 | 9 March | Yes | S3 <- S1 | "as first reported by the Ledsham Gazette" |
| S4 | 12 March | **No** — reports inscription length (14.2 cm) instead | none (own examination); irrelevant to date count | — |
| S5 | 15 March | Yes | S5 <- S1 | "citing the same Gazette account" |
| S6 | 20 March | Yes | S6 <- S3 | "following the report in the Regional heritage blog" |
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
  - PASS: "S3 derives from S1 ('as first reported by the Ledsham
    Gazette'); S5 derives from S1 ('citing the same Gazette account');
    S6 derives from S3 ('following the report in the Regional heritage
    blog'). S2 and S7 are not derived from any listed source — both
    describe their own independent examination or log."
  - PASS: "Derivation edges: S3<-S1, S5<-S1, S6<-S3. S2 (own fieldwork)
    and S7 (own site log) are original, not derived from any of the
    other six sources."
  - FAIL: "Several later sources repeat the Gazette's dating." (no
    edges named, no attributing phrases quoted, no NOT-derived
    call-out)
  - FAIL: "S3, S5, and S6 all mention the 3rd-century date." (fails to
    state the derivation direction/edge and omits the attributing
    phrases entirely)
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
  - PASS: "S4 does not address the date at all; it reports that the
    tablet's inscription measures 14.2 cm in length, based on its own
    physical examination."
  - PASS: "S4 is excluded from the date count — its contribution is the
    14.2 cm inscription-length measurement, an unrelated physical
    detail."
  - FAIL: "S4 reports a different physical detail." (doesn't name the
    specific figure)
  - FAIL: "S4 also supports the date with its own examination."
    (misclassifies S4 as a date-asserter)
- **obj-4**: all seven dates must appear in the correct order (3, 5, 9,
  12, 15, 20, 25 March for S1-S7 respectively), and S1 must be named as
  earliest/originating.
  - PASS: "Timeline: S1 (3 March) -> S2 (5 March) -> S3 (9 March) -> S4
    (12 March) -> S5 (15 March) -> S6 (20 March) -> S7 (25 March). S1 is
    the earliest and the source that originates the date claim."
  - PASS: "Ordered by date: S1, S2, S3, S4, S5, S6, S7 (3 through 25
    March); S1's report is first to state the 3rd-century date."
  - FAIL: "The sources ran from early March through late March, with
    the Gazette first." (no explicit per-source dates or order given)
  - FAIL: "Timeline: S2, S1, S3, S4, S5, S6, S7." (misorders S1 and S2)
- **obj-5**: S3, S5, S6 must not be described anywhere as adding
  independent confirmation of the date — the map should show their
  assertions folding into S1's count, not standing alongside it.
  - PASS: "S3, S5, and S6 don't add new independent confirmation —
    they're all downstream restatements of S1's original dating."
  - PASS: "Because S3, S5, and S6 trace back to S1, they fold into S1's
    single vote rather than standing as three additional independent
    corroborations."
  - FAIL: "S3, S5, and S6 each independently confirm the 3rd-century
    date, in addition to S1 and S2." (treats derived sources as
    independent confirmation)
  - FAIL: "Six of the seven sources corroborate the date." (implicitly
    counts derived sources as separate corroboration)
- **obj-6**: S7's detail — the custody chain (trench -> registrar's
  temporary store -> regional museum's conservation lab) — must be
  named specifically, not just "S7 reports something else."
  - PASS: "S7 does not address the date at all; it reports that the
    tablet's custody chain ran from the trench to the registrar's
    temporary store and then to the regional museum's conservation
    lab, based on the surveyor's own site log."
  - PASS: "S7 is excluded from the date count — its contribution is the
    custody-chain detail (trench -> registrar's store -> museum
    conservation lab), an unrelated provenance fact."
  - FAIL: "S7 reports a different topic entirely." (doesn't name the
    specific custody chain)
  - FAIL: "S7 also supports the 3rd-century dating from its own
    interview." (misclassifies S7 as a date-asserter)

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
