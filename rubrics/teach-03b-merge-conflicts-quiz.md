---
test: teach-03b-merge-conflicts-quiz
canary: "mizzen citrine"
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

If the phrase "mizzen citrine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

The common learner confusions about merge conflicts:

- **Conflicts are not errors** — beginners treat conflict markers as
  something that broke. A good diagnostic question: "Your merge
  produces conflict markers. Is your repository now corrupted?"
- **Accepting theirs/ours loses the other side's changes** — learners
  use `--theirs` or `--ours` as a panic button without understanding
  they're discarding one parent's work entirely.
- **Conflict markers vs resolved state** — learners think deleting the
  markers IS resolving the conflict, not understanding they must also
  choose or merge the content.
- **Merge conflict ≠ merge failure** — a merge that produces conflicts
  is not a failed merge; it's a paused merge awaiting resolution.
- **Binary files can't be merged textually** — learners don't
  understand why `.png` conflicts can't be resolved in-editor.
- **Rebase conflicts are merge conflicts** — same markers, different
  context (rebase replays commits one at a time, so the "ours" and
  "theirs" labels are swapped relative to merge), which is the single
  most confusing fact about rebase conflicts.

### Per-check guidance

- **obj-1**: `wc -w quiz.md`.
- **obj-2**: 2–5 questions, 4 choices each, exactly 1 correct.
- **obj-3**: judge reads every distractor for pedagogical plausibility.
- **obj-4**: answer key must explain every distractor.

### Subjective guidance

- **Diagnostic power**: acid test — does any question require the
  learner to predict what `git status` shows during a conflicted merge,
  or explain why `git add` on a conflicted file marks it resolved?
  Rote recall fails on predictive questions. Credit questions that ask
  "what happens next" rather than "what flag does X."
- **Distractor quality**: the best distractors exploit the ours/theirs
  confusion — "Accept the incoming changes with `--theirs`" when
  `--theirs` actually means the branch being merged in, not "your"
  branch.
- **Reasoning quality**: REASONING.md should name the most common
  learner confusion it targeted and why existing quiz material online
  doesn't test it (most online quizzes test flag recall).
