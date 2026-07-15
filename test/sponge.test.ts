import { assertEquals } from "@std/assert/assert-equals";
import { assertRejects } from "@std/assert/assert-rejects";
import type { Reader } from "@std/io";
import { describe, it } from "@std/testing/bdd";
import { sponge } from "../src/sponge.ts";
import { createPseudoRandomBytes } from "./create-pseudo-random-bytes.ts";
import { Uint8ArrayReader } from "./uint8array-reader.ts";
import { Uint8ArrayWriter } from "./uint8array-writer.ts";

const encoder = new TextEncoder();

function stringReader(value: string): Reader {
  return new Uint8ArrayReader(encoder.encode(value));
}

describe("sponge", () => {
  it("should write nothing from empty Reader", async () => {
    const input = new Uint8Array();
    const reader: Reader = new Uint8ArrayReader(input);
    const writer = new Uint8ArrayWriter();
    await sponge(writer, false, reader);
    assertEquals(writer.output, input);
  });

  it("should write 1 byte from 1 byte Reader", async () => {
    const input = createPseudoRandomBytes(1);
    const reader: Reader = new Uint8ArrayReader(input);
    const writer = new Uint8ArrayWriter();
    await sponge(writer, false, reader);
    assertEquals(writer.output, input);
  });

  it("should write 1024 bytes from 1024 byte Reader", async () => {
    const input = createPseudoRandomBytes(1024);
    const reader: Reader = new Uint8ArrayReader(input);
    const writer = new Uint8ArrayWriter();
    await sponge(writer, false, reader);
    assertEquals(writer.output, input);
  });

  it("should write 1MB from 1MB Reader", async () => {
    const input = createPseudoRandomBytes(1024 * 1024);
    const reader: Reader = new Uint8ArrayReader(input);
    const writer = new Uint8ArrayWriter();
    await sponge(writer, false, reader);
    assertEquals(writer.output, input);
  });

  it("should create a missing output file", async () => {
    const directory = await Deno.makeTempDir({
      dir: ".",
      prefix: ".sponge-test-",
    });
    const output = `${directory}/output.txt`;
    try {
      await sponge(output, false, stringReader("output"));
      assertEquals(await Deno.readTextFile(output), "output");
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  });

  it("should create a missing output file when appending", async () => {
    const directory = await Deno.makeTempDir({
      dir: ".",
      prefix: ".sponge-test-",
    });
    const output = `${directory}/output.txt`;
    try {
      await sponge(output, true, stringReader("output"));
      assertEquals(await Deno.readTextFile(output), "output");
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  });

  it("should truncate an existing output file", async () => {
    const directory = await Deno.makeTempDir({
      dir: ".",
      prefix: ".sponge-test-",
    });
    const output = `${directory}/output.txt`;
    try {
      await Deno.writeTextFile(output, "existing output");
      await sponge(output, false, stringReader("output"));
      assertEquals(await Deno.readTextFile(output), "output");
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  });

  it("should preserve and append to an existing output file", async () => {
    const directory = await Deno.makeTempDir({
      dir: ".",
      prefix: ".sponge-test-",
    });
    const output = `${directory}/output.txt`;
    try {
      await Deno.writeTextFile(output, "existing ");
      await sponge(output, true, stringReader("output"));
      assertEquals(await Deno.readTextFile(output), "existing output");
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  });

  it("should reject a missing output parent directory", async () => {
    const directory = await Deno.makeTempDir({
      dir: ".",
      prefix: ".sponge-test-",
    });
    const output = `${directory}/missing/output.txt`;
    try {
      await assertRejects(
        () => sponge(output, false, stringReader("output")),
        Deno.errors.NotFound,
      );
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  });
});
