---
test: writing-05-acrostic-flash-fiction
canary: "clockwork oyster"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "story.md is segmented by blank lines into exactly 7 paragraphs, and the first alphabetic character of each paragraph in order spells LANTERN (L-A-N-T-E-R-N) — if the file is not blank-line-segmented into 7 blocks this check fails"
    - id: obj-2
      check: "story.md whole-file word count is between 180 and 220 inclusive, verified with wc -w"
    - id: obj-3
      check: "None of the five banned words appears anywhere in story.md, checked case-insensitively as WHOLE words with word boundaries: 'suddenly', 'realized', 'silence', 'darkness', 'heart' each occur zero times — a longer word that merely contains these letters (e.g. 'hearth', 'heartland', 'realise') does NOT trip the check"
    - id: obj-4
      check: "story.md contains no headings (no line beginning with '#') and no bullet or numbered list markers — it is continuous narrative prose only"
    - id: obj-5
      check: "The story is about a lighthouse keeper receiving a message in a bottle: both the lighthouse-keeper premise and the message-in-a-bottle event are present as narrative elements (judge by reading, not keyword match)"
  subjective:
    - id: sub-quality
      name: "Narrative quality and emotional payoff at flash length"
      weight: 0.4
    - id: sub-craft
      name: "Constraint craft (how naturally the acrostic and banned-word cage disappear into fluent prose)"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Narrative quality and emotional payoff at flash length
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Constraint craft (how naturally the acrostic and banned-word cage disappear into fluent prose)
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "clockwork oyster" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Verification reference (author-confirmed, matches a working example
authored and checked with `wc -w` and a paragraph-initial-letter
scan): LANTERN is 7 letters, so exactly 7 paragraphs are required and
the paragraph count and the spelled word are mutually consistent.
180 words / 7 paragraphs is roughly 26 words per paragraph on
average, which is comfortable for natural prose — a model does not
need to strain to hit the band.

To check obj-1: split the file on blank lines into blocks, confirm
there are exactly 7 non-empty blocks, then read the first letter of
each block in order. If segmentation does not yield exactly 7 blocks
(e.g. the model ran two paragraphs together, or added an eighth),
fail obj-1 regardless of whether letters elsewhere look promising.

To check obj-3, search the whole file for each banned word using
word boundaries and case-insensitive matching; any hit (including
inside dialogue or as part of a compound like "heart-stopping") is a
violation, but words that merely share a substring ("hearth",
"heartland", "realise") are not violations — only exact whole-word
matches to suddenly/realized/silence/darkness/heart count.

Example phrasings for the prose-located check (obj-5 — premise
present):

- PASS: "Mora had kept the light for eleven winters when the bottle
  turned up on the rocks below the tower." (lighthouse keeper +
  message in a bottle both present as narrative fact)
- PASS: "She pried the cork loose and found a note gone soft with
  seawater, addressed to no one she could name." (bottle-message
  event clearly enacted, even without the word "bottle" in this
  sentence, because it's established elsewhere in the piece)
- FAIL: a story about a keeper tending a lighthouse where no bottle,
  note, or found-message ever appears (premise half-missing)
- FAIL: a story about someone finding a message in a bottle on a
  beach with no lighthouse or keeper role established anywhere
  (other half-missing)
- FAIL: the words "lighthouse" and "bottle" appear only in a title or
  aside with no actual narrative event built around them (keyword
  present, premise not actually enacted)

- **Narrative quality and emotional payoff at flash length**: does
  the piece land as a complete, moving short story rather than a
  fragment or vignette that merely gestures at an ending? Reward a
  clear turn or realization-in-action (without using the banned
  words) and an ending that resonates rather than just stopping.
- **Constraint craft**: does the acrostic requirement disappear into
  natural-sounding prose, or does paragraph 1 obviously exist only to
  start with "L"? Penalize stilted sentences that exist purely to
  hit a letter, and reward paragraph breaks that also function as
  natural scene or beat transitions. The banned-word avoidance should
  read as good writing choices (concrete verbs and images in place of
  the overused reflexes), not as visible avoidance.
- **Reasoning quality**: does the model's process show it planned the
  7-paragraph LANTERN skeleton before drafting, checked the banned
  words and word count before finishing, and made deliberate choices
  about what replaces the reflexive vocabulary the genre reaches for?
