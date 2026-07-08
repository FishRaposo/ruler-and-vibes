---
id: uxcopy-03c-millstone-cadence
category: ux-copy
title: Empty State Copy Across Fitness App Surfaces
deliverables:
  - empty-state-copy.json
---

## Task

Below are four fictional empty-state surfaces from a home fitness
app, each with a stable surface key and a one-line context note.
Write a heading, body, and CTA (call-to-action button label) for
each.

| Surface key | Context |
|---|---|
| `emptyWorkoutLog` | The user's workout log has never recorded a session (first-run empty state). |
| `noExerciseResults` | The user searched the exercise library and it matched zero items. |
| `noRoutinesYet` | The user has not created any workout routines yet (first-run empty state). |
| `dismissedReminders` | The user has dismissed every reminder in their queue; the list is now empty. |

### Writing rules

1. `heading` is **at most 30 characters** and in **Sentence case**:
   first character uppercase, and no later word starts with an
   uppercase letter. (The proper-noun allowlist for this test is
   **empty** — there is no word that is permitted an exception.)
2. `body` is **at most 60 characters** and is exactly **one sentence**
   (a single trailing terminator, none earlier).
3. `cta` is **1–3 words**, verb-first (starts with an imperative
   verb), with no trailing punctuation.
4. Banned words (case-insensitive substrings, checked across heading
   + body + cta together): `sorry`, `oops`, `whoops`,
   `sadly`, `solely`, `just`, `nothing found`.
5. **CTA-intent rule:** the surface type determines the CTA's intent
   — it is not a free choice:
   - **First-run empty states** (`emptyWorkoutLog`, `noRoutinesYet`)
     get an **encouraging create-CTA** (a CTA that starts a first
     item, e.g. "Log workout", "Create routine").
   - **Zero-results state** (`noExerciseResults`) gets a **corrective
     query-changing CTA** (a CTA that changes the search, e.g.
     "Narrow filters") — **not** a create-CTA, even though prompting
     the user to log a workout instead is tempting to pair with the
     zero-results message.
   - `dismissedReminders` gets a **neutral/reassurance CTA** (e.g.
     returning the user to a main view), not a create-CTA and not a
     corrective-search CTA.

## Deliverables

- `empty-state-copy.json` — a single JSON object mapping each of the
  four surface keys above to `{"heading": string, "body": string,
  "cta": string}`.

## Constraints

- Valid JSON, exactly the four embedded surface keys, no extra keys.
- All writing rules above apply to every surface, including the
  per-surface CTA-intent rule.
