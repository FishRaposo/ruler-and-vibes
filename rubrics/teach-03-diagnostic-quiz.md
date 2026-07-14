---
test: teach-03-diagnostic-quiz
canary: "galena spindle"
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

If the phrase "galena spindle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

The core skill being tested is **pedagogical content knowledge** — does
the model know what learners actually confuse about git rebase? The
common confusions (any model that has read git documentation will know
these; the test discriminates on whether it can turn them into
diagnostic items):

- **Rebase vs merge** — learners treat them as interchangeable or think
  rebase is "merge but cleaner." A good question probes what actually
  happens to the commit DAG: rebase rewrites history (new SHAs), merge
  preserves it.
- **Interactive rebase as a commit editor, not a merge tool** — learners
  think `-i` is about resolving conflicts, not about reordering,
  squashing, and dropping commits before the branch is replayed.
- **`fixup`/`squash` vs `reword`** — learners conflate all "edit" verbs.
  `fixup` discards the commit message; `reword` keeps it and prompts.
- **The `--onto` flag** — the most commonly misunderstood rebase
  concept. A good distractor: "`--onto` changes the target branch name."
- **Rebase during an active `git bisect`** — advanced, but the kind of
  edge case that reveals whether someone understands that rebase
  rewrites commits and therefore invalidates a bisect session.

### Per-check guidance

- **obj-1**: `wc -w quiz.md`.
- **obj-2**: Count questions (2–5 inclusive). Each must offer exactly 4
  choices. If a question has 3 or 5 choices, FAIL. Multiple correct
  choices in one question also FAIL.
- **obj-3**: Judge reads every distractor. A distractor fails if:
  - It's a joke ("42," "none of the above").
  - It's a trick answer with no pedagogical rationale (e.g., "all of
    the above" where one option is a deliberate trap rather than a real
    conceptual error).
  - It's clearly copy-pasted from another question's distractors with
    only superficial word changes.
  - PASS: every distractor represents a misconception a real instructor
    would recognise.
- **obj-4**: Answer key section must exist. Each correct answer needs a
  "why correct" sentence. Each distractor needs a "why wrong" sentence.
  If any question's answer key skips the distractor explanations, FAIL.

### Subjective guidance

- **Diagnostic power**: the acid test — read each question and ask
  "could a beginner who memorised the git rebase man page get this
  right?" If yes, the question is recall, not diagnostic. The best
  questions require the learner to predict behaviour in a novel
  scenario that isn't a verbatim copy of any man-page example.
- **Distractor quality**: the best distractors are half-right — they
  contain a kernel of truth that makes the wrong answer attractive to
  someone with a partial understanding. Credit models that build
  distractors from real mental models ("rebase replays commits, so it
  must replay merge commits too") rather than random wrong answers.
- **Reasoning quality**: does REASONING.md explain which learner
  confusions it targeted and why it chose each distractor?
