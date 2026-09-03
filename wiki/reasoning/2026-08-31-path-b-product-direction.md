---
date: 2026-08-31
source: intent owner
topics: onboarding-flow, what-rig-is
decisions:
status: current
supersedes:
tags: interdependency
summary: Path B locked as agent-led adaptive onboarding — the host agent, given full repo and Rig capability context, grafts the smallest useful set onto existing infra; the user reviews the resulting improvement and only critical decisions; Rig code still does not infer; router re-test does not block.
---

Filed 2026-08-31 from the intent owner, answering the Path B grilling in
[2026-08-31-path-b-adapt-scope.md](./2026-08-31-path-b-adapt-scope.md). The
body is the owner's document, verbatim.

# Path B — Product Decisions and Onboarding Direction

## Product Intent

Rig should not behave like a traditional installer that blindly copies its own files and conventions into an existing repository.

The onboarding agent should be given:

* full context about the target repository,
* full context about Rig's available skills and tools,
* the Rig onboarding/grafting instructions,
* the Rig development pipeline and guarantees.

Using that context, the onboarding agent should dynamically determine how Rig fits into the repository.

The agent should make the majority of onboarding decisions autonomously. The user should only be asked to make genuinely critical or consequential decisions.

Before onboarding is finalised, the user should receive a clear summary of:

* what already exists,
* what Rig identified,
* what Rig intends to preserve,
* what Rig intends to modify or graft onto,
* what capabilities are being added,
* what important decisions were made,
* what the resulting development workflow will be.

The user is therefore reviewing the **resulting improvement to the repository**, rather than manually configuring Rig feature-by-feature.

---

# Core Onboarding Model

The intended flow is:

```text
Understand repository
        ↓
Understand existing agent/tooling infrastructure
        ↓
Expose the onboarding agent to the full Rig capability context
        ↓
Identify relevant Rig capabilities
        ↓
Compare Rig capabilities with existing repository capabilities
        ↓
Reuse / generalise / graft onto existing infrastructure
        ↓
Fill genuine capability gaps
        ↓
Align repository with the Rig development pipeline
        ↓
Present onboarding summary + critical decisions
        ↓
Lock agreed specifications
        ↓
Agent-driven TDD against locked specifications
        ↓
Verify success
        ↓
Return a simple success-oriented response to the user
```

---

# Rig Development Pipeline

The repository should ultimately be aligned around the following development process:

```text
Grilling
    ↓
Business Specifications
    ↓
Acceptance Criteria
    ↓
Tests
    ↓
Technical Specifications
    ↓
LOCK
    ↓
Agent-driven Test-Driven Development
    ↓
Implementation satisfies locked specifications
    ↓
Verification
    ↓
Simple success response
```

The specifications and tests established before implementation become the contract the implementation agents work against.

Agents should not casually mutate those locked requirements during implementation.

---

# Decision 1 — Router Re-Test

The router-only re-evaluation is **deferred for now**.

We already have testers exercising the product and providing feedback, so this does not need to block Path B design or implementation.

We can revisit router-specific evaluation separately when useful.

Therefore:

> Do not make the router re-test a prerequisite for continuing Path B.

---

# Decision 2 — Organise Skills and Tools into Families

Rig skills and tools should be organised into coherent **capability families** rather than treated as a flat catalogue of individual items.

Examples might include families such as:

* requirements / grilling,
* specifications,
* testing,
* implementation,
* code review,
* debugging,
* security,
* documentation,
* deployment.

The precise taxonomy can evolve.

The important product decision is:

> The onboarding agent reasons about coherent capability families, while retaining access to the individual skills and tools inside them.

This is primarily an organisational model for the agent and Rig, not a requirement that the user manually select families.

---

# Decision 3 — Repo-Specific Rig State Lives Under `.rig/`

Repository-specific onboarding information should live inside the repository under:

```text
.rig/
```

This includes generated information such as:

* discovered agent configuration,
* existing development conventions,
* adopted infrastructure,
* detected capability overlaps,
* grafting decisions,
* capability mappings,
* onboarding state,
* potentially the final onboarding summary.

The exact file structure can be designed during implementation.

The principle is:

> Dynamic repo-specific Rig state belongs under `.rig/`; existing repository configuration should not be unnecessarily polluted or replaced.

---

# Decision 4 — Agent-Led Selection, Not a Manual Skill Picker

Do not design onboarding primarily around a user manually choosing dozens of skills or even manually selecting every capability family.

The onboarding agent should instead:

1. understand the repository,
2. understand the complete Rig capability catalogue,
3. determine what is relevant,
4. understand what already exists,
5. determine what should be reused, extended, grafted, or added,
6. make routine decisions itself,
7. escalate only critical decisions to the user,
8. present the complete proposed onboarding result.

Therefore the product model is:

> Agent-mediated dynamic onboarding, not configuration-wizard onboarding.

The user approves important consequences rather than operating the installer.

---

# Decision 5 — Payload / Bloat Policy

Track at least:

* installed file count,
* installed byte size.

These are useful indicators of unnecessary payload growth.

However, payload thresholds should initially be **warning-level signals**, not arbitrary hard release blockers.

Hard failures should be reserved for clear correctness regressions, for example:

* accidentally writing the same capabilities twice,
* duplicate installation into multiple locations,
* known structural bugs returning.

Therefore:

```text
File count growth      → warning / observation
Byte-size growth       → warning / observation
Known duplicate-write  → hard failure
Correctness regression → hard failure
```

Rig should optimise toward the smallest effective graft, but judgement-based size changes should not automatically fail a release.

---

# Decision 6 — The Onboarding Agent Performs the Intelligence

We are **not** building a large deterministic rule engine that says:

```text
React repo → install A, B, C
Python repo → install D, E, F
```

Nor are we requiring the human to manually determine all relevant Rig capabilities.

Instead, the onboarding agent receives:

```text
Repository knowledge
        +
Full Rig capability context
        +
Onboarding/grafting instructions
        +
Rig pipeline requirements
```

The agent then dynamically unpacks the relevant parts of Rig for that repository.

The intelligence therefore lives primarily in:

* the context supplied to the onboarding agent,
* the capability descriptions,
* the grafting instructions,
* the repository understanding,
* the agent's reasoning.

The product should empower the agent with enough context to make good onboarding decisions.

---

# Decision 7 — Graft Onto Existing Infrastructure

When the repository already has a capability that overlaps with Rig, the model is **not**:

```text
Existing implementation vs Rig implementation
→ choose one
```

The model is:

```text
Understand existing implementation
        ↓
Understand Rig's version of the capability
        ↓
Calculate the delta
        ↓
Identify what Rig adds or guarantees
        ↓
Reuse / extend / generalise existing infrastructure
        ↓
Graft missing Rig behaviour into it
```

For example, if the repository already has something equivalent to **grilling**, the onboarding agent should determine:

* what that existing grilling process already achieves,
* what Rig's grilling process adds,
* which guarantees or behaviours are missing,
* whether existing infrastructure can be extended,
* what the smallest change is that brings the repository up to the desired Rig pipeline.

The goal is **not to replace working repository infrastructure merely because Rig has its own implementation**.

The core rule is:

> Preserve, reuse, generalise and graft before adding parallel infrastructure.

Rig should adapt itself to the repository while ensuring the repository ultimately gains the required Rig guarantees.

---

# Human vs Agent Authority

The onboarding agent should make as many decisions as reasonably possible.

Routine implementation choices should not be pushed onto the user.

The user should be involved when a decision is genuinely consequential, for example where it affects:

* product behaviour,
* important business requirements,
* destructive replacement of existing infrastructure,
* significant workflow changes,
* security or trust boundaries,
* irreversible decisions,
* ambiguous requirements where different answers produce materially different products.

Everything else should normally be resolved by the onboarding agent from repository context and Rig guidance.

The desired interaction is:

```text
Agent investigates
      ↓
Agent decides routine matters
      ↓
Agent escalates critical matters only
      ↓
User resolves those matters
      ↓
Agent presents complete onboarding summary
```

---

# Onboarding Summary

Before the onboarding plan is considered complete, the agent should provide a concise but comprehensive summary containing at least:

## Existing State

What relevant infrastructure, agent instructions, tools, processes and conventions already exist.

## Rig Interpretation

Which Rig capability families are relevant to this repository.

## Reuse

What existing repository infrastructure will remain authoritative or be reused.

## Grafts / Improvements

What Rig behaviour will be added to existing infrastructure and why.

## New Capabilities

What genuinely missing capabilities will be introduced.

## Important Decisions

Any consequential decisions made by the agent or user.

## Resulting Pipeline

How the repository will now move through:

```text
Grilling
→ Business Specs
→ Acceptance Criteria
→ Tests
→ Technical Specs
→ Lock
→ TDD Implementation
→ Verification
```

## Expected User Experience

What materially improves after onboarding.

---

# Product Principle

The central principle for Path B is:

> **Rig should understand the repository first, then dynamically graft the smallest useful set of Rig capabilities onto what already exists.**

The onboarding agent should be empowered through context rather than forcing the user through low-level configuration.

Rig should prefer:

```text
Understand
→ Reuse
→ Generalise
→ Graft
→ Add only what is missing
```

rather than:

```text
Install everything
→ create parallel systems
→ ask the user to resolve the mess
```

---

# Beta / Product Development Approach

We are actively developing the product with tester feedback.

Therefore the current priority is to establish the correct onboarding behaviour and iterate from real repository usage.

Do not over-optimise prematurely for:

* rigid router evaluation sequencing,
* exhaustive deterministic inference systems,
* extremely granular manual selectors,
* hard payload limits without evidence,
* hypothetical future requirements.

Build the adaptive onboarding model, observe how testers use it, then refine the product from actual evidence.

---

# Final Locked Direction

Path B should build toward an **agent-led adaptive onboarding system** where:

1. Rig understands the existing repository.
2. The onboarding agent receives context for all Rig tools and skills.
3. Skills and tools are organised into capability families.
4. The agent determines which capabilities are relevant.
5. Existing infrastructure is preserved wherever sensible.
6. Rig capabilities are grafted onto existing systems based on the delta.
7. Missing capabilities are added only when necessary.
8. Repo-specific Rig state is kept under `.rig/`.
9. Routine decisions are made autonomously by the agent.
10. Only critical decisions are escalated to the user.
11. The user receives a complete onboarding summary.
12. The resulting workflow establishes and locks:

    * grilling,
    * business specifications,
    * acceptance criteria,
    * tests,
    * technical specifications.
13. Implementation agents then use TDD to satisfy those locked specifications.
14. Successful completion results in a simple, clear success response to the user.
15. Tester feedback drives subsequent product evolution.

The router-specific re-test remains deferred and should not block this work.
