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

When policy denies an action but you need it to run once, create an approval bound to the exact action:

```bash
# Define the action (shell command, web request, or MCP call)
cat > /tmp/action.json <<'EOF'
{
  "surface": "shell",
  "category": "credential_read",
  "argv": ["printenv", "DATABASE_TOKEN"],
  "cwd": "/path/to/repo"
}
EOF

# Grant a one-time approval
node rig/bin/grant-approval /path/to/repo /tmp/action.json
```

The approval is stored clone-locally, bound to every detail of the action, and consumed on first use. If the command, arguments, or working directory change, the approval is invalid.

### Via CLI

```bash
rig policy grant-approval \
  --target /path/to/repo \
  --action /tmp/action.json \
  --out /tmp/approval.json
```

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
