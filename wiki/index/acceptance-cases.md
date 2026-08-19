# Acceptance case index

The 49 frozen Gate-1 cases. Each is an independently authored observable case
that must fail before its behavior exists and pass only when the product intent
is met. Gate 2 owns their executable form but not their verdict.

**Set equality is the requirement.** The specification gate reads the ID set from
Gate 1 as it is on disk and asserts exact equality with Gate 2's traceability
table. The number below is documentation; if it disagrees with the file, the file
wins and the gate fails.

**Verified 2026-08-19:** Gate 2's table covers exactly these 49 IDs — no orphans,
no gaps.

Full text: [`gate1/acceptance.md`](../gate1/acceptance.md) §7.
Traceability rows: [`gate2/technical-spec.md`](../gate2/technical-spec.md) §13.

---

## 0. Ordered completion gates (4)

| ID | What it requires | Topic |
|---|---|---|
| `AT-GATE-1` | One implementation authority. Every normative statement traces to Gate 2 or is rejected. | [the two gates](../topics/the-two-gates.md) |
| `AT-GATE-2` | Specification before code — **ordering is the requirement**. Plus the Gate 1 signature check, and arming semantics. | [the specification gate](../topics/specification-gate.md), [Gate 1 signing](../topics/gate1-signing.md) |
| `AT-GATE-3` | Independent semantic review: fresh session, report-only, digest-pinned receipt. | [review receipts](../topics/review-receipts.md) |
| `AT-GATE-4` | Workflow, not staffing. One maintainer with separate contexts satisfies separation. | [the two gates](../topics/the-two-gates.md) |

## A. Archetype — the shared service shape (6)

Every catalogue service must pass all six.

| ID | What it requires | Topic |
|---|---|---|
| `AT-SHAPE-1` | Install grafts, never clobbers. Managed-block markers and a manifest record at the time of every write. | [graft mechanics](../topics/graft-mechanics.md) |
| `AT-SHAPE-2` | The scan recommends and never gates. A not-recommended service still installs. | [onboarding flow](../topics/onboarding-flow.md) |
| `AT-SHAPE-3` | Grade dials depth, not identity. Maximal is a strict superset of minimal. | [catalogue contract](../topics/catalogue-contract.md) |
| `AT-SHAPE-4` | Dependencies auto-pull, razor-scoped to the dependent's exact need. | [catalogue contract](../topics/catalogue-contract.md) |
| `AT-SHAPE-5` | Exactly one honest disposition, executable attempted first. | [services and reports](../topics/services-and-reports.md) |
| `AT-SHAPE-6` | All 115 leaves authored — 26/40/31/18. Mechanical presence cannot substitute for semantic review. | [the authored-service gate](../topics/authored-service-gate.md) |

## B. Default baseline and user control (7)

| ID | What it requires | Topic |
|---|---|---|
| `AT-BASE-1` | Sanitation runs before profiling or the menu, unless explicitly disabled — and then nothing claims clean. | [the safety baseline](../topics/safety-baseline.md) |
| `AT-BASE-2` | One policy governs shell, web, and MCP wherever a mechanical surface exists; elsewhere an honest gap. | [the action evaluator](../topics/action-evaluator.md) |
| `AT-BASE-3` | The structured policy is authoritative and discoverable. Prose cannot override it. | [the policy model](../topics/policy-model.md) |
| `AT-BASE-4` | Exact-revision activation. Delegation is proposal authority, session-scoped, never persisted. | [the policy model](../topics/policy-model.md) |
| `AT-BASE-5` | Complete user control with truthful result. Disabled means disabled, and status says so. | [the safety baseline](../topics/safety-baseline.md) |
| `AT-BASE-6` | Re-enabling starts a fresh evidence epoch. No stale success is reused. | [the safety baseline](../topics/safety-baseline.md) |
| `AT-BASE-7` | Self-authorization is not a policy setting. No schema key can express it. | [the policy model](../topics/policy-model.md) |

## C. Per-property (6)

These are the five Gate-1 correctness properties plus completeness. Each is an
**evidence alias** — it runs another case's real target rather than a placeholder.

| ID | Property | Runs |
|---|---|---|
| `AT-P1` | No blowout / light-touch integration | `AT-SHAPE-1`'s target directly |
| `AT-P2` | Safe by default, controlled and reported honestly | Aggregate over `AT-BASE-1`–`6` |
| `AT-P3` | Mutually exclusive services (MECE) | Scope-map tests plus semantic MECE receipt |
| `AT-P4` | Honest host/CI coverage | `AT-CLAIM-1`'s target directly |
| `AT-P5` | Highly configurable | Override-beats-recommendation fixtures |
| `AT-P6` | Complete and honest service behavior | All 115 leaves' evidence targets |

Aliases are permitted only where a Gate-1 property points at another case.
Tautological assertions are not — see [testing strategy](../topics/testing-strategy.md).

## D. Bespoke service and safety behavior (7)

| ID | What it requires | Topic |
|---|---|---|
| `AT-B1` | Byte-exact sync check catches drifted duplicate payloads. | [drift and secret controls](../topics/drift-and-secret-controls.md) |
| `AT-B2` | The semantic drift guard flags stale or deprecated context. | [drift and secret controls](../topics/drift-and-secret-controls.md) |
| `AT-B3` | First enabling the leak scanner runs a **real** full-history scan before activation. | [drift and secret controls](../topics/drift-and-secret-controls.md) |
| `AT-B4` | Pre-commit actually re-scans changed harness files. A note is not a scan. | [sanitation and remediation](../topics/sanitation-and-remediation.md) |
| `AT-B5` | Adopt-time verdict is one of four; uncertainty QUARANTINEs. | [sanitation and remediation](../topics/sanitation-and-remediation.md) |
| `AT-B6` | Approved remediation is real and bounded — observed diff equals approved diff. | [sanitation and remediation](../topics/sanitation-and-remediation.md) |
| `AT-B7` | Testing run scope and report contents: diff in development, whole-repo in CI. | [services and reports](../topics/services-and-reports.md) |

## E. Host, hook, CI, and evidence claims (7)

| ID | What it requires | Topic |
|---|---|---|
| `AT-HOST-1` | A complete per-axis contract for **any** axis Rig emits, across all 19 hosts. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-HOST-2` | Boundary and proceed behavior. Every deny names category and rule; near-matches pass. | [the action evaluator](../topics/action-evaluator.md) |
| `AT-HOST-5` | Unsupported MCP is retired everywhere, without deleting user-owned files. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-CI-1` | Integrate existing verified CI additively, without touching unrelated jobs. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-CI-2` | Bootstrap absent CI only after explicit provider selection and approval. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-CI-3` | Safe, idempotent, real execution. No secrets, minimum permissions, no artifact upload. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-CI-4` | Unknown or malformed CI fails visibly and is left byte-identical. | [host and CI coverage](../topics/host-and-ci-coverage.md) |

`AT-HOST-3` and `AT-HOST-4` were **deleted** on 2026-08-17 — see below.

## F. Claim model, presence, global writes, delivery (6)

| ID | What it requires | Topic |
|---|---|---|
| `AT-CLAIM-1` | Build the whole roster through one uniform path. No host is a second-class citizen. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-PRESENCE-1` | No presence, no activation. Three terminal states, refusal being one. | [user-presence approvals](../topics/user-presence-approvals.md) |
| `AT-PRESENCE-2` | Lost policy signer: recovery is real, bounded, and terminates. | [policy-signer recovery](../topics/policy-signer-recovery.md) |
| `AT-HOME-1` | Global writes append, never overwrite, and the install line names the file. | [user-global writes](../topics/user-global-writes.md) |
| `AT-HOME-2` | Multi-repository attribution, required from the **first** install. | [user-global writes](../topics/user-global-writes.md) |
| `AT-DIST-1` | A stranger with git, curl, and sh can install it. | [distribution and release](../topics/distribution-and-release.md) |

`AT-CLAIM-2` and `AT-CLAIM-3` were **deleted** on 2026-08-17 — see below.

## G. Install lifecycle, removal, disclosure (6)

| ID | What it requires | Topic |
|---|---|---|
| `AT-INSTALL-1` | An interrupted install resumes; a partial one never claims to protect. | [install manifest and removal](../topics/install-manifest-removal.md) |
| `AT-UNINSTALL-1` | Uninstall returns the repository, not just the directory. | [install manifest and removal](../topics/install-manifest-removal.md) |
| `AT-UNINSTALL-2` | Verified clean, or honestly best-effort with the file named. | [install manifest and removal](../topics/install-manifest-removal.md) |
| `AT-UNINSTALL-3` | Usage artifacts are not installation state and survive by default. | [install manifest and removal](../topics/install-manifest-removal.md) |
| `AT-REPORT-1` | Findings stay on the machine that produced them — not in artifacts, not in logs. | [services and reports](../topics/services-and-reports.md) |
| `AT-SECRET-1` | Matched secret content never reaches the model by default. | [drift and secret controls](../topics/drift-and-secret-controls.md) |

`AT-INSTALL-1` is currently **unresolved** in the live round-3 review — see
[status](../status.md).

---

## Deleted cases

Four IDs appear in Gate 1's revision notes but define nothing. They were removed
by the 2026-08-17 host-tier amendment because each drew a verified/unverified
distinction the product never implemented.

| ID | Was | Absorbed by |
|---|---|---|
| `AT-HOST-3` | An axis is verified only from a complete contract plus first-wire proof. | `AT-HOST-1`, whose bar moved to "any axis Rig emits". |
| `AT-HOST-4` | Release blocked by an incomplete **advertised** axis. | `AT-CLAIM-1` — build set and release set are now the same set. |
| `AT-CLAIM-2` | The out-of-repository write disclosure, framed as a claim. | `AT-HOME-1`, as a transparency requirement rather than a claim. |
| `AT-CLAIM-3` | Per-host claim strings in output. | Nothing — the concept was withdrawn outright. |

If you grep the acceptance file for `AT-` you will find 53 distinct strings. Four
of them are these, mentioned only in prose. Gate 2 correctly traces the 49 that
are actually defined.

---

## How the set has moved

| Date | Count | Cause |
|---|---|---|
| 2026-07-24 | 16 | Original authored set (GA-8). |
| 2026-07-25 | 38 | GA-10 re-grill after the implementation audit. |
| 2026-07-26 | 45 | D1–D9, the claim/build split. |
| 2026-07-28 | 52 | D11–D18, the lifecycle revision. |
| 2026-08-17 | 48 | The host-tier amendment deleted four. |
| 2026-08-19 | **49** | D20 added `AT-PRESENCE-2`. |

Mechanism-only revisions (D10, D19, GA-13) changed how a case is satisfied
without changing the count.
