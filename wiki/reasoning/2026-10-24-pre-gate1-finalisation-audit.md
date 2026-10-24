---
date: 2026-10-24
source: agent
topics: gate1-signing, the-two-gates, agent-working-conventions
decisions:
status: superseded
tags: gate1, audit
summary: The finalisation audit expanded the proposed contract to 84 obligations and exposed signing-readiness follow-up work.
checked: 2026-10-24
owner: rig-grilling
---

# Pre-Gate 1 finalisation directive — audit against reality

The owner pasted a master pre-Gate 1 finalisation directive (workstreams A–H:
open-source quality integration, context/token efficiency, product completeness,
spec consolidation, acceptance-test audit, test completion, architecture,
final validation). This trace records what the directive demands versus what the
`wiki/specs/ai-sdlc-harness/` package already contains, verified today.

## Verified present and passing

- Deterministic traceability validator runs clean:
  `node rig/catalog/baseline/check-traceability.js` →
  `79 requirements, 79 primary criteria, 79 proving tests, 29 fixtures, 20 journeys, 11 packages — graph complete`.
- Proving-test lane exists at `tests/ai-sdlc/` (83 cases / 24 files), outside the
  repository gate glob so a preimplementation red never reddens CI.
- Signer extension, decision register (all 8 decisions settled), customer
  lifecycle (13 phases / 20 journeys), system interactions, 11 work packages,
  source-level reuse matrix, traceability audit — all authored. Package README
  declares it **ready for signing** with a handoff at
  `wiki/gate1/ai-sdlc/signing-instructions.md`.

Conclusion: directive workstreams **C, D, E, F, G, H are substantially done**.

## Two genuine gaps against the directive

1. **Workstream A assumes an open-source QUALITY/governance audit that does not
   exist in this repo.** The directive names "the existing open-source audit"
   with 13 Open Source Guides, 45 controls, 64 OpenSSF baseline subcontrols,
   62 proposed OSS corrective items, gap register and owner-decision register,
   and calls it already-authorised P1a work to *reconcile and integrate*. A
   search of the worktree and full git history (`--all`) finds no such package.
   What exists (`12-reuse-plan.md`) is source-level *reuse* inheritance — a
   different thing from an OpenSSF *governance* posture. So Workstream A cannot
   be "integrated"; it has not been produced here. Either the owner holds it
   elsewhere (must be supplied) or it is net-new work.

2. **Token efficiency (Workstream B) is specified as a capability in prose but
   is not yet a measurable contract.** No `efficiency = verified work / tokens`
   formula, no baseline measurements, no 10-scenario benchmark spec in the
   package. The directive requires baselines recorded before targets.

## Owner decisions and what was executed (2026-10-24)

Owner chose: produce the OSS audit net-new, and freeze token efficiency in Gate 1.

- **Token efficiency frozen (Gap 2).** Added atomic rows R080–R084 to
  `15-gate1-contract.md`: full per-task token/cost/time accounting across every
  call class, the verified-work-over-tokens ratio, a recorded benchmark baseline
  before any target, a correctness-over-savings guardrail, and redundant-read
  detection. New fixture F30 and ten named benchmark scenarios added to
  `16-test-manifest.md`; rows + PTs folded into WP05 in `19-work-packages`.
  Real proving tests authored at `tests/ai-sdlc/efficiency.test.js` (5 cases,
  all red with `capability not implemented: efficiency.js` — the honest
  preimplementation red). **Validator re-run green: 84/84/84/30/20/11.**
- **OSS audit net-new (Gap 1).** `21-open-source-quality-audit.md`: evidence-based
  OpenSSF-Baseline / GitHub-guide governance audit. SECURITY.md/LICENSE/CoC/
  CONTRIBUTING/CI present; missing Dependabot, dependency-review, release
  provenance/SBOM; org settings unverified. The directive's "disabled private
  vuln reporting" finding is **stale** (GHSA path documented). Governance gaps
  are existing-6.0.0-release maintainer work, **not** product-contract rows.
  One material product gap surfaced for owner approval: **proposed R085**
  (bundled-asset SBOM) — held outside the signable set per authority boundary.

## Recommendation

The AI-SDLC product contract is complete and traceability-clean. Treat it as
GO for signing *on its own terms* once the owner reviews the 79-row contract.
Do not re-open C–H. The two gaps are additive scope the directive introduced:
confirm whether the OSS/OpenSSF audit exists elsewhere, and whether token
efficiency must be a frozen Gate 1 obligation or a post-sign engineering KPI.
Authority remains planning-only; no signing performed.
