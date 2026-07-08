function mergeRanges(ranges) {
  if (!Array.isArray(ranges)) { return []; }
  const cleaned = [];
  for (const r of ranges) {
    if (!Array.isArray(r) || r.length !== 2 || typeof r[0] !== 'number' || typeof r[1] !== 'number' || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) {
      continue;
    }
    const start = Math.min(r[0], r[1]);
    const end = Math.max(r[0], r[1]);
    cleaned.push([start, end]);
  }
  if (cleaned.length === 0) { return []; }
  cleaned.sort((a, b) => a[0] - b[0]);
  const merged = [cleaned[0]];
  for (let i = 1; i < cleaned.length; i++) {
    const last = merged[merged.length - 1];
    const curr = cleaned[i];
    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

function test(name, input, expected) {
  const result = mergeRanges(input);
  const ok = JSON.stringify(result) === JSON.stringify(expected);
  console.log(ok ? 'PASS' : 'FAIL', '-', name);
}

test('empty input', [], []);
test('single range', [[3, 7]], [[3, 7]]);
test('adjacency', [[1, 2], [2, 3]], [[1, 3]]);
test('inverted pair', [[5, 1]], [[1, 5]]);
test('unsorted overlapping', [[5, 10], [1, 3], [2, 6]], [[1, 10]]);
test('duplicates', [[1, 4], [1, 4]], [[1, 4]]);

module.exports = { mergeRanges };
