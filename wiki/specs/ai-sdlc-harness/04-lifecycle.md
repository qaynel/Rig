---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Full customer journey and state contract

The [13-phase lifecycle and 20 mapped scenarios](17-customer-lifecycle.md)
expand this A–H view through discovery, public release, maintenance and
transfer. This page remains the compact internal state summary.

PROPOSED. Rig is one corpus and an evidence-bearing workflow inside the user's host agent. The owner supplies product intent, resolves genuine ambiguity, and uses the existing Gate 1 key for protected changes. The host agent reads context, performs engineering, chooses tools and subagents, and presents evidence. Rig supplies phase rules, local records, checks and release gates. A phase may resume from the repository alone.

| Stage | User experience and host-agent action | Rig artifacts, transition guard and failure recovery |
|---|---|---|
| **A. Install and onboard** | On a new project, the agent inspects the repository, offers the smallest relevant capabilities, explains real gaps and asks only for product choices. An imported developer profile is reviewed against local conventions. | Central corpus projects via current bootstrap. Untrusted profile is validated; applied/conflicted/rejected entries are reported. Existing capabilities are reused. Missing tool or unsupported hook is named; onboarding continues where safe. |
| **B. Capture intent** | The owner describes an idea or defect in ordinary language. The agent recalls settled product decisions, asks only unresolved questions, and turns answers into requirements. | Scoped memory records provenance and decision scope. The 8 KB active view provides a bounded orientation; deeper evidence remains retrievable. Ambiguity leaves the stage open with a concrete next question. |
| **C. Freeze the oracle** | Agent writes business specification, acceptance criteria and executable tests together. Owner reviews their actual behavior, signs once with the Gate 1 key, ideally a hardware-backed `sk-ssh-ed25519@openssh.com` key. | Existing manifest/signing path locks business intent, acceptance and tests. Signer identity, exact bytes and signature verify before implementation. A failed or unavailable key leaves the oracle unsigned; no fallback signer or agent approval. Technical design comes **after** this lock and remains editable. |
| **D. Design and scope** | Agent designs the smallest change against current code, checks source-level reuse, drafts dependencies and a bounded scope of work. | Technical spec is presence/traceability checked and its digest binds later receipts, while its bytes are outside Gate 1's signature. Preflight verifies signed oracle, relevant memory and available tools. If code contradicts a trace, current code wins and the discrepancy is recorded. |
| **E. Implement** | Agent chooses deterministic scripts first, then the least expensive reliable model; delegates bounded independent slices to host-native subagents. | Each child gets the task, allowed files, evidence and minimum scoped memory, with private state excluded. A run record tracks owner/session, phase, budget and next action. Conflicting writes stop before mutation; stale locks are reported with recovery steps. Tests drive each behavior. |
| **F. Verify and review** | Agent runs focused tests, full gate, then independent review. It fixes findings until the evidence is clean. | A review attempt counts only on positive evidence of a completed verdict. Provider outage, malformed output or interruption is recorded without spending review authorization; retries have a bound. Findings persist by normalized class across rounds, and prior findings reach the next reviewer. A failed test reopens implementation with its exact evidence. |
| **G. Deliver** | Agent updates documentation and change record, presents release readiness and the next authorized action. | Exact implementation bytes bind receipts. The existing QA-to-production path requires automated health and real-download clean-install checks on the exact QA commit. A stale digest or missing evidence blocks release. Publishing, pushing or deployment follows the user's authorization; this package performs none. |
| **H. Learn and reuse** | At close-out, agent captures what worked, recurring failures and rejected ideas. Routine safe learning happens without interrupting the owner; protected edits go through the existing key. A later project benefits from the transferable profile. | Provenance-linked memory is consolidated and compacted into hot/warm/cold records with fidelity checks. Two occurrences can generate a check candidate; historical replay and regression gate decide safe landing. Signed acceptance, policy, trust, security and evaluator rules cannot be changed by the improvement loop. |

## State and authority

A run moves `onboarding → intent → oracle_draft → oracle_signed → design → implementation → verification → release_ready → closed`, with explicit `blocked` and `interrupted` states. The transition record holds input digest, prerequisite result, tool/model budget, output digest, evidence pointers and one next action. The owner controls the protected oracle and release authorization; the host agent controls routine work and safe memory; deterministic Rig checks refuse illegal transitions. No transition is inferred from persuasive prose or a tool's exit status alone when structured evidence is required.

A cold restart reads the run record and active view, verifies referenced source records and digests, then resumes the last incomplete transition. Completed operations carry an idempotency key so retries do not double-count findings, signatures or authorizations. Corrupt or missing records are reported as gaps; no fabricated pass is created.

## Scenario walkthroughs to verify

Each row describes the user-facing outcome, host-agent work, Rig enforcement, memory effect, gate and output. These are proposed tests, not shipped claims.

| Scenario | User experience | Host agent | Rig and memory | Gate and output |
|---|---|---|---|---|
| New developer installs | Sees the smallest useful proposal and real setup gaps. | Inspects host, repo, tools and existing skills. | Projects one corpus; records repo conventions, no guessed needs. | Onboarding approval → managed graft and first runnable task. |
| Experienced developer imports profile | Sees portable preferences and local conflicts. | Compares import with observed conventions. | Validates untrusted scope/provenance; updates developer memory only. | Import validation → applied/conflicted/rejected report. |
| New product idea | Describes desired result in prose. | Frames problem and asks material questions. | Retrieves settled preferences and project decisions. | Discovery → requirement draft citing original intent. |
| Incomplete or contradictory requirements | Answers one real product fork. | Locates contradiction and recommends options. | Keeps draft state and source of each answer. | No oracle lock until ambiguity resolved → precise next question. |
| Agent generates acceptance | Reviews observable success cases. | Derives executable cases from requirements. | Binds criteria to requirement IDs; retains provenance. | Oracle draft validation → acceptance/test manifest. |
| Developer locks contract | Uses the existing key, preferably hardware-backed. | Presents exact bytes and signing command. | Verifies one trust root; freezes requirements, criteria and tests. | Gate 1 signature → verified oracle or named key gap. |
| Implementation begins | Gets scope and estimated cost, no routine ceremony. | Designs after lock, plans and codes test-first. | Preflight checks signature, phase inputs, model budget and run record. | Design/implementation transitions → code and test evidence. |
| Unexpected architecture problem | Sees a recommendation only if product intent changes. | Checks current source and revises editable design. | Keeps signed oracle fixed; records rationale and design digest. | Design revalidation → revised plan or owner amendment path. |
| Tests or reviews fail | Receives concrete defect and recovery progress. | Fixes root cause and reruns relevant checks. | Stores finding class and prior resolution; counts completed review only. | Verification/review → failing evidence then fresh pass. |
| Review provider unavailable | Sees a named infrastructure gap and retry plan. | Tries bounded equivalent or waits. | Records outage without consuming authorization. | Review remains incomplete → bounded retry/blocked record. |
| Context reset | Can continue without restating history. | Reads run record, active view and sources. | Checks digests, idempotency and missing pointers. | Resume preflight → exact phase and next action. |
| Concurrent agents | Independent work continues; collision is reported. | Splits ownership or isolates worktrees. | Detects overlapping writes, run locks and stale ownership. | Collision guard → isolated tasks or stop/recovery instruction. |
| Workflow repeats | Sees a relevant remembered habit applied. | Reuses approved skill or script. | Links repeated event to developer/project scope. | Scope/permission check → reused workflow with provenance. |
| Recurring mistake | Sees a proven prevention mechanism, not another reminder. | Drafts smallest check from two occurrences. | Replays positive/negative history; retains rejected trials. | Safe promotion or protected owner-key path → check and evidence. |
| Release-ready project | Gets clear ship/no-ship evidence. | Runs docs, tests, review, security and release preparation. | Binds receipts to exact bytes; reports missing tools. | Exact-QA-commit automated gate → release-ready report. |
| New computer or project | Imports working methods without old project baggage. | Onboards against new repo. | Transfers scoped profile/skills, not oracle, secrets or run state. | Import/onboarding checks → fresh project context. |

## Cost, memory and failure contract

The active context is at most 8,192 UTF-8 bytes. Scoped records, wiki sources, run logs, profile and evidence remain separately retrievable. The public release ships a local embedding model/runtime so meaning-based search works with network denied; cited lexical lookup remains a recovery fallback. Missing or corrupt local assets block public readiness. Retrieval text is untrusted data. The agent uses scripts for bookkeeping, a cheap model for bounded reversible work, and a stronger model when architectural or binding judgement requires it; escalation records why. Limits on turns, context, retries and spend are explicit, with an honest blocked state when exhausted.

Three-minute traces remain the live interruption safety net. A later automatic compactor may move old traces to warm/cold storage only after source links, decisions and protected evidence survive a fidelity check. It cannot edit immutable trace bodies, Gate 1 or signing material. A failed compaction leaves the original records and reports the gap.
