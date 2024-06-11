import type { Reader } from "@std/io";

/**
 * A {@link Reader} that reads from a {@link Uint8Array}.
 */
export class Uint8ArrayReader implements Reader {
  constructor(private input: Uint8Array) {
  }

  read(p: Uint8Array): Promise<number | null> {
    const isDone = this.input.length === 0;
    if (isDone) {
      return Promise.resolve(null);
    }
    const n = Math.min(p.length, this.input.length);
    p.set(this.input.subarray(0, n));
    this.input = this.input.subarray(n);
    return Promise.resolve(n);
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}
