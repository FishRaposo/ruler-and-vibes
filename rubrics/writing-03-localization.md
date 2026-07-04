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
---

## Judge guidance

- You must be fluent in Brazilian Portuguese to judge this test. If
  you are not confident in PT-BR, tell the user instead of scoring.
- Native naturalness: read each output as a native of the target
  language — the mirror-voice standard: a reader should not detect a
  source language behind the text. Penalize translationese (calqued
  syntax, unnatural collocations like "preço de madrugador").
- Transcreation quality: the slogan "Shoot better, edit less" and the
  headline "sem dor de cabeça" are the hard parts — reward versions
  that keep the punch, not just the meaning. "Rain or shine" needs a
  real equivalent (e.g. "faça chuva ou faça sol").
- Reasoning quality: does REASONING.md explain the transcreation
  choices and the date-convention trap?
