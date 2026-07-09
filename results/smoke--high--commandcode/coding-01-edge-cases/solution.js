// mergeRanges: merge overlapping/adjacent [start,end] integer pairs.
// Handles unsorted, overlapping, adjacent, inverted (start>end), duplicated,
// empty input. Returns a NEW array of merged, non-overlapping ranges sorted
// ascending. Adjacent ranges merge: [1,2] + [2,3] -> [1,3]. Inverted pairs
// are normalized by swapping. Entries that are not two-integer arrays throw
// (rejected rather than silently coerced).

function mergeRanges(ranges) {
  if (!Array.isArray(ranges)) throw new Error('mergeRanges expects an array');
  if (ranges.length === 0) return [];
  const norm = [];
  for (const r of ranges) {
    if (!Array.isArray(r) || r.length !== 2 ||
        typeof r[0] !== 'number' || typeof r[1] !== 'number' ||
        !Number.isInteger(r[0]) || !Number.isInteger(r[1])) {
      throw new Error('each entry must be a two-integer array: ' + JSON.stringify(r));
    }
    const lo = Math.min(r[0], r[1]);
    const hi = Math.max(r[0], r[1]);
    norm.push([lo, hi]);
  }
  norm.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const out = [norm[0].slice()];
  for (let i = 1; i < norm.length; i++) {
    const [lo, hi] = norm[i];
    const last = out[out.length - 1];
    if (lo <= last[1]) {
      // overlapping or adjacent -> merge (extends upward, never mutates input)
      if (hi > last[1]) last[1] = hi;
    } else {
      out.push([lo, hi]);
    }
  }
  return out;
}

// ---- self-tests ----
function assert(cond, msg) {
  console.log((cond ? 'PASS' : 'FAIL') + ' ' + msg);
  if (!cond) process.exitCode = 1;
}

assert(JSON.stringify(mergeRanges([])) === '[]', 'empty input -> []');
assert(JSON.stringify(mergeRanges([[5, 9]])) === '[[5,9]]', 'single range');
assert(JSON.stringify(mergeRanges([[1, 2], [2, 3]])) === '[[1,3]]', 'adjacency merges');
assert(JSON.stringify(mergeRanges([[3, 1]])) === '[[1,3]]', 'inverted pair normalized');
assert(JSON.stringify(mergeRanges([[1, 4], [2, 3]])) === '[[1,4]]', 'overlap nested');
assert(JSON.stringify(mergeRanges([[1, 3], [5, 7], [2, 4]])) === '[[1,4],[5,7]]', 'unsorted + overlap + gap');
assert(JSON.stringify(mergeRanges([[1, 2], [1, 2]])) === '[[1,2]]', 'duplicates collapsed');
try { mergeRanges([[1, 2, 3]]); assert(false, 'rejects non-2-int entry'); }
catch (e) { assert(true, 'rejects non-2-int entry'); }
