---
status: proposed
checked: 2026-10-24
owner: rig-grilling
---

# Proposed AI-SDLC oracle: atomic requirements and acceptance

This is the **new programme's approval candidate**, not an amendment to the
already signed 6.0.0 oracle. The owner directive is filed verbatim at
[the source trace](../../reasoning/2026-10-24-final-product-definition-owner-directive.md).
The earlier [product definition](01-product-definition.md), [22 capability
specifications](03-capabilities.md), [18 broad acceptance cases](08-acceptance-matrix.md),
and [A–H journey](04-lifecycle.md) are preserved. This register decomposes their
compound statements. A primary `AC-xxx` belongs to exactly one `R-xxx`; extra
boundary cases can reference several requirements. `PT-xxx` is the exact
proving obligation in [the test manifest](16-test-manifest.md). No row below is
claimed implemented merely because a related old test passes.

**Source legend.** `Fnn` means the corresponding `FR-nn` in the existing
product definition; `Nnn` means `NFR-nn`; `O24` means the owner's verbatim
2026-10-24 directives (the final-definition directive and the pre-Gate-1
finalisation directive, which added the frozen token-efficiency obligations
R080–R084); `O23` means the product-first owner directive filed on
2026-10-23; `O24S` means the owner's [offline-search
ruling](../../reasoning/2026-10-24-offline-semantic-search-owner-decision.md).
The exact source language is retained in those documents. The
`Journey` codes are defined in [the lifecycle](17-customer-lifecycle.md).
`P` means proposed and unverified for this programme; `B` means related baseline
code/test exists but the full criterion is unverified. `—` means no evidence.

| Requirement and source | Atomic obligation | Primary acceptance criterion | Proving test | Journey | Depends on | Status / current evidence |
|---|---|---|---|---|---|---|
| R001 F03 | A clean install projects the central corpus without selecting repository capabilities. | AC-001: fresh install exposes one canonical corpus and leaves project choices pending. | PT-001 F01 | J01 | — | B: bootstrap tests |
| R002 F03 | The host agent inspects existing repository conventions before proposing a graft. | AC-002: proposal cites observed conventions. | PT-002 F02 | J01,J02 | R001 | B: onboarding tests |
| R003 F16 | An equivalent existing capability is reused instead of duplicated. | AC-003: an installed review skill yields one effective review owner. | PT-003 F02 | J02 | R002 | B: overlap partial |
| R004 F03 | Consequential onboarding changes apply only against the approved exact proposal. | AC-004: changed proposal bytes cannot be applied. | PT-004 F02 | J01 | R002 | B: graft tests |
| R005 N08 | A missing tool or host hook is reported as a named gap with a remedy. | AC-005: no unavailable integration is marked complete. | PT-005 F03 | J01,J15 | R002 | B: service checks |
| R006 F04 | Intent capture preserves the owner's original wording and source. | AC-006: requirement draft links to the originating utterance. | PT-006 F04 | J03 | R001 | P; — |
| R007 F04 | Discovery separates observable product behavior from a proposed implementation. | AC-007: requirement draft has no unapproved design mandate. | PT-007 F04 | J03 | R006 | B: grilling skill |
| R008 F04 | Discovery asks only unresolved product questions that affect observable behavior. | AC-008: settled answers are not re-asked and material ambiguity is surfaced. | PT-008 F05 | J03,J04 | R006 | P; — |
| R009 O24 | Every independently testable obligation receives a unique requirement ID. | AC-009: compound obligations are split and IDs are unique. | PT-009 F06 | J03,J05 | R006 | P; — |
| R010 O24 | Every requirement has one primary acceptance criterion with a reverse link. | AC-010: no requirement or primary criterion is orphaned or duplicated. | PT-010 F06 | J05 | R009 | P; — |
| R011 O24 | Every criterion identifies a proving test and fixture. | AC-011: each criterion resolves to a unique runnable test obligation. | PT-011 F06 | J05 | R010 | P; — |
| R012 O24 | Every user-visible journey maps to requirements and an end-to-end proving check. | AC-012: a journey without both mappings fails the contract audit. | PT-012 F06 | J01–J20 | R010,R011 | P; — |
| R013 O24 | Every implementation package cites the approved requirements and criteria it serves. | AC-013: orphan work packages fail planning preflight. | PT-013 F06 | J08 | R010 | P; — |
| R014 O24 | A requirement change triggers acceptance and test review before proceeding. | AC-014: changed requirement bytes invalidate the prior mapping result. | PT-014 F06 | J05 | R010 | P; — |
| R015 F07 | Business requirements, acceptance and test manifest are signed together before technical design. | AC-015: all three exact digests verify before design can begin. | PT-015 F07 | J06 | R009–R014 | B: current signer, order gap |
| R016 F07 | Agents cannot edit the signed oracle without an owner amendment. | AC-016: altered protected bytes fail verification and require owner re-sign. | PT-016 F07 | J06,J08 | R015 | B: current gate |
| R017 F21 | The existing single trust root accepts supported hardware-backed SSH signing. | AC-017: a real `sk-ssh-ed25519@openssh.com` key signs and verifies with the existing path. | PT-017 F08 | J06 | R015 | P: hardware unverified |
| R018 F21 | Unavailable hardware leaves signing closed with an exact remedy. | AC-018: absent key never causes agent approval or a second signer. | PT-018 F08 | J06 | R017 | P; — |
| R019 F05 | Technical design follows the signed oracle and remains editable. | AC-019: design revision preserves the oracle signature and receives a new design digest. | PT-019 F07 | J07 | R015 | B: design exists; order gap |
| R020 F05 | Design names the current source seam, data flow and failure boundaries for each touched capability. | AC-020: reviewer can trace each proposed component to current code and signed behavior. | PT-020 F09 | J07 | R019 | P; — |
| R021 F22 | Each selected upstream component is pinned to repository, revision and source location. | AC-021: an adopted component without an immutable source pin fails design review. | PT-021 F09 | J07 | R020 | P: plan only |
| R022 F22 | Each selected upstream component has verified licence, notice and discard scope. | AC-022: licence or bundled-runtime ambiguity blocks adoption. | PT-022 F09 | J07 | R021 | P: plan only |
| R023 F06 | Planning decomposes work into dependency-aware vertical packages. | AC-023: each package has outcome, ownership, dependency and exit evidence. | PT-023 F10 | J08 | R013,R020 | P; — |
| R024 F12 | Every phase transition checks its required inputs before work starts. | AC-024: missing inputs stop the transition with a precise gap. | PT-024 F11 | J01–J20 | R015 | P; — |
| R025 F08,N02 | Mechanical work uses a deterministic tool before a model call. | AC-025: count, key and manifest tasks make zero model calls. | PT-025 F12 | J08 | R023 | P; — |
| R026 F08,N09 | A bounded task uses the least expensive available model that meets its evidence and risk needs. | AC-026: routing records capability, price class and selection reason. | PT-026 F12 | J08 | R023 | P; — |
| R027 F08,N09 | Weak evidence or high-risk judgement escalates within a fixed budget. | AC-027: one failed cheap attempt escalates or stops with reason, never loops without bound. | PT-027 F12 | J08,J09,J14 | R026 | P; — |
| R028 F08 | A worker receives only its scoped task, relevant sources and acceptance slice. | AC-028: child context excludes unrelated project and private state. | PT-028 F13 | J08 | R023 | P; — |
| R029 F18 | Concurrent writers with overlapping ownership stop before conflicting mutation. | AC-029: overlap is detected and independent work may continue. | PT-029 F14 | J10 | R023 | P; — |
| R030 F18 | Stale ownership has an explicit recovery path without silent lock theft. | AC-030: an expired owner is reported and reclaimed only after evidence check. | PT-030 F14 | J10 | R029 | P; — |
| R031 F08 | Integration validates worker output independently and in dependency order. | AC-031: worker self-report alone cannot complete a package. | PT-031 F13 | J08,J09 | R023,R028 | P; — |
| R032 F08 | Implementation begins with a failing criterion-specific check and ends with passing evidence. | AC-032: red/green evidence is attached to the package. | PT-032 F15 | J08 | R015,R023 | B: TDD skill |
| R033 F10 | Verification runs the relevant focused checks and full repository gate on final bytes. | AC-033: a changed candidate reruns required checks. | PT-033 F15 | J09 | R032 | B: npm test |
| R034 F09 | An independent reviewer receives the current diff and unresolved prior findings. | AC-034: repeat review includes carried findings and cannot certify itself. | PT-034 F16 | J09,J11 | R033 | B: review wrapper |
| R035 F09 | A review attempt is consumed only by positive evidence of a completed verdict. | AC-035: outage, malformed output and timeout leave authorization unconsumed. | PT-035 F16 | J11 | R034 | B: 49 local tests, uncommitted |
| R036 F09 | A completed failing review persists normalized findings across rounds. | AC-036: location drift does not erase the same unresolved class. | PT-036 F16 | J11 | R035 | B: local uncommitted code |
| R037 F09 | A defect is fixed at its shared root and checked against every caller. | AC-037: a caller regression fails until the common seam is corrected. | PT-037 F17 | J09 | R034 | B: debugging rule |
| R038 F11 | A changed documented surface updates the corresponding user-facing knowledge. | AC-038: stale docs block closeout. | PT-038 F18 | J12 | R033 | P: manual wiki rule |
| R039 F11 | A new owner decision is filed verbatim and reachable from subject hubs. | AC-039: the owner text is intact and indexed by topic. | PT-039 F18 | J12 | R006 | B: wiki process |
| R040 F17 | A run record answers phase, last attempt, stop reason and one next action. | AC-040: cold reader recovers these four facts from repo state alone. | PT-040 F19 | J13 | R024 | P; — |
| R041 F15,N07 | A killed transition resumes without repeating a completed side effect. | AC-041: restart preserves idempotency and exact evidence pointer. | PT-041 F19 | J13 | R040 | P: review-only precedent |
| R042 F15 | Corrupt or missing run evidence blocks completion and names the gap. | AC-042: no pass is fabricated from missing records. | PT-042 F19 | J13 | R040 | P; — |
| R043 F10,N06 | Review and test receipts bind to the exact implementation bytes. | AC-043: one code-byte change invalidates the receipt. | PT-043 F20 | J12,J15 | R033 | B: existing gate |
| R044 F10 | QA promotion checks automated health on the exact QA commit. | AC-044: stale or failed health prevents eligibility. | PT-044 F20 | J15 | R043 | B: release workflow |
| R045 F10 | QA promotion checks a real-download clean install on that same commit. | AC-045: missing or stale install evidence prevents eligibility. | PT-045 F20 | J15 | R043 | B: release workflow |
| R046 F10 | Publish/deploy actions require the established owner authorization. | AC-046: a readiness report alone cannot execute a protected action. | PT-046 F20 | J15 | R044,R045 | B: policy gate |
| R047 F01,N01 | The always-read active view is at most 8,192 UTF-8 bytes. | AC-047: multibyte input never renders 8,193 bytes. | PT-047 F21 | J13,J16 | — | P; — |
| R048 F01 | Overflowing active content remains retrievable by source identifier. | AC-048: evicted content is found from its pointer. | PT-048 F21 | J13,J16 | R047 | P; — |
| R049 F19 | Memory records carry scope, source and supersession provenance. | AC-049: recall displays scope and original source, and excludes superseded value by default. | PT-049 F22 | J03,J16 | R047 | P; — |
| R050 F19 | Project memory does not leak into another project by default. | AC-050: cross-project query returns only developer-scope records. | PT-050 F22 | J16 | R049 | P; — |
| R051 F19 | Local lexical retrieval remains available when semantic inference fails. | AC-051: local-model failure still yields cited lexical results and a named semantic failure. | PT-051 F22 | J03,J16 | R049 | B: wiki-query only |
| R052 F19,O24S | The public product retrieves relevant memory by meaning using an installed local model. | AC-052: an offline paraphrase query with no shared content words returns a relevant cited source. | PT-052 F22 | J16 | R049 | P; — |
| R053 F19 | Recalled text is treated as untrusted data, never instruction or authority. | AC-053: injected command in memory changes no protected action. | PT-053 F22 | J03,J16 | R049 | P; — |
| R054 F02 | Developer preferences export without project oracle, secrets or signer rights. | AC-054: export contains only portable scoped fields. | PT-054 F23 | J17 | R049 | P; — |
| R055 F02 | Profile import validates schema and reports local conflicts. | AC-055: hostile or conflicting import yields applied/conflicted/rejected report. | PT-055 F23 | J02,J17 | R054 | P; — |
| R056 F20 | Live work records a dated recovery trace at least every three active minutes. | AC-056: a long run has no untraced interval over the cadence. | PT-056 F24 | J13,J18 | R040 | B: instruction only |
| R057 F20 | Compaction preserves immutable trace bodies, decisions and protected evidence. | AC-057: before/after source map and cold lookup are equivalent for required facts. | PT-057 F24 | J18 | R056 | P; — |
| R058 F20 | Failed fidelity validation leaves original records intact. | AC-058: injected omission blocks move/delete and reports missing source. | PT-058 F24 | J18 | R057 | P; — |
| R059 F13 | Two independent occurrences of one issue create one cited prevention candidate. | AC-059: duplicate class has two source links and one candidate. | PT-059 F25 | J19 | R036,R049 | P: detection partial |
| R060 F13 | A candidate check proves a previously failing case and preserves known-good cases. | AC-060: before/after fixture and positive/negative replay are attached. | PT-060 F25 | J19 | R059 | P; — |
| R061 F13 | A safe local check promotes only after unchanged full regression passes. | AC-061: promotion fails on regression or missing proof. | PT-061 F25 | J19 | R060 | P; — |
| R062 F14 | Improvement cannot alter oracle, policy, trust, security, evaluator or release authority. | AC-062: every protected target rejects an automatic write. | PT-062 F26 | J19 | R061 | P; — |
| R063 F14 | Failed or no-effect trials persist and are not repeated without new evidence. | AC-063: second identical proposal abstains and cites prior failure. | PT-063 F26 | J19 | R060 | P; — |
| R064 F14 | A successful protected improvement is proposed for owner-key authorization. | AC-064: the agent cannot self-approve protected candidate bytes. | PT-064 F26 | J19 | R062 | P; — |
| R065 N03 | Model-assisted or paid paths have a declared cap and stop on exhaustion. | AC-065: cap breach produces a blocked record and actual/unknown cost, never zero by default. | PT-065 F12 | J08,J09 | R026 | P; — |
| R066 N04 | The product core works through the host agent without a required vendor runtime. | AC-066: two supported host entrypoints run the same contract journey. | PT-066 F27 | J01,J08 | R001 | B: projection tests |
| R067 N05 | Secrets are excluded from worker context and external executors. | AC-067: secret fixture is absent from child payload and published artifacts. | PT-067 F13 | J08 | R028 | B: spawn guard |
| R068 N10,O24S | A default clean install needs no provider account, network or separate service to use memory search. | AC-068: offline install completes a meaning-based memory query from shipped assets. | PT-068 F27 | J01 | R001,R052 | P: install baseline only |
| R069 O24 | Upgrade preserves existing user content and flags incompatible state. | AC-069: prior supported state migrates or stops with a repair report. | PT-069 F28 | J20 | R001 | P; — |
| R070 O24 | Public instructions allow a new user to install, recover and remove Rig. | AC-070: a cold user follows docs through install, first task, troubleshooting and removal. | PT-070 F28 | J01,J20 | R068 | P; — |
| R071 O24 | Release candidate verification includes security, independent review and full scenario coherence. | AC-071: candidate is blocked if any required evidence class is absent. | PT-071 F29 | J15 | R033–R046 | P; — |
| R072 O24 | A production release validates installation and health after publication. | AC-072: post-release failure is recorded and follows rollback/recovery policy. | PT-072 F29 | J15,J20 | R071 | P; — |
| R073 F19 | Conflicting memory records are surfaced with both sources instead of silently choosing one. | AC-073: recall presents the conflict and asks for resolution only when behavior depends on it. | PT-073 F22 | J16 | R049 | P; — |
| R074 F19 | Forgetting removes only eligible mutable memory while preserving protected evidence and source history. | AC-074: a deletion request never removes the sole oracle, decision or evidence source. | PT-074 F22 | J16,J18 | R049,R057 | P; — |
| R075 F13,O23 | A repeated instruction triggers consideration of a sourced reusable skill or automation. | AC-075: two occurrences create one scoped candidate without automatic protected promotion. | PT-075 F25 | J19 | R059 | P; — |
| R076 N03 | Routine memory metadata indexing, projection and compaction use local deterministic work without a paid model call. | AC-076: ordinary memory upkeep makes zero external-provider calls. | PT-076 F24 | J18 | R047,R057 | P; — |
| R077 O24S | The public distribution includes verified local inference assets required for offline semantic search. | AC-077: a clean real-download install finds the pinned model, tokenizer and runtime without a first-run download. | PT-077 F27 | J01,J15 | R052 | P; — |
| R078 O24S | Ordinary semantic indexing and querying make no network request or paid provider call. | AC-078: network-denied instrumentation records zero outbound calls while semantic results are returned. | PT-078 F22 | J16 | R052 | P; — |
| R079 O24S | An upgrade invalidates or rebuilds embeddings made by an incompatible model revision. | AC-079: an upgraded index returns cited results without mixing incompatible vectors. | PT-079 F28 | J20 | R052 | P; — |
| R080 N09,O24 | Every model call in a task — retrieval, compaction, failed attempt, reviewer, delegation and recovery — is counted against that task, and logical token use is distinguished from billable cost including cache effects. | AC-080: a completed task reports total logical tokens, billable cost and wall time with no uncounted call class. | PT-080 F30 | J08,J13 | R026,R056 | P; — |
| R081 N09,O24 | Token efficiency is reported as accepted verified work over total tokens consumed for the task. | AC-081: two runs delivering the same accepted acceptance evidence rank by tokens, so added retries lower the ratio. | PT-081 F30 | J08 | R080 | P; — |
| R082 N09,O24 | A reproducible benchmark records a baseline across the defined task scenarios before any efficiency target is asserted. | AC-082: the benchmark replays the named scenarios offline and emits a recorded baseline, and an efficiency target with no prior baseline is rejected. | PT-082 F30 | J08 | R081 | P; — |
| R083 N09,O24 | An efficiency change that drops task correctness, test coverage, security or successful delivery below the accepted threshold is rejected regardless of token savings. | AC-083: a candidate with a better ratio but a failed acceptance, coverage or security check does not promote. | PT-083 F30 | J08,J09 | R081,R033 | P; — |
| R084 N09,O24 | Redundant repeated file reads and duplicate tool calls within one task are detected and reported. | AC-084: an identical repeated read in a task surfaces a counted redundancy signal. | PT-084 F30 | J08 | R080 | P; — |

## Contract boundary and exclusions

The signed candidate will include this register, the test manifest and the
journey coverage file. The editable architecture, upstream research and work
packages satisfy the oracle but are not in its signed byte set. The current
signer only signs the existing `wiki/gate1/` package; it cannot yet sign this
separate programme without an owner-reviewed amendment to the signing manifest.
No signature or key operation has been performed.

The product uses host-native agents rather than a second agent runtime. The
public release includes offline semantic retrieval by default; cited lexical
retrieval remains a failure fallback and is not sufficient release evidence.
The local model and runtime are pinned, licensed, integrity-checked and packaged
for every supported installation. There is no universal quality score,
mandatory paid service, copied private key, or
silent bypass of existing release authority. The exact release number and
calendar are deliberately unspecified because neither has evidence yet.
