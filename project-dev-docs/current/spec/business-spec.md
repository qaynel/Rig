# Tier 2 Advanced — Gate 1 (RE-GRILLED AND FROZEN 2026-07-26)

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
    delegated policy-edit mode for future proposals, but neither path lets the
    agent activate its own proposal. Delegation is proposal authority, not
    consent.
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
  - **Rig builds for every host; Rig claims only what it has run (D1, D2).**
    Adapters are built and configuration emitted for the complete supported
    roster, so no user of any host receives less than they receive today.
    Enforcement is *advertised as verified* only for an axis with a real
    passing first wire. Every other axis ships as emitted-but-unverified. The
    release gate binds the advertised set, not the built set.
  - **An unverified axis says so, and does not ask (D3).** Install output and
    run reports state each host's claim status in the user's own words:
    verified, or emitted with enforcement unverified and an invitation to
    report. Rig does not gate the unverified path behind a confirmation prompt:
    a prompt suppresses exactly the field reports that promote the remaining
    axes, and an undisclosed binding reads to the user as a working one.
  - **Approval is never silently skipped (D6).** User-presence approval uses a
    verified host-native prompt where one exists, otherwise a user-configured
    external signature. Where neither is available, activation is **refused and
    reported unavailable**. Rig specifies the signer interface and verifies
    signatures; it ships no signing binary and stores no key material.
  - **Agent prompts must not invent policy consent.** Every installed base
    prompt states that prior approvals, delegated edit mode, chat wording, tool
    access, urgency, or a broad task request never authorize activation. The
    agent may draft only under an explicit current request or a recorded
    delegated-edit receipt, and every activation still needs exact-revision
    user approval.
  - **Writes outside the repository are permitted, attributed, and never
    destructive (D9).** Where a vendor ships only a user-global surface, Rig
    may write host configuration outside the repository by appending or
    namespaced additive merge only. It never overwrites, and it discloses the
    global blast radius at install time. Every entry Rig writes to a shared
    user-global file carries the identity of the repository that wrote it, from
    the first installation onward, so that uninstalling one repository leaves
    every other repository's configuration intact and reinstalling replaces
    rather than accumulates.
  - **No Rig runtime / model key** in the installed repo (B1 / #11).

## 3. In scope / out of scope

**In scope (Tier 2 Advanced):** harness **sanitation + vetting** (capability B,
as the default baseline); the complete 115-service **à-la-carte catalogue**
(Development · Testing · Infrastructure · Product-Security); the **repo-scan
recommendation lens**; the **drift-prevention lifecycle** (rule + exact-copy +
semantic guard); user-controlled security/network policy; **built adapters and
emitted configuration for all 19 hosts and six CI providers, with verified
enforcement advertised for the first-wired subset and honest
emitted-but-unverified disclosure everywhere else** (D1, D2, D3); and per-host
install docs.

**Also in scope (D7) — the delivery path.** A shipped product must be
installable by a stranger without this checkout. Rig provides a committed
install stub that fetches a pinned source reference, retires the inherited npm
publish workflow, and cuts the first production release. Correctness without a
delivery path is not a shipped product, and the audit found no delivery path
existed.

**Out of scope → Tier 3:** Cap A (local-model / LangGraph runtime); persistent cross-session memory
store; semantic-brain runtime judgment (goal-drift / tool-chain intent) + isolation infrastructure
(sandbox / egress proxy / DLP / JIT-cred broker / immutable telemetry).

**Deferred to Gate 2 (product design), not Gate 1:** the catalogue-selection
manifest; exact policy schema and parser; host-specific paths, event schemas,
deny payloads, merge mechanics, and matchers; the multi-host executable test
strategy; report/security-verdict formats; and the graft mechanism. Gate 2 must
preserve the Gate-1 requirement for one machine-readable policy plus a
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
4. **Honest host/CI coverage (D1, D2, D3)** — every *advertised* executable
   axis has a complete evidence-backed contract and a successful first-wire
   result before initial release. Axes that are built and emitted without a
   first wire are not advertised as verified and say so in the user's output.
   Unsupported axes degrade explicitly; no axis emits speculative
   configuration. The distinction the product must never blur is between "we
   installed this" and "we have seen this work".
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

**Gate integrity is mechanical, not clerical (D5, revised D10).** This file and
[`../acceptance.md`](../acceptance.md) are protected by signature rather than by
repository process. At freeze, the intent owner signs the combined SHA-256
digest of both files with a key that attests hardware user presence. The
specification gate recomputes that digest and verifies that signature before
anything else runs. An agent holding full repository and shell access can edit
these files, and can edit the recorded digest and signature sitting beside them,
but it cannot produce a signature that verifies — so an edited Gate 1 fails the
gate instead of quietly moving the bar it is measured against.

Hardware-attested presence is the floor for this use specifically. Where the
product elsewhere permits a weaker user-configured signer, Gate 1 integrity does
not inherit that allowance: a signer an agent could operate with no human
present would defeat the entire control.

The specification gate runs **before** the code tests and short-circuits them.
Ordering is the requirement, not mere presence — a suite that can go green while
the specification gate is unrun or failing is the exact defect this revision
exists to close.

**Review is independent by construction (D8).** Gate 2, and every one of the
115 service leaves, is authored in one context and reviewed in a **fresh
session by a different model**. Review is report-only and its receipt is pinned
to the exact content digest reviewed. There is no human sampling step; the
intent owner accepts that a shared blind spot between authoring and reviewing
models is a residual risk, recorded in §10.

These are workflow separations, not staffing requirements. A single maintainer
may run the product, design, implementation, review, and acceptance stages
through separate agent contexts and may intervene at any point. No named-person
or organization-size requirement is part of the product.

## 9. Recorded residual risks

These are accepted, not solved. They are recorded so a later reader does not
mistake them for oversights.

- **Nothing checks the reviewer (D8).** Human sampling was declined. If the
  reviewing model shares a blind spot with the authoring model, filler passes
  review and reaches users. This is the direct carry-over risk from the run
  that produced 432 `TODO` fragments under a prior agent deployment on this
  same scope.
- **Four verified hosts is a narrow base (D2).** The initially verified hosts
  have similar permission models, so the enforcement design will be shaped by
  their particular conventions and may fit later hosts poorly.
- **A user-global write has global blast radius (D9).** Installing in one
  repository changes behavior in every project that host opens. This is
  disclosed in the D3 install line; there is no separate prompt.
- **Gate 1 integrity depends on a key the intent owner must hold (D10).** If
  that key is lost, or was never obtained, nothing protects Gate 1 from an agent
  that can write the repository. The honest fallback is a visible multi-file
  edit rather than a barrier, and it must be described that way rather than
  presented as protection.
- **A signature stops forgery, not persuasion (D10).** An agent that asks the
  intent owner to approve a Gate 1 revision, and receives that approval, is
  through the control by design. D10 defends against a silent edit, not against
  a maintainer who has been convinced.
