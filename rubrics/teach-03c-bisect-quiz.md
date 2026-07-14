---
test: teach-03c-bisect-quiz
canary: "lateen pyrite"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "quiz.md is at most 700 words (whole file, wc -w)"
    - id: obj-2
      check: "Contains 2–5 questions, each with exactly 4 choices and exactly 1 correct answer"
    - id: obj-3
      check: "Every distractor is a plausible learner confusion, not a nonsense option or a trick"
    - id: obj-4
      check: "Answer key exists under ## Answer key and explains why each correct answer is correct AND why each distractor is wrong (one sentence each)"
  subjective:
    - id: sub-quality
      name: "Diagnostic power of questions"
      weight: 0.4
    - id: sub-craft
      name: "Distractor quality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Diagnostic power of questions
    0: Questions test recall of command flags or syntax trivia — a memoriser passes, a deep understander fails.
    5: Some questions probe understanding but at least one is memorisable or answerable by elimination without concept knowledge.
    10: Every question forces the learner to apply the concept, not recognise it — a rote-memoriser cannot pass.
  - id: Distractor quality
    0: Distractors are obviously wrong (joke answers, impossibilities) or are the same error copy-pasted across questions.
    5: Mostly plausible but one or two distractors are weak — a learner with a partial understanding could eliminate them too easily.
    10: Every distractor is a real confusion a teacher in this domain has actually seen; each forces a genuine choice.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `teach-03-diagnostic-quiz` (same construct, fresh surface).

If the phrase "lateen pyrite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

Common learner confusions about git bisect:

- **Binary search, not linear scan** — learners think bisect is "test
  each commit in order" rather than a logarithmic search.
- **Good and bad are labels, not value judgments** — `good` means "this
  commit doesn't have the bug" even if the commit is terrible code.
  `bad` means "the bug is present here" even if the commit is otherwise
  perfect.
- **Bisect rewrites HEAD** — learners don't understand that bisect
  leaves them in detached HEAD state at a midpoint commit, and that
  their working tree reflects that commit's code, not their branch.
- **`bisect skip` vs `bisect reset`** — `skip` tells bisect "I can't
  test this commit, give me another boundary" but the learner thinks
  it means "give up and go back."
- **Automated bisect with `git bisect run`** — learners don't know
  that bisect can be scripted, thinking it's always a manual process.
- **Bisect log and replay** — `git bisect log` records the session;
  `git bisect replay` can rerun it. Learners don't know the session
  is recoverable if they make a mistake.

### Per-check guidance

- **obj-1**: `wc -w quiz.md`.
- **obj-2**: 2–5 questions, 4 choices each, exactly 1 correct.
- **obj-3/obj-4**: per the source rubric standards.

### Subjective guidance

- **Diagnostic power**: acid test — if every question could be
  answered by reading the git-bisect man page, the quiz tests recall,
  not understanding. The best bisect questions ask: "You're at commit
  d4f2 in a bisect session and the test passes. You mark it good.
  What commit will bisect check out next?" — this requires the learner
  to maintain the good/bad boundary mentally and predict the midpoint.
- **Distractor quality**: the good/bad semantic confusion is the
  richest vein — "mark this commit as good because it's well-written"
  is a real confusion.
- **Reasoning quality**: REASONING.md should name which bisect
  misconception it considers most harmful (most instructors say:
  not understanding that bisect checks out arbitrary historical
  commits that may not even build, let alone pass tests).
