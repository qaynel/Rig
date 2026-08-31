# Acceptance case index

The 83 Gate-1 cases. Their deterministic executable targets join them in the
oracle: each must fail before its behavior exists and pass only when the product
intent is met. The ten Path B cases are authored and red, but are not
owner-approved until the pending human signature ceremony completes.

**Set equality is the requirement.** The specification gate reads the ID set from
Gate 1 as it is on disk and asserts exact equality with Gate 2's traceability
table. The number below is documentation; if it disagrees with the file, the file
wins and the gate fails.

**Re-verified 2026-08-21, retrace complete:** D24 revises existing verdicts
without changing the 68-ID set. It restores `AT-SHAPE-6` to all 115 leaves,
makes the broad Policy catalogue release-blocking, moves the executable
targets into the signed oracle, requires detected-host-only onboarding, and
extends distribution to all 55 named skills plus MIT notice/provenance. The
technical design has since been retraced against these meanings through v0.17,
and the full suite is green on the current bytes. See [status](../status.md).

**Amended 2026-08-26/27, D28/GA-37:** RIG-115's shell-trust suite adds five
cases, `AT-LF-20`–`AT-LF-24`, taking the set to **73**. All five are now
implemented and green — see [status](../status.md).

**Amended 2026-08-31, Path B:** agent-led adaptive onboarding adds ten cases,
`AT-PB-1`–`AT-PB-10`, taking the set to **83**. Their 55 direct checks are red
before implementation (54 product failures plus one green catalogue-preservation
guard). This amendment awaits the mandatory human signature.
[Path B acceptance-oracle trace](../reasoning/2026-08-31-path-b-acceptance-oracle.md)

Full text: [`gate1/acceptance.md`](../gate1/acceptance.md) §7.
Traceability rows: [`gate2/technical-spec.md`](../gate2/technical-spec.md) §13.

---

## 0. Ordered completion gates (4)

| ID | What it requires | Topic |
|---|---|---|
| `AT-GATE-1` | One current technical approach. The technical spec is present but not signed or frozen. | [the two gates](../topics/the-two-gates.md) |
| `AT-GATE-2` | Signed oracle before code — **ordering is the requirement**. Manifested test bytes join both Gate 1 files under the signature. | [the specification gate](../topics/specification-gate.md), [Gate 1 signing](../topics/gate1-signing.md) |
| `AT-GATE-3` | Independent release review: fresh session, report-only, digest-pinned receipt; not a second freeze. | [review receipts](../topics/review-receipts.md) |
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
| `AT-SHAPE-6` | All 115 leaves authored at declared Policy grade — 26/40/31/18. D24 retires D23; mechanical presence cannot substitute for semantic review. | [the authored-service gate](../topics/authored-service-gate.md) |

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
| `AT-P5` | Highly configurable | Explicit full-family default plus trim/override fixtures |
| `AT-P6` | Complete and honest service behavior | All 115 leaves' evidence targets |

Aliases are permitted only where a Gate-1 property points at another case.
Tautological assertions are not — see [testing strategy](../topics/testing-strategy.md).
Path B's seventh business-level property is covered directly by
`AT-PB-1`–`AT-PB-10`, not by a new alias.

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
| `AT-CI-3` | Safe, idempotent, real execution for enabled controls and active-grade CI-applicable services. No secrets, minimum permissions, no artifact upload. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-CI-4` | Unknown or malformed CI fails visibly and is left byte-identical. | [host and CI coverage](../topics/host-and-ci-coverage.md) |

`AT-HOST-3` and `AT-HOST-4` were **deleted** on 2026-08-17 — see below.

## F. Claim model, presence, global writes, delivery (6)

| ID | What it requires | Topic |
|---|---|---|
| `AT-CLAIM-1` | Build the whole roster uniformly; activate exactly the detected or explicitly requested host trees. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| `AT-PRESENCE-1` | No presence, no activation. Three terminal states, refusal being one. | [user-presence approvals](../topics/user-presence-approvals.md) |
| `AT-PRESENCE-2` | Lost policy signer: recovery is real, bounded, and terminates. | [policy-signer recovery](../topics/policy-signer-recovery.md) |
| `AT-HOME-1` | Global writes append, never overwrite, and the install line names the file. | [user-global writes](../topics/user-global-writes.md) |
| `AT-HOME-2` | Multi-repository attribution, required from the **first** install. | [user-global writes](../topics/user-global-writes.md) |
| `AT-DIST-1` | A stranger installs named-tag `5.0.0`, all 55 named skills, and required MIT notice/provenance without `curl | sh`. | [distribution and release](../topics/distribution-and-release.md) |

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

`AT-INSTALL-1`'s round-3 finding (Gate 2 §6.6/§10 contradicted it) is
**resolved** as of 2026-08-20 — see [status](../status.md). Three other
round-3 findings remain open.

## H. Lint-format production leaf (24, added 2026-08-21 by D21; extended 2026-08-26 by D28/GA-37)

The acceptance for the first production catalogue leaf,
`development.code-quality.lint-format`. Full text:
[`gate1/acceptance.md`](../gate1/acceptance.md) §7H. Synthesis and `GA-`
traces: [`specs/lint-format-intent.md`](../specs/lint-format-intent.md).

| ID | What it requires |
|---|---|
| `AT-LF-1` | Whole-repository, open-ecosystem discovery — no fixed roster, no skipped component. |
| `AT-LF-2` | Hybrid-plus: existing tools preserved by default, the user decides on any change. |
| `AT-LF-3` | Semantic command discovery; ambiguous matches return to the user. |
| `AT-LF-4` | User scope and component choice always win over the recommendation. |
| `AT-LF-5` | Selection authorizes nothing; only the approved plan runs, under disclosed untrusted-code controls. |
| `AT-LF-6` | Apply grafts and records every write; partial coverage is explicit and user-approved. |
| `AT-LF-7` | Policy level (Level 1) governs the change. |
| `AT-LF-8` | Context level (Level 2) is a strict cumulative superset of Policy. |
| `AT-LF-9` | Evidence level (Level 3) proves with verifiable evidence, not opinion. |
| `AT-LF-10` | Diff-scoped by default; ignore rules and working directory honored. |
| `AT-LF-11` | A read-only check that mutates is a failure — detected, halted, evidenced, never auto-restored. |
| `AT-LF-12` | Autofix is a separate, separately approved, re-verified mutating action. |
| `AT-LF-13` | CI at Evidence is additive to verified CI, proposed for absent CI, preserving of unknown CI. |
| `AT-LF-14` | Command drift stops execution and requires a freshly approved plan. |
| `AT-LF-15` | Reports are failure-centric, local, redacted, and actionable; secrets need opt-in. |
| `AT-LF-16` | Every abnormal ending is its own distinct, reported, non-passing state. |
| `AT-LF-17` | Reinstall is an idempotent resume; no duplicates, no premature protection claim. |
| `AT-LF-18` | Removal reverses exactly the manifest; the user's own fixes survive. |
| `AT-LF-19` | Support is claimed per component, only on real evidence; exclusions suppress the whole-repository claim. |
| `AT-LF-20` | A plan approval authorizes exactly one execution of its exact plan digest; a second presentation of the same approval is refused, not re-authorized. |
| `AT-LF-21` | A task's working directory and every path it touches resolve inside the repository even through a symlink; it receives no ambient environment variable beyond an explicit allowlist. |
| `AT-LF-22` | A task not explicitly granted network access by the plan has no outbound reachability; a task explicitly granted it may connect. |
| `AT-LF-23` | A task exceeding a configured memory ceiling or wall-clock timeout is killed and reported as its own distinct non-passing state, never a hang or silent truncation. |
| `AT-LF-24` | A repository-supplied symlink whose real target resolves outside the repository is refused for read, write, or working-directory use, never followed because its lexical path looks contained. |

---

## I. Path B agent-led adaptive onboarding (10, added 2026-08-31)

| ID | What it requires | Contract |
|---|---|---|
| `AT-PB-1` | A generated, digest-bound capability catalogue indexes all 63 skills under the exact eleven-family membership while the governed 115-service catalogue remains byte-identical. | F-1 |
| `AT-PB-2` | Versioned, machine-detectable graft sections preserve repo-owned bytes, validate their preimages, update idempotently, and remove cleanly; malformed or duplicate ownership fails. | F-2 |
| `AT-PB-3` | The host agent receives deterministic, bounded catalogue context with exact metadata, release digests, legacy aliases, and no installer-authored relevance judgment. | F-3 |
| `AT-PB-4` | `.rig/` state and reports follow the exact schemas, revisions, digests, and drift rules, with deterministic bytes and no hidden mutable source of truth. | F-4 |
| `AT-PB-5` | One shared prepare/propose/apply/check domain interface lets the host agent own relevance, delta, and graft judgment; approval binds the exact proposal plus summary and no unapproved write occurs. | F-5 |
| `AT-PB-6` | `install rig [--host <host>]` installs the full release-pinned shelf, projects only approved skills to repeatable host targets, and hands off explicitly without an auto-trigger. | F-6 |
| `AT-PB-7` | Inventory structurally covers every known harness root and emits stable, path-based rows without interpreting what the repository needs. | S-1 |
| `AT-PB-8` | Overlap output is deterministic and uses only exact declared tags and explicit aliases; it neither infers semantic fit nor mutates the repository. | S-2 |
| `AT-PB-9` | Every installed adapter resolves to one canonical router and one onboarding mandate, exposed consistently through the skill and MCP paths. | S-3 |
| `AT-PB-10` | File/byte growth emits warnings only, while duplicate writes, malformed grafts, dangling references, name mismatches, state drift, and unapproved writes remain hard failures. | S-4 |

Full behavior and evidence: [`gate1/acceptance.md`](../gate1/acceptance.md) §7I
and [`gate2/technical-spec.md`](../gate2/technical-spec.md) §13.

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

If you grep the acceptance file for `AT-` you will find 87 distinct strings.
Four of them are these, mentioned only in prose. Gate 2's table traces the 73
that preceded Path B plus the ten Path B cases that are actually defined —
re-traced to exact equality, see the note above.

---

## How the set has moved

| Date | Count | Cause |
|---|---|---|
| 2026-07-24 | 16 | Original authored set (GA-8). |
| 2026-07-25 | 38 | GA-10 re-grill after the implementation audit. |
| 2026-07-26 | 45 | D1–D9, the claim/build split. |
| 2026-07-28 | 52 | D11–D18, the lifecycle revision. |
| 2026-08-17 | 48 | The host-tier amendment deleted four. |
| 2026-08-19 | 49 | D20 added `AT-PRESENCE-2`. |
| 2026-08-21 | **68** | D21 added `AT-LF-1`–`AT-LF-19`, the lint-format vertical release boundary. |
| 2026-08-26 | **73** | D28/GA-37 added `AT-LF-20`–`AT-LF-24`, RIG-115's shell-trust guarantees. |
| 2026-08-31 | **83** | Path B added `AT-PB-1`–`AT-PB-10`, the agent-led adaptive-onboarding boundary; human signature pending. |

Mechanism-only revisions (D10, D19, GA-13) changed how a case is satisfied
without changing the count.
