---
test: writing-03c-run-club-bike-shop
canary: "burrow den"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Both sections present and complete: Text A in PT-BR, Text B in EN"
    - id: obj-2
      check: "All facts survive both texts. A: September 5 2027, 6-7h Tue/Thu, deadline August 10, $89/$129 (still dollars), first-15 free socks. B: 25% off, free diagnostic included, free cancellation up to 12h before appointment, electric bikes exempt from inspection fee"
    - id: obj-3
      check: "Date conventions correct per target locale — critically, B's 08/04/2027 renders as April 8, 2027 (NOT August 4); A's dates read naturally in PT-BR (e.g. 5 de setembro)"
    - id: obj-4
      check: "No literal idiom renderings ('sem dor no bolso' is not 'without pain in the pocket'; 'Rise-and-shine pricing' is not 'preço de levante e brilhe'; 'Go the extra mile' is not 'ande a milha extra'); brand names unchanged ('Peak Stride', 'Oficina Roda Livre', 'Vila Nova')"
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

- You must be fluent in Brazilian Portuguese to judge this test. If
  you are not confident in PT-BR, tell the user instead of scoring.
- Native naturalness: read each output as a native of the target
  language would — a fluent reader should detect no trace of a
  source language behind the text. Penalize translationese (calqued
  syntax, unnatural collocations like "preço de levante e brilhe").
- Transcreation quality: the slogan "Run further, dread less" and the
  headline "sem dor no bolso" are the hard parts — reward versions
  that keep the punch, not just the meaning. "Go the extra mile"
  needs a real equivalent (e.g. "vá além" or "dê um passo a mais"),
  not a literal "milha" (mile is not a Brazilian unit).
- Reasoning quality: does REASONING.md explain the transcreation
  choices and the date-convention trap?
- Footnote check (obj-6): any bracketed or parenthetical translator's
  remark left inside Text A or Text B — not just literal "[TN: ...]"
  tags, but also asides like "(kept in dollars per the source)" —
  fails obj-6 even if the rest of the text is well translated.
  Commentary belongs in REASONING.md only.

**obj-1 — both sections present and complete.**
- PASS: `## Text A — PT-BR` is followed by a complete Portuguese
  translation and `## Text B — EN` is followed by a complete English
  translation, each covering every sentence of the source.
- PASS: header punctuation varies slightly (e.g. an en dash instead
  of an em dash) but both texts are fully present and correctly
  assigned.
- FAIL: the `## Text B — EN` section is missing or is cut off before
  the electric-bikes sentence.
- FAIL: the two sections are swapped or mislabeled (e.g. the PT-BR
  text appears under the `Text B — EN` header).

**obj-2 — all facts survive.**
- PASS: "the first 15 sign-ups get a free pair of running socks"
  becomes "os 15 primeiros inscritos ganham um par de meias de
  corrida de brinde" — count and item both intact.
- PASS: "25% off parts" and "free cancellation up to 12 hours before
  your scheduled time" both appear unchanged in the English Text B.
- PASS: "Electric bikes don't pay the inspection fee" is present in
  the English Text B.
- FAIL: the sign-up count drifts (e.g. "20 primeiros inscritos"
  instead of 15) or the discount percentage drifts (e.g. "15%" or
  "20%" instead of 25%).
- FAIL: the electric-bikes exemption sentence is dropped from the
  English Text B.
- FAIL: the price pair is altered or converted (e.g. "R$ 89 em vez de
  R$ 129" instead of keeping US dollars).

**obj-3 — date conventions per target locale.**
- PASS: "08/04/2027" is read as day/month (Brazilian order) and
  rendered in English as "April 8, 2027".
- PASS: "September 5, 2027" is rendered in PT-BR as "5 de setembro de
  2027" (or an equally natural day-month-year phrasing).
- FAIL: "08/04/2027" is misread as month/day (US order) and rendered
  as "August 4, 2027".
- FAIL: "08/04/2027" is rendered ambiguously as bare digits (e.g.
  "8/4/2027") without disambiguating words, leaving the target-locale
  reader unable to tell month from day.

**obj-4 — no literal idiom renderings; brand names unchanged.**
- PASS: "Rise-and-shine pricing" becomes an idiomatic Portuguese
  phrase such as "preço para os primeiros" or "preço-relâmpago", not
  a word-for-word calque.
- PASS: "sem dor no bolso" becomes "won't break the bank" or "easy on
  your wallet", not "without pain in the pocket".
- PASS: "Peak Stride", "Oficina Roda Livre", and "Vila Nova" all
  appear unchanged in both directions.
- FAIL: "Rise-and-shine pricing" is rendered literally as "preço de
  levante e brilhe" or "preço de acorda e brilha".
- FAIL: "sem dor no bolso" is rendered literally as "without pain in
  the pocket" or "no pocket pain".
- FAIL: "Vila Nova" is translated to "New Town", or "Oficina Roda
  Livre" is translated to "Free Wheel Workshop".

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

If the phrase "burrow den" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.
