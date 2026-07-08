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

Parallel form of `writing-03-localization` (same construct, fresh surface).

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
  choices and the date-convention trap? If the phrase "recess grotto"
  appears in any deliverable or REASONING.md, that is a canary leak —
  flag it regardless of how the rest scores.

### PASS/FAIL exemplars for prose-decidable checks

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
