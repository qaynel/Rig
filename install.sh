#!/bin/sh
# Rig installer. Resolves either --version <tag> or the "latest" release tag,
# downloads the release tarball to a temp directory, then runs the local
# bootstrap. Never pipes remote bytes directly into a shell.

set -eu

REPO="${RIG_REPO:-qaynel/Rig}"
VERSION="latest"
TARGET_DIR="${PWD}"
OPENCLAW_MCP=0
HOSTS=
HOSTS_EXPLICIT=0
CANDIDATE_ARTIFACT=
CANDIDATE_URL=
CANDIDATE_SHA=
CANDIDATE_DIGEST=
CANDIDATE_TREE_DIGEST=

usage() {
  cat <<'EOF'
Usage: install.sh [--version <tag>] [--target <path>] [--hosts <host,...>] [--openclaw-mcp]

Resolves the requested release tag (or "latest") from GitHub, downloads the
released tarball locally, and runs the bundled bootstrap. The remote payload
is written to disk before any script executes.

Options:
  --candidate-artifact <path>  Local exact-commit archive (requires SHA and digest)
  --candidate-url <url>        Download an exact-SHA GitHub archive (requires SHA and digest)
  --candidate-sha <sha>        Full 40-character commit SHA
  --candidate-digest <sha256>  SHA-256 of the archive bytes
  --candidate-tree-digest <sha256>  SHA-256 of the extracted candidate tree
  --version <tag>   Install a specific release (default: latest)
  --target <path>   Repository to install into (default: current directory)
  --hosts <list>    Explicit comma-separated hosts (replaces detection)
  --openclaw-mcp    Register rig-mcp in OpenClaw's global MCP config
  -h, --help        Show this message

Environment:
  RIG_REPO          Override the source repository owner/name.
EOF
}

require_value() {
  case "${2:-}" in
    ''|-*)
      echo "install.sh: $1 requires a value" >&2
      usage >&2
      exit 2
      ;;
  esac
}

while [ $# -gt 0 ]; do
  case "$1" in
    --candidate-artifact|--candidate-url|--candidate-sha|--candidate-digest|--candidate-tree-digest)
      require_value "$1" "${2:-}"
      case "$1" in
        --candidate-artifact) CANDIDATE_ARTIFACT=$2 ;;
        --candidate-url) CANDIDATE_URL=$2 ;;
        --candidate-sha) CANDIDATE_SHA=$2 ;;
        --candidate-digest) CANDIDATE_DIGEST=$2 ;;
        --candidate-tree-digest) CANDIDATE_TREE_DIGEST=$2 ;;
      esac
      shift 2
      ;;
    --version)
      require_value "$1" "${2:-}"
      VERSION="$2"
      shift 2
      ;;
    --target)
      require_value "$1" "${2:-}"
      TARGET_DIR="$2"
      shift 2
      ;;
    --hosts)
      require_value "$1" "${2:-}"
      HOSTS="$2"
      HOSTS_EXPLICIT=1
      shift 2
      ;;
    --openclaw-mcp)
      OPENCLAW_MCP=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "install.sh: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

have() {
  command -v "$1" >/dev/null 2>&1
}

need() {
  have "$1" || {
    echo "install.sh: missing required tool: $1" >&2
    exit 2
  }
}

need curl
need tar
need node

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

resolve_tag() {
  if [ "$VERSION" = "latest" ]; then
    curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" -o "$WORKDIR/latest.json"
    sed -n 's/.*"tag_name":[[:space:]]*"\([^"]*\)".*/\1/p' "$WORKDIR/latest.json" | head -n1
  else
    printf '%s\n' "$VERSION"
  fi
}

if [ -n "$CANDIDATE_ARTIFACT$CANDIDATE_URL$CANDIDATE_SHA$CANDIDATE_DIGEST$CANDIDATE_TREE_DIGEST" ]; then
  need node
  [ -z "$CANDIDATE_ARTIFACT" ] || [ -z "$CANDIDATE_URL" ] || { echo 'install.sh: choose either a candidate artifact or URL' >&2; exit 2; }
  node - "$CANDIDATE_ARTIFACT" "$CANDIDATE_URL" "$CANDIDATE_SHA" "$CANDIDATE_DIGEST" "$CANDIDATE_TREE_DIGEST" <<'NODE'
const fs = require('node:fs');
const crypto = require('node:crypto');
const { gunzipSync } = require('node:zlib');
const { spawnSync } = require('node:child_process');
const [archive, url, sha, digest, treeDigest] = process.argv.slice(2);
if ((!archive && !url) || !/^[a-f0-9]{40}$/.test(sha) || !/^[a-f0-9]{64}$/.test(digest)) {
  console.error('install.sh: candidate requires an archive or URL, full commit SHA and SHA-256 digest'); process.exit(2);
}
if (archive) {
  const bytes = fs.readFileSync(archive);
  if (crypto.createHash('sha256').update(bytes).digest('hex') !== digest) {
    console.error('install.sh: candidate archive digest mismatch'); process.exit(1);
  }
  const commit = spawnSync('git', ['get-tar-commit-id'], { input: gunzipSync(bytes), encoding: 'utf8' });
  if (commit.status !== 0 || commit.stdout.trim() !== sha) {
    console.error('install.sh: candidate archive commit mismatch'); process.exit(1);
  }
} else {
  if (url !== `https://github.com/${process.env.RIG_REPO || 'qaynel/Rig'}/archive/${sha}.tar.gz`) {
    console.error('install.sh: candidate URL must be the exact-SHA GitHub archive'); process.exit(2);
  }
  if (!/^[a-f0-9]{64}$/.test(treeDigest)) {
    console.error('install.sh: exact-SHA URL candidates require an expected extracted-tree digest'); process.exit(2);
  }
}
NODE
  TAG="candidate-${CANDIDATE_SHA}"
else
  TAG="$(resolve_tag)"
fi
if [ -z "$TAG" ]; then
  echo "install.sh: could not resolve release tag" >&2
  exit 1
fi

# Reject shell metacharacters and path traversal in the tag before it is
# interpolated into a URL or a temp path. Tag comes from either --version or
# the GitHub API response, both of which are untrusted for this purpose.
case "$TAG" in
  *[!A-Za-z0-9._-]*|-*|.*|*..*)
    echo "install.sh: refusing unsafe release tag: $TAG" >&2
    exit 1
    ;;
esac

TARBALL="${WORKDIR}/rig-${TAG}.tar.gz"
URL="https://github.com/${REPO}/archive/refs/tags/${TAG}.tar.gz"
EXTRACT_DIR="${WORKDIR}/source"

echo "install.sh: downloading ${TAG} to ${TARBALL}"
if [ -n "$CANDIDATE_ARTIFACT" ]; then
  cp "$CANDIDATE_ARTIFACT" "$TARBALL"
elif [ -n "$CANDIDATE_URL" ]; then
  curl -fsSL "$CANDIDATE_URL" -o "$TARBALL"
else
  curl -fsSL "$URL" -o "$TARBALL"
fi

# Emit downloaded-byte identity for candidate and post-publication evidence.
node - "$TARBALL" "$CANDIDATE_DIGEST" <<'NODE'
const fs = require('node:fs');
const crypto = require('node:crypto');
const digest = crypto.createHash('sha256').update(fs.readFileSync(process.argv[2])).digest('hex');
if (process.argv[3] && digest !== process.argv[3]) {
  console.error('install.sh: candidate archive digest mismatch');
  process.exit(1);
}
console.log(`install.sh: archive-sha256=${digest}`);
NODE

# Bytes are on disk; extract and execute the local bootstrap.
mkdir "$EXTRACT_DIR"
tar -xzf "$TARBALL" -C "$EXTRACT_DIR"
set -- "$EXTRACT_DIR"/*
if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  echo "install.sh: release ${TAG} must contain exactly one root directory" >&2
  exit 1
fi
SRC_DIR=$1

if [ -n "$CANDIDATE_URL" ]; then
  node - "$SRC_DIR" "$CANDIDATE_TREE_DIGEST" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const [root, expected] = process.argv.slice(2);
const files = {};
function walk(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const file = path.join(dir, entry.name);
    const stat = fs.lstatSync(file);
    if (entry.isDirectory()) walk(file, rel);
    else files[rel] = { type: entry.isSymbolicLink() ? 'symlink' : 'file', mode: stat.mode & 0o777,
      digest: crypto.createHash('sha256').update(entry.isSymbolicLink() ? fs.readlinkSync(file) : fs.readFileSync(file)).digest('hex') };
  }
}
walk(root);
const actual = crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))))).digest('hex');
if (actual !== expected) { console.error('install.sh: candidate extracted-tree digest mismatch'); process.exit(1); }
NODE
fi

if [ ! -x "${SRC_DIR}/rig/bootstrap.sh" ]; then
  echo "install.sh: bootstrap.sh missing from downloaded release ${TAG}" >&2
  exit 1
fi

set -- "${SRC_DIR}/rig/bootstrap.sh" --target "$TARGET_DIR" --with-runtime
[ "$HOSTS_EXPLICIT" = 1 ] && set -- "$@" --hosts "$HOSTS"
if [ "$OPENCLAW_MCP" = 1 ]; then
  set -- "$@" --openclaw-mcp
fi
SETUP_MCP="${SETUP_MCP:-0}" RIG_RELEASE_TAG="$TAG" "$@"
