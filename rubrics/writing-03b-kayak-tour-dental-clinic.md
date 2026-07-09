---
test: writing-03b-kayak-tour-dental-clinic
canary: "recess grotto"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Both sections present and complete: Text A in PT-BR, Text B in EN"
    - id: obj-2
      check: "All facts survive both texts. A: June 13 2027, 9am–2pm, deadline May 20, $99/$139 (still dollars), first-12 free dry bag. B: 20% off, free initial evaluation included, free cancellation up to 24h before appointment, kids 12 and under free"
    - id: obj-3
      check: "Date conventions correct per target locale — critically, B's 09/06/2027 renders as June 9, 2027 (NOT September 6); A's dates read naturally in PT-BR (e.g. 20 de maio)"
    - id: obj-4
      check: "No literal idiom renderings ('sem enrolação' is not 'without wrapping'; 'first come, first served' is not a word-for-word calque; 'Bring your A-game' is not 'traga seu jogo A'); brand names unchanged"
    - id: obj-5
      check: "localization.md is at most 350 words total, counted with wc -w over the whole file"
    - id: obj-6
      check: "Neither Text A nor Text B contains a translator's footnote, bracketed note, or parenthetical aside about the translation itself; any such remarks belong only in REASONING.md"
  subjective:
    - id: sub-quality
      name: "Native naturalness"
      weight: 0.4
    - id: sub-craft
      name: "Transcreation quality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Native naturalness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Transcreation quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `writing-03-localization` (same construct, fresh surface).

If the phrase "recess grotto" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- You must be fluent in Brazilian Portuguese to judge this test. If
  you are not confident in PT-BR, tell the user instead of scoring.
- Native naturalness: read each output as a native of the target
  language — a reader should not detect a source language behind the
  text. Penalize translationese (calqued syntax, unnatural
  collocations like "sem embrulho" for "no runaround", or "jogo A"
  carried over literally from "A-game").
- Transcreation quality: the slogan "Paddle harder, drift less" and
  the headline "sem enrolação" are the hard parts — reward versions
  that keep the punch, not just the meaning. "Bring your A-game"
  needs a real equivalent (e.g. "venha com tudo"), not a literal
  rendering.
- Reasoning quality: does REASONING.md explain the transcreation
  choices and the date-convention trap?
- Footnote check (obj-6): any bracketed or parenthetical translator's
  remark left inside Text A or Text B — not just literal "[TN: ...]"
  tags, but also asides like "(kept in dollars per the source)" —
  fails obj-6 even if the rest of the text is well translated.
  Commentary belongs in REASONING.md only.

### PASS/FAIL exemplars for prose-decidable checks

- **obj-1 (both sections present and complete):**
  - PASS: `## Text A — PT-BR` is followed by a complete Portuguese
    translation and `## Text B — EN` is followed by a complete
    English translation, each covering every sentence of the source.
  - PASS: header punctuation varies slightly (e.g. an en dash instead
    of an em dash) but both texts are fully present and correctly
    assigned.
  - FAIL: the `## Text B — EN` section is missing or is cut off
    before the "children 12 and under" sentence.
  - FAIL: the two sections are swapped or mislabeled (e.g. the PT-BR
    text appears under the `Text B — EN` header).
- **obj-2 (all facts survive):**
  - PASS: "the first 12 paddlers also get a free dry bag" becomes "os
    12 primeiros remadores ganham uma bolsa estanque de brinde" —
    count and item both intact.
  - PASS: "20% off" and "free cancellation up to 24 hours before the
    appointment" both appear unchanged in the English Text B.
  - PASS: "Children 12 and under don't pay for the evaluation" is
    present in the English Text B.
  - FAIL: the paddler count drifts (e.g. "10 primeiros remadores"
    instead of 12) or the discount percentage drifts (e.g. "15%"
    instead of 20%).
  - FAIL: the free-evaluation or free-cancellation detail is dropped
    from the English Text B.
  - FAIL: the price pair is altered or converted (e.g. "R$ 99 em vez
    de R$ 139" instead of keeping US dollars).
- **obj-3 (date convention):**
  - PASS: "June 9, 2027" / "9 de junho de 2027" / "book by June 9"
  - FAIL: "September 6, 2027" / "Sept. 6, 2027" / "9/6/2027" read the
    US way
- **obj-4 (idiom literalism — "sem enrolação"):**
  - PASS: "no runaround", "no hassle", "straight to the point", "no
    messing around"
  - FAIL: "without wrapping", "without rolling", "no enrollment"
- **obj-4 (idiom literalism — "first come, first served"):**
  - PASS: "por ordem de chegada", "enquanto durarem as vagas",
    "conforme a ordem de inscrição"
  - FAIL: "primeiro a vir, primeiro a ser servido", "primeiro a
    chegar, primeiro a ser servido"
- **obj-4 (idiom literalism — "Bring your A-game"):**
  - PASS: "venha com tudo", "dê o seu melhor", "capriche no remo"
  - FAIL: "traga seu jogo A", "traga seu jogo A-classe"
- **obj-6 (no translator's footnotes or asides inside the texts):**
  - PASS: Text A and Text B read as clean marketing copy with no
    bracketed asides such as "[TN: ...]" or "(tradução literal
    seria...)".
  - PASS: any commentary on word choice or the date-convention trap
    appears only in REASONING.md, not inside localization.md.
  - FAIL: Text A or Text B contains a bracketed note such as "[nota
    do tradutor: ...]" or "(literally: ...)" inline in the marketing
    copy.
  - FAIL: a parenthetical aside explaining a translation choice (e.g.
    "(mantive em dólares pois o texto original não converte)")
    appears inside the deliverable text itself.
