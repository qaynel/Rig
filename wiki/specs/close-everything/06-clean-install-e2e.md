# 06 — Real clean-install end-to-end test (D1, RIG-155)

Part of the [master plan](00-master-plan.md). Depends on [03](03-central-corpus.md).

**Owner (round 2):** fresh install, run end to end with real downloads, rolled
into the test suite.

## Current state

`AT-HOME-1` proves the MCP server only through a fake `npm` that copies a
pre-built `node_modules`. RIG-155 was written around one host's MCP opt-in
flag, which is per-host framing and is rescoped here per North star 1.

## Shape

A workflow, `.github/workflows/e2e.yml`, plus `npm run test:e2e`. It runs on a
clean runner (no repo `node_modules`, no npm cache, no `.venv`), on a schedule,
on manual dispatch, and as a required exact-QA-SHA check before promotion to
production. The post-publication `--tag` smoke test remains separate. It does
not run on every push: networked installs stay out of the unit suite.

Steps:

1. Create an empty git repo, plus a second fixture repo with existing agent
   config, to exercise grafting.
2. Resolve one exact QA SHA, download its GitHub source archive, compare the
   extracted tree with that source commit, and pass the archive/tree commitments
   to the public installer. Run real `npm ci` downloads. Explicit `--artifact`
   is for a supplied local archive; `--tag` is the separate post-publication
   public-download smoke test. Eligibility requires the same exact SHA for
   health and Linux/macOS clean-install checks.
3. Assert install exits 0 and lays down the corpus `.rig/` plus the default
   projection.
4. Start the installed MCP server the way the projection says to, and complete
   a real MCP tool call (`rig_instructions`) over stdio.
5. Exercise inspect→proposal→real human-compatible approval→apply→check
   using documented approval support. The run cannot forge approval or leave
   CLI placeholders unresolved. Declare the scheduled approval mechanism and
   restrict its authority to disposable fixture targets. Explicitly select
   named services and assert their executed check IDs/counts; an empty
   catalogue selection cannot satisfy end-to-end service acceptance.
6. Uninstall with the scoped evidence cleanup defined in 03. Compare complete
   file inventories and bytes, not git status alone; ignored/untracked files
   and existing user reports/config are included in the baseline.
7. Record the Node version, npm registry, OS, and SHA as a run artifact.

## Acceptance

- The workflow is green on `ubuntu-latest` and `macos-latest`, the two
  platforms the installer is shell-based for.
- If the workflow is broken on purpose (a bad lockfile entry, or a missing
  corpus file), it goes red. Both breakages are recorded once as evidence in
  the trace.
- RIG-155 closes with a link to the run.

## Implemented execution interface (candidate, 2026-10-18)

By default, `--sha <commit>` makes
`node scripts/clean-install-e2e.js --sha <commit> --out <evidence.json>`
download the GitHub source archive for the exact commit and compare the
extracted tree with the checked-out source tree. It passes archive and tree
commitments to the public installer, which verifies both before execution. An
explicit `--artifact <path>` instead supplies a local archive and records that
evidence source. An intermediate working-tree snapshot is labelled provisional
and cannot satisfy release eligibility. `--tag <published-tag>` runs the
separate public-download smoke test after publication.

Scheduled approval creates a throwaway Ed25519 key in the disposable run
folder and trusts its public half only in the two fixture repositories. The
fixture signer verifies the target is one of those repositories, then signs
the exact `rig-plan-approval` message through SSHSIG. It has no authority over
the author's checkout or the release oracle. Both fixtures select
`development.documentation.onboarding-docs=minimal`; its actual executed IDs
and nonzero counts are retained from installed onboarding state.

The public installer runs real `npm ci` in an isolated temporary staging
folder and journals downloaded dependency files plus `.rig/mcp-server.json`.
The E2E launches that descriptor and completes `rig_instructions` over stdio.
`--uninstall --purge-generated` requests scoped evidence cleanup: named runtime
evidence retains original bytes and mode in an ownership ledger, and cleanup
restores the preimage or removes unchanged newly created evidence only when
attributable. Unrelated reports and changed evidence remain. The existing
`--purge` flag still explicitly removes the complete reports scope under the
frozen contract; E2E must not request that while asserting original report
preservation. Both flags together refuse before writes.

The reusable E2E workflow resolves one SHA and checks Linux/macOS. The
read-only release-eligibility workflow requires that SHA to be current QA both
before and after the reusable health/full-gate/coherence/E2E jobs, then emits
an eligibility artifact. It does not publish a tag or promote stale evidence.
