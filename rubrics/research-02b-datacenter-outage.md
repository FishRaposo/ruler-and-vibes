---
test: research-02b-datacenter-outage
canary: "godwit keystone"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "brief.md word count (wc -w, whole file) is between 300 and 450"
    - id: obj-2
      check: "The 'Disputed points' table resolves all three conflicts to the official-review values: 96 servers affected, 03:05 start, PDU firmware fault (not the wire's 118 / 02:15 / cooling failure)"
    - id: obj-3
      check: "The brief explicitly states that S5 repeats or derives from S1 (i.e., they are not independent corroboration)"
    - id: obj-4
      check: "The brief contains at least 8 inline citations in [S#] format, citing at least 4 of the 5 distinct source IDs"
    - id: obj-5
      check: "The brief addresses the customers-affected item from the required fact list as not established by any source, and states no numeric customer-impact count anywhere"
  subjective:
    - id: sub-quality
      name: "Reconciliation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Citation discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `research-02-conflict-brief` (same construct, fresh
surface).

If the phrase "godwit keystone" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

### Reference resolution (fixed)

- Servers affected: **96** (S2, S3) — not 118 (S1, S5)
- Outage start time: **03:05** (S3) — not 02:15 (S1, S5)
- Cause: **firmware fault in a power distribution unit (PDU)** (S3,
  corroborated by S4) — not "cooling failure" (S1, S5)
- Customers affected: **not established by any source** — zero sources
  give a customer-impact count under any synonym (users, accounts,
  clients, tenants, subscribers)

### Objective check notes

- **obj-1**: run `wc -w brief.md` on the whole file, including the table.
- **obj-2**: check the table's "Accepted finding" column for each of the
  three rows against the values above; a submission that (even partly)
  sides with the wire's figures on any of the three fails this check.
- **obj-3**: this is the circular-sourcing check — S5 explicitly states
  "According to the Calderwood Ops-Status Wire" (naming S1's source),
  meaning S1 and S5 are not two independent votes for 118/02:15/cooling
  failure. The brief must say so explicitly, not just cite both sources
  without comment. See the passing/failing phrasing examples below.
- **obj-4**: count `[S1]` through `[S5]` occurrences; at least 8 total
  citations, touching at least 4 distinct IDs.
- **obj-5**: grep the brief for "customer", "user", "account", "client",
  "tenant", "subscriber" adjacent to any number — no source gives a
  customer-impact count, so any numeric customer claim in the brief would
  be a fabrication.

### Prose-located check: "does the brief state S5 derives from S1?"

This determination is binary but requires reading in context. Example
phrasings a judge will encounter, and how to score them:

**PASSING** (correctly identifies the dependency):
1. "S5 explicitly attributes its figures to 'the Calderwood Ops-Status
   Wire' — the same source as S1 — so S1 and S5 represent a single early
   account counted twice, not two independent reports [S1][S5]."
2. "Although two sources (S1, S5) report 118 servers and a 02:15 start,
   S5 is merely repeating S1's dispatch rather than independently
   confirming it, which is why the review's later, evidence-based figures
   should govern instead [S1][S3][S5]."
3. "S5 adds no independent reporting of its own beyond what S1 already
   published, as S5 itself states its figures come from the Ops-Status
   Wire [S5]."

**FAILING** (treats S5 as independent corroboration, or omits the point
entirely):
1. "Two sources (S1 and S5) report 118 servers, versus one source (S3)
   reporting 96, but the review is more authoritative so we go with 96."
   (Never notes that S5 derives from S1 — silently treats the count as
   2-votes-vs-1 without flagging the dependency.)
2. "S1 and S5 both independently confirm the early reports of 118 servers
   and a 02:15 start." (Explicitly and incorrectly describes S5 as
   independent confirmation.)
3. A brief that cites both S1 and S5 in the Disputed points table's
   "Competing accounts" column without ever mentioning that S5 derives
   from S1 anywhere in the document.

### Subjective guidance

- **Reconciliation judgment**: does the brief correctly recognize that
  authority and recency (S3's official, evidence-based, later review)
  should govern over apparent numerical majority (S1+S5 vs S3 alone on
  start time), and articulate why?
- **Citation discipline**: are citations placed on the specific claims
  they support, rather than clustered at the end of paragraphs? Does every
  disputed figure carry a citation to its source?
- **Reasoning quality**: does `REASONING.md` explain the circular-sourcing
  trap and why naive majority-counting would have produced the wrong
  answer on start time specifically (where S3 stands alone against what
  looks like two sources)?
