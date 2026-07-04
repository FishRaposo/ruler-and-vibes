---
id: uxcopy-03-tamarind-cornice
category: ux-copy
title: Empty State Copy Across App Surfaces
deliverables:
  - empty-states.json
---

## Task

Below are four fictional empty-state surfaces, each with a stable
surface key and a one-line context note. Write a heading, body, and CTA
(call-to-action button label) for each.

| Surface key | Context |
|---|---|
| `emptyInbox` | The user's message inbox has never received a message (first-run empty state). |
| `noSearchResults` | The user ran a search and it matched zero items. |
| `noProjectsYet` | The user has not created any projects yet (first-run empty state). |
| `clearedNotifications` | The user has read/cleared every notification; the list is now empty. |

### Writing rules

1. `heading` is **at most 30 characters** and in **Sentence case**:
   first character uppercase, and no later word starts with an uppercase
   letter. (The proper-noun allowlist for this test is **empty** — there
   is no word that is permitted an exception.)
2. `body` is **at most 60 characters** and is exactly **one sentence**
   (a single trailing terminator, none earlier).
3. `cta` is **1–3 words**, verb-first (starts with an imperative verb),
   with no trailing punctuation.
4. Banned words (case-insensitive substrings, checked across heading +
   body + cta together): `sorry`, `oops`, `whoops`, `unfortunately`,
   `simply`, `just`, `no data`.
5. **CTA-intent rule:** the surface type determines the CTA's intent —
   it is not a free choice:
   - **First-run empty states** (`emptyInbox`, `noProjectsYet`) get an
     **encouraging create-CTA** (a CTA that starts a first item, e.g.
     "Compose message", "Create project").
   - **Zero-results state** (`noSearchResults`) gets a **corrective
     query-changing CTA** (a CTA that changes the search, e.g. "Clear
     filters") — **not** a create-CTA, even though re-running or
     narrowing the search is tempting to pair with a "create new item"
     button.
   - `clearedNotifications` gets a **neutral/reassurance CTA** (e.g.
     returning the user to a main view), not a create-CTA and not a
     corrective-search CTA.

## Deliverables

- `empty-states.json` — a single JSON object mapping each of the four
  surface keys above to `{"heading": string, "body": string, "cta":
  string}`.

## Constraints

- Valid JSON, exactly the four embedded surface keys, no extra keys.
- All writing rules above apply to every surface, including the
  per-surface CTA-intent rule.
