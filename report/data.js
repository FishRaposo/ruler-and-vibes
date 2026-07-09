window.BENCH_DATA = {
  "updated": "2026-07-09",
  "runs": {
    "smoke--high--commandcode": {
      "model": "commandcode (smoke)",
      "effort": "high",
      "harness": "commandcode",
      "date": "2026-07-09",
      "judgedBy": "commandcode-judge",
      "judgedOn": "2026-07-09",
      "tests": {
        "coding-01-edge-cases": {
          "objective": { "obj-1": 10, "obj-2": 10, "obj-3": 10, "obj-4": 10 },
          "subjective": { "sub-quality": 9, "sub-craft": 9, "sub-reasoning": 8 },
          "note": "Correct merge across all edge cases; clean, no-dependency implementation.",
          "comments": {
            "obj-1": "Ran it: all 8 self-tests print PASS.",
            "obj-2": "Verified empty [] and single [5,9] return correctly; runner's own tests cover these.",
            "obj-3": "Independent re-check: [-5,-2]+[-3,0]->[-5,0], [1,2]+[2,3]+[3,4]->[1,4]; adjacency merges.",
            "obj-4": "solution.js is 42 lines, single file, no requires/imports.",
            "sub-quality": "Sort-then-single-pass merge is the clean baseline; throws on malformed entries rather than coercing.",
            "sub-craft": "Clear naming (norm/lo/hi/last); no cleverness; REASONING.md documents the decision.",
            "sub-reasoning": "REASONING.md states the throw-on-malformed choice and the <= adjacency rule; honest about limitations."
          },
          "reasoning": {
            "approach": "Normalize then sort then single-pass fold, extending the last interval on overlap/adjacency.",
            "decisions": "Chose to throw on non-two-integer entries to surface bad data instead of coercing it.",
            "limitations": "Acknowledges input is sorted (O(n log n)); fine for stated scale, streaming variant not needed."
          }
        }
      }
    }
  }
};
