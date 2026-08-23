#!/bin/sh
# Rig installer. Resolves either --version <tag> or the "latest" release tag,
# downloads the release tarball to a temp directory, then runs the local
# bootstrap. Never pipes remote bytes directly into a shell.

set -eu

REPO="${RIG_REPO:-qaynel/Rig}"
VERSION="latest"
TARGET_DIR="${PWD}"

usage() {
  cat <<'EOF'
Usage: install.sh [--version <tag>] [--target <path>]

Resolves the requested release tag (or "latest") from GitHub, downloads the
released tarball locally, and runs the bundled bootstrap. The remote payload
is written to disk before any script executes.

Options:
  --version <tag>   Install a specific release (default: latest)
  --target <path>   Repository to install into (default: current directory)
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

TAG="$(resolve_tag)"
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
curl -fsSL "$URL" -o "$TARBALL"

# Bytes are on disk; extract and execute the local bootstrap.
mkdir "$EXTRACT_DIR"
tar -xzf "$TARBALL" -C "$EXTRACT_DIR"
set -- "$EXTRACT_DIR"/*
if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  echo "install.sh: release ${TAG} must contain exactly one root directory" >&2
  exit 1
fi
SRC_DIR=$1

if [ ! -x "${SRC_DIR}/rig/bootstrap.sh" ]; then
  echo "install.sh: bootstrap.sh missing from downloaded release ${TAG}" >&2
  exit 1
fi

RIG_RELEASE_TAG="$TAG" exec "${SRC_DIR}/rig/bootstrap.sh" --target "$TARGET_DIR" --with-runtime
