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

The distribution regression builds a tagged archive fixture from the release
payload, serves it through a local fake `curl`, runs the real root installer
under `dash`, and checks the recorded tag, 55 installed skills, catalogue, and
safety runtime. It invokes inspection through the installed `.rig/bin/rig`
entrypoint, while the bootstrap regression plans, applies, and checks the
lint-format leaf through the same command. This replaces the former source-only
assertion that never ran the installer.

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
