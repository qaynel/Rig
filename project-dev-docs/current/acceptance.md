# Tier 2 Advanced - Acceptance Criteria and Tests (RE-GRILLED AND FROZEN 2026-07-26)

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
  [D5, D10].** *Given* a contradictory, incomplete, placeholder-bearing, or
  unapproved Gate 2, *when* code tests are green, *then* completion still fails
  and no code-correctness result may promote the build. The specification gate
  runs **before** the code tests in the same command that gates a push, and a
  failing gate short-circuits them so they do not execute at all. A gate that
  exists but runs after, or alongside, the code tests fails this case.

  *And given* an edit to either Gate 1 file, *when* the gate runs, *then* it
  recomputes the digest of both files, finds that the recorded signature no
  longer verifies, and fails — so a context cannot reach the approved mark by
  moving it. The signature must attest that a human was physically present when
  it was made: a signer an agent could operate unattended does not satisfy this
  case, and neither does any check that a context editing Gate 1 could satisfy
  by itself.
- **AT-GATE-3 (independent semantic review) [D8].** *Given* mechanical
  authority and traceability checks pass, *when* a review evaluates Gate 2,
  *then* every Gate-1 rule has one testable implementation contract and no two
  clauses prescribe incompatible outcomes before the code gate may start. The
  review must be performed in a **fresh session by a different model** than the
  authoring context, must be report-only, and its receipt must be pinned to the
  exact content digest reviewed. A same-model, same-session, or unpinned review
  does not satisfy this case. The same rule governs the 115-leaf catalogue
  review.
- **AT-GATE-4 (workflow, not staffing).** *Given* a repository maintained by one
  person, *when* that person runs separate implementation and fresh-context
  review agents, *then* the workflow satisfies separation without requiring
  named personnel; the implementing context still cannot edit Gate 1 or approve
  itself.

### A. Archetype — the shared service shape (every catalogue service must pass)

- **AT-SHAPE-1 (install grafts, never clobbers).** *Given* a repo onboarded on a chosen host, *when*
  the user selects any service S at any grade, *then* Rig installs S's convention adapted to this
  repo's language/framework, and preserves every pre-existing user-owned value.
  An existing `AGENTS.md` is appended-to/referenced, never replaced; an approved
  structured file receives only a verified namespaced additive merge.
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
- **AT-BASE-4 (exact user activation; no self-authorization).** *Given* any
  policy edit, including an agent-proposed edit, *when* the user has not
  approved the exact new policy digest, *then* active permissions do not
  change. Approval activates only that exact revision.
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
  emits for the whole roster (AT-CLAIM-1), advertises verified enforcement only
  where a first wire proves it (AT-HOST-4), and discloses the difference in the
  user's own output (AT-CLAIM-2). Genuine vendor absence degrades explicitly
  and no axis emits anything speculative.
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
- **AT-B3 (real first-enable history scan).** *Given* the leak-scanner service is
  first enabled, *when* activation runs, *then* a real history scan completes
  before the service is marked active. A finding, missing scanner, or execution
  failure is nonzero and produces an actionable redacted report; activation
  requires remediation plus a clean re-scan or a waiver scoped to the exact
  current findings. The enabled staged-secret floor remains installed even
  when history activation fails.
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

- **AT-HOST-1 (complete per-axis contract).** *Given* a host live-hook axis is
  called verified, *when* its contract is inspected, *then* Gate 2 names the
  exact emitted path/filename, vendor input/event schema and matcher fields,
  deny response and exit behavior, deliberate-proceed protocol, owned merge
  boundary, user-config preservation, and first/repeated-apply behavior.
- **AT-HOST-2 (boundary and proceed behavior).** *Given* default active
  controls, disallowed network access, remote-content-to-execution, sensitive
  environment/credential reads, and guardrail disable/bypass are mechanically
  denied. Every deny names the category and rule. Legitimate near-matches pass;
  exact one-use user approval permits only the unchanged action once; activated
  permanent policy choices take precedence thereafter.
- **AT-HOST-3 (evidence is per axis) [D2].** *Given* any host or CI capability
  marked **verified**, *then* its own evidence bundle records authoritative
  vendor documentation for the exact claimed surface/behavior, vendor/version
  and verification date, fixtures/results, and first-wire evidence for
  executable behavior. One host-level citation cannot verify multiple axes. An
  axis that is built and emitted without this bundle is not marked verified and
  is not advertised; it is not thereby exempt from `AT-CLAIM-1` or
  `AT-CLAIM-2`.
- **AT-HOST-4 (release blocks on the advertised set) [D1, D2].** *Given* any
  executable axis that Rig **advertises as verified** lacks a complete
  contract, official evidence, or passing first-wire result, *then* the initial
  release is blocked. Release is *not* blocked by an axis that is built,
  emitted, and honestly disclosed as unverified. A genuinely unsupported vendor
  axis degrades explicitly and emits no speculative config.

  The initial advertised set is exactly **Claude Code, Cursor, Codex, and
  GitHub Actions**. This is a floor on honesty, not a ceiling on ambition: an
  axis promotes into the advertised set the moment its first wire passes, and
  that promotion must require **no edit to this file**. A design that hard-codes
  the four-host list anywhere that a promotion would have to change fails this
  case.
- **AT-HOST-5 (unsupported MCP is retired everywhere).** *Given* verified
  evidence that a host, including the `pi` fixture, does not support MCP, *when*
  any legacy or catalogue install path runs, *then* Rig emits no MCP
  configuration for that host. A previously emitted user-owned file is
  preserved and receives migration guidance rather than silent deletion.
- **AT-CI-1 (integrate existing CI).** *Given* a verified supported CI
  configuration exists, *when* Rig is approved, *then* it additively adds the
  enabled repo-scope Rig gate and actionable report upload without changing
  unrelated jobs or user values.
- **AT-CI-2 (bootstrap absent CI).** *Given* no CI exists, *when* the user
  selects a verified provider and explicitly approves creation, *then* Rig
  creates a minimal provider-native pipeline; before approval it creates none.
- **AT-CI-3 (safe, idempotent, real execution).** *Given* an integrated or
  bootstrapped pipeline, *then* it runs all enabled baseline controls and
  selected executable services, uploads actionable reports, requests only
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
  user receives less than the pre-revision product gave them. A host is never
  skipped, silently or otherwise, on the grounds that its enforcement is
  unverified. Emitting nothing is permitted only for an evidence-backed
  genuinely unsupported axis, which degrades explicitly.
- **AT-CLAIM-2 (say which it is, every time) [D3].** *Given* any installed
  host, *when* Rig writes install output or a run report, *then* that host's
  claim status is stated in user-facing words: `verified`, or
  `emitted — enforcement unverified, please report`. Silence fails this case:
  an undisclosed binding reads to the user as a working one. The disclosure
  also names any configuration written outside the repository.
- **AT-CLAIM-3 (disclosure does not gate) [D3].** *Given* a host whose
  enforcement is unverified, *when* the user installs or runs, *then* Rig does
  **not** interpose a confirmation prompt, an extra flag, or a blocking
  acknowledgement on that path. The unverified path is as usable as the
  verified one; only the claim differs. A design that makes the unverified path
  harder to use suppresses the field reports that promote it and fails this
  case.
- **AT-PRESENCE-1 (no presence, no activation) [D6].** *Given* a policy
  activation attempt, *when* a verified host-native user-presence prompt is
  available, *then* it is used; *when* it is not, a user-configured external
  signature is required; *when* neither is available, activation is **refused
  and reported unavailable**. Activation is never silently skipped, degraded to
  an ordinary prompt, or treated as successful. Rig verifies signatures and
  specifies the signer interface; a design that ships a signing binary or
  stores key material fails this case.
- **AT-HOME-1 (global writes append, never overwrite) [D9].** *Given* a host
  whose only configuration surface is user-global, *when* Rig writes it, *then*
  the write is an append or a namespaced additive merge; every pre-existing
  user value survives byte-for-byte; and the write is disclosed under
  `AT-CLAIM-2`. A destructive or wholesale rewrite of a user-global file fails
  this case, as does an undisclosed one.
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

Post-launch update cadence, permanent maintenance staffing, commercial
ownership, and support processes are intentionally deferred until the product
has real usage. They are not prerequisites invented by this Gate 1.
