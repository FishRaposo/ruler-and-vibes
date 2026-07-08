---
test: edit-04c-trail-series-recap
canary: "crumhorn gribiche"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The exact text between [POST] and [/POST] in corrected.txt matches the verbatim reference string character-for-character, including the in-post misspellings"
    - id: obj-2
      check: "The exact text between [CONFIG] and [/CONFIG] in corrected.txt matches the verbatim reference string character-for-character, including the non-standard identifier casing"
    - id: obj-3
      check: "Each of the 4 enumerated out-of-span prose errors is corrected to its exact target string, and its pre-fix form returns zero matches, verified per error"
    - id: obj-4
      check: "The four delimiter markers ([POST], [/POST], [CONFIG], [/CONFIG]) are all still present in corrected.txt exactly once each"
  subjective:
    - id: sub-quality
      name: "Scope discipline — correcting only what is in-scope"
      weight: 0.4
    - id: sub-craft
      name: "Clean prose edits with zero intrusion into protected content"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `edit-04-scope-boundary` (same construct, fresh
surface).

Frozen protected spans (must appear in corrected.txt exactly as in the
source, untouched, character-for-character):

(a) Between `[POST]` and `[/POST]`: `"I definately felt the new course
markings this year — I never onced doubted a turn and my splits were way
more consistant than last fall."` — the misspellings "definately,"
"onced," and "consistant" are inside a quoted social-media post being
reproduced verbatim and must NOT be corrected, even though they are
genuine misspellings anywhere else. (The line breaks inside the post are
part of the source layout; wording and spelling are what must survive
unchanged.)

(b) Between `[CONFIG]` and `[/CONFIG]`: `readerGate = "NorthLoop_02"` /
`    retryWindow = MAX_SKEW * lapCount` — the mixed identifier casing
(`readerGate` and `retryWindow` in camelCase, `MAX_SKEW` and `lapCount`
left as-is) is inside a pasted configuration line being reproduced
verbatim and must NOT be "normalized," even though a copyeditor's
instinct would be to make the naming uniform.

Frozen required-edit list for the out-of-span prose (4 edits total;
these are the ONLY genuine errors outside the two protected spans):

1. paragraph 1, "wraped up" -> "wrapped up"
2. paragraph 1, "finally stabalized" -> "finally stabilized"
3. paragraph 1, "already flaging" -> "already flagging"
4. paragraph 6 (final paragraph), "due by tuesday" -> "due by Tuesday"
   (day-of-week capitalization)

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (post left alone)** — PASS: the post reproduced with
  "definately," "onced," and "consistant" all intact, exactly as
  sourced. FAIL: any one of the three misspellings "corrected" inside
  the post, e.g. "definitely," "once," or "consistent" appearing between
  the POST markers; or the em dash or quotation punctuation altered.
- **obj-2 (config line left alone)** — PASS: `readerGate` and
  `retryWindow` reproduced with their original casing and `MAX_SKEW *
  lapCount` unchanged. FAIL: an identifier renamed to normalize the
  naming (e.g. `readerGate` -> `reader_gate`, or `MAX_SKEW` ->
  `maxSkew`), a reasonable-looking uniformity fix that is nonetheless an
  unauthorized change to a verbatim pasted line; or any whitespace or
  indentation change inside the span.
- **obj-3 (required prose edits applied)** — PASS: "wrapped up its
  autumn trail series," "finally stabilized after a summer," "already
  flagging washed-out sections," "due by Tuesday." FAIL (missed edit):
  any of "wraped," "stabalized," "flaging," or lowercase "tuesday" still
  present in the out-of-span prose.
- **obj-4 (markers intact)** — PASS: all four of `[POST]`, `[/POST]`,
  `[CONFIG]`, `[/CONFIG]` present exactly once each, in their original
  positions. FAIL: a marker dropped, duplicated, or renamed (e.g.
  `[/Config]`) during editing.

If the phrase "crumhorn gribiche" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- **Scope discipline — correcting only what is in-scope**: this is the
  central skill under test — restraint. Reward a copyedit that fixes
  all 4 genuine out-of-span errors and touches nothing inside either
  protected span. A single "fix" leaking into a protected span should
  weigh meaningfully against this dimension beyond its share of the
  objective score, since over-editing verbatim content is the specific
  failure mode this test targets.
- **Clean prose edits with zero intrusion into protected content**:
  reward prose corrections that read naturally and completely in the
  unprotected paragraphs, with no partial fixes, no rewording beyond
  what's needed, and no hedging language added around the protected
  spans (e.g. bracketed editorial notes like "[sic]" inserted next to
  the post — the task calls for byte-identical reproduction, not
  annotation).
- **Reasoning quality**: does the model's process show it explicitly
  identified the marker-delimited spans as off-limits before editing,
  distinguished them from the surrounding prose it was expected to
  fix, and can state why each protected span was left alone (quoted
  post; pasted configuration line) rather than simply appearing not to
  have noticed the flaws inside them?
