---
date: 2026-10-23
source: intent owner
status: current
topics: what-rig-is, the-two-gates, agent-working-conventions
checked: 2026-10-23
owner: rig-product-design
summary: Owner approves the 8 KB active ledger and settles the prior decisions while requiring a complete product journey, adaptive model routing, automatic trace retention, and source-level open-source integration.
---

# Rig — Product-First Architecture and Open-Source Integration Directive

## Objective: Define the Complete AI-SDLC Product Before Further Implementation

I want to correct the direction of the current initiative.

We have spent substantial effort discussing memory, review receipts, regression testing, signing, trace management and recursive self-improvement.

These are important capabilities, but **we are beginning to lose sight of the actual product we are building.**

Rig is intended to be an end-to-end, agent-facing **AI Software Development Lifecycle (AI-SDLC) harness**.

Its purpose is to take the procedural burden of software engineering away from the developer while preserving engineering rigour.

The developer should primarily contribute creativity, intent, requirements, product decisions and necessary authorisations.

The agents, using Rig, should handle the procedural engineering lifecycle: requirements elicitation, acceptance-criteria generation, specifications, implementation planning, execution, testing, review, evidence collection, delivery and continuous improvement.

The developer should not have to repeatedly remind the agent about standard software engineering practices.

That responsibility belongs to Rig.

**The success criterion for our current session is not additional implementation. It is reaching a complete, coherent and testable definition of the end product, including exactly how we will reuse the strongest open-source implementations to deliver it.**

Keep further feature implementation paused until that product architecture and scope are settled.

## 1. Return to First Principles

Before deciding how to implement any individual subsystem, establish:

1. Who is Rig for?
2. What problem does it solve for that person?
3. What does the complete user experience look like?
4. What responsibilities belong to the developer?
5. What responsibilities belong to the host agent?
6. What responsibilities belong to Rig?
7. How does Rig enforce an AI-SDLC without creating unnecessary user friction?
8. What existing open-source implementations already solve each component?
9. How do those components integrate into one coherent product?
10. What does successful end-to-end delivery look like?

Do not allow subsystem discussions to obscure these questions.

### The intended experience

Imagine a developer who uses AI to build software but does not want to personally administer the entire engineering lifecycle.

They have a product idea.

They describe it to their agent.

Rig ensures that the agent understands the objective, elicits missing requirements, generates meaningful acceptance criteria, obtains the necessary lock, develops an implementation strategy, executes the work, tests the result, manages reviews and presents delivery evidence.

Rig should automatically enforce good engineering practices without requiring the developer to become a project manager for the agent.

The experience should be opinionated but adaptable.

**Rig should impose rigour on the agent while minimising procedural work for the human.**

## 2. Define the Complete End-to-End Lifecycle

I want the entire customer journey specified, not merely individual capabilities.

At minimum, cover these phases.

### Phase A — Installation and dynamic onboarding

- Install Rig into an existing or new project.
- Discover the host agent, tooling, repository and environment.
- Inspect existing documentation and development infrastructure.
- Detect relevant skills, tests, policies and conventions.
- Import an existing developer profile where available.
- Reuse existing capabilities instead of duplicating them.
- Establish the required AI-SDLC behaviour with minimal configuration.

### Phase B — Product discovery and requirements

- Elicit the developer's intended product or change.
- Identify ambiguity and missing information.
- Ask only questions that materially affect correctness.
- Produce clear, structured requirements.
- Separate requirements from implementation choices.
- Preserve the developer's original intent.

### Phase C — Acceptance criteria and locking

- Generate testable acceptance criteria directly from the agreed requirements.
- Validate that the criteria genuinely represent the intended product.
- Present them for developer confirmation.
- Lock **requirements and acceptance criteria together** using the approved signing mechanism.

This is a critical architectural requirement.

**The implementation agent must not be able to alter acceptance criteria to make its own implementation appear successful.**

The technical specification comes after the lock and is derived from the frozen requirements and acceptance criteria.

A legitimate change to the locked contract requires an explicit amendment and reauthorisation, not silent rewriting.

### Phase D — Technical specification and execution planning

- Analyse the existing codebase.
- Inspect relevant dependencies and open-source alternatives.
- Choose the simplest architecture capable of satisfying acceptance.
- Produce the technical specification and scoped implementation plan.
- Identify dependencies, risks and suitable execution strategies.
- Delegate routine tasks to inexpensive models.

### Phase E — Implementation

- Execute the approved technical scope.
- Reuse existing functionality wherever possible.
- Follow established engineering conventions.
- Maintain traceability to requirements and acceptance criteria.
- Preserve unrelated user work.
- Keep implementation changes bounded and reversible.

### Phase F — Verification and review

- Run deterministic tests.
- Validate acceptance criteria independently.
- Perform substantive reviews where necessary.
- Persist reviewer findings and prior resolutions.
- Distinguish actual defects from infrastructure failures.
- Avoid wasting review authorisations.
- Prevent previously resolved defects from recurring.

### Phase G — Delivery and release

- Produce verifiable completion evidence.
- Identify outstanding blockers.
- Prepare clean commits and release artefacts.
- Explain remaining QA and production gates.
- Preserve required human authorisations for protected actions.
- Support handoff, deployment and post-delivery verification without inventing evidence.

### Phase H — Learning and continuous improvement

- Record meaningful interactions and outcomes.
- Detect repeated preferences, corrections and workflows.
- Convert useful patterns into reusable capabilities.
- Validate improvements against historical traces.
- Consolidate obsolete documentation and memory.
- Make learned behaviours portable across projects.

Specify the state transitions, inputs, outputs, failure recovery and responsibilities for each phase.

Do not assume every user needs to interact with every internal stage.

The aim is seamless agent-led execution with appropriate safety controls.

## 3. Make Model Routing a Foundational Capability

I do not want the main Opus-class agent spending expensive reasoning capacity on low-intensity repetitive work.

Rig should intelligently delegate tasks according to their complexity, risk and required quality.

### Low-cost subagents

Haiku-class or similarly inexpensive models should handle tasks such as:

- Wiki maintenance and compaction.
- Mechanical documentation updates.
- Routine trace classification.
- Log summarisation.
- Metadata extraction.
- Repetitive formatting and file organisation.
- Straightforward codebase searches.
- Initial categorisation of review findings.
- Simple, bounded verification tasks.

Where these tasks are deterministic, use scripts instead of models.

### Higher-capability models

Reserve Sonnet-, Opus- or similarly capable models for:

- Product discovery and difficult requirements elicitation.
- Complex architectural reasoning.
- Creative technical design.
- Ambiguous implementation decisions.
- Difficult debugging.
- High-risk security-sensitive analysis.
- Resolving contradictions between requirements.
- Evaluating major architectural or product trade-offs.

The guiding principle is:

**Use the least expensive mechanism that reliably meets the task's quality and risk requirements.**

A deterministic script is preferable to Haiku when it can do the work correctly.

Haiku is preferable to Opus when the task does not require Opus-level reasoning.

Do not create swarms simply for the sake of parallelism.

Use multiple inexpensive agents when independent tasks can genuinely execute in parallel without creating coordination overhead or file collisions.

The architecture must include:

- Task classification and routing.
- Model capability and cost profiles.
- Quality and confidence thresholds.
- Escalation from cheaper to stronger models when necessary.
- Execution budgets and bounded retries.
- Concurrent-agent coordination.
- Independent verification of generated artefacts.
- Metrics for cost, latency and correctness.

A low-cost model should not independently weaken policy, change locked acceptance criteria or certify its own work.

Model routing should be an adaptive capability of Rig, not a hardcoded assumption that every environment offers identical models.

Investigate existing orchestration and routing implementations before building custom infrastructure.

## 4. Concrete Open-Source Inheritance Is Mandatory

This is where I believe the existing planning has been inadequate.

You have researched several repositories and explained why adopting them wholesale would be undesirable.

That is useful, but I still have not seen a concrete plan demonstrating **how the strongest open-source implementations will actually become part of Rig**.

I want that gap closed.

For each major capability, identify:

1. The strongest existing open-source candidates.
2. The precise source files, components or algorithms relevant to our requirement.
3. The licences and redistribution obligations.
4. What functionality those implementations already provide.
5. What functionality Rig already provides.
6. The smallest necessary integration or adaptation.
7. What upstream code and dependencies can be discarded.
8. The expected maintenance and security implications.
9. How the resulting capability will be verified.
10. Why this approach is preferable to writing it from scratch.

### Priority research targets

**AI-SDLC workflows and engineering practices**

Study Superpowers and related skill-driven coding methodologies.

Identify reusable skills and workflow patterns for brainstorming, requirements, implementation planning, test-driven development, code review and verification.

**Persistent memory and context engineering**

Study Deep Agents, Hermes Agent, Claude-Mem and other suitable systems.

Look specifically for cross-session memory, scoped storage, selective retrieval, progressive disclosure, consolidation and memory portability.

Memory should be fluid and adaptive. It does not require the same cryptographic locking mechanism as requirements.

**Recursive self-improvement**

Study Harness², Meta-Harness, DSPy and other credible optimisation systems.

Extract useful candidate generation, evaluation, feedback and improvement mechanisms.

Correct their weaknesses where necessary by introducing independent regression gates, negative-result retention and protected evaluation rules.

**Agent orchestration and model routing**

Study established subagent delegation, context isolation, model-routing and workflow-resumption implementations.

Prefer host-native capabilities when they already exist.

**Skills and developer profiles**

Study existing skill-directory formats, progressive skill loading, user-level versus project-level configuration, and migration/export mechanisms.

Prefer interoperable conventions over a new proprietary profile format where practical.

**Review and deterministic verification**

Retain the review-state-machine work already implemented in Rig.

Compare relevant upstream matching, review orchestration and evidence-management components and adopt only demonstrable improvements.

### Required open-source integration matrix

Provide a matrix with these columns:

| Field | Required information |
|---|---|
| Rig capability | Exact problem being solved |
| Candidate | Repository and pinned version |
| Reusable component | Exact file/module/algorithm |
| Licence | Verified compatibility |
| Integration method | Dependency, adapter, selective fork or independent implementation |
| Keep | Required functionality |
| Discard | Unnecessary functionality/dependencies |
| Native Rig overlap | Existing code to reuse or remove |
| Verification | How correctness will be demonstrated |
| Decision | Adopt, investigate further or reject |

**A list of GitHub repositories is not an integration plan.**

I expect a source-level adoption plan that can be translated directly into engineering tasks.

Do not default to building another custom subsystem simply because a complete upstream framework is unsuitable.

Also do not pretend that a conceptual similarity constitutes actual code reuse. Distinguish direct source reuse from independently reimplementing an idea.

## 5. Memory: Fluid, Efficient and Open-Source-First

Approve an initial **8 KB active-memory ledger cap** as discussed.

However, this limit applies to the compact, frequently loaded working representation—not the complete memory architecture.

The system should separately retain useful developer knowledge, project decisions, skills, execution traces and evidence according to their relevance and retention requirements.

I want the memory implementation to be strongly informed by the best existing open-source agent memory systems.

Do not prematurely commit to a completely custom memory architecture.

Memory should support:

- Cross-session persistence.
- Developer-level and project-level scopes.
- Semantic retrieval.
- Automatic consolidation.
- Duplicate detection.
- Relevance-based context injection.
- User preference learning.
- Portable profile export and import.
- Conflict resolution and provenance.
- Controlled forgetting and obsolescence.

Unlike requirements and acceptance criteria, ordinary memory should remain editable and adaptive.

A developer correcting an old preference should not require a cryptographic re-signing ceremony.

Maintain a clear trust boundary between mutable memory and protected contractual artefacts.

## 6. Automatic Skills and Behavioural Learning

Preserve my governing rule:

**If a developer has to repeat an instruction twice, Rig should recognise the repetition and consider making the behaviour persistent.**

The system should dynamically identify repeated behaviours and suggest the simplest appropriate mechanism.

That mechanism might be:

- A reusable skill.
- A script.
- A workflow.
- A policy.
- A regression test.
- A small configuration change.
- A stored preference.

It should not automatically create an elaborate new subsystem.

Ordinary memory updates and safe maintenance should not require continuous manual approval.

The agent should proactively recognise patterns and, where appropriate, ask whether the developer wants a new persistent capability.

For self-generated executable checks, require automated regression evidence and respect existing protected boundaries.

Use human confirmation where an improvement changes security-sensitive behaviour, grants authority or changes a locked contract—not for every routine internal maintenance operation.

The objective is genuine learning with minimal user administration.

## 7. Automatic Wiki and Trace Compaction

Our wiki has become disproportionately large compared with the codebase.

That is a signal that documentation and trace retention require an explicit lifecycle.

I do not want the main Opus agent manually reading and rewriting huge volumes of old wiki content.

**Wiki compaction must be delegated to Haiku-class subagents or deterministic maintenance tools.**

Keep the current three-minute trace cadence for now.

I do not want repeated manual approval requests for routine trace storage, compaction or housekeeping.

Design an automatic lifecycle that can:

1. Capture recent execution traces.
2. Identify duplication and obsolete information.
3. Extract durable lessons and unresolved decisions.
4. Summarise older records.
5. Consolidate superseded wiki entries.
6. Remove redundant or expired material under defined retention rules.
7. Preserve relevant evidence, provenance and current project state.
8. Rebuild useful context after a session reset.

Old traces should not accumulate indefinitely.

Use an appropriate hot/warm/cold retention model, with bounded storage and configurable deletion policies.

However, **never automatically delete the sole surviving copy of evidence required for locked acceptance criteria, security, review receipts, auditability or regression verification**.

Compaction must be checked for fidelity before the original source becomes eligible for deletion.

The system should also preserve representative historical regression fixtures.

A larger wiki is not automatically a better memory system.

Measure documentation efficiency by the relevance, correctness and retrievability of retained information, not the volume of stored Markdown.

## 8. Locking and Hardware-Backed Signing

Clarifying my earlier hardware-key requirement:

I want the requirements and acceptance-criteria lock to use an appropriate signing mechanism, including support for my security key where technically feasible.

The important invariant is that the implementation agent cannot rewrite the agreed acceptance contract.

Evaluate hardware-backed SSH signing, including `sk-ssh-ed25519`, against the existing Rig signing architecture.

Define:

- How signing keys are enrolled.
- Which artefacts are signed.
- What exactly invalidates a signature.
- How signatures are verified.
- How legitimate amendments work.
- How key rotation and unavailable keys are handled.
- How the system avoids exposing private key material.

This is a protected boundary.

Routine memory updates, trace compaction, technical planning and documentation housekeeping should not constantly invalidate requirements signatures.

Do not implement an untested signing mechanism during this planning session.

Specify it as part of the final architecture with clear acceptance criteria.

## 9. Resolve the Existing Decisions

Record the following decisions.

**D-04 — Active memory size:** Approve an initial 8 KB active ledger, with richer memory and historical evidence stored separately.

**D-01 — Contract lock:** Approve locking requirements and agent-generated acceptance criteria together, before the technical specification.

**D-06 — Learned checks:** Prefer automatic candidate generation, deterministic regression testing and controlled promotion of safe checks. Avoid unnecessary manual approvals. Enforce existing authorisation boundaries for protected changes.

**D-05 — Memory and implementation digests:** Mutable memory may be excluded from the implementation digest, provided protected requirements, executable policy and test artefacts remain appropriately integrity-controlled.

**D-02 — Hardware-key signing:** Retain as a required capability to specify and verify, rather than silently deferring it out of the product.

**D-07 — Trace cadence:** Keep the three-minute capture cadence. Add automatic, low-cost compaction and retention management rather than requiring manual housekeeping.

**D-03 — Configuration-only waiver:** Do not introduce an unnecessary special waiver.

Preserve the approved positive-evidence review redesign and the completed local test evidence.

Do not reopen settled decisions without a concrete contradiction or new evidence.

## 10. Preserve the Work Already Completed

The existing review-state-machine work is locally implemented and verified.

The reported full test gate passed, with 1,347 passing tests and no failures. AT-HD-7 was also reported green.

Preserve those results and the existing worktree.

Do not restart the review implementation.

Treat the review fixes as an existing component of the larger AI-SDLC product.

The uncommitted changes, seven wiki-marker modifications, remote CI status and missing measurement baseline remain tracked issues.

Do not mistake a green local test suite for completed product delivery.

Equally, do not allow those implementation details to derail the present product-definition objective.

## 11. Define the Customer Delivery Experience

I want an explicit end-to-end customer journey.

Show what happens when:

- A new developer installs Rig.
- An experienced developer imports an existing Rig profile.
- A user describes a new product idea.
- Requirements are incomplete or contradictory.
- The agent generates acceptance criteria.
- The developer locks the contract.
- Implementation begins.
- The agent encounters an unexpected architecture problem.
- Tests or external reviews fail.
- The review provider is unavailable.
- The agent session runs out of context.
- Multiple agents modify the same repository.
- A workflow repeats for the second time.
- A recurring mistake is detected.
- A project becomes ready for release.
- The developer moves to a new computer or project.

For each scenario, identify the user's experience, the host agent's actions, Rig's responsibilities, memory interactions, relevant gates and expected outputs.

The developer should receive concise, decision-oriented communication rather than an enormous collection of internal implementation details.

**Rig must be able to orchestrate the entire process while requiring only the necessary human decisions.**

## 12. Deliverables for This Planning Session

I want the following artefacts, integrated into the existing planning package rather than duplicated across a new collection of documents.

### A. Canonical product definition

A concise, complete description of Rig's purpose, users, value proposition, responsibilities, boundaries and non-goals.

### B. End-to-end product lifecycle

A complete workflow from installation and onboarding through requirements, acceptance, implementation, verification, delivery and continuous improvement.

### C. Target architecture

A coherent architecture showing:

- Host-agent integration.
- AI-SDLC orchestration.
- Deterministic workflow and acceptance gates.
- Model and subagent routing.
- Persistent memory.
- Skills and automation.
- Traces and consolidation.
- Review and evidence management.
- Recursive improvement.
- Portable developer profiles.
- Signing and security boundaries.

### D. Concrete open-source inheritance plan

A source-level comparison and adoption plan showing exactly what we intend to reuse, fork, extract, adapt or discard.

This is a mandatory deliverable and currently the largest missing piece.

### E. Capability specifications and acceptance matrix

Ensure every required capability is represented in the canonical specifications.

Include the pre-flight gate, repeated-instruction learning, concurrent-agent safety, model-cost routing, trace compaction and the complete end-to-end user journey.

### F. Prioritised delivery roadmap

Identify implementation phases, dependencies, boundaries, verification requirements and the minimum viable end-to-end product.

Prioritise working vertical slices rather than building every subsystem independently before anything is usable.

### G. Architecture simplification assessment

Identify existing Rig functionality that can be reused, documentation that can eventually be consolidated, and unnecessary planned abstractions that should be removed.

Report expected code and dependency impact.

### H. Remaining decisions

Only surface genuinely unresolved decisions requiring product-owner input.

Use well-supported engineering defaults for routine technical choices.

Do not create avoidable approval overhead.

## 13. Definition of Done for the Current Session

This planning session is complete only when:

1. We have a coherent definition of the entire AI-SDLC product.
2. The end-to-end developer experience is explicit.
3. Every major subsystem has a clear role and responsibility.
4. We have a concrete, source-level open-source reuse strategy.
5. Model routing and low-cost delegation are fundamental parts of the architecture.
6. Memory, portable profiles and recursive improvement fit into the larger lifecycle.
7. Locking and protected acceptance criteria are clearly defined.
8. The documentation and trace lifecycle has a sustainable automatic retention strategy.
9. The capability and acceptance matrix covers the complete product.
10. The implementation roadmap is actionable without another round of speculative redesign.

**Do not proceed with new implementation during this session.**

You may inspect repositories, reconcile the existing specifications, analyse code, and update the planning artefacts as necessary.

Do not commit, push, deploy, trigger external reviews, incur paid model costs or execute untrusted frameworks.

Finish with a concise executive report demonstrating that the product vision, architectural direction and open-source integration plan are complete.

---

## Final Guiding Principle

Rig should be the engineering discipline around an AI developer.

The human provides creativity, intent and product judgement.

The agent performs the engineering work.

Rig ensures that the work follows a reliable, verifiable and progressively improving AI-SDLC.

The more the developer uses Rig, the more the system learns their working methods, reduces repetitive instructions, automates recurring tasks and improves delivery quality.

**We are not trying to build the most complicated agent harness. We are trying to build the smallest, most capable, open-source-informed engineering system that reliably delivers software from idea to production with minimal developer overhead.**

That is the product I want us to define before implementation resumes.