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
anchors:
  - id: Reads naturally under constraints
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Copy quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

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
- Reads naturally under constraints: the best entries stay disciplined —
  every beat lands on the constraint grid, yet a reader who doesn't know
  the rules notices nothing stiff. Penalize copy that telegraphs its
  constraints (strained openers, padded sentences to hit the count).
  - PASS: the mandated opener words start sentences that would read the
    same way if no rule existed.
  - PASS: sentence lengths vary and the word count is hit without any
    visible padding.
  - PASS: the <= 22-word closing paragraph still lands a clean, complete
    thought around `Rolling out now`.
  - FAIL: an opener is bolted on ungrammatically ("Group. Rides now open
    to everyone.") just to satisfy the first-word rule.
  - FAIL: an obvious filler clause ("and that is really something worth
    noting here") is wedged in only to reach 150 words.
  - FAIL: a paragraph reads as a keyword-stuffed list of the feature name
    rather than a sentence.
- Copy quality: would this pass as a real rider bulletin? Concrete
  benefit per feature beats adjective strings.
  - PASS: each feature paragraph names a specific, tangible benefit (lit
    paths after dark, a rideable log of past trips, a discount for riding
    with friends).
  - PASS: the voice is practical and upbeat, fitting a city transit
    operator.
  - FAIL: a feature is described only with vague praise and no concrete
    detail a rider could act on.
  - FAIL: the tone is generic marketing boilerplate that could describe
    any product.
- Reasoning quality: does REASONING.md describe how the constraints were
  tracked and verified (e.g. counting words and paragraphs, checking
  openers and the forbidden list before delivering)?
  - PASS: the reasoning shows an explicit word/paragraph count and a
    forbidden-word sweep done before finalizing.
  - PASS: the reasoning notes how each feature phrase was placed once in
    its assigned paragraph and checked.
  - FAIL: the reasoning is absent, or asserts the constraints were met
    without any evidence of counting or checking.
  - FAIL: the reasoning describes a method that would not actually catch
    a violation (e.g. "it looked about right").
- If the phrase "corncrake pangophid" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
