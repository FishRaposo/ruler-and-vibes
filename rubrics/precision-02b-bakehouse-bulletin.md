---
test: precision-02b-bakehouse-bulletin
canary: "yellowhammer manatee"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 5 paragraphs separated by blank lines; no headings, lists, or emphasis markup; openers are Starting / Sourdough / Members / Evening / Doors"
    - id: obj-2
      check: "Total 145–165 words by wc -w; paragraph 5 is <= 18 words and contains the exact string 'open now'"
    - id: obj-3
      check: "No forbidden words in any casing: delighted, elevate, artisanal, unbeatable"
    - id: obj-4
      check: "'sourdough club' appears exactly once and only in paragraph 2; 'grain share' exactly once, only in paragraph 3; 'evening bakes' exactly once, only in paragraph 4"
  subjective:
    - id: sub-quality
      name: "Reads naturally under constraints"
      weight: 0.4
    - id: sub-craft
      name: "Copy quality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `precision-02-constrained-piece` (same construct, fresh
surface).

- Check every constraint mechanically: count paragraphs and words
  (`wc -w`), grep the forbidden list case-insensitively, grep each
  offering phrase and note which paragraph it lands in. Concretely:
  paragraphs split on blank lines must number exactly 5; the first token
  of each must be `Starting`, `Sourdough`, `Members`, `Evening`, `Doors`
  in order; total words fall in 145–165; paragraph 5 is ≤ 18 words and
  contains the literal substring `open now`; none of `delighted`,
  `elevate`, `artisanal`, `unbeatable` occur in any casing; and each of
  `sourdough club`, `grain share`, `evening bakes` occurs exactly once,
  each confined to paragraphs 2, 3, 4 respectively.
- Reads naturally under constraints: the best entries keep every beat on
  the constraint grid, yet a reader who does not know the rules notices
  nothing stiff. Penalize copy that telegraphs its constraints (strained
  openers, filler clauses padded in only to reach the word count).
  - PASS: the mandated opener words start sentences that would read the
    same way if no rule existed.
  - PASS: sentence lengths vary and the word count is hit without any
    visible padding.
  - PASS: the ≤ 18-word closing paragraph still lands a clean, complete
    thought around `open now`.
  - FAIL: an opener is bolted on ungrammatically ("Doors. Open now for
    everyone.") just to satisfy the first-word rule.
  - FAIL: an obvious filler clause ("and that is really something worth
    noting here") is wedged in only to reach 145 words.
  - FAIL: a paragraph reads as a keyword-stuffed list of the offering
    name rather than a sentence.
- Copy quality: would this pass as a real bakery membership bulletin?
  A concrete benefit per offering beats adjective strings.
  - PASS: each offering paragraph names a specific, tangible benefit (a
    weekly loaf delivered, a monthly sack of flour, late-day fresh bread).
  - PASS: the voice is warm and plainspoken, fitting a neighbourhood co-op.
  - FAIL: an offering is described only with vague praise and no concrete
    detail a member could act on.
  - FAIL: the tone is generic marketing boilerplate that could describe
    any product.
- Reasoning quality: does REASONING.md describe how the constraints were
  tracked and verified (e.g. counting words and paragraphs, checking
  openers and the forbidden list before delivering)?
  - PASS: the reasoning shows an explicit word/paragraph count and a
    forbidden-word sweep done before finalizing.
  - PASS: the reasoning notes how each offering phrase was placed once in
    its assigned paragraph and checked.
  - FAIL: the reasoning is absent, or asserts the constraints were met
    without any evidence of counting or checking.
  - FAIL: the reasoning describes a method that would not actually catch
    a violation (e.g. "it looked about right").

If the phrase "yellowhammer manatee" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
