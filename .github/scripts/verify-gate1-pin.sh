#!/usr/bin/env bash
# Independent Gate 1 verification for CI.
#
# This script deliberately uses NOTHING from the repository it is checking —
# no node, no scripts/check-advanced-spec.js, no repo helpers. It re-derives the
# whole gate with system binaries (sha256sum, ssh-keygen, awk) only.
#
# That is the entire point. The repository's own verifier is a file inside the
# repository, so an agent with write access can edit it to pass. An auditor that
# the audited party can rewrite is not an auditor. This runs from the base
# branch, against the candidate's data files, and answers to a secret the
# candidate cannot read.
#
# Usage: GATE1_EXPECTED_FINGERPRINT=SHA256:... verify-gate1-pin.sh [repo-root]

set -euo pipefail

REPO="${1:-.}"
: "${GATE1_EXPECTED_FINGERPRINT:?GATE1_EXPECTED_FINGERPRINT is not set (repository secret GATE1_FINGERPRINT)}"

GATE="$REPO/wiki/gate1"
ALLOWED="$GATE/gate1.allowed-signers"
SIG="$GATE/gate1.sig"
MANIFEST="$GATE/testing-infrastructure.manifest"
BUSINESS="$GATE/business-spec.md"
ACCEPTANCE="$GATE/acceptance.md"

fail() { echo "gate1-pin: $*" >&2; exit 1; }

for required in "$ALLOWED" "$SIG" "$MANIFEST" "$BUSINESS" "$ACCEPTANCE"; do
  [ -f "$required" ] || fail "missing required oracle file: ${required#"$REPO/"}"
done

# 1 — exactly one principal. A second signer must never be tried as an
#     alternative; the pin is one key, not a register.
principals=()
while IFS= read -r line; do principals+=("$line"); done < <(
  grep -v '^[[:space:]]*#' "$ALLOWED" | grep -v '^[[:space:]]*$' || true
)
[ "${#principals[@]}" -eq 1 ] \
  || fail "expected exactly one principal in gate1.allowed-signers, found ${#principals[@]}"

# 2 — the pinned key is the owner's key, per a secret the agent cannot read or
#     write. This is the anchor: everything else lives in the repo, this does not.
keyfields=$(awk '{for (i = 1; i <= NF; i++) if ($i ~ /^(ssh-|ecdsa-|sk-)/) { print $i " " $(i + 1); exit }}' <<<"${principals[0]}")
[ -n "$keyfields" ] || fail "no public key found on the principal line"
actual=$(ssh-keygen -lf - <<<"$keyfields" | awk '{print $2}')
if [ "$actual" != "$GATE1_EXPECTED_FINGERPRINT" ]; then
  fail "$(printf 'the signing key is not the pinned owner key\n  expected %s\n  found    %s\nAn agent cannot sign as the owner, so this is either a genuine owner key rotation (update the GATE1_FINGERPRINT secret) or a forged gate.' \
    "$GATE1_EXPECTED_FINGERPRINT" "$actual")"
fi

# 3 — every frozen oracle file still hashes to its signed digest. Without this,
#     the key could stay genuine while the frozen tests underneath it changed.
#     The manifest is already in `sha256sum -c` format.
( cd "$REPO" && sha256sum -c --quiet "wiki/gate1/testing-infrastructure.manifest" ) \
  || fail "a frozen oracle file no longer matches the signed manifest"

# 4 — the signature verifies over the oracle message recomputed here, not over
#     one the repository reports. Message format is rig-oracle-freeze-v2.
sha() { sha256sum "$1" | awk '{print $1}'; }
principal=$(awk '{print $1}' <<<"${principals[0]}" | cut -d, -f1)
printf 'rig-oracle-freeze-v2\nbusiness-spec.md %s\nacceptance.md %s\ntesting-infrastructure.manifest %s\n' \
  "$(sha "$BUSINESS")" "$(sha "$ACCEPTANCE")" "$(sha "$MANIFEST")" \
  | ssh-keygen -Y verify -f "$ALLOWED" -I "$principal" -n rig-gate1 -s "$SIG" >/dev/null 2>&1 \
  || fail "the signature does not verify over the current oracle — the frozen contract was edited without a re-sign"

echo "gate1-pin: OK — principal=$principal fingerprint=$actual"
