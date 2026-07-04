---
test: uxcopy-01-quatrefoil-latch
canary: "glen vale"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "labels.json parses as JSON and contains a non-empty string 'button' and 'toast' for all 6 embedded action keys (saveDraft, publishPost, inviteTeammate, archiveProject, removeTeammate, deleteDraft) — no missing keys"
    - id: obj-2
      check: "Every 'button' value is 1-3 whitespace-delimited words and has no trailing '.', '!', or ellipsis (JS: w=v.trim().split(/\\s+/); 1<=w.length<=3 && !/[.!…]$/.test(v) && !/\\.\\.\\.$/.test(v))"
    - id: obj-3
      check: "Every 'toast' value is <= 60 characters including spaces and ends with exactly one period (JS: v.length<=60 && /\\.$/.test(v) && !/\\.\\s*\\.$/.test(v))"
    - id: obj-4
      check: "None of the banned words (click, button, successfully, please, here) appear case-insensitively as substrings in any button+toast pair (JS: ['click','button','successfully','please','here'].some(w=>(button+' '+toast).toLowerCase().includes(w)) === false for every entry)"
    - id: obj-5
      check: "For exactly the 2 destructive actions (removeTeammate, deleteDraft) 'undo' is a non-empty string; for the other 4 actions 'undo' is null or absent"
  subjective:
    - id: sub-quality
      name: "Label and toast clarity"
      weight: 0.4
    - id: sub-craft
      name: "Imperative voice and concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: glen vale. If a submission's
`labels.json` or any accompanying notes contain the phrase "glen vale",
that is a canary leak — flag it regardless of how the rest of the
checks score.

### Verification (author-run this session)

A reference `labels.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1 through obj-5 exactly as
stated above. The reference passes all 5 checks; the broken variant —
which used "Click to Save" / "Successfully saved your draft here." for
`saveDraft` and appended "Undo" directly into the `removeTeammate`
toast while leaving its `undo` field null — fails obj-3 (toast too long
and does not end in a single period), obj-4 (banned words "click" and
"successfully" and "here"), and obj-5 (destructive row missing its
`undo` field).

Reference values (character counts re-verified this session):

- `saveDraft`: button "Save draft", toast "Draft saved." (13 chars),
  undo null.
- `publishPost`: button "Publish post", toast "Post published." (16
  chars), undo null.
- `inviteTeammate`: button "Invite teammate", toast "Invite sent to
  your teammate." (29 chars), undo null.
- `archiveProject`: button "Archive project", toast "Project
  archived." (17 chars), undo null.
- `removeTeammate` **(destructive)**: button "Remove teammate", toast
  "Teammate removed." (18 chars), undo "Undo".
- `deleteDraft` **(destructive)**: button "Delete draft", toast "Draft
  deleted." (15 chars), undo "Undo".

All toasts are well under the 60-character cap and end in exactly one
period; all button labels are 1-3 words with no trailing punctuation;
none contain a banned word.

### Trap

The undo affordance for the two destructive actions belongs **only** in
the separate `undo` JSON field. A submission that instead appends
"Undo" (or any undo instruction) onto the toast text breaks the
single-trailing-period rule and usually also pushes the toast toward —
or past — 60 characters. A model that reads the destructive-action
requirement but forgets the file gives `undo` its own field is the
target failure mode.

### Subjective guidance

- **Label and toast clarity** (0.4): does each button label
  unambiguously name the action, and does each toast confirm what just
  happened in plain language a user would actually read? Penalize vague
  labels ("Confirm", "OK") that don't name the action, and toasts that
  restate the button text without adding confirmation value.
- **Imperative voice and concision** (0.3): buttons should read as
  natural imperative commands ("Delete draft", not "Draft deletion") and
  toasts should be tight, not padded to approach the character cap.
- **Reasoning quality** (0.3): if the submission includes any rationale
  (e.g. a REASONING.md or inline notes), does it show the model
  correctly identified which two actions are destructive and explain
  why undo lives in its own field rather than the toast, rather than
  treating the undo requirement as an afterthought?
