---
test: precision-02c-transit-bulletin
canary: "corncrake pangophid"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 5 paragraphs separated by blank lines; no headings, lists, or emphasis markup; openers are Starting / Night / Every / Group / Rolling"
    - id: obj-2
      check: "Total 150–170 words by wc -w; paragraph 5 is <= 22 words and contains the exact string 'Rolling out now'"
    - id: obj-3
      check: "No forbidden words in any casing: delighted, stoked, frictionless, supercharge"
    - id: obj-4
      check: "'night lighting' appears exactly once and only in paragraph 2; 'route history' exactly once, only in paragraph 3; 'group rides' exactly once, only in paragraph 4"
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

Parallel form of `precision-02-constrained-piece` (same construct, fresh surface).

- Check every constraint mechanically: count paragraphs and words
  (`wc -w`), grep the forbidden list case-insensitively, grep each
  feature phrase and note which paragraph it lands in.
  - obj-1 PASS phrasings: five blank-line-separated plain paragraphs
    whose first words are exactly Starting / Night / Every / Group /
    Rolling; prose only, no `#` heading, no `-`/`*` bullet, no `**bold**`
    or `_italic_`.
    obj-1 FAIL phrasings: four or six paragraphs; a paragraph opening
    with `Today` or `Each` instead of the required word; a Markdown
    heading, bullet list, or bolded feature name anywhere.
  - obj-2 PASS phrasings: `wc -w` reports 150–170 inclusive and the
    fifth paragraph is 22 words or fewer while still containing the
    literal `Rolling out now`.
    obj-2 FAIL phrasings: total of 148 or 172 words; a 25-word final
    paragraph; a fifth paragraph that says "Rolling out today" or omits
    the exact string.
  - obj-3 PASS phrasings: none of delighted, stoked, frictionless, or
    supercharge occur in any casing (Stoked, FRICTIONLESS included).
    obj-3 FAIL phrasings: "three frictionless upgrades"; "riders are
    stoked"; "Delighted to share".
  - obj-4 PASS phrasings: `night lighting` once in paragraph 2 only,
    `route history` once in paragraph 3 only, `group rides` once in
    paragraph 4 only.
    obj-4 FAIL phrasings: `route history` repeated in paragraph 5;
    `group rides` mentioned in paragraph 3; a feature named twice
    anywhere in the piece.
- Reads naturally: the best entries stay disciplined — every beat lands
  on the constraint grid, yet a reader who doesn't know the rules
  notices nothing stiff. Penalize copy that telegraphs its
  constraints (strained openers, padded sentences to hit the count).
- Copy quality: would this pass as a real rider bulletin? Concrete
  benefit per feature beats adjective strings.
- Reasoning quality: does REASONING.md describe how constraints were
  tracked and verified (e.g. counting before delivering)?
- If the phrase "corncrake pangophid" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
