---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Delivery roadmap — proposed, planning only

This seven-slice foundation is expanded by the [canonical work packages and
public-product roadmap](19-work-packages-and-public-roadmap.md). That plan adds
package ownership, dependency edges, full install/upgrade/distribution, QA,
production validation and post-release maintenance. Use it for coordinator
handoff and release scope.

The 6.0.0 QA closeout is a separate release track. This programme begins only after its own Gate 1 requirements, acceptance criteria and test manifest are approved; technical design follows that lock and remains editable. No implementation, commit, push or deployment is authorised by this document.

| Slice | User-visible outcome | Work and upstream inheritance | Exit evidence / dependency |
|---|---|---|---|
| **0. Preserve the current baseline** | Existing review work is not lost while the expansion is designed. | Keep locally green review state machine and 1347-pass suite uncommitted. Record exact current status and unresolved CI/QA release work. | Re-run full gate on exact bytes before any future push; no implication that QA promotion is done. |
| **1. One complete local task** | An owner can give an idea, freeze requirements and acceptance together, design, implement, verify and resume after interruption. | Join existing grilling, Gate 1, design, TDD, review and release checks with a small run record and preflight. Adapt Superpowers' selective skill instructions; preserve Rig's current gate. Add hardware-backed SSH signing proof. | One recorded end-to-end task, interruption at every transition, hardware-key verification or explicit unavailable-device gap, exact source and output digests. |
| **2. Memory and onboarding transfer** | Settled answers are recalled; a developer moves useful preferences to a new project. | 8 KB UTF-8 active view from richer scoped/provenance store. Port Claude-Mem budget loop and Hermes context fence; conform portable workflow exports to Agent Skills; use existing wiki-query first. | Multibyte cap, provenance, retrieval fallback, adversarial import and fresh-repo round-trip. Requires slice 1 run state. |
| **3. Cost and collaboration** | Routine work uses cheap reliable tools/models; independent host-native agents share bounded context and avoid collisions. | Adapt Superpowers model-choice guidance, DeepAgents child-state exclusion and Hermes budget algorithm into Rig skills/preflight. No new agent runtime. | Recorded cost/escalation decisions, provider-failure fallback, context privacy, collision and stale-lock tests. Requires slices 1–2. |
| **4. Delivery and knowledge continuity** | Documentation and exact-commit release evidence close the work; cold sessions find the right record. | Add documented-surface check, local scope/close-out steps, hot/warm/cold wiki compaction with fidelity manifest. Adapt DeepAgents summarisation trigger as a local phase hook, retain existing wiki generator. | Exact-commit gate, real-download clean install, cold resume, unchanged decisions/source links after compaction. Requires slices 1–2. |
| **5. Safe continuous improvement** | Recurring mistakes produce proven checks and negative lessons persist. | Use the existing review finding key; candidate/evidence pattern from Harness² with baseline and abstention; replay against unchanged oracle. Safe local checks can land automatically; protected proposals use one Gate 1 key. | Two-trigger fixture, historical positive/negative replay, full gate, adversarial protected-write refusal, interrupted promotion exactly once. Requires slices 1–4. |
| **6. Horizontal coherence** | One product works across new and existing projects. | Overlap detection against host capabilities; profile and skill portability; documentation, security and source-attribution audit. | Full customer scenario matrix green, `npm test` on exact bytes, clean-install E2E, independent review and QA release evidence. |

Each slice is the smallest useful vertical path that can be checked by a user scenario. The initial local task precedes elaborate memory infrastructure so the system has a real state and evidence flow to attach memory to. Source adaptations are implemented one at a time; a candidate can be dropped if its port increases complexity or fails its fixture. The public release requires a packaged offline semantic model/runtime, proven on a network-denied real-download install; local lexical search remains a recovery path. No numeric success target is set.

The full definition of done is the owner's existing bar: proving tests, real-download clean install, accurate docs, security and independent review, and a horizontal coherence sweep. The cold-resume and transfer scenarios add the product-specific proof. Until these are evidenced, this is a proposed programme, not a release claim.
