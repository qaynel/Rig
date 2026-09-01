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

Path B's `graft_managed` ownership records the named capability sections inside
one existing Markdown instruction file, including each section's canonical
content digest. Reversal removes only a digest-matching recorded section;
unmanaged bytes and an edited managed body survive as best-effort preservation.
[Slice 4 trace](../reasoning/2026-09-01-path-b-slice4-graft.md)

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

Uninstall resolves every ordinary journal path through the symlink-aware
containment guard before applying its install-namespace allow-list, so an
escaping path is refused before any preservation decision. Classification and
mutation use the contained relative path, not the journal's lexical spelling,
and uninstall never writes through an in-repo symlink. The install journal
records intended mutation history; it is not independent proof of exclusive
ownership. An editable `create_owned` record, matching digest, `managed_line`,
`managed_block`, or `append_managed` label cannot authorize deleting or rewriting
a provider-generic pipeline file. Of the six provider locations, only the
dedicated `.github/workflows/rig.yml` path is uniquely attributable and removed
as a whole file, and only when its digest still matches. The only CI line-strip
uninstall performs is the exact pointer the GitHub adapter appends onto an
existing workflow, and only for that append-managed write. Common GitLab,
CircleCI, Jenkins, Buildkite, and Azure pipeline files, other files inside
provider directories, lexical path aliases, unique-path symlinks, and forged
managed-line records are retained as named best-effort cases.
[Safety follow-up](../reasoning/2026-08-28-rig120-safety-followup.md)
[Intent-owner safety ruling](../reasoning/2026-08-28-editable-journal-is-not-ownership-proof.md)
[CI managed-line ruling](../reasoning/2026-08-28-ci-managed-line-is-not-ownership-proof.md)
[CI path-identity ruling](../reasoning/2026-08-28-ci-path-identity-is-the-mutation-object.md)
[CI realpath ruling](../reasoning/2026-08-28-ci-realpath-is-the-mutation-object.md)

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
- Safety follow-up: [reasoning trace](../reasoning/2026-08-28-rig120-safety-followup.md)
- Editable-journal ruling: [intent-owner trace](../reasoning/2026-08-28-editable-journal-is-not-ownership-proof.md)
- CI managed-line ruling: [reasoning trace](../reasoning/2026-08-28-ci-managed-line-is-not-ownership-proof.md)
- CI path-identity ruling: [reasoning trace](../reasoning/2026-08-28-ci-path-identity-is-the-mutation-object.md)
- CI realpath ruling: [reasoning trace](../reasoning/2026-08-28-ci-realpath-is-the-mutation-object.md)

## A recorded absence is not something to reclaim

The journal now carries `delete_owned` records whose desired end state is
absence (`desired_digest: null`). Uninstall skips them before path attribution:
there is nothing left on disk to reclaim, and running one through the ownership
rules files a clean path as best-effort, which keeps the journal alive and makes
every later uninstall report best-effort again. `onboarding-check` excludes them
from its allowed-projection set for the mirror-image reason — an applied record
licenses the file it asked for, and a delete asked for no file.
[Ownership fix trace](../reasoning/2026-09-01-path-b-hardening-issue6-delete-ownership.md)

## Remaining work

A real install→uninstall roundtrip now proves the dedicated Rig workflow is
removed, the GitHub adapter's pointer line is stripped from existing workflows,
and common provider files plus forged managed-line records are preserved. Exact
independently proven reversal of namespaced merges into common CI files remains
separate work; uninstall currently names those as best-effort. Fresh independent
review remains the release check on the combined lifecycle.

## The delete primitive's first onboarding caller

`writer.remove` is now called by onboarding `apply` to drop projections a
re-approved proposal no longer selects. Two limits of the journal's ownership
answer showed up at that call site. It says yes to installer-staged core skills
— `bootstrap.sh` created those files, so their origin record has a null preimage
— which is correct about authorship and wrong about authority, so apply filters
core skills out before asking. And `applied.projections` records only one
`SKILL.md` per (skill, host) while a projection may have written a whole tree,
so removal sweeps the live skill directory too and uses `latest(rel).digest` as
the expected-bytes proof for siblings the ledger never named. A `removed: false`
answer is surfaced as an `unreconciled` warning rather than swallowed.
[Reconciliation trace](../reasoning/2026-09-01-path-b-hardening-issue3-reconcile.md)
