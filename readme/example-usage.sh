#!/usr/bin/env bash
cat file.txt |
sed -e 's/foo/bar/' |
deno run --allow-write=file.txt jsr:@moreutils/sponge file.txt
