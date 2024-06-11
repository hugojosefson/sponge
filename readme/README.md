# sponge

Reimplementation of `sponge(1)` from
[moreutils](https://joeyh.name/code/moreutils/), for Deno.

[![JSR](https://jsr.io/badges/@moreutils/sponge)](https://jsr.io/@moreutils/sponge)
[![CI](https://github.com/hugojosefson/sponge/actions/workflows/deno.yaml/badge.svg)](https://github.com/hugojosefson/sponge/actions/workflows/deno.yaml)

## Requirements

Requires [Deno](https://deno.land/) v1.44.1 or later.

## Usage

### Soak up stdin, write to stdout

```sh
deno run jsr:@moreutils/sponge
```

### Soak up stdin, write to a file

```sh
deno run --allow-write=file.txt jsr:@moreutils/sponge file.txt
```

### Soak up stdin, append to a file

```sh
deno run --allow-write=file.txt jsr:@moreutils/sponge -a file.txt
```

## Example usage

Given a file `file.txt` with the following contents:

```
@@include(./file.txt)
```

Running this command, will replace its contents with the same, piped through
`sed`:

```sh
"@@include(./example-usage.sh)";
```
