#!/usr/bin/env bash
# Migration: v1.17.0.0 — Wire existing brain-sync repos as brain federated sources
#
# Pre-1.17.0.0 /setup-brain wrote ~/.rig/consumers.json with a placeholder
# `status: "pending"` and an empty `ingest_url`, expecting a brain HTTP
# /ingest-repo endpoint that never shipped. This migration runs the real
# wireup (brain sources add + worktree + initial sync) for users who
# already opted into brain-sync but never got the brain side connected.
#
# Idempotent: safe to re-run. Skips when:
#   - User never opted into brain-sync (brain_sync_mode = off or unset)
#   - No ~/.rig/.git (brain-init never ran)
#   - The wireup helper is missing on disk (broken install — defensive)
#
# Failure mode: invokes the helper WITHOUT --strict, so a missing/old brain
# CLI is a benign skip rather than blocking the rest of /rig-upgrade.
set -euo pipefail

if [ -z "${HOME:-}" ]; then
  echo "  [v1.17.0.0] HOME is unset or empty — skipping migration." >&2
  exit 0
fi

SKILLS_DIR="${HOME}/.claude/skills"
BIN_DIR="${SKILLS_DIR}/rig/bin"
CONFIG_BIN="${BIN_DIR}/rig-config"
WIREUP_BIN="${BIN_DIR}/rig-brain-source-wireup"

# Skip if user never opted into brain-sync.
SYNC_MODE=""
if [ -x "$CONFIG_BIN" ]; then
  # Trim whitespace defensively: rig-config can emit trailing newlines,
  # which would mis-classify "off\n" as a non-empty non-off mode.
  SYNC_MODE=$("$CONFIG_BIN" get brain_sync_mode 2>/dev/null | tr -d '[:space:]' || echo "")
fi
if [ "$SYNC_MODE" = "off" ] || [ -z "$SYNC_MODE" ]; then
  exit 0
fi

# Skip if no brain-sync git repo exists.
if [ ! -d "${HOME}/.rig/.git" ]; then
  exit 0
fi

# Skip if helper missing (defensive — should always be present post-upgrade).
if [ ! -x "$WIREUP_BIN" ]; then
  echo "  [v1.17.0.0] $WIREUP_BIN missing or non-executable — skipping wireup." >&2
  exit 0
fi

echo "  [v1.17.0.0] Wiring brain-sync repo into brain (federated source + initial sync)..."

# No --strict: missing/old brain is a benign skip during a batch upgrade.
"$WIREUP_BIN" || {
  echo "  [v1.17.0.0] Wireup exited non-zero — re-run manually with: $WIREUP_BIN" >&2
}
