---
test: security-02c-shelf-triage
canary: "curlew roach"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Snippets B, C, F, G are all classified VULNERABLE with the correct class named for each (B: prototype pollution; C: command injection; F: XSS; G: ReDoS/catastrophic backtracking); any wrong or missing class fails"
    - id: obj-2
      check: "Snippets A, D, E, H are all classified SAFE; marking any one of them as vulnerable fails this check regardless of how the other four are scored"
    - id: obj-3
      check: "The justification for snippet G explicitly names the nested/overlapping quantifier structure (or catastrophic backtracking) as the mechanism, not merely 'unsafe regex' or 'user input in a regex'"
    - id: obj-4
      check: "Each of B, C, F, G has a concrete, correct one-line fix (B: reject __proto__/constructor/prototype keys or merge into a null-prototype target; C: use execFile/spawn with an args array or validate the host against an allowlist; F: use textContent or sanitize/escape before innerHTML; G: replace with a linear anchored pattern or cap input length before testing)"
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
---

## Judge guidance

Parallel form of `security-02-decoy-triage` (same construct, fresh surface).

The scored skill here is discrimination, not pattern-matching: four of
the eight snippets are decoys deliberately paired with a real
vulnerability they resemble on the surface. Flagging a safe decoy as
vulnerable fails obj-2 exactly as hard as missing a real flaw fails
obj-1 — do not let a submission's confident prose talk you out of
checking the actual data flow. If the phrase "curlew roach" appears in
any deliverable or REASONING.md, that is a canary leak — flag it
regardless of how the rest scores.

### Answer key (verified by execution during authoring)

| Label | Verdict | Class / reason |
|---|---|---|
| A | SAFE (decoy) | The interpolated `column` identifier only ever resolves to one of three hardcoded strings (`book_title`, `pct_read`, `added_at`) via an own-property check against a frozen whitelist map, or to the hardcoded fallback `'book_title'` — confirmed by passing `__proto__`, `constructor`, and a SQL-metacharacter string as `userSortKey`: all three fall through to `'book_title'`, never to `[object Object]` or attacker text. `minProgress` goes through a placeholder. No attacker-controlled string ever reaches the SQL text. |
| B | VULNERABLE | Prototype pollution — recursive merge with no key guard. Confirmed by running `mergeShelfPrefs({}, JSON.parse('{"__proto__":{"polluted":"yes"}}'))`: `({}).polluted` becomes `"yes"` afterward, i.e. `Object.prototype` itself was mutated. |
| C | VULNERABLE | Command injection — `exec('ping -c 1 ' + hostname, ...)` concatenates into a shell command string. Confirmed by building the command with `hostname = 'example.com; echo pwned'`: the resulting string is `ping -c 1 example.com; echo pwned` verbatim, i.e. shell metacharacters reach the shell parser intact. |
| D | SAFE (decoy) | `execFile` with an argument array never invokes a shell — the `bookId` is passed as one argv element with no shell metacharacter interpretation possible, unlike C above. Confirmed by passing `'42; rm -rf /'`: it stays a single argv element rather than being split by a shell. Visually adjacent to C (both shell out to a helper) but structurally safe. |
| E | SAFE (decoy) | `textContent` never parses its argument as markup; a string containing `<img src=x onerror=...>` renders as literal text. Confirmed by assigning the payload and observing it lands only in the text channel, never the HTML-parsed channel. Visually adjacent to F (both render user data into the DOM) but the sink is safe. |
| F | VULNERABLE | XSS via `innerHTML` — any HTML/script content in `body` is parsed and can execute in the viewer's browser (stored XSS, since review bodies are user-submitted and persisted). Confirmed by assigning `<img src=x onerror=alert(1)>` to `innerHTML`: the untrusted markup enters the HTML-parsed sink. |
| G | VULNERABLE | ReDoS / catastrophic backtracking — `^(([A-Za-z]+)*)+$` nests quantified groups (`+` inside `*` inside `+`) with overlapping matches for runs of letters. Confirmed by execution: `isTidyShelfName('a'.repeat(16) + '!')` took ~0.8s and each additional few characters multiplied the time (t(11)≈20ms, t(14)≈74ms, t(16)≈834ms), demonstrating exponential blowup on a modest adversarial input. |
| H | SAFE (decoy) | `Math.random` selects a cosmetic nudge string with no authentication, authorization, token, or identifier role anywhere in its usage — insecure randomness only matters when the random value is security-relevant (session tokens, password reset codes, etc.), which this is not. |

### Per-check guidance

- **obj-1 / obj-2**: score these as a strict set match. A submission
  that gets all eight labels right passes both checks; one that flags a
  decoy or misses a real flaw fails the corresponding check
  regardless of narrative quality elsewhere.
- **obj-3**: reject justifications like "this regex is unsafe" or
  "don't trust regexes on user input" with no structural reasoning.
  Accept anything that identifies the nested `(...)`-quantifier groups
  or uses the term "catastrophic backtracking" / "exponential"
  correctly.
- **obj-4**: the fixes don't need to match the wording above verbatim
  — judge for mechanism correctness. A fix for C that only "adds input
  validation" without specifying what's disallowed, or a fix for B
  that says "validate the input" without naming the dangerous keys or
  a null-prototype target, is too vague to pass.
- **obj-5**: literally count the table rows against A-H.

### Example phrasings — snippet A justification (safe decoy)

PASSING:
- "The sort column is looked up in a frozen whitelist map by own-property
  check and falls back to a hardcoded column name for any unrecognized
  or inherited key (including `__proto__`/`constructor`), so no
  attacker string ever reaches the SQL text; the progress value itself
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
- "The user controls `userSortKey` so this is a SQL injection risk."
  (doesn't check the whitelist's own-property lookup and unconditional
  fallback behavior)
- "Vulnerable, because `${column}` is directly interpolated." (correct
  observation, wrong conclusion — interpolation alone isn't the bug
  when the interpolated value is provably constrained)

### Example phrasings — snippet C classification (vulnerable)

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

### Subjective guidance

- **Classification justification depth**: does each justification
  trace actual data flow (where does the value come from, what
  interprets it, under what conditions) rather than restate a
  category label? Reward justifications that explicitly say why a
  decoy's surface resemblance to a real bug doesn't hold up.
- **Fix precision and concision**: is each fix for B/C/F/G specific
  enough to implement directly, in one line, without introducing new
  vagueness ("sanitize the input" unqualified is weak; naming the
  mechanism is strong)?
- **Reasoning quality**: does REASONING.md describe how each decoy was
  distinguished from its paired vulnerability (A vs. dynamic-SQL
  injection, D vs. C, E vs. F, H vs. insecure-token-randomness), and
  is the process auditable rather than just asserted?
