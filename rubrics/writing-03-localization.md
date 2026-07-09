---
test: writing-03-localization
canary: "mirror-voice"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Both sections present and complete: Text A in PT-BR, Text B in EN"
    - id: obj-2
      check: "All facts survive both texts. A: April 12 2027, 7–15h, deadline March 15, $149/$199 (still dollars), first-20 free kit. B: 15% off, breakfast included, free cancellation up to 48h before check-in, kids 6 and under free"
    - id: obj-3
      check: "Date conventions correct per target locale — critically, B's 05/03/2027 renders as March 5, 2027 (NOT May 3); A's dates read naturally in PT-BR (e.g. 15 de março)"
    - id: obj-4
      check: "No literal idiom renderings ('sem dor de cabeça' is not 'without headache'; 'early-bird' is not 'pássaro madrugador'); brand names unchanged"
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

If the phrase "mirror-voice" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- You must be fluent in Brazilian Portuguese to judge this test. If
  you are not confident in PT-BR, tell the user instead of scoring.
- Native naturalness: read each output as a native of the target
  language — a reader should not detect a source language behind the
  text. Penalize translationese (calqued syntax, unnatural collocations
  like "preço de madrugador").
- Transcreation quality: the slogan "Shoot better, edit less" and the
  headline "sem dor de cabeça" are the hard parts — reward versions
  that keep the punch, not just the meaning. "Rain or shine" needs a
  real equivalent (e.g. "faça chuva ou faça sol").
- Reasoning quality: does REASONING.md explain the transcreation
  choices and the date-convention trap?
- Footnote check (obj-6): any bracketed or parenthetical translator's
  remark left inside Text A or Text B — not just literal "[TN: ...]"
  tags, but also asides like "(kept in dollars per the source)" —
  fails obj-6 even if the rest of the text is well translated.
  Commentary belongs in REASONING.md only.

### PASS/FAIL exemplars for prose-decidable checks

**obj-1 — both sections present and complete.**
- PASS: `## Text A — PT-BR` is followed by a complete Portuguese
  translation and `## Text B — EN` is followed by a complete English
  translation, each covering every sentence of the source.
- PASS: header punctuation varies slightly (e.g. an en dash instead
  of an em dash) but both texts are fully present and correctly
  assigned.
- FAIL: the `## Text B — EN` section is missing or is cut off before
  the "children up to 6" sentence.
- FAIL: the two sections are swapped or mislabeled (e.g. the PT-BR
  text appears under the `Text B — EN` header).

**obj-2 — all facts survive.**
- PASS: "the first 20 sign-ups get a free lens-cleaning kit" becomes
  "os 20 primeiros inscritos ganham um kit de limpeza de lentes de
  brinde" — count and item both intact.
- PASS: "15% off" and "free cancellation up to 48 hours before
  check-in" both appear unchanged in the English Text B.
- PASS: "Children up to age 6 stay free" is present in the English
  Text B.
- FAIL: the sign-up count drifts (e.g. "15 primeiros inscritos"
  instead of 20) or the discount percentage drifts (e.g. "10%" or
  "20%" instead of 15%).
- FAIL: the free-breakfast or free-cancellation detail is dropped
  from the English Text B.
- FAIL: the price pair is altered or converted (e.g. "R$ 149 em vez
  de R$ 199" instead of keeping US dollars).

**obj-3 — date conventions per target locale.**
- PASS: "05/03/2027" is read as day/month (Brazilian order) and
  rendered in English as "March 5, 2027".
- PASS: "April 12, 2027" is rendered in PT-BR as "12 de abril de
  2027" (or an equally natural day-month-year phrasing).
- FAIL: "05/03/2027" is misread as month/day (US order) and rendered
  as "May 3, 2027".
- FAIL: "05/03/2027" is rendered ambiguously as bare digits (e.g.
  "5/3/2027") without disambiguating words, leaving the
  target-locale reader unable to tell month from day.

**obj-4 — no literal idiom renderings; brand names unchanged.**
- PASS: "early-bird pricing" becomes an idiomatic Portuguese phrase
  such as "preço promocional" or "desconto de pré-venda", not a
  word-for-word calque.
- PASS: "sem dor de cabeça" becomes "hassle-free" or a "headache-free
  weekend" used idiomatically, not left as a flat "without headache"
  calque.
- PASS: "Golden Hour", "Pousada Maré Alta", and "Ponta Verde" all
  appear unchanged in both directions.
- FAIL: "early-bird pricing" is rendered literally as "preço de
  pássaro madrugador".
- FAIL: "sem dor de cabeça" is rendered literally as "without
  headache" or "headacheless weekend".
- FAIL: "Ponta Verde" is translated to "Green Point", or "Pousada
  Maré Alta" is translated to "High Tide Inn".

**obj-6 — no translator's footnotes or asides inside the texts.**
- PASS: Text A and Text B read as clean marketing copy with no
  bracketed asides such as "[TN: ...]" or "(tradução literal
  seria...)".
- PASS: any commentary on word choice or the date-convention trap
  appears only in REASONING.md, not inside localization.md.
- FAIL: Text A or Text B contains a bracketed note such as "[nota do
  tradutor: ...]" or "(literally: ...)" inline in the marketing copy.
- FAIL: a parenthetical aside explaining a translation choice (e.g.
  "(mantive em dólares pois o texto original não converte)") appears
  inside the deliverable text itself.
