import type { Writer } from "@std/io";

/**
 * A {@link Writer} that writes to a {@link Uint8Array}.
 * It will start writing to the start of the array, then appending as it goes, and grow the array if necessary.
 * After the writer is closed, the array is available as the `output` property.
 */
export class Uint8ArrayWriter implements Writer, Disposable, AsyncDisposable {
  #chunks: Uint8Array[] = [];
  #closed = false;
  #output: Uint8Array | undefined;

  get output(): Uint8Array {
    if (!this.#closed) {
      throw new Error("Writer is not closed");
    }
    if (this.#output) {
      return this.#output;
    }

    const size = this.#chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    this.#output = new Uint8Array(size);
    let offset = 0;
    for (const chunk of this.#chunks) {
      this.#output.set(chunk, offset);
      offset += chunk.length;
    }
    return this.#output;
  }

  write(p: Uint8Array): Promise<number> {
    this.#chunks.push(p);
    return Promise.resolve(p.byteLength);
  }

  [Symbol.dispose](): void {
    this.#closed = true;
  }

  close(): Promise<void> {
    this[Symbol.dispose]();
    return Promise.resolve();
  }

  [Symbol.asyncDispose](): Promise<void> {
    return this.close();
  }
}
