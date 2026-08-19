# Tier 2 Advanced — Gate 1 (RE-GRILLED AND FROZEN 2026-07-28)

**Frozen business intent + acceptance tests** for the Advanced à-la-carte delivery model. This is the
clean Gate-1 artifact that `rig-product-design` (Gate 2) designs against.

> **Gate contract.** A design or implementation context must **not** author or edit
> this file. A wrong Gate-1 decision changes only by returning to grilling,
> recording why the intent changed, and revising this file and
> [`../acceptance.md`](../acceptance.md) together. Roles describe isolated work
> contexts, not named people: one maintainer may run every stage, but an
> implementing context cannot approve itself or edit Gate 1.

- **Full decision history / rationale:** `../../archive/grilling/advanced-grilling.md` (the `GA-#` decisions log — the record
  of *how* every line here was reached, incl. superseded/withdrawn forks).
- **Detailed service taxonomies:** `../reference/mutation-testing-taxonomy.raw.md`,
  `../reference/product-security-taxonomy.raw.md`, `../reference/agent-harness-security-playbook.raw.md`,
  `../reference/testing-pipeline-vision.raw.md`.
- **Product authority:** this file plus [`../acceptance.md`](../acceptance.md).
- **Sole Gate-2 implementation authority:** `technical-spec.md`, but only while
  it is explicitly versioned and frozen against the current Gate 1. The SOW,
  task list, coverage plans, and decision history are subordinate and cannot
  supersede it.
- **Brain fork:** B1 (config / host-brain) — **no Rig runtime, no model key** in the installed repo;
  Rig authors config the host agent executes (foundational #11). Cap A (local-model / LangGraph
  runtime), a persistent memory store, and semantic-brain runtime judgment + isolation infra are
  **out of scope → Tier 3.**

---

> **Revision note (2026-07-25).** This file and
> [`../acceptance.md`](../acceptance.md) were re-grilled together after the
> implementation documents and green tests were found to permit contradictory
> authority, placeholder catalogue content, fake or silent service outcomes, and
> unverified host/CI claims. Together they remain the complete Gate 1.

> **Revision note (2026-07-26) — the claim/build split.** Re-grilled again by
> the intent owner after a readiness audit found the 2026-07-25 intent
> unshippable as written: it made release conditional on first-wire evidence for
> every one of 19 hosts and six CI providers, and that evidence requires
> possession of licensed vendor products that no amount of implementation effort
> can substitute for.
>
> The resolution is to **separate what Rig builds from what Rig claims**. Rig
> builds and emits for the full roster; Rig advertises enforcement only where a
> real first wire proves it. This removes the release deadlock without cutting
> scope, weakening a control, or reducing what any user receives — and every
> remaining axis promotes to verified the day it is first-wired, with no change
> to this file.
>
> Nine decisions were taken; they are marked `D1`-`D9` at their point of effect
> below and in [`../acceptance.md`](../acceptance.md). Decisions 2, 3, 4, 6, and
> 9 change observable product behavior and are therefore Gate 1 edits, recorded
> here as a revision rather than absorbed into Gate 2.
>
> **This revision is frozen.** All nine decisions are recorded and no decision
> remains open. Gate 2 must be rewritten and re-frozen against this file and
> [`../acceptance.md`](../acceptance.md) at their current 45-case set.
> *(The 45-case instruction here is historical: superseded by the 2026-07-28
> note below, which moves the set to 52.)*

> **Revision note (2026-07-26, later the same day) — D10, Gate 1 integrity.**
> Re-grilled once more by the intent owner after Gate 2 design work surfaced
> that the D5 mechanism did not fit how this repository is actually used. D5
> protected Gate 1 through repository process: a comparison against committed
> upstream state, a separately reviewed commit, and branch protection with code
> ownership. The intent owner rejected that mechanism on the grounds that
> organisations audit commit traces and a stream of commits maintaining agent
> documentation is itself a cost, and asked for a control that does not run
> through git at all.
>
> **D10 replaces the process control with a cryptographic one.** The gate
> recomputes Gate 1's digest and verifies a signature over it that only a
> physically present human can produce. This is a strengthening rather than a
> relaxation: branch protection is bypassable by anyone holding push rights,
> whereas the signature is not forgeable by an agent holding the entire
> repository.
>
> The case count stays at **45**. `AT-GATE-2` changes mechanism, not verdict; no
> case is added or removed and the Gate-2 traceability table is unaffected in
> size.
>
> **This revision is frozen.** Its residual risks are recorded in §9.

> **Revision note (2026-07-28) — D11-D18, the lifecycle revision.** Re-grilled
> with [`../acceptance.md`](../acceptance.md) after a sweep for unstated
> behavior. The finding behind it: this Gate 1 specified in detail how Rig
> arrives in a repository and said almost nothing about how it leaves, how it
> fails, or what it does with what it finds. `AT-HOME-2` obliged Rig to remove
> its own entries from a user-global file and report what it removed, while
> nothing anywhere said what removal does to the repository Rig actually
> modified — including the CI job Rig inserts into the user's own pipeline
> under `AT-CI-1`. A product a stranger can install under `AT-DIST-1` and cannot
> cleanly remove is not finished.
>
> Eight decisions were taken, `D11`-`D18`, marked at their point of effect here
> and in [`../acceptance.md`](../acceptance.md). Seven change observable product
> behavior and add seven cases; the ID set moves from 45 to **52**. `D18` is a
> scope exclusion and adds none.
>
> One of them is a defect fix. `D17` closes a hole in `D10`: the gate defined
> only the *edited*-signature case, so a **missing** signature fell through to
> §9's honest-fallback language and passed — meaning any context that wanted to
> edit Gate 1 could delete the signature first and proceed under a warning. The
> gate is now armed by the presence of the signer identity, and absence of a
> signature on an armed repository is a failure rather than a downgrade.
>
> **This revision is frozen.** Gate 2 is reopened by it and must be rewritten
> and re-frozen against the 52-case set.

> **Revision note (2026-08-13) — D19, Gate 1 integrity, second correction.**
> Re-grilled by the intent owner after Gate 2 design work went to satisfy D10's
> presence floor and found the floor unsatisfiable. D10 required a signature
> that *attests* hardware user presence. No SSH signature does: `ssh-keygen`
> records authenticator attestation only at key generation, its verification
> mode has no option that consults it, and the allowed-signers grammar cannot
> express a touch or user-verification requirement at all. Verification
> establishes that the signature is mathematically sound and that the key is
> listed — nothing more. A key type is therefore a naming convention, and an
> agent that can already write the signer identity file can emit a key bearing
> that convention.
>
> **D19 restates the floor as a property of the key rather than a claim about
> the artifact.** The requirement is that no agent holding the intent owner's
> machine can produce a signature under that key without a live human act. The
> intent owner attests the key meets it; the gate verifies the signature. The
> threat closed is exactly the threat D10 closed — an agent silently re-signing
> its own edits to the acceptance oracle — and every key that satisfied the old
> wording satisfies this one. What changes is that Gate 1 no longer instructs
> Gate 2 to build a check that cannot be built, and no longer implies a
> guarantee the gate cannot deliver.
>
> The case count stays at **52**. `AT-GATE-2` changes mechanism, not verdict.
> The residual risk this creates is recorded in §9.
>
> **This revision is frozen.** Its effect on Gate 2 is confined to the presence
> floor: §8 below and the corresponding gate step.

> **Revision note (2026-08-17) — the host-tier amendment.** Re-grilled with
> [`../acceptance.md`](../acceptance.md) after the executable-specification-gate
> design found that Rig ships one configuration for every host and has never
> observed enforcement fire on any of them, while the verified/unverified tier
> introduced by `D1`, `D2`, and `D3` (2026-07-26) drew a distinction the product
> never implemented. The owner's decision is to ship all 19 hosts and six
> providers with **no tier** — no verified vs unverified distinction in Rig's
> output or data — and to prove every axis the same way, by automated tests
> asserting the correct bytes land in the correct paths, never by a human
> exercising a host.
>
> This unwinds `D1`/`D2`/`D3`. In §2, the *"Rig builds for every host; Rig
> claims only what it has run"* rule is rewritten to require every host emitted
> through **one uniform path** with no second-class surface, and the *"An
> unverified axis says so, and does not ask"* rule is removed with its tier. §3
> and §6's property 4 drop the advertised/first-wired language. In §9 the *"Four
> verified hosts is a narrow base"* risk is replaced by the honest residual that
> Rig documents each surface but has not observed enforcement fire on any host —
> a statement whose home is the host registry header, not user-facing output.
> The out-of-repository write disclosure (`D9`) is unaffected; it was never part
> of the tier.
>
> The acceptance ID set shrinks from **52** to **48**
> ([`../acceptance.md`](../acceptance.md)), and the Gate-2 traceability table
> must match that set exactly.
>
> **This revision is frozen.** The decision is recorded and no decision remains
> open. Gate 2 must be re-frozen against this file and
> [`../acceptance.md`](../acceptance.md) at their current set, under a re-signed
> combined digest (§8).

> **Revision note (2026-08-19) — D8 review separation.** Re-grilled with
> [`../acceptance.md`](../acceptance.md) after review found that a different
> model cannot be established from a self-declared authoring-model label. The
> review requirement is therefore a fresh session, report-only operation, and
> an exact-digest-bound receipt. Model identity is not a release condition.
> The case count remains **48**; `AT-GATE-3` changes its separation mechanism,
> not its required semantic review outcome. Gate 2 must be re-frozen against
> this amendment.

> **Revision note (2026-08-19, later the same day) — D20, policy-signer
> recovery.** Re-grilled with [`../acceptance.md`](../acceptance.md) after a
> Gate 2 review found the technical design had built a full recovery ceremony
> for the policy-activation signer — a `trust.json` bootstrap/rotation record
> plus a bootstrap step that invalidates pending edits, burns one-use
> approvals, and resets evidence epochs — with no Gate 1 requirement behind
> it. Gate 1 had never said what happens when that signer is lost, and an
> unrequested reset path is exactly the kind of lever the D5→D10→D17→D19
> sequence spent four revisions keeping out of an agent's reach.
>
> D20 gives the policy signer a real, bounded recovery path rather than
> leaving the gap silent or stripping the capability from Gate 2 outright: a
> distinct, separately stored, pre-registered recovery credential (or set of
> them), approved through the same live-human-act floor Gate 1 already
> requires for its own protection, with exhaustion of every registered
> credential treated as a deliberate, permanent dead end rather than grounds
> for inventing another fallback.
>
> One case is added: `AT-PRESENCE-2`. The ID set grows from **48** to **49**,
> and the Gate-2 traceability table must match that set exactly.
>
> **This revision is frozen.** Gate 2 must be rewritten and re-frozen against
> this file and [`../acceptance.md`](../acceptance.md) at their current
> 49-case set, under a re-signed combined digest (§8).

## 1. Problem & outcome

**Problem.** Developers onboard AI agents into repos with inconsistent, unsafe, ad-hoc setups — local
models, "accept-all edits" / bypass-permissions ("dangerous") modes, auto-runners, and conflicting
agents that clobber each other's work and can destroy a project. Separately, installing a generic
skill/rule forces the user to hand the agent a manual per-repo *transition* so the generic thing
actually fits this codebase. There is no standard, safe, configurable way to fit agentic-engineering
capability to a specific repo and host.

**Outcome.** Rig ships a delivery model that (a) installs and enables an
**agent-tech-safety baseline by default**, then (b) offers a
**scan-recommended, user-configurable à-la-carte catalogue** of engineering
capabilities, **grafted onto the repo's existing framework** with the
per-repo/per-host transition **automated by Rig**. The user retains explicit
control over every safety control. When a control is disabled, Rig remains
usable but never claims that the disabled protection or its checks ran.
Host-agnostic; config-only (B1).

## 2. Users & business rules

- **User:** a developer/team onboarding Rig into their repo on an agent host they choose.
- **Business rules (invariant):**
  - The **agent-tech-safety baseline is enabled by default** (sanitation +
    drift prevention + secret + git/CI floors), but the user may configure or
    disable any part of it, including all enforcement.
  - A policy revision is inert until the user approves that exact revision.
    An agent may propose a revision, and the user may grant an agent explicit
    delegated policy-edit mode, but neither path lets the
    agent activate its own proposal. Delegation is proposal authority, not
    consent. **That delegation is scoped to the session it was given in and is
    never written to disk (D12)** — so it ends when the session ends, needs no
    revocation ceremony, and an agent in a later session claiming to hold it is
    refused, because nothing exists that could substantiate the claim.
  - **The prohibition on agent self-activation is a product rule, not a user
    policy clause (D13).** No policy the user can write and no proposal an agent
    can make removes it. The user may disable Rig's enforcement entirely and be
    told truthfully that they are unprotected; what cannot exist is a
    configuration that permits an agent to activate its own edits while Rig
    still reports protection. Holding such invariants in a separate file or
    repository was considered and rejected: an agent with full shell access
    reaches the second file as easily as the first, which is the reasoning that
    withdrew D5.
  - Disabled controls genuinely stop restricting the agent. Rig records what
    is disabled or did not run and never reports a stale or fabricated
    protected, scanned, passed, or verified state.
  - Network access is default-deny and governed by one user-owned structured
    policy across shell commands, built-in web tools, and network-capable MCP
    calls wherever the host exposes a verified enforcement surface. Elsewhere
    the policy remains the agent's rule and Rig reports the enforcement gap.
    An approved MCP route is preferred when available. The user may permanently
    allow any action category or disable the policy globally; an unchanged
    denied action may instead receive exact, one-use approval.
  - **Agent-tech safety ≠ product security.** The baseline protects the *agent environment*; the
    selectable **Product-Security** family protects the *user's codebase*.
  - The **scan recommends, the user overrides freely** — including installing non-recommended
    services (configurability > paternalism).
  - **Dependencies auto-pull, razor-scoped** to the dependent's exact need — never warn-and-stop,
    never downgrade the dependent, never drag in unrelated general-purpose machinery.
  - **Graft, never overwrite** — install onto the repo's existing `AGENTS.md`/framework.
  - **Executable behavior is the default disposition (D4).** Every service
    attempts a real repo-adapted executable binding first. Convention-only is a
    *fallback*, permitted only when it carries service-specific instructions
    and a named reason why execution is not meaningful for that service. A
    surfaceless result must name the exact reason nothing can run. An
    unreasoned fallback, a generic convention, a missing, malformed, silent, or
    fake-green binding is a coverage gap, never a pass.
  - **Rig builds and emits for every host, through one uniform path.**
    Adapters are built and configuration emitted for the complete supported
    roster, so no user of any host receives less than they receive today. No
    code path skips a host, silently or otherwise, and every host is emitted
    through the same code path — none is a second-class citizen carrying a
    degraded surface. Emitting nothing is permitted only for an evidence-backed
    genuinely unsupported axis, which degrades explicitly. Rig draws no
    verified-versus-unverified tier in its output or data, and proves every
    emitted axis the same way: by automated tests that the correct bytes land
    in the correct paths, never by a human exercising a host.
  - **Approval is never silently skipped (D6).** User-presence approval uses a
    verified host-native prompt where one exists, otherwise a user-configured
    external signature. Where neither is available, activation is **refused and
    reported unavailable**. Rig specifies the signer interface and verifies
    signatures; it ships no signing binary and stores no key material.
  - **A lost policy signer has one authorised recovery path, and it terminates
    (D20).** Recovering from a lost or compromised policy-activation signer
    requires proof of human presence at least as strong as the floor Gate 1
    already sets for protecting these frozen documents themselves — a key no
    agent on the user's machine can operate without a live human act, never an
    ordinary confirmation prompt. The credential that proves it must be
    cryptographically distinct from the everyday signing key, kept outside any
    storage the repository, Rig, or the agent can reach on its own, and
    counts as a recovery credential only if it was registered while an
    already-valid credential was in force — an agent cannot designate its own
    replacement key as recovery and call that a fix. Rig offers to generate a
    set of recovery credentials the first time the everyday signer is set up,
    and offers the same option to add more every time signer setup runs again
    while a valid credential still exists. If the everyday signer and every
    registered recovery credential are ever all lost together, recovery is
    **refused permanently** for that policy trust state: no forced override,
    no silent reset, and no new fallback invented to route around the
    exhausted list. Recovery's consequences — invalidating pending policy
    edits, burning one-use approvals, and resetting evidence-epoch tracking —
    follow only from an authorised recovery event and are never something an
    agent triggers on its own by asserting one is needed, and every recovery
    is disclosed to the user rather than applied silently. This is a distinct
    trust domain from the Gate 1 integrity signer (D10/D19): that signer keeps
    no recovery path at all, and this decision does not add one.
  - **Agent prompts must not invent policy consent.** Every installed base
    prompt states that prior approvals, delegated edit mode, chat wording, tool
    access, urgency, or a broad task request never authorize activation. The
    agent may draft only under an explicit current request or a delegation given
    in the current session (D12), and every activation still needs
    exact-revision user approval.
  - **Writes outside the repository are permitted, attributed, and never
    destructive (D9).** Where a vendor ships only a user-global surface, Rig
    may write host configuration outside the repository by appending or
    namespaced additive merge only. It never overwrites, and it discloses the
    global blast radius at install time. Every entry Rig writes to a shared
    user-global file carries the identity of the repository that wrote it, from
    the first installation onward, so that uninstalling one repository leaves
    every other repository's configuration intact and reinstalling replaces
    rather than accumulates.
  - **Removal is part of the product (D11).** Rig can be taken out of a
    repository as completely as it was put in. Every write Rig makes to a file
    it does not exclusively own is delimited by managed-block markers and
    recorded in an install manifest as it happens, so uninstall removes exactly
    Rig's own content — across its files, the grafted instruction file, hooks,
    the CI job, host configuration, and any user-global file — and leaves every
    user-owned byte untouched. Rig also keeps a copy of each file as it stood
    before Rig first modified it, used to prove the result is clean and never to
    restore over the user's later work. Where a managed block can no longer be
    located, removal is reported as best-effort with the file named, never as
    clean. Usage artifacts such as reports are not installation state and
    survive removal unless the user explicitly asks for a purge.
  - **An interrupted install resumes; a partial install claims nothing (D14).**
    A transition-install that fails partway leaves its applied work in place and
    marked incomplete, and re-running it continues from the manifest rather than
    restarting or duplicating. Uninstall remains available to back it out
    through the same teardown path. Until it completes, no partially applied
    control is reported as enabled or protecting anything.
  - **Findings stay on the machine that produced them (D15).** Reports are
    excluded from version control, are not committed, and are not uploaded as
    build artifacts. In CI the job emits a pass/fail verdict with counts and
    rule identities and does not print finding detail to the log, because on a
    public repository the log is as readable as the artifact and a secret-scan
    report is a map of the repository's secrets.
  - **Matched secret content does not reach the model by default (D16).**
    Credential detection is deterministic. The agent may read counts, rule
    identities, and locations; matched content enters an agent's context only
    when the user has explicitly enabled model-assisted triage, and that choice
    is disclosed where it is made. The host's model is a third party, and a
    credential in a third party's context cannot be unsent, only rotated. This
    is the one place the product deliberately inverts its preference for
    configurability over paternalism.
  - **No Rig runtime / model key** in the installed repo (B1 / #11).

## 3. In scope / out of scope

**In scope (Tier 2 Advanced):** harness **sanitation + vetting** (capability B,
as the default baseline); the complete 115-service **à-la-carte catalogue**
(Development · Testing · Infrastructure · Product-Security); the **repo-scan
recommendation lens**; the **drift-prevention lifecycle** (rule + exact-copy +
semantic guard); user-controlled security/network policy; **built adapters and
emitted configuration for all 19 hosts and six CI providers, each emitted
through one uniform path with no verified/unverified tier**; and per-host
install docs.

**Also in scope (D7) — the delivery path.** A shipped product must be
installable by a stranger without this checkout. Rig provides a committed
install stub that fetches a pinned source reference, retires the inherited npm
publish workflow, and cuts the first production release. Correctness without a
delivery path is not a shipped product, and the audit found no delivery path
existed.

**Also in scope (D11) — removal.** The install manifest, managed-block markers,
pre-modification copies, and the uninstall path that consumes them. This is the
counterpart to D7: a product a stranger can install without this checkout must
also be one they can remove without it.

**Out of scope (D18) — version migration.** Rig is distributed as a source
archive and an install stub, not through a package manager, so there is no
upgrade channel to specify and no migration between installed versions. Taking a
newer Rig is a reinstall, which is already required to be idempotent, and the
manifest already records what the previous install put where. This is recorded
as a deliberate exclusion rather than left silent, so that a later reader does
not read the absence as an oversight.

**Out of scope → Tier 3:** Cap A (local-model / LangGraph runtime); persistent cross-session memory
store; semantic-brain runtime judgment (goal-drift / tool-chain intent) + isolation infrastructure
(sandbox / egress proxy / DLP / JIT-cred broker / immutable telemetry).

**Deferred to Gate 2 (product design), not Gate 1:** the catalogue-selection
manifest; exact policy schema and parser; host-specific paths, event schemas,
deny payloads, merge mechanics, and matchers; the multi-host executable test
strategy; report/security-verdict formats; the graft mechanism; and the exact
recovery-credential mechanism (key type, generation flow, and storage
prompt) plus how many recovery credentials Rig offers or requires (D20). Gate
2 must preserve the Gate-1 requirement for one machine-readable policy plus a
user-facing guide and always-on agent pointers to both.
**Backlogged (README / future scope), not this pipeline:** the visual capability-management
dashboard. **Done 2026-07-24:** deprecated-tier-vocabulary archive under
`../../archive/deprecated-tier-taxonomy/` plus README / agent-context refactor.

## 4. Delivery model

**Default-on agent-tech-safety baseline + à-la-carte capability catalogue.**

- **Baseline (default-on, user-controlled):** harness **sanitation**
  (security-first) + drift-prevention rule + secret floor + git/CI sync floor.
  The default onboarding path does not profile or show the menu until
  sanitation completes. An explicitly approved policy may disable a control or
  the entire baseline; the workflow then continues in a truthfully reported
  unprotected state.
- **À-la-carte catalogue (user-selected):** organised **family → group → service → grade** — the user
  picks *which* capabilities and *what grade* (minimal → maximal thoroughness) of each.
- **Onboarding flow:** host handoff → **sanitise unless explicitly disabled**
  (distrust before profile by default) → profile the trusted harness/codebase,
  or record sanitation not run → present the **scan-recommended menu** → user
  selects/overrides → **auto-pull** razor-scoped dependencies →
  **transition-install** by grafting onto the existing framework.
- **Lifecycle:** when enabled, the drift-prevention rule + layered drift guard
  (byte-exact sync check + agent semantic guard) keep every tool's context
  coherent as the repo evolves — statelessly (the repo's own docs are the
  memory). Re-enabling a disabled control requires a fresh run; stale success is
  never reused.
- **CI:** Rig additively integrates its enabled repo-scope checks into a
  verified existing provider. If no CI exists, the user selects a verified
  provider and approves creation of a minimal native pipeline. Unknown or
  unverifiable existing CI is preserved and fails visibly rather than
  receiving advisory-success treatment.

## 5. The à-la-carte catalogue (frozen, mutually exclusive)

**Taxonomy: `family → group → service → grade`** (4 levels). Grade (minimal/mid/maximal) is
per-service thoroughness. The scan marks each service applicable/not-recommended but never forbids it.
The determinism ladder (unit → property → mutation → contract → chaos → E2E) is expressed as
inter-service **dependencies** (auto-pull), orthogonal to grade. **The catalogue is mutually exclusive
(MECE)** — every capability is owned by exactly one service.

All **115 frozen leaves are production commitments and release-blocking**.
Every leaf has service-specific identity, owned scope and adjacent exclusions,
applicability, dependencies, cumulative grade behavior, checks, and acceptance
evidence. A TODO fragment, generic filler, repeated boilerplate, or merely
non-empty file does not constitute an authored service pack.

**Four families → groups** (service-level detail in `../../archive/grilling/advanced-grilling.md` §GA-9k/9l/9m/9n and the
`references/` taxonomies):

- **Development** — code creation & modification · code quality gates · debugging & diagnosis ·
  dependency management (dev-facing) · documentation · architecture & design · data & schema ·
  performance (code-level: **profiling only**) · repo/project hygiene.
- **Testing** — unit · integration (incl. internal-contract) · end-to-end · test strategy & planning ·
  regression · property-based & fuzz · test-data management · flaky & reliability · **performance &
  load (dev-facing — sole home for perf/load test authoring)** · test maintenance & refactoring ·
  **mutation** (restored ladder rung; 10-tool taxonomy in `references/`).
- **Infrastructure** — provisioning & IaC · CI/CD pipeline architecture · container & orchestration ·
  networking · observability · storage & data infra · scaling & reliability (**chaos engineering** +
  infra-level capacity load) · cost management · environment & config management (**sole home for
  runtime secret *injection*** — mechanics only) · disaster recovery & continuity.
- **Product-Security** (the selectable security family — product/app security, distinct from the
  baseline) — secrets & credential handling (encryption · leak-scan · rotation; *content*, not
  injection) · static & dependency vulnerability scanning (SAST/SCA/IaC-scan + scan-depth dial) ·
  license compliance · active red-team / penetration simulation (maximal grade).

**MECE reconciliation (locked):** perf/load *test-authoring* → **Testing** only (Development keeps
profiling; Infrastructure keeps capacity load); runtime secret *injection* → **Infrastructure** only
(Product-Security keeps secret content/handling).

## 6. What "correct" looks like — the acceptance properties

1. **No blowout / light-touch integration** — minimal footprint; grafts onto the existing framework,
   preserves user content, and performs only user-approved namespaced merges.
2. **Safe by default, controlled and reported honestly** — protections are
   enabled and deny by default; the user may configure or disable them; only
   controls that actually ran may be reported as protection.
3. **Mutually exclusive services (MECE)** — no service's scope duplicates or subsets another's; where
   two could combine, they are combined.
4. **Honest host/CI coverage** — Rig builds and emits for the whole roster
   through one uniform path (no host a second-class citizen) and no axis emits
   speculative configuration. Genuine vendor absence degrades explicitly. Rig
   draws no verified/unverified tier: every emitted axis is proven the same
   way, by automated tests that the correct bytes land in the correct paths,
   and the honest statement that enforcement has not been observed firing lives
   in the host registry header rather than a per-host claim.
5. **Highly configurable** — the `family → group → service → grade` dial and
   the user security/network policy hold end-to-end; recommendations and
   defaults never override an explicitly approved user choice.
6. **Complete and honest service behavior** — all 115 service packs are
   specific and reviewable, and every selected service produces one observable
   outcome without no-op or silent passes.

## 8. Handoff to Gate 2

The current Gate 2 is reopened by this re-grill. `rig-product-design` must amend,
version, and re-freeze `technical-spec.md` against this file and
[`../acceptance.md`](../acceptance.md). That file is the **only**
implementation authority. A SOW, task list, coverage plan, or later-dated
ruling may describe or propose work but cannot override it.

Evaluation is ordered:

1. The **specification gate** proves a single authority, complete Gate-1-to-
   Gate-2 traceability, no unresolved contradictions or placeholders, and a
   fresh-context semantic review for completeness and testability.
2. Only after that passes may the **code gate** evaluate implementation and
   first-wire correctness. Green code tests cannot compensate for a failed or
   unapproved specification gate.

**Gate integrity is mechanical, not clerical (D5, revised D10, D17, D19).** This
file and
[`../acceptance.md`](../acceptance.md) are protected by signature rather than by
repository process. At freeze, the intent owner signs the combined SHA-256
digest of both files with a key that no agent on their machine can operate
without a live human act. The
specification gate recomputes that digest and verifies that signature before
anything else runs. An agent holding full repository and shell access can edit
these files, and can edit the recorded digest and signature sitting beside them,
but it cannot produce a signature that verifies — so an edited Gate 1 fails the
gate instead of quietly moving the bar it is measured against.

**The gate is armed by the signer identity, not by the signature (D17).** A
repository holding the signer identity file is armed: a signature that is
missing, malformed, or non-verifying is a **failure**, not a downgrade to a
warning. Absence had previously fallen through to the honest-fallback language
in §9, which made the whole control opt-out — a context that wanted to edit Gate
1 could delete the signature first and proceed under a line of output the user
skims. A repository with no signer identity at all is unarmed: the gate runs,
reports Gate 1 as unprotected in those words, and does not block, so that work
before a key exists and a stranger who cloned the repository under `AT-DIST-1`
can both still run the suite. Disarming therefore requires deleting the signer
identity itself, which is a deliberate act rather than a cleanup.

**The floor is a property of the key, and the intent owner attests it (D19).**
The requirement is that the private half is not usable by an agent that holds
the machine: it cannot be read off disk, and it cannot be loaded once and then
reused silently. A key held in the machine's secure element behind a per-signature
biometric meets it; so does a detached hardware authenticator; a plain on-disk
key does not, and neither does one parked in a long-lived agent. Where the
product elsewhere permits a weaker user-configured signer, Gate 1 integrity does
not inherit that allowance: a signer an agent could operate with no human
present would defeat the entire control.

The gate cannot check this property, and does not pretend to. No signature
format available here carries proof that an authenticator was involved, so the
key class is recorded by the intent owner alongside the signer identity as a
statement of what they used. The verification that does happen — signature
valid, key listed — is what stops the silent edit, because the agent's obstacle
is that it cannot sign as the intent owner at all, not that a checker would
catch the wrong sort of key. Specifying a check that cannot be implemented would
buy nothing and cost the reader their trust in the rest of this section.

The specification gate runs **before** the code tests and short-circuits them.
Ordering is the requirement, not mere presence — a suite that can go green while
the specification gate is unrun or failing is the exact defect this revision
exists to close.

**Review is independent by construction (D8).** Gate 2, and every one of the
115 service leaves, is authored in one context and reviewed in a **fresh
session**. Review is report-only and its receipt is pinned to the exact content
digest reviewed. There is no human sampling step; the intent owner accepts that
the authoring and reviewing contexts can share a blind spot, recorded in §9.

These are workflow separations, not staffing requirements. A single maintainer
may run the product, design, implementation, review, and acceptance stages
through separate agent contexts and may intervene at any point. No named-person
or organization-size requirement is part of the product.

## 9. Recorded residual risks

These are accepted, not solved. They are recorded so a later reader does not
mistake them for oversights.

- **Nothing checks the reviewer (D8).** Human sampling was declined. If the
  reviewing context shares a blind spot with the authoring context, filler
  passes review and reaches users. This is the direct carry-over risk from the run
  that produced 432 `TODO` fragments under a prior agent deployment on this
  same scope.
- **Enforcement is documented, not observed (host-tier amendment).** Rig ships
  one configuration for all 19 hosts and its automated tests prove the correct
  bytes land in the correct paths — not that a deny actually fires on any host.
  No host's enforcement has been observed firing, and Rig makes no claim that it
  has. The honest statement of this lives in the host registry header, not in
  user-facing output; a user who wants it reads it there.
- **A user-global write has global blast radius (D9).** Installing in one
  repository changes behavior in every project that host opens. This is
  disclosed at install time in the user's own output, naming the file written
  outside the repository (AT-HOME-1); there is no separate prompt.
- **Gate 1 integrity depends on a key the intent owner must hold (D10).** If
  that key is lost, or was never obtained, nothing protects Gate 1 from an agent
  that can write the repository. The honest fallback is a visible multi-file
  edit rather than a barrier, and it must be described that way rather than
  presented as protection.
- **A signature stops forgery, not persuasion (D10).** An agent that asks the
  intent owner to approve a Gate 1 revision, and receives that approval, is
  through the control by design. D10 defends against a silent edit, not against
  a maintainer who has been convinced.
- **Arming is not tamper-proof, only loud (D17).** An agent with full write
  access can delete the signer identity file as easily as the signature and land
  the repository back in unarmed mode. From inside the repository, "never armed"
  and "deliberately disarmed" are not distinguishable, because distinguishing
  them needs an anchor outside the repository and this product has none — the
  same absence of infrastructure-level access control that produced D10 in the
  first place. D17 raises the cost of the bypass from deleting a signature to
  deleting the maintainer's identity file, and makes the second act visible. It
  does not make it impossible.
- **The key's class is attested, not proven (D19).** The gate checks that the
  signature verifies against a listed key. It cannot check that the key is the
  hard-to-operate one the intent owner says it is, because no signature format
  available to this product carries that evidence. If the intent owner signs
  with a plain on-disk key while recording something stronger, Gate 1 reads as
  protected and is not. This is a risk taken knowingly in exchange for not
  writing a requirement that no implementation could satisfy; the previous
  wording did not remove the risk, it concealed it behind a check that would
  have had to be faked to ship.
- **A substituted signer defeats the gate under any key type (D19).** An agent
  that can write the repository can replace the signer identity file with a key
  of its own and sign its Gate 1 edits with that. A key-type requirement never
  closed this, since the type string is chosen by whoever writes the file. What
  stands against it is the same thing D17 relies on: the substitution is a
  visible change to a short, stable file the intent owner can read. Detecting it
  needs an anchor outside the repository, and this product has none.
- **An edit inside a managed block is lost on removal (D11).** Managed blocks
  are Rig-owned territory and their markers say so, but a user who edits inside
  one loses that edit when the block is removed. Relatedly, a file whose markers
  have been stripped or rewritten by another tool can only be reported
  best-effort at uninstall, leaving the user manual work. Both are preferred to
  the alternative, which was restoring a pre-install snapshot over months of the
  user's own edits.
- **Deterministic-only secret detection leaves triage to the user (D16).**
  Refusing to route matched content through the host's model means Rig cannot
  tell a live credential from a test fixture, so users will see false positives
  and sort them by hand unless they opt into model-assisted triage. This cost was
  accepted because the failure it avoids — a real credential in a third party's
  context — cannot be undone.
- **Local-only findings cost shared visibility (D15).** Keeping reports off the
  repository and out of CI artifacts means a team has no shared history of what
  its checks found, and a CI failure tells a reviewer only that something failed
  and how much. Reproducing the detail requires running the check locally.
- **An exhausted recovery-credential list is a deliberate dead end (D20).** If
  a user loses the everyday policy signer and every credential they ever
  registered for recovery, Rig will not invent a further fallback to let them
  back in — the same choice already made for the Gate 1 integrity signer
  (D10), applied here to a separate trust domain. The mitigation is upfront:
  Rig offers a set of recovery credentials at setup and again at every later
  signer setup, so a user who takes the offer has more than one chance to
  avoid this state, but taking none of them is still possible, and it still
  ends here.
