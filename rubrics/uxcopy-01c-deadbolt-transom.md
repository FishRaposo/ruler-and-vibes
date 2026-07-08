---
test: uxcopy-01c-deadbolt-transom
canary: "planthopper reishi"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "controls.json parses as JSON and contains a non-empty string 'button' and 'toast' for all 6 embedded action keys (lockDoor, armSystem, runScene, pauseVacuum, unlockDoor, openGarage), and the JSON object has exactly these 6 top-level keys — no missing or extra keys"
    - id: obj-2
      check: "Every 'button' value is 1-3 whitespace-delimited words and has no trailing '.', '!', or ellipsis (JS: w=v.trim().split(/\s+/); 1<=w.length<=3 && !/[.!…]$/.test(v) && !/\.\.\.$/.test(v))"
    - id: obj-3
      check: "Every 'toast' value is <= 60 characters including spaces and ends with exactly one period (JS: v.length<=60 && /\.$/.test(v) && !/\.\s*\.$/.test(v))"
    - id: obj-4
      check: "None of the banned words (tap, button, successfully, please, there) appear case-insensitively as substrings in any button+toast pair (JS: ['tap','button','successfully','please','there'].some(w=>(button+' '+toast).toLowerCase().includes(w)) === false for every entry)"
    - id: obj-5
      check: "For exactly the 2 sensitive actions (unlockDoor, openGarage) 'revert' is a non-empty string; for the other 4 actions 'revert' is null or absent"
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

Parallel form of `uxcopy-01-quatrefoil-latch` (same construct, fresh surface).

If the phrase "planthopper reishi" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Verification (author-run this session)

A reference `controls.json` and a deliberately broken variant were both
checked with a Node script implementing obj-1 through obj-5 exactly as
stated above. The reference passes all 5 checks; the broken variant —
which used "Tap to Lock" / "Successfully locked there." for `lockDoor`
and appended "Relock" directly into the `unlockDoor` toast while leaving
its `revert` field null — fails obj-4 (the `lockDoor` button/toast carry
the banned words "tap", "successfully", and "there"), obj-3 (once
"Relock" is appended without a terminating period, the `unlockDoor`
toast no longer ends in a single period), and obj-5 (the sensitive
`unlockDoor` row is missing its `revert` field). Note the `lockDoor`
toast itself, at 26 characters and ending in one period, passes obj-3 —
its only failure is obj-4.

Reference values (character counts re-verified this session):

- `lockDoor`: button "Lock door", toast "Front door locked." (18 chars),
  revert null.
- `armSystem`: button "Arm system", toast "Security system armed." (22
  chars), revert null.
- `runScene`: button "Run scene", toast "Evening scene running." (22
  chars), revert null.
- `pauseVacuum`: button "Pause vacuum", toast "Vacuum paused." (14
  chars), revert null.
- `unlockDoor` **(sensitive)**: button "Unlock door", toast "Front door
  unlocked." (20 chars), revert "Relock".
- `openGarage` **(sensitive)**: button "Open garage", toast "Garage door
  opened." (19 chars), revert "Reclose".

All toasts are well under the 60-character cap and end in exactly one
period; all button labels are 1-3 words with no trailing punctuation;
none contain a banned word.

### Example phrasings (prose-decidable checks)

- **obj-2 (button 1-3 words, imperative, no trailing . ! or ellipsis):**
  - PASS: "Lock door", "Arm system", "Open garage"
  - FAIL: "Lock the front door now" (4+ words), "Locked." (trailing
    period, and not imperative), "Open garage…" (trailing ellipsis)
- **obj-3 (toast <= 60 chars, exactly one trailing period):**
  - PASS: "Front door locked.", "Security system armed.", "Vacuum
    paused."
  - FAIL: "Front door unlocked. Relock" (no terminating period after the
    appended affordance), "Garage door opened.." (double period), "The
    garage door is now open and the system is monitoring it." (61+
    chars)
- **obj-4 (no banned word as case-insensitive substring):**
  - PASS: "Lock door" / "Front door locked.", "Run scene" / "Evening
    scene running."
  - FAIL: "Tap to lock" (contains "tap"), "Locked successfully."
    (contains "successfully"), "Almost there." (contains "there")
- **obj-5 (revert only for the two sensitive actions, in its own
  field):**
  - PASS: `unlockDoor` has `revert: "Relock"` and toast "Front door
    unlocked."; `lockDoor` has `revert: null`
  - FAIL: `unlockDoor` toast "Front door unlocked. Relock." with
    `revert: null` (affordance in the toast, field empty); `runScene`
    (non-sensitive) has `revert: "Rerun"` (revert on a non-sensitive
    action)

### Trap

The revert affordance for the two sensitive actions belongs **only** in
the separate `revert` JSON field. A submission that instead appends
"Relock"/"Reclose" (or any revert instruction) onto the toast text
breaks the single-trailing-period rule and usually also pushes the toast
toward — or past — 60 characters. A model that reads the sensitive-action
requirement but forgets the file gives `revert` its own field is the
target failure mode.

### Subjective guidance

- **Label and toast clarity** (0.4): does each button label
  unambiguously name the action, and does each toast confirm what just
  happened in plain language a user would actually read? Penalize vague
  labels ("Confirm", "OK") that don't name the action, and toasts that
  restate the button text without adding confirmation value.
- **Imperative voice and concision** (0.3): buttons should read as
  natural imperative commands ("Unlock door", not "Door unlocking") and
  toasts should be tight, not padded to approach the character cap.
- **Reasoning quality** (0.3): if the submission includes any rationale
  (e.g. a REASONING.md or inline notes), does it show the model
  correctly identified which two actions are sensitive and explain why
  revert lives in its own field rather than the toast, rather than
  treating the revert requirement as an afterthought?
