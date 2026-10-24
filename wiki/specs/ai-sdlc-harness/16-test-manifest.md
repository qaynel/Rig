---
status: proposed
checked: 2026-10-24
owner: rig-grilling
---

# Proposed proving-test manifest

Each `PT-xxx` is the proving test for the same numbered requirement and
criterion in [the contract register](15-gate1-contract.md). Its assertion is
the exact observable `AC-xxx` sentence; its fixture is below. A passing test
must inspect output or persisted state, not echo the function's return value.
The cases are executable. They live in `tests/ai-sdlc/`, which the existing
`tests/*.test.js` gate glob does not match, so a missing product capability
produces an expected failure in this lane and never reddens the repository CI.
Run the lane with `node --test tests/ai-sdlc/`. Their exact file digests join
the existing owner signing ceremony under the new programme manifest. No test
or manifest here modifies the current signed oracle.

| Fixture | Setup, action and required independent observation | Planned proving-test location |
|---|---|---|
| F01 | Empty Git repository; install public Rig archive; inspect projected bytes and absent adaptation state. | `tests/ai-sdlc/install.test.js` |
| F02 | Existing repository with a working review skill and local instructions; request onboarding, mutate proposal bytes, then apply. Inspect one effective owner and unchanged unapproved files. | `tests/ai-sdlc/onboarding.test.js` |
| F03 | Repository with absent optional tool and unsupported host hook; run discovery. Inspect gap and setup guidance, never a success label. | `tests/ai-sdlc/onboarding.test.js` |
| F04 | Recorded owner idea with two observable outcomes and one implementation suggestion; run discovery. Inspect source citations and separated requirements. | `tests/ai-sdlc/discovery.test.js` |
| F05 | Cold restart with one settled answer and one genuinely ambiguous product behavior; inspect only the latter question. | `tests/ai-sdlc/discovery.test.js` |
| F06 | Machine-readable graph with complete, duplicate, missing, orphaned and changed mappings; run deterministic audit. Inspect failure IDs and affected acceptance/test rows. | `tests/ai-sdlc/traceability.test.js` |
| F07 | Candidate business spec, criteria and manifested test files; sign with owner test key, revise design, then mutate one protected byte. Inspect signature, order and digest results. | `tests/ai-sdlc/oracle.test.js` |
| F08 | Real supported hardware-backed SSH key in an explicit integration lane and absent-device fixture in local CI. Verify sign/verify and closed failure path; no simulated success substitutes for real-key evidence. | `tests/ai-sdlc/hardware-signing.test.js` |
| F09 | One current code seam, stale wiki claim, pinned upstream file, incompatible licence and one compatible source. Inspect design/source audit decisions. | `tests/ai-sdlc/design.test.js` |
| F10 | Three packages with a dependency edge, one overlapping file and an orphaned acceptance mapping. Inspect package audit and topological order. | `tests/ai-sdlc/work-packages.test.js` |
| F11 | One fixture per lifecycle transition with a missing required artefact; inspect blocked transition and exact remedy before side effects. | `tests/ai-sdlc/preflight.test.js` |
| F12 | Mechanical, bounded, risky, failed-cheap and provider-down tasks; stub provider calls/prices and inspect route, call count, budget stop and escalation record. | `tests/ai-sdlc/routing.test.js` |
| F13 | Worker scope with allowed sources, unrelated secret and false self-verification; inspect sanitized brief and independent integration evidence. | `tests/ai-sdlc/workers.test.js` |
| F14 | Two writers with overlapping files plus one disjoint writer; crash one owner and inspect prewrite stop, progress and evidence-based stale-lock recovery. | `tests/ai-sdlc/workers.test.js` |
| F15 | One tiny feature with a known failing behavior; preserve red command output, implement, rerun focused and full gate, then mutate a byte. | `tests/ai-sdlc/vertical-journey.test.js` |
| F16 | Two review rounds with line drift, malformed verdict, timeout, outage and complete fail/pass; inspect attempt accounting, carried findings and authorization. | `tests/ai-sdlc/review.test.js` |
| F17 | Shared function called from two surfaces; inject defect, fix seam and inspect both callers plus original symptom. | `tests/ai-sdlc/vertical-journey.test.js` |
| F18 | Change documented behavior and file an owner decision; inspect stale-doc rejection, verbatim trace and generated hub/index reachability. | `tests/ai-sdlc/knowledge.test.js` |
| F19 | Kill/restart every phase before and after side effect; corrupt one record. Inspect exact phase, last attempt, next action and at-most-once completed effect. | `tests/ai-sdlc/recovery.test.js` |
| F20 | Exact-commit receipt, changed source byte, stale QA health, stale real-download install and absent authorization. Inspect each release refusal. | `tests/ai-sdlc/release.test.js` |
| F21 | ASCII and multibyte memory at 8,191, 8,192 and 8,193 bytes; corrupt projection. Inspect cap, deterministic rebuild and source-ID retrieval. | `tests/ai-sdlc/memory.test.js` |
| F22 | Developer and two project records, contradictory sources, supersession, deletion request against sole protected source, injected instruction and an offline paraphrase query with no shared content words. Deny network and instrument outbound calls; corrupt the local model once. Inspect meaning-based cited result, zero network calls, conflict report, retention, isolation, inertness and named lexical fallback. | `tests/ai-sdlc/memory.test.js` |
| F23 | Export profile containing preferences alongside oracle, secrets and signer metadata; import into conflicting new repository. Inspect only allowed fields and applied/conflicted/rejected report. | `tests/ai-sdlc/profile.test.js` |
| F24 | Long active run with timed traces, duplicated old trace, missing source map and valid cold archive; count external-provider calls. Inspect cadence, body preservation, fidelity failure, cold lookup and zero paid upkeep. | `tests/ai-sdlc/trace-retention.test.js` |
| F25 | Same defect twice and same instruction twice, one positive and one negative historical case, proposed check/skill and injected full-gate regression. Inspect one cited candidate per class and promotion refusal/pass. | `tests/ai-sdlc/learning.test.js` |
| F26 | Improvement candidates targeting every protected class, one no-effect retry and one owner-approved change. Inspect refusal, abstention, immutable source and owner-key path. | `tests/ai-sdlc/learning.test.js` |
| F27 | Fresh real-download install on each supported environment, network denied and no provider credential. Inspect pinned local model/tokenizer/runtime integrity, offline meaning-based result, usable first task and parity. A missing asset fails public readiness. | `tests/ai-sdlc/portability.test.js` |
| F28 | Prior supported version with user-owned text and an index built by an older model revision; upgrade, query, then follow install/repair/removal docs. Inspect rebuilt compatible vectors, cited result, preserved bytes and actionable errors. | `tests/ai-sdlc/upgrade.test.js` |
| F29 | Public release candidate missing each evidence class in turn, then exact published archive with health failure. Inspect closed eligibility, published-byte binding and recovery record. | `tests/ai-sdlc/public-release.test.js` |
| F30 | An instrumented task run with stubbed model calls of every class (retrieval, compaction, failed attempt, reviewer, delegation, recovery), two runs delivering identical accepted evidence with differing retries, a benchmark replay of the named scenarios offline, a ratio-improving candidate that fails an acceptance/coverage/security check, and a repeated identical file read. Inspect full token/cost/time accounting, the verified-work-over-tokens ratio, a recorded baseline gating any target, the rejected guardrail-failing candidate and the redundancy signal. | `tests/ai-sdlc/efficiency.test.js` |

## Token-efficiency benchmark scenarios (R082, fixture F30)

The benchmark baseline (AC-082) is recorded over these ten reproducible
scenarios before any efficiency target is asserted: simple deterministic work;
a small single-file change; a multi-file engineering task; a long-running
session; context-window exhaustion; interrupted and resumed execution; a
repeated review loop; contradictory or stale memory; an offline clean install;
and cross-platform usage. Each scenario records total logical tokens, billable
cost including cache effects, wall time and accepted-evidence outcome, so the
verified-work-over-tokens ratio (AC-081) is comparable run to run. A measured
baseline, not a target, is the required predevelopment artefact.

## Deterministic graph check to install as a product invariant

The contract check reads requirement, criterion, test, journey and package
manifests as data. It rejects duplicate IDs, missing references, more than one
primary criterion, any orphan criterion, criterion without a test and fixture,
journey without mapped requirements and E2E proving test, and package without
approved requirement/criterion references. It also compares protected hashes:
a requirement change invalidates acceptance review until the owner amends the
whole protected set. It reports exact offending IDs and exits nonzero.

The test for this validator is `PT-009` through `PT-014` over `F06`, including
mutation cases. The implementation may choose a compact JSON/TSV format; this
planning package does not add a production parser. The final signed manifest
must list real test files and hashes under the **existing single key**. The
present signing script is scoped to the already signed 6.0.0 oracle, so
extending it for a second programme is a bounded implementation task after
owner review. Until that is done, this package is reviewable, not signable.
