function validate(addr) {
  if (typeof addr !== 'string') return false;
  var parts = addr.split('.');
  if (parts.length !== 4) return false;
  for (var i = 0; i < 4; i++) {
    var seg = parts[i];
    if (seg.length === 0) return false;
    if (seg.length > 1 && seg[0] === '0') return false;
    for (var j = 0; j < seg.length; j++) {
      if (seg[j] < '0' || seg[j] > '9') return false;
    }
    var num = parseInt(seg, 10);
    if (num < 0 || num > 255) return false;
  }
  return true;
}

module.exports = { validate };

var CORPUS = [
  "0.0.0.0", "255.255.255.255", "1.2.3.4", "192.168.0.1", "8.8.8.8",
  "10.0.0.255", "127.0.0.1", "172.16.254.1", "100.64.0.0", "203.0.113.9",
  "256.0.0.1", "1.2.3.256", "1.2.3.400", "999.999.999.999",
  "01.2.3.4", "1.2.3.04", "00.0.0.0",
  "192.168.0.1 ", " 1.2.3.4", "1.2.3.4.", "1.2.3", "1.2.3.4.5",
  "1..3.4", "1.2.3.4a", "1.2.3.-1",
];

for (var i = 0; i < CORPUS.length; i++) {
  var result = validate(CORPUS[i]);
  console.log(CORPUS[i] + ' ' + (result ? 'MATCH' : 'REJECT'));
}
