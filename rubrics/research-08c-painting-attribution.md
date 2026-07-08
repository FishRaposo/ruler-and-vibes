---
test: research-08c-painting-attribution
canary: "juniper redwood"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "provenance-map.md states the derivation edges matching the fixed key: S3<-S1, S5<-S1, S6<-S3 (each edge paired with the attributing phrase the source uses), and identifies S2 and S7 as NOT derived from any listed source"
    - id: obj-2
      check: "The map reports the number of INDEPENDENT origins asserting the Vasseur attribution as exactly 2 (the S1-lineage counted once, plus S2), NOT 4 and NOT 5"
    - id: obj-3
      check: "S4 is classified as NOT asserting the attribution claim (it reports a separate new detail) and that specific detail — the 31.5 cm panel-width figure — is named; the map does not count S4 among the attribution origins"
    - id: obj-4
      check: "A first-appearance timeline orders all seven sources by their stated dates (S1: 3 June through S7: 30 June) and identifies S1 as the earliest / originating source for the attribution claim"
    - id: obj-5
      check: "The map does NOT count S3, S5, or S6 as independent corroboration of the attribution (their assertions are shown collapsing into S1's lineage)"
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

Parallel form of `research-08-provenance-map` (same construct, fresh surface).

If a submission's `provenance-map.md` or `REASONING.md` contains the
phrase "juniper redwood", that is a canary leak — flag it regardless of
how the rest of the checks score.

### Fixed structure (author key)

| Source | Date | Asserts Vasseur attribution? | Derivation | Attributing phrase |
|---|---|---|---|---|
| S1 | 3 June | Yes — ORIGIN | none (original) | — |
| S2 | 7 June | Yes — independent origin #2 | none (own examination) | "our own examination... conducted independently" |
| S3 | 11 June | Yes | S3 <- S1 | "as first reported by the Hallcross Auction House" |
| S4 | 16 June | **No** — reports panel width (31.5 cm) instead | none (own examination); irrelevant to attribution count | — |
| S5 | 20 June | Yes | S5 <- S1 | "citing the same Hallcross account" |
| S6 | 25 June | Yes | S6 <- S3 | "following the report on the Cotebridge Notebook" |
| S7 | 30 June | **No** — reports custody/provenance instead | none (own interview/inventory log); irrelevant to attribution count | — |

Attribution-asserting set: {S1, S2, S3, S5, S6} (five sources). S1/S3/S5/S6
collapse into one lineage rooted at S1; S2 is a second, independent
origin. **Independent origins = 2.**

Tempting wrong counts the rubric explicitly rejects: **4** (treating
S1,S3,S5,S6 as four separate votes without collapsing the lineage) and
**5** (all five attribution-asserters including S2, without collapsing at
all).

S4 and S7 are excluded from the attribution-origin count entirely — they
don't address the attribution claim at all, not because they're
"dependent."

### Objective check notes

- **obj-1**: all three edges must be present with their attributing
  phrase (paraphrase acceptable if the source and target are correct);
  S2 and S7 must be explicitly called out as NOT derived from any listed
  source (silence on this is insufficient — the map must say so).
  - PASS: "S3 derives from S1 ('as first reported by the Hallcross
    Auction House'); S5 derives from S1 ('citing the same Hallcross
    account'); S6 derives from S3 ('following the report on the
    Cotebridge Notebook'). S2 and S7 are not derived from any listed
    source — both describe their own independent examination or log."
  - PASS: "Derivation edges: S3<-S1, S5<-S1, S6<-S3. S2 (own institute
    examination) and S7 (own inventory log) are original, not derived
    from any of the other six sources."
  - FAIL: "Several later sources repeat the auction house's attribution."
    (no edges named, no attributing phrases quoted, no NOT-derived
    call-out)
  - FAIL: "S3, S5, and S6 all mention Vasseur." (fails to state the
    derivation direction/edge and omits the attributing phrases entirely)
- **obj-2**: the number 2 must appear as the stated independent-origin
  count for the attribution claim specifically (not for provenance/custody
  or the panel-width detail). A submission stating "4 sources corroborate
  the attribution" or "5 independent sources" fails this check.
  - PASS: "Although four sources (S1, S3, S5, S6) state the Vasseur
    attribution, three of them trace back to S1's original catalogue
    note, so there are only 2 independent origins: S1's lineage and S2's
    own institute examination."
  - PASS: "Independent-origin count for the attribution = 2 (S1 and S2);
    S3, S5, S6 all derive from S1 and don't add a new origin."
  - FAIL: "Four sources agree on the Vasseur attribution, which is strong
    corroboration." (treats the lineage as four independent votes)
  - FAIL: "All five sources that mention the attribution (S1,S2,S3,S5,S6)
    independently corroborate it." (fails to collapse the lineage at all)
- **obj-3**: S4's detail — the 31.5 cm panel-width figure — must be named
  specifically, not just "S4 reports something else."
  - PASS: "S4 does not address the attribution at all; it reports that
    the panel measures 31.5 cm across, based on the conservation lab's
    own physical examination."
  - PASS: "S4 is excluded from the attribution count — its contribution
    is the 31.5 cm panel-width measurement, an unrelated physical
    detail."
  - FAIL: "S4 reports a different physical detail." (doesn't name the
    specific figure)
  - FAIL: "S4 also supports the attribution with its own examination."
    (misclassifies S4 as an attribution-asserter)
- **obj-4**: all seven dates must appear in the correct order (3, 7, 11,
  16, 20, 25, 30 June for S1-S7 respectively), and S1 must be named as
  earliest/originating.
  - PASS: "Timeline: S1 (3 June) -> S2 (7 June) -> S3 (11 June) -> S4 (16
    June) -> S5 (20 June) -> S6 (25 June) -> S7 (30 June). S1 is the
    earliest and the source that originates the attribution claim."
  - PASS: "Ordered by date: S1, S2, S3, S4, S5, S6, S7 (3 through 30
    June); S1's newsletter is first to report the attribution."
  - FAIL: "The sources ran from early June through late June, with the
    auction house first." (no explicit per-source dates or order given)
  - FAIL: "Timeline: S2, S1, S3, S4, S5, S6, S7." (misorders S1 and S2)
- **obj-5**: S3, S5, S6 must not be described anywhere as adding
  independent confirmation of the attribution — the map should show
  their assertions folding into S1's count, not standing alongside it.
  - PASS: "S3, S5, and S6 don't add new independent confirmation —
    they're all downstream restatements of S1's original attribution."
  - PASS: "Because S3, S5, and S6 trace back to S1, they fold into S1's
    single vote rather than standing as three additional independent
    corroborations."
  - FAIL: "S3, S5, and S6 each independently confirm the Vasseur
    attribution, in addition to S1 and S2." (treats derived sources as
    independent confirmation)
  - FAIL: "Six of the seven sources corroborate the attribution."
    (implicitly counts derived sources as separate corroboration)

### Subjective guidance

- **Independence reasoning**: does the submission correctly reason that a
  chain of attribution (S3<-S1, S5<-S1, S6<-S3) means these sources cannot
  be treated as separate votes, while still correctly crediting S2 as a
  genuinely separate, independently-sourced assertion?
- **Provenance mapping**: is the derivation map easy to follow — clear
  who derives from whom, with the specific attributing language quoted
  or closely paraphrased, rather than a vague "some sources repeat
  others" statement?
- **Reasoning quality**: does `REASONING.md` explain why S4 and S7 were
  excluded from the attribution count (because they address different
  topics entirely, not because they're derivative), and how the
  S1-lineage collapse was determined from the attributing phrases?
