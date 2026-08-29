# User-global writes

## What it is

Where a vendor offers only a user-global configuration surface, Rig may append
or namespaced-merge outside the repository. Every entry is attributed from the
first install to a generated clone-local install identity, and uninstall removes
only entries belonging to that identity. [Gate 2 §7.4](../gate2/technical-spec.md#74-user-global-writes-and-repository-attribution)

## Why it is this way

Refusing every global surface would make some supported host axes impossible;
unattributed writes would make safe removal impossible. A clone-local identity
under `git rev-parse --git-path rig/` survives normal repository use without
becoming committed shared state, and linked worktrees remain distinct installs.
[Gate 1 D9](../gate1/business-spec.md)

## What binds it

`D9`, `AD-25`, and `AD-26` require additive preservation, attribution, and
install-time blast-radius disclosure. `AT-HOME-*` tests first install, repeat
install, multi-repository coexistence, and removal. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Overwrite, late attribution, retrofitting ownership after the first install,
and a prune subsystem for orphaned entries were rejected. The product reports
orphans; it does not guess who owns them. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen global-write rule: [Gate 1 §2](../gate1/business-spec.md)
- Identity and merge mechanics: [Gate 2 §7.4](../gate2/technical-spec.md#74-user-global-writes-and-repository-attribution)
- Install disclosure: [Gate 2 §7.5](../gate2/technical-spec.md#75-install-line-output)

## What is still open

Activation remains open: RIG-110 must decide the executable versus pointer-only
roster and collect real first-wire evidence. The four MCP write contracts are
no longer open. RIG-111 defines and byte-tests Windsurf/Devin Desktop legacy
Cascade, Cline IDE, Hermes, and CodeWhale merges and exact attributed removal in
`rig/lib/global-writes.js`; the signed Basic path remains note-only until the
RIG-110 gate authorizes use. [Host and CI coverage](host-and-ci-coverage.md)

OpenClaw is now confirmed as a user-global MCP surface at
`~/.openclaw/openclaw.json`; its supported writer is the `openclaw mcp` CLI,
which preserves the host's JSON5 format and validates the server definition.
The owner-requested explicit, warned installation opt-in is now implemented:
it is the only host-specific install selection, leaves the default unchanged,
uses one attributed server name per clone, fails closed when the native registry
read fails, and retains the runtime when native rollback or removal cannot be
proven. Before a reinstall or uninstall, the current native registry value must
exactly match the clone-local recorded server, so a later user replacement is
preserved. The bootstrap also names the exact configured path that is passed to
the native CLI before registration. Uninstall accepts only the server name
derived from the repository's persisted install identity, never the ledger's
name by itself, and reads that identity without creating one during teardown.
[Intent record](../reasoning/2026-08-24-openclaw-global-mcp-opt-in-request.md)
[Safety follow-up](../reasoning/2026-08-28-rig120-safety-followup.md)
