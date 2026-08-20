# Decision index

Every ruling this project has made, across four ID schemes, in one place.

| Scheme | Count | What it is | Defined in |
|---|---|---|---|
| `G#` | 16 | Foundational grilling — what Rig is and how it is built. | [`sources/logs/grill-decisions.md`](../sources/logs/grill-decisions.md) |
| `GA-#` | 65 | Advanced grilling — the business intent behind Gate 1. | [`sources/logs/advanced-grilling.md`](../sources/logs/advanced-grilling.md) |
| `D#` | 20 | Gate 1 revisions — rulings that changed frozen intent. | [`gate1/business-spec.md`](../gate1/business-spec.md) |
| `AD-#` | 30 | Gate 2 mechanisms — frozen implementation constraints. | [`gate2/technical-spec.md`](../gate2/technical-spec.md) §2 |

The relationship: a `GA-` ruling is the conversation, the matching `D#` is what
that ruling did to frozen intent, and an `AD-#` is the mechanism Gate 2 built to
satisfy it. Not every ID has counterparts in the other schemes.

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
| AD-8 | Remediation separate and read-only until exact approval. | [sanitation and remediation](../topics/sanitation-and-remediation.md) |
| AD-9 | Graft through typed operations; never arbitrary shell plans. | [graft mechanics](../topics/graft-mechanics.md) |
| AD-10 | Apply under exclusive lock with CAS preimages, the §7.6 manifest recording every write, and receipt last; no rollback branch — a failed apply resumes. *(Amended 2026-08-20: dropped rollback, resolving the round-3 `AT-INSTALL-1` blocker.)* | [install manifest and removal](../topics/install-manifest-removal.md) |
| AD-11 | Materialize service prose once under `.rig/services/`; host surfaces get pointers. | [graft mechanics](../topics/graft-mechanics.md) |
| AD-12 | Ship dormant implementations; wire only what the active policy enables. Installed code is not evidence a control ran. | [the safety baseline](../topics/safety-baseline.md) |
| AD-13 | One uniform emission path per `{host, axis}`. No tier in output or data. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-14 | Emit the complete menu; recommendations advisory, user selections win. | [onboarding flow](../topics/onboarding-flow.md) |
| AD-15 | Attempt every service as executable first. `convention` needs a service-specific reason. | [services and reports](../topics/services-and-reports.md) |
| AD-16 | Write failed, vacuous, gap, disabled, pending, and stale state. Omit routine passes. | [services and reports](../topics/services-and-reports.md) |
| AD-17 | Reuse Basic's MCP renderers only for evidence-backed paths; retire unsupported MCP. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-18 | Drive implementation from a complete executable transcription of Gate 1. | [the specification gate](../topics/specification-gate.md) |
| AD-19 | Validate policy bytes strictly, hash exact bytes, keep last activated as immutable snapshot. Delegation never persisted. | [the policy model](../topics/policy-model.md) |
| AD-20 | Host-native presence preferred, external SSHSIG fallback, refusal third. No third path. | [user-presence approvals](../topics/user-presence-approvals.md) |
| AD-21 | One-use approvals clone-local, bound to the full action, consumed atomically. No Rig clock. | [one-use approvals](../topics/one-use-approvals.md) |
| AD-22 | One normalized action policy across shell, web, and MCP adapters. | [the action evaluator](../topics/action-evaluator.md) |
| AD-23 | Integrate verified CI additively; absent CI needs explicit provider choice and plan approval. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-24 | Every axis in the roster is an initial-release commitment. Build set = release set. | [host and CI coverage](../topics/host-and-ci-coverage.md) |
| AD-25 | User-global writes append or namespace-merge only, attributed from the first install. | [user-global writes](../topics/user-global-writes.md) |
| AD-26 | Disclose the out-of-repository blast radius at install time. No per-host claim string. | [user-global writes](../topics/user-global-writes.md) |
| AD-27 | Install stub fetches a released tag by name. No fingerprint. Never pipe network to shell. | [distribution and release](../topics/distribution-and-release.md) |
| AD-28 | Verify Gate 1 by signature, first in the spec gate, spec gate first in `npm test`. No exemption input. | [the specification gate](../topics/specification-gate.md) |
| AD-29 | Review receipts produced by a wrapper that writes the digest and timestamp itself. | [review receipts](../topics/review-receipts.md) |
| AD-30 | Recovery only through pre-registered distinct `sk-*` identities under `rig-policy-recovery`. | [policy-signer recovery](../topics/policy-signer-recovery.md) |

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
