# Tier 2 Advanced - Acceptance Criteria and Tests (RE-GRILLED AND FROZEN 2026-07-28)

> **Revision note (2026-07-25).** This file was re-grilled with
> [`spec/business-spec.md`](spec/business-spec.md). Together they are the complete
> Gate 1. A design or implementation context must not edit either file. Any
> executable cases or coverage plans outside Gate 1 are subordinate evidence
> derived from the sole Gate-2 authority, `spec/technical-spec.md`.

> **Revision note (2026-07-26).** Re-grilled with
> [`spec/business-spec.md`](spec/business-spec.md) to record nine decisions
> (`D1`-`D9`). The load-bearing change is `AT-HOST-4`: release is blocked by an
> incomplete **advertised** axis, and the advertised set is now the first-wired
> subset rather than the whole built roster. Rig still builds and emits for all
> 19 hosts and six CI providers — `AT-CLAIM-1` holds it to that — but it may
> only *claim* what it has actually run.
>
> New cases: `AT-CLAIM-1`, `AT-CLAIM-2`, `AT-CLAIM-3`, `AT-PRESENCE-1`,
> `AT-HOME-1`, `AT-HOME-2`, `AT-DIST-1`. Revised: `AT-GATE-2`, `AT-GATE-3`,
> `AT-SHAPE-5`, `AT-HOST-3`, `AT-HOST-4`, `AT-P4`, `AT-P6`. The ID set grows from
> 38 to **45**, and the Gate-2 traceability table must match that set exactly.
>
> **Frozen.** All nine decisions are recorded and no case is left open. A design
> or implementation context must not edit this file; a genuine conflict returns
> to grilling.

> **Revision note (2026-07-26, later the same day) — D10.** `AT-GATE-2`'s
> integrity clause is re-grilled. It previously required a comparison against
> committed upstream state and a separately reviewed commit, backed by branch
> protection and code ownership. The intent owner rejected that mechanism
> because it charges every Gate 1 edit to the repository's commit history, which
> organisations audit, and asked for a control that does not run through git.
> The replacement is a signature over Gate 1's digest that only a physically
> present human can produce, verified by the gate before anything else runs.
>
> This is a mechanism change, not a verdict change. The ID set remains **45**,
> no case is added or removed, and the size of the Gate-2 traceability table is
> unaffected. Rationale and residual risks:
> [`spec/business-spec.md`](spec/business-spec.md) §8 and §9.

> **Revision note (2026-07-28) — D11-D18, the lifecycle revision.** Re-grilled
> with [`spec/business-spec.md`](spec/business-spec.md) after a sweep for
> unstated behavior found that Gate 1 specified how Rig arrives in a repository
> and never how it leaves, fails, or discloses what it finds. `AT-HOME-2`
> already obliged Rig to remove its own entries from a user-global file and
> report what it removed, while nothing said what removal does to the repository
> Rig actually modified — including the CI job `AT-CI-1` has Rig insert into the
> user's own pipeline.
>
> Eight decisions were taken, marked `D11`-`D18` at their point of effect. Seven
> new cases: `AT-UNINSTALL-1`, `AT-UNINSTALL-2`, `AT-UNINSTALL-3`,
> `AT-INSTALL-1`, `AT-REPORT-1`, `AT-SECRET-1`, `AT-BASE-7`. Revised:
> `AT-GATE-2`, `AT-SHAPE-1`, `AT-BASE-4`, `AT-B3`, `AT-CI-1`, `AT-CI-3`. The ID
> set grows from 45 to **52**, and the Gate-2 traceability table must match that
> set exactly.
>
> One revision is a defect fix rather than an addition. `AT-GATE-2` previously
> defined only the *edited*-signature case, so a missing signature fell through
> to §9's honest-fallback language and passed. That made D10 bypassable in one
> move: delete `gate1.sig`, and the gate reports unprotected while the edit
> proceeds. D17 arms the gate on the presence of the signer identity instead.
>
> **Frozen.** All eight decisions are recorded and no case is left open. A design
> or implementation context must not edit this file; a genuine conflict returns
> to grilling.

> **Revision note (2026-08-13) — D19, the presence floor is a property, not an
> artifact.** `AT-GATE-2`'s third sentence required the *signature* to attest
> physical presence. Design work went to satisfy it and found that no SSH
> signature does that, a FIDO one included. `ssh-keygen` records attestation
> data only at key generation, `ssh-keygen -Y verify` has no option that
> consults it, and the allowed-signers file grammar has no `verify-required` or
> `no-touch-required` — those are a certificate option and a key-generation flag
> respectively. Verification proves the signature math and that the key is
> listed. Nothing downstream establishes that a real authenticator was involved,
> so a key type is a naming convention that a determined agent can emit for
> itself.
>
> The clause was therefore unsatisfiable as written, by any key that exists. D19
> restates the floor as the property the control actually needs — **a key no
> agent on the intent owner's machine can produce a signature under without a
> live human act** — and makes the intent owner, not the artifact, the one who
> attests the key meets it. This is a correction of a false requirement, not a
> relaxation: the defeated threat is identical, and every mechanism that
> satisfied the old wording satisfies the new one unchanged.
>
> The case count stays at **52**. `AT-GATE-2` changes mechanism, not verdict; no
> case is added or removed and the size of the Gate-2 traceability table is
> unaffected. The new residual risk — that the gate cannot check the key's class
> and takes the intent owner's word for it — is recorded in
> [`spec/business-spec.md`](spec/business-spec.md) §9.
>
> **Frozen.** The decision is recorded and no case is left open.

> **Revision note (2026-08-17) — the host-tier amendment.** Re-grilled after
> the executable-specification-gate design found that Rig ships one
> configuration for every host and has never observed enforcement fire on any
> of them, while four cases existed solely to draw a verified/unverified tier
> the product never implemented. The owner's decision is to ship all 19 hosts
> and six providers with **no tier** — no verified vs unverified distinction in
> Rig's output or data — and to prove every axis the same way, by automated
> tests asserting the correct bytes land in the correct paths, never by a human
> exercising a host.
>
> **Deleted (4):** `AT-HOST-3`, `AT-HOST-4`, `AT-CLAIM-2`, `AT-CLAIM-3` — each
> drew a distinction that no longer exists. **Revised:** `AT-CLAIM-1` (whole
> roster built through one uniform path, no host skipped), `AT-HOST-1` (contract
> bar moves from "an axis called verified" to "any axis Rig emits", covering all
> 19), `AT-P4` (points at the rewritten roster case). `AT-HOME-1` absorbs the
> out-of-repository write disclosure from the deleted `AT-CLAIM-2` — a
> transparency requirement unrelated to host tiers. `AT-UNINSTALL-2` drops a
> dangling cross-reference to the deleted `AT-CLAIM-2`; its own verdict is
> unchanged.
>
> The ID set shrinks from **52** to **48**, and the Gate-2 traceability table
> must match that set exactly. This unwinds the tier introduced by `D1`, `D2`,
> and `D3` (2026-07-26); the residual honest statement — that Rig documents each
> surface but has not observed enforcement firing — lives in the host registry
> header, not in a per-host claim.
>
> **Frozen.** The decision is recorded and no case is left open.

> **Revision note (2026-08-19) — D8 review separation.** Re-grilled with
> [`spec/business-spec.md`](spec/business-spec.md) after review established that
> a self-declared authoring-model label cannot prove model separation. `AT-GATE-3`
> now requires a fresh review session, report-only operation, and an exact-digest
> receipt; model identity is not an acceptance condition. The ID set remains
> **48** and Gate 2 must be re-frozen against this amendment.

> **Revision note (2026-08-19, later the same day) — D20, policy-signer
> recovery.** Re-grilled with [`spec/business-spec.md`](spec/business-spec.md)
> after a Gate 2 review found the technical design had built a full,
> Gate-1-unbacked recovery ceremony for the policy-activation signer. D20
> gives it a real, bounded recovery path instead: a distinct, pre-registered
> recovery credential approved at the same live-human-act floor Gate 1
> already requires for its own protection, with exhaustion of every
> registered credential a deliberate, permanent refusal rather than grounds
> for another fallback. New case: `AT-PRESENCE-2`. The ID set grows from
> **48** to **49**, and the Gate-2 traceability table must match that set
> exactly.
>
> **Frozen.** The decision is recorded and no case is left open.

> **Revision note (2026-08-21) — D21, the lint-format vertical release
> boundary.** Re-grilled with [`business-spec.md`](business-spec.md) after a
> readiness audit found this file's release condition ran against all 115
> catalogue leaves, while the intent owner had separately ruled (`GA-15`–
> `GA-35`) that `development.code-quality.lint-format` ships first, alone, as
> normal Rig's first production-supported leaf. D21 narrows the release
> condition to that one leaf; the other 114 remain committed, specified, and
> block their own future support and the complete-catalogue claim, but not
> this release.
>
> Nineteen new cases, independently authored against the closed decisions and
> approved by the intent owner on 2026-08-21: `AT-LF-1` through `AT-LF-19`,
> covering whole-repository open-ecosystem discovery, the hybrid-plus tool
> promise, semantic command discovery, user scope/component override, plan-
> bound untrusted-task execution, partial-coverage apply, the three cumulative
> grade levels, diff scope, the read-only guarantee, separately approved
> autofix, CI behavior, command drift, redacted local reporting, the abnormal-
> ending taxonomy, idempotent reinstall, manifest-exact removal, and the
> per-component support claim. The ID set grows from **49** to **68**, and
> the Gate-2 traceability table must match that set exactly.
>
> **Frozen.** All twenty decisions are recorded and no case is left open. A
> design or implementation context must not edit this file; a genuine
> conflict returns to grilling.

## 7. Acceptance tests (the frozen Gate-1 target)

These are independently authored observable cases. Gate 2 owns their executable
form, but not their verdict. Each must fail before its behavior exists and pass
only when the product intent is met.

### 0. Ordered completion gates

- **AT-GATE-1 (one implementation authority).** *Given* Gate 1 and the proposed
  implementation documents, *when* the specification gate runs, *then*
  `technical-spec.md` is the sole versioned Gate-2 authority; every normative
  SOW, task-list, coverage-plan, or later-ruling statement either traces to it
  or is rejected as non-authoritative.
- **AT-GATE-2 (specification before code; ordering is the requirement)
  [D5, D10, D17].** *Given* a contradictory, incomplete, placeholder-bearing, or
  unapproved Gate 2, *when* code tests are green, *then* completion still fails
  and no code-correctness result may promote the build. The specification gate
  runs **before** the code tests in the same command that gates a push, and a
  failing gate short-circuits them so they do not execute at all. A gate that
  exists but runs after, or alongside, the code tests fails this case.

  *And given* an edit to either Gate 1 file, *when* the gate runs, *then* it
  recomputes the digest of both files, finds that the recorded signature no
  longer verifies, and fails — so a context cannot reach the approved mark by
  moving it. The signing key must be one that no agent holding the intent
  owner's machine can produce a signature under without a live human act: a
  signer an agent could operate unattended does not satisfy this case, and
  neither does any check that a context editing Gate 1 could satisfy by itself.
  A key whose private half the agent can read, or load once and then reuse
  silently, fails on that test alone. **The gate verifies the signature; the
  intent owner attests the key** (D19). No signature format available to this
  product proves an authenticator was involved, so a design that claims to check
  the key's class from the artifact fails this case for describing a check that
  does not exist. At freeze the intent owner records which key class was used,
  in the signer identity file, and that record is a statement rather than a
  proof.

  *And given* a repository where the signer identity file is present — the
  repository is **armed** — *when* the signature is missing, malformed, or does
  not verify, *then* the gate **fails**. Absence is not treated as an unprotected
  mode. A design under which deleting the signature downgrades the gate to a
  warning fails this case, because it makes the control opt-out by anything that
  can delete a file. *And given* no signer identity file at all — the repository
  is **unarmed** — *then* the gate runs, reports Gate 1 as unprotected in those
  words, and does not block: a stranger who cloned the repository under
  `AT-DIST-1`, and the project's own work before a key exists, must both be able
  to run the suite. Arming is therefore a one-way step in practice: disarming
  requires deleting the signer identity itself, not merely a signature.
- **AT-GATE-3 (independent semantic review) [D8].** *Given* mechanical
  authority and traceability checks pass, *when* a review evaluates Gate 2,
  *then* every Gate-1 rule has one testable implementation contract and no two
  clauses prescribe incompatible outcomes before the code gate may start. The
  review must be performed in a **fresh session**, must be report-only, and its
  receipt must be pinned to the exact content digest reviewed. A same-session or
  unpinned review does not satisfy this case. The same rule governs the 115-leaf
  catalogue review.
- **AT-GATE-4 (workflow, not staffing).** *Given* a repository maintained by one
  person, *when* that person runs separate implementation and fresh-context
  review agents, *then* the workflow satisfies separation without requiring
  named personnel; the implementing context still cannot edit Gate 1 or approve
  itself.

### A. Archetype — the shared service shape (every catalogue service must pass)

- **AT-SHAPE-1 (install grafts, never clobbers) [D11].** *Given* a repo onboarded on a chosen host, *when*
  the user selects any service S at any grade, *then* Rig installs S's convention adapted to this
  repo's language/framework, and preserves every pre-existing user-owned value.
  An existing `AGENTS.md` is appended-to/referenced, never replaced; an approved
  structured file receives only a verified namespaced additive merge.

  *And* every insertion into a file Rig does not exclusively own is delimited by
  machine-recognisable managed-block markers, and every mutation — created,
  appended, or patched, inside the repository or user-global — is recorded in an
  install manifest at the time it is made. Freehand editing of a shared file
  fails this case: an unmarked, unrecorded write cannot be removed later without
  guessing, and `AT-UNINSTALL-1` depends on never having to guess.
- **AT-SHAPE-2 (scan recommends, never gates).** *Given* the repo profile, *when* the menu is shown,
  *then* each service is marked applicable/not-recommended, *and* the user can still install a
  not-recommended service successfully (e.g. E2E on a UI-less library).
- **AT-SHAPE-3 (grade dials depth, not identity).** *Given* S installed at minimal vs maximal, *then*
  maximal is a strict superset of minimal's checks, and changing grade changes only depth — never
  which service it is.
- **AT-SHAPE-4 (deps auto-pull, razor-scoped).** *Given* the user selects S needing dependency D they
  didn't select (or selected at a lower grade), *then* Rig auto-pulls **exactly the slice of D that S
  needs** — never warns-and-stops, never downgrades S, never drags in unrelated general-purpose D
  (e.g. maximal-security + minimal-general-MCP → a security-purpose MCP slice; the user's general MCP
  grade untouched).
- **AT-SHAPE-5 (honest service outcome; executable first) [D4].** *Given* any
  selected service/target, *when* Rig applies and checks it, *then* exactly one
  honest disposition is observable:
  - **executable service (the default):** a real repo-adapted check runs in the
    target. Every service must be attempted as executable before any other
    disposition is accepted;
  - **convention-only service (a fallback, not a choice):** service-specific
    installed behavior is verified without a fabricated command, **and** the
    service names why execution is not meaningful for it specifically. A
    convention that is generic, repeated across services, or carries no named
    reason scores as a coverage gap; or
  - **surfaceless service:** it completes vacuously green and writes a report
    with the specific reason nothing can run.

  An undeclared, missing, malformed, silent, or no-op executable binding is a
  nonzero coverage gap, never a pass. The discriminating test is behavioral:
  a command either runs in a fixture repository or it does not.
- **AT-SHAPE-6 (complete authored catalogue).** *Given* the frozen inventory,
  *when* the specification gate reviews all 115 leaves (Development 26, Testing
  40, Infrastructure 31, Product-Security 18), *then* every service has
  service-specific identity, owned scope and adjacent exclusions,
  applicability, dependencies (or explicit none), cumulative grade behavior,
  execution disposition, checks, and acceptance evidence. A TODO, generic
  "concrete convention," repeated filler, or merely non-empty fragment fails
  the gate. Mechanical presence checks cannot substitute for a fresh-context
  semantic review of every leaf.

### B. Default baseline and user control

- **AT-BASE-1 (safe default sequence).** *Given* new-repo onboarding with the
  default policy, *when* Rig starts, *then* it sanitises the existing harness
  before profiling or showing the catalogue. If the user activates a policy
  that disables sanitation, onboarding may continue, but sanitation is
  reported disabled/not run and no clean or protected verdict is claimed.
- **AT-BASE-2 (one policy across network surfaces).** *Given* no activated user
  exception, *when* shell, built-in web, or network-capable MCP access is
  attempted on a verified enforcement surface, *then* the same default-deny
  policy mechanically governs it. On a host without that surface, the policy
  remains the agent's rule and Rig reports the enforcement gap rather than
  claiming a block. When an action is allowed and an approved MCP route can
  perform it, the agent prefers that route; MCP is never an enforcement bypass.
- **AT-BASE-3 (authoritative and discoverable policy).** *Given* an onboarded
  agent, *when* it loads the installed rules, *then* those rules point to the
  authoritative `.rig/network-policy.json` and explanatory
  `.rig/network-rules.md`; prose cannot override the structured policy.
- **AT-BASE-4 (exact user activation; no self-authorization) [D12].** *Given* any
  policy edit, including an agent-proposed edit, *when* the user has not
  approved the exact new policy digest, *then* active permissions do not
  change. Approval activates only that exact revision. A user may grant an
  agent delegated policy-edit mode for proposal authoring, but that
  delegation is not activation consent; installed base prompts must forbid the
  agent from inferring consent from prior approvals, chat context, task
  urgency, tool access, or the delegation itself.

  *And* that delegation is **scoped to the session in which it was given and is
  never persisted**. Rig writes no grant to disk, so *given* an agent in a fresh
  session that asserts it holds delegated policy-edit mode, *then* the claim is
  unverifiable by construction and the agent is refused: there is no artifact
  that could substantiate it, and a design that stores one fails this case.
  Revocation is ending the session; it takes effect immediately and requires no
  approval ceremony, because a control that can only be tightened when the
  approval surface is reachable cannot be tightened on the hosts that most need
  it.
- **AT-BASE-5 (complete user control, truthful result).** *Given* exact user
  approval to permit a category or disable enforcement globally, *when* a
  formerly restricted action is attempted, *then* it is no longer secretly
  blocked and unrelated Rig functions remain usable. Status names every
  disabled or unrun control and never calls it protected, scanned, passed, or
  verified.
- **AT-BASE-6 (fresh state after re-enable).** *Given* a disabled control is
  re-enabled through approved policy activation, *when* it next applies, *then*
  enforcement resumes and no result from before or during disablement is reused
  as current evidence.
- **AT-BASE-7 (self-authorization is not a policy setting) [D13].** *Given* a
  policy revision that purports to grant an agent authority to activate its own
  proposals, *when* it is activated, *then* activation still requires the user
  and Rig does not report the resulting configuration as protected. The
  prohibition on agent self-activation is a **Rig product rule shipped with the
  baseline, not a clause in the user's editable policy** — there is no policy
  the user can write, or an agent can propose, that makes it false. The user may
  disable Rig's enforcement wholesale under `AT-BASE-5`, and is then truthfully
  reported as unprotected; what the user cannot do is hold a configuration that
  permits self-activation *and* a claim that Rig is protecting them. A design
  that implements this as an invariant clause held in a separate file or
  repository fails this case: an agent with full repository and shell access
  reaches a second file exactly as easily as the first, which is the same
  reasoning that withdrew D5.

### C. Per-property

- **AT-P1 no-blowout** — see AT-SHAPE-1: minimal footprint, grafts onto the
  existing framework, and preserves user-owned values.
- **AT-P2 safe default + user control** — see AT-BASE-1 through AT-BASE-6:
  controls deny by default, explicit user choices take effect, and status is
  truthful.
- **AT-P3 MECE (no overlap).** *Given* the full catalogue's scope-map, *then* no
  service's owned scope duplicates or subsets another's; every capability is
  owned **exactly once** (spot-checks: perf/load-test-authoring only in Testing;
  runtime secret injection only in Infrastructure; correctness-static-analysis
  in Development is distinct from security SAST in Product-Security).
- **AT-P4 honest host/CI coverage** — see Sections E and F: Rig builds and
  emits for the whole roster through one uniform path (AT-CLAIM-1) and no axis
  emits anything speculative. Genuine vendor absence degrades explicitly.
- **AT-P5 highly configurable.** *Given* recommendations and safety defaults,
  *when* the user changes service selections/grades or activates an exact policy
  revision, *then* the resulting install and permissions match the user's
  choice rather than the recommendation or default.
- **AT-P6 complete and honest services** — see AT-SHAPE-5/6: every frozen leaf
  is specifically authored, is attempted as executable first, and produces a
  real observable outcome; a convention-only fallback carries a named
  service-specific reason.

### D. Bespoke service and safety behavior

- **AT-B1 (context-sync exact-copy floor).** *Given* the control is enabled,
  identical duplicated payloads that drift fail the byte-exact sync check at
  commit/CI.
- **AT-B2 (semantic drift guard).** *Given* the control is enabled, two
  non-identical contexts where one is stale/deprecated are flagged by the
  agent-based semantic guard.
- **AT-B3 (real first-enable history scan) [D16].** *Given* the leak-scanner service is
  first enabled, *when* activation runs, *then* a real history scan completes
  before the service is marked active. A finding, missing scanner, or execution
  failure is nonzero and produces an actionable redacted report; activation
  requires remediation plus a clean re-scan or a waiver scoped to the exact
  current findings. The enabled staged-secret floor remains installed even
  when history activation fails. The scan is deterministic and its matched
  content is governed by `AT-SECRET-1`.
- **AT-B4 (pre-commit harness re-scan).** *Given* enabled sanitation and staged
  changes to harness/config files, *when* commit is attempted, *then* the
  changed harness is actually scanned and blocking findings stop the commit.
  Recording a note without running the scan does not pass.
- **AT-B5 (adopt-time security verdict).** *Given* sanitation is enabled, a
  harness/skill under adoption yields ALLOW / ALLOW_WITH_RESTRICTIONS /
  QUARANTINE / BLOCK: unambiguous hits BLOCK, uncertain or unverifiable input
  QUARANTINEs. If disabled, no verdict is fabricated.
- **AT-B6 (approved remediation is real and bounded).** *Given* sanitation
  findings, a proposal is read-only and identifies exact changes and current
  input hashes. Before exact-digest approval, no target write occurs. After
  approval, success means the observed diff equals the approved changes,
  partial failure rolls back, stale inputs or a no-op reject, and sanitation
  runs again before a fresh result is reported.
- **AT-B7 (testing run-scope + reports).** A testing service run in development
  is diff-scoped; at the CI gate it is whole-repo. Failure reports show what
  broke, why, fix context, and dependency-not-run state; vacuous and coverage
  gaps remain visible, while routine passes are omitted.

### E. Host, hook, CI, and evidence claims

- **AT-HOST-1 (complete per-axis contract).** *Given* any host live-hook axis
  Rig emits, *when* its contract is inspected, *then* Gate 2 names the
  exact emitted path/filename, vendor input/event schema and matcher fields,
  deny response and exit behavior, deliberate-proceed protocol, owned merge
  boundary, user-config preservation, and first/repeated-apply behavior.
- **AT-HOST-2 (boundary and proceed behavior).** *Given* default active
  controls, disallowed network access, remote-content-to-execution, sensitive
  environment/credential reads, and guardrail disable/bypass are mechanically
  denied. Every deny names the category and rule. Legitimate near-matches pass;
  exact one-use user approval permits only the unchanged action once; activated
  permanent policy choices take precedence thereafter.
- **AT-HOST-5 (unsupported MCP is retired everywhere).** *Given* verified
  evidence that a host, including the `pi` fixture, does not support MCP, *when*
  any legacy or catalogue install path runs, *then* Rig emits no MCP
  configuration for that host. A previously emitted user-owned file is
  preserved and receives migration guidance rather than silent deletion.
- **AT-CI-1 (integrate existing CI) [D15].** *Given* a verified supported CI
  configuration exists, *when* Rig is approved, *then* it additively adds the
  enabled repo-scope Rig gate and its actionable result without changing
  unrelated jobs or user values. The result is a pass/fail verdict with finding
  counts and rule identities; the finding detail stays on the machine that ran
  the check, per `AT-REPORT-1`.
- **AT-CI-2 (bootstrap absent CI).** *Given* no CI exists, *when* the user
  selects a verified provider and explicitly approves creation, *then* Rig
  creates a minimal provider-native pipeline; before approval it creates none.
- **AT-CI-3 (safe, idempotent, real execution) [D15].** *Given* an integrated or
  bootstrapped pipeline, *then* it runs all enabled baseline controls and
  selected executable services, emits an actionable verdict without uploading
  or logging finding detail, requests only
  necessary permissions, uses no repository secrets, and a second apply makes
  no duplicate or material change.
- **AT-CI-4 (unknown config and first wire).** *Given* unknown, malformed, or
  unverified CI configuration, integration fails visibly and leaves it
  unchanged. An emitted integration is not verified until its first real CI run
  succeeds; advisory text alone cannot satisfy supported-provider execution.

### F. Claim model, user presence, global writes, and delivery (2026-07-26)

- **AT-CLAIM-1 (build the whole roster) [D1].** *Given* onboarding on any host
  in the 19-host roster or any of the six CI providers, *when* the user
  installs, *then* Rig emits that host's or provider's configuration and no
  user receives less than the pre-revision product gave them. No code path
  skips a host, silently or otherwise, and every host is emitted through the
  same code path — none is a second-class citizen carrying a degraded surface.
  Emitting nothing is permitted only for an evidence-backed genuinely
  unsupported axis, which degrades explicitly.
- **AT-PRESENCE-1 (no presence, no activation) [D6].** *Given* a policy
  activation attempt, *when* a verified host-native user-presence prompt is
  available, *then* it is used; *when* it is not, a user-configured external
  signature is required; *when* neither is available, activation is **refused
  and reported unavailable**. Activation is never silently skipped, degraded to
  an ordinary prompt, or treated as successful. Rig verifies signatures and
  specifies the signer interface; a design that ships a signing binary or
  stores key material fails this case.
- **AT-PRESENCE-2 (lost policy signer: recovery is real, bounded, and
  terminates) [D20].** *Given* the policy-activation signer from
  `AT-PRESENCE-1` is lost or compromised, *when* the user attempts recovery,
  *then* the recovery approval must clear the same live-human-act floor Gate 1
  requires for its own protection (D10/D19) — an ordinary host-native
  confirmation prompt does **not** satisfy this case, only a credential class
  no agent on the user's machine could operate unattended does.

  *And given* a candidate recovery credential, *when* Rig evaluates whether it
  may authorise recovery, *then* it is accepted only if it is cryptographically
  distinct from the everyday signing key, was registered as a recovery
  credential while an already-valid credential was in force, and is not stored
  anywhere the repository, Rig's own working state, or the agent can read
  unattended. A design in which an agent designates a fresh key as the
  recovery credential *after* asserting the everyday key is lost fails this
  case, as does one that stores or derives the recovery credential from the
  everyday key's material or location.

  *And given* first-time signer setup, *when* it completes, *then* Rig offers
  to generate a set of recovery credentials at that time, and makes the same
  offer to add more every time signer setup is run again while a valid
  credential still exists. *And given* the everyday signer and every
  registered recovery credential are simultaneously unavailable, *when*
  recovery is attempted, *then* it is **refused permanently** for that policy
  trust state: no forced override, no undocumented reset command, and no
  substitute fallback may be invented to route around the exhausted list. This
  refusal is a terminal state, not a downgrade to a weaker check.

  *And given* an authorised recovery completes, *then* its consequences —
  invalidating pending policy edits, burning outstanding one-use approvals,
  and resetting evidence-epoch tracking — take effect only as a result of that
  authorisation and are recorded in a disclosed recovery receipt; a design in
  which an agent triggers those consequences unilaterally by asserting
  recovery is needed fails this case, and so does one that applies them
  silently. This case is independent of `AT-GATE-2`: the Gate 1 integrity
  signer (D10/D19) keeps no recovery path of its own, and nothing here creates
  one for it.
- **AT-HOME-1 (global writes append, never overwrite) [D9].** *Given* a host
  whose only configuration surface is user-global, *when* Rig writes it, *then*
  the write is an append or a namespaced additive merge; every pre-existing
  user value survives byte-for-byte; and the write is disclosed in the user's
  own output, naming the file written outside the repository. A destructive or
  wholesale rewrite of a user-global file fails this case, as does an
  undisclosed one.
- **AT-HOME-2 (multi-repository attribution) [D9].** *Given* Rig installed from
  repository A and repository B, both appending to one user-global
  configuration, *then* each installation's entries carry the identity of the
  repository that wrote them, and:
  - *when* the user uninstalls from A, *then* only A's entries are removed;
    B's entries and every unattributed pre-existing user value survive
    byte-for-byte, and B's configuration keeps working;
  - *when* the user reinstalls into A, *then* A's entries are replaced in
    place — the result is idempotent, never a duplicated or accumulating
    entry;
  - *when* Rig reports what it removed, *then* the report names the
    repository whose entries were removed and does not claim to have removed
    entries belonging to another repository.

  Attribution is required even for the first installation, when no second
  repository exists yet: an unattributed entry cannot later be safely removed,
  and retrofitting attribution onto entries already in a user's global file is
  a migration this product does not want to owe. A design that attributes
  lazily, on the second install, fails this case.
- **AT-DIST-1 (a stranger can install it) [D7].** *Given* a stranger with git,
  curl, and sh and no Rig checkout, *when* they run the committed install stub,
  *then* it fetches the pinned source reference and installs into their
  repository. *And given* the first production release is tagged, *then* the
  inherited npm publish workflow no longer exists, so tagging cannot fail on a
  private package. A build that passes every other case but cannot be installed
  by someone who does not have this checkout is not a shipped product.

### G. Install lifecycle, removal, and finding disclosure (2026-07-28)

- **AT-INSTALL-1 (an interrupted install resumes; a partial one never claims to
  protect) [D14].** *Given* a transition-install that fails partway — crash,
  interrupt, permission denial, or full disk — *then* the writes already applied
  stay in place, the install manifest records exactly how far it got, and the
  install is marked incomplete. *When* the user re-runs it, *then* it resumes
  from the manifest rather than starting over or duplicating applied work.
  *When* the user instead runs uninstall, *then* the partial install is removed
  under `AT-UNINSTALL-1` — the same teardown path, not a second one. *And* until
  the install completes, no partially applied control is reported as enabled,
  installed, or protecting anything; an incomplete baseline that reports itself
  as active fails this case, which is the failure this decision exists to
  prevent.
- **AT-UNINSTALL-1 (uninstall returns the repository, not just the directory)
  [D11].** *Given* Rig installed across every surface it uses — its own files, a
  grafted `AGENTS.md`, a pre-commit hook, a CI job added under `AT-CI-1`, host
  configuration, and any user-global file written under `AT-HOME-1` — *when* the
  user uninstalls, *then* Rig walks its install manifest in reverse and removes
  exactly what it wrote, and every byte the user owns survives unchanged. Files
  Rig exclusively owns are deleted; files Rig only added to have their managed
  blocks removed and nothing else. Teardown order is the reverse of install:
  a reference is removed before the thing it points to, so an interrupted
  uninstall cannot leave a hook calling a binary that no longer exists. *And*
  Rig reports exactly what it removed. Deleting Rig's own directory and
  declaring the repository clean fails this case, because the CI job, the hook,
  and the grafted instruction file are all still there.
- **AT-UNINSTALL-2 (verified clean, or honestly best-effort) [D11].** *Given*
  Rig kept a copy of every file as it stood immediately before Rig first
  modified it, *when* uninstall completes, *then* it diffs the result against
  those copies and reports what still differs. A repository whose touched files
  differ from their pre-install state only by the user's own subsequent edits is
  reported **verified clean**; one where a managed block cannot be located —
  because the markers were edited away, or the file was rewritten by another
  tool — is reported **best-effort, with the specific file named for manual
  review**, and is never called clean. *And* the stored copies are evidence
  only: uninstall never restores them over the current file, because doing so
  would silently destroy every edit the user made after installing. A design
  that reverts a snapshot on top of user work fails this case. The same
  verified-clean versus best-effort split above is self-contained: removal
  claims are governed by it and by nothing outside this case.
- **AT-UNINSTALL-3 (usage artifacts are not installation state) [D11].**
  *Given* a repository that has been using Rig — accumulated reports, run
  history, and any post-install configuration the user filled in themselves —
  *when* the user uninstalls, *then* those artifacts survive by default and only
  installation grafts are removed. *When* the user explicitly asks for a purge,
  *then* usage artifacts are removed too, and the purge names what it will
  delete before deleting it. Silently destroying a user's report history because
  they removed the tool that produced it fails this case.
- **AT-REPORT-1 (findings stay on the machine that produced them) [D15].**
  *Given* any Rig check that writes a report, *when* it runs, *then* that report
  is written to a location Rig has excluded from version control, is not
  committed, and is not uploaded as a build artifact. *And given* the same check
  running in CI, *when* it fails, *then* the job emits a pass/fail verdict with
  finding counts and rule identities and does **not** print finding detail to
  the job log. Withholding an artifact upload while printing the same content to
  a log fails this case: on a public repository the log is as readable as the
  artifact, and a secret-scan report is a map of the repository's secrets. The
  redaction required by `AT-B3` remains in force as a second line of defence, so
  that a report which never leaves the machine is *also* redacted.
- **AT-SECRET-1 (matched secret content never reaches the model by default)
  [D16].** *Given* the leak scanner or any check whose output contains
  credential material, *when* it runs under default configuration, *then* the
  detection is deterministic and the agent may read counts, rule identities, and
  locations but never the matched content. *When* the user has explicitly
  enabled model-assisted triage, *then* and only then may finding content enter
  the agent's context, and the choice is disclosed at the point of enabling with
  the reason: the host's model is a third party, and a credential in a third
  party's context cannot be unsent — only rotated. A default that routes matched
  content through the host brain fails this case even if it is disclosed. This
  is the one place the product's preference for configurability over paternalism
  is deliberately inverted, because it is the one failure that cannot be undone
  by re-running anything.

### H. Lint-format production leaf (2026-08-21, D21)

These 19 cases are independently authored against the closed lint-format
decisions in [`../specs/lint-format-intent.md`](../specs/lint-format-intent.md).
Each must fail against the current prototype — which authored lint-format only
as a probe and implements none of drift, scope, CI, redaction, the abnormal-
ending taxonomy, or partial coverage — and pass only when this intent is met.

- **AT-LF-1 (whole-repository, open-ecosystem discovery) [GA-19, GA-20].**
  *Given* a repository containing a JS component and a nested component in an
  ecosystem Rig cannot yet build even the Policy level for, *when* Rig
  inspects, *then* it discovers both components, derives each one's
  lint/format ecosystem from the repository itself rather than a fixed
  roster, and presents every discovered component in the reviewable plan. A
  plan that enumerates only the root component, or that matches against a
  hard-coded language list, fails this case.
- **AT-LF-2 (hybrid-plus: preserve existing tools, user decides) [GA-16,
  GA-17].** *Given* a component with eslint and prettier already configured,
  *when* Rig recommends lint-format, *then* the existing toolchain is
  preserved by default; Rig may offer supported setup or a better
  alternative, but nothing changes until the user opts in. A silent
  replacement or forced migration fails this case.
- **AT-LF-3 (semantic command discovery; ambiguity returns to the user)
  [GA-21].** *Given* a component whose lint/format commands live under
  non-standard names in its manifests, tool configuration, or declared tasks,
  *when* Rig binds commands, *then* it discovers them semantically and
  preserves the declared workflow; an ambiguous match is surfaced for the
  user to choose. Reliance on fixed script names or a silent guess fails this
  case.
- **AT-LF-4 (user scope and component choice win over the recommendation)
  [GA-20, GA-28, AT-P5].** *Given* a recommended plan, *when* the user
  deselects a component and/or requests a scope other than the diff default,
  *then* the applied plan matches the user's choice. A plan that reasserts
  the recommendation over the user's edit fails this case.
- **AT-LF-5 (selection authorizes nothing; only the approved plan runs)
  [GA-25, GA-26].** *Given* lint-format selected but not yet plan-approved,
  *then* no repository code executes. *When* the user approves the concrete
  plan, *then* exactly its listed read-only commands, working directories,
  and components run, and the plan discloses that repository tasks are
  untrusted code run under Rig's controls without presenting `shell: false`
  as a safety guarantee. Any pre-approval execution, any unlisted command, or
  a `shell: false` safety claim fails this case.
- **AT-LF-6 (apply grafts and records; partial coverage is explicit) [GA-24,
  GA-34, AT-SHAPE-1, AT-INSTALL-1].** *Given* an approved plan across a
  covered and an uncoverable component, *when* Rig applies, *then* every
  write is recorded in the install manifest at the time it is made, the
  uncoverable component is excluded only with the user's approval and
  reported as a visible unprotected gap, and the covered component installs.
  An unrecorded write, or an exclusion applied without approval, fails this
  case.
- **AT-LF-7 (Policy level governs the change) [GA-22].** *Given* a covered
  component at grade Policy, *when* the check runs, *then* it governs the
  change at the lowest level capable of a definitive answer and reports a
  real Policy-level result. A placeholder result, or a check that silently
  runs a higher level, fails this case.
- **AT-LF-8 (Context level is a cumulative superset) [GA-22].** *Given* the
  same component at grade Context, *then* the checks are a strict superset of
  Policy's — Policy's governance plus understanding the change. A Context
  grade that drops or merely replaces a Policy check fails this case.
- **AT-LF-9 (Evidence level proves with verifiable evidence) [GA-22].**
  *Given* the same component at grade Evidence, *then* the checks are a
  strict superset of Context's and the verdict rests on verifiable evidence,
  not an agent opinion. An Evidence pass backed only by an unverifiable agent
  assertion fails this case.
- **AT-LF-10 (diff-scoped by default; ignore rules and working directory
  honored) [GA-28].** *Given* a covered component under the default scope,
  *when* the check runs, *then* it inspects only the changed files, respects
  the component's ignore rules, and runs inside the component's working
  directory. Inspecting the whole repository by default, ignoring the ignore
  rules, or running from the wrong directory fails this case.
- **AT-LF-11 (a read-only check that mutates is a failure) [GA-27].** *Given*
  an approved read-only check whose tool mutates the working tree, *when*
  Rig detects the mutation, *then* it stops before any further planned
  command runs, fails the check, and reports the exact changed paths with
  before/after evidence, without auto-restoring the tree and without
  continuing. An auto-restore, a continuation, or a pass fails this case.
- **AT-LF-12 (autofix is a separate, separately approved mutating action)
  [GA-29].** *Given* a completed read-only check, *then* no source is
  rewritten. *When* the user explicitly invokes a specific fix command under
  its own approval, *then* Rig applies format and/or safe lint fixes,
  re-verifies by re-running the check, and leaves the result as uncommitted
  working-tree edits the user owns. Autofix folded into the check,
  auto-committed, or run without its own approval fails this case.
- **AT-LF-13 (CI at the Evidence level is additive, proposed, and
  preserving) [GA-30].** *Given* the Evidence level, *then* verified existing
  CI receives an additive whole-scope gate that does not touch unrelated
  jobs; absent or unsupported CI gets nothing written until the user chooses
  a provider and approves a separate plan; a pipeline Rig does not
  understand is preserved and reported, never silently edited or replaced. A
  silent edit of an unknown pipeline, an auto-created CI on selection alone,
  or a clobbered unrelated job fails this case.
- **AT-LF-14 (command drift stops execution) [GA-31].** *Given* a
  plan-approved task that has since changed, *when* execution reaches it,
  *then* Rig stops before running, does not execute the changed command,
  discloses the exact drift, and requires a freshly rediscovered plan the
  user approves before resuming. Silently running the changed task, or
  running the stale approved text, fails this case.
- **AT-LF-15 (report is failure-centric, local, redacted, actionable)
  [GA-32].** *Given* a check that produces findings, including one
  containing secret- or PII-shaped content, *when* it reports, *then* the
  report stays on the producing host, keeps failure/vacuous/gap state and
  omits routine passes, redacts secrets/PII/host-rooted data on the
  producing host before anything leaves it, and explains each finding as an
  actionable item; CI emits only verdict, counts, and rule identities, and
  matched secret content reaches the agent only on explicit opt-in. Any
  leaked detail, uploaded artifact, or default secret exposure fails this
  case.
- **AT-LF-16 (every abnormal ending is its own non-passing state) [GA-33].**
  *Given* checks that end abnormally — timeout, user cancellation,
  missing-dependency, signalled/killed, partial-output, command-not-found —
  *then* each resolves to its own distinct, reported, non-passing state
  naming exactly why. Collapsing any into "pass," into a generic "failed," or
  treating an inconclusive end as non-blocking fails this case.
- **AT-LF-17 (reinstall is an idempotent resume) [GA-34].** *Given* an
  interrupted or repeated install, *when* the user re-runs it, *then* it
  resumes from the manifest, claims no protection until complete, and
  produces no duplicated or accumulating entries. A from-scratch rewrite, a
  duplicate entry, or a mid-install "protected" claim fails this case.
- **AT-LF-18 (removal reverses exactly the manifest; user fixes survive)
  [GA-34].** *Given* lint-format installed — generated CI, configuration,
  managed blocks — and a source fix the user applied via autofix, *when* the
  user uninstalls, *then* Rig reverses exactly what its manifest recorded it
  created and nothing else, and the user's autofix edits survive. Reverting
  user fixes or deleting an unrecorded artifact fails this case.
- **AT-LF-19 (support is claimed per component, only on real evidence)
  [GA-35, GA-24].** *Given* a repository with a covered and an excluded
  component after apply, *then* the covered component is claimed supported
  only because Rig built at least Policy, bound its commands, and produced a
  real result under plan-bound consent; the excluded component is not
  claimed; and the whole-repository claim is suppressed because a discovered
  component was excluded. Claiming whole-repository support from install
  success, or from per-run results without a built level, fails this case.

Post-launch update cadence, permanent maintenance staffing, commercial
ownership, and support processes are intentionally deferred until the product
has real usage. They are not prerequisites invented by this Gate 1.
