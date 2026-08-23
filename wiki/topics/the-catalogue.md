# The à-la-carte catalogue

## What it is

Rig offers four families, groups within those families, and 115 independently
selectable services. Each service has cumulative `minimal / mid / maximal`
packaging, mapped to Policy, Context, and Evidence assurance inside that
service's owned domain. Scan recommendations are advisory; the user may select
any leaf and grade.

The separate 55-skill shelf is vendored operating method. It is installed by
Rig name with upstream notice/provenance, but it does not replace the 115-leaf
selection and evidence model.

## Current release shape

D24 makes the beta broad and shallow: all 115 leaves ship at Policy grade and
declare themselves generic, untailored baseline practice. Lint/format is the
only leaf currently backed for higher-grade claims. Every other leaf names its
owned scope, applicability, dependencies, disposition, exact checks, and slice
behavior; a missing repository binding reports a coverage gap instead of
passing vacuously.

The tagged-release payload installs `catalog.json`, every service fragment,
baseline assets, the safety/runtime modules, all 55 neutral skills, and their
plumbing even when no host marker is detected. Detected hosts receive only
their additional native skill/instruction tree. The local Tier-1 bootstrap
keeps its static-only boundary and does not install the runtime-gated files.

## Why

Fixed Basic/mid/Advanced packages could not express repository-specific needs.
The catalogue preserves individual user choice and razor-scoped dependencies,
while the Policy/Context/Evidence ladder states how much of each selected
service has actually been proven.

## Authorities and sources

- Frozen inventory and choice model: [business specification](../gate1/business-spec.md)
- Working catalogue contract: [technical specification](../gate2/technical-spec.md#5-catalogue-contract)
- D24 broad Policy release: [intent-owner trace](../reasoning/2026-08-21-mvp-agent-discretion-build.md)
- Vendored-skill approval: [owner approval](../reasoning/2026-08-21-d24-owner-approval.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)

## Remaining work

The current packs meet the Policy authorship contract. Beta use determines
which leaves earn repository-specific Context and rerunnable Evidence next; the
grade must never advance from prose alone.
