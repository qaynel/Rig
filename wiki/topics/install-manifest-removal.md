# Install manifest and removal

## What it is

Rig records repository mutations in `.rig/install-manifest.jsonl`, an
append-only pending/applied journal. The same journal drives resume and reverse
removal for bootstrap, catalogue apply, and CI writes. A legacy JSON file may be
emitted as a compatibility projection, but it is not a second authority.

## Current contract

Every pending record lands before its mutation and carries the relative path,
ownership, transaction kind, preimage digest, and desired digest. The applied
record with the same sequence carries the observed result digest. Install-state
records start incomplete and end complete. After a crash, desired bytes mean the
write landed and can be reconciled; preimage bytes mean it can be retried; any
third state blocks by path.

All repository paths pass through one symlink-aware containment guard. Lexical
traversal, absolute paths, and any existing symlink ancestor that resolves
outside the target are refused before reading, writing, or deleting. Static
regressions cover resume, uninstall, coverage application, remediation,
payload, and CI mutations.

Removal walks the last record for each sequence in reverse. It deletes only
unchanged Rig-owned output, removes recorded managed lines/blocks, deletes a
file that becomes empty after a managed strip, removes empty Rig-created
parent directories, preserves later user edits as named best-effort cases,
ignores remediation transactions, restores a chained pre-commit hook
(including across linked worktrees), removes only install-ID-attributed
global entries, and consumes both current JSONL and historical JSON
manifests. Public uninstall uses this journal; a receipt shim only covers
legacy Basic MCP leftovers. The journal is retained while best-effort files
remain and is deleted last in both ordinary and purge modes. Preimage
backups, install-id, and shared hook writes are journaled so they reverse.
The shipping `uninstall` command writes removal evidence. Reports and
user-owned policy files survive ordinary removal; `--purge` lists
reports/run history before deleting those usage artifacts and still
preserves the user policy.

## Why

Removal is product behavior, not cleanup. Record-before-mutate makes every
landed write discoverable after interruption; shared containment prevents a
repository-controlled symlink or journal path from extending Rig's authority
beyond the selected target.

## Authorities and sources

- Frozen lifecycle intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md#76-install-manifest-resume-and-removal)
- Original lifecycle ruling: [advanced grilling](../sources/logs/advanced-grilling.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)

## Remaining work

A real install→uninstall roundtrip now gates clean removal. Fresh independent
review remains the release check on the combined lifecycle.
