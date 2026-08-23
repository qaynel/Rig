# The authored-service gate

## What it is

All 115 catalogue leaves must carry service-specific identity, owned scope,
applicability, disposition, cumulative grade behavior, checks, slices, and
evidence targets. Presence alone is not authorship.

## Current implementation

Every non-lint leaf is explicitly Policy-grade generic baseline practice and
states that it is not tailored to the installing repository. Identity fragments
name exact owned scopes, exclusions, applicability signals, disposition, and
dependencies. Grade fragments name leaf-specific boundary,
repository-context, and evidence-receipt checks. Each catalogue entry carries
distinct minimal/mid/maximal acceptance targets with explicit given/pass/fail
conditions. Slice fragments state the owned invariant and the checks they
activate. Lint/format retains its separately authored Context and Evidence
behavior.

The deterministic gate opens every declared file and rejects missing or empty
markdown, placeholders, the previous repeated boilerplate phrases, generic
`core / extended / thorough` check identifiers, omitted owned/applicability
metadata, omitted dispositions, missing grade checks, and duplicate bodies. It
returns exact leaf/fragment failures. Catalogue apply never substitutes an
unconditional success command: an unbound generic Policy service is a named,
nonzero coverage gap.

## Why

An earlier bulk pass produced hundreds of syntactically present placeholders.
D24 permits broad one-pass Policy authorship for this release, but only when the
content says what it owns and does not present untailored guidance as observed
repository coverage.

## Authorities and sources

- Frozen service obligation: [acceptance](../gate1/acceptance.md)
- Working authored-service contract: [technical specification](../gate2/technical-spec.md#56-authored-service-gate)
- D24 ruling: [intent-owner trace](../reasoning/2026-08-21-mvp-agent-discretion-build.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)

## Remaining work

Mechanical authorship and acceptance-evidence coverage are green. A fresh
exact-digest semantic review remains a release operation, and post-beta
promotion of individual leaves to repository Context or Evidence returns to the
ordinary owner-reviewed process.
