import { parseArgs } from "jsr:@std/cli@0.224/parse-args";
import { sponge } from "./sponge.ts";

async function main() {
  try {
    const args = parseArgs(Deno.args, {
      boolean: ["append"],
      alias: {
        append: "a",
      },
    });
    if (args._.length > 1) {
      console.error("Too many arguments");
      Deno.exit(2);
    }
    const outfile = args._[0];
    if (typeof outfile === "undefined") {
      await sponge();
    } else {
      await sponge(`${outfile}`, args.append);
    }
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
