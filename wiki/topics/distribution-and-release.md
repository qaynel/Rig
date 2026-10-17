# Distribution and release

## What it is

A stranger with `curl`, `tar`, POSIX `sh`, and Node can run the single public
command `install rig` to install a named Rig release without a checkout. The
launcher accepts repeatable explicit hosts, or preserves bounded detection
when no host is supplied. It resolves `latest` or accepts a specific tag,
downloads the archive to disk, extracts exactly one root, and executes the
bundled bootstrap locally with its active-delivery gate. It never pipes network
bytes to a shell.

## Shipping payload

Every tagged-release target receives the neutral router, the 55 vendored
optional skills plus the canonical onboarding skill, upstream MIT notice and
provenance, plumbing, the complete 115-leaf
catalogue, baseline assets, and the safety/runtime modules — `install.sh`
always installs with `--with-runtime`. Detected hosts additionally receive only
their supported native trees; a bare repository receives no fabricated host
tree but still receives the neutral product. A local `sh rig/bootstrap.sh`
without `--with-runtime` is markdown-only end to end: every one of the 55
`SKILL.md` files still lands under its Rig name, but per-skill code
(`src/`, `bin/`, `scripts/`, `daemon/`, `.swift`, …) and the `.rig/plumbing`
tree are gated behind the same `active_delivery` flag as the runtime engine.
`.tmpl` build inputs and `TODOS-format.md` never land, in either mode
([AD-37](../index/decisions.md)).

Active-delivery installs also receive the journal-owned `.rig/bin/rig`
executable, which delegates to the installed runtime without requiring a global
package installation. The neutral `.rig/skills/` directory therefore contains
56 skill directories in active installs; the 55-skill optional shelf remains
under the runtime catalogue. The public install ends by directing the user to invoke
`rig-onboarding`; it never runs onboarding automatically, and the markdown-only
default receives neither the command nor runtime bytes.
The bundled MCP runtime also carries the canonical Rig rule file beneath its
runtime tree, so it serves the complete ruleset even for a bare repository that
has no host-specific instruction install.

The installer records the resolved tag through the append-only install journal.
It is written for `/bin/sh`: no Bash shebang, `pipefail`, substring expansion,
or `[[ ... ]]`. Release-tag input is restricted before URL and path use.

## Evidence

The public installer invokes the shipped MCP setup helper through bootstrap's
journaled post-payload callback. It downloads locked dependencies and records
the server descriptor before optional global MCP registration
([trace](../reasoning/2026-10-14-closure-e2e-mcp-setup-wired.md)).
Uninstall purge restores only journaled evidence and preserves pre-existing or
unrelated reports under `reports/rig`
([trace](../reasoning/2026-10-14-closure-e2e-scoped-purge.md)).

The weekly/manual QA health workflow runs the full gate, exact-SHA E2E,
dependency checks and wiki budget. Only its final report job can write issues;
it updates a single health issue for each SHA.
[Health workflow trace](../reasoning/2026-10-14-closure-health-workflow.md)
Process cleanup has focused Linux, Windows, and macOS jobs, and the clean-install
workflow covers Linux and macOS ([platform CI trace](../reasoning/2026-10-14-closure-platform-ci.md)).

Root, MCP, and pi-extension lockfiles now support clean-install dry-runs; the
MCP transitive lock versions are updated and all three production audits report
zero vulnerabilities.
[Dependency audit trace](../reasoning/2026-10-14-closure-dependency-audit-green.md)
A complete provisional E2E archive now passes both fresh and existing-repo
scenarios, including real MCP traffic, signed onboarding, a named executed
service check, and byte-for-byte uninstall restoration. Exact branch-commit
evidence will be rerun after the owner freezes the bytes
([earlier run](../reasoning/2026-10-14-closure-e2e-provisional-green.md),
[current run](../reasoning/2026-10-14-closure-e2e-provisional-final3.md)).
The earlier failure where both fault cases stopped at the missing MCP
descriptor is resolved by wiring the shipped dependency setup into the public
installer ([setup fix](../reasoning/2026-10-14-closure-e2e-mcp-setup-wired.md));
both deliberate breakages now fail at the shipping boundary: an invalid
runtime lock integrity returns `EINTEGRITY`, and a missing router source fails
with `ENOENT`. Evidence is recorded for both
([trace](../reasoning/2026-10-14-closure-e2e-faults-red.md)).

The 6.0.0 changelog entry is present. Exact-SHA release eligibility depends on
the health run, including its clean-install E2E, and checks the changelog entry
before producing eligibility evidence.
[Changelog eligibility trace](../reasoning/2026-10-14-closure-changelog-eligibility.md)

Ticket/evidence references and the 63 declared tracker transitions pass the
local coherence sweep; exact pushed-SHA CI and QA health remain owner-sequenced
([closeout trace](../reasoning/2026-10-14-closure-coherence-green.md)).
The eight release-version manifests now agree on 6.0.0; the retained v5 skill
shelf keeps its own stable generator tag.
[Version trace](../reasoning/2026-10-14-closure-version-bump.md)

The distribution regression builds a tagged archive fixture from the release
payload, serves it through a local fake `curl`, runs the real root installer
under `dash`, and checks the recorded tag, 55 installed skills, catalogue, and
safety runtime. It invokes inspection through the installed `.rig/bin/rig`
entrypoint, while the bootstrap regression plans, applies, and checks the
lint-format leaf through the same command. This replaces the former source-only
assertion that never ran the installer.

The README now gives the single checkout install command and explains that the
user invokes `rig-onboarding`, reviews its proposal, then selects catalogue
services. It intentionally has no per-host support matrix. Its coherence proof
is still blocked by the pending install guide, tracker issues, and test-evidence
findings ([trace](../reasoning/2026-10-14-closure-readme-coherence-blocked.md)).
The install guide now covers fresh and configured repositories, v5 upgrades,
and journal-based uninstall; each command and flag was checked against installer
and materializer help ([trace](../reasoning/2026-10-14-closure-install-guide.md)).
The troubleshooting guide explains named install, migration, onboarding,
projection, upstream, and service-check refusal and coverage-gap messages
([trace](../reasoning/2026-10-14-closure-troubleshooting.md)).
The one-page [product vision](../../docs/vision.md) describes 6.0.0 as shipped
and points to the separate owner-directed redesign backlog
([trace](../reasoning/2026-10-14-closure-vision.md)).
The Spanish and Korean README editions visibly identify themselves as lagging
and link to the current English README ([trace](../reasoning/2026-10-14-closure-translations-lagging.md)).
The README's clean-machine install command is now a single clone-and-install
line. It cannot complete until the owner publishes the `v6.0.0` tag: GitHub
returned HTTP 404 for the archive, then reported the branch/tag missing before
any target write ([archive attempt](../reasoning/2026-10-14-closure-readme-install-404.md),
[clone attempt](../reasoning/2026-10-14-closure-readme-clone-tag-missing.md)).
Security review covered the installer, sandboxed projector, service runner,
MCP boundary, and secret handling; it left no actionable finding open
([trace](../reasoning/2026-10-14-closure-security-review.md)).
The independent code review's health-token and patch-scan findings are fixed;
its fresh-install finding is now an owner tag-publication dependency
([report](../reasoning/2026-10-14-closure-code-review.md),
[disposition](../reasoning/2026-10-14-closure-review-findings-resolved.md)).
The unsigned owner amendment bundle inventories the proposed frozen-case,
catalogue, patch-provenance, and package-script updates. Its case-level proofs
pass, while coherence and exact-SHA E2E remain blocked, so T-10.3 stays open
([bundle](../specs/close-everything/candidate-amendments/owner-bundle.md),
[trace](../reasoning/2026-10-14-closure-owner-bundle-incomplete.md)).

## Authorities and sources

- Frozen distribution intent: [business specification](../gate1/business-spec.md)
- Working release design: [technical specification](../gate2/technical-spec.md#124-distribution)
- MIT approval: [owner approval](../reasoning/2026-08-21-d24-owner-approval.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)
- Lean default install: [lean-install protocol](../reasoning/2026-08-23-lean-install-protocol.md)

## Remaining work

The public operator path and onboarding weight/correctness check are now closed
for the active Path B delivery. The annotated tag and GitHub latest release
were published
2026-08-29 on the receipt-bound commit
`9d1ea45ea4876b300fbfe964d46319188ff2f09d`.
[Ceremony cut](../reasoning/2026-08-29-v5.0.0-tag.md)

Beyond `v5.0.0`, the intent owner's recorded end-product expectation implies a
release strategy this section does not yet own: a phased, per-host controlled
rollout (Claude Code first, then Cursor, then the rest of the 19 hosts, ideally
batching similar hosts) feeding a tiered, interactive, adaptive install. That
target is captured as intent, not a committed release plan, and is in tension
with the current default lean install.
[Product vision and tiered adaptive install](../reasoning/2026-08-30-rig-product-vision-and-tiered-adaptive-install.md)

**Office-hours positioning research (2026-09-04, not yet a decision).** 2026
SDD-landscape measurement found OpenSpec (~52k stars) already occupies the
brownfield/diff-based/token-efficient position this section's tiered rollout
was aiming distribution at, with no incumbency advantage available to Rig
there. The same research recommends vendoring less, not more: `rig/catalog/`
is 88% of `rig/` and mostly repackages gstack/Superpowers, which a user can
already install directly from projects with faster release cadence — a
liability for a per-host distribution strategy that currently ships the whole
catalogue regardless of host. The recommended reframe (lead with the signed
oracle, keep the tiered/adaptive rollout as install experience rather than the
headline) has not been ruled on by the intent owner; see Part 6 of the design
trace for the open questions blocking it.
[Landscape research](../reasoning/2026-09-04-landscape-research-in-flight.md) ·
[Finished-product design](../reasoning/2026-09-04-finished-product-design.md)

2026-10-13 (subplan 03): third-party skills are fetched at onboarding from a
pinned revision in `rig/corpus/upstream/` — staging download, tar-digest
verify, strict extraction, RIG-135 patches applied to the fetched bytes, named
gaps for bad digests or unavailable upstream, licence kept — and the retired
`rig/tier-1/` tree is gone; `--tier 1` stays accepted (deprecated) for one
release, any other value is rejected.
([fetch](../reasoning/2026-10-13-corpus-03-slice4-upstream-fetch.md) ·
[contract](../reasoning/2026-10-13-corpus-03-slice6-contract.md))

## Change management is a shipped policy (2026-10-17)

The owner's rule — "if I am instructing you on something twice, it's a skill,
it's a policy" — turned the release checklist into a standard the corpus ships:
`rig/corpus/standards/change-management.md`, enforced by
`scripts/check-deployment-gate.js` and run against the exact QA head by
`.github/workflows/release-eligibility.yml`. Nine ordered steps, no reordering,
and no evidence carried across a code change. See
[[2026-10-17-change-management-policy-and-doc-deduplication]].
