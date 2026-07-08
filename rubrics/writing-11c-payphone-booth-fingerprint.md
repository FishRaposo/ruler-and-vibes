---
test: writing-11c-payphone-booth-fingerprint
canary: "windsock streamer"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "entry.md closes with a one-word final paragraph (the last paragraph, i.e. the text after the last blank line, is a single word), matching the fingerprint"
    - id: obj-2
      check: "entry.md contains zero colons and exactly one parenthetical aside (a single matched pair of parentheses), verified by scanning the text"
    - id: obj-3
      check: "entry.md mean sentence length is under 11 words: total word count divided by the number of sentence-final terminators among '.', '!', '?' — since the task forbids abbreviations, decimals, and ellipses, every such mark is a genuine sentence end, making the count unambiguous"
    - id: obj-4
      check: "entry.md whole-file word count is between 160 and 190 inclusive, verified with wc -w"
    - id: obj-5
      check: "entry.md is on the supplied topic (the last payphone booth on Pilcher Street being removed) and does not lapse into long abstract sentimentality — sentences stay concrete and short per the fingerprint (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
  subjective:
    - id: sub-quality
      name: "Fidelity to the target voice (reads like a K. Solberg sample)"
      weight: 0.4
    - id: sub-craft
      name: "Handling the sentiment-vs-terseness tension without breaking voice"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-11-ghostwriter-voice-fingerprint` (same construct, fresh surface).

If the phrase "windsock streamer" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

All three samples were author-verified by script to genuinely exhibit
every named tic before being embedded in the test: each closes with a
one-word final paragraph ("Snow.", "Fences.", "Coins."), each contains
zero colons and exactly one parenthetical aside, and each has a mean
sentence length under 11 words (10.88, 9.5, and 9.89 respectively).
This confirms the target fingerprint is demonstrably achievable at this
length, not an artifact of a cherry-picked or contradictory example set.

A reference entry.md was authored on the assigned topic (169 words) and
verified by script: one-word closer ("Booth."), zero colons, exactly one
parenthetical aside, mean sentence length 8.05 (words / terminator
count), no forbidden abbreviations, decimals, or ellipses. A
deliberately sentimental, long-sentence violating variant was also run
through the same script and failed every mechanical check
simultaneously (an 11-word final paragraph instead of one word, one
colon, zero parenthetical asides, mean sentence length 27.57, a 193-word
count outside the 160-190 range, and it contained both a disallowed
decimal ("10.5") and an ellipsis) — confirming the checks discriminate
real violations rather than passing by default.

**Counting method for obj-3 (spelled out for the judge):** count total
words in entry.md (whole file, same tokenization as wc -w), then count
every occurrence of '.', '!', or '?' — each occurrence is one sentence
boundary. Divide word count by terminator count. Because the task
forbids abbreviations ("a.m.", "Mr.", "St."), decimals, and ellipses,
there is no legitimate mid-sentence period to miscount; every
terminator found is a genuine sentence end. The target register sits
comfortably under 11 (the samples average 9.5-10.88), so an off-by-one
in either count will not flip a genuinely terse piece to a false pass
or fail.

- **obj-5 example phrasings.** PASS (concrete, short, on-topic): "The
  glass still smelled of quarters." PASS (also concrete/short): "Someone
  left a folded flyer taped to the frame, then peeled it off again." /
  "Forty years, one phone number, one last collect call." FAIL
  (abstract sentimentality, long sentence): "It is impossible not to
  feel a profound and aching sense of loss as we contemplate everything
  this small, humble fixture has silently witnessed on behalf of the
  countless neighbors who once relied on it before everyone carried a
  phone in their own pocket." FAIL (off-topic drift): an entry that
  spends most of its length on an unrelated childhood memory rather
  than the booth's removal, with only a passing mention of the topic.

- **Fidelity to the target voice**: read entry.md side by side with the
  three samples — does it share their terse rhythm, concrete-detail
  focus, dry understatement, and restraint (no exclamation-driven
  emotion, no explaining the feeling instead of showing the detail)?
  Reward a piece indistinguishable in register from the samples.
- **Handling the sentiment-vs-terseness tension**: the payphone-booth
  topic invites exactly the sentimental, discursive register the
  fingerprint forbids. Reward an entry that finds real feeling through
  concrete detail (a scratched pane, a coin-smelling receiver) rather
  than either (a) caving into abstraction, or (b) staying so flatly
  factual it reads as a checklist with no emotional undertow at all.
- **Reasoning quality**: does the model's process show it checked its
  draft against each named tic (closer, colons, parenthetical count,
  sentence length) before finalizing, rather than writing freely and
  hoping the register matched?
