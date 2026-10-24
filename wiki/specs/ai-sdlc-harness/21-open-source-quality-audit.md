---
status: proposed
checked: 2026-10-24
owner: rig-grilling
---

# Open-source quality audit (OpenSSF Baseline + GitHub OSS guides)

Authored net-new on 2026-10-24 under the owner's pre-Gate-1 finalisation
directive (Workstream A). The directive referred to an "existing open-source
audit" (13 guides, 45 controls, 64 OpenSSF subcontrols, 62 corrective items);
that package does not exist in this repository or its git history, so this is a
real evidence-based audit of the **public Rig repository** against the OpenSSF
Baseline control families and GitHub's open-source project guides, not a
reconciliation of a prior backlog. The source-level *reuse* inheritance work is
separate and lives in [12-reuse-plan.md](12-reuse-plan.md); this document is
about *governance and release quality*, a different axis.

## Scope boundary (settled by North star 1 and the product-first directive)

Two things must not be confused:

- **Public-repository governance** — how the Rig project itself is run on
  GitHub. This is *maintainer process*, not a product behaviour. It does **not**
  belong in the frozen Gate 1 product contract.
- **Product requirements** — what the shipped Rig product must demonstrably do
  in a user's own (usually private) repository. Only these belong in the signed
  graph, and only with owner approval.

Governance obligations are never scoped or counted per host (North star 1).

## Evidence gathered from the repository (2026-10-24)

| Control area | State in this repo | Evidence |
|---|---|---|
| Vulnerability reporting | **Present.** Private disclosure via GitHub Security Advisories, public issues refused. | `SECURITY.md` |
| Licence | **Present.** | `LICENSE` |
| Code of conduct | **Present.** | `CODE_OF_CONDUCT.md` |
| Contribution guide | **Present.** | `CONTRIBUTING.md` |
| Issue / PR templates | **Present.** | `.github/ISSUE_TEMPLATE`, `PULL_REQUEST_TEMPLATE.md` |
| CI on every change | **Present.** | `.github/workflows/test.yml`, `e2e.yml`, `health.yml`, `release-eligibility.yml`, `gate1-pin.yml` |
| Automated dependency updates | **Missing.** No Dependabot/Renovate config. | no `.github/dependabot.yml` |
| Dependency review on PRs | **Missing.** | no `dependency-review` workflow |
| Release provenance / SBOM / signed artifacts | **Missing** for the published installer archive. (Distinct from Rig's Gate 1 *oracle* signing, which exists.) | no `scorecard`/`sbom`/`provenance`/`cosign` in `.github/` |
| Branch protection, required 2FA, least-privilege tokens | **Unknown — org settings, not verifiable from the repo.** | named gap; owner must confirm |

## Gap register vs OpenSSF Baseline families

| Baseline family | Verdict | Note |
|---|---|---|
| Access control (2FA, branch protection, least-privilege) | **Unverified** | GitHub org/repo settings; outside this worktree. Owner-only confirmation. |
| Build & release integrity | **Partial** | CI gates and `release-eligibility` exist; artifact provenance/SBOM for the published archive do not. |
| Documentation (security, contributing, licence, CoC) | **Covered** | All four files present. |
| Governance & maintainership | **Partial** | Process documented; maintainer/2FA policy unverified. |
| Vulnerability management | **Partial** | Private reporting path present; automated dependency alerting (Dependabot) and dependency-review absent. |

The directive's "known findings" are reconciled here: **disabled private
vulnerability reporting is stale** — `SECURITY.md` documents an active GHSA
path. **Disabled dependency-security alerts** and **incomplete release
provenance** are confirmed real and belong to existing-release remediation, not
the product contract. The **existing release full-test failure** is the 6.0.0
Linux-runner CI red already diagnosed
([trace](../../reasoning/2026-10-23-ci-red-linux-runner-diagnosis.md)); it is a
6.0.0 closeout item, not a new-product requirement.

## Disposition

### A. Existing-release remediation (6.0.0 maintainer backlog — not Gate 1)

1. Add `.github/dependabot.yml` for npm (and Actions) dependency alerts.
2. Add a `dependency-review` step on PRs.
3. Add release-artifact provenance/SBOM for the published installer archive.
4. Confirm branch protection, required 2FA and least-privilege workflow tokens
   (owner — org settings).
5. Fix the 6.0.0 Linux CI red (already tracked).

These are tracked as repository hygiene, filed on the maintainer backlog. They
do not block signing the product contract and must not redden product CI.

### B. Already covered by the proposed product contract

- Independent security + review + full-scenario coherence before a release
  candidate — **R071**.
- Exact-byte receipt binding of review/test evidence — **R043**.
- Post-publication install + health validation with rollback — **R072**.
- Real-download clean-install verification on the exact commit — **R045**.
- Pinned, licensed, integrity-checked bundled assets — **R022, R077**.

### C. Material missing *product* requirements — proposed, owner approval required

Per the directive, only material omissions are surfaced; nothing is silently
frozen. One candidate is material:

- **Proposed R085 (not yet in the graph):** the public distribution ships a
  dependency and licence manifest (SBOM) for its bundled third-party assets,
  and a clean install can enumerate every bundled component with its licence.
  This extends R022/R077 from "pinned and integrity-checked" to "inventoried".

If the owner approves R085, it is added as an atomic row (source `N10,O24`,
primary AC-085, PT-085, fixture F27, journey J01/J15, work package WP10/WP11)
and the validator re-run — the same mechanical path used for R080–R084. Until
approved it stays here as a proposal, outside the signable set.

## Conclusion

Public-repo governance is largely in place; the real gaps (dependency alerting,
dependency review, release provenance/SBOM, unverified org settings) are
existing-release maintainer work, not product-contract requirements. The one
material product gap is a bundled-asset SBOM (proposed R085), held for owner
approval. No governance obligation is frozen into Gate 1 without that approval.
