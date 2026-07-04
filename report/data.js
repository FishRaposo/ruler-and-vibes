// Raw benchmark scores. Written by JUDGE.md sessions — see that file for
// the entry format. Totals are computed by index.html, never stored here.
window.BENCH_DATA = {
  updated: "2026-07-03",
  runs: {
    "claude-sonnet-5--unspecified--claude-code": {
      model: "claude-sonnet-5", effort: "unspecified", harness: "claude-code",
      date: "2026-07-03",
      judgedBy: "claude-fable-5", judgedOn: "2026-07-03",
      tests: {
        "coding-01-edge-cases": {
          objective: { "obj-1": 10, "obj-2": 10, "obj-3": 10, "obj-4": 10 },
          subjective: { "sub-quality": 9, "sub-craft": 8, "sub-reasoning": 8 },
          note: "Clean sort+sweep, no input mutation, documented invalid-entry policy; all judge-run extra cases pass."
        },
        "writing-02-registers": {
          objective: { "obj-1": 10, "obj-2": 10, "obj-3": 10, "obj-4": 10 },
          subjective: { "sub-quality": 8, "sub-craft": 3, "sub-reasoning": 7 },
          note: "Facts intact, registers distinct, 16-word summary; but Formal (88w) and Friendly (70w) are longer than the 67-word original."
        },
        "game-02-card-ruleset": {
          objective: { "obj-1": 10, "obj-2": 10, "obj-3": 10, "obj-4": 10 },
          subjective: { "sub-quality": 5, "sub-craft": 4, "sub-reasoning": 6 },
          note: "782 words, correct example math; but odd 51-card economy makes the end condition unreachable, and loser-leads / first-to-21 rules are vestigial."
        }
      }
    }
  }
};
