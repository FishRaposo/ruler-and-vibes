function mergeRanges(ranges) {
  if (!Array.isArray(ranges)) return [];
  const cleaned = [];
  for (const r of ranges) {
    if (!Array.isArray(r) || r.length < 2 || typeof r[0] !== 'number' || typeof r[1] !== 'number') continue;
    let [a, b] = r;
    if (a > b) [a, b] = [b, a];
    cleaned.push([a, b]);
  }
  if (cleaned.length === 0) return [];
  cleaned.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [cleaned[0].slice()];
  for (let i = 1; i < cleaned.length; i++) {
    const last = merged[merged.length - 1];
    const [s, e] = cleaned[i];
    if (s <= last[1] + 1) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

module.exports = { mergeRanges };

const tests = [
  { input: [], expected: '[]', name: 'empty input' },
  { input: [[3, 5]], expected: '[[3,5]]', name: 'single range' },
  { input: [[1, 2], [2, 3]], expected: '[[1,3]]', name: 'adjacent ranges merge' },
  { input: [[5, 1]], expected: '[[1,5]]', name: 'inverted pair normalizes' },
  { input: [[1, 3], [2, 6], [8, 10]], expected: '[[1,6],[8,10]]', name: 'overlapping' },
  { input: [[4, 4], [4, 4]], expected: '[[4,4]]', name: 'duplicates collapse' },
  { input: 'not an array', expected: '[]', name: 'non-array input' },
  { input: [[1, 2], [4, 5], [6, 7]], expected: '[[1,2],[4,7]]', name: 'adjacent second pair' },
];

for (const t of tests) {
  const result = JSON.stringify(mergeRanges(t.input));
  const pass = result === t.expected;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${t.name}: got ${result}`);
}
