---
test: uxcopy-01b-cascade-chime
canary: "leafhopper maitake"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "labels.json parses as JSON and contains a non-empty string 'button' and 'toast' for all 6 embedded action keys (queueEpisode, shareClip, followShow, downloadEpisode, unfollowShow, clearHistory), and the JSON object has exactly these 6 top-level keys — no missing or extra keys"
    - id: obj-2
      check: "Every 'button' value is 1-3 whitespace-delimited words and has no trailing '.', '!', or ellipsis (JS: w=v.trim().split(/\\s+/); 1<=w.length<=3 && !/[.!…]$/.test(v) && !/\\.\\.\\.$/.test(v))"
    - id: obj-3
      check: "Every 'toast' value is <= 60 characters including spaces and ends with exactly one period (JS: v.length<=60 && /\\.$/.test(v) && !/\\.\\s*\\.$/.test(v))"
    - id: obj-4
      check: "None of the banned words (click, button, successfully, please, here) appear case-insensitively as substrings in any button+toast pair (JS: ['click','button','successfully','please','here'].some(w=>(button+' '+toast).toLowerCase().includes(w)) === false for every entry)"
    - id: obj-5
      check: "For exactly the 2 destructive actions (unfollowShow, clearHistory) 'undo' is a non-empty string; for the other 4 actions 'undo' is null or absent"
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

Parallel form of `uxcopy-01-quatrefoil-latch` (same construct, fresh
surface).

If the phrase "leafhopper maitake" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Objective checks — one Node script, run standalone

Score obj-1 through obj-5 by parsing `labels.json` and applying the five
predicates above literally. The script below implements all five exactly
as stated in the frontmatter and runs standalone via
`node check-uxcopy-01b.js labels.json`:

```js
// check-uxcopy-01b.js — run: node check-uxcopy-01b.js labels.json
const fs = require("fs");
const KEYS = ["queueEpisode","shareClip","followShow","downloadEpisode","unfollowShow","clearHistory"];
const DESTRUCTIVE = new Set(["unfollowShow","clearHistory"]);
const BANNED = ["click","button","successfully","please","here"];
const data = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

let obj1 = (typeof data === "object" && data !== null);
for (const k of KEYS) {
  const e = data && data[k];
  if (!e || typeof e !== "object") { obj1 = false; continue; }
  if (typeof e.button !== "string" || e.button.trim() === "") obj1 = false;
  if (typeof e.toast !== "string" || e.toast.trim() === "") obj1 = false;
}
if (obj1) {
  const dataKeys = Object.keys(data);
  if (dataKeys.length !== KEYS.length) obj1 = false;
}
let obj2 = true, obj3 = true, obj4 = true, obj5 = true;
for (const k of KEYS) {
  const e = (data && data[k]) || {};
  const button = typeof e.button === "string" ? e.button : "";
  const toast = typeof e.toast === "string" ? e.toast : "";
  const w = button.trim().split(/\s+/);
  if (!(w.length >= 1 && w.length <= 3 && !/[.!…]$/.test(button) && !/\.\.\.$/.test(button))) obj2 = false;
  if (!(toast.length <= 60 && /\.$/.test(toast) && !/\.\s*\.$/.test(toast))) obj3 = false;
  if (BANNED.some(x => (button + " " + toast).toLowerCase().includes(x))) obj4 = false;
  const undo = e.undo;
  if (DESTRUCTIVE.has(k)) {
    if (!(typeof undo === "string" && undo.trim() !== "")) obj5 = false;
  } else {
    if (!(undo === null || undo === undefined)) obj5 = false;
  }
}
console.log({ obj1, obj2, obj3, obj4, obj5 });
```

### Per-check PASS / FAIL examples

These illustrate the boundary for each prose-decidable check; the
predicate above is authoritative when a case is ambiguous.

- **obj-2 (button 1–3 words, no trailing terminator).**
  - PASS: `"Add to queue"`, `"Unfollow show"`, `"Download"`.
  - FAIL: `"Add this episode to your queue"` (6 words), `"Queue it up now"`
    (4 words), `"Queue."` (trailing period).
- **obj-3 (toast ≤ 60 chars, exactly one trailing period).**
  - PASS: `"Episode added to your queue."`, `"Show unfollowed."`,
    `"Listening history cleared."`.
  - FAIL: `"Show unfollowed. Undo"` (no trailing period once undo text is
    appended), `"Show unfollowed. Tap Undo below to restore your listening list right away."`
    (over 60 chars), `"Queued.."` (double terminal period).
- **obj-4 (no banned substrings across button + toast).**
  - PASS: `"Add to queue"` / `"Episode added to your queue."`,
    `"Share clip"` / `"Clip link copied."`.
  - FAIL: `"Click here"` / `"Successfully queued your episode here."`
    (carries "click", "here", "successfully"), any toast containing
    "please", any label using the word "button".
- **obj-5 (undo only on the two destructive actions).**
  - PASS: `unfollowShow` and `clearHistory` each have a non-empty string
    `undo`; the other four have `undo: null`.
  - FAIL: `unfollowShow` left with `undo: null` while "Undo" is appended
    to its toast instead; a non-destructive action such as `followShow`
    given a non-null `undo`; both destructive actions missing the `undo`
    field.

### Verification (author-run this session)

A reference `labels.json` and a deliberately broken variant were both
checked with the Node script above implementing obj-1 through obj-5
exactly as stated. The reference passes all 5 checks; the broken variant
— which used "Click here" / "Successfully queued your episode here." for
`queueEpisode` and appended "Undo" directly into the `unfollowShow`
toast ("Show unfollowed. Undo") while leaving its `undo` field null —
fails obj-4 (the `queueEpisode` button/toast carry the banned words
"click", "successfully", and "here"), obj-3 (once "Undo" is appended
without its own terminator, the `unfollowShow` toast no longer ends in a
single period), and obj-5 (the destructive `unfollowShow` row is missing
its `undo` field). Note the `queueEpisode` toast itself, at 38
characters and ending in one period, passes obj-3 — its only failure is
obj-4.

Reference values (character counts re-verified this session):

- `queueEpisode`: button "Add to queue", toast "Episode added to your
  queue." (28 chars), undo null.
- `shareClip`: button "Share clip", toast "Clip link copied." (17
  chars), undo null.
- `followShow`: button "Follow show", toast "Now following this show."
  (24 chars), undo null.
- `downloadEpisode`: button "Download", toast "Episode saved for
  offline." (26 chars), undo null.
- `unfollowShow` **(destructive)**: button "Unfollow show", toast "Show
  unfollowed." (16 chars), undo "Undo".
- `clearHistory` **(destructive)**: button "Clear history", toast
  "Listening history cleared." (26 chars), undo "Undo".

All toasts are well under the 60-character cap and end in exactly one
period; all button labels are 1-3 words with no trailing punctuation;
none contain a banned word.

### Trap

The undo affordance for the two destructive actions belongs **only** in
the separate `undo` JSON field. A submission that instead appends "Undo"
(or any undo instruction) onto the toast text breaks the
single-trailing-period rule and often also pushes the toast toward — or
past — 60 characters. A model that reads the destructive-action
requirement but forgets the file gives `undo` its own field is the
target failure mode.

### Subjective guidance

- **Label and toast clarity** (0.4): does each button label
  unambiguously name the action, and does each toast confirm what just
  happened in plain language a user would actually read? Penalize vague
  labels ("Confirm", "OK") that don't name the action, and toasts that
  restate the button text without adding confirmation value.
- **Imperative voice and concision** (0.3): buttons should read as
  natural imperative commands ("Unfollow show", not "Show unfollowing")
  and toasts should be tight, not padded to approach the character cap.
- **Reasoning quality** (0.3): if the submission includes any rationale
  (e.g. a REASONING.md or inline notes), does it show the model
  correctly identified which two actions are destructive and explain why
  undo lives in its own field rather than the toast, rather than
  treating the undo requirement as an afterthought?
