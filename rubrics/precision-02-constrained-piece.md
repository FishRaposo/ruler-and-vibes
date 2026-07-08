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
- Copy quality: would this pass as a real product announcement?
  Concrete benefit per feature beats adjective strings.
- Reasoning quality: does REASONING.md describe how constraints were
  tracked and verified (e.g. counting before delivering)?
