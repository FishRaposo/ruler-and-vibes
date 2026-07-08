---
test: writing-05b-observatory-balloon-acrostic
canary: "quire colophon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "story.md is segmented by blank lines into exactly 7 paragraphs, and the first alphabetic character of each paragraph in order spells ORBITAL (O-R-B-I-T-A-L) — if the file is not blank-line-segmented into 7 blocks this check fails"
    - id: obj-2
      check: "story.md whole-file word count is between 180 and 220 inclusive, verified with wc -w"
    - id: obj-3
      check: "None of the five banned words appears anywhere in story.md, checked case-insensitively as WHOLE words with word boundaries: 'abruptly', 'learned', 'stillness', 'blackness', 'soul' each occur zero times — a longer word or differently-spelled variant that merely contains or echoes these letters (e.g. 'soulmate', 'soulful', 'learnt') does NOT trip the check"
    - id: obj-4
      check: "story.md contains no headings (no line beginning with '#') and no bullet or numbered list markers — it is continuous narrative prose only"
    - id: obj-5
      check: "The story is about an astronomer discovering a letter inside a fallen weather balloon's instrument pod at a mountain observatory: both the astronomer/observatory premise and the letter-in-the-wreckage discovery event are present as narrative elements (judge by reading, not keyword match)"
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
---

## Judge guidance

Parallel form of `writing-05-acrostic-flash-fiction` (same construct,
fresh surface).

Verification reference (author-confirmed, matches a working example
authored and checked with `wc -w` and a paragraph-initial-letter
scan): ORBITAL is 7 letters, so exactly 7 paragraphs are required and
the paragraph count and the spelled word are mutually consistent.
198 words across 7 paragraphs is roughly 28 words per paragraph on
average, which is comfortable for natural prose — a model does not
need to strain to hit the band.

To check obj-1: split the file on blank lines into blocks, confirm
there are exactly 7 non-empty blocks, then read the first letter of
each block in order. If segmentation does not yield exactly 7 blocks
(e.g. the model ran two paragraphs together, or added an eighth),
fail obj-1 regardless of whether letters elsewhere look promising.

To check obj-3, search the whole file for each banned word using
word boundaries and case-insensitive matching; any hit (including
inside dialogue or as part of a hyphenated compound like
"soul-shaped") is a violation, but words that merely share a
substring or a spelling variant ("soulmate," "soulful," "learnt") are
not violations — only exact whole-word matches to
abruptly/learned/stillness/blackness/soul count.

If the phrase "quire colophon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Example phrasings for the prose-located check (obj-5 — premise
present):

- PASS: "Petra had kept the ridge station for eleven winters before
  anything fell from the sky that wasn't snow, and found the letter
  wedged in the balloon's crumpled pod." (astronomer/observatory +
  letter-in-wreckage both present as narrative fact)
- PASS: "She pried the foam lining loose and found a note gone soft
  with condensation, addressed to whoever climbed high enough to read
  it." (letter-discovery event clearly enacted, even without the word
  "balloon" in this sentence, because it's established elsewhere in
  the piece)
- FAIL: a story about an astronomer at an observatory where no
  balloon, pod, or found letter ever appears (premise half-missing)
- FAIL: a story about someone finding a note in a downed weather
  balloon on a farm with no observatory or astronomer role
  established anywhere (other half-missing)
- FAIL: the words "observatory" and "balloon" appear only in a title
  or aside with no actual narrative event built around them (keyword
  present, premise not actually enacted)

- **Narrative quality and emotional payoff at flash length**: does
  the piece land as a complete, moving short story rather than a
  fragment or vignette that merely gestures at an ending? Reward a
  clear turn or realization-in-action (without using the banned
  words) and an ending that resonates rather than just stopping.
- **Constraint craft**: does the acrostic requirement disappear into
  natural-sounding prose, or does paragraph 1 obviously exist only to
  start with "O"? Penalize stilted sentences that exist purely to hit
  a letter, and reward paragraph breaks that also function as natural
  scene or beat transitions. The banned-word avoidance should read as
  good writing choices (concrete verbs and images in place of the
  overused reflexes), not as visible avoidance.
- **Reasoning quality**: does the model's process show it planned the
  7-paragraph ORBITAL skeleton before drafting, checked the banned
  words and word count before finishing, and made deliberate choices
  about what replaces the reflexive vocabulary the genre reaches for?
