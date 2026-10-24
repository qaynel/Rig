---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Decision register

The owner's [final-definition directive](../../reasoning/2026-10-24-final-product-definition-owner-directive.md)
adds a settled invariant: every atomic requirement has one directly mapped
primary acceptance criterion and proving test, with reverse mapping and
journey/package coverage. The [new contract](15-gate1-contract.md) applies it
to the complete programme. The owner then [required offline meaning-based
memory search](../../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
by default for the public release. No product choice remains open in this
planning package; owner review of the exact proposed contract still remains.

Owner rulings in the [verbatim product-first directive](../../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md) supersede the open questions and memory-first recommendations in the earlier draft. These are **product decisions**, not a Gate 1 signature for this new programme. The proposed requirements and tests still need their own owner-controlled lock before implementation.

| ID | Original question / earlier reading | Settled resolution and evidence |
|---|---|---|
| D-01 | Did the lock include the technical design, and must design precede it? | **Settled.** Sign business requirements, acceptance and manifested tests together **before** technical design. Existing `approve-gate1.js` already signs that oracle scope; design presence and traceability are checked separately and its digest binds later receipts. Pipeline instructions need later alignment, not a new signer. |
| D-02 | Hardware FIDO key path optional or required? | **Settled.** Specify and verify `sk-ssh-ed25519@openssh.com` with the existing Gate 1 SSH signing key path. Report unavailable hardware honestly; no second trust root or silent fallback. Owner retains the choice of their actual device. |
| D-03 | Must Rig stay config-only despite owner's waiver? | **Settled.** No config-only waiver constrains the product. Rig may use scripts, adapters, MCP and bounded local services when needed, while the host agent still owns engineering execution and existing provider abilities are reused. Adopt no whole competing agent runtime by default. |
| D-04 | Active memory cap? | **Settled at 8,192 UTF-8 bytes** for the rendered working view. Rich scoped memory, semantic retrieval, provenance, history and negative lessons are separately stored/retrievable. A cap failure reports its exact gap. |
| D-05 | Does mutable memory invalidate signed/release evidence? | **Settled.** Ordinary mutable memory and run records are outside the implementation digest, as review receipts already are. Protected source/evidence retains its own exact-byte binding. A test must prove a memory write does not invalidate a receipt and a code change does. |
| D-06 | Does every prevention check need owner signature? | **Settled.** Safe bounded learning and unprotected local checks may promote automatically after fixed replay/regression proof. Acceptance, policy, signing/trust, security, evaluator and release-authority changes remain protected by the existing owner key. Uncertain classification stays a proposal. |
| D-07 | Relax the three-minute trace cadence? | **Settled.** Keep it. Add automatic low-cost hot/warm/cold compaction with a fidelity check; retain immutable trace bodies, decision links and protected evidence. |
| D-08 | May meaning-based memory search require a provider or first-run download in the public release? | **Settled: no.** Offline semantic search must work by default from installed assets. Lexical search remains a recovery fallback, not release proof. Package footprint, licence, native compatibility and real-download offline verification are mandatory. |

## Further settled constraints

| Topic | Ruling |
|---|---|
| Product scope | Full A–H customer journey from install and idea to verified delivery and continuous learning; builder-first track. |
| Cost | Deterministic scripts first; least expensive reliable host model; bounded context, turns, retries and spend, with escalation for complex/binding judgement. Required semantic search uses a local model with no paid call. Optional external model work needs explicit cost/privacy preflight. |
| Open source | Source-level matrix with pinned commit, component, licence, adaptation, discard scope, Rig overlap and verifying fixture. Source inspiration alone is labelled as such. |
| Trust and review | One Gate 1 key; signed oracle stays frozen. A review authorization is consumed only by positive evidence of a completed verdict. Existing implementation remains locally green and uncommitted. |
| Release | 6.0.0 QA/CI work remains separate; no expansion claim changes the exact-QA-commit automated promotion gate. |
| Current authorization | Owner authorises implementation, local independent agent review, verification and cleanup ([directive](../../reasoning/2026-10-24-ai-sdlc-readiness-owner-directive.md)). Protected acceptance stays unchanged. Commit, push, publication and production remain unauthorised. |

## Engineering choices for the proposed design

The first vertical slice is one complete local task through the existing gates, then deeper memory, cost routing, retention and improvement. Existing `wiki-query` supplies lexical fallback; a pinned local model/runtime candidate supplies required offline meaning-based search for the public release. Planned narrow ports and the model candidate are listed in [the source matrix](12-reuse-plan.md); none is installed by this planning package. The technical implementation may revise these choices after the oracle is locked, provided the owner-visible behavior and signed acceptance remain satisfied.

No further owner choice is required to finish this planning package. Future Gate 1 signing is the established owner action for implementation, not an open architecture question.
