# Security Triage — Recipe-Sharing App

| Label | Verdict | Detail |
|-------|---------|--------|
| **A** | **VULNERABLE** | **Prototype pollution.** `mergeRecipeSettings` recursively copies properties from `source` into `target` without checking `hasOwnProperty`. An attacker can inject `__proto__` or `constructor.prototype` keys via crafted JSON. **Fix:** add `if (!Object.prototype.hasOwnProperty.call(source, key)) continue;` inside the for-in loop. |
| **B** | SAFE | The sort column is selected from a frozen allowlist (`SORT_COLUMNS`) via `hasOwnProperty` check, with a safe fallback. User input never reaches the SQL ORDER BY clause directly. |
| **C** | **VULNERABLE** | **ReDoS (catastrophic backtracking).** The regex `/^(([a-zA-Z]+)+)+$/` has nested quantifiers `(+)+` that cause exponential backtracking on long strings of letters followed by a non-matching character (e.g., `"a".repeat(30) + "!"`). **Fix:** simplify to `/^[a-zA-Z]+$/` or `/^[a-zA-Z\s'-]+$/` if spaces/punctuation are needed. |
| **D** | SAFE | Uses `execFile` (not `exec`), which passes arguments as an array — no shell interpretation occurs. `recipeId` is converted to a string and passed as a discrete argument, preventing command injection. |
| **E** | **VULNERABLE** | **DOM-based XSS.** `container.innerHTML = description` renders user-submitted HTML directly. An attacker can inject `<script>` tags or event handlers (e.g., `<img onerror="...">`). **Fix:** use `container.textContent = description` instead of `innerHTML`. |
| **F** | SAFE | `textContent` does not parse HTML, so user-submitted titles are rendered as plain text. No injection vector. |
| **G** | **VULNERABLE** | **Command injection.** `exec('ping -c 1 ' + hostname)` concatenates user input into a shell command string. An attacker can inject arbitrary commands (e.g., `; rm -rf /`). **Fix:** use `execFile('ping', ['-c', '1', hostname], ...)` instead of `exec` with string concatenation. |
| **H** | SAFE | Picks from a hardcoded array of static strings using `Math.random()`. No user input enters the data flow, and `Math.random()` is not a security concern for decorative tip selection. |
