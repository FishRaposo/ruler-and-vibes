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
          note: "Clean sort+sweep, no input mutation, documented invalid-entry policy; all judge-run extra cases pass.",
          comments: {
            "obj-1": "Ran it: 10/10 self-test lines print PASS, exit code 0.",
            "obj-2": "Verified independently: empty, single, inverted, duplicate, and negative cases all correct.",
            "obj-3": "[1,2]+[2,3] → [1,3]; a three-link chain also merges.",
            "obj-4": "One file, 119 lines, no dependencies.",
            "sub-quality": "Clean sort-then-single-pass; returns a new array without mutating the input; invalid-entry policy documented. Nit: bad entries dropped silently.",
            "sub-craft": "Clear names, small helper, self-tests as a named data table. The sort comparator and in-place extension are uncommented relative to the rest.",
            "sub-reasoning": "Real alternatives weighed (adjacency interpretation, error policy) with honest limitations; one slightly confused justification for the adjacency choice."
          }
        },
        "writing-02-registers": {
          objective: { "obj-1": 10, "obj-2": 10, "obj-3": 10, "obj-4": 10 },
          subjective: { "sub-quality": 8, "sub-craft": 3, "sub-reasoning": 7 },
          note: "Facts intact, registers distinct, 16-word summary; but Formal (88w) and Friendly (70w) are longer than the 67-word original.",
          comments: {
            "obj-1": "All three headings present, in order.",
            "obj-2": "Cause, March 3, April 14, and the 15% discount verified in every version.",
            "obj-3": "16 words, one sentence.",
            "obj-4": "Core facts unaltered; 'during integration testing' judged paraphrase-level, not an invented fact.",
            "sub-quality": "Deliberate pivot, not a synonym swap — the discount is reframed per audience. Formal opener is form-letter boilerplate.",
            "sub-craft": "Original is 67 words; Formal is 88 and Friendly 70 — both longer, not tighter. Only the 16-word summary meets the bar.",
            "sub-reasoning": "Concrete per-audience tone choices and named cuts; never examines Formal/Friendly length — the entry's main blind spot."
          }
        },
        "game-02-card-ruleset": {
          objective: { "obj-1": 10, "obj-2": 10, "obj-3": 10, "obj-4": 10 },
          subjective: { "sub-quality": 5, "sub-craft": 4, "sub-reasoning": 6 },
          note: "782 words, correct example math; but odd 51-card economy makes the end condition unreachable, and loser-leads / first-to-21 rules are vestigial.",
          comments: {
            "obj-1": "Overview, Setup, Turn structure, Winning, and Example round all present.",
            "obj-2": "No jokers, tokens, or writing required; scoring by captured piles.",
            "obj-3": "Mara and Theo, specific cards, three full clashes; the point math (65) checks out.",
            "obj-4": "782 words by wc -w.",
            "sub-quality": "Real blind-commit decision and tie-pot escalation, but most clashes approach matching-pennies guessing; loser-leads and first-to-21 are strategically vestigial.",
            "sub-craft": "Covers tie chains, safety valve, and tiebreaks — but 51 playable cards is odd while clashes consume two, so the stated end condition is unreachable.",
            "sub-reasoning": "Names influences and the degenerate strategy designed against; leaves an unedited self-correction in the text and claims 'no ambiguity' while the endgame hole went unnoticed."
          }
        }
      }
    }
  }
};
