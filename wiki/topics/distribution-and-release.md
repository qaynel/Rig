# Distribution and release

## What it is

A stranger with `curl`, `tar`, POSIX `sh`, and Node can install a named Rig
release without a checkout. The root installer resolves `latest` or accepts a
specific tag, downloads the archive to disk, extracts exactly one root, and
executes the bundled bootstrap locally with its active-delivery gate. It never
pipes network bytes to a shell.

## Shipping payload

Every tagged-release target receives the neutral router, all 55 vendored
skills, upstream MIT notice and provenance, plumbing, the complete 115-leaf
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
package installation. Bootstrap prints the staged workflow using that command;
the markdown-only default receives neither the command nor runtime bytes.
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

Cutting and publishing `v5.0.0` remains an explicit release operation after the
fresh independent implementation review receipt passes against the final PR
bytes.
