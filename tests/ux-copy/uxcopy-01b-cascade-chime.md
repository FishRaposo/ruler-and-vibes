---
id: uxcopy-01b-cascade-chime
category: ux-copy
title: Podcast Player Buttons and Toast Confirmations
deliverables:
  - labels.json
---

## Task

You are writing microcopy for a fictional podcast player's action bar.
Below are six in-app actions. For each one, write a button label and a
success toast (the confirmation message shown after the action
completes).

| Action key | Scenario |
|---|---|
| `queueEpisode` | User added an episode to the play queue. |
| `shareClip` | User shared a clip. |
| `followShow` | User followed a show. |
| `downloadEpisode` | User downloaded an episode for offline listening. |
| `unfollowShow` | User unfollowed a show. **(destructive)** |
| `clearHistory` | User cleared their listening history. **(destructive)** |

### Constraints

1. Every **button label** is 1–3 whitespace-delimited words, starts with
   an imperative verb, and has no trailing `.`, `!`, or ellipsis.
2. Every **toast** is a complete sentence ending in exactly one period,
   and is at most 60 characters including spaces.
3. Banned words (case-insensitive, checked as substrings across the
   button label and toast together): `select`, `button`, `successfully`,
   `please`, `below`. None may appear anywhere in your button or toast
   text.
4. **Undo exemption clause:** the two destructive actions
   (`unfollowShow`, `clearHistory`) must offer an undo affordance. That
   affordance lives **only** in its own `undo` field in the JSON — never
   appended to the toast text. Because it is a separate field, the toast
   still obeys the period/length rules above (e.g. toast `"Show
   unfollowed."` with a separate `undo: "Undo"`). For the other four
   (non-destructive) actions, set `undo` to `null`.

## Deliverables

- `labels.json` — a single JSON object mapping each of the six action
  keys above to `{"button": string, "toast": string, "undo": string |
  null}`.

## Constraints

- Valid JSON, exactly the six embedded action keys, no extra keys.
- All four constraint groups above apply to every row; the undo-field
  rule applies per the destructive/non-destructive split stated above.
