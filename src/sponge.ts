/**
 * Consumes all input from `stdin`, and writes it to `stdout`.
 */
export async function sponge(): Promise<void>;
/**
 * Consumes all input from `stdin`, and writes it to the specified output file.
 * @param outfile The file to write to.
 * @param append Whether to append to the output file instead of overwriting it.
 */
export async function sponge(outfile: string, append: boolean): Promise<void>;
export async function sponge(outfile?: string, append = false): Promise<void> {
  const tempfile = await Deno.makeTempFile({
    prefix: "sponge-",
    suffix: ".tmp",
  });
  if (append) {
    if (typeof outfile === "undefined") {
      throw new Error("outfile is required when appending");
    }
    await Deno.copyFile(outfile, tempfile);
  }
  {
    using writer = await Deno.open(tempfile, {
      write: true,
      append,
      create: true,
    });
    for await (const chunk of Deno.stdin.readable) {
      await writer.write(chunk);
    }
  }
  if (typeof outfile === "string") {
    await Deno.rename(tempfile, outfile);
  } else {
    using infile = await Deno.open(tempfile, { read: true });
    for await (const chunk of infile.readable) {
      await Deno.stdout.write(chunk);
    }
  }
}
