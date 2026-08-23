#!/usr/bin/env sh
# Install Rig Tier 1's fixed markdown payload into a repository.
set -eu

SOURCE_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
TARGET_ROOT=$(pwd)
TIER=
HOSTS=${RIG_HOSTS:-}
HOSTS_EXPLICIT=0
ACTIVE_DELIVERY=0
[ "${RIG_HOSTS+x}" = x ] && HOSTS_EXPLICIT=1

usage() {
  echo "usage: sh rig/bootstrap.sh [--tier 1] [--target REPOSITORY] [--hosts host1,host2] [--with-runtime]" >&2
  echo "  Hosts may also be set via RIG_HOSTS (comma-separated)." >&2
  echo "  Install reads rig/manifest.json through rig/lib/payload.js and requires 'node' on PATH." >&2
  exit 2
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --tier)
      [ "$#" -ge 2 ] || usage
      TIER=$2
      shift 2
      ;;
    --target)
      [ "$#" -ge 2 ] || usage
      TARGET_ROOT=$2
      shift 2
      ;;
    --hosts)
      [ "$#" -ge 2 ] || usage
      HOSTS=$2
      HOSTS_EXPLICIT=1
      shift 2
      ;;
    --with-runtime)
      ACTIVE_DELIVERY=1
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$TIER" ] && [ -t 0 ]; then
  printf 'Select Rig tier [1]: '
  read -r TIER
fi
TIER=${TIER:-1}
[ "$TIER" = 1 ] || { echo "rig: only Tier 1 is available" >&2; exit 1; }
[ -d "$TARGET_ROOT" ] || { echo "rig: target is not a directory: $TARGET_ROOT" >&2; exit 1; }
TARGET_ROOT=$(CDPATH= cd -- "$TARGET_ROOT" && pwd)
[ "$SOURCE_ROOT" != "$TARGET_ROOT" ] || { echo "rig: target must differ from the Rig checkout: $SOURCE_ROOT" >&2; exit 1; }

command -v node >/dev/null 2>&1 || {
  echo "rig: bootstrap needs 'node' on PATH to read rig/manifest.json." >&2
  exit 1
}

if [ "$HOSTS_EXPLICIT" = 1 ]; then
  echo "Installing Rig Tier 1 into $TARGET_ROOT (hosts: $HOSTS)"
else
  echo "Installing Rig Tier 1 into $TARGET_ROOT"
fi

HOSTS="$HOSTS" HOSTS_EXPLICIT="$HOSTS_EXPLICIT" ACTIVE_DELIVERY="$ACTIVE_DELIVERY" RIG_RELEASE_TAG="${RIG_RELEASE_TAG:-}" TARGET_ROOT="$TARGET_ROOT" SOURCE_ROOT="$SOURCE_ROOT" node <<'EOF'
const { runPayload } = require(require('node:path').join(process.env.SOURCE_ROOT, 'rig', 'lib', 'payload'));
const hosts = process.env.HOSTS_EXPLICIT === '1'
  ? process.env.HOSTS.split(',').map((h) => h.trim()).filter(Boolean)
  : undefined;
let result;
try {
  result = runPayload(process.env.TARGET_ROOT, hosts, {
    releaseTag: process.env.RIG_RELEASE_TAG || undefined,
    activeDelivery: process.env.ACTIVE_DELIVERY === '1',
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
if (!result.hosts.length) console.log('  host: none detected');
for (const host of result.hosts) {
  const markers = host.marker_paths.length ? `: ${host.marker_paths.join(', ')}` : '';
  console.log(`  host: ${host.id} (${host.provenance}${markers})`);
}
console.log(`  writes: ${result.writes} (recorded in .rig/install-manifest.jsonl)`);
EOF
if [ "$HOSTS_EXPLICIT" = 1 ]; then
  echo "Rig Tier 1 installed for selected hosts via payload.js."
else
  echo "Rig Tier 1 installed for detected hosts via payload.js."
fi
