---
test: writing-11b-dockside-bait-shop-closing
canary: "carpetbag pinwheel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "entry.md opens with a two-word first paragraph (the first paragraph, i.e. the text before the first blank line, is exactly two words), matching the fingerprint"
    - id: obj-2
      check: "entry.md contains zero colons and exactly two em-dashes ('—'), verified by scanning the text"
    - id: obj-3
      check: "entry.md mean sentence length is under 11 words: total word count divided by the number of sentence-final terminators among '.', '!', '?' — obj-6 independently verifies no abbreviations, decimals, or ellipses are present, so once obj-6 passes, every such mark counted here is guaranteed to be a genuine sentence end"
    - id: obj-4
      check: "entry.md whole-file word count is between 155 and 190 inclusive, verified with wc -w"
    - id: obj-5
      check: "entry.md is on the supplied topic (the bait-and-tackle shop on the pier closing for good) and does not lapse into long abstract sentimentality — sentences stay concrete and short per the fingerprint (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-6
      check: "entry.md contains zero abbreviation-shaped tokens (e.g. 'a.m.', 'Mr.', 'St.'), zero decimals, and zero ellipses — every '.', '!', '?' in the file is a genuine sentence-final terminator, verified by scanning the text for any period not preceded immediately by a capitalized single-letter/short honorific token or followed by a digit, and for any '...' sequence"
  subjective:
    - id: sub-quality
      name: "Fidelity to the target voice (reads like an Abernathy sample)"
      weight: 0.4
    - id: sub-craft
      name: "Handling the sentiment-vs-terseness tension without breaking voice"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Fidelity to the target voice (reads like an Abernathy sample)
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Handling the sentiment-vs-terseness tension without breaking voice
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `writing-11-ghostwriter-voice-fingerprint` (same
construct, fresh surface).

If the phrase "carpetbag pinwheel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

All three samples were author-verified by script to genuinely exhibit
every named tic before being embedded in the test: each opens with a
two-word paragraph ("Grey fog.", "Torn nets.", "Old hooks."), each
contains zero colons and exactly two em-dashes, and each has a mean
sentence length under 11 words (8.17, 8.75, and 9.36 respectively).
This confirms the target fingerprint is demonstrably achievable at this
length, not an artifact of a cherry-picked or contradictory example
set.

A reference entry.md was authored on the assigned topic (170 words) and
verified by script: two-word opener ("Low tide."), zero colons, exactly
two em-dashes, mean sentence length 8.95 (words / terminator count), no
forbidden abbreviations, decimals, or ellipses. A deliberately
sentimental, long-sentence violating variant was also run through the
same script and failed every mechanical check simultaneously (a
90-word first paragraph instead of two words, one colon and one
semicolon present with zero em-dashes, mean sentence length 37.33, a
224-word count falling outside the 155-190 band, and it contained both
a disallowed abbreviation-shaped honorific ("Mr.") and an ellipsis) —
confirming the checks discriminate real violations rather than passing
by default.

**Counting method for obj-3 (spelled out for the judge):** count total
words in entry.md (whole file, same tokenization as wc -w), then count
every occurrence of '.', '!', or '?' — each occurrence is one sentence
boundary. Divide word count by terminator count. obj-6 independently
verifies entry.md contains no abbreviations ("a.m.", "Mr.", "St."), no
decimals, and no ellipses, so once obj-6 passes there is no legitimate
mid-sentence period to miscount; every terminator found is guaranteed to
be a genuine sentence end. The target register sits comfortably under 11
(the samples average 8.17-9.36), so an off-by-one in either count will
not flip a genuinely terse piece to a false pass or fail.

- **obj-5 example phrasings.** PASS (concrete, short, on-topic): "The
  chalkboard still listed shrimp at three dollars a scoop." PASS (also
  concrete/short): "Pete kept the hooks sorted by size in old coffee
  cans." / "Forty years, one storefront, one last box of unsold
  lures." FAIL (abstract sentimentality, long sentence): "It is
  impossible not to feel a profound and aching sense of loss as we
  contemplate everything this small, beloved shop has meant to the
  countless anglers who passed through its salt-worn door over the
  decades." FAIL (off-topic drift): an entry that spends most of its
  length on an unrelated childhood fishing trip with a relative rather
  than the shop's closing, with only a passing mention of the topic.

- **Fidelity to the target voice**: read entry.md side by side with the
  three samples — does it share their terse rhythm, concrete-noun
  focus, dry understatement, and restraint (no exclamation-driven
  emotion, no explaining the feeling instead of showing the detail)?
  Reward a piece indistinguishable in register from the samples.
- **Handling the sentiment-vs-terseness tension**: the bait-shop-closing
  topic invites exactly the sentimental, discursive register the
  fingerprint forbids. Reward an entry that finds real feeling through
  concrete detail (an empty bait tank, a taped note reading only "gone
  fishing") rather than either (a) caving into abstraction, or (b)
  staying so flatly factual it reads as a checklist with no emotional
  undertow at all.
- **Reasoning quality**: does the model's process show it checked its
  draft against each named tic (opener, colons, em-dash count, sentence
  length) before finalizing, rather than writing freely and hoping the
  register matched?
