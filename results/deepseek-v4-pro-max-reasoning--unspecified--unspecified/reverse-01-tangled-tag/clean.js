function tag(s) {
  let t = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    t = ((t << 3) + c) ^ (c >> 1);
    t = t & 0xFFF;
  }
  return t + (s.length * 7);
}

const VECTORS = ["", "cab", "lantern", "Zip9", "The quick brown fox"];
for (const v of VECTORS) {
  console.log(v + " => " + tag(v));
}

module.exports = { tag };
