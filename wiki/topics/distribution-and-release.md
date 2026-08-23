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
catalogue, baseline assets, and the safety/runtime modules. Detected hosts
additionally receive only their supported native trees; a bare repository
receives no fabricated host tree but still receives the neutral product. The
local Tier-1 bootstrap omits runtime files and remains a static-only surface.

The installer records the resolved tag through the append-only install journal.
It is written for `/bin/sh`: no Bash shebang, `pipefail`, substring expansion,
or `[[ ... ]]`. Release-tag input is restricted before URL and path use.

## Evidence

The distribution regression builds a tagged archive fixture from the release
payload, serves it through a local fake `curl`, runs the real root installer
under `dash`, and checks the recorded tag, 55 installed skills, catalogue, and
safety runtime. This replaces the former source-only assertion that never ran
the installer.

## Authorities and sources

- Frozen distribution intent: [business specification](../gate1/business-spec.md)
- Working release design: [technical specification](../gate2/technical-spec.md#124-distribution)
- MIT approval: [owner approval](../reasoning/2026-08-21-d24-owner-approval.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)

## Remaining work

Cutting and publishing `v5.0.0` remains an explicit release operation after the
fresh independent implementation review receipt passes against the final PR
bytes.
