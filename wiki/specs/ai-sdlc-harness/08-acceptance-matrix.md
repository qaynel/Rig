---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Proposed acceptance matrix

These 18 broad cases are preserved as **supplemental journey and cross-cutting
checks**. The [atomic approval candidate](15-gate1-contract.md) supplies one
primary criterion per requirement and the [regression audit](20-traceability-audit.md)
maps every row here to its direct coverage. Do not sign this matrix alone as
the new programme oracle.

These are **not signed Gate 1 cases**. Before implementation, the owner reviews requirements, acceptance and manifested tests together and signs them with the existing key. A technical design follows and remains editable. Existing passing tests are evidence of today's baseline, not proof of the proposed full product.

| ID | User-observable criterion and proving check | Current state |
|---|---|---|
| AC-J1 | Fresh developer installs one corpus, agent finds/reuses existing capability, reports conflicts and a runnable first task. Clean-install scenario. | partial |
| AC-J2 | An incomplete idea yields only unresolved product questions; a settled answer with provenance is never re-asked after restart. Cold-session replay. | not met |
| AC-J3 | Requirements, acceptance and test manifest lock together **before** technical design. Signed-byte test; later design edit does not alter oracle signature. | order not met; signature scope already correct |
| AC-J4 | Supported `sk-ssh-ed25519@openssh.com` device signs and verifies through existing Gate 1 path; unavailable device leaves gate closed with exact remedy. Real hardware integration or clearly reported hardware gap. | not verified end to end |
| AC-J5 | Design/scope cites current code and signed criteria; a stale wiki claim is caught by source verification. Fixture from recorded review issue. | partial |
| AC-J6 | One task completes test-first implementation, full gate, independent review, docs and exact-commit release-readiness; failure returns to owning phase with evidence. End-to-end replay. | components exist; integration not met |
| AC-J7 | Interrupted at every transition, a new session recovers phase, failed attempt and next action from repo alone; no operation is double-counted. Kill/restart tests. | review phase only |
| AC-J8 | Provider outage, invalid reviewer output and timeout do not consume review authorization; completed pass/fail verdict does; retry bound holds. | **locally met** by uncommitted 49 review tests; not released |
| AC-J9 | Concurrent agents with overlapping ownership stop before conflicting write; independent work proceeds; stale lock offers explicit recovery. | not met |
| AC-J10 | New project imports portable preferences/workflows, reports conflicts, excludes project oracle, run state, secrets and signer rights. Fresh-repo round-trip and hostile fixtures. | not met |
| AC-C1 | Active projection ≤8,192 UTF-8 bytes on multibyte input; deterministic output; overflow remains retrievable by source ID; corrupt projection rebuilds from source. | not met |
| AC-C19 | A fresh public install retrieves a paraphrased memory by meaning with network denied and cites its source; local-model failure reports a gap and falls back to cited lexical results, which cannot satisfy public readiness; recalled instructions remain inert data. | not met |
| AC-C16 | Deterministic tool first, bounded low-cost model next, stronger model only with recorded reason; context/turn/retry/spend limits stop honestly. Routing fixture across simple, risky and unavailable-provider work. | not met |
| AC-C20 | Three-minute trace cadence remains; hot/warm/cold compaction preserves immutable bodies, owner decisions, negative lessons and protected evidence. Before/after fidelity manifest and cold lookup match. | not met |
| AC-C13 | Twice-seen class produces one candidate with both sources; before/after fixture, historical positive/negative replay and unchanged full gate pass before safe local check promotion. | detection partial; promotion not met |
| AC-C14 | Improvement cannot edit frozen oracle, signing, policy, security, evaluator or release rules. Failed and no-effect candidates persist and are not re-proposed without new evidence. Adversarial fixtures. | not met |
| AC-C22 | Each adopted upstream component has pinned source, licence notice, narrow integration and a port-specific test; no bundled restricted runner or whole competing runtime enters payload. Source audit. | plan drafted; code not adopted |
| AC-R1 | Exact QA commit passes existing automated health and real-download clean-install checks; missing tool or stale digest is a named failure. | existing release machinery; QA closeout separate |

## Evidence discipline

The existing `npm test` run passed locally with 1,347 passes, zero failures and five skips on the uncommitted baseline. The review state machine was green locally at 49/49. CI and QA promotion remain unresolved and must be checked on their exact future bytes. No proposal in this matrix is marked delivered from a design document alone.

No scalar performance target is imposed. During implementation, record before/after read cost, paid calls, retry counts, retrieval misses and manual interruptions as diagnostic evidence. A candidate succeeds only if the user scenario and immutable oracle pass, with no regression in known good cases. The full programme is done when every journey case above passes, the owner's proving-test/clean-install/docs/security-review/horizontal-coherence bar is met, and a cold agent can finish an interrupted phase from repository evidence alone.
