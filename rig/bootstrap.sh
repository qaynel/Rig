#!/usr/bin/env sh
# Install Rig into a repository from the one Rig corpus (projected by rig/lib/project.js).
set -eu

SOURCE_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
TARGET_ROOT=$(pwd)
TIER_FLAG=
TIER_SEEN=0
HOSTS=${RIG_HOSTS:-}
HOSTS_EXPLICIT=0
ACTIVE_DELIVERY=0
OPENCLAW_MCP=0
[ "${RIG_HOSTS+x}" = x ] && HOSTS_EXPLICIT=1

usage() {
  echo "usage: sh rig/bootstrap.sh [--target REPOSITORY] [--hosts host1,host2] [--with-runtime] [--openclaw-mcp]" >&2
  echo "  Hosts may also be set via RIG_HOSTS (comma-separated)." >&2
  echo "  Install projects the Rig corpus (rig/corpus/) through rig/lib/payload.js and requires 'node' on PATH." >&2
  echo "  --tier 1 is accepted for one more release (deprecated, ignored); any other value is rejected." >&2
  exit 2
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --tier)
      [ "$#" -ge 2 ] || usage
      TIER_FLAG=$2
      TIER_SEEN=1
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
    --host)
      [ "$#" -ge 2 ] || usage
      if [ "$HOSTS_EXPLICIT" = 0 ] || [ -z "$HOSTS" ]; then HOSTS=$2; else HOSTS="$HOSTS,$2"; fi
      HOSTS_EXPLICIT=1
      shift 2
      ;;
    --with-runtime)
      ACTIVE_DELIVERY=1
      shift
      ;;
    --openclaw-mcp)
      OPENCLAW_MCP=1
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

if [ "${TIER_SEEN:-0}" = 1 ]; then
  [ "$TIER_FLAG" = 1 ] || { echo "rig: --tier accepts only 1 (the flag is deprecated and will be removed); got '$TIER_FLAG'" >&2; exit 1; }
  echo "rig: --tier is deprecated and has no effect; omit it." >&2
fi
[ -d "$TARGET_ROOT" ] || { echo "rig: target is not a directory: $TARGET_ROOT" >&2; exit 1; }
TARGET_ROOT=$(CDPATH= cd -- "$TARGET_ROOT" && pwd)
[ "$SOURCE_ROOT" != "$TARGET_ROOT" ] || { echo "rig: target must differ from the Rig checkout: $SOURCE_ROOT" >&2; exit 1; }

command -v node >/dev/null 2>&1 || {
  echo "rig: bootstrap needs 'node' on PATH to project the Rig corpus." >&2
  exit 1
}

if [ "$OPENCLAW_MCP" = 1 ]; then
  OPENCLAW_PATH=${OPENCLAW_CONFIG_PATH:-"$HOME/.openclaw/openclaw.json"}
  echo "WARNING: --openclaw-mcp writes global OpenClaw configuration at $OPENCLAW_PATH and affects all OpenClaw workspaces."
  for tool in openclaw node npm; do
    command -v "$tool" >/dev/null 2>&1 || {
      echo "rig: --openclaw-mcp needs '$tool' on PATH." >&2
      exit 1
    }
  done
fi

if [ "$HOSTS_EXPLICIT" = 1 ]; then
  echo "Installing Rig into $TARGET_ROOT (hosts: $HOSTS)"
else
  echo "Installing Rig into $TARGET_ROOT"
fi

HOSTS="$HOSTS" HOSTS_EXPLICIT="$HOSTS_EXPLICIT" ACTIVE_DELIVERY="$ACTIVE_DELIVERY" OPENCLAW_MCP="$OPENCLAW_MCP" SETUP_MCP="${SETUP_MCP:-0}" OPENCLAW_CONFIG_PATH="${OPENCLAW_PATH:-${OPENCLAW_CONFIG_PATH:-}}" RIG_RELEASE_TAG="${RIG_RELEASE_TAG:-}" TARGET_ROOT="$TARGET_ROOT" SOURCE_ROOT="$SOURCE_ROOT" node <<'EOF'
const fs = require('node:fs');
const crypto = require('node:crypto');
const { runPayload, journalWriter } = require(require('node:path').join(process.env.SOURCE_ROOT, 'rig', 'lib', 'payload'));
const { registerOpenClawMcp } = require(require('node:path').join(process.env.SOURCE_ROOT, 'rig', 'lib', 'openclaw-mcp'));
const { setupMcp } = require(require('node:path').join(process.env.SOURCE_ROOT, 'rig', 'lib', 'mcp-dependencies'));
const { MCP_HOSTS } = require(require('node:path').join(process.env.SOURCE_ROOT, 'rig', 'lib', 'mcp-hosts'));
const hosts = process.env.HOSTS_EXPLICIT === '1'
  ? process.env.HOSTS.split(',').map((h) => h.trim()).filter(Boolean)
  : undefined;
const { detectInstall, migrate } = require(require('node:path').join(process.env.SOURCE_ROOT, 'rig', 'lib', 'migrate'));
const MCP_SETUP_PENDING = '.rig/mcp-setup-pending.json';
let result;
let openclaw = null;
function mcpPendingStat() {
  try { return fs.lstatSync(require('node:path').join(process.env.TARGET_ROOT, MCP_SETUP_PENDING)); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function requireOwnedMcpPending(writer) {
  const markerPath = require('node:path').join(process.env.TARGET_ROOT, MCP_SETUP_PENDING);
  const markerBytes = Buffer.from(`${JSON.stringify({ version: 1 })}\n`);
  const pending = writer.latest(MCP_SETUP_PENDING);
  if (pending?.state === 'pending' && pending.operation === 'create_owned' && pending.desired_digest === crypto.createHash('sha256').update(markerBytes).digest('hex')) {
    writer(process.env.TARGET_ROOT, MCP_SETUP_PENDING, markerBytes, undefined, undefined, { exclusiveCreate: true });
  }
  const before = mcpPendingStat();
  if (!before) return null;
  if (!before.isFile() || before.isSymbolicLink()) {
    throw new Error(`rig: refusing unowned or edited ${MCP_SETUP_PENDING}`);
  }
  let fd;
  let liveBytes;
  try {
    fd = fs.openSync(markerPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino) {
      throw new Error(`rig: refusing unowned or edited ${MCP_SETUP_PENDING}`);
    }
    liveBytes = fs.readFileSync(fd);
  } catch (error) {
    if (error.code === 'ELOOP') throw new Error(`rig: refusing unowned or edited ${MCP_SETUP_PENDING}`);
    throw error;
  } finally { if (fd !== undefined) fs.closeSync(fd); }
  const marker = writer.latest(MCP_SETUP_PENDING);
  const markerDigest = crypto.createHash('sha256').update(liveBytes).digest('hex');
  if (marker?.state !== 'applied' || marker.digest !== markerDigest) {
    throw new Error(`rig: refusing unowned or edited ${MCP_SETUP_PENDING}`);
  }
  return markerDigest;
}
function finalizeMcp(writeFile, { mcpConfigured = true, setupRequested = true } = {}) {
  if (setupRequested && process.env.SETUP_MCP === '1' && process.env.OPENCLAW_MCP !== '1' && mcpConfigured) {
    writeFile(process.env.TARGET_ROOT, MCP_SETUP_PENDING, `${JSON.stringify({ version: 1 })}\n`);
    try {
      setupMcp(process.env.TARGET_ROOT, { writeFile });
      writeFile.remove(process.env.TARGET_ROOT, MCP_SETUP_PENDING);
    } catch (error) {
      writeFile.finish();
      throw error;
    }
  }
  if (process.env.OPENCLAW_MCP === '1') {
    openclaw = registerOpenClawMcp(process.env.TARGET_ROOT, { writeFile });
  }
}
// An existing v5 install (or an interrupted migration) is upgraded through the
// journaled, resumable migration, never overwritten in place.
const existing = detectInstall(process.env.TARGET_ROOT);
if (existing.kind === 'current' && mcpPendingStat()) {
  const writer = journalWriter(process.env.TARGET_ROOT);
  try {
    const markerDigest = requireOwnedMcpPending(writer);
    const installedHosts = JSON.parse(fs.readFileSync(require('node:path').join(process.env.TARGET_ROOT, '.rig/release.json'), 'utf8')).hosts;
    const mcpConfigured = Array.isArray(installedHosts) && installedHosts.some((id) => MCP_HOSTS[id]?.emission === 'emitted');
    if (!mcpConfigured) {
      writer.remove(process.env.TARGET_ROOT, MCP_SETUP_PENDING, markerDigest);
      writer.finish();
      process.exit(0);
    }
    setupMcp(process.env.TARGET_ROOT, { writeFile: writer });
    writer.remove(process.env.TARGET_ROOT, MCP_SETUP_PENDING, markerDigest);
    writer.finish();
  } catch (error) {
    writer.finish();
    console.error(error.message);
    process.exit(1);
  }
}
if (existing.kind === 'v5' || existing.kind === 'resume') {
  if (process.env.SETUP_MCP === '1' && process.env.OPENCLAW_MCP !== '1') {
    const migrationHosts = hosts || JSON.parse(fs.readFileSync(require('node:path').join(process.env.TARGET_ROOT, '.rig/release.json'), 'utf8')).hosts;
    const mcpConfigured = Array.isArray(migrationHosts) && migrationHosts.some((id) => MCP_HOSTS[id]?.emission === 'emitted');
    if (mcpConfigured) {
      const writer = journalWriter(process.env.TARGET_ROOT);
      if (!mcpPendingStat()) {
        writer(process.env.TARGET_ROOT, MCP_SETUP_PENDING, `${JSON.stringify({ version: 1 })}\n`, undefined, undefined, { exclusiveCreate: true });
        writer.finish();
      } else {
        try {
          requireOwnedMcpPending(writer);
          writer.finish();
        } catch (error) {
          writer.finish();
          console.error(error.message);
          process.exit(1);
        }
      }
    }
  }
  const report = migrate(process.env.TARGET_ROOT, {
    ...(hosts ? { hosts } : {}),
    releaseTag: process.env.RIG_RELEASE_TAG || undefined,
    ...(process.env.ACTIVE_DELIVERY === '1' ? { delivery: 'active' } : {}),
  });
  if (report.status === 'refused') {
    console.error(`rig: migration refused (${report.code}): ${report.detail}`);
    for (const conflict of report.conflicts || []) console.error(`  ${conflict.path}: ${conflict.reason} - ${conflict.detail}`);
    console.error('  The repository was not changed beyond what the install journal records. Fix the item above and re-run this command.');
    process.exit(1);
  }
  console.log(`  migrated v5 install: ${report.written.length} written, ${report.retired.length} retired, ${report.kept_edited.length} kept (edited), ${report.retained.length} retained (edited orphans)`);
  for (const row of report.retained) console.log(`  retained: ${row.path} (${row.reason})`);
  console.log(`  onboarding state: ${report.onboarding_state.status}`);
  if (report.onboarding_state.status === 'invalidated') console.log('  your selections were preserved; re-run rig-onboarding to propose and approve them against the new bytes');
  try {
    const writer = journalWriter(process.env.TARGET_ROOT);
    const mcpConfigured = report.hosts.some((id) => MCP_HOSTS[id]?.emission === 'emitted');
    finalizeMcp(writer, { mcpConfigured });
    writer.finish();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  if (openclaw) console.log(`  openclaw: registered ${openclaw.name} in ${openclaw.path}`);
  process.exit(0);
}
try {
  result = runPayload(process.env.TARGET_ROOT, hosts, {
    releaseTag: process.env.RIG_RELEASE_TAG || undefined,
    activeDelivery: process.env.ACTIVE_DELIVERY === '1',
    afterPayload: ({ writeFile, hosts: installedHosts }) => {
      const mcpConfigured = installedHosts.some(({ id }) => MCP_HOSTS[id]?.emission === 'emitted');
      // rig: fresh public installs keep npm opt-in; SETUP_MCP is the migration
      // compatibility request, while global setup is explicitly --openclaw-mcp.
      finalizeMcp(writeFile, { mcpConfigured, setupRequested: false });
    },
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
if (openclaw) console.log(`  openclaw: registered ${openclaw.name} in ${openclaw.path}`);
console.log(`  writes: ${result.writes} (recorded in .rig/install-manifest.jsonl)`);
EOF
if [ "$ACTIVE_DELIVERY" = 1 ]; then
  cat <<EOF
Rig runtime workflow:
  cd "$TARGET_ROOT"
  .rig/bin/rig inspect --target "$TARGET_ROOT" --hosts auto --out inspection.json
  .rig/bin/rig host-review --target "$TARGET_ROOT" --inspection inspection.json --out review.json
  .rig/bin/rig recommend --target "$TARGET_ROOT" --review review.json --out menu.json
  .rig/bin/rig select --menu menu.json --out rig.json --service id=grade
  .rig/bin/rig plan --target "$TARGET_ROOT" --manifest rig.json --review review.json --out plan.json
  Approve the exact plan through a host-native attestation or an external signature before apply. Do not create a verified approval file yourself.
  .rig/bin/rig apply --target "$TARGET_ROOT" --manifest rig.json --review review.json --plan plan.json --approval approval.json
  .rig/bin/rig check --target "$TARGET_ROOT"
EOF
fi
echo "Rig is installed. In your host agent, invoke rig-onboarding for this repository."
echo "Nothing is adapted until you approve its onboarding summary."
