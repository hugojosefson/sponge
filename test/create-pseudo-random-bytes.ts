export function createPseudoRandomBytes(n: number): Uint8Array {
  if (n < 0) {
    throw new Error("n must be a positive integer");
  }
  if (n === 0) {
    return new Uint8Array();
  }
  const bytes = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}
