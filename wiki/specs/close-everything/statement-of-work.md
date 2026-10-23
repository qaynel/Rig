# Rig 6.0.0 — statement of work

**Date:** 2026-10-13; reconciled 2026-10-17. **State:** release candidate;
signed-oracle verification passes; exact-byte release evidence pending.
**Objective:** ship the coherent closure release defined in the
[specification sheet](specification-sheet.md), through one branch and one PR to
`qa-prod`, then promote to `prod`. The [master ledger](00-master-plan.md)
retains item ownership and disposition. This is an engineering SOW; dates,
fees and commercial commitments have not been agreed.

## Scope and deliverables

| Work package | Deliverable | Completion evidence | Detailed plan |
|---|---|---|---|
| Reconcile the backlog | Accurate issue/board/ticket mapping, verified prior fixes, reopened premature closures and one redesign backlog. | Every item has a disposition and evidence; candidate transitions are valid and final live states agree after publication and smoke testing. | [Tracker sync](01-tracker-sync.md) |
| Resolve concrete bugs | Eight fixes covering uninstall, command permissions, durable approval evidence, diagnostics and process cleanup. | Each behavior reproduces red before the fix and passes afterward; fetched third-party patches are exercised. | [Bug fixes](02-bug-fixes.md) |
| Establish the corpus | One canonical `rig/corpus/`, shared projections, agent onboarding instructions, pinned upstream metadata and a resumable v5 upgrade. | Projection/write-contract parity, exact removal, preserved user content, safe script boundaries and already-onboarded upgrade cases. | [Central corpus](03-central-corpus.md) |
| Finish catalogue capabilities | Specific guidance, detection, executable checks, good/bad fixtures and onboarding hooks for all original capabilities; compatible documented merges where justified. | Installed selection/approval/binding/check evidence, nonzero executed checks, all-grade and dependency-slice proofs, explicit tool gaps. | [Catalogue services](04-catalogue-services.md) |
| Complete lint/format setup | Preserve existing tools; separately approved setup/replacement with original config retained through the journal. | Four user outcomes plus conflict, shared-config and interrupted undo cases. | [Lint/format setup](05-lint-format-setup.md) |
| Prove clean installation | Candidate artifact input to the public installer, real-download clean-runner E2E and post-release tagged-download verification. | Green Linux/macOS runs bound to SHA/archive digest; actual MCP call, approved service execution and full uninstall baseline comparison; deliberate breakages go red. | [Clean-install E2E](06-clean-install-e2e.md) |
| Ship AI development standards | Standards enforced in Rig and available through approved corpus grafts. | Every enforced rule names a runnable shipped check; existing target docs survive. | [AI standards](07-ai-sdlc-standards.md) |
| Maintain coherence and health | Final sweep, permanent coherence checks, weekly health, dependency audit/lockfile validation and visible failure reporting. | Adversarial coherence cases fail, health reporting opens/updates its issue, and QA-ref automated checks pass. | [Coherence and upkeep](08-coherence-and-upkeep.md) |
| Finish user documentation | README, install/upgrade/removal guide, troubleshooting, current translations and a one-page shipped-product vision. | Docs match current commands/version/behavior; the documented install flow is verified. | [Docs and vision](09-docs-and-vision.md) |
| Review, sign and release | Security review, fresh final review receipt, one owner-applied/signed amendment bundle, green PR, tracker closure, QA promotion and tagged release. | Matching final digests, full gate and automated exact-QA-commit health/E2E evidence; successful public tagged download. | [Review, sign, ship](10-review-sign-ship.md) |

## Delivery sequence

1. Reconcile inventory and establish unsigned reproductions/candidate checks.
   Resolve the eight bug items before changing shared install/lifecycle seams.
2. Build the corpus spine through expand, migrate and contract. Verify it
   before dependent service/standards work and before removing legacy sources.
3. Finish catalogue work in development, testing, product-security and
   infrastructure batches. Lint setup, E2E and standards may proceed on the
   stable spine; coordinate ownership at shared seams and review each batch.
4. Finish documentation and release metadata, including 6.0.0 and CHANGELOG;
   run the final coherence sweep and prepare candidate tracker transitions.
5. Resolve security/code-review findings and present the exact protected-file
   amendment bundle. The owner applies it and signs once. Agents never sign.
6. Run the local full gate, then obtain fresh review evidence bound to the final
   bytes and exact-candidate install E2E. Use the single PR to `qa-prod` with
   required CI and signature checks green.
7. Deliver the checked changes to QA. Keep tracker closures prepared until the
   tag and post-publication smoke test, per the owner's 2026-10-17 answer and
   the change-management policy. Earlier verified fixes and redesign items
   follow that same closure order.
8. Promote the exact QA commit after automated health/full-gate/coherence and
   real-download E2E pass. Publish the matching tag/release and verify the
   public tagged installer. No outside-repository manual install gate applies.
   Only then close trackers with the delivered SHA, proving tests or written
   redesign rationale.

Use one commit per coherent slice, focused test runs in the implementation
loop, and reasoning traces at subplan boundaries and at least every three
minutes of active multi-step work. No calendar or effort estimate is implied
by this dependency order; volume is driven chiefly by catalogue completion.

## Verification entrypoints

Extend existing suites at the relevant seams rather than creating a test
framework. These are execution entrypoints, not claims that today's suites
already prove the new requirements. The coherence script and E2E command are
planned deliverables; protected-case amendments run in the advisory candidate
copy until the owner applies and signs them. Each slice records its actual
focused command, red result and green result in its handover.

| Work package | Focused command or required CI evidence |
|---|---|
| Tracker sync | `node --test tests/ticket-traceability.test.js`; planned `node scripts/check-coherence.js` with live read-only tracker access. |
| Bug fixes | `node --test tests/install-uninstall-roundtrip.test.js tests/advanced-lint-format.test.js`; process-cleanup CI jobs on the applicable Windows/Linux runners. |
| Corpus and upgrade | `node --test tests/rig-bootstrap.test.js tests/path-b-onboarding.test.js tests/install-uninstall-roundtrip.test.js`. |
| Catalogue | `node --test tests/advanced-catalogue.test.js tests/path-b-catalog.test.js`, extended with installed per-service/grade fixtures. |
| Lint/format setup | `node --test tests/advanced-lint-format.test.js tests/semantic-lint-format.test.js`, extended with setup/reversal cases. |
| Clean install | Planned `npm run test:e2e` on the exact candidate artifact; green Linux/macOS workflow artifacts and post-publication smoke evidence. |
| Standards | `node --test tests/ticket-traceability.test.js tests/path-b-onboarding.test.js`, extended with actual-evidence and standards-graft cases. |
| Coherence/upkeep | Planned `node scripts/check-coherence.js`; `node --test tests/wiki-budget.test.js`; explicit-QA-ref health run and its failure-reporting proof. |
| Docs | Planned `node scripts/check-coherence.js`; `node scripts/check-versions.js`; recorded documented-install verification. |
| Release | `npm test` locally before push; final `gate1-pin`, review receipt, candidate E2E and exact-QA-commit health evidence. |

## Responsibilities and dependencies

| Role | Responsibility |
|---|---|
| Intent owner | Own settled scope and any later product changes; review/apply protected amendments and perform the single final signature. |
| Implementation author | Implement the smallest correct changes, preserve frozen originals and user data, supply runnable evidence, maintain wiki/docs and coordinate shared-file ownership. |
| Independent reviewer | Review spec, correctness, architecture and test gaps without mutating code; final review evidence describes the actual release bytes. |
| Release operator | Verify final checks, deliver through the agreed branch/PR path, reconcile live trackers, promote the proved QA commit and publish the matching release. |

Execution needs CI environments for Linux/macOS installer flows and the
Windows/Linux process-cleanup cases, upstream/registry network access for real
downloads, and read-only tracker access. Health reporting needs narrowly scoped
issue-write authority. Missing external service tools remain documented gaps.
The owner's signing key remains outside agent control. These are dependencies
to arrange during execution, not claims that this planning step has run them.

## Acceptance and evidence handover

Each work package hands over changed files, its proving test/run results,
relevant before/after behavior, documented coverage limits and a written review
disposition. Release evidence records the QA/PR SHA, candidate archive digest,
signature verification, final review digest, full-gate and E2E run links,
catalogue count/merge mappings, tracker dispositions and published tag.

All deliverables must meet the specification sheet and their detailed subplan
acceptance. A green empty service selection, source-only fixture checks, a
comment containing a test title, an old health run or a missing-tool silent
pass does not count as completion. GitHub close reason COMPLETED requires a
delivered fix; redesign closures carry the backlog rationale instead.

Before pushing, `npm test` must be green locally. During the owner-approved
single-signature build sequence, advisory candidate checks never replace or
soften the authoritative gate. Evidence is renewed after any relevant change.

## Scope control and exclusions

The six review decisions are settled: fetch upstream skill resources during
onboarding; use one corpus root; remove tier prose with a compatible flag for
one release; use available external tools; permit proven compatible duplicate
merges; and promote with automated exact-commit checks alone.

Never-started RIG-116, RIG-122, RIG-130, RIG-133 and RIG-156 move to the labelled
redesign backlog. The broader redesign, new support promises per host,
automatic scanner/cloud-tool installation and new commercial terms are not
deliverables. No item is dropped because it is difficult; a proposed replaced
disposition must name the replacement and justify preserved product value.

Routine technical refinements update the specification and affected subplan
together. Changes to business scope or signed acceptance return to the owner
process. This SOW authorizes no substitute for the final human signature.
