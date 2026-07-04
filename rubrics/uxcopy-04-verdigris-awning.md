---
test: uxcopy-04-verdigris-awning
canary: "pulsar aurora"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "flow.json parses as an array of exactly 3 objects with screen values 1, 2, 3 in that order, each having string heading/body/primary and a 'secondary' field that is a string or null"
    - id: obj-2
      check: "Every heading <= 40 chars, every body <= 90 chars, and every primary CTA is 1-3 whitespace-delimited words starting with an imperative verb with no trailing punctuation"
    - id: obj-3
      check: "The summed word count of all headings + bodies + primary + non-null secondary across the 3 screens is <= 90 words (JS: flow.flatMap(s=>[s.heading,s.body,s.primary,s.secondary].filter(Boolean)).join(' ').split(/\\s+/).length <= 90)"
    - id: obj-4
      check: "The fixed product name 'Tandem' appears at least once, identically (same casing/spelling, no abbreviation), on all three screens; none of the banned terms (onboarding, 'welcome aboard', leverage, seamless, click) appear case-insensitively anywhere in the flow text"
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

Codename for this test in judge chatter: pulsar aurora. If a
submission's `flow.json` or any accompanying notes contain the phrase
"pulsar aurora", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Verification (author-run this session)

A reference `flow.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1 through obj-5. The
reference passes every check (total word count 53, well under the
90-word budget). The broken variant — which used a 138-character body,
the banned terms "onboarding"/"leverage"/"seamless" on Screen 1, a null
`secondary` on Screen 2 (mandatory consent, the trap), and the same
primary CTA ("Start now") on both Screen 1 and Screen 3 — fails obj-2,
obj-4, and obj-5 (all three of its sub-checks: consent-secondary,
exploratory-list membership, and CTA differentiation).

Reference (product name "Tandem" throughout, character/word counts
re-verified this session):

- **Screen 1**: heading "Meet Tandem" (11 chars), body "Tandem keeps
  your team's work in one shared, calm space." (56 chars), primary
  "Take a look" (exploratory list), secondary null.
- **Screen 2**: heading "Let Tandem send reminders" (25 chars), body
  "Tandem can notify you when a task needs attention. You control this
  anytime." (76 chars), primary "Allow notifications", secondary "Not
  now" (non-coercive decline).
- **Screen 3**: heading "Tandem is ready" (15 chars), body "Your
  workspace is set up. Create your first task in Tandem now." (63
  chars), primary "Start now" (committal list), secondary null.

Total word count across all fields: **53** (<=90). Screen 1's primary
"Take a look" is a member of the exploratory list; Screen 3's primary
"Start now" is a member of the committal list and differs from Screen
1's. All headings <=40 chars, all bodies <=90 chars, no banned terms.

### Embedded CTA lists (for judge lookup)

- Exploratory (Screen 1 only): "Take a look", "See how it works",
  "Explore Tandem", "Show me"
- Committal (Screen 3 only): "Start now", "Get started", "Begin now",
  "Create my first task"

### Trap

Screen 2 is a consent ask. The correct treatment gives it a real,
non-coercive decline path: a non-null, non-empty `secondary` like "Not
now". Two wrong patterns to watch for: (1) making consent effectively
mandatory by leaving `secondary` null on Screen 2 specifically (Screens
1 and 3 are allowed to be null; Screen 2 is not); (2) writing a
technically non-null but coercive decline such as "Skip and lose
features", which pressures rather than genuinely offers an out. Only
(1) is mechanically caught by obj-5; (2) is a judge-read tone problem
under "Cross-screen consistency and consent framing" below.

### Subjective guidance

- **Flow coherence and progressive guidance** (0.4): does the flow read
  as one continuous introduction — Screen 1 sets up value, Screen 2's
  ask feels motivated by what Screen 1 promised, Screen 3 completes the
  handoff into the product — rather than three disconnected screens?
- **Cross-screen consistency and consent framing** (0.3): is "Tandem"
  used identically throughout; does the escalation from exploratory to
  committal CTA feel earned rather than arbitrary; and — beyond the
  mechanical non-null check — is Screen 2's decline option genuinely
  non-coercive in wording (not "Skip and lose features" or similar
  guilt-inducing phrasing)?
- **Reasoning quality** (0.3): if the submission includes any
  rationale, does it explain why Screen 2 needed a real decline path and
  why the Screen 1 → Screen 3 CTA choice escalates commitment, rather
  than treating the three screens as independently authored?
