## Approach
Analyzed each of the eight snippets for actual data flow and attack surface. Distinguished between snippets that look risky but are safe (B, D, F, H) and snippets that are genuinely vulnerable (A, C, E, G). For each vulnerable snippet, identified the vulnerability class and provided a minimal fix.

## Key decisions
Snippet B uses a frozen allowlist with `hasOwnProperty` — the SQL column is always one of three hardcoded values, never user-controlled, so no SQL injection. Snippet D uses `execFile` with arguments passed as array elements, which prevents shell injection. I classified snippet C as VULNERABLE despite it not being a "classic" security vulnerability (it's ReDoS/availability), because a regex that hangs the event loop on malicious input is a genuine vulnerability in a web app.

## Trade-offs and limitations
The ReDoS in snippet C won't execute arbitrary code but can cause denial of service. The distinction between ReDoS and "safe but suboptimal" is a judgment call — I classified it as vulnerable because the regex can be exploited to degrade availability.

## Files read
- tests/cybersecurity/security-02-decoy-triage.md
