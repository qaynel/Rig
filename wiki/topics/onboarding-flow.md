# Onboarding flow

## What it is

Rig installs one central corpus and starts an agent-led adaptation flow:
`inspect → host review → recommend → plan → apply → check`. Install projects
the required Rig entry skills and any deterministic host entrypoints. It does
not inspect repository meaning or choose optional capabilities. After install,
the repository's own agent invokes `rig-onboarding`, reads the shipped
instructions, examines the existing setup, and proposes the smallest useful
set of additions. The person approves the exact proposal before repository
files change. [Onboarding instructions](../../rig/corpus/onboarding/README.md) ·
[unpack playbook](../../rig/corpus/onboarding/unpack.md)

The agent accounts for existing skills and rules, reuses equivalent setup,
selects only capabilities that close a real gap, and grafts additions into
marked sections of existing instruction files. It can omit irrelevant Rig
guidance. Rig code enforces paths, ownership, approval, and byte integrity; it
does not infer what the repository needs. For a host without a shipped
projector, the agent prepares a deterministic projection script for review and
approval. [North star](../../CLAUDE.md) · [projection playbook](../../rig/corpus/onboarding/unpack.md)

## Optional skills and services

The installed catalogue records available skills without placing optional skill
trees in agent discovery. If the approved proposal selects a third-party skill,
Rig fetches its pinned upstream resources during apply, verifies the expected
digests, applies the recorded local patches, and projects only the selected
skill. A missing upstream or digest mismatch is reported as a named gap. The
same proposal selects applicable catalogue services and their grades; service
guidance states its coverage ceiling and is grafted only after approval.
[Fetch contract](../reasoning/2026-10-13-corpus-03-slice4-upstream-fetch.md) ·
[service offers](../reasoning/2026-10-14-closure-onboarding-service-offers.md)

## Why it is this way

Inspection precedes recommendation so untrusted repository instructions do not
control the process. A content-bound plan separates advice from authority and
lets apply enforce the approved bytes rather than rediscover intent. Typed,
journaled grafts preserve surrounding user content and support removal.
[Gate 1](../gate1/business-spec.md) ·
[Gate 2 onboarding flow](../gate2/technical-spec.md#6-staged-onboarding-data-flow) ·
[graft mechanics](graft-mechanics.md)

## What is proven

- `tests/path-b-install.test.js` verifies the public install projects the
  onboarding entrypoint, leaves repository instructions untouched, and waits
  for the agent and user approval before adapting the repository.
- `tests/path-b-catalog.test.js` verifies the pinned catalogue is deterministic,
  optional skill trees are not staged by install, and only required entry
  skills are discoverable before approval.
- `tests/path-b-onboarding.test.js` verifies an approved proposal projects a
  selected skill and writes only a marked graft.
- `tests/upstream-shelf.test.js` verifies the pinned fetch reproduces the
  optional skill resources without trusting an installed vendored fallback.
- `tests/path-b-hardening.test.js` covers proposal byte binding, tampering,
  scope, and safe removal.

## What was rejected

Install-all-then-prune, automatic remediation, a user-facing skill picker, and
per-host policy matrices were rejected. The host agent uses repository context
to make routine adaptation choices and escalates consequential decisions;
Rig's installer remains deterministic. The earlier design history is retained
for provenance in the [August onboarding archive](../archive/2026-08/path-a-and-path-b-onboarding.md).

## Proposed profile transfer

The AI-SDLC expansion adds a portable developer preference/workflow profile to the existing agent-led graft. Import is untrusted, scoped data; the agent reports conflicts with local conventions and never transfers project acceptance, secrets or signer authority. The 8 KB active view is generated from richer source records, so export does not lose history. This is proposed, not shipped. [Product-first directive](../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md) · [profile specification](../specs/ai-sdlc-harness/03-capabilities.md)

The [final-definition directive](../reasoning/2026-10-24-final-product-definition-owner-directive.md)
extends the planned journey through public installation, upgrade, removal and
transfer. The [architecture checkpoint](../reasoning/2026-10-24-final-product-architecture-checkpoint.md)
and [complete lifecycle](../specs/ai-sdlc-harness/17-customer-lifecycle.md)
specify those outcomes without claiming they are shipped.
The [planning handoff](../reasoning/2026-10-24-final-product-planning-handoff.md)
separates this proposal from the existing install/release evidence.
The [coverage refinement](../reasoning/2026-10-24-final-product-coverage-refinement.md)
is the current planning checkpoint.
The [offline-search owner ruling](../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
adds packaged local inference assets to the proposed public install. Its clean
install must provide meaning-based, cited recall without network access or a
provider account; the existing bootstrap has not yet implemented this.

## What remains

The onboarding flow is implemented. QA-to-production readiness is governed by
the exact-commit checks in the [change-management policy](../../rig/corpus/standards/change-management.md)
and the [release eligibility workflow](../../.github/workflows/release-eligibility.yml).

The [documentation corrections](../reasoning/2026-10-17-documentation-review-corrections.md)
align the install guide, product overview, diagrams and translations with this
single proposal/approval flow. Services and grades are selected in the proposal;
`.rig/state.json` records onboarding state. `rig.json` describes the legacy
configurator, not a second picker after approval.

The [late review resolution trace](../reasoning/2026-10-17-review-received-resolution-late-findings.md)
records that default public installs and v5 upgrades do not install optional MCP
dependencies; that requires the explicit OpenClaw opt-in.

The current closeout correction preserves pinned executable modes, validates
the fetched provenance receipt during check, projects shared approved helpers
only with an optional selection, and removes deselected service bindings from
ordinary checks. [Remediation trace](../reasoning/2026-10-18-qa-closeout-remediation.md)
