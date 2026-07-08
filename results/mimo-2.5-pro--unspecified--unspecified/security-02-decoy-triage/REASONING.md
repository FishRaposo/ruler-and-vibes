# REASONING.md — security-02-decoy-triage

## Approach

I traced the data flow in each snippet from user-controlled input to the dangerous sink, checking whether the code actually allows injection or whether a mitigation is already in place.

## Key decisions

- **A (VULNERABLE):** The for-in loop iterates all enumerable properties including `__proto__`. No `hasOwnProperty` guard.
- **B (SAFE):** The allowlist with `Object.freeze` and `hasOwnProperty` check means user input cannot reach the SQL column position.
- **C (VULNERABLE):** Nested quantifiers `(([a-zA-Z]+)+)+` are a textbook ReDoS pattern. Verified the exponential backtracking behavior.
- **D (SAFE):** `execFile` with array arguments prevents shell interpretation — this is the correct mitigation for the recipe-to-pdf call.
- **E (VULNERABLE):** `innerHTML` with unsanitized user content is DOM XSS.
- **F (SAFE):** `textContent` escapes HTML entities automatically.
- **G (VULNERABLE):** `exec` with string concatenation is shell injection. The fix is `execFile`.
- **H (SAFE):** Hardcoded strings, no user input in the data flow.

## Trade-offs and limitations

- Did not provide full exploit payloads for the vulnerable snippets — just described the class and fix.

## Files read

- tests/cybersecurity/security-02-decoy-triage.md
