# Distribution and release

## What ships

The public `install rig` command downloads a named release archive to disk,
extracts it locally, then runs the bundled installer. It does not pipe network
bytes to a shell. The installed product is projected from the central
`rig/corpus/`; the installer adds the runtime, pinned skill catalogue and
upstream metadata, and the required Rig entry skills for the hosts it detects.
It leaves repository instructions intact and ends by directing the local agent
to invoke `rig-onboarding`.

Optional skill trees are not copied into agent discovery during install. When
an approved onboarding plan selects third-party resources, the runtime fetches
the pinned upstream data, verifies digests, applies recorded local patches and
projects only the selected resources. Missing or altered upstream data becomes
a named gap. Rig's current per-skill vendored reference tree supports digest
and patch verification; it is not the install payload. The detailed history of
the migration is retained in the [central-corpus archive](../reasoning/2026-10-13-corpus-03-slice6-contract.md)
and [fetch trace](../reasoning/2026-10-13-corpus-03-slice4-upstream-fetch.md).

Known host entrypoints are deterministic projections from the corpus. Where no
projector exists, the repository's own agent follows the shipped
[unpacking playbook](../../rig/corpus/onboarding/unpack.md) and proposes a
deterministic projector for review and approval. Rig does not infer which
capabilities a repository needs. See the [onboarding flow](onboarding-flow.md).

The launcher is POSIX `sh` compatible, restricts release-tag input before URL
and path use, and records the resolved tag in the append-only install journal.
The default install does not run npm or create the optional MCP runtime,
including on a v5 upgrade. An explicit `SETUP_MCP=1` migration request installs
the runtime on a v5 upgrade only when the selected host emits MCP configuration;
fresh installs and non-emitting hosts skip it. `--openclaw-mcp` is the opt-in to
install that runtime and register it globally. The installed runtime provides
journaled apply and removal. The
[public-upgrade retry trace](../reasoning/2026-10-17-review-received-resolution-public-upgrade.md)
records the recovery behavior; the
[documentation clarification trace](../reasoning/2026-10-17-review-received-resolution-mcp-emission-docs.md)
records the emitted-host condition.

## Release controls

The release process is the ordered policy shipped in
[`rig/corpus/standards/change-management.md`](../../rig/corpus/standards/change-management.md).
It binds a review receipt, checks and release evidence to the exact candidate
bytes. QA-to-production promotion runs only against the exact QA commit and
requires automated health plus the reusable real-download clean-install matrix
on both Ubuntu and macOS. Eligibility depends on that matrix result and
supplies it the same resolved SHA as health; the post-publication tagged-
download smoke remains a separate later step.
The exact-SHA E2E compares the downloaded archive tree with the checked-out
commit and passes the archive and extracted-tree digests to the public
installer, which verifies both before executing the bootstrap. Since the
default path no longer installs optional MCP dependencies, this E2E explicitly
opts into MCP through a fake OpenClaw CLI and isolated config under its
disposable HOME. It runs real dependency downloads and an MCP tool call.
[`release-eligibility.yml`](../../.github/workflows/release-eligibility.yml)
enforces the promotion evidence; [`health.yml`](../../.github/workflows/health.yml)
runs scheduled and manual health checks and reports one issue per failing SHA.
Any change after evidence is gathered re-enters the sequence at its full-gate
step.
The [Review Received full-gate trace](../reasoning/2026-10-17-review-received-resolution-full-gate.md)
records the earlier local full-suite run and the still-pending final-candidate
verification. The [late findings trace](../reasoning/2026-10-17-review-received-resolution-late-findings.md)
records the exact-SHA archive/tree checks and the owner-controlled Linux/macOS
workflow evidence that remains open.
The [clean-install harness trace](../reasoning/2026-10-17-review-received-resolution-clean-install.md)
records the explicit MCP opt-in and disposable OpenClaw fixture. The
[exact-candidate E2E trace](../reasoning/2026-10-17-review-received-resolution-exact-e2e.md)
records the passing local-archive E2E and real-npm public-upgrade evidence,
with the distinction from GitHub-hosted Linux/macOS checks.

The [follow-up review fixes](../reasoning/2026-10-18-review-received-followup-fixes.md)
record durable coverage for migration publication cleanup and interrupted
upgrade MCP setup, along with the current upstream-fetch and exact-SHA E2E
documentation contract.

## Evidence

- `tests/path-b-install.test.js` runs the public installer against a tagged
  archive fixture and checks the install handoff, repeatable host selection,
  and preservation of repository instructions.
- `tests/path-b-catalog.test.js` verifies the deterministic pinned catalogue,
  absence of preinstalled optional skill trees, and the required discovery set.
- `tests/upstream-shelf.test.js` verifies digest-pinned upstream fetching and
  that fetched bytes, rather than a vendored fallback, supply optional skills.
- The clean-install E2E workflow checks fresh and configured repositories,
  real MCP traffic, an approved service check, and journaled uninstall.
- The deployment checker automates the signed-oracle, clean-tree, full-test,
  review-receipt, changelog/version, and tracker-coherence gates. Documentation
  accuracy and QA branch-protection requirements are separate owner checks;
  the script does not inspect either one.

## Authorities and history

- Frozen distribution requirements: [Gate 1](../gate1/business-spec.md)
- Working distribution design: [Gate 2](../gate2/technical-spec.md#124-distribution)
- The prior release and install design is retained in the
  [August archive](../archive/2026-08/release-install-and-distribution.md).
- The 2026-10 closeout evidence is indexed from the
  [current status](../status.md) and
  [close-everything delivery plan](../specs/close-everything/statement-of-work.md).

The [health and docs checkpoint](../reasoning/2026-10-17-qa-readiness-health-and-docs.md)
records corrected lockfile commands, runner setup and final instruction alignment.

The [shipped-dependency audit](../reasoning/2026-10-17-qa-readiness-shipped-dependencies.md)
records the stale installed MCP lock and the correction to health coverage.

The [latest checks checkpoint](../reasoning/2026-10-17-qa-readiness-checks-await-docs.md)
records a green advisory full gate, clean shipped dependencies and the docs handoff wait.
The [publication follow-up](../reasoning/2026-10-18-review-received-publication-followup.md)
records that mutable-path deletion was removed while pre-link parent substitution
still leaves Finding 17 open.
The [directory-relative fix](../reasoning/2026-10-18-review-received-dirfd-fix.md)
records the Python standard-library descriptor publication fix and the migration
runtime requirement.
The [cleanup follow-up](../reasoning/2026-10-18-review-received-cleanup-followup.md)
extends descriptor-relative operations to migration temp cleanup and marker
creation; final migration and repository gates remain unverified.
The [recovery-boundaries trace](../reasoning/2026-10-18-review-received-recovery-boundaries.md)
records safe handling of a replaced temp file and recovery of a pending MCP
marker journal write.
The [temp-retention trace](../reasoning/2026-10-18-review-received-temp-retention.md)
records why a refused parent-path race keeps only the pinned transaction temp
for recovery.
The [final gate retry trace](../reasoning/2026-10-18-review-received-final-gate-retry.md)
records synchronized generated wiki files and the pending final test run.
The [full-gate trace](../reasoning/2026-10-18-review-received-full-gate-passed.md)
records the passing local `npm test` suites and the remaining owner-controlled
QA and review steps.

The closeout correction makes healthy health runs non-mutating and renews the
current installed guidance and delivery checks. [Remediation trace](../reasoning/2026-10-18-qa-closeout-remediation.md)
