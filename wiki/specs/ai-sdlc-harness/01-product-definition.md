---
status: current
checked: 2026-10-23
owner: rig-product-design
---

# A. Product definition

PROPOSED product specification, with the owner's settled decisions from the
[product-first directive](../../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md)
carried as constraints. Acceptance rows remain drafts until signed.

## Vision

A complete, reusable, agent-facing AI software development lifecycle harness.
The developer supplies creativity, intent and product judgement; the host agent
does the engineering work; Rig makes the process reliable, verifiable,
adaptable and progressively less repetitive. It spends the least expensive
mechanism that meets each task's quality and risk needs.

> I want a complete AI software development cycle, an AI SDLC sort of harness,
> which comes out of the box… I just want my agents to set up everything
> correctly for me and I just want all the benefits without the cost
> investments. — owner, 2026-10-23

## Objectives, in priority order

1. **O1 — The developer manages the product, not the process.** Rig resolves
   organisation, sequencing, artefacts and recovery. It asks for intent or a
   protected authorisation only when that input is genuinely required.
2. **O2 — Nothing settled is ever re-litigated.** A decision stated once is
   binding and cheap to retrieve, in this session and in every later one.
3. **O3 — Learning changes future behaviour.** A second occurrence is detected
   and assessed for the smallest persistent preference, skill, script, check or
   policy that prevents avoidable repetition.
4. **O4 — Spend reasoning where it matters.** Scripts handle deterministic
   work; available inexpensive models handle bounded tasks; stronger models
   handle ambiguity, integration and risk. Escalate when evidence is weak.
5. **O5 — Verifiable, not claimed.** Every "done" carries evidence that an
   agent could not have fabricated. *"Do not go around cheating the system and
   I'll just verifiably approve everything."*
6. **O6 — Safe by default, without the developer knowing the safe answer.** *"I may
   not know what is the safest thing but I know that I don't want to get hacked.
   It's your job to give me options which do not let me get hacked."*
7. **O7 — Portable.** What the harness learns about the owner travels to the
   next project. *"There is rig's entire thing and then there's the entire
   coding philosophy… all of that is also transferred."*
8. **O8 — The complete journey works.** A fresh user can move from install and
   idea through requirements, signed acceptance, design, build, review and
   delivery evidence without administering Rig's internal stages.

## Target users

**Primary — the owner, and users like them.** Token-deficient, highly ambitious,
does not read the code, depends entirely on agents. A student or professional
with roughly $20 of model credit who wants production-grade output.

> heavily ambitious to create good-quality code but do not know how to do it and
> want to use cheap models with great harnesses to get that.

**Secondary — the competent engineer who refuses harness setup cost.** Agrees
with the practices, will not hand-build and maintain the scaffolding. Already
has skills installed and will not tolerate a second PR-review skill appearing
beside theirs.

**Explicitly not the user:** anyone who wants a framework to configure. If the
product requires reading its own documentation to work, it has failed its
primary user.

## Primary use cases

- **U1 Adopt.** Point an agent at an existing repository; the harness grafts
  onto what is there, asks only what the code cannot tell it, and leaves the
  repository working.
- **U2 Change.** Describe a want in prose; get a specification, acceptance
  criteria to sign, an implementation, a review and a release — with the owner
  touching only decisions and the signature.
- **U3 Debug.** Report a symptom; get a reproduction, a root cause at the shared
  seam, a proving test, and a prevention mechanism if the class has been seen
  before.
- **U4 Resume.** A session dies mid-work. The next session — possibly a
  different model — resumes from the written record without a pasted transcript.
- **U5 Transfer.** Start a new project; hand over the profile; the new
  repository's agent already knows the owner's taste and settled positions.
- **U6 Improve.** The harness notices a recurring failure and proposes a check
  that prevents its class, for the owner to sign.

## End-to-end user journeys

Walked in full, with artifacts and failure branches, in
[the lifecycle document](04-lifecycle.md). Summarised:

**U2, the main journey.** Developer states intent → agent writes requirements
and acceptance criteria → **developer locks both under the one key** → agent
derives technical design and scope → routed workers implement → independent
verification and review carry findings forward → documentation and trace
maintenance run → exact-candidate release evidence is presented → protected
delivery actions receive the required authorisation. Only material intent and
product choices interrupt the developer.

## Functional requirements

Grouped by capability; `[E]` exists, `[P]` partial, `[N]` new. Full
specifications in [03-capabilities.md](03-capabilities.md).
These rows are a capability index, several of them compound. The
[atomic requirement register](15-gate1-contract.md) is the proposed approval
contract and maps every functional and nonfunctional row to a primary
criterion and proving obligation.

| ID | Requirement | State |
|---|---|---|
| FR-1 | 8 KB always-read active view over richer scoped memory, decisions, recurrences and resume point | N |
| FR-2 | Export/import of owner philosophy and settled decisions across repositories | N |
| FR-3 | Agent-driven onboarding that grafts onto existing repository conventions | E |
| FR-4 | Requirements clarification producing a written problem statement and solution | P |
| FR-5 | Architecture/technical design as a reviewable artifact | E |
| FR-6 | Scope-of-work generation as an explicit owned phase | N |
| FR-7 | Requirements and acceptance generation plus one owner-controlled freeze before technical design | P |
| FR-8 | Autonomous implementation with adaptive task/model routing, budgets, escalation and subagent coordination | P |
| FR-9 | Code review with findings carried across rounds, and defect remediation | E (new) |
| FR-10 | CI/CD, test and release-readiness verification bound to exact bytes | E |
| FR-11 | Documentation, decision logging and knowledge maintenance as owned phases | P |
| FR-12 | Pre-flight checks at every phase transition, reporting what is missing before work starts | N |
| FR-13 | Repeated-failure detection and promotion into a deterministic check | P |
| FR-14 | Bounded, owner-gated recursive improvement of the corpus itself | N |
| FR-15 | Interruption recovery and cross-session resume without a pasted transcript | P |
| FR-16 | One authoritative implementation per capability; duplicates normalised at install | P |
| FR-17 | Run history and observability sufficient to answer "what happened and why" | P |
| FR-18 | Concurrent-agent coordination inside one workspace | N |
| FR-19 | Developer/project memory retrieval, consolidation, provenance, conflicts and controlled forgetting | N |
| FR-20 | Automatic, fidelity-checked trace compaction and hot/warm/cold retention | N |
| FR-21 | Hardware-backed SSH signing path specified and verified under the one trust root | P |
| FR-22 | Pinned, source-level open-source inheritance with licence and dependency checks | N |

## Non-functional requirements

| ID | Requirement | Measured by |
|---|---|---|
| NFR-1 | **Read cost ceiling.** The mandatory context an agent must read before acting is hard-capped and enforced by a test. | byte cap test |
| NFR-2 | **Deterministic work stays deterministic.** Counting, keying, resuming and pre-flight checks do not call a model. | code review; no provider call in those paths |
| NFR-3 | **Bounded cost.** Routine memory maintenance and required semantic search run locally without paid calls; optional model-assisted work declares cost, budget and fallback. | network-denied semantic replay, cost ledger and disabled-provider replay |
| NFR-4 | **Host-agnostic.** No capability may require a specific agent host. | existing host-parity tests |
| NFR-5 | **No secret ever reaches a third-party executor.** | existing secret-hygiene + spawn-guard tests |
| NFR-6 | **Evidence binds exact bytes**, and no evidence survives a code change. | existing deployment gate |
| NFR-7 | **Interruption-safe.** Any phase can be killed at any point and resumed without double-counting or losing work. | per-phase recovery tests |
| NFR-8 | **Degrades honestly.** A missing tool is a named gap with setup guidance, never a silent pass. | existing service-check contract |
| NFR-9 | **Risk-aware routing.** Each task uses the cheapest reliable available mechanism, with independent quality evidence and escalation. | task-routing replay across host model inventories |
| NFR-10 | **Justified default install.** The required local semantic model/runtime must ship with the public product; every new dependency needs pinned source, licence, integrity, footprint and offline clean-install proof. | real-download offline install, asset integrity and dependency audit |

## In scope

- The whole lifecycle; 8 KB active context plus scoped retrievable memory;
  model routing; pre-flight, recovery, review, delivery and learning.
- Selective source reuse, adaptation and host-native integration where the
  pinned upstream implementation improves Rig, with licence obligations met.
- Normalisation of duplicate capabilities at install time ("one PR-review
  skill, not two").

## Out of scope

- **A replacement agent runtime as the default execution path.** Rig uses
  the host agent and may add bounded local adapters where the full journey needs
  them. The owner removed a config-only constraint; [D-03](09-decision-register.md)
  is settled.
- **A single numeric quality target for self-improvement.** Cost, latency and
  correctness are measured as evidence; a scalar score cannot replace signed
  acceptance and independent regression checks.
- **Unbounded always-loaded memory.** The active view is capped; larger
  retrievable memory uses local lexical and offline meaning-based retrieval.
  The public install includes the local semantic assets by default.
- **A daemon or always-running background process.** Consolidation is bounded
  and triggered, not scheduled.
- **Any agent path that silently alters signed acceptance, the trust root,
  security controls or its own protected evaluation rules.**
- **The startup/adoption diagnostic (track B).** Preserved as a future research
  workstream; it does not block architecture.
- **Changes to the 6.0.0 release closeout.** Strictly separate; see
  [10-current-state.md](10-current-state.md).
