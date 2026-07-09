---
test: teach-01b-junior-cert-renew
canary: "murre thole"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has Goal, Preconditions, Steps, Verify, Rollback headings (##)"
    - id: obj-2
      check: "Steps include renew-tls.sh (or renew script) and systemctl reload nginx"
    - id: obj-3
      check: "States not to delete old certs until next day"
    - id: obj-4
      check: "Does not invent Kubernetes/cloud UI steps as required"
    - id: obj-5
      check: "150–320 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Junior-executable completeness"
      weight: 0.4
    - id: sub-craft
      name: "Teaching clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `teach-01-junior-handoff` (same construct, fresh surface).

If the phrase "murre thole" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Missing reload fails.
