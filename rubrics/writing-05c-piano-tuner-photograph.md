---
test: writing-05c-piano-tuner-photograph
canary: "thimbleful dollop"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "story.md is segmented by blank lines into exactly 7 paragraphs, and the first alphabetic character of each paragraph in order spells HARMONY (H-A-R-M-O-N-Y) — if the file is not blank-line-segmented into 7 blocks this check fails"
    - id: obj-2
      check: "story.md whole-file word count is between 190 and 230 inclusive, verified with wc -w"
    - id: obj-3
      check: "None of the five banned words appears anywhere in story.md, checked case-insensitively as WHOLE words with word boundaries: 'abruptly', 'understood', 'quiet', 'hush', 'soul' each occur zero times — a longer word that merely contains these letters (e.g. 'disquiet', 'soulful', 'soulless') does NOT trip the check"
    - id: obj-4
      check: "story.md contains no headings (no line beginning with '#') and no bullet or numbered list markers — it is continuous narrative prose only"
    - id: obj-5
      check: "The story is about a piano tuner discovering an old photograph hidden inside a concert-hall piano's soundboard: both the piano-tuner premise and the found-photograph event are present as narrative elements (judge by reading, not keyword match)"
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

If the phrase "thimbleful dollop" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Verification reference (author-confirmed, matches a working example
authored and checked with `wc -w` and a paragraph-initial-letter
scan): HARMONY is 7 letters, so exactly 7 paragraphs are required and
the paragraph count and the spelled word are mutually consistent.
210 words / 7 paragraphs is roughly 30 words per paragraph on
average, which is comfortable for natural prose — a model does not
need to strain to hit the band.

To check obj-1: split the file on blank lines into blocks, confirm
there are exactly 7 non-empty blocks, then read the first letter of
each block in order. If segmentation does not yield exactly 7 blocks
(e.g. the model ran two paragraphs together, or added an eighth),
fail obj-1 regardless of whether letters elsewhere look promising.

To check obj-3, search the whole file for each banned word using
word boundaries and case-insensitive matching; any hit (including
inside dialogue or as part of a compound like "souls-deep") is a
violation, but words that merely share a substring ("disquiet",
"soulful", "soulless") are not violations — only exact whole-word
matches to abruptly/understood/quiet/hush/soul count.

Example phrasings for the prose-located check (obj-5 — premise
present):

- PASS: "Henry had tuned the hall's grand piano every Tuesday for
  eleven years when his fingers found something stiff wedged against
  the soundboard." (piano tuner + a found object inside the piano
  both present as narrative fact, even before it's identified as a
  photograph)
- PASS: "She eased the cracked photograph out from behind the
  hammers and held it under the work lamp, a bride and groom gone
  the color of weak tea." (found-photograph event clearly enacted,
  even without the word "soundboard" in this sentence, because the
  piano-interior setting is established elsewhere in the piece)
- FAIL: a story about a piano tuner going about routine tuning work
  where no photograph, note, or hidden object is ever found (premise
  half-missing)
- FAIL: a story about someone finding an old photograph in an attic
  or drawer with no piano, tuning work, or soundboard established
  anywhere (other half-missing)
- FAIL: the words "piano" and "photograph" appear only in a title or
  aside with no actual narrative event built around them (keyword
  present, premise not actually enacted)

- **Narrative quality and emotional payoff at flash length**: does
  the piece land as a complete, moving short story rather than a
  fragment or vignette that merely gestures at an ending? Reward a
  clear turn or realization-in-action (without using the banned
  words) and an ending that resonates rather than just stopping.
- **Constraint craft**: does the acrostic requirement disappear into
  natural-sounding prose, or does paragraph 1 obviously exist only to
  start with "H"? Penalize stilted sentences that exist purely to
  hit a letter, and reward paragraph breaks that also function as
  natural scene or beat transitions. The banned-word avoidance should
  read as good writing choices (concrete verbs and images in place of
  the overused reflexes), not as visible avoidance.
- **Reasoning quality**: does the model's process show it planned the
  7-paragraph HARMONY skeleton before drafting, checked the banned
  words and word count before finishing, and made deliberate choices
  about what replaces the reflexive vocabulary the genre reaches for?
