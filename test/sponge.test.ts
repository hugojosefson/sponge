import { assertEquals } from "@std/assert/assert-equals";
import type { Reader } from "@std/io";
import { describe, it } from "@std/testing/bdd";
import { sponge } from "../src/sponge.ts";
import { createPseudoRandomBytes } from "./create-pseudo-random-bytes.ts";
import { Uint8ArrayReader } from "./uint8array-reader.ts";
import { Uint8ArrayWriter } from "./uint8array-writer.ts";

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
});
