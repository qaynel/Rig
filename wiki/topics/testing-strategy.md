# Testing strategy

The current hubs were shortened to restore the wiki budget without extending
waivers. [Budget trace](../reasoning/2026-10-14-closure-wiki-budget.md)

Current changes are summarized in the linked traces: the 115-service authored-content matrix and gate pass ([authorship proof](../reasoning/2026-10-14-closure-authorship-complete.md)); new timed subprocesses use the shared process-tree guard ([guard](../reasoning/2026-10-14-closure-spawn-guard.md)); lint setup is exercised through the installed CLI and needs no frozen amendment ([setup](../reasoning/2026-10-14-closure-installed-lint-setup.md), [amendment check](../reasoning/2026-10-14-closure-no-lint-amendment.md)); exact-SHA E2E awaits a clean committed candidate ([SHA blocker](../reasoning/2026-10-14-closure-e2e-sha-blocked.md)) and its package entry awaits the owner pin ([candidate](../reasoning/2026-10-14-closure-e2e-script-candidate.md)). The coherence command runs executed-test evidence ([gate](../reasoning/2026-10-14-closure-evidence-gate-wired.md)); its suite-level integration is red on open tracker, documentation, and evidence findings ([trace](../reasoning/2026-10-14-closure-coherence-gate-red.md)). Weekly health workflow checks are summarized [here](../reasoning/2026-10-14-closure-health-workflow.md).

The final sweep confirms the same owner, documentation, and evidence blockers. [Sweep trace](../reasoning/2026-10-14-closure-coherence-sweep-blocked.md)

## What it is

Gate 1 freezes acceptance behavior; tests execute that behavior through the same boundaries used by the product. Local work uses the smallest relevant test file, while CI runs the full gate. A passing test must execute, assert the intended result, and fail on a meaningful violation. [Gate 2 §9.2 and §13–14](../gate2/technical-spec.md#13-acceptance-traceability)

## Why it is this way

Inventory, file presence, source text and exit status alone can all pass while behavior is broken. Exact identity, observable effects, failure cases and installed-path coverage make omissions visible. [Known traps](../index/traps.md)

## What binds it

G7–G9 define TDD, debugging and independent review; AD-18 drives the executable oracle. Each Gate 2 §13 acceptance row names a mechanism and target. [Foundational decisions](../sources/logs/grill-decisions.md) · [acceptance index](../index/acceptance-cases.md)

## Lessons retained

- Test the installed path as well as library seams; the fresh-checkout MCP prerequisite is recorded in the [AT-HOME-1 closeout](../archive/2026-08/review-receipts-and-test-infrastructure.md).
- Reproducibility checks must vary the external factor that can drift; see the [tree-digest test](../reasoning/2026-09-02-catalogue-tree-digest-reproducibility.md).
- Fault injection must match the current recovery boundary, and a separate test should catch real regressions the frozen oracle misses. The review sequence is summarized in [test ratchets](../reasoning/2026-09-03-onboarding-hardening-oracle-review.md) and the [review/context-burn finding](../reasoning/2026-09-04-structural-workflow-fix-design.md).

## What was rejected

Implementation-authored acceptance, title-only evidence, trusting exit status, file-presence checks, no-op bindings, and treating missing targets as pass. Frozen tests change only through the owner's signed amendment. [Rejected approaches](../index/rejected.md)

## Authorities

- Frozen oracle: [Gate 1 acceptance](../gate1/acceptance.md)
- Traceability: [Gate 2 §13–14](../gate2/technical-spec.md#13-acceptance-traceability)
- Captured sources: [testing pipeline](../sources/reference/testing-pipeline-vision.raw.md), [mutation taxonomy](../sources/reference/mutation-testing-taxonomy.raw.md)
- Fixture prerequisite: [AT-HOME-1](../archive/2026-08/wiki-and-agent-working-conventions.md)

The current executed-test evidence gate is called by check-coherence.js; its remaining failures are recorded in the linked current-state trace above. The final gate is npm test, reserved for the release task that requires it.
