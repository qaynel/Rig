# Tier 2 Advanced — Build Task List (agent-followable)

> **PAUSED — Gate 2 reopened 2026-07-25; status audited 2026-07-26.**
> Checkbox state records work claimed against the withdrawn Gate 2. Those
> historical claims do not establish completion under the re-grilled Gate 1.
> Affected claims below are explicitly reopened. Do not resume implementation
> or infer release readiness until `spec/technical-spec.md` is amended,
> versioned, specification-reviewed, and re-frozen.
>
> **Authority:** `spec/technical-spec.md` is the sole Gate-2 implementation
> authority once frozen. This task list only schedules work derived from it. If
> a task conflicts with, adds to, or omits that design, the task is invalid; the
> technical specification must be corrected first.
>
> **2026-07-26 audit:** prior `[x]` marks remain visible as the historical
> execution record. All current Slices 1-12 are reopened; catalogue-authoring
> Slice 11 starts at 0/115 semantic acceptance; host/CI coverage and the release
> gate are reopened. Only new checks performed against the re-frozen design may
> establish current completion.
>
> **AWAITING REBUILD — Gate 1 revised 2026-07-26 (D1-D9).** Gate 1 was
> re-grilled after the readiness audit below, and `technical-spec.md` v0.2 is
> superseded. This list is to be **rebuilt off the re-frozen Gate 2**. Its
> Phase 5 host/CI work in particular assumes release blocks on all 19 hosts and
> six providers; under D1/D2 the roster is still fully *built*, but release
> blocks only on the *advertised* subset. Seven new Gate 1 cases
> (`AT-CLAIM-1..3`, `AT-PRESENCE-1`, `AT-HOME-1..2`, `AT-DIST-1`) have no tasks
> anywhere in this list, and `AT-DIST-1` has no phase at all.
>
> **Readiness-audit addendum (2026-07-26).** `npm test` is currently green (223
> Node tests + 15 pi-extension tests). That green is not evidence of anything:
> the specification gate that would give it authority does not exist, so the
> suite passes while 0/115 services are authored, remediation is a no-op, and no
> host axis is verified. Treat the green suite as a regression signal only until
> Phase 2a wires the specification gate ahead of it.

> ## HOW TO USE THIS LIST — READ FIRST
>
> After Gate 2 is re-frozen, follow its ordered slices and use this list to
> record their execution. Do not use the old phase order to bypass a prerequisite
> in the governing design.
>
> As soon as a step passes its named verification on the same source state,
> change `- [ ]` to `- [x]`. A checkbox is progress evidence only; it is never a
> substitute for Gate 1, the governing technical specification, or the release
> gate.
>
> **Gate prerequisites are hard.** The historical phase numbers no longer define
> execution order. Follow the re-frozen technical specification; complete the
> reopened host/CI and documentation work in Phases 5-7 before running the
> terminal Phase 4 release gate. Never advance past a failed prerequisite.
>
> **Expected red window:** the tests you author in Phase 1 and the CI wiring in
> Phase 2 are meant to **fail (red) until Phase 3 implements the code**. That is
> correct — do not "fix" them by weakening the tests. Green happens in Phase 4.

## Non-negotiable guardrails (apply to every step)

- [x] Read and honor these before writing anything:
  - **Do NOT edit** `spec/business-spec.md` / `acceptance.md` or `../archive/grilling/advanced-grilling.md`. They are the
    frozen acceptance oracle. A genuine conflict returns to grilling/product
    design — it is never silently resolved in code.
  - **Sole governing design:** the current frozen
    `spec/technical-spec.md`. `sow.md`, this task list, and
    `spec/host-coverage-spec.md` are subordinate planning/evidence records.
    Gate 1 §7 is the acceptance oracle.
  - **B1 containment:** no Rig model key, no daemon/runtime, no persistent
    memory store. Host agent does semantic work; committed repo files are the
    durable context.
  - **No new runtime/validation/template dependency** (no YAML, no template
    engine). Strict JSON + cumulative fragments only.
  - **Preserve the legacy Basic CLI** (`node rig/materialize.js --target … --manifest …`)
    and keep all existing Basic + Tier 1 tests green throughout.
  - **Safety invariants everywhere:** typed no-clobber grafts, `shell: false`
    argv execution, bounded/byte-only harness reads, redacted evidence,
    fail-closed on uncertainty, atomic apply with rollback.
  - **`npm test` is the full CI gate** and must be green before any push.

---

## Reopen Gate — required before implementation resumes

- [ ] Re-freeze `spec/technical-spec.md` as the sole versioned Gate-2 authority
      after a mechanical authority/traceability check and an independent
      fresh-context semantic review (AT-GATE-1…4).
- [ ] Trace every Gate 1 case to one testable technical contract and executable
      test or, for the semantic catalogue review, a named review artifact.
      Explicitly include the 17 cases absent from the withdrawn Gate 2:
      AT-GATE-1…4, AT-SHAPE-6, AT-BASE-4…6, AT-HOST-1…5, and AT-CI-1…4.
- [ ] Freeze the user-control and policy mechanism selected in the 2026-07-26
      product rulings: independent control leaves and enforcement surfaces;
      `.rig/network-policy.json` as the sole safety policy; SHA-256 over exact
      validated bytes; verified host-native user-presence approval with an
      external user-presence signature fallback; clone-local, atomically
      consumed one-use approvals bound to the normalized full action envelope;
      no Rig-imposed time expiry; revocation/status; delegated policy-edit mode
      that permits proposal authoring but never activation; strict base-prompt
      wording against inferred consent; and narrow-by-default plus explicit
      category-wide permanent allowances.
- [ ] Freeze contracts for real service dispositions/bindings, vetted
      first-enable history scanning, bounded non-no-op remediation, policy
      enforcement across shell/web/network-capable MCP, complete per-axis
      host evidence plus first-wire results, safe existing-CI integration, and
      explicitly approved absent-CI bootstrap.
- [ ] Do not begin the code gate until the specification gate proves the
      technical specification contains no contradiction, placeholder, or
      unresolved mechanism.

---

## Phase 0 — Orientation (read-only)

- [ ] **REOPENED:** Read the current `spec/business-spec.md` and all 38 named
      cases in `acceptance.md`, including the 17 cases added by the re-grill.
- [ ] **REOPENED:** read the re-frozen `spec/technical-spec.md` in full,
      including its current mechanism table, architecture, complete
      traceability, ordered slices, and verification commands.
- [x] Trace the shipped Basic seams named in §2: `rig/materialize.js`,
      `rig/lib/{config,payload,renderers,guard,receipt}.js`, `rig/manifest.json`,
      `scripts/check-rule-copies.js`, `docs/agent-portability.md`. Confirm each
      exists and note its current behavior.
- [x] Confirm the four reference taxonomies exist under `reference/`
      (mutation, product-security, agent-harness playbook, testing-pipeline).

---

## Phase 1 — TEST ARTIFACTS (author first; expected RED until Phase 3)

Transcribe Gate 1 §7 into executable black-box tests **without editing Gate 1**.
Each case in `spec/business-spec.md` / `acceptance.md` §7 maps through the sole
technical specification to primary evidence.

### 1a. Test scaffolding & fixtures (SOW §3.1)

- [x] Add an `tests/` helper module for Advanced (target-repo builder, temp-dir
      sandbox, JSON artifact readers, host fixture factory).
- [x] Create repo fixtures: generic git repo (no host surface); UI-less library
      (for not-recommended E2E override); repo with existing `AGENTS.md`/router
      (for graft/no-clobber); existing Basic target (for adoption).
- [ ] **REOPENED:** extend host fixtures from the prior native-skill/project-rule,
      live-hook candidate, advisory, and generic-git shapes to every exact
      advertised host/CI contract and first-wire harness required by Gate 2.
- [x] Create hostile-input fixtures: malicious `AGENTS.md`, escaping symlink,
      oversized file, credential-bearing staged diff.
- [ ] Add policy/approval fixtures: exact-byte edits, agent self-authorization,
      delegated edit receipts, inferred-consent prompt failures, signature and
      native-attestation paths, replay, changed action envelopes, atomic
      consumption, revocation, disabled/re-enabled controls, shell/web/MCP
      parity, near-matches, and permanent allowance scopes.

### 1b. Acceptance suite (current Gate 1)

- [ ] **REOPENED:** retain the previously authored cases, then transcribe the
      current Gate 1 without weakening its verdicts. The prior suite covered the
      withdrawn 16-case target and is not complete acceptance evidence.
- [ ] Add AT-GATE-1, AT-GATE-2, AT-GATE-3, and AT-GATE-4 specification-gate
      checks, including the independent semantic-review evidence boundary.
- [ ] Add AT-SHAPE-6 catalogue semantic-completeness evidence for all 115 leaves;
      mechanical file/non-empty checks alone must fail.
- [ ] Add AT-BASE-4, AT-BASE-5, and AT-BASE-6 for exact-digest activation,
      complete disablement/truthful status, and fresh evidence after re-enable.
- [ ] Add AT-HOST-1, AT-HOST-2, AT-HOST-3, AT-HOST-4, and AT-HOST-5 for exact
      hook contracts, policy boundaries/one-use proceed, per-axis
      documentation+fixture+first-wire evidence, release blocking, and complete
      retirement of unsupported MCP.
- [ ] Add AT-CI-1, AT-CI-2, AT-CI-3, and AT-CI-4 for additive existing-CI
      integration, approved absent-CI bootstrap, idempotent real execution, and
      visible failure plus first-wire promotion.

### 1c. Per-area test files (reconcile to the re-frozen design)

- [x] `tests/advanced-catalogue.test.js` + `tests/advanced-config.test.js` —
      expected-ID inventory fixture, strict grade growth, scope-map/MECE spot
      checks (perf/load→Testing; secret-injection→Infra; correctness-static≠SAST),
      leaf-only `rig.json` validation, baseline-not-selectable.
- [x] `tests/advanced-resolve.test.js` — named-slice resolution, exact razor-scope,
      selected-grade preserved, ladder bundles, cycle detection, stable ordering.
- [x] `tests/advanced-inspect.test.js` + `tests/advanced-verdict.test.js` —
      bounded byte-only reads, path/symlink rejection, redaction, digests, and
      the `ALLOW / ALLOW_WITH_RESTRICTIONS / QUARANTINE / BLOCK` verdict contract
      (fail-closed → QUARANTINE); `recommend` refuses until review accepted.
- [x] `tests/advanced-recommend.test.js` — complete-menu (every leaf emitted),
      `not_recommended` never `unavailable`, user override wins.
- [x] `tests/advanced-plan.test.js` + `tests/advanced-apply.test.js` +
      `tests/advanced-graft.test.js` — typed ops, collision inventory,
      compare-and-swap preimages, lock, rollback, idempotence, no-clobber graft.
- [ ] **REOPENED:** `tests/advanced-baseline.test.js` + `tests/advanced-sync.test.js` +
      `tests/advanced-secret.test.js` — baseline installs on empty selection;
      per-control disablement; byte-exact copy check; staged-secret block; and a
      real vetted first-enable history scan. A recorded note is a failure.
- [x] `tests/advanced-hosts.test.js` + `tests/advanced-semantic-drift.test.js` —
      capability-registry degradation matrix; stale/deprecated-context drift report.
- [x] `tests/advanced-runs.test.js` + `tests/advanced-reports.test.js` — argv
      `shell:false` execution, diff vs whole-repo scope, ladder fail-fast,
      failure/vacuous/coverage-gap reports, routine passes omitted, redaction.
- [x] `tests/advanced-services.test.js` — full catalogue pack coverage (kept RED
      until Phase 3 authors all service fragments).

**Not yet authored.** The re-frozen design's ordered slices name these five
verification seams, and none of them exists in the repository today. They are
prerequisites for Slices 1 and 3-6, not optional extras:

- [ ] `scripts/check-advanced-spec.js` — the specification gate itself
      (design §12): pins the Gate-1 digests, rejects a second Gate-2 authority,
      compares the 38-ID set against trace rows and executable test titles,
      rejects unresolved mechanism markers and catalogue filler, and validates
      the fresh-context review receipts.
- [ ] `tests/advanced-spec-gate.test.js` — AT-GATE-1…4 (Slice 1).
- [ ] `tests/advanced-policy.test.js` — policy parsing, exact-byte digest,
      activation, user presence, truthful status (Slices 3-5).
- [ ] `tests/advanced-enforcement.test.js` — cross-surface shell/web/MCP
      evaluator, deny/proceed, one-use approval lifecycle (Slices 4, 5, 9).
- [ ] `tests/advanced-remediation.test.js` — bounded read-only proposals, exact
      approved diff, no-op rejection, rollback, fresh re-scan (Slice 6).

### Phase 1 gate

- [x] Run `node --test tests/advanced-acceptance.test.js` — confirm it is **RED**
      for the expected reason (missing catalogue subcommands), not a test bug.
- [x] Confirm existing suites still pass: `npm run test:rig` and the legacy Basic
      tests remain green (Phase 1 must not break shipped behavior).

---

## Phase 2 — CI ARTIFACTS (wire tests + author CI floor artifacts; expected RED/degraded)

Two CIs — keep them distinct: (A) Rig's **own dev CI** that runs the suite above;
(B) the **target-repo CI integration/bootstrap** defined by the current frozen
technical specification.

### 2a. Dev CI (runs this repo's Advanced suite)

- [x] Ensure `tests/advanced-*.test.js` are included in the `npm test` runner path
      (same commands `.github/workflows/test.yml` runs). Do not create a second
      workflow; extend the existing gate.
- [x] Confirm `.github/workflows/test.yml` invokes `npm test` (full gate) so the
      Advanced suite runs in CI automatically. Record the expected RED status.
- [ ] **Wire the specification gate ahead of the code tests (AT-GATE-2).** Add a
      `test:spec` script that runs `node scripts/check-advanced-spec.js`, and
      make `npm test` run it *before* `node --test`, short-circuiting on
      failure. Today `npm test` is `check-rule-copies → check-versions →
      node --test → pi-extension`, with no specification gate at any position,
      so the suite can reach green while Gate 2 is unfrozen — exactly the
      promotion AT-GATE-2 forbids. Ordering is the requirement, not merely
      presence.
      → `npm run test:spec`; then `npm test` on a deliberately unfrozen spec
      fixture must fail before any code test executes.

### 2b. Target-repo CI floor artifacts (installed into onboarded repos)

- [x] Author the `.rig/bin/check.js --scope repo` command **contract + skeleton**
      (baseline checks + selected executable bindings in dependency order). Logic
      is filled in Phase 3; the artifact + its test expectations land now.
- [ ] **REOPENED:** author CI adapters from the re-frozen design: safely parse
      and add to verified existing CI without changing unrelated values; fail
      visibly and unchanged on unknown/malformed input; when CI is absent,
      create a minimal verified provider-native pipeline only after explicit
      user approval.
- [x] Define the `reports/rig/` artifact-upload behavior for CI.
- [ ] **REOPENED:** author the verified-provider list and exact adapter contracts.
      Every executable provider needs its own authoritative documentation,
      fixtures/results, and successful first real CI run. Evidence is
      cumulative; no one evidence kind substitutes for another. Mark an
      incomplete advertised provider `incomplete`, emit no speculative config,
      and block initial release. Only authoritative vendor absence may degrade.

### Phase 2 gate

- [x] `npm test` runs the Advanced suite in the dev CI path (expected RED — code
      not yet implemented).
- [ ] Every emitted CI adapter has complete per-provider documentation,
      fixtures/results, and first-wire evidence. An incomplete advertised
      provider blocks release; genuine vendor absence degrades without
      fabricated config.

---

## Phase 3 — CODE (implement to turn the Phase 1/2 artifacts green)

All 12 slices are reopened under the current Gate 2 candidate. Existing code is
reused only after it passes the revised test; each slice leaves its named check
runnable and keeps prior checks green.

- [ ] **Slice 1 — Specification authority and complete executable oracle.**
      Implement the specification gate, pin Gate-1 digests, transcribe all 38
      IDs into substantive tests, and remove obsolete no-toggle or tautological
      cases without editing Gate 1.
      → `node scripts/check-advanced-spec.js`
      → `node --test tests/advanced-spec-gate.test.js tests/advanced-acceptance.test.js`
- [ ] **Slice 2 — Catalogue disposition and authored-content gate.** Add
      executable/convention/surfaceless metadata, real evidence targets,
      exact inventory counts, anti-filler/duplicate checks, and the
      exact-digest per-leaf semantic-review schema. Keep unauthored leaves red.
      → `node --test tests/advanced-catalogue.test.js tests/advanced-services.test.js`
- [ ] **Slice 3 — Policy parsing, active bundle, and truthful status.**
      Implement strict bounded parsing, exact-byte digest, safe default,
      candidate/active separation, trust/active-bundle validation, independent
      switches, evidence generations, and status. `rig.json` stays
      catalogue-only.
      → `node --test tests/advanced-policy.test.js tests/advanced-config.test.js`
- [ ] **Slice 4 — User-presence and one-use approval lifecycle.** Implement the
      verified host-native-first/external-signature fallback, common receipts,
      bootstrap/rotation/recovery, clone/worktree-local storage, full action
      normalization, exclusive consumption, list/revoke, and native expiry.
      Repository or TTY self-authorization remains impossible.
      → `node --test tests/advanced-policy.test.js tests/advanced-enforcement.test.js`
- [ ] **Slice 5 — Cross-surface evaluator and policy-aware onboarding.**
      Implement one evaluator with representative verified shell/web/MCP
      adapters, denial/proceed payloads, narrow/category permanent choices,
      separately evaluated preferred-MCP routing, default sanitation order,
      approved sanitation disablement, and truthful gaps.
      → `node --test tests/advanced-enforcement.test.js tests/advanced-policy.test.js tests/advanced-recommend.test.js`
- [ ] **Slice 6 — Real sanitation remediation and policy-aware transaction.**
      Extend plan/apply with exact plan approval, policy/adapter and control
      wiring, read-only remediation proposals, preimage CAS, no-op rejection,
      observed-diff equality, rollback, and fresh sanitation.
      → `node --test tests/advanced-plan.test.js tests/advanced-apply.test.js tests/advanced-graft.test.js tests/advanced-remediation.test.js`
- [ ] **Slice 7 — Policy-aware git/CI controls and evidence epochs.** Run
      changed-harness sanitation, exact-copy, deterministic secrets, selected
      Product-Security checks, and the preserved user hook in the governed
      order only when their control/surface is enabled. Re-enable requires
      fresh evidence.
      → `node --test tests/advanced-baseline.test.js tests/advanced-sync.test.js tests/advanced-secret.test.js tests/advanced-verdict.test.js`
- [ ] **Slice 8 — Honest service runner and real history activation.** Use one
      selected-service runner for source/target CI; reject missing, malformed,
      silent, or no-op bindings; verify convention state; permit vacuity only
      for declared surfaceless predicates; require a vetted external scanner
      and real full-history result or exact-finding waiver.
      → `node --test tests/advanced-runs.test.js tests/advanced-reports.test.js tests/advanced-secret.test.js`
- [ ] **Slice 9 — Exact host-axis contracts and first wires.** Author every
      advertised host-axis contract and axis-local official evidence, implement
      only verified adapters, capture real first wires, cover legitimate
      near-matches, and retire unsupported `pi` MCP across legacy/catalogue
      paths.
      → `node --test tests/advanced-hosts.test.js tests/advanced-enforcement.test.js tests/basic-renderers.test.js`
- [ ] **Slice 10 — Safe six-provider CI integration and bootstrap.** Author
      exact provider contracts/evidence, additive existing-config adapters,
      collision refusal, explicit absent-CI provider selection and plan
      approval, least-privilege/no-secret pipelines, report upload,
      idempotence, and real first-run receipts.
      → `node --test tests/advanced-ci-floor.test.js tests/advanced-apply.test.js`
- [ ] **Slice 11 — Author all 115 service packs.** Current semantic acceptance
      is **0/115**: 108 services retain `TODO(Slice 10)` in all four fragments
      (432 files); the remaining seven use forbidden generic “Concrete
      convention” filler; repeated slice/check filler is not service-specific
      behavior. Author every required field and outcome across all families:
  - [ ] Development family (26 leaves) service packs semantically accepted.
  - [ ] Testing family (40 leaves, including Mutation) service packs semantically accepted.
  - [ ] Infrastructure family (31 leaves) service packs semantically accepted.
  - [ ] Product-Security family (18 leaves) service packs semantically accepted.
  - [ ] Reuse existing Rig skills where identity matches (feature impl,
        debugging, product design, TDD, code review); reuse Basic MCP
        implementation via the Infrastructure compatibility slice.
  - [ ] Record a fresh-context semantic review of all 115 leaves; expected-ID,
        scope-map, and `advanced-services.test.js` are supporting evidence only.
      → `node --test tests/advanced-catalogue.test.js tests/advanced-services.test.js`
      → `node scripts/check-advanced-spec.js`
- [ ] **Slice 12 — Complete matrix, fresh specification review, and regression.**
      Run every frozen case over the full representative matrix, including
      host/CI first wires, disabled/re-enabled policy, concurrency/replay,
      remediation rollback, scanner failures, and failing/vacuous/gapped
      services. A clean fresh-context exact-digest review receipt is required
      before Gate 2 may be marked frozen.
      → `node scripts/check-advanced-spec.js`
      → `node --test tests/advanced-*.test.js`
      → `npm run test:rig`
      → `npm test`

---

## Phase 4 — TERMINAL INTEGRATED RELEASE GATE (run after Phases 5-7)

- [ ] **REOPENED:** `node --test tests/advanced-*.test.js` — current Gate 1 suite is GREEN.
- [ ] **REOPENED:** `npm run test:rig` — bootstrap subset green on the accepted source state.
- [ ] **REOPENED:** `npm test` — full CI gate green (rule copies, versions, Node suite,
      pi-extension tests).
- [ ] **REOPENED:** run the end-to-end matrix from the re-frozen design over representative
      repo/host fixtures: malicious harness, UI-less library override,
      dependency-slice case, hook/non-hook hosts, failing/vacuous testing
      services, every verified executable host axis, and every CI provider.

### Release gate — Definition of Done (SOW §6; do not ship until all checked)

- [ ] Every frozen Gate 1 gate/archetype/baseline/property/bespoke/host/CI case is executable
      and green.
- [ ] Every current mechanism decision in the re-frozen technical specification is preserved.
- [ ] Complete catalogue inventory + scope-map checks and 115-leaf semantic review pass.
- [ ] Every emitted live-hook/CI adapter has authoritative documentation,
      fixtures/results, and first-wire evidence. An incomplete advertised axis
      blocks release; genuine vendor absence degrades explicitly.
- [ ] Malicious/malformed/stale/escaping/oversized/secret inputs fail closed with
      redacted diagnostics.
- [ ] User files survive install/failure/upgrade/uninstall per the ownership
      contract; transaction failure leaves no partial receipt.
- [ ] Empty service selection installs the complete baseline enabled by default;
      activated disablement is effective and truthfully reported.
- [ ] Policy activation, one-use approval, revocation, re-enable freshness, and
      shell/web/MCP enforcement cases pass.
- [ ] Real history scan, bounded remediation, and real binding/disposition cases pass.
- [ ] Existing-CI integration and approved absent-CI bootstrap pass first wire.
- [ ] Legacy Basic behavior + tests remain green.
- [ ] Required operator/host documentation matches shipped behavior.
- [ ] No work remains deferred behind an unrecorded assumption, placeholder,
      no-op, or routine-pass report.

> When every box above is `- [x]`, the Advanced build is complete and ready for
> the release decision. Do not mark done on an unrun or red suite.

> **This gate is acceptance, not shipping.** It proves the build is correct; it
> does not put the build in anyone's hands. The distribution path — the pinned
> `rig/install.sh` stub, the retired `publish.yml`, and the `v5.0.0` tag — is
> specified in `spec/product-spec.md` §5/§9.1 slice S1 and is **unimplemented**
> (`sow.md` §8.1). Ownership of S1 is an open decision. Do not read a green
> Phase 4 as "deployed".

---

## Phase 5 — HOST & CI COVERAGE (REOPENED)

This is the detailed execution checklist for current Gate-2 Slices 9 and 10,
not a later independent phase. Complete it before checking either slice.

Widen coverage from 4 hosts / 1 CI provider to the full `SUPPORTED_HOSTS` union,
using the two persisted evidence reports under `reference/`
(`host-ci-capability-verification.raw.md`, `host-config-surfaces-verification.raw.md`).
`spec/host-coverage-spec.md` is the subordinate evidence/work inventory; the
re-frozen `spec/technical-spec.md` must own every exact contract. No executable
axis is release-verified without its own authoritative documentation,
fixtures/results, and successful first wire.

### 5a. Registry + adapters (code)

- [ ] **REOPENED — Slice A, capability registry.** Preserve the prior 19-host
      instruction/native-skill/live-hook/MCP surface and disposition work,
      including the pi/cursor discovery reversals. Do not promote any
      executable axis until `rig/lib/host-capabilities.js` records the exact
      contract and complete per-axis evidence.
- [ ] **REOPENED — Slice B, live-hook adapters.** Replace note/marker-only
      adapters with each verified host's exact emitted file, vendor schema and
      fields, matcher mapping, deny/exit behavior, one-use proceed protocol,
      owned merge boundary, preservation rules, and first/repeated-apply
      behavior. Prove default-deny enforcement and near-match allowance on
      shell, web, and network-capable MCP surfaces the host exposes.
- [ ] **REOPENED — Slice C, MCP disposition.** Retire every unsupported MCP
      output, including `pi`, across legacy and catalogue paths. Preserve
      user-owned legacy files and emit migration guidance. For supported MCP,
      prove it obeys the same policy and cannot bypass enforcement.
- [ ] **Slice D — CI provider adapters.** Safely integrate each verified
      provider into an existing configuration, preserving unrelated jobs and
      values. When no CI exists, create a minimal provider-native pipeline only
      after the user selects the provider and explicitly approves creation.
      Every emitted adapter runs enabled controls/services, uploads actionable
      `reports/rig/`, requests no unnecessary permissions or repository secrets,
      is idempotent, and remains unverified until first wire succeeds.
- [ ] **Slice E — Instruction-graft targets.** `apply.js` host-aware pointer using
      `surfaces.instruction` (append never-clobber, AT-SHAPE-1); advisory-/
      unsupported-MCP hosts get a one-line MCP note.

### 5b. Acceptance tests (executable AT-P4 for the full roster — see plan §5a)

- [ ] **REOPENED:** replace the narrower AC-HOST checks with executable
      AT-HOST-1…5 and AT-BASE-2 coverage. Registry shape and citations alone do
      not prove an executable adapter.
- [ ] Add executable AT-CI-1…4 for additive existing-CI integration, approved
      absent-CI bootstrap, safe/idempotent real execution, visible failure on
      unknown config, and first-wire promotion.
- [ ] AC-INSTR-1 host-native pointer, never clobber — `tests/advanced-graft.test.js`.

### 5c. Docs + gate

- [ ] Update `docs/advanced/operator.md` host/CI coverage table to shipped
      behavior; date-stamp volatile entries (SOW §3.10 D10).
- [ ] Confirm this subordinate plan traces exactly to the re-frozen
      `spec/technical-spec.md`; do not use this plan to amend or override it.
- [ ] `npm test` — full CI gate green before push (no red/unrun suite).

---

## Phase 6 — RETAINED COVERAGE WORK (REOPENED)

Work packages opened by the SOW v0.3 rulings remain useful inputs, but their
old IDs and completion assumptions are superseded by the current
`sow.md` §5.1 inventory and the re-frozen technical specification. Execute each
item within its owning current slice (primarily Slices 7 and 9), not after
Slice 12.

- [ ] **Pre-commit dispatcher expansion.** The installed hook currently
      runs the secret guard then the chained hook. Add the exact-copy check, the
      harness re-scan over changed harness files (GA-3c), and the selected
      Product-Security checks, in that order, still preserving the user's
      chained hook. → `node --test tests/advanced-baseline.test.js
      tests/advanced-secret.test.js tests/advanced-sync.test.js`
- [ ] **User-global skills disposition.** Add `user_global` to the skills
      axis and emit the advisory note pointing at the host's user-global skills
      path; keep `absent` only for hosts with no skills surface at all. Affects
      hermes and codewhale. → `node --test tests/advanced-hosts.test.js`
- [ ] **Standing re-verification.** Record verified-on dates and re-verify
      windows per registry entry, report entries past their window as stale, and
      add the on-demand command so the user can run the same check. No network
      access; staleness is computed from recorded dates only.
      → `node --test tests/advanced-hosts.test.js`
- [ ] **Retire `pi` MCP from Basic.** Remove the `pi` entry from
      `HOST_FILES` and its renderer in `rig/lib/renderers.js`, update
      `tests/basic-renderers.test.js`, and document the path for targets that
      already hold `.omp/mcp.json`. The coverage plan now records the same
      cross-path retirement requirement.
      → `node --test tests/basic-renderers.test.js`; `npm test`
- [ ] **Policy-backed host enforcement.** Replace the additive marker with
      the exact host adapter prescribed by the re-frozen technical
      specification. The default policy mechanically denies the frozen action
      categories on every verified shell/web/network-capable MCP surface. Every
      deny names its category and rule; legitimate near-matches pass; an exact
      clone-local one-use approval permits only the unchanged normalized action
      once; activated permanent policy choices take precedence. Add per-host
      contract, preservation, repeated-apply, and first-wire fixtures.
      → `node --test tests/advanced-hosts.test.js tests/advanced-acceptance.test.js`

---

## Phase 7 — USER-FACING DOCUMENTATION (SOW §3.10, D13, §5.1 R9)

This documentation closes current Slice 12 and must be complete before its
fresh review/regression receipt.

The target system is the default-on, user-controlled baseline plus the
four-family catalogue.
The user-facing docs still describe the pre-catalogue product. Bring them to
shipped behavior; do not describe anything not yet green.

- [ ] **Canonical agent instruction body.** Update `AGENTS.md` to describe the
      baseline + catalogue system, policy activation/disablement, the staged
      onboarding flow, and what verified enforcement surfaces deny. Then
      regenerate every byte-exact copy: `.cursor/rules/rig.mdc`,
      `.windsurf/rules/rig.md`, `.clinerules/rig.md`, `.agents/rules/rig.md`,
      `.github/copilot-instructions.md`, `.kiro/steering/rig.md`, `GEMINI.md`.
      → `node scripts/check-rule-copies.js`
- [ ] **Public READMEs.** Update `README.md` with the catalogue system, the
      grade dial, the default-on user-controlled baseline, and the host coverage
      summary. Mirror
      the same changes into `README.es.md` and `README.ko.md` so the three stay
      consistent.
- [ ] **Host portability table.** Reconcile `docs/agent-portability.md` with the
      capability registry: instruction, skills, live hook, and MCP disposition
      per host, matching what the registry actually records.
- [ ] **Operator guides.** Update `docs/advanced/operator.md` (staged workflow,
      `rig.json`, lock recovery, adoption, upgrade, uninstall, the host/CI
      coverage table with date-stamped volatile entries) and
      `docs/advanced/ci-floor.md` (all six provider dispositions and verified
      contracts).
- [ ] **Stale references.** Remove or redirect any remaining user-facing
      reference to a deprecated tier package. The `project-dev-docs` paths were
      already rewritten during the 2026-07-25 reorganization; this box covers
      product prose, not doc paths.
- [ ] `npm test` — full CI gate green, including the copy checker.
