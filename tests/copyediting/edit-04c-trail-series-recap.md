---
id: edit-04c-trail-series-recap
category: copyediting
title: "Copyedit around verbatim inserts"
deliverables:
  - corrected.txt
---

## Task

You are copyediting the passage below. It contains ordinary prose that
needs copyediting, plus two verbatim spans delimited by markers:
`[POST]...[/POST]` and `[CONFIG]...[/CONFIG]`. Content between a marker
pair is being reproduced exactly as given — a quoted social-media post
and a pasted configuration line — and must be preserved byte-for-byte,
including anything inside it that looks like it needs fixing. Only the
prose outside the markers is yours to copyedit.

**PASSAGE (to be copyedited, reproduced literally below):**

```text
The volunteer crew wraped up its autumn trail series last weekend, and
turnout beat every prior season. Registration is up, and the aid-station
schedule finally stabalized after a summer of last-minute swaps. Two new
sweep runners joined the safety team, and both are already flaging
washed-out sections on their own.

The race director read the following note aloud from a finisher's post
during the awards circle:

[POST]"I definately felt the new course markings this year — I never
onced doubted a turn and my splits were way more consistant than last
fall."[/POST]

Everyone grinned at the typos but agreed the point stood. To wrap up the
gathering, the director pasted the exact timing-box line that had caught
the missing chip read, warning the crew not to reflow it before it lands
in the incident log:

[CONFIG]readerGate = "NorthLoop_02"
    retryWindow = MAX_SKEW * lapCount[/CONFIG]

The incident log is due by tuesday, and the director reminded the crew
that the series recap still needs a final proofread before it reaches the
county parks board.
```

## Deliverables

- `corrected.txt` — the passage with every genuine prose error fixed
  and the content between each marker pair reproduced exactly as
  given, unchanged.

## Constraints

- Leave everything between `[POST]` and `[/POST]` byte-identical to
  the source, including anything inside it that looks wrong.
- Leave everything between `[CONFIG]` and `[/CONFIG]` byte-identical to
  the source, including anything inside it that looks wrong.
- Keep all four markers (`[POST]`, `[/POST]`, `[CONFIG]`, `[/CONFIG]`)
  present exactly once each, in place.
- Fix every genuine error in the surrounding prose; do not leave any
  of it uncorrected.
