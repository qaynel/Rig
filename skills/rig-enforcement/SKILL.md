---
name: rig-enforcement
status: ready
description: >
  Grant one-time approvals for denied actions and validate commits for harness
  safety. Use when an agent needs to perform a normally-denied action exactly
  once, or to scan commits for secrets and policy violations before pushing.
license: MIT
---

# Enforcement and Approval

Rig supports two complementary safety gates: **one-time approvals** for specific denied actions, and **commit validation** to prevent secrets from being staged.

## Grant a one-time approval

When policy denies an action, prepare a proposal bound to its exact repository,
command, inputs and active policy:

```bash
node rig/materialize.js policy grant-proposal \
  --target /path/to/repo --action /tmp/action.json --out /tmp/proposal.json
```

The action JSON names `surface`, a supported policy `category`, and the exact
command or request. The human Gate 1 key holder signs
`actionApprovalMessage(proposal)` from `rig/lib/enforcement.js` using SSHSIG
namespace `rig-action-approval`. The signed approval JSON contains
`method: "external-sshsig"`, the Gate 1 `identity`, and the SSHSIG `signature`.
Agents prepare these inputs but never use the owner's signing key.

Issue the signed one-use grant with either entrypoint:

```bash
node rig/bin/grant-approval /path/to/repo /tmp/action.json \
  /tmp/proposal.json /tmp/signed-approval.json > /tmp/grant.json

node rig/materialize.js policy grant-approval \
  --target /path/to/repo --action /tmp/action.json \
  --proposal /tmp/proposal.json --approval /tmp/signed-approval.json \
  --out /tmp/grant.json
```

The output is the signed grant accepted by `policy evaluate --approval
/tmp/grant.json`. The dispatcher consumes it atomically in clone-local Git
storage before allowing the exact action once. A changed action, input,
policy or repository invalidates the grant; copying the JSON cannot reset it.
Unsigned two-argument grant requests are refused.

## Validate commits for harness safety

Before pushing, scan staged harness files (AGENTS.md, CLAUDE.md, `.claude/`, etc.) for secrets and suspicious directives:

```bash
# Run validation
node rig/bin/validate-commit /path/to/repo

# With a specific policy
node rig/bin/validate-commit /path/to/repo /path/to/policy.json
```

Returns success (exit 0) if clean, failure (exit 1) if secrets or suspicious directives found.

### Via CLI

```bash
rig validate-commit \
  --target /path/to/repo \
  --policy /path/to/policy.json
```

### As a git pre-commit hook

```bash
#!/bin/sh
node "$RIG_DIR/bin/validate-commit" "$PWD" || exit 1
```

## Design

**One-time approvals** use cryptographic action digests. Every field that matters (command, arguments, directory, file hashes) is part of the digest. A changed field = different digest = approval invalid. This prevents silent scope creep and enforces "approve exactly this, once."

**Commit validation** scans staged harness files for:
- Secrets shaped like API keys, SSH private keys, AWS credentials
- Suspicious directives that might bypass safety (e.g., "ignore safety", "exfiltrate")

Both operate deterministically and are suitable for CI gates, pre-commit hooks, and agent safety checks.
