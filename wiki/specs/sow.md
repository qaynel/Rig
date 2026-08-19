# Preliminary Statement of Work

> **HOLD — Gate 2 reopened 2026-07-25; status audited 2026-07-26.** This SOW is
> subordinate scope/status material, not implementation authority. Its prior
> estimates and delivery claims are historical only. `spec/technical-spec.md`
> is the sole Gate-2 implementation authority once versioned, independently
> specification-reviewed, and re-frozen against the current Gate 1. No clause
> here may add to, conflict with, or supersede that design.

> **AWAITING REBUILD — Gate 1 revised 2026-07-26 (D1-D9).** Gate 1 was
> re-grilled after this SOW's v0.5 audit, and `technical-spec.md` v0.2 is now
> superseded. This SOW is to be **rebuilt off the re-frozen Gate 2**, not
> patched: the build/claim split (D1, D2) changes what release means, and D7
> moves distribution from an external dependency into product scope. Until that
> rebuild, treat Sections 3.8, 4 (D12), 5, 5.1 and 8.1 as describing a scope
> that no longer matches the frozen intent.
>
> Two items must not be lost in the rebuild:
>
> - **The estimate is still withdrawn, and person-days may be the wrong unit
>   (`O3`, open).** §5.1 withdrew "18-28 days"; the 115-179 headline is the dead
>   v0.1 figure. The proposal on the table is to express remaining work as
>   ordered slices plus a gate-pass count and drop person-days entirely, on the
>   grounds that the work is agent-executed. Undecided.
> - **§8.1's distribution work is now in scope, not a dependency.** D7 puts the
>   install stub, the retired publish workflow, and the `v5.0.0` tag inside the
>   product. §8.1's framing as an unowned external prerequisite is superseded;
>   its evidence remains accurate.

## Tier 2 Advanced A-la-Carte Delivery Model

| Field | Value |
|---|---|
| Status | HOLD - GATE 2 AND ALL COMPLETION CLAIMS REOPENED |
| Version | 0.5 |
| Prepared | 2026-07-24 |
| Amended | 2026-07-26 (readiness audit: specification-gate ordering, approval-facility and distribution dependencies) |
| Business spec | [`gate1/business-spec.md`](../gate1/business-spec.md) |
| Acceptance oracle | [`gate1/acceptance.md`](../gate1/acceptance.md) |
| Governing design | [`gate2/technical-spec.md`](../gate2/technical-spec.md) |
| Coverage spec | [`specs/host-coverage-spec.md`](host-coverage-spec.md) |
| Build list | [`tasklist.md`](tasklist.md) |
| Decision history | [`sources/logs/advanced-grilling.md`](../sources/logs/advanced-grilling.md) (the `GA-#` log) |
| Estimate class | Rough order of magnitude (ROM), expected accuracy +/- 30% |
| Commercial status | Rates, fees, payment terms, and start date are not included |

## 1. Purpose

This Statement of Work (SOW) records proposed implementation scope, delivery
plan, observed status, evidence, assumptions, and effort for the Tier 2
Advanced a-la-carte delivery model. It is derived from Gate 1 and the governing
design; it is not independently normative. Only Gate 1 defines acceptance and
only the frozen `spec/technical-spec.md` defines implementation.

The work extends Rig's shipped Basic materializer. It does not create a second
installer or a separate agent runtime. The completed implementation will:

1. resolve the active safety policy before profiling, sanitising the existing
   harness by default or truthfully recording an approved disablement;
2. present the complete Development, Testing, Infrastructure, and
   Product-Security service catalog;
3. let the user select each leaf service and its minimal, mid, or maximal
   grade, regardless of the scan recommendation;
4. pull only the exact dependency slices required by those selections;
5. graft the resulting conventions and checks onto existing agent
   infrastructure without clobbering user-owned content;
6. install sanitation, drift, secret, git, CI, and network-policy controls
   enabled by default while honoring the user's activated per-control and
   per-enforcement-surface choices;
7. preserve the existing Basic command path and its behavior; and
8. cover the complete supported host roster and the documented CI providers on
   recorded evidence, degrading explicitly wherever a vendor ships no
   repo-scoped surface.

This SOW translates the frozen design into execution scope after that design is
re-frozen. If this SOW conflicts with or goes beyond the governing design, this
SOW is wrong and must be reconciled before implementation.

### 1.1 Revision status

Version 0.4 withdraws every v0.3 completion claim as acceptance evidence. The
files and tests produced by the earlier effort remain useful implementation
artifacts, but they were built against an obsolete design and cannot promote
the release. In particular, the withdrawn plan's Slice 10, now Slice 11 in the
current Gate-2 candidate, is reopened at **0/115 semantically accepted
services**: 108 services contain `TODO(Slice 10)` in all four
fragments (432 files), and the other seven use forbidden generic “Concrete
convention” filler. Repeated slice/check filler is not authored service
behavior.

Version 0.4 also records the scope consequences of the 2026-07-26 product
rulings. Those rulings must be incorporated into and owned by the re-frozen
technical specification; this SOW merely inventories the resulting work.

Version 0.3 historically claimed Slices 1 to 11 and the first three coverage
packages built and green. That claim is preserved here as history, not as
current completion or acceptance.

Version 0.3 also recorded the rulings taken on every item v0.2 left open, in
Sections 3.2, 3.7, 3.8, 3.10, 9, and 12. Those mechanisms remain subject to
the re-frozen technical specification.

Version 0.2 folded in the decisions recorded after v0.1 was prepared:

- the host and CI coverage expansion plan of 2026-07-25 and its two evidence
  reports under `reference/`, which widen coverage from four hosts and one CI
  provider to the full 19-host supported roster and five additional CI
  providers (Section 3.8, deliverable D12, slice 12);
- the Gate 2 mechanism detail that v0.1 carried only at outcome level: the
  named CLI subcommand seams, the installed target artifact set, the
  cumulative-fragment constraint, and the existing-skill reuse contract
  (Sections 3.2 and 3.6);
- the Gate 1 decision-history items that carry execution consequences: the
  host handoff before any scan, the full sanitation trigger set including the
  pre-commit harness re-scan and hook-based runtime enforcement, the
  never-too-safe duplicate-placement policy for cheap deterministic guards,
  the exact catalog leaf inventory, and the four-level depth limit with no
  fifth selectable tier.

Version 0.2 historically recorded the host/CI expansion as SOW change control.
The current 19-host/six-provider roster is already required by Gate 1 and does
not depend on this SOW's commercial approval.

## 2. Target Outcome

At completion, Rig will provide a supported, test-backed Tier 2 Advanced path
with the following observable workflow:

```text
host handoff -> resolve active policy -> inspect/review unless disabled
  -> recommend -> user selection
  -> plan -> apply -> check
```

The host handoff is the first step: Rig explains the pipeline it will run, the
user names the host it will run on, and only then does inspection begin
(GA-9b). Remediation remains a separate, explicit, digest-approved operation.
No catalog service may operate until the active policy's onboarding
prerequisites are satisfied. Under the default policy this means a current
sanitation review and complete enabled baseline; an approved policy may disable
sanitation or another control, in which case the workflow continues only with
that control truthfully reported disabled/not run.

The installed result remains B1 configuration:

- no Rig model key;
- no daemon or resident process;
- no independent semantic agent runtime;
- no persistent semantic memory store;
- no onboarding-time installation of service engines into the target; and
- committed repository files remain the durable context.

## 3. Scope of Work

### 3.1 Acceptance Harness

- Transcribe the frozen Advanced acceptance behaviors into executable
  black-box tests without modifying Gate 1.
- Add fixtures for malicious harness input, UI-less repositories, explicit
  user overrides, dependency slices, host capability degradation, transaction
  failure, vacuous runs, coverage gaps, and Basic adoption.
- Maintain traceability from every frozen acceptance case to one testable
  technical contract and its primary executable evidence. The current missing
  set is: AT-GATE-1, AT-GATE-2, AT-GATE-3, AT-GATE-4; AT-SHAPE-6; AT-BASE-4,
  AT-BASE-5, AT-BASE-6; AT-HOST-1, AT-HOST-2, AT-HOST-3, AT-HOST-4,
  AT-HOST-5; and AT-CI-1, AT-CI-2, AT-CI-3, AT-CI-4.
- Deliver the specification gate as a runnable command
  (`scripts/check-advanced-spec.js`) and wire it into the repository test
  pipeline **ahead of** the code tests, so an unfrozen, contradictory,
  placeholder-bearing, or untraceable Gate 2 short-circuits code-correctness
  promotion (AT-GATE-2, governing design §12). A code suite that reaches green
  without that gate having run is not acceptance evidence.
- Author the test files the governing design's ordered slices name as their
  verification seams and that do not yet exist:
  `tests/advanced-spec-gate.test.js`, `tests/advanced-policy.test.js`,
  `tests/advanced-enforcement.test.js`, and
  `tests/advanced-remediation.test.js`.

### 3.2 Catalog and Selection Contract

- Add the source-owned catalog (`rig/catalog.json`), baseline metadata, and
  service fragments under `rig/catalog/`.
- Transcribe the complete frozen v1 inventory across four families. The pinned
  inventory is 115 leaf services: Development 26, Testing 40 (including the
  ten-service Mutation group), Infrastructure 31, and Product-Security 18.
- Hold the taxonomy at exactly four levels, `family -> group -> service ->
  grade`. Groups and families are catalogued but never persisted as selections,
  and sub-capabilities are not individually selectable (GA-9k(c)).
- Keep scan depth and grade as two different things, because they answer two
  different questions:
  - **Scan depth is a service.** It owns the repository's scanning-depth
    policy: how deep the scanning services are permitted or required to look,
    as a selectable capability with its own owned scope. It is a leaf, and the
    inventory count of 115 includes it.
  - **Grade is the extent of implementation.** Minimal, mid, and maximal say
    how thoroughly any one service is implemented in this repository. That is
    the dial GA-9k(c) refers to, and it is never a selectable leaf.
  - A service therefore has a grade, and the scan-depth service also has its
    own minimal, mid, and maximal grades, without the two collapsing into each
    other.
- Assign canonical lowercase dot-separated IDs and source-owned aliases.
- Define unique owned-scope keys and explicit adjacent-service exclusions.
- Materialize identity plus cumulative minimal, mid, and maximal fragments. A
  grade fragment may not redefine identity, family, group, owned scope,
  dependencies, or report behavior.
- Reference existing Rig skills as the implementation source wherever a frozen
  service identity already matches one (feature implementation, structured
  debugging, product design, TDD, code review). Add grade and slice overlays;
  do not fork the base skill.
- Carry the Basic MCP configurator forward as the Infrastructure
  environment-and-config compatibility service rather than as a separate
  packaging identity (GA-9g).
- Validate strict grade growth, complete inventory, scope uniqueness,
  references, fragments, checks, dependency targets, and cycles.
- Add strict validation for the committed, leaf-only `rig.json` selection
  manifest. `rig.json` remains catalogue-only. Safety control and enforcement
  choices live exclusively in the separately activated
  `.rig/network-policy.json`.

### 3.3 Dependency Resolution

- Resolve named service slices to a deterministic fixed point.
- Preserve every explicit user-selected grade.
- Auto-pull only the exact required slice, never a whole group or an elevated
  dependency grade.
- Detect and report complete cycle paths.
- Produce deterministic topological ordering with canonical ID tie-breaking.
- Encode the testing determinism ladder as audited slice bundles rather than
  a second resolver.

### 3.4 Sanitation and Review

- Implement bounded, read-only inspection of agent harness and configuration
  surfaces, covering the static, files-at-rest detection subset of the
  agent-harness security playbook (GA-3b layer i).
- When sanitation is enabled, run that inspection at every frozen trigger point
  (GA-3c): at adopt and install time, on demand through the bundled review
  convention, and at pre-commit over changed harness files.
- Treat target files as hostile bytes: do not execute, import, or source them.
- Canonicalize paths, reject escaping symlinks, bound file sizes and context,
  hash every input, and redact secret-shaped evidence.
- Produce a stable aggregate harness digest.
- Add the bundled host-agent sanitation review convention and strict review
  artifact validation.
- Enforce the exact ALLOW, ALLOW_WITH_RESTRICTIONS, QUARANTINE, and BLOCK
  verdict contract.
- Fail closed for stale, missing, unknown, free-form, or unverifiable review
  data.
- Implement separate read-only remediation proposals bound to exact proposal
  digests and unchanged file preimages. Before approval they write nothing;
  after approval they apply exactly the proposed diff, reject stale inputs and
  no-op results, roll back partial failure, and re-run sanitation before
  reporting a fresh verdict.

### 3.5 Profiling and Recommendations

- Profile repository purpose, languages, frameworks, runtime surfaces,
  existing tests, CI, tools, deployment configuration, agent framework, and
  chosen hosts without executing target code.
- Before profiling or recommendation, require either a current allowed
  sanitation review or an exactly activated policy state that disables
  sanitation. In the disabled path, continue without a sanitation verdict and
  report the control disabled/not run.
- Emit the complete leaf catalog with an applicability status, evidence,
  reason, and optional recommended grade for every service.
- Keep `not_recommended` advisory. The user's confirmed `rig.json` choices
  remain authoritative.

### 3.6 Planning and Transactional Application

- Add the staged subcommand seams `inspect`, `recommend`, `plan`, `apply`,
  `remediate`, and `check` to the existing entrypoint. The CLI stays argument
  parsing and orchestration; domain logic stays under `rig/lib/`.
- Materialize the Rig-owned target artifact set: the catalog receipt, routing
  file, context index, sync map, service bindings, `.rig/baseline/` contents,
  one file per effective service under `.rig/services/`, the `.rig/bin/`
  commands, and the pre-commit dispatcher.
- Materialize the user-owned authoritative `.rig/network-policy.json`, its
  explanatory `.rig/network-rules.md`, and policy activation status without
  putting reusable approval authority in committed files. Clone-local one-use
  approval state is uncommitted and atomically consumed.
- Add typed plan operations for create-owned, replace-owned, ensure-line,
  structured merge, and hook changes.
- Inventory collisions and preimage hashes before any target write.
- Reject malformed user configuration rather than treating it as empty.
- Generate a content-bound plan digest and human-readable summary.
- Apply under an exclusive target lock using compare-and-swap preimages.
- Bind the plan to the validated manifest, current review, source reference,
  catalog digest, and target preimages, and revalidate every binding before
  apply.
- Stage on the target filesystem and commit in deterministic,
  baseline-first order, with the activation receipt written last.
- Roll back every change from a failed transaction and preserve the prior
  valid install.
- Never auto-break an install lock; require explicit operator recovery after
  confirming that no apply is active.
- Never replace or delete user-owned paths.
- Support idempotent install, adoption, upgrade, and receipt-owned uninstall
  behavior.

### 3.7 Default-on, User-Controlled Safety Baseline

- Install the complete baseline on every catalogue install, including an empty
  service selection, and enable every control and enforcement surface by
  default.
- Expose independent control leaves for sanitation, byte-exact drift, semantic
  drift, staged-secret protection, and network policy. Expose host hooks,
  pre-commit, and CI as independent enforcement surfaces, with group/global
  switches as conveniences. Disabling a leaf or surface genuinely stops its
  restriction without disabling unrelated Rig functions.
- Make `.rig/network-policy.json` the one authoritative safety policy, with
  `controls`, `enforcement`, and `network` sections. `rig.json` remains
  catalogue-only; prose points to the policy and cannot override it.
- Validate the policy, then identify an activation revision by SHA-256 over its
  exact file bytes. Formatting, whitespace, or key-order changes therefore
  require a fresh activation.
- Let agents draft policy candidates only when the user requests that exact
  proposal or has granted delegated policy-edit mode. Delegation is proposal
  authority only: it is status-visible, revocable, and never activates
  permissions without exact-revision approval.
- Prefer a verified host-native user-presence approval that attests the exact
  digest and prevents replay. Where the host cannot provide that contract,
  require an external user-presence cryptographic signature whose private
  material remains outside the repository. Both paths produce the same
  activation receipt; an ordinary prompt, repository file, or CLI flag is not
  proof of user approval.
- Put strict wording in every installed base prompt: prior approvals, delegated
  edit mode, chat context, tool access, urgency, or broad task wording are not
  policy activation consent.
- Store exact one-use approvals clone-locally and uncommitted. Bind each to the
  normalized full action envelope: active policy digest, repository identity,
  host/surface, rule category, tool or method, destination, working directory,
  normalized arguments or request-body hash, and relevant input hashes.
  Atomically consume it when dispatch begins even if execution later fails.
- Impose no Rig clock expiry on an unused exact approval. It remains valid until
  used, a bound detail changes, the user revokes it, or a verified native host
  expiry occurs. Provide list, revoke, and revoke-all operations and show each
  pending approval's age.
- Make permanent allowances narrow by default (for example, tool plus
  destination), while allowing an explicit category-wide or global choice.
- Record every disabled or unrun control and enforcement gap. Never call it
  protected, scanned, passed, or verified. Re-enabling a control invalidates
  evidence from before or during disablement and requires a fresh run.
- Install sanitation lifecycle metadata, the central drift rule/context index,
  the byte-exact copy checker driven by `.rig/sync-map.json`, and the
  deterministic staged-secret/tracked-`.env` floor.
- On first enablement of the leak-scanner service, run a configured vetted
  scanner such as Gitleaks, TruffleHog, or an equivalent repository command
  over full history. Rig does not silently install a scanner. A missing scanner,
  finding, or execution failure leaves activation pending/nonzero with an
  actionable redacted report while the enabled staged-secret floor remains
  installed. Activation then requires remediation plus a clean re-scan or a
  waiver scoped to the exact current findings.
- Move enabled git checks behind a dispatcher that runs, in order, the
  byte-exact check, staged-secret floor, changed-harness sanitation scan,
  selected Product-Security checks, and the user's existing chained pre-commit
  hook.
- Install `.rig/bin/check.js --scope repo` in every git repository. Enabled
  controls run in each applicable verified dev-time, git, and CI surface;
  disabled surfaces do not secretly enforce them.

### 3.8 Host and CI Capability Coverage

**Registry and degradation model.**

- Add a capability registry independent of the Basic MCP tier registry.
- For every host and CI axis marked verified, record that axis's complete
  evidence bundle: authoritative vendor documentation for the exact claimed
  surface/behavior, vendor/version and verification date, fixtures and results,
  and successful first-wire evidence for executable behavior. Evidence cannot
  be borrowed from another axis, and every listed component is required.
- Materialize selected service prose once under `.rig/services/`; host
  surfaces may contain only thin pointers or native wrappers.
- Emit thin host-native adapters or pointers to the central selected-service
  payload, appending to the host's own instruction surface rather than
  assuming one fixed file, additively and without clobbering existing content.
- Before a live-hook axis can be called verified, the governing technical
  specification must name its exact emitted path/filename, vendor input/event
  schema and matcher fields, deny response and exit behavior, deliberate-proceed
  protocol, owned merge boundary, user-config preservation, and first/repeated
  apply behavior.
- On hook-capable hosts, emit that exact additive native hook and mechanically
  enforce the active policy across every shell, built-in web, and
  network-capable MCP surface the host exposes. MCP is a preferred allowed
  route, never an enforcement bypass. The default policy denies the four frozen
  action categories (GA-3b layer ii):
  - an outbound network command;
  - a fetch piped into a shell;
  - a read of `.env` or equivalent credential files; and
  - an attempt to disable Rig's own guardrails, meaning removal, rewriting, or
    de-permissioning of the pre-commit hook, the `.rig/hooks/` and `.rig/bin/`
    checks, the `.rig/baseline/` contents, the baseline entries in the receipt,
    the CI job that runs the repo-scope check, or a commit that bypasses hook
    verification.
- Report every deny with the exact category and rule and a visible,
  deliberate-proceed path through exact one-use or activated permanent policy
  approval. Legitimate near-matches pass; the hook never silently swallows an
  action.
- Record the limits of this layer rather than overstating it: the hook fires
  only on actions the host routes through it, so a direct file write or a
  verification bypass can still get through. The committed dispatcher and the
  whole-repository CI floor remain the backstop, and true isolation stays
  Tier 3.
- Install deterministic git and CI floors for generic git repositories.
- Use project rules or advisory instructions where live semantic hooks are not
  verified.
- Never emit speculative live-hook or CI configuration.

**Coverage breadth (added in v0.2).**

- Enter all 19 hosts in the `SUPPORTED_HOSTS` union, each across four axes:
  instruction, native skills, live hook, and MCP. Twelve hosts are expected to
  be fully repo-graftable on all four axes; the remainder degrade on at least
  one axis because of a genuine vendor limitation.
- Carry a `surfaces` map of researched repo-scoped paths per host, a complete
  axis-local evidence bundle for every verified axis, and a per-host `mcp_key`
  override where the vendor's schema differs.
- Record an `mcp` disposition of exactly `repo` (committable per-repo file),
  `user_global` (advisory note only, because the vendor ships no per-repo
  file), or `unsupported` (the vendor refuses MCP).
- Prefer the repo-scoped committable path in every case. Where only a
  user-global surface exists, emit a one-line advisory note; never fabricate a
  per-repo file the host will not read.
- Apply that advisory rule to the skills axis as well as the MCP axis. A host
  whose skills directory is user-global carries a `user_global` skills
  disposition and receives a note pointing at that path. `absent` is reserved
  for hosts with no skills surface at all, because treating a user-global
  surface as absent is the silent vanishing that the host-coverage property
  forbids.
- Fix host identity: `devin` is the Devin CLI, `windsurf` is Devin Desktop
  (the vendor-renamed Windsurf). Cloud Devin is not a supported identity.
- Record the two evidence reversals: `pi` and `cursor` both auto-discover a
  skills directory and must not be marked skills-absent.
- Keep MCP entries value-free. Credential safety stays
  `manual_note_required` except where a report confirms an inline-safe
  transport; no inline tokens are ever emitted.
- Use one evidence-backed MCP disposition across legacy Basic and catalogue
  compatibility paths. Unsupported hosts must not enter either renderer;
  supported catalogue materialization remains owned by the Infrastructure
  compatibility slice.
- Date-stamp every citation with the date it was verified, and flag the
  volatile entries explicitly (vendor consolidations, beta or experimental hook
  surfaces, and open vendor issues).
- Treat re-verification as a standing condition after initial release rather
  than a substitute for first wire:
  the registry carries each entry's verified-on date and its re-verify window,
  and any entry past its window is reported as stale rather than silently
  trusted.
- Make the same re-verification runnable on demand, so the user can check the
  coverage claims themselves at any time instead of waiting for the cadence.
  The command reports staleness from recorded dates only; it performs no
  network access, and the vendor-document reading stays with the host agent or
  the maintainer.

**CI providers (added in v0.2).**

- Treat GitLab CI, CircleCI, Jenkins, Buildkite, Azure Pipelines, and GitHub
  Actions as candidates until each provider has an exact merge/bootstrap
  contract, complete per-provider evidence, and a passing first real run.
- For verified existing CI, safely parse the provider-native configuration and
  add the enabled repo-scope Rig gate plus actionable `reports/rig/` upload
  without changing unrelated jobs or user values. Unknown, malformed, or
  unverified configuration fails visibly and remains byte-for-byte unchanged.
- When no CI exists, create no provider configuration until the user selects a
  verified provider and explicitly approves a minimal provider-native
  bootstrap. The resulting pipeline runs all enabled controls and selected
  executable services, requests only necessary permissions, uses no repository
  secrets, and applies idempotently.
- An emitted CI integration remains pending rather than verified until its
  first real CI run succeeds.

### 3.9 Service Runs and Reports

- Represent commands as executable plus argv arrays.
- Execute with `shell: false`, an explicit working directory, and a timeout.
- Give every service an explicit executable, convention-only, or surfaceless
  disposition. An executable service must bind and run a real repo-adapted
  command, preferring an existing repository command/tool, then a standard
  library or native feature, then an already-installed dependency. A
  convention-only service verifies its service-specific installed behavior; a
  surfaceless service writes a vacuous report naming the exact reason nothing
  can run.
- Bind development runs to diff or staged scope and CI runs to whole-repository
  scope.
- Apply fail-fast ordering to the testing ladder.
- Treat undeclared, missing, malformed, silent, or no-op executable bindings,
  missing executables, timeouts, and malformed output as nonzero failures or
  coverage gaps, never passes.
- Write schema-valid, redacted reports only for failed, vacuous, or
  coverage-gap outcomes.
- Include the evidence, fix context, dependency-not-run status, and exact rerun
  command needed to act on a report.
- Make `reports/rig/` available as a CI artifact when actionable reports
  exist.
- Avoid routine pass files.

### 3.10 Compatibility, Documentation, and Release

- Preserve the legacy no-subcommand Basic CLI and all existing Basic tests.
- Adopt legacy payloads only when byte identity proves Rig ownership.
- Reuse the existing MCP resolver and renderers only through the Infrastructure
  compatibility slice and only after strict preflight.
- Retire the `pi` entry from the Basic renderer's host-file map and its
  renderer, so Rig stops writing an MCP file for a host that the coverage
  evidence records as refusing MCP. This includes the Basic renderer tests and
  a documented path for targets that already received that file. The coverage
  plan now records the same cross-path retirement requirement.
- Keep the Basic receipt and the new catalog receipt separate.
- Document the Advanced CLI, `rig.json`, staged workflow, host degradation,
  report behavior, lock recovery, adoption, upgrade, and uninstall behavior.
- Provide per-host installation guidance only for verified capabilities.
- Publish an operator host and CI coverage table that matches shipped
  behavior, with the volatile entries date-stamped.
- Keep the shipped registry and coverage documentation aligned with the frozen
  governing design. A code or registry difference returns to Gate 2; it does
  not rewrite the design by implication.
- Bring the existing user-facing documentation up to the shipped system rather
  than leaving it describing the pre-catalog product. In scope:
  - the public READMEs in all three languages, which must stay consistent with
    each other;
  - the shipped agent instruction body and every byte-exact host copy of it,
    which the copy checker enforces as one canonical text;
  - the host portability table, which must match the capability registry's
    dispositions rather than restating older host claims;
  - the operator and CI-floor guides under `docs/advanced/`, including the
    host and CI coverage table; and
  - any remaining reference to a deprecated tier package or to a design path
    that this reorganization moves.
- Describe the new system in user terms in those documents: the default-on,
  user-controlled baseline, policy activation and disablement, the four-family
  catalog and its grade dial, the staged onboarding flow, what each verified
  enforcement surface denies and how exact one-use proceed works, and what
  degrades on which host.
- Complete an independent semantic review of catalog boundaries before release.
- Keep `npm test` as the full release gate, with the specification gate running
  first inside it. Ordering is part of the gate: code results produced before or
  without a passing specification gate carry no promotion authority.

## 4. Required Deliverables

| ID | Deliverable | Completion evidence |
|---|---|---|
| D1 | Specification gate, complete trace, executable acceptance suite, and fixtures | AT-GATE-1…4 pass; every current Gate 1 case traces through the sole technical specification to testable evidence |
| D2 | Strict catalog and `rig.json` validators | Inventory, fragment, grade-growth, ID, scope-map, and invalid-input tests pass |
| D3 | Complete source catalog and service packs | All 115 leaves pass fresh-context semantic authorship/MECE review as well as inventory and executable checks; TODO/generic/repeated filler fails |
| D4 | Named-slice dependency resolver | Determinism, exact-slice, selected-grade, ordering, and cycle fixtures pass |
| D5 | Inspection, review, recommendation, and bounded remediation flow | Hostile-input, redaction, digest freshness, verdict, full-menu, exact approved diff, stale/no-op rejection, rollback, and re-scan tests pass |
| D6 | Typed plan and transactional apply engine | Collision, no-clobber, compare-and-swap, lock, rollback, idempotence, and receipt tests pass |
| D7 | Default-on user-controlled baseline and policy activation | Policy authority/digest/user presence, per-control and per-surface disablement, one-use approval/revocation, re-enable freshness, sanitation, drift, secret, real history scan, git, CI, upgrade, and uninstall tests pass |
| D8 | Host capability registry and enforcement adapters | Every advertised executable axis has its exact contract, per-axis documentation/fixtures/results/first wire, shell/web/MCP policy enforcement, one-use proceed, preservation/idempotence, and honest degradation evidence |
| D9 | Real run bindings and failure-centric reports | Every service has one honest disposition; executable bindings really run; missing/malformed/silent/no-op cases fail; diff/repo scope, fail-fast, vacuous, coverage-gap, redaction, and concurrency tests pass |
| D10 | Compatibility and operator documentation | Legacy CLI remains green and Advanced setup/lifecycle documentation is reviewed |
| D11 | Release evidence | Advanced matrix, `npm run test:rig`, and `npm test` pass on the final source state |
| D12 | Full host and CI coverage | Nineteen-host/six-provider registry; exact per-axis contracts; documentation, fixture/result, and first-wire evidence; unsupported MCP retirement; safe existing-CI merge; approved absent-CI bootstrap; no speculative config; and never-clobber/idempotence fixtures pass |
| D13 | User-facing documentation refresh | READMEs in three languages, the canonical agent instruction body and all byte-exact host copies, the portability table, and the `docs/advanced/` guides describe the shipped system; `scripts/check-rule-copies.js` and `npm test` stay green |

Internal module boundaries may be combined where that produces a smaller
implementation, as permitted by the governing design. The behavioral and
ownership boundaries remain mandatory.

## 5. Delivery Plan, Status, and ROM Estimate

One person-day means one productive eight-hour engineering day. The ranges
include implementation, test authoring, code review, documentation, and normal
rework inside the frozen scope. They exclude calendar wait time, commercial
administration, and changes to Gate 1 or Gate 2.

The ROM column is the original v0.1 estimate, retained only as the estimating
record. Version 0.3 called many slices delivered; the current status column
withdraws those acceptance claims after the 2026-07-25 re-grill. Existing code
is input to rework, not proof that a reopened slice is complete. Current
remaining scope is inventoried in Section 5.1; it must be ordered and estimated
only after Gate 2 is re-frozen.

| Slice | Work package | Primary verification | ROM person-days | Status |
|---|---|---|---:|---|
| 1 | Freeze executable acceptance seams | `node --test tests/advanced-acceptance.test.js` | 4-6 | Reopened: 17 current cases absent |
| 2 | Catalog, target schema, representative fragments, inventory, and scope map | `node --test tests/advanced-catalogue.test.js tests/advanced-config.test.js` | 8-12 | Reopened against current policy/catalogue contract |
| 3 | Named-slice resolver and deterministic ladder bundles | `node --test tests/advanced-resolve.test.js` | 4-6 | Reopened pending specification gate |
| 4 | Static sanitation inspection, digest, redaction, review skill, and verdict contract | `node --test tests/advanced-inspect.test.js tests/advanced-verdict.test.js` | 8-12 | Reopened: disablement and bounded remediation missing |
| 5 | Bounded profile and complete recommendation menu | `node --test tests/advanced-recommend.test.js` | 6-9 | Reopened pending specification gate |
| 6 | Typed plan, collision policy, transactional apply, additive graft, lock, rollback, and receipt | `node --test tests/advanced-plan.test.js tests/advanced-apply.test.js tests/advanced-graft.test.js` | 15-22 | Reopened: policy activation/approval artifacts missing |
| 7 | Default-on user-controlled baseline, dispatcher, policy, real history scan, CI command, adoption, upgrade, and uninstall | Baseline/policy/sync/secret/history tests named by Gate 2 | 10-15 | Reopened: obsolete no-toggle baseline and note-only history scan |
| 8 | Host capability degradation, exact enforcement adapters, and semantic drift | Host/semantic/policy tests named by Gate 2 | 8-12 | Reopened: exact contracts and first-wire evidence missing |
| 9 | Real run bindings, scopes, ladder behavior, and failure-centric reports | `node --test tests/advanced-runs.test.js tests/advanced-reports.test.js` | 6-10 | Reopened: no-op/silent bindings remain |
| 10 | Author all frozen service packs and perform semantic MECE review | Catalogue/service tests plus fresh semantic review | 30-50 | **Reopened: 0/115 semantically accepted** |
| 11 | End-to-end host/repository matrix, regression, documentation closeout, and release evidence | Current Gate-2 release commands | 10-15 | Reopened: prior green suite cannot promote |
| 12 | Full host and CI coverage: exact contracts, evidence, first wire, safe CI merge/bootstrap, host-aware graft, and documentation | Host/CI/graft tests plus first-wire records | 6-10 | Reopened: executable release roster unproved |
|  | **Total ROM (as estimated at v0.1)** |  | **115-179** |  |

The prior implementation produced useful catalogue, baseline, host-registry,
and test scaffolding, but the current audit found release-blocking gaps:

- The withdrawn Slice 10/current candidate Slice 11 has 115 directories but no
  semantically accepted service pack.
- Policy authority, exact activation, one-use approvals, per-control
  disablement, and shell/web/MCP enforcement are absent.
- The history “scan” is note-only; remediation and several service bindings are
  no-op or silent rather than observable behavior.
- Host and CI entries lack exact per-axis contracts and cumulative
  documentation/fixture/first-wire proof.
- Existing-CI mutation and absent-CI bootstrap do not yet satisfy the safe,
  explicit-approval contract.

No intermediate implementation or green test run is represented as a supported
Advanced release.

### 5.1 Reopened work inventory

The v0.3 “18-28 days remaining” estimate is withdrawn: it omitted the catalogue
reauthoring, policy/approval system, and required first-wire work. Do not assign
a replacement estimate until the sole technical specification freezes the
ordered slices and verification seams.

| ID | Reopened work package | Required evidence |
|---|---|---|
| R0 | Rewrite, version, trace, independently review, and re-freeze Gate 2 | AT-GATE-1…4 and all 17 previously missing cases have one testable contract; no contradiction or placeholder remains |
| R1 | Reauthor the complete 115-service catalogue | 115/115 fresh-context semantic acceptance plus mechanical inventory, scope, grade, dependency, disposition, and check evidence |
| R2 | Implement sole policy authority, exact-byte digest activation, layered user-presence approval, independent controls/surfaces, truthful status, and fresh re-enable state | AT-BASE-3…6 plus policy activation/adversarial replay tests |
| R3 | Implement clone-local atomic one-use approvals, full action-envelope binding, revocation/status, narrow/category allowances, and consistent shell/web/MCP enforcement | AT-BASE-2, AT-HOST-2, near-match, changed-action, consume-on-dispatch, and MCP-bypass tests |
| R4 | Replace note-only history handling with a configured vetted full-history scanner activation gate | AT-B3 clean/finding/missing-tool/failure/waiver cases; staged floor remains installed |
| R5 | Replace no-op remediation and bindings with bounded real behavior and honest dispositions | AT-B6 and AT-SHAPE-5 across success, stale/no-op, rollback, re-scan, missing/malformed/silent/no-op bindings |
| R6 | Complete the dispatcher and sanitation triggers | AT-B1/B2/B4/B5 with per-control/surface disablement and preserved chained hook |
| R7 | Specify and implement all 19-host per-axis contracts; retire unsupported MCP across every path | AT-HOST-1…5 with per-axis authoritative docs, fixtures/results, first wire, preservation, idempotence, and explicit degradation |
| R8 | Safely integrate verified existing CI and explicitly approved absent-CI bootstrap across all six providers | AT-CI-1…4 with additive merge, byte-preserving failure, least permissions, no secrets, idempotence, reports, and successful first run |
| R9 | Reconcile operator/public documentation and execute the final release gate | Current acceptance suite, first-wire matrix, copy checker, Basic regression, and `npm test` all pass on one source state |

## 6. Acceptance and Definition of Done

The work is complete only when all of the following are true on the final
source state:

1. AT-GATE-1…4 prove one frozen technical authority, complete traceability,
   specification-before-code ordering, and independent semantic review; every
   frozen Gate 1 behavior is executable and green.
2. Every current mechanism decision in the governing design, including the
   2026-07-26 product rulings, is preserved.
3. All 115 catalogue leaves pass inventory/scope checks and fresh-context
   semantic authorship/MECE review; no TODO, generic filler, or repeated
   pseudo-behavior remains.
4. Every advertised executable host/CI axis has its exact technical contract,
   authoritative per-axis documentation, vendor/version/date,
   fixtures/results, and successful first wire. An incomplete advertised axis
   blocks initial release and emits no speculative config; only genuine vendor
   absence degrades explicitly.
5. Malicious, malformed, stale, escaping, oversized, and secret-bearing inputs
   fail closed with redacted diagnostics.
6. Existing user files survive install, failure, upgrade, and uninstall
   according to the ownership contract.
7. Transaction failure leaves no partial activation receipt and restores the
   prior valid state.
8. An empty service selection installs the complete safety baseline enabled by
   default. Every control and enforcement surface can be disabled through an
   exactly activated policy; disabled/unrun status is truthful and re-enable
   requires fresh evidence.
9. `.rig/network-policy.json` solely governs shell, built-in web, and
   network-capable MCP access. Exact activation, layered user presence,
   clone-local atomic one-use approval, revocation, permanent allowances, and
   replay/changed-action rejection pass adversarial tests.
10. Real full-history scan activation, bounded remediation, and honest service
    dispositions/bindings pass their current Gate 1 cases.
11. Legacy Basic behavior and its tests remain green.
12. `node --test tests/advanced-*.test.js`, `npm run test:rig`, and `npm test`
    pass.
13. Required operator and host documentation matches shipped behavior,
    including the host and CI coverage table and its date-stamped volatile
    entries.
14. No required work remains deferred behind an unrecorded assumption,
    placeholder, no-op, silent binding, or routine-pass report.
15. Every host in the supported roster has a resolved disposition on every
    advertised axis. Verified existing CI is integrated additively; absent CI
    is bootstrapped only after explicit approval; unknown/malformed CI remains
    unchanged; every emitted integration is idempotent and first-wire proven.
16. Every hook-verified host mechanically applies the active policy to its
    claimed shell/web/MCP surfaces; each deny names its category and rule,
    exact one-use proceed is unchanged-action-only, legitimate near-matches
    pass, and activated user disablement/allowance takes effect.
17. No user-facing document still describes the pre-catalog product: the three
    READMEs, the canonical agent instruction body and every byte-exact host
    copy, the portability table, and the `docs/advanced/` guides all match
    shipped behavior, and the copy checker is green.

Milestone checks provide provisional acceptance of their work package. Final
acceptance depends on the integrated release gate above. A discovered conflict
with frozen intent is returned to Gate 1 or Gate 2; it is not silently resolved
inside implementation.

## 7. Roles and Responsibilities

### Implementation Team

- implement the smallest correct changes against the existing Basic seams;
- write and maintain the Advanced executable tests and fixtures;
- author the source catalog, grade fragments, slices, schemas, and
  documentation;
- collect verification evidence for host and CI capabilities;
- protect trust boundaries, user-owned files, credentials, and rollback
  behavior;
- keep the acceptance trace current; and
- surface frozen-design conflicts before proceeding.

### Rig Maintainer / Requesting Team

- identify the acceptance authority and approve milestone reviews;
- provide timely clarification only where the frozen artifacts are genuinely
  contradictory;
- review canonical service IDs, service prose, and semantic MECE boundaries;
- provide or authorize access to host/CI documentation and first-wire test
  environments;
- approve any proposed dependency, lockfile, host-support, or release-policy
  change; and
- decide whether a requested change returns to grilling, product design, or a
  later release.

### Specialist Review

Part-time review is expected from:

- a security reviewer for sanitation, redaction, verdict, secret, and
  remediation boundaries;
- a catalog/domain reviewer for the complete service taxonomy and MECE
  boundaries; and
- host/CI maintainers for every capability marked verified.

## 8. Assumptions and Dependencies

This preliminary scope assumes:

- the frozen Gate 1 artifact and governing design remain unchanged;
- the existing Basic materializer is the implementation base and remains
  available for reuse;
- Node.js and the repository's current development/test toolchain remain the
  source-side execution environment;
- no new runtime validation or template dependency is required;
- representative repository and host fixtures can be created without access
  to production credentials or infrastructure;
- official host and CI documentation is available for every surface proposed
  as verified;
- first-wire test environments are available for every advertised executable
  host and CI axis;
- a user-presence approval facility is available wherever policy activation and
  one-use approvals are built, tested, and used: either a verified host-native
  attestation contract or an external signer backed by an OS prompt or hardware
  touch, with its private material outside the repository (governing design
  §7.4). Rig ships no signer and stores no key. Without such a facility,
  AT-BASE-4 and AT-HOST-2 can be demonstrated only against fixtures, and no
  activation path may be advertised as verified;
- catalog conventions may bind to existing target tools, but onboarding will
  not install new engines or edit target dependency/lock files;
- the implementation can emit explicit degradation when a host surface cannot
  be verified;
- service-fragment content can reuse existing Rig skills where the frozen
  service identity matches;
- the vendor documentation cited for each verified host and CI axis remains
  accurate as of its recorded citation date, and the volatile entries are
  re-verified on the recorded cadence by an owner named at Section 12; and
- review turnaround does not exceed the cadence agreed before execution.

An assumption failure may change sequence, estimate, supported-host claims, or
scope. It does not permit weakening the default-deny baseline, user control, or
truthful degradation.

### 8.1 Distribution dependency (unbuilt, ownership unresolved)

This SOW scopes what Rig *does* once installed. It does not scope how Rig
reaches a target repository. That shipping path is specified separately in
[`specs/product-spec.md`](product-spec.md) §5/§9.1 slice S1 — a committed
pinned-source install stub (`rig/install.sh` with `RIG_REPO`/`RIG_REF`), a
retired `publish.yml`, and the first production tag `v5.0.0` — and that slice is
**frozen in design but unimplemented**. As audited 2026-07-26:

- `rig/install.sh` does not exist, so installation still requires a local Rig
  checkout and the "pull from a pinned source" half of the frozen delivery model
  is missing;
- `.github/workflows/publish.yml` still runs `npm publish` on any `v*` tag while
  `package.json` is `"private": true`, so cutting a release tag fails CI;
- the tag series remains the ponytail lineage (latest `v4.8.4`); no `v5.0.0`
  exists.

Consequence: even a fully accepted Advanced build has no user-reachable release
path. Whether S1 is executed inside this engagement or as a separate work order
is an open ownership decision for Section 12; it is recorded here so it cannot
be discovered at release time.

## 9. Out of Scope

The following are excluded:

- a Rig-owned model, model key, daemon, resident process, or independent agent
  runtime;
- a persistent local or remote semantic memory store;
- Tier 3 sandboxing, egress control, DLP, just-in-time credential brokering, or
  immutable telemetry;
- the visual capability-management dashboard;
- ~~repository-wide deprecated-tier terminology refactoring or archival~~ (done
  2026-07-24 under `wiki/sources/superseded/deprecated-tier-taxonomy/`);
- a second installer or replacement of the Basic CLI;
- a YAML/template-engine migration or a new validation dependency;
- installation of testing, security, infrastructure, or MCP engines into a
  target repository during onboarding;
- automatic remediation without proposal-digest approval;
- speculative live-hook or CI adapters, and fabricated repo-scoped MCP files
  for vendors that ship only a user-global surface;
- per-repo MCP materialization inside the host and CI coverage work package;
  that behavior is delivered by the Infrastructure compatibility slice under
  Section 3.10, and the coverage registry records the evidence-backed
  disposition only;
- any change to the Basic renderer host-file map beyond retiring the `pi`
  entry under Section 3.10;
- Cloud Devin as a supported host identity;
- a fifth selectable taxonomy tier, or individually selectable
  sub-capabilities beneath a service;
- destructive migration, deletion of user-owned files, arbitrary shell plans,
  or malformed-config replacement;
- custom service additions beyond the frozen v1 catalog;
- production operations, hosted services, service-level agreements, and
  ongoing support after the acceptance period; and
- legal advice and commercial procurement, pricing, and payment terms.

## 10. Risks and Mitigations

| Risk | Effect | Planned mitigation |
|---|---|---|
| Full catalog authoring volume | Schedule and consistency variance | Pin expected IDs early, prove representative fragments, reuse existing Rig skills, validate shape mechanically, and review semantic boundaries |
| Semantic MECE cannot be proven mechanically | Duplicate or ambiguous service ownership | Combine unique owned-scope checks with authored boundary fixtures and an independent catalog review |
| Host or CI capabilities are undocumented, untested, or change | Reduced live enforcement coverage or blocked initial release | Require cumulative authoritative documentation, fixtures/results, and first-wire evidence per advertised executable axis; incomplete claims block release, while genuine vendor absence degrades explicitly |
| Policy matcher false positives in a host adapter | A legitimate command is blocked or the user disables enforcement wholesale | Name the category/rule, provide exact one-use proceed and narrow permanent allowances, and cover legitimate near-match fixtures per host/surface |
| Vendor surface volatility across 19 hosts and 6 CI providers | A cited path or schema silently stops being correct, so an emitted artifact is ignored or wrong | Date-stamp every citation, flag the known-volatile entries explicitly, re-verify on the recorded cadence, and keep the evidence gate as the promotion condition |
| Transaction and graft edge cases | User-file damage or partial activation | Typed operations, strict parsing, preimage hashes, exclusive lock, rollback tests, and receipt-last activation |
| Hostile harness content or escaping paths | Code execution, secret exposure, or out-of-root access | Byte-only bounded reads, realpath checks, no execution, redaction, digest freshness, and fail-closed verdicts |
| Existing Basic targets have ambiguous ownership | Unsafe adoption or overwrite | Adopt only byte-identical shipped payloads and treat all other content as user-owned |
| Git hooks are clone-local | Team members can miss local enforcement | Commit the dispatcher/checks, preserve chained hooks, and use whole-repository CI as the shared backstop |
| Cross-platform process and hook behavior | Fixture passes but real hosts fail | Keep argv execution shell-free, retain existing platform regressions, and first-wire verified adapters |
| Scope changes after implementation starts | Rework and invalid estimates | Route business changes to Gate 1 and mechanism changes to Gate 2 before resuming execution |

## 11. Change Control

Defect corrections required to satisfy the frozen design and acceptance cases
are included in this scope. The following require written re-scoping and a
revised estimate:

- any Gate 1 business-rule or acceptance change;
- any change to a final mechanism decision in the governing design;
- addition of a family, group, service, selectable grade, host, or CI adapter
  beyond the frozen scope;
- introduction of a Rig runtime, model, key, daemon, memory store, or Tier 3
  safety infrastructure;
- onboarding-time installation of third-party engines or modification of
  target dependency files;
- a requirement to promote an incomplete host surface without its full
  contract/evidence/first-wire gate; or
- acceleration that materially changes staffing, review, or sequencing.

Version 0.2 is the written re-scope for the host and CI adapter additions. It
is a scope and estimate amendment only; it changes no Gate 1 business rule and
no final mechanism decision.

### 11.1 Items ruled on 2026-07-25

All five items v0.2 recorded as open are now scope:

- scan depth is a service, and grade is the extent to which any service is
  implemented (Section 3.2);
- hook-capable hosts receive a hook that mechanically denies the four frozen
  action categories under the active policy, not a hook that only points at the
  rules (Section 3.8);
- the pre-commit harness re-scan is in scope (Sections 3.4 and 3.7);
- re-verification is a standing condition that the user can also run on demand
  (Section 3.8); and
- the `pi` entry is retired from the Basic renderer host-file map
  (Section 3.10).

### 11.2 Product rulings recorded 2026-07-26

These are frozen design inputs, not a second implementation authority. The
re-frozen `spec/technical-spec.md` must own their exact implementation
contracts:

- independent safety-control leaves and enforcement surfaces, plus group/global
  convenience switches;
- one authoritative `.rig/network-policy.json`; `rig.json` remains
  catalogue-only;
- activation bound to SHA-256 of the exact validated policy bytes;
- verified host-native user-presence approval where available, with an external
  user-presence signature fallback;
- clone-local, uncommitted, atomically consumed one-use approval bound to the
  normalized full action envelope;
- no Rig clock expiry: approval remains until use, bound-detail change,
  revocation, or a verified native-host expiry;
- narrow permanent allowances by default, with explicit category-wide/global
  choices; and
- a configured vetted scanner is required for real first-enable history
  scanning; Rig does not silently install one.

## 12. Commercial and Authorization Items

Before this SOW can be treated as a commercial execution commitment, the
parties may record:

- target start date and desired release window;
- approved person-day rates or fixed fee and contingency;
- milestone review and final acceptance windows;
- the initial verified host/CI matrix and first-wire access;
- the user-presence approval facility available for policy activation, and who
  provides it (Section 8);
- whether the unbuilt Tier 1 distribution slice S1 is executed inside this
  engagement or as a separate work order (Section 8.1);
- the window length for the standing host and CI re-verification condition;
- delivery branch and release process; and
- post-acceptance warranty or support terms, if any.

Until applicable commercial items are completed and this document is approved,
the effort and schedule are planning estimates only. Product acceptance does
not require a particular organization size or named-person staffing model; one
maintainer may use separate implementation and review contexts.

## 13. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Requesting owner | TBD | Pending | TBD |
| Technical owner | TBD | Pending | TBD |
| Security/catalog reviewer | TBD | Pending | TBD |
| Delivery owner | TBD | Pending | TBD |

## 14. Revision History

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-07-24 | Initial preliminary scope against the frozen Gate 1 artifact and the governing design. |
| 0.2 | 2026-07-25 | Folded in the host and CI coverage expansion plan (Section 3.8, D12, slice 12, DoD item 13), the Gate 2 mechanism detail v0.1 carried only at outcome level (CLI seams, target artifact set, skill reuse, exact 115-leaf inventory, four-level depth limit), and the Gate 1 decision-history items with execution consequences (host handoff, full sanitation trigger set, hook enforcement, duplicate-placement policy). Recorded five open items in Section 11.1. Total ROM moved from 109-169 to 115-179 person-days. |
| 0.3 | 2026-07-25 | Restructured Section 5 around delivery status and added Section 5.1 remaining work (15-23 person-days). Ruled on all five v0.2 open items: scan depth is a service and grade is the extent of implementation (Section 3.2); hook-capable hosts get mechanical deny patterns rather than a pointer, which corrects the governing design (Section 3.8, DoD item 14); the pre-commit harness re-scan is in scope (Sections 3.4 and 3.7); re-verification is a standing condition that is also runnable on demand (Section 3.8); the `pi` entry is retired from the Basic renderer host-file map (Section 3.10), which supersedes the coverage plan's untouched-host-file-map decision. Added the user-global skills disposition and its advisory note (Section 3.8). |
| 0.4 | 2026-07-26 | Withdrew all prior completion claims after the Gate-1 re-grill; recorded the withdrawn Slice 10/current Gate-2 Slice 11 as 0/115 semantically accepted; made the technical specification the sole implementation authority; added the missing acceptance, policy/activation/approval, real history/remediation/binding, per-axis host evidence/first-wire, and safe CI merge/bootstrap work; recorded the product rulings in Section 11.2. |
| 0.5 | 2026-07-26 | Readiness audit against Gate 1 and the Gate-2 candidate. Added the AT-GATE-2 specification-gate delivery and its ordering ahead of the code tests (Sections 3.1 and 3.10), the four slice-named test files that do not yet exist (Section 3.1), the user-presence approval-facility assumption (Section 8), the unbuilt Tier 1 distribution dependency and its ownership question (Sections 8.1 and 12). No Gate 1 business rule and no governing-design mechanism changed. |
