# Implementation status — configurable user sign-off

## QA candidate checkpoint — 2026-10-24

The sections below record earlier checkpoints. The current candidate includes
two review fixes: every public release mode checks current security and review
readiness, and signed sign-off mode changes bind the requested key protection.
Platform sign-off now refuses approval until a verified adapter exists; it no
longer creates an authorization receipt without a platform action. The focused
sign-off and release-security tests pass 17/17. AT-P4 and its complete file pass
on stable files (1/1 and 74/74), and the corpus projection and v5 migration
checks pass (migration 108/108). The first full suite overlapped source edits
and is diagnostic only. A new full gate, candidate review and QA PR are the
remaining automation steps. Owner-only signing remains with the owner.

Updated 2026-10-24 after the owner directive that sign-off is configurable.
The contract is owner-signed. Nothing was committed, pushed, or published.

## What landed

Sign-off is an explicit choice recorded during onboarding. The three modes are
cryptographic, platform, and acknowledgement. A missing key does not pick a
weaker mode. A typed name is not stored as a signature. Acknowledgement is
labeled as a declaration an agent can forge. Platform prompts, including sudo
and a cached password, are not recorded as human presence. Changing a mode
requires authorisation under the mode already in force, using the one existing
trust root. Review separation defaults to a different session, including the
same model; a repository can require a different provider. Learning from a
declared flag is not admitted. External worker reclaim checks that the process
has exited or its id was reused, and that the reserved bytes are unchanged.

Host instruction files remain generated from the one corpus. The projection
check reports 38 generated files and no corpus twin. The staged kit still
omits the router and the onboarding playbook so a default install does not
discover two copies. Putting them back fails the already signed one-router
check. That older contract is a separate amendment and was not mixed into this
batch.

## Verified

| Check | Result |
|---|---|
| Sign-off, learning admission, worker identity, review separation | 9 pass on this Mac |
| Same file inside Linux `node:22-bookworm` | 9 pass, including process start time from `/proc` |
| Signed release, learning, worker, onboarding, review, and public-release proofs | pass, still on the current contract |
| Release security proofs | pass |
| Catalogue shard sizes | 23, 23, 23, 23, 23 (115). Shard 2's partition test passes. An earlier shard run failed only that test because an explicit empty spec was confused with the shard environment; that assertion is fixed. |
| Projection and rule-copy check | 38 generated files, reproducible |
| Docker | available (29.7.2). Used for the Linux sign-off run. Not treated as a macOS or Windows security proof. |
| Full `npm test` | Exit 0: 1478 total, 1473 pass, 0 fail, 5 skipped. Main suite: 1442 (1437 pass, 5 skipped); secrets: 15 pass; pi-extension: 15 pass; rig-mcp: 6 pass. Log: `/tmp/npm-test-signoff-2026-10-24.log`. |
| Post-amendment narrow suite | First run found exactly one stale, unprotected typed-name assertion. That case alone was updated; rerun: 27 pass, 0 fail, 0 skipped. |

Not run: GitHub-hosted macOS and Windows runners. Those jobs already exist and run on push. This session did not push. The hardware proof still fails closed without the enrolled key; this machine was not asked to sign.

## Amendment and final evidence

The protected amendment was applied to exactly 7 protected files, and their
hashes match the proposed bytes. The 3 coupled production edits were applied.
Read-only post-edit digest recomputation equals the proposed programme digest
below. The prescribed narrow suite and the full test results are recorded in
the Verified table. The amendment details are in
`wiki/gate1/ai-sdlc/ORACLE-DELTA-2026-10-24.md`.

Prior signed programme digest: `2b2dc1287194224cfbbfeeb7c432997068fd699e5ed9c4462aaaa610ab03f56c`

Current signed programme digest: `44a1d91b56b3c51f8df9fd2af4552eda7ea540ba74e0a1a3b6ac79ac5ae9ff80`

Recompute with `node scripts/preview-signoff-amendment.js` before applying.
The earlier proposal that every user must have a cryptographic key is withdrawn.

Read-only preview was re-run and confirmed the current digest
`2b2dc1287194224cfbbfeeb7c432997068fd699e5ed9c4462aaaa610ab03f56c` and
proposed digest
`44a1d91b56b3c51f8df9fd2af4552eda7ea540ba74e0a1a3b6ac79ac5ae9ff80`.
Read-only post-edit recomputation also equals
`44a1d91b56b3c51f8df9fd2af4552eda7ea540ba74e0a1a3b6ac79ac5ae9ff80`.
The owner signed the ai-sdlc contract. The protected status check confirms
`principal=gate1-owner`; the 6.0.0 oracle is unchanged. Post-signing narrow
suite: 27 pass, 0 fail, 0 skipped. No obsolete filenames requested in the
handoff were present; deleted files: none. Nothing was committed, pushed, or
published.

An unintended second full-test launch caused by shell interpolation was stopped
immediately. It produced no evidence and does not replace the completed full-test
counts above.

## Release state

The ai-sdlc contract is signed and protected. Nothing was committed, pushed, or
published.

## QA-to-production and cleanup audit

The branch is five commits ahead of `origin/qa-prod` and the working tree is
dirty, so it is not a promotable candidate yet.

No host-specific directory was moved or deleted, and `.break/` was not created.
These paths are tracked, generated discovery surfaces rather than leftover
authoring copies:

- `.claude/` and `.agents/` provide native skill, rule, and command discovery.
- `.cursor/`, `.windsurf/`, `.clinerules/`, `.kiro/`, and `.opencode/` provide
  host-required project rules or commands.
- `.codex/`, `.vscode/`, `.devin/`, `.swival/`, and `.github/` carry active MCP,
  CI, or repository integration configuration.
- The plugin directories are installable distribution entrypoints.

Moving those files below `.break/` would make the hosts stop discovering them
and would fail the portability contract. The central corpus remains the sole
authoring source; these files are reproducible projections or thin adapters.

A repository-wide filename and content search found no active alert-card file or
configuration. The only similarly named file is an ignored upstream research
snapshot under `.context/`; it is not loaded by Rig and was preserved. Alert-card
artifacts removed: none.

Focused verification passed: the generated projection is reproducible with 38
files and no corpus twin, and the host projection/command/MCP/onboarding suite
passed 78 tests with 0 failures and 0 skips.

## Ordered promotion plan

1. Freeze the candidate: reconcile the deployment tracker, commit the intended
   files, and require a clean tree.
2. Run `npm test` once on those final bytes; earlier runs do not certify a
   changed candidate.
3. Produce a fresh independent review receipt outside the repository, bound to
   the final implementation digest.
4. Run the version, coherence, and deployment-gate checks and fix forward from
   any failure.
5. Push one branch and open one PR to `qa-prod`; require all checks on the exact
   PR head.
6. After merge, run automated health and real-download clean-install checks on
   the exact QA commit.
7. Promote that exact commit to production only after both automated checks are
   green.
8. Tag and publish, run the tagged-download smoke test, then close trackers.
