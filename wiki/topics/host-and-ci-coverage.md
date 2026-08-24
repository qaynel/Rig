# Host and CI coverage

## What it is

Host onboarding is detection-driven and CI integration is separately approved.
No absent host tree is inferred. The CI roster is exactly GitHub Actions,
GitLab CI, CircleCI, Jenkins, Buildkite, and Azure Pipelines.

## Current implementation

All six CI providers now render a provider-visible repository check and apply
it through a bounded additive path. Compatible existing configuration keeps its
unrelated bytes, approved absent-provider bootstrap creates the canonical file,
repeat apply is byte-stable, and every mutation is journaled for teardown. The
job runs `.rig/bin/check.js --scope repo`, requests no repository secrets, and
does not upload local finding detail.

Provider evidence is a first-wire matrix that seeds compatible user config,
plans with separate approval, applies twice, preserves the sentinel, and checks
the repository command at the provider path. Unknown CI markers remain
byte-identical and unverified until a supported provider is selected.

Host discovery still uses the 19-host registry and exact marker provenance.
The withdrawn verified/unverified tier is absent from registry state. Each host
has separate `instruction`, `native_skill`, `shell_hook`, `web_hook`,
`mcp_hook`, and `mcp_config` contracts that name its vendor path, event, input
schema, matcher, denial/exit behavior, namespace, merge boundary, and
first/repeat apply behavior. Git and CI remain separate deterministic
surfaces. Unsupported axes are explicit no-emit contracts rather than inferred
gaps. Inspection discovers all marker-present hosts by default and records the
marker provenance; an explicit host remains a compatibility override.
The neutral payload is independent of host detection, so bare repositories get
the complete neutral product without receiving `.claude`, `.agents`, or other
fabricated host trees.

Hermes is a first-class host surface, not a candidate to prune: the root
`plugin.yaml` and `__init__.py` are Rig's Hermes plugin, and its test suite —
including the `.venv`/pandas-backed benchmark import — is part of the supported
`npm test` run, not a thing to deprecate or relocate.

## Authorities and sources

- Frozen host/CI intent: [business specification](../gate1/business-spec.md)
- Working contracts: [technical specification](../gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path)
- Captured provider research: [host/CI reference](../sources/reference/host-ci-capability-verification.raw.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)
- Hermes first-class ruling: [intent-owner trace](../reasoning/2026-08-20-hermes-first-class.md)

## Remaining work

No CI-provider or shared-host-contract implementation blocker from the
production findings remains. Fresh release review still judges the final bytes
together with the rest of the product.
