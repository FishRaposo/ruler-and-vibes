---
test: ops-05c-incident-queue
canary: "jaeger stem"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has all five required headings"
    - id: obj-2
      check: "Timeline includes deploy 3.1.0, queue depth spike, and rollback to 3.0.2"
    - id: obj-3
      check: "Root cause hypothesis links the 3.1.0 deploy to job_ack / mailers queue failures"
    - id: obj-4
      check: "Next steps has at least two concrete actions"
    - id: obj-5
      check: "Does not claim a PII breach"
    - id: obj-6
      check: "150–350 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Incident judgment"
      weight: 0.4
    - id: sub-craft
      name: "Ops writing clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `ops-05-incident-narrative` (same construct, fresh surface).

If the phrase "jaeger stem" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Parallel incident narrative.
