---
status: proposed
checked: 2026-10-24
owner: rig-grilling
---

# Customer lifecycle and journey coverage

This expands the existing [A–H journey](04-lifecycle.md) into the complete
first-user experience. Each phase has one owner-facing purpose; internal
transitions can run without another prompt. The owner supplies intent,
judgement and protected authority; the host agent does engineering; Rig checks
state and evidence. A repository can be greenfield or established.

| Phase | Developer wants and sees | Host agent and Rig enforcement | Collected information; human decision; artifact | Failure, recovery, completion proof and retained knowledge |
|---|---|---|---|---|
| Discover | Understand what Rig does, its cost and whether it fits; sees one honest product overview and supported paths. | Agent explains agent-led workflow and checks host capabilities; Rig makes no unsupported hook claim. | Host/runtime inventory; user chooses to try; install instructions that disclose the local semantic model's package footprint. | Unsupported host gets a named gap or manual projection path; discovery completes when a runnable install route is identified; no project data collected yet. |
| Install | Add Rig without breaking the repository; sees exact planned file changes. | Agent retrieves one pinned corpus and bundled local semantic assets; installer projects known entrypoints and verifies files. | Repository root, version and host entrypoints; consequential writes require proposal approval; install receipt with asset digests. | Download/digest/path error leaves original files intact; rerun is idempotent; incomplete model assets block public readiness rather than silently claiming semantic search. |
| Onboard | Get useful practices with minimal setup; sees existing capabilities reused and precise gaps. | Agent inspects repository, proposes one useful graft per gap; Rig validates content-bound proposal and preserves user text. | Existing tools, conventions and selected catalogue services; human resolves consequential conflict; managed graft and report. | Conflict or missing tool pauses only affected capability; state journal resumes apply; completion is an installed check, retained as project onboarding state. |
| Define product | Explain the idea once; sees only material questions and an understandable problem/requirements draft. | Agent recalls settled decisions and splits atomic outcomes; Rig audits provenance and mapping. | Original utterance, decisions, assumptions, boundaries; owner decides genuine product forks; requirements draft. | Ambiguity remains visibly open; cold restart retrieves source and unanswered question; completion is a coherent requirement set, retained by scope and source. |
| Sign requirements | Approve what success means; sees exact requirements, criteria and proving tests. | Agent derives tests and explains failure paths; Rig audits bidirectional graph, then one key signs exact protected bytes. | Requirement, criterion, fixture and test IDs; owner reviews and operates key; signature and manifest. | Missing case/key/changed byte keeps gate closed; return to draft or owner amendment; completion is verified signature and graph, retained as protected oracle. |
| Design | Understand the proposed approach; sees bounded tradeoffs and reuse. | Agent inspects code and pinned sources after lock; Rig checks design presence, mapping and preflight. | Current seams, data/trust boundaries, source licence; owner only for product contradiction; editable design digest. | Stale source or oracle contradiction returns to research or owner amendment; design can resume from digest; completion is reviewable design satisfying signed criteria. |
| Implement | See progress with few interruptions; agent chooses scripts and bounded workers. | Coordinator assigns disjoint packages and tests first; Rig records budget, ownership and run state. | Package scope, evidence and cost; owner only for new product choice or protected action; code, tests, run journal. | Provider outage, collision or exhausted budget produces named blocker; new session resumes exactly once; completion is integrated tested package evidence. |
| Test | Know whether the change actually works; sees failing or passing checks tied to criteria. | Agent runs focused, regression and E2E checks; Rig binds outputs to exact bytes. | Commands, fixtures, results and digests; no routine owner choice; test report. | Failure returns to implementation with exact assertion; interruption reruns only invalidated work; completion is current-byte green evidence retained in run record. |
| Review | Get an independent judgement with carried defects. | Reviewer reads diff and prior findings; Rig accepts only complete verdict evidence and limits retries. | Finding class, location, reviewer output, attempt state; owner only for changed intent or authorization; review receipt. | Outage/malformed output leaves review pending; failed verdict returns to implementation; completion is resolved findings and valid current-byte receipt. |
| Deliver | Receive a ship/no-ship report and next authorized action. | Agent prepares docs, package, QA and exact-commit evidence; Rig enforces release order and one trust root. | Candidate digest, health, real-download install, security/review evidence; owner authorizes protected publish/deploy; release receipt. | Stale evidence blocks promotion; fix returns to owning phase and reruns gate; completion is published artifact verified on its exact bytes. |
| Maintain | Diagnose production issues and upgrades without losing local customizations. | Agent reproduces, repairs shared cause, updates docs and migration; Rig preserves installed journal and evidence. | Symptom, reproduction, version and state; owner only for behavioral change; patch and migration report. | Failed migration rolls back or stops with repair instruction; completion is clean upgrade and regression proof; retain incident/decision source. |
| Improve | Repeat fewer instructions and defects; sees a proven new habit/check. | Agent links repeated class, drafts smallest mechanism and replays history; Rig blocks protected writes and keeps negative lessons. | Two cited events, fixture, before/after results; owner signs protected change only; candidate/check/proposal. | No-effect/regression abstains and remains recorded; interrupted promotion resumes once; completion is unchanged-oracle full-gate pass and retained provenance. |
| Transfer | Carry personal practices to a new machine/project without old project authority. | Agent exports scoped profile and imports against new repository conventions; Rig validates schema and exclusions. | Portable preferences and source links; owner resolves conflicts; export bundle and import report. | Corrupt/hostile data is rejected without side effects; import resumes from report; completion is new-project round trip with old oracle/secrets absent. |

## Named end-to-end journeys

Every row is a user-visible story with requirement mapping and a planned E2E
check. The E2E check must exercise a public or agent-facing boundary and inspect
persisted evidence, not only the unit-level `PT` tests. Existing broad
`AC-J1..J10` map here; the eight capability cases in the former matrix are
retained as supplemental cross-cutting checks. `E2E-Jxx` is the unique journey
test obligation, with planned home `tests/ai-sdlc-journeys.test.js` unless a
release lane is named.

| Journey | Scenario and expected outcome | Requirements | E2E fixture / old criterion |
|---|---|---|---|
| J01 | Fresh offline user discovers and installs one usable corpus with meaning-based search. | R001,R002,R004,R005,R068,R070,R077 | E2E-J01: fresh Git repo + denied network + paraphrase query; AC-J1 |
| J02 | Existing project reuses its review skill and reports profile conflicts. | R002,R003,R055 | E2E-J02: existing review skill + conflicting profile; AC-J1/J10 |
| J03 | Greenfield idea becomes sourced atomic requirements. | R006–R012 | E2E-J03: ambiguous product idea + settled wiki decision; AC-J2 |
| J04 | Contradictory requirements stop with one material owner choice. | R008,R014 | E2E-J04: incompatible success rules; AC-J2 |
| J05 | Acceptance audit catches a missing, orphaned or compound mapping. | R009–R014 | E2E-J05: mutated contract graph; new |
| J06 | Owner reviews and signs the whole oracle with existing hardware key path. | R015–R018 | E2E-J06: signed candidate + unavailable-key branch; AC-J3/J4 |
| J07 | Design follows signed intent and rejects stale source or licence. | R019–R022 | E2E-J07: code/wiki conflict + pinned source; AC-J5 |
| J08 | Coordinator builds one vertical feature with bounded independent workers. | R013,R023–R032,R065–R067 | E2E-J08: two disjoint packages + dependency; AC-J6 |
| J09 | Tests/review find a shared defect and verify repair. | R027,R031–R037 | E2E-J09: two callers + failed first review; AC-J6 |
| J10 | Concurrent writers collide safely while independent work proceeds. | R029,R030 | E2E-J10: overlapping and disjoint worktrees; AC-J9 |
| J11 | Reviewer outage and malformed verdict preserve authorization. | R034–R036 | E2E-J11: outage/timeout/malformed/complete verdicts; AC-J8 |
| J12 | Documentation and evidence stay aligned with changed code. | R038,R039,R043 | E2E-J12: stale doc + one-byte change; new |
| J13 | Session dies at each phase and a cold agent resumes once. | R040–R042,R047,R056 | E2E-J13: kill points and corrupt run record; AC-J7 |
| J14 | Build provider unavailable or local memory model corrupt; bounded fallback or named stop appears. | R025–R027,R051,R052,R065 | E2E-J14: unavailable cheap provider and corrupt local semantic assets; new |
| J15 | Release candidate is blocked until exact-commit health, clean install, offline semantic assets and review pass. | R005,R043–R046,R071,R072,R077 | E2E-J15: public archive + stale receipt + missing model; AC-R1 |
| J16 | Relevant scoped memory supports offline meaning-based recall and survives cap, conflict and local-model failure without injection. | R047–R053,R073,R074,R078 | E2E-J16: two projects, multibyte overflow, paraphrase query, contradictory records and hostile recall; AC-C1/C19 |
| J17 | Developer profile transfers safely to another project or machine. | R054,R055 | E2E-J17: round trip + hostile field; AC-J10 |
| J18 | Long task traces compact without losing decisions or evidence or using paid upkeep. | R056–R058,R074,R076 | E2E-J18: hot/warm/cold round trip and provider-call count; AC-C20 |
| J19 | Twice-seen mistake or instruction produces a proven check/skill candidate, while protected edit waits. | R059–R064,R075 | E2E-J19: positive/negative replay + repeated instruction + protected target; AC-C13/C14 |
| J20 | Upgrade and ongoing maintenance preserve a user's repository, published product and compatible semantic index. | R069,R070,R072,R079 | E2E-J20: prior install + old vectors + user text + post-release failure; new |

The E2E fixtures are exact obligations for the future test files. Their
implementation and an actual hardware key verification are required before
any claim that the new programme's oracle is ready to sign or the product is
ready to release. The 6.0.0 release is a separate track.
