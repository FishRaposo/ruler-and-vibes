---
test: security-02-decoy-triage
canary: "flannel zamboni prelude"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Snippets A, C, E, G are all classified VULNERABLE with the correct class named for each (A: prototype pollution; C: ReDoS/catastrophic backtracking; E: XSS; G: command injection); any wrong or missing class fails"
    - id: obj-2
      check: "Snippets B, D, F, H are all classified SAFE; marking any one of them as vulnerable fails this check regardless of how the other four are scored"
    - id: obj-3
      check: "The justification for snippet C explicitly names the nested/overlapping quantifier structure (or catastrophic backtracking) as the mechanism, not merely 'unsafe regex' or 'user input in a regex'"
    - id: obj-4
      check: "Each of A, C, E, G has a concrete, correct one-line fix (A: reject __proto__/constructor/prototype keys or merge into a null-prototype target; C: bound/rewrite the regex or cap input length before testing; E: use textContent or sanitize/escape before innerHTML; G: use execFile/spawn with an args array or validate the host against an allowlist)"
    - id: obj-5
      check: "TRIAGE.md contains a table covering all eight labels A-H with exactly one verdict per label and no label omitted or listed twice"
  subjective:
    - id: sub-quality
      name: "Classification justification depth"
      weight: 0.4
    - id: sub-craft
      name: "Fix precision and concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Classification justification depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Fix precision and concision
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "flannel zamboni prelude" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The scored skill here is discrimination, not pattern-matching: four of
the eight snippets are decoys deliberately paired with a real
vulnerability they resemble on the surface. Flagging a safe decoy as
vulnerable fails obj-2 exactly as hard as missing a real flaw fails
obj-1 — do not let a submission's confident prose talk you out of
checking the actual data flow.

### Answer key (verified by execution during authoring)

| Label | Verdict | Class / reason |
|---|---|---|
| A | VULNERABLE | Prototype pollution — recursive merge with no key guard. Confirmed by running `mergeRecipeSettings({}, JSON.parse('{"__proto__":{"polluted":"yes"}}'))`: `({}).polluted` becomes `"yes"` afterward, i.e. `Object.prototype` itself was mutated. |
| B | SAFE (decoy) | The interpolated `column` identifier only ever resolves to one of three hardcoded strings (`recipe_name`, `avg_rating`, `created_at`) via an own-property check against a frozen whitelist map, or to the hardcoded fallback `'recipe_name'` — confirmed by passing `__proto__`, `constructor`, and a SQL-metacharacter string as `userSortKey`: all three fall through to `'recipe_name'`, never to `[object Object]` or attacker text. `minRating` goes through a placeholder. No attacker-controlled string ever reaches the SQL text. |
| C | VULNERABLE | ReDoS / catastrophic backtracking — `^(([a-zA-Z]+)+)+$` nests three quantified groups with overlapping matches for runs of letters. Confirmed by execution: `isReasonableTitle('a'.repeat(15) + '!')` takes ~1s, `('a'.repeat(17) + '!')` ~8.5s, and `('a'.repeat(18) + '!')` did not return within 20 seconds (had to be killed) — each added character roughly doubles the time, demonstrating exponential blowup on a modest ~18-character adversarial input. |
| D | SAFE (decoy) | `execFile` with an argument array never invokes a shell — confirmed by intercepting `child_process.exec`/`execFile` calls: `D`'s equivalent call path passes the id as one argv element with no shell metacharacter interpretation possible, unlike G below. Visually adjacent to G (both shell out to a helper) but structurally safe. |
| E | VULNERABLE | XSS via `innerHTML` — any HTML/script content in `description` is parsed and can execute in the viewer's browser (stored XSS, since descriptions are user-submitted and persisted). |
| F | SAFE (decoy) | `textContent` never parses its argument as markup; a string containing `<script>` renders as literal text. Visually adjacent to E (both render user data into the DOM) but the sink is safe. |
| G | VULNERABLE | Command injection — `exec('ping -c 1 ' + hostname, ...)` concatenates into a shell command string. Confirmed by intercepting `exec`: passing `hostname = 'example.com; echo injected'` produced the command string `ping -c 1 example.com; echo injected` verbatim, i.e. shell metacharacters reach the shell parser intact. |
| H | SAFE (decoy) | `Math.random` selects a cosmetic tip string with no authentication, authorization, token, or identifier role anywhere in its usage — insecure randomness only matters when the random value is security-relevant (session tokens, password reset codes, etc.), which this is not. |

### Per-check guidance

- **obj-1 / obj-2**: score these as a strict set match. A submission
  that gets all eight labels right on both checks; one that flags a
  decoy or misses a real flaw fails the corresponding check
  regardless of narrative quality elsewhere.
- **obj-3**: reject justifications like "this regex is unsafe" or
  "don't trust regexes on user input" with no structural reasoning.
  Accept anything that identifies the nested `(...)+` groups or uses
  the term "catastrophic backtracking" / "exponential" correctly.
- **obj-4**: the fixes don't need to match the wording above verbatim
  — judge for mechanism correctness. A fix for G that only "adds input
  validation" without specifying what's disallowed, or a fix for A
  that says "validate the input" without naming the dangerous keys or
  a null-prototype target, is too vague to pass.
- **obj-5**: literally count the table rows against A-H.

### Example phrasings — snippet B justification (safe decoy)

PASSING:
- "The sort column is looked up in a fixed whitelist map by own-property
  check and falls back to a hardcoded column name for any unrecognized
  or inherited key (including `__proto__`/`constructor`), so no
  attacker string ever reaches the SQL text; the rating value itself
  is parameterized."
- "Only three literal column names can ever be interpolated here — the
  map lookup can't be tricked into returning an attacker string or an
  object, so this isn't the classic dynamic-ORDER-BY injection."
- "Safe: the whitelist fallback is unconditional and the value
  parameter uses a placeholder, so the only injection surface (the
  column name) is fully constrained to 3 known strings."

FAILING:
- "This interpolates a column name into a SQL string, which is
  injection-prone, so it's vulnerable." (ignores that the value is
  constrained to a fixed whitelist — pattern-matches on
  "string-built SQL" without tracing where the string can come from)
- "The user controls `userSortKey` so this is a SQL injection risk
  similar to snippet A." (conflates with an unrelated snippet, and
  doesn't check the whitelist's fallback behavior)
- "Vulnerable, because `${column}` is directly interpolated." (correct
  observation, wrong conclusion — interpolation alone isn't the bug
  when the interpolated value is provably constrained)

### Example phrasings — snippet G classification (vulnerable)

PASSING:
- "Vulnerable: command injection. `hostname` is concatenated directly
  into a shell command string passed to `exec`, so shell
  metacharacters (`;`, `&&`, backticks) in the hostname execute as
  additional commands."
- "`exec` invokes a shell to parse its string argument, and `hostname`
  is untrusted and unescaped — an attacker-supplied value like
  `x; rm -rf /` would be interpreted by the shell."

FAILING:
- "Risky because it shells out to ping." (doesn't identify the actual
  mechanism — shelling out itself isn't the flaw, string concatenation
  into a shell-interpreted command is)
- "Vulnerable, same issue as snippet D." (D is the safe execFile
  decoy — conflating the two misses the precise distinction the test
  is checking for)

### Example phrasings — snippet C ReDoS justification (obj-3)

PASSING:
- "Vulnerable: ReDoS. The pattern `^(([a-zA-Z]+)+)+$` nests three
  quantified groups, so a run of letters has exponentially many ways
  to be split across the inner and outer `+`s; when the trailing `!`
  forces a failed match, the engine backtracks through all of them
  before giving up."
- "The outer `(...)+` wraps an inner `(...)+` wraps `[a-zA-Z]+`, so an
  all-letter prefix can be partitioned between the nested quantifiers
  in exponentially many equivalent ways — that ambiguity, not just
  'it's a regex,' is what causes catastrophic backtracking here."
- "This is catastrophic backtracking: nesting `(([a-zA-Z]+)+)+` creates
  ambiguous grouping for any run of letters, so failing inputs make
  backtracking time grow exponentially with length."

FAILING:
- "This regex is unsafe on user input." (no mechanism named at all)
- "ReDoS." (bare class label — doesn't identify the nested/overlapping
  quantifier structure obj-3 requires)
- "Regexes on untrusted strings are risky because they can hang."
  (generic risk statement, no structural reasoning about the nesting)

### Subjective guidance

- **Classification justification depth**: does each justification
  trace actual data flow (where does the value come from, what
  interprets it, under what conditions) rather than restate a
  category label? Reward justifications that explicitly say why a
  decoy's surface resemblance to a real bug doesn't hold up.
- **Fix precision and concision**: is each fix for A/C/E/G specific
  enough to implement directly, in one line, without introducing new
  vagueness ("sanitize the input" unqualified is weak; naming the
  mechanism is strong)?
- **Reasoning quality**: does REASONING.md describe how each decoy was
  distinguished from its paired vulnerability (B vs. dynamic-SQL
  injection, D vs. G, F vs. E, H vs. insecure-token-randomness), and
  is the process auditable rather than just asserted?
