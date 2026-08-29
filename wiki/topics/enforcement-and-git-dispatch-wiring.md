# Enforcement and Git-Dispatch Wiring

## What was wired (2026-08-24)

**enforcement.js** and **git-dispatch.js** were previously designed in Gate 2 but unwired. Both are now integrated into the CLI and product surface.

### enforcement.js → One-time approvals

When a policy denies an action, users can grant an exact, one-time approval bound to all action parameters:

```bash
# Deny shell access by default, but grant one approval for a specific command
rig policy grant-approval \
  --target /path/to/repo \
  --action /tmp/action.json \
  --out /tmp/approval.json
```

**How it works:**
- Action digest binds: command, arguments, working directory, file digests
- Consumed atomically on dispatch (one-use only)
- Changed action (even one argument) = digest mismatch = denied
- Stored clone-locally, not persisted across repos or sessions

**Use cases:**
- Agent needs to read an environment variable policy denies
- Specific operation requires temporary escalation
- Auditable, non-persistent grant to do exactly this thing, once

### git-dispatch.js → Pre-commit validation

Scan staged harness files (AGENTS.md, CLAUDE.md, `.claude/`, etc.) for secrets and suspicious directives:

```bash
# As a pre-commit hook
rig validate-commit --target /path/to/repo

# With policy controls
rig validate-commit \
  --target /path/to/repo \
  --policy /path/to/policy.json
```

**Detects:**
- Secret-shaped values (API keys, SSH private keys, AWS credentials)
- Suspicious directives ("ignore safety", "exfiltrate")

**Use cases:**
- Pre-push validation before publicizing repo
- CI gate to prevent credentials from being committed
- Git hook to catch mistakes before staging

## Architecture

| Component | Entry point | Storage | Authority |
|-----------|------------|---------|-----------|
| enforcement | `rig policy grant-approval` CLI | `.rig/approvals/` (clone-local) | Action digest |
| git-dispatch | `rig validate-commit` CLI | None (scan-only) | Policy controls |

Both are:
- Deterministic (no side effects except write)
- Testable (pure functions with defined schemas)
- Scriptable (JSON in/out, exit codes)
- Wired to the advanced CLI (`rig/lib/cli-advanced.js`)

## Testing

- `npm test` passes all 380+ acceptance cases
- One-time approval lifecycle and replay protection covered
- Commit validation (secrets, directives) covered
- Both integrated into Hermes plugin surface (`plugin.yaml`, `SKILL.md`)

## Next

The capabilities are wired and callable, but not yet integrated into the approval-request flow when an agent encounters a denied action. That wiring (§8.6 action evaluator → runtime) remains open as a future feature.
