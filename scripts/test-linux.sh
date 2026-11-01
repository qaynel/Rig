#!/usr/bin/env bash
# Run the repository gate in the same Linux container CI uses.
# Usage: scripts/test-linux.sh [command...]   (default: node ci/run-tests.js)
# Local: copies the checkout (full history + uncommitted files) to a scratch
# dir so the container never writes Linux build output into your working tree.
# CI (CI_IN_PLACE=1): the fresh checkout is mounted directly.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
[ "$#" -gt 0 ] || set -- node ci/run-tests.js

docker build -q -t rig-ci -f "$root/ci/Dockerfile" "$root/ci" >/dev/null

work="$root"
if [ "${CI_IN_PLACE:-}" != 1 ]; then
  work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
  git clone -q --no-hardlinks "$root" "$work"
  # Overlay uncommitted work: modified + untracked-not-ignored files; drop deleted ones.
  (cd "$root" && git ls-files -z -m -o --exclude-standard | while IFS= read -r -d '' f; do
    if [ -e "$f" ]; then mkdir -p "$work/$(dirname "$f")"; cp -p "$f" "$work/$f"; else rm -f "$work/$f"; fi
  done)
fi

# --init: a real PID 1 reaps killed children (else they linger as zombies and look alive).
# --privileged: the task sandbox (bubblewrap) needs namespaces Docker blocks by default.
# CI markers are hidden: the suite asserts local-mode output.
docker run --rm --init --privileged -e GITHUB_TOKEN -e GH_TOKEN -e CATALOGUE_SHARD -v "$work":/work rig-ci env -u CI -u GITHUB_ACTIONS "$@"
