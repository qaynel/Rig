# Decision index

Every ruling this project has made, across four ID schemes, in one place.

| Scheme | Count | What it is | Defined in |
|---|---|---|---|
| `G#` | 16 | Foundational grilling — what Rig is and how it is built. | [`sources/logs/grill-decisions.md`](../sources/logs/grill-decisions.md) |
| `GA-#` | 86 | Advanced grilling — the business intent behind Gate 1. | [`sources/logs/advanced-grilling.md`](../sources/logs/advanced-grilling.md), later intent-owner traces |
| `D#` | 24 | Gate 1 revisions — rulings that changed owner-approved intent. All 24 have landed; D24 awaits the combined oracle signature. | [`gate1/business-spec.md`](../gate1/business-spec.md) |
| `AD-#` | 36 | Gate 2 mechanisms — working implementation constraints. | [`gate2/technical-spec.md`](../gate2/technical-spec.md) §2 |

The relationship: a `GA-` ruling is the conversation, the matching `D#` is what
that ruling did to frozen intent, and an `AD-#` is the mechanism Gate 2 built to
satisfy it. Not every ID has counterparts in the other schemes.

---

## Workflow-doctrine rulings

Rulings about the development cycle itself, distinct from the four catalogue
schemes above. They change the router and skills, not the frozen catalogue
intent.

| Date | Ruling | Source |
|---|---|---|
| 2026-08-21 | **Collapse the two gates into one.** One signed freeze locks the oracle (intent, acceptance, tests) before code; the technical spec is checked for presence, not frozen. Enforced by human signature before code plus oracle immutability, not by independent authorship. | [intent](../reasoning/2026-08-21-one-gate-streamlining-intent.md) |
| 2026-08-21 | **Escape hatch = key-holder instant re-sign (Option A).** A wrong locked test is corrected only by the key holder as a quick re-sign; an agent may propose but never make the change. Rejected Option B (full return to grilling). | [escape hatch](../reasoning/2026-08-21-one-gate-escape-hatch-resolved.md) |

---

## Product-integration rulings

Owner decisions that resolve a delivery integration without changing the
frozen business oracle or claiming a new numbered architecture decision.

| Date | Ruling | Source |
|---|---|---|
| 2026-08-24 | **Antigravity MCP is first-class manual setup for beta.** Onboarding emits exact selected-server JSON plus a verification command; Rig does not write the user-global file while upstream CLI issue #60 remains open. | [RIG-105](../tickets/RIG-105.md), [host contract](../specs/host-coverage-spec.md#321-rig-mcp-server-coverage-rig-101) |
| 2026-08-24 | **Spec-driven development folds into the existing phase owners.** Requests route through grilling's five executable-spec checkpoints and product design's code-grounded technical interrogation; no separate skill or graft is added. | [RIG-119](../tickets/RIG-119.md), [working conventions](../topics/agent-working-conventions.md) |

---

## `D#` — Gate 1 revisions

These changed frozen business intent. Each is marked at its point of effect in
both Gate 1 files.

| ID | Date | Ruling | Topic |
|---|---|---|---|
| D1 | 2026-07-26 | Rig builds and emits for the whole roster. *Unwound 2026-08-17.* | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| D2 | 2026-07-26 | Rig claims only what it has first-wired. *Unwound 2026-08-17.* | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| D3 | 2026-07-26 | An unverified axis says so and does not ask. *Unwound 2026-08-17.* | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| D4 | 2026-07-26 | Executable behavior is the default disposition; convention-only is a fallback needing a named reason. | [services and reports](../topics/services-and-reports.md) |
| D5 | 2026-07-26 | Gate 1 protected by repository process. **Withdrawn same day by D10.** | [Gate 1 signing](../topics/gate1-signing.md) |
| D6 | 2026-07-26 | Approval is never silently skipped; no presence facility means refusal. | [user-presence approvals](../topics/user-presence-approvals.md) |
| D7 | 2026-07-26 | The delivery path is in scope. A product a stranger cannot install is not shipped. | [distribution and release](../topics/distribution-and-release.md) |
| D8 | 2026-07-26 | Review is independent by construction. *Corrected 2026-08-19 by GA-13.* | [review receipts](../topics/review-receipts.md) |
| D9 | 2026-07-26 | Writes outside the repository are permitted, attributed, and never destructive. | [user-global writes](../topics/user-global-writes.md) |
| D10 | 2026-07-26 | Gate 1 integrity is cryptographic, not procedural. Replaces D5. | [Gate 1 signing](../topics/gate1-signing.md) |
| D11 | 2026-07-28 | Removal is part of the product. Managed blocks, install manifest, preimages. | [install manifest and removal](../topics/install-manifest-removal.md) |
| D12 | 2026-07-28 | Delegated policy-edit mode is session-scoped and never persisted. | [the policy model](../topics/policy-model.md) |
| D13 | 2026-07-28 | Self-activation is a product rule, not a policy clause. No invariant tier. | [the policy model](../topics/policy-model.md) |
| D14 | 2026-07-28 | An interrupted install resumes; a partial install claims nothing. | [install manifest and removal](../topics/install-manifest-removal.md) |
| D15 | 2026-07-28 | Findings stay on the machine that produced them. No artifacts, no log detail. | [services and reports](../topics/services-and-reports.md) |
| D16 | 2026-07-28 | Matched secret content does not reach the model by default. | [drift and secret controls](../topics/drift-and-secret-controls.md) |
| D17 | 2026-07-28 | The gate is armed by the signer identity. A missing signature fails. | [Gate 1 signing](../topics/gate1-signing.md) |
| D18 | 2026-07-28 | Version migration is out of scope, recorded deliberately. | [distribution and release](../topics/distribution-and-release.md) |
| D19 | 2026-08-13 | The presence floor is a property of the key, attested by the owner — not a claim about the artifact. | [Gate 1 signing](../topics/gate1-signing.md) |
| D20 | 2026-08-19 | A lost policy signer has one authorised recovery path, and it terminates. | [policy-signer recovery](../topics/policy-signer-recovery.md) |
| D21 | 2026-08-21 | Lint-format ships first, alone, as the release-blocking leaf; the other 114 remain commitments but do not block this release. Adds `AT-LF-1`–`AT-LF-19`, 49→68. | [the delivery plan](../topics/delivery-plan.md) |
| D22 | 2026-08-21 | CI runs selected executable services only when they are repo-CI-applicable at their active grade; lint-format remains CI-enforced only at Evidence. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| D23 | 2026-08-21 | One-release exception: `AT-SHAPE-6` evaluates only `development.code-quality.lint-format` for this release; the other 114 leaves are excluded from this pass, unchanged. Named and dated, not a standing rule — reverts next release absent a further amendment. | [the authored-service gate](../topics/authored-service-gate.md) |
| D24 | 2026-08-21 | **Owner-approved, landed in both Gate 1 files, and signed — the oracle is armed.** The MVP is built in one pass at agent discretion: all 115 leaves at Policy grade, all 55 physically vendored skills wired, detected-host-only onboarding, and named-tag `5.0.0` distribution. Each fragment declares its grade and untailored baseline status. Suspends locked decision 8 for this release, preserves the safety floor, supersedes D21's single-leaf boundary, and retires D23. The modified partial vendored suite may ship under MIT with notice/provenance and no endorsement claim. | [the MVP roadmap](../specs/mvp-roadmap.md) |

| D25 | 2026-08-24 | Business intent is highly recommended and surfaced through every host, but **optional** — technical specs alone may ship a fast feature. The gate still requires acceptance + tests (locked) and a present technical spec. | [the gate](../topics/the-two-gates.md) |
| D26 | 2026-08-24 | **One lock**, not many: it locks tests and acceptance together; only the owner changes a locked expectation, through the hardware key. The lock exists to stop an agent moving its own goalpost. | [the gate](../topics/the-two-gates.md) |
| D27 | 2026-08-24 | Nothing locks until solution + acceptance + tests are all in place and the owner agrees. "Not yet frozen" is the normal default for in-progress design, never a pending "freeze now?" decision — this is why RIG-112 was a mis-raised question. | [the gate](../topics/the-two-gates.md), [catalogue contract](../topics/catalogue-contract.md) |

**The D5 → D10 → D17 → D19 sequence** is the most-revised thread in the project:
four revisions to arrive at one honest, implementable statement of how Gate 1
protects itself. Read it in order — each one corrects a specific failure in the
one before, and [Gate 1 signing](../topics/gate1-signing.md) tells that story.

---

## `AD-#` — Gate 2 frozen mechanisms

Implementation constraints, not suggestions.

| ID | Mechanism | Topic |
|---|---|---|
| AD-1 | Extend `rig/materialize.js` and `rig/lib/*`; preserve the legacy Basic CLI. | [the delivery plan](../topics/delivery-plan.md) |
| AD-2 | Catalogue choices in committed leaf-only `rig.json`; safety choices in separate `.rig/network-policy.json`. | [the policy model](../topics/policy-model.md) |
| AD-3 | Source-owned service metadata in `rig/catalog.json`, fragments under `rig/catalog/`. | [catalogue contract](../topics/catalogue-contract.md) |
| AD-4 | Grades compose cumulatively with strictly growing check-ID sets. | [catalogue contract](../topics/catalogue-contract.md) |
| AD-5 | Dependencies resolve as named slices; never replace or raise a user grade. | [catalogue contract](../topics/catalogue-contract.md) |
| AD-6 | Default flow `inspect → host review → recommend → plan → apply → check`. | [onboarding flow](../topics/onboarding-flow.md) |
| AD-7 | Treat target harness files as hostile bytes: bounded reads, no execution, redacted evidence. | [sanitation and remediation](../topics/sanitation-and-remediation.md) |
| AD-8 | Remediation separate and read-only until exact approval. Its rollback uses explicit remediation journal states so restored writes cannot poison install resume or uninstall. *(Clarified in Gate 2 v0.11.)* | [sanitation and remediation](../topics/sanitation-and-remediation.md) |
| AD-9 | Graft through typed operations; never arbitrary shell plans. | [graft mechanics](../topics/graft-mechanics.md) |
| AD-10 | Apply under exclusive lock with CAS preimages, the §7.6 manifest recording every write, and receipt last; no rollback branch — a failed apply resumes. *(Amended 2026-08-20: dropped rollback, resolving the round-3 `AT-INSTALL-1` blocker.)* | [install manifest and removal](../topics/install-manifest-removal.md) |
| AD-11 | Materialize service prose once under `.rig/services/`; host surfaces get pointers. | [graft mechanics](../topics/graft-mechanics.md) |
| AD-12 | Ship dormant implementations; wire only what the active policy enables. Installed code is not evidence a control ran. | [the safety baseline](../topics/safety-baseline.md) |
| AD-13 | One uniform adapter path; auto onboarding emits only unambiguously detected hosts, with explicit opt-in as the absent-host override. No tier in output or data. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-14 | Emit the complete menu; recommendations advisory, user selections win. | [onboarding flow](../topics/onboarding-flow.md) |
| AD-15 | Attempt every service as executable first. `convention` needs a service-specific reason. | [services and reports](../topics/services-and-reports.md) |
| AD-16 | Write failed, vacuous, gap, disabled, pending, and stale state. Omit routine passes. | [services and reports](../topics/services-and-reports.md) |
| AD-17 | Reuse Basic's MCP renderers only for evidence-backed paths; retire unsupported MCP. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-18 | Drive implementation from the complete signed executable transcription of Gate 1; the oracle verifier runs first. | [the specification gate](../topics/specification-gate.md) |
| AD-19 | Validate policy bytes strictly, hash exact bytes, keep last activated as immutable snapshot. Delegation never persisted. | [the policy model](../topics/policy-model.md) |
| AD-20 | Host-native presence preferred, external SSHSIG fallback, refusal third. No third path. | [user-presence approvals](../topics/user-presence-approvals.md) |
| AD-21 | One-use approvals clone-local, bound to the full action, consumed atomically. No Rig clock. | [one-use approvals](../topics/one-use-approvals.md) |
| AD-22 | One normalized action policy across shell, web, and MCP adapters. | [the action evaluator](../topics/action-evaluator.md) |
| AD-23 | Integrate verified CI additively; absent CI needs explicit provider choice and plan approval. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-24 | Every selected roster axis and all 115 Policy leaves are MVP release commitments; absent/unselected hosts and evidence-backed unsupported axes emit nothing with explicit provenance. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-25 | User-global writes append or namespace-merge only, attributed from the first install. | [user-global writes](../topics/user-global-writes.md) |
| AD-26 | Disclose the out-of-repository blast radius at install time. No per-host claim string. *(Amended 2026-08-21: "verified enforcement surface" is a distinct third sense of `verified`, disambiguated in §1/§11.1.)* | [user-global writes](../topics/user-global-writes.md), [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-27 | Install stub fetches a released tag by name. No fingerprint. Never pipe network to shell. | [distribution and release](../topics/distribution-and-release.md) |
| AD-28 | Verify the v2 signature over both Gate 1 files plus the testing-infrastructure manifest, then every manifested file, first in `npm test`. | [the specification gate](../topics/specification-gate.md) |
| AD-29 | Review receipts produced by a wrapper that writes the digest and timestamp itself. | [review receipts](../topics/review-receipts.md) |
| AD-30 | Recovery only through pre-registered distinct `sk-*` identities under `rig-policy-recovery`. *(Amended 2026-08-21: the `sk-*` class is declared and disclosed, not certified from the signature (D19); tests cover enforceable registration/receipt/disclosure rules, not a hardware-touch claim; v0.11 refuses registration where user verification cannot be requested.)* | [policy-signer recovery](../topics/policy-signer-recovery.md) |
| AD-31 | D24 ships all 115 leaves broadly at declared Policy grade; one-leaf sequencing returns for post-beta promotion. Lint-format alone retains higher-grade evidence. | [the delivery plan](../topics/delivery-plan.md) |
| AD-32 | Policy → Context → Evidence are the `minimal/mid/maximal` grade names for lint-format; the selected grade is the target and the ceiling. A lower-grade *failure* may short-circuit, but a clean lower-grade pass runs through to the selected grade; Evidence rests on local rerunnable evidence while its separately approved CI graft is an enforcement surface, not a prerequisite that makes the grade unreachable. *(Short-circuit clarified in v0.7; CI separation in v0.11.)* | [catalogue contract](../topics/catalogue-contract.md), [the catalogue](../topics/the-catalogue.md) |
| AD-33 | Lint-format's unit of work is a repository component: whole-repository open-ecosystem discovery, semantic binding, hybrid-plus, user-approved partial coverage, per-component evidence-backed support. | [the catalogue](../topics/the-catalogue.md) |
| AD-34 | Lint-format execution is plan-bound and read-only: nothing on selection, mutation detected and halted without auto-restore, autofix separately approved, drift halts, every abnormal ending its own non-passing state. | [the catalogue](../topics/the-catalogue.md), [services and reports](../topics/services-and-reports.md) |
| AD-35 | Enabling model-assisted secret triage requires plan-time third-party disclosure and exact disclosure-bound approval. | [drift and secret controls](../topics/drift-and-secret-controls.md) |
| AD-36 | Fresh release review evidence binds the exact PR implementation worktree and base, not only its specification. | [review receipts](../topics/review-receipts.md) |
| AD-37 | A default `rig/bootstrap.sh` install is markdown-only end to end: per-skill code and the `.rig/plumbing` tree are gated behind the existing `active_delivery` (`--with-runtime`) flag, same as the runtime engine; `.tmpl` build inputs and `TODOS-format.md` are dropped in both modes. All 55 `SKILL.md` files still land unconditionally — only their code backing is gated. | [distribution and release](../topics/distribution-and-release.md), [the catalogue](../topics/the-catalogue.md) |
| AD-38 | OpenClaw global MCP installation is an explicit `--openclaw-mcp` choice, uses the native CLI, has per-clone server ownership, and removes the global entry before its runtime. The default install does neither an OpenClaw nor an npm operation. | [user-global writes](../topics/user-global-writes.md), [host and CI coverage](../topics/host-and-ci-coverage.md) |

---

## `GA-#` — Advanced grilling

The business-intent conversation. Sub-lettered IDs are sub-rulings of their
parent.

### Scope and identity

| ID | Ruling |
|---|---|
| GA-1 | Tier 2 Advanced = capabilities B + C + D, host-agnostic, plus per-host install docs. Cap A (local-model runtime) and the memory store go to Tier 3. |
| GA-2 | Brain fork locked to **B1** — config / host-brain. No Rig runtime, no model key. |

### Capability B — harness security

| ID | Ruling |
|---|---|
| GA-3 | The vetter is layered: deterministic static floor plus host-agent judgment. Threat model is all of injection, dangerous-action directives, and guardrail-disabling. |
| GA-3b | Tier 2 B = static inspection (all hosts) + hook-based runtime enforcement (hook-capable hosts). Semantic judgment and isolation infrastructure stay Tier 3. |
| GA-3c | Trigger is adopt/install + on-demand + pre-commit on changed harness files. Floor BLOCKs unambiguous, judgment QUARANTINEs uncertain, fail-closed to QUARANTINE. |

### Capabilities C + D — behavior testing

| ID | Ruling |
|---|---|
| GA-4 | C and D fused into one behavior-testing capability. Rig ships the general convention and a language-agnostic template, not a fixed stack. |
| GA-4a | Re-tier into three Tier-2 sub-levels rather than reopening shipped Basic. *Superseded by GA-9.* |
| GA-4b | Sub-levels are cumulative. *Survives only as cumulative grades within one capability.* |
| GA-4c | Run scope is per-service: diff-scoped in development, whole-repo at the CI gate. |
| GA-4d | `reports/` is failure-centric but complete on what matters. Vacuous runs are kept; routine passes omitted. |
| GA-5 | Folded into GA-4. |

### Delivery model — the à-la-carte revamp

| ID | Ruling |
|---|---|
| GA-6 | "Highly customizable" resolves to the family/group/service/grade dial; the user overrides freely, including installing non-recommended services. |
| GA-7 | Enforcement is three-way tiered: git/CI floors host-agnostic, live tool-boundary enforcement on hook-capable hosts, semantic layers riding the host brain. |
| GA-8 | Gate 1 acceptance is authored at property/archetype level, not as 100+ bespoke behaviors. |
| GA-9 | **The delivery-model revamp.** The fixed tier stack dissolves into a two-axis à-la-carte catalogue driven by a repo-scan recommendation lens. |
| GA-9a | Cross-capability dependencies auto-pull, razor-scoped to the dependent's exact need. Never warn-and-stop, never downgrade. |
| GA-9b | The scan lens profiles the codebase and matches the catalogue for maximal-fit retrofit. Host-first flow. |
| GA-9c | Sanitation first — distrust before profile. |
| GA-9d | Lifecycle is an installed always-on drift-prevention rule. The repo is the memory; no persistent store. |
| GA-9e | Drift enforcement is layered: byte-exact sync check plus agent semantic guard. |
| GA-9f | Taxonomy is family → service → grade. *Refined to four levels by GA-9k.* |
| GA-9g | **Tier naming fully deprecated.** There is no installable Basic/mid/Advanced. The catalogue is the product. |
| GA-9h | Offering shape = mandatory security baseline + à-la-carte capability layer. *Later relaxed: the user may disable any control and be told truthfully.* |
| GA-9i | Two distinct securities. Agent-tech safety is the baseline; product security is a selectable family. |
| GA-9j | Development and Testing are distinct families. The v1 family set is Development · Testing · Infrastructure · Product-Security. |
| GA-9k | Development family contents, and the grain: **four levels, family → group → service → grade**, uniform across families. Whole catalogue ships v1. |
| GA-9l | Testing family contents. Chaos moves to Infrastructure; mutation restored as an 11th group. |
| GA-9m | Infrastructure family contents. Owns chaos, capacity load, and secret-injection mechanics. |
| GA-9n | Product-Security family contents — the fourth and final family. |

### The re-grills

| ID | Date | Ruling |
|---|---|---|
| GA-10 | 2026-07-25 | Re-grill after implementation audit. Eleven rulings (`a`–`k`): sole Gate-2 authority, 115 leaves as production commitments, one honest service outcome, real history scan, bounded remediation, per-axis host contracts, additive CI, default-deny network policy, complete user control, one-use approvals, workflow-not-staffing. |
| GA-11 | 2026-07-26 | Gate 1 integrity mechanism. Four rulings (`a`–`d`): withdraw the D5 process control, replace with a non-git signature, hardware-attested presence as the floor, recorded as a strengthening with two accepted residuals. |
| GA-12 | 2026-07-28 | The lifecycle re-grill. Nine rulings (`a`–`i`) becoming D11–D18: uninstall, usage artifacts, session-scoped delegation, no invariant tier, install resume, local-only findings, deterministic secrets, arming, migration excluded. |
| GA-13 | 2026-08-19 | D8 review separation corrected. A different model cannot be established from a self-declared label; the requirement is a fresh session, report-only, digest-bound receipt. |
| GA-14 | 2026-08-19 | Policy-signer recovery. Seven rulings (`a`–`g`) becoming D20: live-human-act floor, distinct failure domain, prior registration required, credentials offered at setup, exhaustion terminal, consequences follow authorisation, separate trust domain from Gate 1. |
| GA-15 | 2026-08-20 | Close the catalogue delivery fork in favor of vertically promoting `development.code-quality.lint-format` to the first production leaf instead of waiting for horizontal all-leaf authorship. |
| GA-16 | 2026-08-20 | Lint-format uses a hybrid-plus tool promise: preserve existing tools, offer Rig-supported setup, and surface a better Rig alternative for the user—not Rig—to choose. |
| GA-17 | 2026-08-20 | Product forks choose the hybrid path: Rig adapts to and amplifies the existing project and host instead of duplicating what is already there. |
| GA-19 | 2026-08-20 | Lint-format ecosystem scope is open-ended: after landing, Rig derives and builds the capability relevant to the repository it actually finds rather than requiring a fixed language or package-manager list. |
| GA-20 | 2026-08-20 | Lint-format discovers the whole repository: root projects, workspaces, nested packages, and polyglot components are all proposed, with component deselection before apply. |
| GA-21 | 2026-08-20 | Lint-format discovers commands semantically from each component's manifests, tool configuration, and declared tasks instead of requiring fixed script names; ambiguous matches return to the user. |
| GA-22 | 2026-08-20 | The linting harness grade model is exactly Policy → Context → Evidence: govern the change, understand the change, prove the change; levels are cumulative and use the lowest level capable of a definitive answer. |
| GA-23 | 2026-08-20 | Policy → Context → Evidence is Rig's universal per-service capability model, while current specification and delivery remain vertical and focused only on the lint-format leaf. |
| GA-24 | 2026-08-20 | Lint-format may install partial coverage: covered components proceed, uncovered components remain explicit unprotected gaps approved by the user, and no whole-repository support claim is made. |
| GA-25 | 2026-08-20 | Lint-format execution consent is plan-bound: service selection requests the capability, plan approval authorizes only the listed read-only commands and scopes, and mutating fixes require separate approval. |
| GA-26 | 2026-08-20 | Repository-owned lint/format tasks are untrusted code: planned execution stays under Rig policy, privilege, secret, network, and resource controls; `shell: false` is never presented as a safety guarantee. |
| GA-27 | 2026-08-21 | A read-only check that mutates repository state is a failure: Rig detects the mutation, stops further execution, fails the check, and reports the exact changed paths with before/after evidence—without auto-restoring the tree or letting the check continue. |
| GA-28 | 2026-08-21 | Lint-format checks are diff-scoped (changed files) by default; the user may request whole-repository or other scopes on demand. Every scope honors each component's ignore rules and runs in that component's working directory. |
| GA-29 | 2026-08-21 | Autofix is a separate mutating action, never folded into a read-only check: the user explicitly invokes a specific fix command with its own approval, Rig offers both format and safe lint fixes, re-verifies by re-running the check, and leaves results as uncommitted working-tree edits the user owns. |
| GA-30 | 2026-08-21 | Lint-format CI (the Evidence level, running whole-scope at the gate) integrates additively into verified existing CI; absent or unsupported CI is proposed as an explicit, separately approved, user-chosen-provider plan; unknown/unsupported pipelines are preserved and reported, never silently edited or replaced. |
| GA-31 | 2026-08-21 | When an approved task drifts from what was approved, Rig treats the binding as stale/tampered: it stops, does not run the changed command, discloses the exact drift, and requires the user to review and approve a freshly rediscovered plan before execution resumes. A changed command is a new command. |
| GA-32 | 2026-08-21 | Lint-format output is failure-centric, local, and redacted: reports stay on the producing host, keep failures/vacuous/gap state, omit routine passes; CI emits only verdict, counts, and rule identities—no source snippets or artifacts. Redaction covers secrets, PII, and any host-rooted sensitive data, stripped on the producing host before output leaves it. Reports explain findings to the user as clear actionable items (what is wrong, what to do), not raw dumps. Secret-matched content reaches the agent only on explicit opt-in. |
| GA-33 | 2026-08-21 | Every abnormal check ending is its own distinct, reported, non-passing state: timeout, cancelled, missing-dependency, signalled, partial-output, and command-not-found each resolve to a specific truthful result—never collapsed into "pass," never silently swallowed. The one-honest-outcome rule applied to the messy endings: a check that could not reach a verdict says exactly why. |
| GA-34 | 2026-08-21 | Lint-format lifecycle follows the frozen install-manifest/removal contract: reinstall is an idempotent resume claiming nothing until complete; removal reverses exactly what Rig's manifest recorded it created (generated CI, config, managed blocks) and touches nothing else; user-invoked source fixes are the user's own edits and always survive uninstall. |
| GA-35 | 2026-08-21 | Production support is claimed per component and only on positive evidence: a component is supported only when Rig built at least the Policy level, discovered and bound its commands, and produced a real (non-placeholder) check result under plan-bound consent; the whole repository is supported only when every discovered, non-excluded component clears that bar, and any approved exclusion suppresses the whole-repository claim while the covered components stay truthfully supported. |
| GA-36 | 2026-08-23 | DSH (a forked agent-runtime harness) is adopted only as an optional, frozen, tier-1-only delivery shell for the no-host segment — reach, not moat — and is never chased upstream. The moat is the adaptation-onto-existing-infra engine (merge-not-overwrite, repo-shape-aware, one analysis emitted per host); its quality, not its existence, is unproven and is validated on real repos before further shell work. DSH's skill-generation is replicated onto whichever host is present through study and prompting, not inherited as running code. Build order stays corpus-first: adaptation engine, then an authoring/preview/approve surface, then the optional shell last. |

### Re-grill sub-rulings

The parent rows above identify each re-grill. Every sub-ruling is indexed below
so no decision ID is hidden inside its parent summary.

| ID | Ruling |
|---|---|
| GA-10a | `technical-spec.md` is the sole Gate 2 authority; traceability and fresh-context semantic review precede code correctness. |
| GA-10b | All 115 catalogue leaves are production commitments; TODOs, generic filler, and merely non-empty fragments fail. |
| GA-10c | Every selected service has one honest executable, convention, or surfaceless outcome; missing and fake-green behavior fails. |
| GA-10d | First leak-scanner enablement runs a real history scan; findings or scanner failure block activation pending remediation, re-scan, or exact waiver. |
| GA-10e | Remediation applies exactly the approved current write set, rejects stale/no-op work, rolls back partial failure, and re-runs sanitation. |
| GA-10f | Host/CI evidence is per axis and requires a complete contract, official evidence, and first-wire proof; speculative configuration is forbidden. |
| GA-10g | Existing supported CI is integrated additively; absent CI requires explicit provider selection and plan approval; unknown CI fails visibly and is preserved. |
| GA-10h | One default-deny structured policy covers shell, built-in web, and network-capable MCP, preferring an approved MCP route. |
| GA-10i | The user may allow categories or disable enforcement; exact policy revisions remain inert until user-approved and agents cannot self-authorize. |
| GA-10j | Exact one-use approval is available for an unchanged denied action; re-enabled controls require fresh evidence. |
| GA-10k | Product, design, implementation, review, and acceptance are separate workflow contexts, not staffing prerequisites. |
| GA-11a | Withdraw D5's commit/upstream/branch-protection mechanism for Gate 1 integrity. |
| GA-11b | Replace it with non-git digest recomputation and a signature only a physically present human can produce. |
| GA-11c | Gate 1 uses the stronger live-human-act key floor and does not inherit weaker product signers. *Corrected by D19: the artifact cannot attest the key class.* |
| GA-11d | Record the signature as a strengthening and accept the explicit lost-key and persuaded-owner residual risks. |
| GA-12a | Repo uninstall is v1 scope; managed blocks and a write-time manifest drive reverse removal, while snapshots are evidence and never restore input. |
| GA-12b | Reports and run history are usage artifacts and survive uninstall unless the user explicitly requests purge. |
| GA-12c | Delegated policy-edit mode is session-scoped and never persisted; later-session claims are refused. |
| GA-12d | Self-activation prohibition is a Rig product rule, not a user-editable invariant policy tier. |
| GA-12e | Interrupted install leaves applied work incomplete and resumable; partial controls claim no protection. |
| GA-12f | Findings stay local; CI emits verdict, counts, and rule identities without detail or artifact upload. |
| GA-12g | Secret detection is deterministic and matched content stays out of the model by default; model triage is explicit opt-in. |
| GA-12h | Signer identity arms the specification gate; an armed repository with a missing signature fails. |
| GA-12i | Version migration is excluded; a newer source-archive release is an idempotent reinstall. |
| GA-14a | Policy-signer recovery must meet the live-human-act floor; an ordinary confirmation popup is insufficient. |
| GA-14b | Recovery credentials are cryptographically distinct and stored in a separate failure domain. |
| GA-14c | A recovery credential counts only if registered while an already-valid credential was in force. |
| GA-14d | Signer setup offers an initial recovery pool and later top-ups while a valid credential remains. |
| GA-14e | Losing the everyday signer and every registered recovery credential is terminal for that trust state. |
| GA-14f | Pending-edit, one-use-approval, and evidence-epoch invalidation follows authorized recovery and never triggers it; every recovery gets a receipt. |
| GA-14g | Policy recovery is a separate trust domain; the Gate 1 signer keeps no recovery path. |
| GA-15 | Vertically deploy `development.code-quality.lint-format` first; the other 114 leaves remain commitments, but they no longer block the first leaf's production path. |
| GA-16 | Preserve a repository's existing lint/format toolchain by default. Rig may offer setup when none exists and recommend a better Rig-supported alternative when one exists, but the user alone decides whether to adopt it. |
| GA-17 | Choose the hybrid product path when options fork: adapt to the project and host, avoid redundant Rig machinery, and improve what already exists. |
| GA-19 | Do not limit lint-format to a named ecosystem roster. Rig inspects the repository it lands in and builds the relevant lint/format capability from that repository's actual ecosystem. |
| GA-20 | Discover lint-format needs across the whole repository, including root projects, workspaces, nested packages, and polyglot components; present all in the reviewable plan and let the user deselect components before apply. |
| GA-21 | Bind lint-format behavior through semantic discovery, not fixed command names or direct-tool substitution. Preserve repository-declared workflows and present ambiguous matches for user choice. |
| GA-22 | Grade the linting harness cumulatively as Level 1 Policy, Level 2 Context, and Level 3 Evidence. Ordinary syntax, formatting, type, and static-analysis checks are commodity inputs; use the lowest level that can reach a definitive answer, and require verifiable evidence—not merely an agent opinion—for Level 3. |
| GA-23 | Record Policy → Context → Evidence as the universal grade method for every catalogue service, applied only within each service's owned domain. Prove and deliver it vertically through lint-format first; do not author the remaining leaves now. |
| GA-24 | Permit partial lint-format installation when the minimum Policy level cannot be built for every discovered component. The user approves exact exclusions; reports keep them visibly unprotected and suppress whole-repository support claims. |
| GA-25 | Selecting lint-format does not itself authorize repository code execution. The approved plan lists exact commands, working directories, components, and read-only intent; it authorizes those checks, while every mutating fix requires separate approval. |
| GA-26 | Treat every repository-owned task as untrusted code even when launched with `shell: false`. Disclose the boundary and enforce Rig policy, least privilege, secret isolation, network restrictions, and resource/time limits. |
| GA-27 | A check planned and approved as read-only must not change the working tree. If it does, Rig treats the mutation as a check failure: it detects the change, halts before any further planned command runs, fails the check, and reports the exact changed paths with before/after evidence. Rig does not automatically restore the pre-check state—auto-restore can clobber concurrent user work and erase the forensic record of a misbehaving tool—and it does not let the check continue. The read-only promise is externally observable through mutation detection, the stop, the preserved evidence, and a truthful repository state. |
| GA-28 | A lint-format check is diff-scoped by default: during ordinary work it inspects only the changed files in each component. The user may request a wider scope—whole-repository or another explicit selection—when they ask for it; Rig does not silently widen scope on its own. Every scope, default or requested, respects the component's own ignore rules (build output, vendored, generated files) and runs inside that component's working directory. This extends the existing per-service run-scope precedent (`GA-4c`) to lint-format's interactive default; the enforcement/CI run scope is settled under the CI-behavior decision. |
| GA-29 | Autofix rewrites source, so it is a distinct mutating action separate from any read-only check (`GA-25`, `GA-27`). Rig runs it only when the user explicitly invokes a specific fix command, under its own separate approval—never bundled into or triggered by a check. It is offered for both formatting fixes and safe lint fixes. After applying, Rig re-verifies by re-running the read-only check rather than assuming success. Resulting changes land as ordinary uncommitted working-tree edits that the user owns and reviews; Rig never commits them or claims ownership of the source. |
| GA-30 | The Evidence level enforces lint-format in CI, running whole-scope at the gate (the enforcement counterpart to the diff-scoped interactive default of `GA-28`). Rig integrates additively into verified existing CI rather than taking the pipeline over. When no CI exists, or the provider is unsupported, Rig proposes a pipeline as an explicit separate plan: the user chooses the provider and approves before anything is written—Rig never auto-creates or owns CI on selection alone. A pipeline Rig does not understand is preserved and reported, never silently edited or replaced. This carries the frozen additive-CI mechanism (`AD-23`, `GA-10g`) into lint-format's Evidence level. |
| GA-31 | Plan-bound consent (`GA-25`) authorizes exact commands, so a command that has changed since approval is outside that authorization. When the underlying repository task no longer matches what was approved—a different tool, a new target, an edit after approval—Rig treats the binding as stale/tampered: it stops before running, does not execute the changed command, discloses exactly what drifted, and requires the user to review and approve a freshly rediscovered plan before execution resumes. Rig neither silently rediscovers and runs the changed task under the old approval nor keeps running the stale approved text against a repository that no longer defines it. A changed command is a new command. |
| GA-32 | Linter/formatter output can quote source and occasionally surface secrets or personal data, so lint-format output is failure-centric, local, and redacted by default—the direct extension of the frozen reporting and secret rulings (`D15`, `AD-16`, `D16`). Reports stay on the machine that produced them, keep failures, vacuous runs, and coverage gaps, and omit routine passes. CI emits only verdict, counts, and rule identities—never source snippets or uploaded artifacts. Redaction is not limited to secrets: it also removes personally identifying information and any other host-rooted sensitive data, and it happens on the producing host before any output leaves it, so the producing machine is the redaction boundary. Reports do not dump raw tool output—they explain each finding to the user as a clear, actionable item (what is going wrong and what to do about it). Secret-matched content reaches the agent's context only when the user explicitly opts into model-assisted triage. |
| GA-33 | A check does not always reach a clean pass or fail, and every messy ending must be truthful (`GA-10c`, `AD-16`, `D4`). Timeout, user cancellation, missing dependency, signalled/killed process, partial output, and command-not-found each resolve to their own distinct, reported, non-passing state. None is ever collapsed into "pass" and none is silently swallowed; a generic "failed" is rejected because it loses the actionable cause, and treating inconclusive ends (timeout, missing dependency) as non-blocking is rejected as reintroducing false green. A check that could not reach a verdict states exactly why, so the report stays actionable. |
| GA-34 | Lint-format lifecycle is the direct application of the frozen removal and resume decisions (`D11`, `D14`, `GA-12a`, `GA-12b`, `GA-12e`, `AD-10`). A repeated install is an idempotent resume that picks up from the manifest and claims no protection until complete. Removal reverses exactly what Rig's manifest recorded it created—generated CI, configuration, and managed blocks—and touches nothing else, so a legacy or user-owned artifact Rig cannot prove it created is left alone. Source fixes the user invoked through autofix (`GA-29`) are the user's own working-tree/committed edits and always survive uninstall. Wiping and rewriting on reinstall, or reverting applied source fixes on removal, is rejected as destroying user work; leaving lifecycle to the generic installer is rejected as orphaning generated CI/config. |
| GA-35 | The support claim is the promise the whole leaf is measured against, so it is evidence-backed and per component—the convergence of the coverage and honesty rulings already frozen (`GA-24`, `GA-10b`, `GA-10c`, `GA-32`). A single component is "production-supported" only when Rig genuinely built at least the minimum Policy level for it, discovered and bound its commands, and produced a real check result—not a placeholder or fake-green—under plan-bound consent (`GA-25`). The whole repository is "production-supported" only when every discovered, non-excluded component clears that same bar; any user-approved exclusion (`GA-24`) suppresses the whole-repository claim while the covered components remain truthfully supported in their own right, so one covered component never masks another's gap. Claiming whole-repository support merely because the leaf installed somewhere is rejected as letting install success masquerade as coverage; refusing to ever claim support and only reporting per-run results is rejected as discarding the customer-facing promise the leaf exists to earn. |

---

## `G#` — Foundational grilling

How Rig itself was designed, before any of the above.

| ID | Ruling |
|---|---|
| G1 | The primary blend is superpowers × gstack. mattpocock and ponytail are supporting cast. |
| G1a | *Recommended, never confirmed:* hand-graft one overlapping phase to prove the curation thesis before trusting it. |
| G2 | Minimalism is a real pillar, scoped to building and scoping — not to planning. Thorough spec, minimal diff. |
| G3 | MVP = Tier 1 only. The materializer is entirely Tier 2. |
| G3a | Tier 1 anticipates manifest shape as vocabulary only. No materializer code before Tier 2. |
| G4 | MVP scope is emergent within Tier 1. Payload ports as extracted markdown — carry doctrine, not runtimes. |
| G5 | Universal routing via one shared `routing.md` plus one-line host pointers. |
| G6 | `routing.md` is advisory. Hook-less hosts get strong language, and the limitation is stated rather than hidden. |
| G6a | Hook-capable hosts use real PreToolUse hooks; hook-less hosts fall back to strong prose. Enforcing entries are a tiny set. |
| G7 | The TDD graft is two-way — superpowers × mattpocock. gstack has no TDD skill. Refactor stays in the loop. |
| G8 | The debugging graft is a true three-way. mattpocock's loop-first skeleton is the spine; hypotheses are 3–5 ranked and falsifiable, and the other plausible sources get hardened too. |
| G9 | The code-review graft is superpowers ×2 × mattpocock × gstack. Report-only, preserving reviewer independence. |
| G10 | Tier 1 includes an identity/naming refactor — ship it as its own harness, not a thin fork. |
| G10a | The name is **Rig**. ponytail survives as a named internal component. |
| G11 | Tier 2 splits into Basic and Advanced. |
| G11a | Host-brain vs Rig-brain. *Superseded — locked B1 by GA-2, and the package taxonomy itself deprecated by GA-9g.* |
