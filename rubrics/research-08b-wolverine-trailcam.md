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
    - id: obj-6
      check: "S7 is classified as NOT asserting the identification claim (it reports a separate custody-chain detail) and that specific detail — the housing -> ranger station's evidence locker -> state wildlife lab custody chain — is named; the map does not count S7 among the identification origins"
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
anchors:
  - id: Independence reasoning
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.
  - id: Provenance mapping
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `research-08-provenance-map` (same construct, fresh surface).

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
  - PASS: "S3 derives from S1 ('as first reported by the Bramble Hollow
    Courier'); S5 derives from S1 ('citing the same Courier account');
    S6 derives from S3 ('following the report on the Fernridge
    Naturalist blog'). S2 and S7 are not derived from any listed
    source — both describe their own independent review or log."
  - PASS: "Derivation edges: S3<-S1, S5<-S1, S6<-S3. S2 (own review) and
    S7 (own equipment log) are original, not derived from any of the
    other six sources."
  - FAIL: "Several later sources repeat the Courier's identification."
    (no edges named, no attributing phrases quoted, no NOT-derived
    call-out)
  - FAIL: "S3, S5, and S6 all mention the wolverine." (fails to state
    the derivation direction/edge and omits the attributing phrases
    entirely)
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
  - PASS: "S4 does not address the identification at all; it reports
    that the front paw print measures 9.8 cm across, based on its own
    physical examination."
  - PASS: "S4 is excluded from the identification count — its
    contribution is the 9.8 cm front-paw print width measurement, an
    unrelated physical detail."
  - FAIL: "S4 reports a different physical detail." (doesn't name the
    specific figure)
  - FAIL: "S4 also supports the identification with its own
    examination." (misclassifies S4 as an identification-asserter)
- **obj-4**: all seven dates must appear in the correct order (2, 6, 11,
  15, 19, 24, 29 April for S1-S7 respectively), and S1 must be named as
  earliest/originating.
  - PASS: "Timeline: S1 (2 April) -> S2 (6 April) -> S3 (11 April) -> S4
    (15 April) -> S5 (19 April) -> S6 (24 April) -> S7 (29 April). S1 is
    the earliest and the source that originates the identification
    claim."
  - PASS: "Ordered by date: S1, S2, S3, S4, S5, S6, S7 (2 through 29
    April); S1's report is first to identify the animal as a
    wolverine."
  - FAIL: "The sources ran from early April through late April, with
    the Courier first." (no explicit per-source dates or order given)
  - FAIL: "Timeline: S2, S1, S3, S4, S5, S6, S7." (misorders S1 and S2)
- **obj-5**: S3, S5, S6 must not be described anywhere as adding
  independent confirmation of the identification — the map should show
  their assertions folding into S1's count, not standing alongside it.
  - PASS: "S3, S5, and S6 don't add new independent confirmation —
    they're all downstream restatements of S1's original
    identification."
  - PASS: "Because S3, S5, and S6 trace back to S1, they fold into S1's
    single vote rather than standing as three additional independent
    corroborations."
  - FAIL: "S3, S5, and S6 each independently confirm the wolverine
    identification, in addition to S1 and S2." (treats derived sources
    as independent confirmation)
  - FAIL: "Six of the seven sources corroborate the identification."
    (implicitly counts derived sources as separate corroboration)
- **obj-6**: S7's detail — the custody chain (housing -> ranger
  station's evidence locker -> state wildlife lab) — must be named
  specifically, not just "S7 reports something else."
  - PASS: "S7 does not address the identification at all; it reports
    that the memory card's custody chain ran from the housing to the
    ranger station's evidence locker and then to the state wildlife
    lab, based on the technician's own equipment log."
  - PASS: "S7 is excluded from the identification count — its
    contribution is the custody-chain detail (housing -> evidence
    locker -> state wildlife lab), an unrelated chain-of-possession
    fact."
  - FAIL: "S7 reports a different topic entirely." (doesn't name the
    specific custody chain)
  - FAIL: "S7 also supports the wolverine identification from its own
    interview." (misclassifies S7 as an identification-asserter)

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
