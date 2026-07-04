'use strict';

/**
 * mergeRanges(ranges)
 *
 * Input: array of [start, end] integer pairs. Entries may be unsorted,
 * overlapping, adjacent, inverted (start > end), or duplicated, and the
 * input array itself may be empty.
 *
 * Output: a NEW array of merged, non-overlapping [start, end] ranges,
 * sorted ascending by start. Adjacent ranges (e.g. [1,2] and [2,3]) are
 * merged into one ([1,3]) because they share the boundary point 2, so
 * there is no gap between them.
 *
 * Handling of malformed entries (documented policy):
 * - An entry that is not an array, not exactly length 2, or whose two
 *   elements are not both finite integers (typeof 'number', finite,
 *   Math.trunc(x) === x) is INVALID and is silently skipped. This keeps
 *   the function total (never throws) for any array input, which is
 *   friendlier for a merge utility than aborting over one bad record.
 *   If every entry is invalid (or input isn't an array at all, or is
 *   empty), the result is [].
 * - Inverted pairs (start > end) are normalized by swapping, per spec,
 *   rather than treated as invalid.
 */
function mergeRanges(ranges) {
  if (!Array.isArray(ranges)) return [];

  const isFiniteInt = (x) =>
    typeof x === 'number' && Number.isFinite(x) && Math.trunc(x) === x;

  const cleaned = [];
  for (const entry of ranges) {
    if (!Array.isArray(entry) || entry.length !== 2) continue;
    let [a, b] = entry;
    if (!isFiniteInt(a) || !isFiniteInt(b)) continue;
    if (a > b) [a, b] = [b, a];
    cleaned.push([a, b]);
  }

  if (cleaned.length === 0) return [];

  cleaned.sort((x, y) => x[0] - y[0] || x[1] - y[1]);

  const merged = [cleaned[0].slice()];
  for (let i = 1; i < cleaned.length; i++) {
    const [start, end] = cleaned[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      if (end > last[1]) last[1] = end;
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}

module.exports = { mergeRanges };

// Self-test block: run with `node solution.js`
if (require.main === module) {
  const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const cases = [
    { name: 'empty input', input: [], expected: [] },
    { name: 'single range', input: [[5, 10]], expected: [[5, 10]] },
    {
      name: 'adjacency: [1,2] and [2,3] merge into [1,3]',
      input: [[1, 2], [2, 3]],
      expected: [[1, 3]],
    },
    {
      name: 'inverted pair normalized: [10,4] becomes [4,10]',
      input: [[10, 4]],
      expected: [[4, 10]],
    },
    {
      name: 'unsorted, overlapping ranges merge correctly',
      input: [[8, 12], [1, 3], [4, 6], [5, 9]],
      expected: [[1, 3], [4, 12]],
    },
    {
      name: 'duplicated ranges collapse to one',
      input: [[2, 4], [2, 4], [2, 4]],
      expected: [[2, 4]],
    },
    {
      name: 'invalid entries (wrong shape/non-integers) are skipped',
      input: [[1, 2], 'x', [3], [1.5, 2], null, [undefined, 2], [9, 11]],
      expected: [[1, 2], [9, 11]],
    },
    { name: 'non-array input returns empty array', input: null, expected: [] },
    {
      name: 'gap between ranges: [1,2] and [4,5] stay separate (no overlap/touch)',
      input: [[1, 2], [4, 5]],
      expected: [[1, 2], [4, 5]],
    },
    {
      name: 'negative numbers: touching cluster merges, distant one stays apart',
      input: [[-5, -2], [-2, 0], [10, 20]],
      expected: [[-5, 0], [10, 20]],
    },
  ];

  let failures = 0;
  for (const { name, input, expected } of cases) {
    const actual = mergeRanges(input);
    const ok = deepEqual(actual, expected);
    if (!ok) failures++;
    console.log(
      `${ok ? 'PASS' : 'FAIL'} - ${name} - got: ${JSON.stringify(actual)}` +
        (ok ? '' : ` - expected: ${JSON.stringify(expected)}`)
    );
  }

  console.log(`\n${cases.length - failures}/${cases.length} cases passed.`);
  process.exitCode = failures === 0 ? 0 : 1;
}
