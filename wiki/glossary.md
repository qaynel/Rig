# Glossary

Terms used across Rig's gates, topic hubs, and source record. Where historical
documents use an older meaning, the current meaning below wins unless a frozen
gate says otherwise.

| Term | Meaning | Authority |
|---|---|---|
| **Acceptance case (`AT-*`)** | An independently authored, externally observable Gate 1 test case. Gate 2 may implement it but cannot change its verdict. | [Gate 1 acceptance](gate1/acceptance.md) |
| **Action evaluator** | The common policy decision point that normalizes shell, web, and MCP actions before allow, deny, or exact one-use approval. | [Gate 2 §8.6](gate2/technical-spec.md#86-common-action-evaluator) |
| **Active policy** | The last exact policy revision approved by the user. Candidate policy bytes are inert until activation succeeds. | [Gate 2 §8.3](gate2/technical-spec.md#83-candidate-active-snapshot-and-exact-revision-identity) |
| **Agent-tech safety** | Controls protecting the agent environment and its actions: sanitation, drift, secrets, network/tool policy, and git/CI floors. It is not product security. | [Gate 1 §2](gate1/business-spec.md) |
| **AHE (Agentic Harness Engineering)** | Treating the agent's own harness — skills, rules, routing, and knowledge base — as an engineered artifact iterated with the same discipline as product code. Named and confirmed by the intent owner on 2026-09-04; a direction, not yet a built mechanism. | [Grilling 2026-09-04](reasoning/2026-09-04-structural-workflow-fix-grilling.md) |
| **Axis** | One host integration surface: `instruction`, `native_skill`, `shell_hook`, `web_hook`, `mcp_hook`, or `mcp_config`. | [Gate 2 §11.1](gate2/technical-spec.md#111-host-contracts) |
| **B1 / config-host brain** | Rig authors configuration and the host agent executes it. Rig ships no model runtime or model key. | [Advanced grilling, GA-2](sources/logs/advanced-grilling.md) |
| **Binding** | The concrete runnable or verifiable implementation attached to one selected service. | [Gate 2 §9.1](gate2/technical-spec.md#91-binding-schema) |
| **Byte-landing test** | A test proving an adapter emits the exact expected bytes at the exact expected path on a fresh target. It does not claim observed vendor execution. | [Gate 2 §11](gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path) |
| **Candidate policy** | Strictly validated proposed policy bytes that have no enforcement effect until the exact revision is approved. | [Gate 2 §8.2–8.3](gate2/technical-spec.md#82-authoritative-policy-schema) |
| **Catalogue** | Rig's à-la-carte engineering-capability inventory. The catalogue, not fixed install packages, is the product. | [Gate 1 §5](gate1/business-spec.md) |
| **Catalogue leaf** | One service at the bottom of `family → group → service → grade`. The initial catalogue has 115 leaves. | [Gate 2 §5](gate2/technical-spec.md#5-catalogue-contract) |
| **Convention disposition** | A service result used only when executable behavior is not meaningful; it must name service-specific instructions, a reason, and an installed-state verifier. | [Gate 2 §9](gate2/technical-spec.md#9-runnable-services-and-reports) |
| **Coverage gap** | An honest non-success state: required evidence, mechanism, binding, adapter, or result is missing or unverifiable. | [Gate 2 §9.3](gate2/technical-spec.md#93-report-schema) |
| **Decision IDs** | `G*` records foundational grilling, `GA-*` advanced grilling, `D*` Gate 1 revisions, and `AD-*` Gate 2 mechanisms. | [Decision index](index/decisions.md) |
| **Delegated policy-edit mode** | Session-only authority for an agent to draft policy changes. It never permits activation and is never persisted. | [Gate 1 §2](gate1/business-spec.md) |
| **Disposition** | Exactly one honest service shape: executable, convention, or surfaceless. | [Gate 2 §5.2](gate2/technical-spec.md#52-catalogue-entry) |
| **Emitted axis** | A host axis with a complete contract and passing byte-landing test. `unsupported` is the only other host-axis emission state. | [Gate 2 §11.1](gate2/technical-spec.md#111-host-contracts) |
| **Enforcement site** | The phase or CI check obliged to catch a named mistake: `grilling-closeout`, `product-design-closeout`, `tdd-closeout`, `code-review-checklist`, or `ci-grep`. Designed, not yet implemented. | [Workflow fix design](reasoning/2026-09-04-structural-workflow-fix-design.md) |
| **Evidence epoch** | The context in which control evidence is current. Policy or recovery changes invalidate prior evidence rather than letting stale success survive. | [Gate 2 §8.9](gate2/technical-spec.md#89-gitci-dispatch-and-truthful-evidence) |
| **Family** | The top catalogue level: Development, Testing, Infrastructure, or Product-Security. | [Gate 1 §5](gate1/business-spec.md) |
| **Gate 1** | Frozen business intent plus acceptance cases. Only the intent owner may revise it by returning to grilling. | [The two gates](topics/the-two-gates.md) |
| **Gate 2** | The sole technical implementation authority once reviewed and frozen against the current Gate 1 bytes. | [The two gates](topics/the-two-gates.md) |
| **Grade** | Per-service depth (`minimal`, `standard`, `maximal`), composed cumulatively; it does not change service identity. | [Gate 2 §5.3](gate2/technical-spec.md#53-grade-composition) |
| **Graft** | Typed, additive adaptation of Rig into existing repository and host files, preserving user-owned content. | [Gate 2 §7](gate2/technical-spec.md#7-graft-mechanics) |
| **Install identity** | A generated clone-local ID stored under the repository's git path and used to attribute user-global writes. | [Gate 2 §7.4](gate2/technical-spec.md#74-user-global-writes-and-repository-attribution) |
| **Install manifest** | The receipt recording ownership, preimages, hashes, and completion state for install resume and removal. | [Gate 2 §7.6](gate2/technical-spec.md#76-install-manifest-resume-and-removal) |
| **Intent owner** | The human authority who freezes or revises Gate 1 and attests the Gate 1 signing key class. | [Gate 1 §2](gate1/business-spec.md) |
| **Journal** | The append-only install record onboarding writes around each disk change, so an interrupted apply can be resumed and each path's owner identified from the record that first wrote it. | [Graft mechanics](topics/graft-mechanics.md) |
| **Managed block** | A delimited Rig-owned region inside a user-owned file. Removal may touch that region, not the surrounding file. | [Gate 2 §7.2](gate2/technical-spec.md#72-instruction-graft) |
| **Mistake file** | One file per named anti-pattern under [`mistakes/`](mistakes/), anchored to a concrete example with a check to run before the same shape ships again. Not a chronological log — that is [traps](index/traps.md). | [Mistakes](mistakes/README.md) |
| **One-use approval** | Clone-local authorization for one complete unchanged action, consumed atomically before dispatch. | [Gate 2 §8.5](gate2/technical-spec.md#85-one-use-approvals) |
| **Oracle** | The triple Gate 1 freezes under one signature: business intent, acceptance criteria, and the testing infrastructure that checks them. An implementation agent may never edit it; changing it needs an unfreeze request and a human re-sign. | [The two gates](topics/the-two-gates.md) |
| **Path A / Path B** | The 2026-08-30 office-hours split of post-eval work. A: concrete install-bug fixes plus a frozen measurement rubric. B: adaptive, agent-led onboarding, gated by grilling. Both have merged. | [Path A/B scoping](reasoning/2026-08-30-office-hours-path-a-path-b-scoping.md) |
| **Policy signer** | The everyday user credential that activates an exact policy revision. It is separate from Gate 1's signer and from recovery credentials. | [Gate 2 §8.4](gate2/technical-spec.md#84-user-presence-approval-signer-setup-and-recovery) |
| **Product security** | The selectable catalogue family that protects the user's application or codebase, distinct from agent-tech safety. | [Gate 1 §2](gate1/business-spec.md) |
| **Re-sign multiplier** | The cost pattern where editing a document that carries the signed oracle invalidates the signature and forces a fresh human ceremony, so coupled prose edits multiply signing events rather than adding to them. | [Workflow fix design](reasoning/2026-09-04-structural-workflow-fix-design.md) |
| **Reasoning trace** | A dated, immutable record of supplied thinking. Topic hubs synthesize it and can be rewritten; the trace cannot. | [Reasoning convention](reasoning/README.md) |
| **Recovery credential** | A distinct, pre-registered `sk-*` SSHSIG identity used only to replace a lost policy signer; exhaustion is terminal. | [Gate 2 §8.4](gate2/technical-spec.md#84-user-presence-approval-signer-setup-and-recovery) |
| **Review receipt** | Wrapper-authored JSON binding a fresh, report-only semantic review to exact target and Gate 1 digests. | [Gate 2 §12.3](gate2/technical-spec.md#123-release-gate) |
| **Sanitation** | Bounded, non-executing inspection of existing harness bytes before profiling or recommendation. | [Gate 2 §8.7](gate2/technical-spec.md#87-sanitation-and-bounded-remediation) |
| **Service** | A stable catalogue capability selected independently and assigned one grade. | [Gate 2 §5.1](gate2/technical-spec.md#51-canonical-ids) |
| **Skill shelf** | The vendored skill inventory, organized `family → tool/capability → skill` by capability rather than by vendor origin. Distinct from the catalogue's `family → group → service → grade`, which is untouched. | [Path B follow-up decisions](reasoning/2026-08-31-path-b-follow-up-decisions.md) |
| **Source** | An immutable decision log, captured reference, review receipt, or superseded design under [`sources/`](sources/). | [Wiki home](Home.md) |
| **Specification gate** | The first, short-circuiting `npm test` check that proves Gate integrity, traceability, review, and executable-target completeness before code tests. | [Gate 2, AD-18/AD-28](gate2/technical-spec.md#2-final-mechanism-decisions) |
| **Surfaceless disposition** | A successful vacuous result only when an explicit predicate proves no runnable surface exists, with the exact reason recorded. | [Gate 2 §9.2](gate2/technical-spec.md#92-run-scope) |
| **Tier 1** | The curated payload installed into a target repository: `routing.md`, the two rules, and the phase skills. Historically constrained to markdown only; the intent owner retired that constraint on 2026-09-04 in favour of scripts, markdown, and MCP. | [Grilling 2026-09-04, B2](reasoning/2026-09-04-structural-workflow-fix-grilling.md) |
| **Topic hub** | A mutable synthesis page organized by subject and backed by direct links to gates and source records. | [Wiki home](Home.md) |
| **Unfreeze request** | The filled request required before a frozen oracle test may change: it names the test, the change, and evidence that the assertion is wrong or the specification moved. An agent may propose one; only the key holder may act on it. | [The two gates](topics/the-two-gates.md) |
| **User-global write** | A namespaced additive write outside the repository when a vendor offers no repo-local surface. It is attributed and removed per install identity. | [Gate 2 §7.4](gate2/technical-spec.md#74-user-global-writes-and-repository-attribution) |
| **Verified** | A control/report evidence state meaning current-epoch evidence exists. It is not a host tier or host-axis label. | [Gate 2 §9.3 and §11.1](gate2/technical-spec.md#93-report-schema) |

## Historical vocabulary

`Basic`, `mid`, and `Advanced` still appear in old documents and in the legacy
CLI. They are not current install packages; GA-9g replaced them with one
catalogue plus per-service grades. `Advanced` in gate filenames names the
historical workstream, not a selectable package. See the [timeline](index/timeline.md)
and [superseded taxonomy](archive/deprecated-tier-taxonomy/README.md).
