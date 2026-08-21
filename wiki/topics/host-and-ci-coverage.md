# Host and CI coverage

## What it is

Every host axis and CI provider follows one uniform emission contract. A host
axis is either `emitted`, with a complete adapter contract and passing
byte-landing test, or `unsupported`, with vendor evidence that no surface exists.
CI integrates additively and never guesses a provider. [Gate 2 §11](../gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path)

## Why it is this way

An earlier verified/unverified tier advertised a distinction Rig had not
implemented and encouraged per-host claims that automated evidence could not
support. The 2026-08-17 amendment removed the tier and made build set equal
release set: correct bytes at correct paths are the release evidence, while the
single registry header states that enforcement has not been observed firing.
[Timeline](../index/timeline.md#2026-08-17--the-host-tier-amendment)

## What binds it

`AD-13`, `AD-17`, `AD-23`, and `AD-24` define uniform host and CI paths. D1–D3
are explicitly unwound. Host/CI acceptance cases require exact rosters,
preservation, real fixtures, provider choice, and byte landing. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Verified/unverified tiers, per-host claim strings, hard-coded advertised lists,
promotion events, acknowledgement prompts, umbrella citations, and advisory-only
CI verification were rejected. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen uniform-path intent: [Gate 1 §2](../gate1/business-spec.md)
- Host and provider contracts: [Gate 2 §11](../gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path)
- Captured evidence: [host/CI reference](../sources/reference/host-ci-capability-verification.raw.md) and [config-surface reference](../sources/reference/host-config-surfaces-verification.raw.md)
- Hermes first-class plugin ruling: [reasoning trace](../reasoning/2026-08-20-hermes-first-class.md)

## What is still open

No host axis currently has the complete candidate contract, and all six CI
providers need adapter/fixture evidence. **The `verified` disambiguation is
resolved (2026-08-21):** Gate 2 §1/§11.1 now record three distinct senses — the
banned host/axis *tier* badge, the control/tool evidence status (§8.9), and Gate
1 `AT-BASE-2`'s "verified enforcement surface" (a host that exposes a mechanical
hook, expressed internally as `emitted`/`gap`/`unsupported` and never a
user-facing per-host claim). `AD-26` amended.
[Gate 2 re-trace trace](../reasoning/2026-08-21-gate2-lint-format-retrace.md)
[Status](../status.md)

For lint-format specifically, the Evidence level is what runs enforcement in CI,
whole-scope at the gate (`GA-30`). It applies the additive contract above:
integrate into verified existing CI rather than owning the pipeline; where CI is
absent or of an unsupported provider, propose a pipeline as an explicit separate
plan the user approves after choosing the provider — never auto-create on
selection alone; and preserve, never silently rewrite, a pipeline Rig does not
understand.
[reasoning trace](../reasoning/2026-08-21-lint-format-ci-behavior.md)

Repository-CI applicability is **grade-aware** (Gate 2 v0.8, §8.9/§11.2/§11.3):
a selected executable service runs in the Rig CI job only when it is CI-applicable
at its active grade, a property of the grade rather than of whether a Rig CI job
happens to exist. Lint-format is CI-applicable only at Evidence, so a Policy- or
Context-grade leaf stays out of a pre-existing Rig CI job and gains no CI
enforcement from another control's presence.
[reasoning trace](../reasoning/2026-08-21-gate2-v0.7-round4-corrections.md)

D22 moves that qualifier into Gate 1: `AT-CI-3` now says selected executable
services run in CI only when they are repo-CI-applicable at their active grade.
That keeps `AT-CI-3` and lint-format's `AT-LF-13` aligned without raising Policy
or Context lint-format installs into CI.
[reasoning trace](../reasoning/2026-08-21-evidence-only-lint-format-ci.md)
