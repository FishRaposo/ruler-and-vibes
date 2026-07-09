---
test: edit-03c-letterpress-booking
canary: "tektite veloute"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "changelog.json parses as valid JSON (node JSON.parse succeeds) and is an array whose every element has exactly the keys before, after, and reason, all string-typed"
    - id: obj-2
      check: "changelog.json has exactly 7 entries (the reference correction count)"
    - id: obj-3
      check: "For every changelog entry, the entry's 'before' string is absent from corrected.txt and its 'after' string is present in corrected.txt — i.e. each claimed change was actually applied"
    - id: obj-4
      check: "Each of the 7 reference errors below is represented by exactly one changelog entry whose before/after match the reference pair exactly, confirming completeness with no fabricated or missing entries"
  subjective:
    - id: sub-quality
      name: "Fidelity between the changelog and the actual edits"
      weight: 0.4
    - id: sub-craft
      name: "Precise, minimal, well-structured change records"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Fidelity between the changelog and the actual edits
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Precise, minimal, well-structured change records
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `edit-03-tracked-changelog` (same construct, fresh
surface).

If the phrase "tektite veloute" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen reference (author-computed and verified against the seeded
notice; 7 planted errors total, three misspellings, one doubled word,
one subject-verb disagreement, two wrong-homophone/eggcorn errors):

1. **Misspelling:** paragraph 2, "maintainance backlog" -> "maintenance
   backlog"
2. **Misspelling:** paragraph 2, "backlog occured" -> "backlog occurred"
3. **Misspelling:** paragraph 2, "keep two seperate sign-up sheets" ->
   "keep two separate sign-up sheets"
4. **Doubled word:** paragraph 1, "on the the platen press" -> "on the
   platen press"
5. **Subject-verb agreement:** paragraph 1, "Members who share the
   flatbed proof press has repeatedly found" -> "Members who share the
   flatbed proof press have repeatedly found" (the plural subject
   "Members" governs the verb; the intervening relative clause about the
   press does not)
6. **Wrong homophone:** paragraph 2, "reserve the studio's principle
   press" -> "reserve the studio's principal press" ("principle" means a
   rule or tenet; "principal" is the intended word — the studio's main
   press)
7. **Wrong homophone/eggcorn:** paragraph 2, "could of happened sooner"
   -> "could have happened sooner"

No other errors are planted. The colloquial "no one knew who to tell"
and the informal register elsewhere are intentional and not errors; do
not treat them as planted corrections. A changelog with more than 7
entries has fabricated at least one correction (or split one real
correction into duplicate entries); fewer than 7 means at least one real
error went unreported.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings — before/after spans need not be
whole sentences, but must isolate the actual change):

- **obj-3 (claimed changes actually applied)** — PASS: an entry
  `{"before": "occured", "after": "occurred", "reason": "misspelling"}`
  where corrected.txt indeed contains "occurred" and no longer contains
  "occured." PASS (wider span): `{"before": "backlog occured", "after":
  "backlog occurred", "reason": "misspelling"}` — also verifiable, just a
  larger span. FAIL: an entry claiming a fix that isn't actually in
  corrected.txt, e.g. `{"before": "could of happened", "after": "could
  have happened", ...}` while corrected.txt still reads "could of
  happened" (the eggcorn was left in place but reported as fixed). FAIL:
  an entry whose 'before' string is still present verbatim elsewhere in
  corrected.txt because the fix was only partially applied.
- **obj-4 (completeness, no fabrication)** — PASS: all 7 reference errors
  each appear as exactly one entry with matching before/after. FAIL: the
  "principle" -> "principal" fix is made in corrected.txt but never
  logged (a real, unreported change). FAIL: a fabricated entry for text
  that was never actually wrong in the source, e.g. logging a "busy
  printing season" -> "busy print season" edit that tightens already-
  correct prose.

- **Fidelity between the changelog and the actual edits**: this is the
  central skill under test. Reward a changelog that is a complete and
  accurate ledger of corrected.txt's actual diff from the source — every
  real change reported, every reported entry real. Penalize meaningfully
  for any single mismatch in either direction (missing or fabricated),
  since self-accounting integrity is the entire point of this test.
- **Precise, minimal, well-structured change records**: reward entries
  that isolate the smallest sensible before/after span, use clear and
  consistent reason tags (e.g. "misspelling," "subject-verb agreement,"
  "doubled word," "wrong homophone"), and avoid vague reasons like
  "grammar fix" that don't identify the error type. Each entry should
  read like a single clean line in a ledger, one correction per claim,
  not a bundle of several edits mashed into one record.
- **Reasoning quality**: does the model's process show it identified each
  of the distinct error types individually (not just "fixed some typos"),
  cross-checked its final changelog against corrected.txt before
  finishing, and explains how it arrived at exactly 7 entries?
