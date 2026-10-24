---
date: 2026-10-24
source: intent owner
topics: what-rig-is, the-two-gates, agent-working-conventions, onboarding-flow
decisions: NS-21, NS-22, NS-23
status: current
supersedes: 
tags: authorisation, traceability, gate1, open-source
summary: Owner approves the product direction, authorises bounded Gate 1 preparation (tests, fixtures, traceability validator, signer extension), makes one-to-one traceability a permanent Rig standard, and opens the local embedding engine choice to any suitable open-source candidate.
---

# Rig — Final Authorisation: Gate 1 Preparation and Parallel Implementation Handoff

## 1. Objective

I have reviewed the product definition, 79 atomic requirements, acceptance criteria, proving-test manifest, customer lifecycle, open-source inheritance plan and 11 implementation work packages.

**I approve the overall product direction and authorise the engineering work necessary to prepare the new AI-SDLC programme for Gate 1 signing.**

My intended workflow is straightforward:

1. I provide the product vision and settle meaningful product decisions.
2. Rig produces complete specifications, acceptance criteria and tests.
3. I personally review and sign the protected contract.
4. A capable coordinating agent decomposes implementation into independently executable work packages.
5. I manually launch parallel lightweight agents using prepared Markdown task briefs.
6. Those agents implement and test their assigned work on isolated branches or worktrees.
7. A coordinating agent integrates the work, resolves conflicts, maintains CI/CD and verifies the complete product.
8. The resulting product progresses through the established review, QA and release gates.

I do not want to manually supervise routine implementation, test maintenance, branch integration or CI/CD troubleshooting.

Those are responsibilities of the engineering agents.

The objective is a finished, polished, maintainable and publicly usable Rig product.

---

## 2. Authorisation: Complete Gate 1 Preparation

You are now authorised to perform the bounded implementation work required to make the new programme's acceptance contract executable and signable.

This includes:

- Writing the 79 planned proving tests.
- Creating the 29 test fixtures and necessary supporting infrastructure.
- Implementing the deterministic requirements-to-acceptance traceability validator.
- Extending the existing Gate 1 signer to support the new AI-SDLC programme.
- Preserving the existing 6.0.0 oracle and signing behaviour.
- Adding signing and signature-verification tests.
- Running the proposed tests against the current baseline.
- Establishing meaningful preimplementation failure evidence.
- Running existing regression tests to ensure Gate 1 preparation has introduced no unintended changes.
- Preparing the exact signing manifest and signing instructions.

This authorisation is specifically for **contract preparation, verification and the necessary supporting infrastructure**.

It is not general authorisation to implement all 11 product work packages.

Do not sign the contract on my behalf, commit, push, deploy or trigger restricted external reviews without the required subsequent authorisation.

### Testing requirements

The proving tests must inspect actual observable behaviour or persisted evidence, not merely echo implementation return values.

Establish the existing baseline before adding the new tests.

Missing product capabilities should produce meaningful expected failures in a separate evaluation lane rather than making the existing repository CI permanently red.

The new product's acceptance failures must not be confused with regressions in the existing Rig baseline.

Run the relevant local test suites and report the outcomes precisely.

---

## 3. Permanent Rig Standard: One-to-One Requirements Traceability

I want to make this an explicit **product-wide invariant**.

Every independently testable requirement must have one primary acceptance criterion, and every acceptance criterion must have an identified executable proving test.

The default mapping is:

**Requirement → Primary Acceptance Criterion → Proving Test → Verification Evidence**

For example:

`R-052 → AC-052 → PT-052 → Test Evidence`

Additional boundary tests, security tests and end-to-end scenarios may supplement the primary mapping.

Do not force complex behaviour into an artificially narrow test merely to preserve matching numbers. Instead, decompose compound requirements into atomic obligations.

This must become the default for every project using Rig—not merely for Rig's own product development.

### Required enforcement

The normal product-discovery and Gate 1 workflows must:

1. Generate atomic requirements with stable IDs.
2. Derive acceptance criteria from those requirements.
3. Maintain a primary one-to-one requirement-to-criterion mapping.
4. Associate each criterion with executable proving tests.
5. Identify missing or orphaned relationships.
6. Connect requirements to relevant end-to-end customer journeys.
7. Prevent implementation planning when the protected traceability graph is incomplete.
8. Require an authorised amendment when protected requirements change after signing.

Implement a deterministic validator for this relationship.

Integrate that validator into Rig's canonical corpus, normal routing and Gate 1 pre-flight procedure.

Ensure it is included in the installed product and works across supported host agents.

It must not remain a convention used only by the current project.

**This is a permanent AI-SDLC engineering standard.**

---

## 4. Open-Source-First Model and Memory Strategy

I want to reinforce our engineering philosophy:

**Do not reinvent existing AI or machine-learning infrastructure.**

We are not developing new foundation models, training our own embedding models or inventing semantic-search algorithms where mature open-source implementations already exist.

Use the strongest suitable existing implementations.

For local semantic memory search, investigate lightweight, well-supported pretrained open-weight embedding models and established inference libraries.

Include Chinese open-source model ecosystems where relevant, alongside other strong candidates.

The current Transformers.js and MiniLM proposal is a valid starting candidate, not a mandatory final choice.

### Selection criteria

Prioritise:

- The smallest complete solution that satisfies our acceptance tests.
- Appropriate open-source licences and redistribution rights.
- Fully offline inference.
- No mandatory paid provider.
- No required external model download after installation.
- Compatibility with the supported host operating systems.
- Minimal runtime and transitive dependency footprint.
- Reliable meaning-based retrieval with source citations.
- Straightforward versioning, integrity checking and upgrades.
- Low memory usage and acceptable inference latency.

Benchmark complete installed size, not merely model-weight size.

Consider tokenizer assets, inference runtimes, native binaries and platform-specific packages.

Reuse an existing semantic-search library and pretrained model wherever possible.

A simple solution that passes our acceptance tests is preferable to a sophisticated but unnecessarily complicated architecture.

Do not introduce a new vector database, background daemon, model-serving framework or provider dependency unless the requirements genuinely justify it.

**The goal is to reuse established open-source engineering, not reproduce it under Rig's name.**

Retain the requirement that the public product supports offline meaning-based memory retrieval by default.

The technical implementation remains open to change so long as it passes the protected contract.

---

## 5. Signing Procedure and Owner Control

Once the executable tests and contract manifest are ready, I want you to give me exact, reproducible instructions for signing.

Use the existing Gate 1 trust root.

Do not create another independent signing authority.

Support the established SSH signing mechanism and verify the hardware-backed `sk-ssh-ed25519@openssh.com` path where the required device is available.

### Required signing handoff

Provide:

1. The exact protected files and digests.
2. The complete requirement/acceptance/test traceability audit.
3. Evidence from the preimplementation baseline.
4. Confirmation that the existing 6.0.0 oracle remains unchanged.
5. The exact command or procedure I must execute.
6. Any required security-key interaction.
7. The verification command to run after signing.
8. The expected successful result.
9. Clear recovery instructions if signing or verification fails.

If the hardware key is unavailable, report the exact limitation.

Do not fabricate hardware-verification evidence or substitute an unauthorised key.

Do not require me to understand the internal signer implementation to execute the signing ceremony.

I want to follow the instructions, sign the contract, verify the result and proceed.

---

## 6. After Signing: Prepare the Parallel-Agent Execution System

Once I have signed the contract, I want a complete implementation handoff that I can use to launch multiple parallel agents myself.

The implementation should be orchestrated by one high-capability coordinating agent, with bounded work assigned to lightweight agents wherever appropriate.

I will personally decide when to start those agents.

Do not launch them automatically before I authorise implementation.

### Coordinator responsibilities

The coordinating agent must:

- Verify the signed contract.
- Inspect the current codebase and architecture.
- Read the approved 11-work-package roadmap.
- Identify task dependencies.
- Break the work into appropriately sized execution units.
- Determine which tasks can proceed in parallel.
- Assign non-overlapping file ownership or isolated worktrees.
- Select suitable model capability tiers.
- Prepare complete task briefs.
- Validate worker results independently.
- Integrate completed branches safely.
- Maintain CI/CD and repository hygiene.
- Re-run regression and acceptance checks.
- Report genuine blockers rather than repeatedly asking routine technical questions.

The coordinator must not allow worker agents to modify the signed requirements, acceptance criteria or proving-test oracle.

### Lightweight worker responsibilities

Each worker must operate within a precise, bounded scope.

Workers should receive only the information necessary to perform their task.

Use inexpensive models for mechanical, well-defined work.

Escalate difficult architecture, security or integration decisions to the coordinator.

Do not use an expensive reasoning model for work that a deterministic script or inexpensive agent can perform correctly.

---

## 7. Generate Self-Contained Markdown Handoff Files

This is a specific deliverable I want.

After Gate 1 signing and before implementation begins, the coordinator should generate a directory containing standalone Markdown instructions for each parallel worker.

These files must be sufficiently complete that I can copy one into a new isolated agent session and have that agent begin its assigned work without reconstructing the entire planning history.

Use a structure conceptually similar to:

```text
rig-implementation-handoff/
├── README.md
├── COORDINATOR.md
├── EXECUTION-ORDER.md
├── INTEGRATION-PLAN.md
├── CI-CD-PLAN.md
├── workers/
│   ├── WP01-contract.md
│   ├── WP02-vertical-workflow.md
│   ├── WP03-memory.md
│   ├── WP04-profile-onboarding.md
│   ├── WP05-model-routing.md
│   ├── WP06-parallel-safety.md
│   ├── WP07-verification.md
│   ├── WP08-knowledge-recovery.md
│   ├── WP09-self-improvement.md
│   ├── WP10-public-install.md
│   └── WP11-release-readiness.md
└── verification/
    ├── acceptance-coverage.md
    └── integration-checklist.md
```

The actual filenames and package boundaries may be refined according to the dependency graph.

### Each worker brief must include

- The objective and expected user-visible outcome.
- Relevant signed requirement IDs.
- Acceptance criteria and proving tests.
- Dependencies and prerequisites.
- Files and modules the worker is authorised to modify.
- Explicit out-of-scope work.
- Existing Rig functionality to reuse.
- Relevant pinned open-source components.
- Implementation constraints.
- Security and trust boundaries.
- Required focused and regression tests.
- Expected output artefacts.
- Completion and handoff instructions.
- The branch/worktree arrangement.
- What constitutes success or a blocker.

Each brief should be concise but sufficiently self-contained.

The coordinator's handoff must explain the order in which tasks can be launched.

A work package with unmet dependencies should not be presented as immediately runnable.

---

## 8. Parallel Branches, Integration and CI/CD

I want parallel workers to operate safely without corrupting one another's changes.

Prefer isolated Git worktrees or equivalent branch isolation.

Each worker should have clearly scoped ownership.

The coordinator should maintain a dependency graph and integration sequence.

Where tasks share interfaces or files, establish the required contract before launching dependent workers.

### Integration responsibilities

After workers complete their assigned tasks, the coordinator should:

1. Collect the branches and evidence reports.
2. Verify that their work satisfies the assigned requirements.
3. Reject incomplete or unverified worker output.
4. Merge changes in dependency order into a dedicated integration branch.
5. Resolve legitimate integration conflicts without silently discarding behaviour.
6. Run the affected tests after each integration.
7. Run the complete applicable test suite on the integrated result.
8. Maintain build and CI configuration.
9. Resolve CI failures attributable to the integrated changes.
10. Verify end-to-end customer journeys.
11. Preserve exact-commit evidence for subsequent release gates.

No worker should certify its own work merely by reporting success.

The coordinator is responsible for integration quality, and independent review must remain part of the release process.

### CI/CD ownership

I do not want to manually maintain pipelines or troubleshoot routine build failures.

The engineering agents should handle:

- Build configuration.
- Test integration.
- CI workflows.
- Dependency and licence checks.
- Security checks.
- Clean-install testing.
- Platform compatibility testing.
- Regression verification.
- Release evidence collection.

Protected publishing, production deployment and other restricted operations must still respect the existing authorisation model.

Do not confuse automated CI/CD maintenance with unrestricted deployment authority.

---

## 9. Preserve the Existing Work and Product Vision

Do not restart the programme.

Preserve:

- The 79-requirement contract proposal.
- Existing acceptance and test mappings.
- The 29 proposed test fixtures.
- The complete customer lifecycle.
- Architecture and interaction diagrams.
- Source-level open-source inheritance research.
- The 11-work-package roadmap.
- The locally verified review-state-machine changes.
- The settled engineering decisions.
- The separate 6.0.0 release track.

Any changes to these planning artefacts should be purposeful and traceable.

Do not expand scope merely because additional interesting technology exists.

**Our goal is not to build an elaborate AI research project. Our goal is to deliver a reliable AI-SDLC product.**

Continue applying the existing principles: minimal code, reuse before reinvention, deterministic verification, bounded model usage and explicit evidence of correctness.

---

## 10. Immediate Definition of Done

For the work I am authorising now, completion means:

1. All 79 proving-test obligations have executable implementations or explicitly identified environment-bound test lanes.
2. The corresponding fixtures exist and test genuine observable behaviour.
3. The deterministic requirement-to-acceptance-to-test validator is implemented.
4. That validator is incorporated into Rig's standard workflow.
5. The new programme can be selected by the existing Gate 1 signing mechanism without altering the previous signed oracle.
6. Signing and verification procedures are tested to the extent the environment permits.
7. The preimplementation baseline is recorded accurately.
8. Existing repository regression tests continue passing.
9. The existing uncommitted work and separate release track are preserved.
10. I receive a clear and concise signing handoff.

The agent should explicitly distinguish executable tests, environment-dependent tests, and tests that cannot yet be run.

Do not mark a capability implemented merely because its acceptance test has been written.

### Final report

At completion, tell me:

**A. What changed:** The implementation and test files added or modified.

**B. What passed:** Existing regression tests, traceability audit, signing tests and baseline checks.

**C. What is intentionally failing:** New acceptance tests for functionality not yet implemented.

**D. What remains unverified:** Including real hardware signing or offline inference compatibility where applicable.

**E. How I sign:** Exact steps for the Gate 1 ceremony.

**F. What happens afterward:** The coordinator handoff preparation, parallel work-package sequence, and authorisation needed to begin implementation.

Do not produce another broad product-design cycle.

The product definition has reached the point where the next useful work is making its contract executable and signable.

**Proceed with the authorised Gate 1 preparation now. Stop before signing or general product implementation and return the verified signing handoff to me.**

---

## Long-Term Execution Principle

The intended operating model is:

**Product owner defines and signs → Coordinator plans and delegates → Lightweight agents implement → Coordinator integrates and verifies → Rig enforces the SDLC → Product becomes release-ready.**

I want to make product decisions once, sign the acceptance contract, and then rely on well-coordinated engineering agents to deliver the implementation.

The system should handle standard software engineering responsibilities without requiring me to continually direct every technical step.

That is what Rig is meant to achieve.