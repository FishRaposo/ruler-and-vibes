---
id: ambig-03c-contradictory-constraints-brief
category: ambiguity
title: "Respond to a system design brief with contradictory constraints"
deliverables:
  - response.md
---

## Task

You are advising a product manager. **This is the entire brief:**

> "We need a chat app. Messages must be delivered instantly (under
> 50ms) regardless of the recipient's connection quality. Every
> message must be stored forever with full-text search across all
> channels. The search must return results in under 100ms even across
> years of history. The app must be fully functional offline —
> composing, reading history, and searching must all work without
> internet. All data must be encrypted at rest and in transit, and
> the server must never see message plaintext. Timeline: 4 weeks.
> Team: 2 backend engineers."

The brief contains contradictions that make it impossible as stated:

1. **Offline full-text search + E2EE + 100ms latency** — full-text
   search over encrypted content cannot be performed by the server
   without decryption keys. Client-side search over years of history
   cannot complete in 100ms on a mobile device without the server
   building and searching an index.
2. **Instant delivery + offline recipient** — "under 50ms regardless
   of connection quality" is physically impossible when the recipient
   is offline. At best the server queues the message; it is not
   delivered until the recipient reconnects.
3. **Forever storage + E2EE + full-text search + 4 weeks + 2 engineers**
   — building an encrypted search index that scales to years of
   history across all channels, while maintaining forward secrecy and
   supporting offline clients, is a research-grade problem. Four
   weeks with two backend engineers cannot deliver this.

Write `response.md` that:

- Names each contradiction explicitly with a short explanation of why
  it cannot be resolved as stated.
- For each contradiction, proposes one concrete trade-off the PM must
  choose (not "maybe we can…" — a real fork).
- Does **not** accept the brief as-is or start planning without
  surfacing the contradictions.

## Deliverables

- `response.md`

## Constraints

- 150–400 words.
- Must contain a section `## Contradictions` with ≥1 fork per
  contradiction.
- Must NOT propose a "we'll figure it out" non-answer.
