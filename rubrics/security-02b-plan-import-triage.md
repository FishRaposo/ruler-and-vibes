---
test: security-02b-plan-import-triage
canary: "whimbrel tench"
reviewed: "pass 2026-07-04 (independent gate)"
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
      check: "Each of A, C, E, G has a concrete, correct one-line fix (A: reject __proto__/constructor/prototype keys or merge into a null-prototype target; C: rewrite to a non-backtracking pattern or cap input length before testing; E: use textContent or sanitize/escape before innerHTML; G: use execFile/spawn with an args array or validate the host against an allowlist)"
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

If the phrase "whimbrel tench" appears in any deliverable or
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
| A | VULNERABLE | Prototype pollution — recursive override merge with no key guard. Confirmed by running `applyPlanOverrides({}, JSON.parse('{"__proto__":{"polluted":"yes"}}'))`: `({}).polluted` becomes `"yes"` afterward (it was `undefined` before), i.e. `Object.prototype` itself was mutated. |
| B | SAFE (decoy) | The interpolated `col` identifier only ever resolves to one of three hardcoded strings (`top_weight`, `logged_at`, `total_volume`) via an own-property check against a frozen whitelist map, or to the hardcoded fallback `'logged_at'` — confirmed by passing `__proto__`, `constructor`, `prototype`, a `; DROP TABLE workouts` string, an `OR (1=1` string, and a bare object as `userOrderKey`: every one falls through to `'logged_at'`, never to `[object Object]` or attacker text. `athleteId` goes through a placeholder. No attacker-controlled string ever reaches the SQL text. |
| C | VULNERABLE | ReDoS / catastrophic backtracking — `^([a-z]+-?)+$` wraps a quantified group whose inner `[a-z]+` runs overlap, so a non-matching input forces exponential backtracking. Confirmed by execution: `isCleanSlug('a'.repeat(25) + '!')` took ~1.6s, `('a'.repeat(26) + '!')` ~3.1s, and `('a'.repeat(27) + '!')` did not return within seconds (had to be killed) — each added character roughly doubles the time, i.e. exponential blowup on a modest ~28-character adversarial input. |
| D | SAFE (decoy) | `Math.random` selects a cosmetic "hype line" string with no authentication, authorization, token, or identifier role anywhere in its usage — insecure randomness only matters when the random value is security-relevant (session tokens, password reset codes, etc.), which a banner string is not. |
| E | VULNERABLE | XSS via `innerHTML` — any HTML/script content in `note` is parsed and can execute in the viewer's browser (stored XSS, since coach notes are user-submitted and persisted). Confirmed by execution: the sink assigns raw markup (`<img src=x onerror=...>`) unescaped. |
| F | SAFE (decoy) | `textContent` never parses its argument as markup; a `name` containing `<script>` is stored and rendered as literal text. Confirmed by execution: assigning `<script>steal()</script>` leaves the literal string in place with no interpretation. Visually adjacent to E (both render user data into the DOM) but the sink is safe. |
| G | VULNERABLE | Command injection — `exec('nslookup ' + hostname, ...)` concatenates into a shell command string. Confirmed by intercepting `exec`: passing `hostname = 'watch.example.com; echo pwned'` produced the command string `nslookup watch.example.com; echo pwned` verbatim, i.e. shell metacharacters reach the shell parser intact. |
| H | SAFE (decoy) | `execFile` with an argument array never invokes a shell — confirmed by intercepting `execFile`: passing `sessionId = '42; rm -rf /'` keeps the payload as one argv element (`['--session', '42; rm -rf /']`) with no shell metacharacter interpretation possible, unlike G above. Visually adjacent to G (both shell out to a helper) but structurally safe. |

### Per-check guidance

- **obj-1 / obj-2**: score these as a strict set match. A submission
  that gets all eight labels right passes both; one that flags a decoy
  or misses a real flaw fails the corresponding check regardless of
  narrative quality elsewhere. Naming "ReDoS" (or "prototype
  pollution", "XSS", "command injection") as the class for its snippet
  is required for obj-1; a right verdict with the wrong or unnamed
  class still fails obj-1.
- **obj-3**: reject justifications like "this regex is unsafe" or
  "don't run user input through a regex" with no structural reasoning —
  and note that naming the class acronym "ReDoS" alone does not satisfy
  obj-3 either. Accept anything that identifies the nested/overlapping
  quantified `(...)+` group or uses the term "catastrophic
  backtracking" / "exponential" correctly.
- **obj-4**: the fixes don't need to match the wording above verbatim
  — judge for mechanism correctness. A fix for G that only "adds input
  validation" without specifying what's allowed/disallowed, or a fix
  for A that says "validate the input" without naming the dangerous
  keys or a null-prototype target, is too vague to pass.
- **obj-5**: literally count the table rows against A-H.

### Example phrasings — snippet B justification (safe decoy)

PASSING:
- "The sort column is looked up in a frozen whitelist map by own-property
  check and falls back to a hardcoded column name for any unrecognized
  or inherited key (including `__proto__`/`constructor`), so no
  attacker string ever reaches the SQL text; the athlete id itself is
  parameterized."
- "Only three literal column names can ever be interpolated here — the
  map lookup can't be tricked into returning an attacker string or an
  object, so this isn't the classic dynamic-ORDER-BY injection."
- "Safe: the whitelist fallback is unconditional and the id parameter
  uses a placeholder, so the only injection surface (the column name)
  is fully constrained to three known strings."

FAILING:
- "This interpolates a column name into a SQL string, which is
  injection-prone, so it's vulnerable." (ignores that the value is
  constrained to a fixed whitelist — pattern-matches on
  "string-built SQL" without tracing where the string can come from)
- "The user controls `userOrderKey` so this is a SQL injection risk
  similar to snippet A." (conflates with an unrelated snippet, and
  doesn't check the whitelist's fallback behavior)
- "Vulnerable, because `${col}` is directly interpolated." (correct
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
- "Concatenating `hostname` into the `exec` string means a value such
  as `h.local && curl evil` is parsed by the shell as two commands;
  this is command injection."

FAILING:
- "Risky because it shells out to ping." (doesn't identify the actual
  mechanism — shelling out itself isn't the flaw, string concatenation
  into a shell-interpreted command is)
- "Vulnerable, same issue as snippet H." (H is the safe execFile
  decoy — conflating the two misses the precise distinction the test
  is checking for)
- "Uses `child_process`, which is dangerous." (names the module, not
  the data flow; the safe decoy H uses `child_process` too)

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
  injection, D vs. insecure-token-randomness, F vs. E, H vs. G), and
  is the process auditable rather than just asserted?
