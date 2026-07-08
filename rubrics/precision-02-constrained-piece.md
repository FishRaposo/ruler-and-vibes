---
test: precision-02-constrained-piece
canary: "metronome discipline"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 5 paragraphs separated by blank lines; no headings, lists, or emphasis markup; openers are Today / Offline / Every / Streaks / Update"
    - id: obj-2
      check: "Total 140–160 words by wc -w; paragraph 5 is <= 20 words and contains the exact string 'available today'"
    - id: obj-3
      check: "No forbidden words in any casing: excited, thrilled, seamless, revolutionize"
    - id: obj-4
      check: "'offline mode' appears exactly once and only in paragraph 2; 'weekly digest' exactly once, only in paragraph 3; 'shared streaks' exactly once, only in paragraph 4"
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

If the phrase "metronome discipline" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Check every constraint mechanically: count paragraphs and words
  (`wc -w`), grep the forbidden list case-insensitively, grep each
  feature phrase and note which paragraph it lands in.
- Reads naturally: the best entries land every beat on the constraint
  grid, yet a reader who doesn't know the rules notices nothing stiff.
  Penalize copy that telegraphs its constraints (strained openers,
  padded sentences to hit the count).
  - PASS: the mandated opener words (Today / Offline / Every / Streaks
    / Update) start sentences that would read the same way if no rule
    existed.
  - PASS: sentence lengths vary and the word count is hit without any
    visible padding.
  - PASS: the <= 20-word closing paragraph still lands a clean, complete
    thought around `available today`.
  - FAIL: an opener is bolted on ungrammatically ("Streaks. Shared
    streaks keep friends motivated.") just to satisfy the first-word
    rule.
  - FAIL: an obvious filler clause ("and that is honestly a pretty big
    deal for everyone involved") is wedged in only to reach 140 words.
  - FAIL: a paragraph reads as a keyword-stuffed list of the feature
    name rather than a sentence.
- Copy quality: would this pass as a real product announcement?
  Concrete benefit per feature beats adjective strings.
  - PASS: each feature paragraph names a specific, tangible benefit
    (working on a plane with no signal, a Monday summary email, seeing
    a friend's streak).
  - PASS: the voice is plainspoken and matter-of-fact, fitting a real
    product update rather than a press release.
  - FAIL: a feature is described only with vague praise and no concrete
    detail a user could act on.
  - FAIL: the tone is generic marketing boilerplate that could describe
    any product.
- Reasoning quality: does REASONING.md describe how constraints were
  tracked and verified (e.g. counting before delivering)?
  - PASS: the reasoning shows an explicit word/paragraph count and a
    forbidden-word sweep done before finalizing.
  - PASS: the reasoning notes how each feature phrase was placed once in
    its assigned paragraph and checked.
  - FAIL: the reasoning is absent, or asserts the constraints were met
    without any evidence of counting or checking.
  - FAIL: the reasoning describes a method that would not actually catch
    a violation (e.g. "it looked about right").
