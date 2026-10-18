# The authored-service gate

The signed oracle checks the current service-specific corpus: AT-SHAPE-6 rejects
generic-baseline wording in authored fragments (lint-format retains its
evidence-backed exception), and AT-PB-1 pins `rig/corpus/catalogue.json` plus
its service definitions. The 2026-10-14 candidate amendments and their trace
are historical records of the changes before they were signed:
[`AT-SHAPE-6 candidate`](../specs/close-everything/candidate-amendments/04-catalogue/AT-SHAPE-6.md) ·
[`AT-PB-1 candidate`](../specs/close-everything/candidate-amendments/04-catalogue/AT-PB-1.md) ·
[candidate trace](../reasoning/2026-10-14-closure-catalogue-candidates.md).

## What it is

All 115 catalogue leaves must carry service-specific identity, owned scope,
applicability, disposition, cumulative grade behavior, checks, slices, and
evidence targets. Presence alone is not authorship.

## Current implementation

Every leaf has service-specific guidance, declared applicability and a named
assurance ceiling. Identity fragments name exact owned scopes, exclusions,
applicability signals, disposition, and dependencies. Grade fragments name
leaf-specific boundary, repository-context, and evidence-receipt checks. Each
catalogue entry carries distinct minimal/mid/maximal acceptance targets with
explicit given/pass/fail conditions. Slice fragments state the owned invariant
and the checks they activate.

The deterministic gate opens every declared file and rejects missing or empty
markdown, placeholders, the previous repeated boilerplate phrases, generic
`core / extended / thorough` check identifiers, omitted owned/applicability
metadata, omitted dispositions, missing grade checks, and duplicate bodies. It
returns exact leaf/fragment failures. Catalogue apply never substitutes an
unconditional success command: an unbound generic Policy service is a named,
nonzero coverage gap.
[Current authorship proof](../reasoning/2026-10-14-closure-authorship-complete.md)

## Why

An earlier bulk pass produced hundreds of syntactically present placeholders.
D24 permits broad one-pass Policy authorship for this release, but only when the
content says what it owns and does not present untailored guidance as observed
repository coverage.

## Authorities and sources

- Frozen service obligation: [acceptance](../gate1/acceptance.md)
- Working authored-service contract: [technical specification](../gate2/technical-spec.md#56-authored-service-gate)
- D24 ruling: [intent-owner trace](../archive/2026-08/release-install-and-distribution.md)
- Production findings: [intent-owner trace](../archive/2026-08/release-install-and-distribution.md)
- D23, the one-release exception D24 later retired: [intent-owner trace](../archive/2026-08/gate-model-and-the-one-lock.md)

## Remaining work

Mechanical authorship and acceptance-evidence coverage are green. A fresh
exact-digest semantic review remains a release operation, and post-beta
promotion of individual leaves to repository Context or Evidence returns to the
ordinary owner-reviewed process.
