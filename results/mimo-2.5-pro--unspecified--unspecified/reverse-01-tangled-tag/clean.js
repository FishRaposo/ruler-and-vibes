function tag(s) {
  var hash = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    hash = ((hash << 3) + c) ^ (c >> 1);
    hash = hash & 0xFFF;
  }
  return hash + s.length * 7;
}

module.exports = { tag };

var VECTORS = ["", "cab", "lantern", "Zip9", "The quick brown fox"];
for (var i = 0; i < VECTORS.length; i++) {
  console.log(VECTORS[i] + " => " + tag(VECTORS[i]));
}
