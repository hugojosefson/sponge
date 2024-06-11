#!/usr/bin/env bash
# create and enter a directory for the script
mkdir -p "sponge"
cd       "sponge"

# download+extract the script, into current directory
curl -fsSL "https://github.com/hugojosefson/sponge/tarball/main" \
  | tar -xzv --strip-components=1
