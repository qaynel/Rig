---
date: 2026-10-24
source: intent owner
topics: what-rig-is, the-two-gates, agent-working-conventions, onboarding-flow
decisions: NS-19
status: current
supersedes: 
tags: product-definition, traceability, roadmap
summary: Owner requires atomic bidirectional traceability and a complete signable product contract before implementation.
---

# Rig — Final Product Definition, Traceability and Implementation-Readiness Directive

## Primary objective

I want us to complete the product-definition phase of Rig so thoroughly that implementation can subsequently be delegated to a coordinating agent and multiple lightweight engineering agents without repeatedly requiring my involvement in routine technical decisions.

We are building a complete, polished, publicly usable **AI Software Development Lifecycle (AI-SDLC) harness**, not merely a collection of memory, review and automation features.

My responsibility as the product owner should be to provide creativity, product intent, requirements, priorities and necessary approvals.

Your responsibility is to extract that information, turn it into a coherent product specification, derive verifiable acceptance criteria, establish the architecture, identify existing open-source implementations, and produce a complete delivery roadmap.

Once the contract is approved and signed, a capable coordinating agent should be able to break implementation into independently executable work packages and delegate those tasks to lightweight agents.

**The immediate objective is to finish the entire product-management and engineering-planning phase. Do not begin new feature implementation yet.**

---

## 1. Make specification-to-acceptance traceability a permanent Rig invariant

I want to introduce a new default requirement into Rig itself.

**Every atomic, testable product requirement must have a directly corresponding acceptance criterion, and every acceptance criterion must trace back to an actual requirement.**

This must become a standard part of Rig's AI-SDLC workflow, not a one-off convention for this programme.

For each requirement, maintain:

- Unique requirement ID.
- Original product intent and source.
- Exact requirement statement.
- Associated primary acceptance-criteria ID.
- Additional edge-case or non-functional criteria where necessary.
- Exact proving-test identifiers and fixtures.
- Dependencies and relevant user journeys.
- Current verification status and evidence.

The default should be one primary acceptance criterion per atomic, independently testable requirement.

If a specification contains multiple independently testable obligations, decompose it into atomic requirements instead of hiding several behaviours under one vague acceptance criterion.

Additional boundary, security, performance and failure-mode tests may supplement the primary mapping; do not artificially discard necessary tests merely to maintain numerical equality.

Require **complete bidirectional traceability**:

- No requirement without acceptance coverage.
- No acceptance criterion without a justified requirement.
- No acceptance criterion without a defined proving method.
- No user-visible journey without mapped requirements and end-to-end verification.
- No implementation task without traceability to the approved contract.

Create deterministic checks that detect missing, duplicate, inconsistent or orphaned mappings.

A change to requirements must trigger the appropriate acceptance review.

Once the requirements, acceptance criteria and test manifest are signed, they form an immutable implementation oracle unless the owner explicitly authorises an amendment.

The technical design must satisfy that oracle, not redefine it.

## 2. Regress the existing product specifications against this rule

Apply the new traceability invariant to the entire existing Rig planning package.

Use the current 18 acceptance criteria, product definition, A–H customer journey, decision register and source-level open-source inheritance plan as the starting point.

Do not discard this work or restart the specification process.

Instead:

1. Identify every existing product and engineering requirement.
2. Decompose compound requirements into testable atomic obligations where necessary.
3. Map them to their corresponding acceptance criteria.
4. Identify missing acceptance coverage.
5. Identify acceptance criteria that are not justified by requirements.
6. Identify user journeys or failure scenarios without adequate proving tests.
7. Identify any contradictions between the canonical product vision, architecture, roadmap and acceptance matrix.
8. Resolve mechanical inconsistencies automatically.
9. Surface genuine product decisions to me for clarification.
10. Revalidate the complete traceability graph.

Ensure that this analysis covers the complete product, rather than only the capabilities that have received the most attention during recent sessions.

In particular, do not allow review-accounting, memory architecture or recursive self-improvement details to overshadow the end-to-end AI-SDLC experience.

## 3. Complete product discovery with me

I want you to take the role of a highly capable technical product manager and systems architect.

Your responsibility is to extract as much useful product information from me as is necessary to define what should actually be built.

However, avoid asking me questions that have already been answered.

Read the existing product decisions, specifications, traces and relevant context before asking anything.

Distinguish between:

- Settled product decisions.
- Explicitly rejected alternatives.
- Genuine unresolved product questions.
- Technical choices that an engineering agent can make independently.
- Assumptions that require validation.

Ask questions only when an unresolved answer materially affects intended behaviour, user experience, architecture or acceptance criteria.

When you need my input, present the actual decision and its consequences rather than making me work through low-level implementation details.

The aim is to complete my product-owner responsibilities now, so that implementation can proceed with minimal interruptions.

Do not repeatedly reopen previously settled decisions.

## 4. Define the entire customer lifecycle

I want the product examined from the perspective of someone who has never used Rig.

Cover the complete lifecycle:

**Discover → Install → Onboard → Define Product → Sign Requirements → Design → Implement → Test → Review → Deliver → Maintain → Improve → Transfer**

For each phase, document:

- What the developer wants to accomplish.
- What the developer sees and experiences.
- What the host agent does.
- What Rig automatically enforces.
- What information is collected.
- What decisions need human involvement.
- What artefacts are generated.
- What happens when something fails.
- How the workflow recovers after interruption.
- How completion is verified.
- How the resulting knowledge is retained.

Cover both new and existing projects.

Include realistic use cases such as greenfield development, modifying an established codebase, adding features, debugging, refactoring, interrupted sessions, unavailable model providers, concurrent agents, transferring a developer profile, and preparing a production release.

Do not merely list happy-path scenarios.

Think through the complete experience, including onboarding friction, ambiguous requirements, error reporting, security, recovery, documentation, upgrades and ongoing maintenance.

**The product should feel like an integrated engineering system rather than a collection of separate tools that the developer must manually coordinate.**

## 5. Produce complete system architecture

I want architecture documentation sufficient for a senior implementation agent to understand exactly how the product should work.

Create clear architecture diagrams and supporting explanations covering:

1. High-level system and component architecture.
2. Host-agent and Rig responsibility boundaries.
3. End-to-end AI-SDLC workflow and state transitions.
4. Requirements, acceptance and signing trust boundaries.
5. Memory hierarchy, retrieval and developer-profile portability.
6. Coordinator/subagent orchestration and concurrency.
7. Cost-aware model routing and context isolation.
8. Trace capture, compaction, retention and recovery.
9. Recursive improvement, regression evaluation and protected changes.
10. Review, evidence, release and deployment workflows.

Use maintainable, source-controlled diagrams, preferably Mermaid or another appropriate text-based format where practical.

Include sequence diagrams for critical interactions, particularly:

- Product discovery through Gate 1 signing.
- Coordinator delegating parallel implementation tasks.
- Agent interruption and recovery.
- Review failure and retry.
- Skill generation after repeated behaviour.
- Developer-profile export and onboarding on a new machine.

Specify the interfaces, ownership boundaries, state persistence, failure conditions and security constraints.

Avoid unnecessary architectural complexity.

The result should be a coherent implementable architecture, not speculative diagrams.

## 6. Complete the open-source integration plan

I want the existing open-source research converted into a concrete engineering inheritance strategy.

For each required capability, establish exactly what we intend to inherit from open source.

Use the existing source-level matrix, including Claude-Mem, Hermes, Agent Skills, Deep Agents, Superpowers, Harness², Open-Code-Review and other relevant candidates.

For each selected component, specify:

- Exact upstream repository and pinned revision.
- Exact source module or implementation mechanism.
- Verified licence and attribution requirements.
- What Rig needs from it.
- What can be discarded.
- Whether it is copied, selectively ported, adapted, or merely used as an architectural reference.
- Which existing Rig functionality it replaces or extends.
- How it integrates with the canonical architecture.
- Required tests and security checks.
- Expected code, dependency and maintenance impact.

Do not build a second agent runtime, second signing authority, duplicate skill catalogue or unnecessary memory infrastructure.

Prioritise actual compatible source reuse over reinventing proven algorithms.

Be explicit about cases where reuse is not appropriate.

The final architecture must demonstrate how these open-source contributions produce a smaller, more capable and maintainable Rig.

## 7. Define the coordinator and lightweight-agent execution model

The eventual implementation process should be capable of using **one high-capability coordinating agent and multiple lightweight implementation agents**, where appropriate.

For example, a Sol-class coordinating agent may handle architecture, work decomposition, difficult integration decisions and overall verification.

Luna-class or similarly lightweight agents may execute clearly bounded implementation tasks in parallel.

These are functional roles; the implementation should adapt to whichever capable models and subagent facilities the host actually provides.

The coordinator should:

1. Read the signed requirements, acceptance criteria and test manifest.
2. Read the approved technical architecture and implementation roadmap.
3. Decompose the work into small, independently testable packages.
4. Identify task dependencies and safe opportunities for parallel execution.
5. Assign each worker a precise scope, owned files, acceptance criteria and completion conditions.
6. Route work to the cheapest reliable model.
7. Prevent concurrent agents from modifying conflicting resources.
8. Collect structured implementation and verification evidence.
9. Independently validate completed work.
10. Integrate changes in dependency order.
11. Run appropriate regression and end-to-end verification.
12. Escalate genuinely unresolved product decisions or protected operations.

Workers should not be free to redefine the product or alter acceptance criteria.

Prefer isolated worktrees or equivalent boundaries when parallel work could otherwise collide.

Do not assume that more workers automatically produce faster results. Model cost, coordination overhead, integration risk and correctness must inform delegation.

The goal is efficient orchestration, not unlimited token expenditure.

## 8. Produce implementation-ready work packages

Once the product definition is complete, create a roadmap that can be consumed by a coordinating agent.

Each work package should include:

- Unique work-package ID.
- User-visible outcome.
- Requirement and acceptance-criteria mapping.
- Explicit in-scope and out-of-scope work.
- Existing Rig components to reuse.
- Relevant upstream open-source components.
- Dependencies on other work packages.
- Recommended agent capability tier.
- Expected file/module ownership boundaries.
- Implementation constraints and risks.
- Required deterministic tests.
- Integration and regression checks.
- Completion evidence and handoff format.

Organise the work into useful vertical slices rather than an arbitrary collection of isolated technical subsystems.

The coordinating agent should be able to determine what can be executed concurrently and what must be completed sequentially.

The implementation plan should be sufficiently concrete that workers can execute without continuously returning to me for routine clarification.

## 9. Roadmap from current state to a polished public product

This is a critical deliverable.

I do not want only a roadmap to a locally working prototype.

I want a complete roadmap from **where Rig is today to a finished, polished product that developers can install, adopt and rely upon**.

Use the existing seven-slice roadmap as a foundation, but extend it to cover the full product lifecycle.

Include:

- Current implementation baseline and preservation.
- Minimum complete end-to-end workflow.
- Core memory, profile and skill capabilities.
- Cost-aware model orchestration.
- Concurrent-agent safety.
- Persistent execution and recovery.
- Automatic wiki and trace management.
- Recursive self-improvement.
- Cross-agent and cross-platform compatibility.
- Security hardening and signing verification.
- User-facing installation and onboarding.
- Packaging and distribution.
- Upgrade and migration compatibility.
- Documentation and troubleshooting.
- Automated CI and regression verification.
- Clean-install and real-download tests.
- Release candidate preparation.
- Independent review and QA.
- Production release and post-release validation.
- Ongoing maintenance and product evolution.

Identify the smallest release that represents the complete core product rather than an incomplete collection of features.

Separate MVP, production-readiness and subsequent enhancements.

For every milestone, define its dependencies, scope, acceptance evidence, integration obligations and exit criteria.

Do not invent unsupported schedule or cost estimates. Record estimates only where sufficient evidence exists.

## 10. Preserve existing engineering decisions

The previously agreed architectural decisions remain in force:

- The active memory projection is capped at 8,192 UTF-8 bytes.
- Richer historical memory remains retrievable.
- Requirements, acceptance criteria and test manifest are signed together before technical design.
- Hardware-backed signing is a required capability to verify.
- Technical design remains editable without silently altering the signed oracle.
- Safe bounded learning can proceed automatically after appropriate verification.
- Protected changes retain their existing authorisation requirements.
- The three-minute trace cadence remains.
- Wiki and trace compaction should be automatic and low-cost.
- Deterministic scripts take precedence over model calls where suitable.
- Repetitive low-intensity work should be delegated to inexpensive models or scripts.
- The rule "if I say it twice, consider a skill or automation" remains fundamental.
- Open-source inheritance is selective rather than wholesale.
- Rig remains an agent-facing engineering harness.

Preserve the locally passing review-state-machine changes and existing planning artefacts.

Keep the 6.0.0 QA closeout separate from the new product programme.

Do not reopen these decisions without a concrete contradiction or new evidence.

## 11. Define the final Gate 1 contract

At the conclusion of the product-definition process, prepare one canonical Gate 1 approval package.

It must include:

**A. Product requirements:** Complete, atomic, unambiguous and traceable to original product intent.

**B. Acceptance criteria:** Complete bidirectional mapping to requirements, including boundary conditions and failure behaviour.

**C. Test manifest:** Exact proving checks and executable test obligations for each acceptance criterion.

**D. Customer journeys:** Full end-to-end scenarios demonstrating meaningful user outcomes.

**E. Traceability audit:** Evidence that no requirement, acceptance criterion, proving test or critical user journey has been omitted.

**F. Known assumptions and exclusions:** Anything deliberately outside scope, with rationale.

Present this contract for my approval.

Only after I approve it should the existing Gate 1 key be used to sign the protected artefacts.

Do not treat this planning directive as authorisation to sign on my behalf.

Once the contract is signed, the subsequent technical design, implementation planning and delegation must conform to it.

## 12. Definition of done for this planning phase

The current session is successful when:

1. The complete product vision is defined and internally consistent.
2. All material product-owner questions have been resolved.
3. The entire customer lifecycle has been documented, including failure scenarios.
4. The architecture and key interactions are represented in clear diagrams.
5. Every atomic product requirement has a corresponding primary acceptance criterion.
6. Every acceptance criterion has defined proving tests and supporting traceability.
7. The open-source integration plan identifies concrete implementation sources and integration methods.
8. The coordinator and lightweight-worker execution model is specified.
9. The roadmap covers the entire journey from today's codebase to a polished publicly usable product.
10. The work can be divided into bounded, testable, dependency-aware implementation packages.
11. Existing work, decisions and verification evidence are preserved.
12. The final Gate 1 contract is ready for my review and signature.

At that point, I should be able to finish my product-owner responsibilities, approve the contract, and hand implementation to a coordinating agent with high confidence that it understands what must be delivered.

## 13. Current authorisation

For this session, you are authorised to:

- Examine and reconcile the existing planning package.
- Inspect relevant source code and existing capabilities.
- Conduct read-only open-source research.
- Extract unresolved product questions from the existing evidence.
- Ask me genuinely necessary product questions.
- Produce and update product specifications, architecture diagrams, traceability matrices and roadmaps.
- Prepare the final Gate 1 approval package and implementation-ready work breakdown.

You are **not** authorised to begin new feature implementation, commit, push, sign the contract, deploy, initiate paid reviews or execute untrusted external code.

Do not confuse preparation for implementation with permission to implement.

---

## Final instruction

I want to reach a point where the product is completely defined, the acceptance contract is verifiable, the architecture is coherent, the open-source reuse strategy is concrete, and the delivery roadmap is executable.

After that, I want to be able to hand the signed contract to a strong coordinating agent and have it orchestrate lightweight engineering agents to build, integrate, test and progressively deliver Rig.

My responsibility should be concentrated on product intent, creativity and important decisions.

The agents should handle the engineering process.

**The goal is to complete the product-management phase so comprehensively that the implementation phase becomes controlled, parallelisable and evidence-driven rather than an endless cycle of clarification and rework.**

Please consolidate this into the existing canonical planning package, perform the specification-to-acceptance regression and traceability audit, complete the customer journey and architecture, and produce the final end-to-end product roadmap.

Finish by explaining what is fully specified, what product decisions remain, whether Gate 1 is ready for signing, and how the coordinating agent will execute the roadmap after authorisation.