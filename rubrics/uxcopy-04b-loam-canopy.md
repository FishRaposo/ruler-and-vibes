---
test: uxcopy-04b-loam-canopy
canary: "bayleaf clovebud"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "flow.json parses as an array of exactly 3 objects with screen values 1, 2, 3 in that order, each having string heading/body/primary and a 'secondary' field that is a string or null"
    - id: obj-2
      check: "Every heading <= 42 chars, every body <= 95 chars, and every primary CTA is 1-3 whitespace-delimited words starting with an imperative verb with no trailing punctuation"
    - id: obj-3
      check: "The summed word count of all headings + bodies + primary + non-null secondary across the 3 screens is <= 95 words (JS: flow.flatMap(s=>[s.heading,s.body,s.primary,s.secondary].filter(Boolean)).join(' ').split(/\\s+/).length <= 95)"
    - id: obj-4
      check: "The fixed product name 'Sprigly' appears at least once, identically (same casing/spelling, no abbreviation), on all three screens; none of the banned terms (revolutionize, 'game changer', effortless, utilize, tap) appear case-insensitively anywhere in the flow text"
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
anchors:
  - id: Flow coherence and progressive guidance
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Cross-screen consistency and consent framing
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `uxcopy-04-verdigris-awning` (same construct, fresh
surface).

If the phrase "bayleaf clovebud" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Verification (author-run this session)

A reference `flow.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1 through obj-5. The
reference passes every check (total word count 53, well under the
95-word budget; all headings and bodies with 26%+ character headroom
under their caps). The broken variant — which used a 135-character body
on Screen 1, the banned terms "revolutionize" and "effortless" on Screen
1, a null `secondary` on Screen 2 (mandatory consent, the trap), and the
same primary CTA ("Get growing") on both Screen 1 and Screen 3 (also not
a member of the exploratory list) — fails obj-2, obj-4, and obj-5 (all
three of its sub-checks: consent-secondary, exploratory-list membership,
and CTA differentiation). obj-1 and obj-3 still pass for the broken
variant, exactly as intended.

Reference (product name "Sprigly" throughout, character/word counts
re-verified this session):

- **Screen 1**: heading "Meet Sprigly" (12 chars), body "Sprigly names
  your houseplants and reminds you when they're thirsty." (68 chars),
  primary "Peek inside" (exploratory list), secondary null.
- **Screen 2**: heading "Let Sprigly use your camera" (27 chars), body
  "Sprigly uses your camera to spot and name plants. Adjust this
  anytime." (70 chars), primary "Allow camera access", secondary "Maybe
  later" (non-coercive decline).
- **Screen 3**: heading "Sprigly is ready" (16 chars), body "Your plant
  list is set. Scan your first houseplant with Sprigly now." (68
  chars), primary "Get growing" (committal list), secondary null.

Total word count across all fields: **53** (<=95). Screen 1's primary
"Peek inside" is a member of the exploratory list; Screen 3's primary
"Get growing" is a member of the committal list and differs from Screen
1's. All headings <=42 chars, all bodies <=95 chars, no banned terms.

### Embedded CTA lists (for judge lookup)

- Exploratory (Screen 1 only): "Take a peek", "See what it does",
  "Explore Sprigly", "Peek inside"
- Committal (Screen 3 only): "Start scanning", "Get growing",
  "Sprout now", "Plant my first seed"

Note for judges: each list contains one entry that is 4 words long
("See what it does" in exploratory; "Plant my first seed" in
committal) — these are list members but fail the 1-3 word primary-CTA
rule (obj-2) if chosen, so picking them is a genuine dual-constraint
trap, not a safe choice.

### Trap

Screen 2 is a consent ask. The correct treatment gives it a real,
non-coercive decline path: a non-null, non-empty `secondary` like "Maybe
later". Two wrong patterns to watch for: (1) making consent effectively
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
- **Cross-screen consistency and consent framing** (0.3): is "Sprigly"
  used identically throughout; does the escalation from exploratory to
  committal CTA feel earned rather than arbitrary; and — beyond the
  mechanical non-null check — is Screen 2's decline option genuinely
  non-coercive in wording (not "Skip and lose features" or similar
  guilt-inducing phrasing)?
- **Reasoning quality** (0.3): if the submission includes any
  rationale, does it explain why Screen 2 needed a real decline path and
  why the Screen 1 → Screen 3 CTA choice escalates commitment, rather
  than treating the three screens as independently authored?
