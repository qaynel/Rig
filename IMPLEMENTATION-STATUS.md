# Implementation status — configurable user sign-off

## PR 159 repair loop — 2026-10-25

The loop began on `vaibhav-kodiyan/ai-sdlc-harness` at
`0bbe1c26d23e34eb20f89f79a4c9ffe6e46bc4c3`. The first repair commit,
`6636ac3f655eb0ba98a9bd6fa1d9eb617a7e8114`, was pushed to PR 159.
Both Gate 1 contracts verify under `gate1-owner`. The rows below are current
work; historical checkpoints follow.

The integrated `npm test` run exited 0 on the nine-file repair diff: main Node
suite 1445 total (1440 pass, 0 fail, 5 skipped), secret checks 15 pass, Pi
extension 15 pass, MCP 6 pass. The same full gate passed on the exact first
repair-commit bytes. Logs: `.context/pr159-npm-test.log` and
`.context/pr159-npm-test-final.log`. Independent report-only review is saved at
`.context/pr159-independent-review.md`; it found no code defect in the repair
diff, but found the absent private reporting channel a high release risk.

A second, still-uncommitted repair diff (`.gitattributes`, the two path-
normalization fixes below, and the MCP dependency bump) also passed the full
gate: `npm test` exited 0 with the same 1445/1440/0/5 main-suite numbers, plus
`rig-mcp` 6/6. Log: `.context/pr159-npm-test-deps-windows-final.log`.
Independent review of the Windows-only portion is saved at
`.context/pr159-windows-independent-review.md` (no defect found).

| Failure | Environment and observed error | Hypothesis / attempted correction | Evidence and status | Next action |
|---|---|---|---|---|
| Main `test`, `tests/coherence.test.js` | GitHub Actions Ubuntu at the old run, 25 live issue states disagreed with candidate declarations. | Live tracker snapshot changed after that run; candidate/delivered semantics are behaving as designed. No code correction. | `node scripts/check-coherence.js` now passes: 66 declarations match 66 live issues; focused integration test passed 1/1 in 65.9 s. | Recheck the exact new PR head after a verified push; do not weaken candidate comparison. |
| Catalogue shard 5 lint-format | GitHub Actions Linux/Node 22, expected `checked`, got `failed`; a matching unprivileged container reports `filesystem_isolation_unavailable` before task launch. | The shard job omitted bubblewrap install and namespace preflight already used by the full test job. Added the same setup to `.github/workflows/test.yml`; isolation stays enforced. | Linux/Node 22 full shard: 24/24 with namespace capability, 23/24 without it; Docker actionlint and `git diff --check` pass. Historical hosted probe stderr was not retained. | Rerun shard 5 in GitHub Actions on the new exact commit. |
| Windows AI-SDLC advisory | Windows checkout expanded LF to CRLF, changing the pinned tokenizer bytes and archive manifest; the signed test ceremony also emitted backslash paths, and the reviewer diff path used backslashes. | No `.gitattributes` existed; an isolated `core.autocrlf=true` clone reproduced tokenizer size 249218 vs pinned 219690 and modified thousands of tracked text files. Added LF checkout policy and normalized repository paths at the two code boundaries. | Full local gate and independent review both pass on the uncommitted diff; pushed in this commit. | Inspect the hosted Windows advisory on the new exact PR head; local macOS passes cannot substitute for that run. |
| MCP dependency vulnerabilities | `npm audit` on `rig-mcp` and `rig/mcp-runtime` reported zod <4.6.6 (high, memory exhaustion), body-parser 2.0.0–2.3.0 (high, DoS), fast-uri 3.0.0–3.1.8 (moderate, scheme/host confusion). | Bumped `zod` to `^4.6.7` in both package.json files, clean-installed, then `npm audit fix` for the transitive body-parser/fast-uri bumps; mirrored the identical package.json/package-lock.json into `rig/mcp-runtime` per `check-rule-copies.js`. | Both trees: `npm audit` → 0 vulnerabilities. Resolved versions: zod 4.6.7, `@modelcontextprotocol/sdk` 1.32.1 (within existing `^1.26.0` range), body-parser 2.4.0, fast-uri 3.1.9. Verified every zod API this repo's `index.js` uses (`record`, `enum`, `number().int()`, `nullable`) against zod 4, and confirmed the SDK's peerDependencies already accept `^4.0`. `rig-mcp` test suite 6/6; `check-rule-copies.js` parity gate passes. | None; integrated into this commit. |
| Advisory PT-017 | Shared CI runners have no enrolled owner key. | Owner-controlled environment, not a software test substitute. | Fails explicitly as environment-bound; both contracts verify locally. | Owner runs the enrolled-key proof when requested. |
| Advisory PT-046 | Positive signed fixture lacks `independent-review` and `scenario-coherence` evidence required by current public-release policy. | Protected fixture and tightened policy conflict; no protected edit or policy downgrade. | Reproduced locally with focused PT-046 (exit 1); exact two-line amendment candidate prepared in the local wiki. | Owner reviews and signs a protected fixture amendment after independent work. |
| Offline public-download PT-068/PT-077 | Docker job downloads v6.0.0 GitHub source tarball; installer reports `archive has no rig-archive.json`. | Older release artifact predates the new self-contained archive. | Real download is genuine but the published artifact is incompatible. | Keep gap visible until the approved new release artifact exists. |
| Public security reporting | GitHub API reports `private-vulnerability-reporting.enabled=false`; `SECURITY.md`, conduct policy and issue contact link point to that endpoint. | Published guidance claims a private channel that is disabled. | Read-only API query confirmed the configuration. | Correct public wording and request owner-controlled enablement before claiming a private channel. |

Restart: read this table and the latest dated wiki reasoning trace, inspect the
actual PR head/checks, and continue the smallest failing loop. Do not use the
historical results below as current-candidate evidence.

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
