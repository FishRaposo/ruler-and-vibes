function validate(addr) {
  if (typeof addr !== 'string') return false;
  const parts = addr.split('.');
  if (parts.length !== 4) return false;
  for (const part of parts) {
    if (part === '') return false;
    if (part.length > 1 && part[0] === '0') return false;
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) return false;
  }
  return true;
}

const CORPUS = [
  "0.0.0.0",
  "255.255.255.255",
  "1.2.3.4",
  "192.168.0.1",
  "8.8.8.8",
  "10.0.0.255",
  "127.0.0.1",
  "172.16.254.1",
  "100.64.0.0",
  "203.0.113.9",
  "256.0.0.1",
  "1.2.3.256",
  "1.2.3.400",
  "999.999.999.999",
  "01.2.3.4",
  "1.2.3.04",
  "00.0.0.0",
  "192.168.0.1 ",
  " 1.2.3.4",
  "1.2.3.4.",
  "1.2.3",
  "1.2.3.4.5",
  "1..3.4",
  "1.2.3.4a",
  "1.2.3.-1",
];

for (const addr of CORPUS) {
  console.log(addr + ' ' + (validate(addr) ? 'MATCH' : 'REJECT'));
}

module.exports = { validate };
