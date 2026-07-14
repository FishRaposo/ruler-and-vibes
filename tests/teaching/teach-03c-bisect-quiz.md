---
id: teach-03c-bisect-quiz
category: teaching
title: "Write a diagnostic quiz that detects whether someone really understands git bisect"
deliverables:
  - quiz.md
  - REASONING.md
---

## Task

Write a short assessment that answers: "Does this person genuinely
understand binary search debugging with git bisect, or do they just
type `good` and `bad` until it stops?"

The quiz must be **diagnostic** — getting the right answer by pattern
matching should fail. Each question must probe one concept that is the
most common source of confusion for learners. Multiple-choice format.

## Contents

- At most 5 questions, each with 4 answer choices.
- Exactly 1 correct per question (no "all of the above").
- An answer key under `## Answer key` that explains **why each correct
  answer is correct AND why each distractor is wrong** (one sentence each).

## Deliverables

- `quiz.md` — the quiz, questions, answer key
- `REASONING.md` — as required for every test by the run protocol

## Constraints

- At most 700 words (`wc -w` whole file).
- Every distractor must be a plausible confusion a real learner would
  hold — not a nonsense option or a trick.
- Must mention `git bisect` at least once as the tool under
  assessment (don't rename or abstract it).
