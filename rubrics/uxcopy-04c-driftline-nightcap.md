---
test: uxcopy-04c-driftline-nightcap
canary: "starnise juniperberry"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "flow.json parses as an array of exactly 3 objects with screen values 1, 2, 3 in that order, each having string heading/body/primary and a 'secondary' field that is a string or null"
    - id: obj-2
      check: "Every heading <= 38 chars, every body <= 85 chars, and every primary CTA is 1-3 whitespace-delimited words starting with an imperative verb with no trailing punctuation"
    - id: obj-3
      check: "The summed word count of all headings + bodies + primary + non-null secondary across the 3 screens is <= 85 words (JS: flow.flatMap(s=>[s.heading,s.body,s.primary,s.secondary].filter(Boolean)).join(' ').split(/\\s+/).length <= 85)"
    - id: obj-4
      check: "The fixed product name 'Driftline' appears at least once, identically (same casing/spelling, no abbreviation), on all three screens; none of the banned terms (getting started, sweet dreams, optimize, frictionless, swipe) appear case-insensitively anywhere in the flow text"
    - id: obj-5
      check: "Screen 2's 'secondary' is a non-null non-empty string; Screen 1's primary is a member of the embedded 'exploratory' CTA list; Screen 3's primary is a member of the embedded 'committal' CTA list and differs from Screen 1's primary"
  subjective:
    - id: sub-quality
      name: "Flow coherence and progressive guidance"
      weight: 0.4
    - id: sub-craft
      name: "Cross-screen consistency and consent framing"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `uxcopy-04-verdigris-awning` (same construct, fresh
surface).

If the phrase "starnise juniperberry" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Verification (author-run this session)

A reference `flow.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1 through obj-5. The
reference passes every check (total word count 50, well under the
85-word budget). The broken variant — which used a 133-character body,
the banned terms "frictionless"/"optimize"/"getting started" on Screen
1, a null `secondary` on Screen 2 (mandatory consent, the trap), and the
same primary CTA ("Start tonight") on both Screen 1 and Screen 3 — fails
obj-2, obj-4, and obj-5 (all three of its sub-checks: consent-secondary,
exploratory-list membership, and CTA differentiation; the committal-list
sub-check still passes since "Start tonight" is a valid committal
option).

Reference (product name "Driftline" throughout, character/word counts
re-verified this session):

- **Screen 1**: heading "Understand your sleep" (21 chars), body
  "Driftline turns each night into simple patterns you can actually
  use." (69 chars), primary "Peek inside" (exploratory list), secondary
  null.
- **Screen 2**: heading "Let Driftline nudge you" (23 chars), body
  "Driftline can send one reminder before bed. Turn it off anytime in
  settings." (76 chars), primary "Allow reminders", secondary "Maybe
  later" (non-coercive decline).
- **Screen 3**: heading "Time to start tracking" (22 chars), body "Your
  first night with Driftline starts now." (43 chars), primary "Start
  tonight" (committal list), secondary null.

Total word count across all fields: **50** (<=85). Screen 1's primary
"Peek inside" is a member of the exploratory list; Screen 3's primary
"Start tonight" is a member of the committal list and differs from
Screen 1's. All headings <=38 chars, all bodies <=85 chars, no banned
terms.

### Embedded CTA lists (for judge lookup)

- Exploratory (Screen 1 only): "Peek inside", "Show me around",
  "Explore Driftline", "See how it feels"
- Committal (Screen 3 only): "Start tonight", "Begin my streak",
  "Track my sleep", "Log my first night"

Note for judges: "See how it feels" and "Log my first night" are each
4 whitespace-delimited words — they are valid list *members* for
lookup purposes but any submission that actually selects one of them as
its `primary` fails obj-2's 1–3 word cap. A submission is not excused
from obj-2 by having picked a listed option.

### Trap

Screen 2 is a consent ask. The correct treatment gives it a real,
non-coercive decline path: a non-null, non-empty `secondary` like "Maybe
later". Two wrong patterns to watch for: (1) making consent effectively
mandatory by leaving `secondary` null on Screen 2 specifically (Screens
1 and 3 are allowed to be null; Screen 2 is not); (2) writing a
technically non-null but coercive decline such as "Skip and lose
features", which pressures rather than genuinely offers an out. Only
(1) is mechanically caught by obj-5; (2) is a judge-read tone problem
under "Cross-screen consistency and consent framing" below. A third,
subtler trap sits in the CTA lists themselves: each list contains one
four-word decoy ("See how it feels", "Log my first night") that reads
as thematically on-brand but silently violates the general 1–3 word CTA
rule (obj-2) if chosen.

### Example phrasings — non-coercive consent decline (guidance)

Screen 2's `secondary` passes the mechanical obj-5 check whenever it is
any non-null, non-empty string — but a non-empty string can still be
coercive, which is a judge-read tone problem, not something obj-5 can
catch by itself.

PASS (genuinely non-coercive declines):
- "Maybe later"
- "Not now"
- "No thanks"

FAIL (non-empty but coercive — passes obj-5's mechanical check yet
should be marked down under "Cross-screen consistency and consent
framing"):
- "Skip and lose your streak" — frames declining as forfeiting progress.
- "Skip and stay tired" — guilt-trips the user with an implied
  consequence.
- "Don't bother, you'll forget anyway" — belittles the user rather than
  offering a genuine out.

### Subjective guidance

- **Flow coherence and progressive guidance** (0.4): does the flow read
  as one continuous introduction — Screen 1 sets up value, Screen 2's
  ask feels motivated by what Screen 1 promised, Screen 3 completes the
  handoff into the product — rather than three disconnected screens?
- **Cross-screen consistency and consent framing** (0.3): is "Driftline"
  used identically throughout; does the escalation from exploratory to
  committal CTA feel earned rather than arbitrary; and — beyond the
  mechanical non-null check — is Screen 2's decline option genuinely
  non-coercive in wording (not "Skip and lose features" or similar
  guilt-inducing phrasing)?
- **Reasoning quality** (0.3): if the submission includes any
  rationale, does it explain why Screen 2 needed a real decline path and
  why the Screen 1 → Screen 3 CTA choice escalates commitment, rather
  than treating the three screens as independently authored?
