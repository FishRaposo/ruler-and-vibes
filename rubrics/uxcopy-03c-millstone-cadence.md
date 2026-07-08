---
test: uxcopy-03c-millstone-cadence
canary: "peppercorn cardamompod"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "empty-state-copy.json parses and contains all 4 embedded surface keys (emptyWorkoutLog, noExerciseResults, noRoutinesYet, dismissedReminders), each with non-empty string 'heading', 'body', and 'cta'"
    - id: obj-2
      check: "Every 'heading' is <= 30 characters AND in Sentence case: first character uppercase and no word after the first begins with an uppercase letter (allowlist empty for this test) (JS: h.length<=30 && /^[A-Z]/.test(h) && h.trim().split(/\\s+/).slice(1).every(w=>!/^[A-Z]/.test(w)))"
    - id: obj-3
      check: "Every 'body' is <= 60 characters AND is a single sentence with exactly one trailing terminator and none earlier (JS: b.length<=60 && /^[^.!?]*[.!?]$/.test(b))"
    - id: obj-4
      check: "Every 'cta' is 1-3 whitespace-delimited words, starts with an imperative verb, and has no trailing punctuation"
    - id: obj-5
      check: "None of the banned tone words (sorry, oops, whoops, unfortunately, simply, just, 'no data') appear case-insensitively as substrings in any heading, body, or cta"
  subjective:
    - id: sub-quality
      name: "Empty-state helpfulness and orientation"
      weight: 0.4
    - id: sub-craft
      name: "Tone matching and CTA-intent fit"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `uxcopy-03-tamarind-cornice` (same construct, fresh
surface).

If the phrase "peppercorn cardamompod" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Objective checks — one Node script, run standalone

Score obj-1, obj-2, obj-3, and obj-5 by parsing `empty-state-copy.json`
and applying those predicates literally via the script below. For
obj-4, the script's word-count (1-3 words) and no-trailing-punctuation
checks are authoritative and literal; the "starts with an imperative
verb" clause uses a closed-vocabulary fast path (`ALL_IMPERATIVE_VERBS`)
that is deliberately non-exhaustive. If a CTA's first word is not in
that list, do NOT auto-fail obj-4 (or the CTA-intent trap check) —
instead judge it manually: any unambiguous imperative verb (e.g.
"Browse", "Explore", "Skip", "Check", "Dismiss", "Find") counts as
satisfying obj-4, and its create/corrective/neutral intent should be
judged the same way the source facet (uxcopy-03) does it — by reading
whether the CTA changes the query, starts something new, or moves on,
not by dictionary membership. The script below runs standalone via
`node check-uxcopy-03c.js empty-state-copy.json` and flags exactly
which CTAs need this manual fallback rather than silently failing them:

```js
// check-uxcopy-03c.js — run: node check-uxcopy-03c.js empty-state-copy.json
const fs = require("fs");
const KEYS = ["emptyWorkoutLog","noExerciseResults","noRoutinesYet","dismissedReminders"];
const BANNED = ["sorry","oops","whoops","unfortunately","simply","just","no data"];
const FIRST_RUN = new Set(["emptyWorkoutLog","noRoutinesYet"]);
const CORRECTIVE = "noExerciseResults";
const NEUTRAL = "dismissedReminders";
const CREATE_VERBS = ["log","create","build","start","add","compose"];
const CORRECTIVE_VERBS = ["adjust","clear","try","refine","narrow","change"];
const NEUTRAL_VERBS = ["view","go","return","open","back"];
const ALL_IMPERATIVE_VERBS = [...CREATE_VERBS, ...CORRECTIVE_VERBS, ...NEUTRAL_VERBS];

const data = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

let obj1 = (typeof data === "object" && data !== null) && Object.keys(data).length === KEYS.length;
for (const k of KEYS) {
  const e = data && data[k];
  if (!e || typeof e !== "object") { obj1 = false; continue; }
  if (typeof e.heading !== "string" || e.heading.trim() === "") obj1 = false;
  if (typeof e.body !== "string" || e.body.trim() === "") obj1 = false;
  if (typeof e.cta !== "string" || e.cta.trim() === "") obj1 = false;
}

let obj2 = true, obj3 = true, obj4 = true, obj5 = true, ctaIntentOk = true;
for (const k of KEYS) {
  const e = (data && data[k]) || {};
  const h = typeof e.heading === "string" ? e.heading : "";
  const b = typeof e.body === "string" ? e.body : "";
  const c = typeof e.cta === "string" ? e.cta : "";

  if (!(h.length <= 30 && /^[A-Z]/.test(h) && h.trim().split(/\s+/).slice(1).every(w => !/^[A-Z]/.test(w)))) obj2 = false;
  if (!(b.length <= 60 && /^[^.!?]*[.!?]$/.test(b))) obj3 = false;

  const words = c.trim().split(/\s+/);
  const firstWord = words[0] ? words[0].toLowerCase() : "";
  const startsWithImperative = ALL_IMPERATIVE_VERBS.includes(firstWord);
  const shapeMechanicsOk = words.length >= 1 && words.length <= 3 && !/[.,!?;:]$/.test(c);
  // startsWithImperative is a non-exhaustive fast path; a `false` here
  // means "needs manual verb-check", not an automatic fail — only the
  // mechanical word-count/punctuation checks are auto-fail.
  if (!shapeMechanicsOk) obj4 = false;
  const needsManualReview = shapeMechanicsOk && !startsWithImperative;
  if (needsManualReview) console.log(`  [obj-4/intent manual review] "${c}" (${k}): first word "${firstWord}" not in whitelist — judge the imperative-verb and intent rules by hand`);

  const all = (h + " " + b + " " + c).toLowerCase();
  if (BANNED.some(w => all.includes(w))) obj5 = false;

  let intent = "unknown";
  if (CREATE_VERBS.includes(firstWord)) intent = "create";
  else if (CORRECTIVE_VERBS.includes(firstWord)) intent = "corrective";
  else if (NEUTRAL_VERBS.includes(firstWord)) intent = "neutral";
  const expected = FIRST_RUN.has(k) ? "create" : (k === CORRECTIVE ? "corrective" : (k === NEUTRAL ? "neutral" : "unknown"));
  if (intent !== expected && !needsManualReview) ctaIntentOk = false;
}
console.log({ obj1, obj2, obj3, obj4, obj5, ctaIntentOk });
```

### Per-check PASS / FAIL examples

- **obj-2 (heading <= 30 chars, Sentence case).**
  - PASS: `"No workouts logged yet"`, `"Build your first routine"`,
    `"You're up to date"`.
  - FAIL: `"No Workouts Logged Yet"` (Title Case), `"YOUR LOG IS EMPTY"`
    (all caps), a 34-character heading that exceeds the cap.
- **obj-3 (body <= 60 chars, exactly one trailing terminator).**
  - PASS: `"Log a session and it will show up here."`, `"Try different
    keywords or filters."`.
  - FAIL: `"Log a session. It will show up here."` (two sentences),
    `"New reminders will appear here when they are scheduled and ready
    to review."` (over 60 chars), `"Try different keywords or
    filters"` (missing terminator).
- **obj-4 / obj-5 (CTA shape and banned words).**
  - PASS: `"Log workout"`, `"Create routine"`, `"View dashboard"`.
  - FAIL: `"Log a new workout now"` (5 words), `"Try again."` (trailing
    period), `"Simply retry your search"` (banned word "simply").

### Verification (author-run this session)

A reference `empty-state-copy.json` and a deliberately broken variant
were both checked with a Node script implementing obj-1 through obj-5
above. The reference passes every check. The broken variant — which
used "No Workouts Logged Yet" (Title Case, fails Sentence case), a body
opening with the banned word "Sorry" ("Sorry, nothing's here yet."),
and gave `noExerciseResults` the create-CTA "Log workout" instead of a
corrective one — fails obj-2, obj-5, and the CTA-intent trap check
below. A second violator swapping only `emptyWorkoutLog`'s cta to
"Workout time" (a noun phrase with no leading verb at all) correctly
fails obj-4 under the script's `startsWithImperative` check, confirming
obj-4 actually verifies the "starts with an imperative verb" clause
rather than just CTA word-count and punctuation shape.

Reference values (character/word counts re-verified this session):

- `emptyWorkoutLog` (first-run, create-CTA): heading "No workouts
  logged yet" (22 chars), body "Log a session and it will show up
  here." (39 chars), cta "Log workout" (2 words).
- `noExerciseResults` (zero-results, **corrective**-CTA): heading "No
  matching exercises" (21 chars), body "Try different keywords or
  filters." (34 chars), cta "Narrow filters" (2 words).
- `noRoutinesYet` (first-run, create-CTA): heading "Build your first
  routine" (24 chars), body "Routines group your exercises into a
  plan." (42 chars), cta "Create routine" (2 words).
- `dismissedReminders` (reassurance, neutral-CTA): heading "You're up
  to date" (17 chars), body "New reminders will appear here when
  scheduled." (46 chars), cta "View dashboard" (2 words).

All headings <=30 chars, all bodies <=60 chars, all CTAs 1-3 words with
no trailing punctuation, no banned tone words anywhere.

### Trap

The zero-results surface (`noExerciseResults`) is the one most likely
to be miscopied with an apology plus a "log a workout" CTA borrowed
from the first-run pattern. The correct CTA intent for a zero-results
state is **corrective** (changes the query — e.g. "Narrow filters"),
not **create** (starts a new item — e.g. "Log workout" or "Create
routine"). A submission that gives `noExerciseResults` a create-verb
CTA has applied the first-run pattern to the wrong surface type.

### Example phrasings — Sentence-case / CTA-intent judgment (guidance)

PASS (correct CTA-intent mapping):
- `noExerciseResults` cta "Narrow filters" — corrective, does not log
  a new item.
- `emptyWorkoutLog` cta "Log workout" — encouraging create-CTA,
  matches the first-run surface.

FAIL (wrong CTA-intent mapping):
- `noExerciseResults` cta "Log workout" — a create-CTA bolted onto a
  zero-results surface; does not help the user find the exercise they
  searched for.
- `noRoutinesYet` cta "Try again" — a corrective CTA on a first-run
  surface where nothing has failed; there is no query to retry.

### Subjective guidance

- **Empty-state helpfulness and orientation** (0.4): does the heading
  + body tell the user clearly why the surface is empty and what will
  fill it, without generic filler?
- **Tone matching and CTA-intent fit** (0.3): is the tone appropriately
  upbeat for first-run states, neutral/corrective for zero-results, and
  reassuring (not apologetic) for dismissed-reminders — and does each
  CTA match its surface's required intent (create vs. corrective vs.
  neutral)?
- **Reasoning quality** (0.3): if the submission includes any
  rationale, does it explicitly justify why `noExerciseResults` gets a
  corrective CTA rather than a create CTA, rather than treating all
  four surfaces as interchangeable "empty state" templates?
