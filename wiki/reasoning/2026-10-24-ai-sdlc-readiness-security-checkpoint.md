---
date: 2026-10-24
source: agent
topics: distribution-and-release, the-two-gates
decisions:
status: current
supersedes:
tags: interdependency
summary: Independent review found eighteen defects; security remediation exposes protected publication and replay oracle gaps.
---

The independent report is frozen at .context/ai-sdlc-review.md. It identifies
eighteen defects across authorization, exact-byte evidence, phase verification,
archive projection, installed inference, worker acceptance, spending, learning,
memory preservation, removal, journal recovery, package dependencies and metrics.
This is evidence against the initial implementation; not a passing final review.

Release publication now verifies a domain-separated, expiring candidate-bound
SSHSIG against the existing Gate 1 trust root. It never persists the submitted
identity/signature/extra fields. It enforces public evidence and full-gate proof.
Four fresh regression checks fail before and pass after the repair. Protected
name-only positive publication tests now fail, as intended by the owner ruling.
The existing protected tests remain byte-identical.

Memory preservation and asset-integrity work passes twenty focused checks.
Default installed-kit/archive projection and executable inference are in flight.
Workers, budget accounting, learning, uninstall and efficiency have disjoint
ownership in another remediation batch. The coordinator owns preflight, journal,
dependency integration and contract adjudication.

The new independent CI lane has a deterministic Node archive builder, an explicit
test runner, and upload/download checks on Ubuntu, macOS and Windows. It is
advisory and retains failing tests visibly. Package scripts cannot gain an alias
without amending the old oracle's frozen scripts snapshot, so no alias was added.
No hosted CI run or public download is claimed from this local preparation.

PT-060 additionally demands actual caught results from a fixture containing only
expected historical booleans and no executable candidate. Fabricating those
results cannot be accepted. Insufficient replay evidence must stay confounded;
the owner's amendment request will explain that fixture gap alongside signing
and publication. Source-level inference-library inheritance remains under work;
model asset adoption alone is not labelled library reuse.

The quiet-machine baseline gate is still running. Next: complete code repair,
reproduce any surviving suite failure, review the changed seams independently,
migrate the durable handoff into the wiki and regenerate all final evidence.
