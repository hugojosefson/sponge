import {
  type Closer,
  readAll,
  type Reader,
  writeAll,
  type Writer,
} from "@std/io";

/**
 * Sponges the input data into the output.
 * @param output The output writer or path. If a string or URL is provided, it will be opened. If `undefined`, defaults to `Deno.stdout`.
 * @param append Whether to append to the output. If `true`, the output will be appended to the end of the file. Otherwise, the output file will be overwritten.
 * @param input The input reader. Defaults to `Deno.stdin`.
 * @returns A promise that resolves when the sponging is complete.
 */
export async function sponge(
  output: Writer | (Writer & Closer) | string | URL = Deno.stdout,
  append = false,
  input: Reader = Deno.stdin,
): Promise<void> {
  const data: Uint8Array = await readAll(input);
  const writer: Writer | (Writer & Closer) = await resolveOutput(
    output,
    append,
  );
  await writeAll(writer, data);
  if ("close" in writer) {
    writer.close();
  }
}

/**
 * Type-guard for {@link string} | {@link URL}.
 * @param value The value to check.
 * @returns `true` if the value is a string or URL, `false` otherwise.
 */
function isStringOrURL(value: unknown): value is string | URL {
  return typeof value === "string" || value instanceof URL;
}

/**
 * Resolves the output writer.
 * @param output The output writer or path.
 * @param append Whether to append to the output.
 * @returns The resolved output writer.
 */
async function resolveOutput(
  output: Writer | (Writer & Closer) | string | URL,
  append: boolean,
): Promise<Writer | (Writer & Closer)> {
  if (isStringOrURL(output)) {
    return await Deno.open(output, { write: true, append, truncate: !append });
  }
  return output;
}
