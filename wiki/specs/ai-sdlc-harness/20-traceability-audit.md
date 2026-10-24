---
status: proposed
checked: 2026-10-24
owner: rig-grilling
---

# Specification regression and traceability audit

The existing package remains the source of intent. This audit records the
differences discovered by applying the owner's one-primary-criterion rule to
the **whole** product. The new [contract](15-gate1-contract.md), [test
manifest](16-test-manifest.md), [journeys](17-customer-lifecycle.md), editable
[interactions](18-system-interactions.md) and [work packages](19-work-packages-and-public-roadmap.md)
are the reconciled proposal.

## Coverage result

| Audit dimension | Result and limit |
|---|---|
| Original product inventory | All 22 functional and 10 nonfunctional headings in the product definition map to at least one atomic row. Some rows carry both source codes. The 2026-10-24 owner directive adds public install, upgrade, transfer, post-release and traceability obligations. |
| Atomic graph | 84 unique `R` IDs, 84 unique primary `AC` IDs and 84 unique `PT` IDs; each row has source, exact statement, criterion, fixture, journey, dependency and proposed/current-evidence status. R080–R084 freeze the owner's token-efficiency obligations (per the 2026-10-24 pre-Gate-1 directive). This checks the proposal's syntax, not whether the owner approves every behavior. |
| Test fixtures | 30 named fixtures define independent setup/action/observation; planned test files are named. They are obligations, not existing runnable cases. |
| Journeys | 20 named end-to-end scenarios span new/existing projects, greenfield, defect, provider outage, concurrency, restart, transfer, upgrade and release. Each has mapped requirements and a planned E2E check. |
| Work packages | 11 dependency-aware packages cite requirement ranges and derive same-numbered criteria/tests. The coordinator must expand ranges into explicit IDs before dispatch. |
| Current implementation evidence | Existing install, signing, review and release code supports some rows but does not prove the full programme. The locally green review change is uncommitted; current QA/CI evidence belongs to 6.0.0. |

A read-only deterministic audit on this draft counted 84 ordered requirement,
criterion and test IDs; all original functional/nonfunctional source codes;
30 used fixtures; 20 journeys with both mapped requirements and E2E IDs; and
11 packages. It found no duplicate, missing, out-of-range or orphaned
references in these proposal files. This is a **planning audit result**, not
the permanent installed validator or a passing product test.

## Disposition of all 18 earlier broad criteria

The earlier cases remain as **supplemental journey or cross-cutting criteria**;
they are not discarded or counted as 18 direct primary mappings.

| Earlier case | Direct atomic coverage and journey |
|---|---|
| AC-J1 | R001–R005,R068,R077/R078; J01/J02 |
| AC-J2 | R006–R008,R049; J03/J04 |
| AC-J3 | R009–R016,R019; J05/J06 |
| AC-J4 | R017/R018; J06 |
| AC-J5 | R019–R023; J07 |
| AC-J6 | R023–R043; J08/J09 |
| AC-J7 | R040–R042,R056; J13 |
| AC-J8 | R034–R036; J11 |
| AC-J9 | R029/R030; J10 |
| AC-J10 | R054/R055; J17 |
| AC-C1 | R047/R048; J16 |
| AC-C19 | R049–R053,R068,R073/R074,R077–R079; J16 |
| AC-C16 | R025–R027,R065; J08/J14 |
| AC-C20 | R056–R058,R074/R076; J18 |
| AC-C13 | R059–R061,R075; J19 |
| AC-C14 | R062–R064; J19 |
| AC-C22 | R021/R022; J07 |
| AC-R1 | R043–R046,R071/R072,R077/R078; J15 |

The earlier matrix had no explicit E2E obligations for acceptance graph mutation,
documentation/evidence drift, unavailable model providers or upgrade and
post-release maintenance. J05/J12/J14/J20 add them. Release-accounting,
memory and improvement remain in the package, but the contract begins at a
fresh user's discovery and ends at transfer and maintenance.

## Contradictions and resolutions

| Prior wording or gap | Resolution in this proposal |
|---|---|
| Router currently places design before signing, while the owner settled requirements+acceptance+test lock first. | R015/R019 and the state diagram use owner order. WP01 must align router/skill text after the new oracle is approved. The existing signature already excludes design bytes. |
| Earlier seven-slice roadmap ended at horizontal coherence, without a complete public install/upgrade/release path. | WP10/WP11 and the public-release milestone add packaging, docs, migration, real download, QA, production validation and maintenance. |
| Earlier 18 criteria mixed multiple independently testable behaviors. | 79 atomic rows and same-numbered primary criteria/tests; the 18 become journey/cross-cutting checks. |
| Earlier A–H journey compressed discovery, testing, maintenance and transfer. | 13 phase contracts and 20 end-to-end journeys provide failure, recovery and retention evidence. |
| Earlier architecture called the active projection the mandatory read and sometimes implied it alone carries decisions. | Projection remains capped; deep scoped records, provenance and retrieval preserve overflow. An over-cap protected subset reports a gap. |
| Signing mechanism is presently bound to the existing 6.0.0 `wiki/gate1` files. | New programme needs an owner-reviewed manifest path under the **same key**. No new trust root and no overwrite of the existing signed oracle. |
| Source-level matrix had selected ports but did not show a disposition for all 22 capabilities. | The appended capability-by-capability inheritance map says port, standard, pattern or existing Rig/native owner for each. |
| Earlier draft made semantic search optional. | Owner requires offline meaning-based search by default for the public release. R052/R068/R077–R079 and F22/F27/F28 require packaged local assets, network-denied paraphrase recall and compatible index migration. Cited lexical recall is a failure fallback, not release proof. |

## Settled semantic-search decision

The [intent owner ruled](../../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
that meaning-based search must work offline by default in the public release.
The model, tokenizer and inference runtime are packaged, pinned and integrity
checked. A real downloaded clean install must answer a meaning-equivalent query
without shared content words while network access is denied. The candidate
Transformers.js/model pins are research inputs; full footprint, native support,
licences and runtime behavior still require implementation evidence.

## Approval and execution readiness

The owner approved the product direction and authorised bounded Gate 1
preparation. That preparation is complete and the package is **ready for
signing**.

| Obligation | State |
|---|---|
| Deterministic graph validator | Implemented at `rig/catalog/baseline/check-traceability.js`, shipped in the mandatory install baseline as `.rig/bin/check-traceability.js`, named by the router and `standards/traceability.md`, and proven against six mutation classes. |
| 84 proving tests | Authored across the `tests/ai-sdlc/` lane's 24 files (R080–R084 add `efficiency.test.js`, which runs red with `capability not implemented: efficiency.js` until the capability ships); environment-bound lanes are flagged, and unbuilt capabilities are the preimplementation red. |
| 30 fixtures | Built from real bytes in temporary repositories by the lane harness. |
| Second signing programme | `approve-gate1.js --programme ai-sdlc` under the same key, principal and namespace, with its own message prefix and manifest. |
| 6.0.0 oracle | Unchanged. `scripts/check-advanced-spec.js`, `wiki/gate1/testing-infrastructure.manifest` and `package.json` scripts were not edited. |
| Hardware-backed signing | The absent-device path is proven; the real `sk-ssh-ed25519@openssh.com` signature is an explicit environment-bound lane, never simulated. |
| Repository regression | The complete local gate runs without optional live-tracker credentials; the separate token-backed comparison reflects the already-advanced 6.0 release tracker rather than this proposed contract. |

The acceptance lane lives outside the `tests/*.test.js` gate glob, so an
expected failure for an unbuilt capability can never redden repository CI.
After the owner signs, the coordinator prepares the editable design and the
work-package briefs. This sequencing does not alter the separate 6.0.0 QA
closeout.
