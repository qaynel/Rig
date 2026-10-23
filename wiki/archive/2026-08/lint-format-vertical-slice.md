---
date: 2026-08-31
source: agent
topics: the-catalogue, catalogue-contract, authored-service-gate, delivery-plan, services-and-reports, onboarding-flow, trust-and-failure-boundaries, host-and-ci-coverage, install-manifest-removal, drift-and-secret-controls, policy-signer-recovery, specification-gate, what-rig-is, testing-strategy
status: historical
summary: Archived August 2026 reasoning on the lint-format vertical slice and the Policy/Context/Evidence capability model — 26 traces compacted.
---

# The lint-format vertical slice and the Policy → Context → Evidence capability model

Compacted on 2026-10-17 from 26 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

`development.code-quality.lint-format` was chosen as the single leaf to author
end to end, deliberately as a falsifiable test of the owner's claim that "once
the intent is clear from my side, code is cheap." It was picked on four axes:
it installs into essentially every real repository; its check is crisp and
mechanical so any friction is clearly the framework's fault; its grades map to
real differences; and it writes config into the target repo, so interrupting
its install pokes `AT-INSTALL-1` — the exact spec contradiction blocking Gate 2.
Runner-up was `development.code-quality.typecheck`.

The vertical slice then produced the GA-15..GA-35 contract through a grilling
run. `GA-15`/`AD-31` made lint-format the first production leaf, with the other
114 leaves blocking only their own support plus the complete-catalogue claim.
`GA-16` chose hybrid+plus (preserve the repo's toolchain; raise a better
alternative to the user, never decide for them). `GA-19` made the ecosystem
open-ended — "once the rig lands it should build up what is relevant to the
repo it lands in." `GA-20` scoped discovery to the whole repository, `GA-21` to
semantic discovery, `GA-24` permitted partial coverage, `GA-25` plan-bound
execution and `GA-26` untrusted task execution. `GA-27` fixed the read-only
guarantee, `GA-28` made checks diff-scoped by default, `GA-29` the autofix
policy, `GA-30` CI behaviour, `GA-31` command drift ("a changed command is a
new command"), `GA-32` output privacy, `GA-33` abnormal-ending semantics,
`GA-34` lifecycle and `GA-35` the per-component evidence-backed support claim.
`D22` kept CI enforcement at the Evidence level only.

`GA-22` supplied the capability model the grades actually mean: **Policy →
Context → Evidence** — "Govern the change. Understand the change. Prove the
change." Syntax, formatting, typechecking and ordinary static analysis are
treated as commodity inputs, not as the ladder. `GA-23` kept the model
universal in the wiki while focusing work on the one leaf. `AD-32` then mapped
P/C/E onto the existing cumulative `minimal/mid/maximal` dial rather than
adding a second axis, so `AT-LF-8`/`AT-LF-9` are satisfied by machinery every
service already passes. The round-4 correction clarified that short-circuiting
happens on **failure**, never on a clean pass: under-run, over-run and
over-claim are three symmetrical failures. `AD-33` made the component the unit
of work; `AD-34` made lint-format plan-bound and read-only by construction,
with `shell: false` explicitly *not* a safety guarantee.

The production-readiness audit's verdict was that development should not start
yet, and it enumerated twenty undocumented decisions and fourteen unverified
blockers; the grilling-release-contract trace reconciled the first three
against decisions already on record rather than treating them as new.

## Source traces

### 2026-08-19-lint-format-vertical-slice.md
- **Summary:** Handoff brief for authoring `development.code-quality.lint-format` end to end as the vertical-slice test the intent owner agreed to run.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Why this leaf, on four axes, and why it is a test rather than a task. The exact pre-authoring state of the leaf (all fragments carrying `TODO(Slice 10)`, razor-stub slices, a missing `slices/mutation-floor.md` aliased to `slices/floor.md`, the older `delivery` field without the §5.2 `disposition`/`acceptance_evidence`). The six pieces to build, the §5.6 authored-service-gate definition of done, and three acceptance probes ending in the `AT-INSTALL-1` interrupt probe.
- **Verbatim rulings / rejections / traps:** Runner-up named and declined: "`development.code-quality.typecheck`. Same virtues, slightly more language-dependent. Start with lint-format." Trap recorded on the interrupt probe: "§6.6/§10 say a failed apply rolls everything back; §7.6 and `AT-INSTALL-1` say applied writes stay in place and the install resumes… These are two incompatible answers for the same failure." Constraint: "Tier 2 materialization only. Do not route new behavior through the old plugin runtime." Decision rule: "Green and cheap: the 'intent clear, code cheap' claim held. Freeze the specs and author the remaining 114."

### 2026-08-20-vertical-lint-format-production.md
- **Summary:** Owner instruction to branch out and vertically deploy the one linting leaf to production rather than deploy horizontally.
- **Decisions:** GA-15, AD-31
- **Status:** historical
- **What it recorded:** The owner's direction to create a branch off the advanced-catalogue branch and raise a draft PR back into it, with the intent of vertical rather than horizontal deployment.
- **Verbatim rulings / rejections / traps:** "create a branch and lets continue with vertically deploying that one linting leaf that was left in between. branch this out from the implement-advanced.... and raise a draft pr back to it with the intent of verically deploying it to producting rather than horizonatal deployment"

### 2026-08-20-lint-format-production-context.md
- **Summary:** Context gather for taking lint-format from the branch's current state to production — what is already true and the seven things still blocking the support claim.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The production fork is closed; Gate 2 carries it as `AD-31`. What was already true: service-specific metadata, a convention disposition, authored fragments with no placeholder filler, discovery of repo-owned `package.json` scripts rather than installing a tool, argv arrays with `shell: false`, and a focused 15/15 test pass. Seven remaining blockers: Gate 2 still a failed candidate with three open findings, Gate 1 signature unarmed, no executable specification gate, no authored-service gate, incomplete §7.6 manifest/resume, absent distribution, and no exact-digest leaf review receipt. Then an eight-step deployable sequence.
- **Verbatim rulings / rejections / traps:** Trap: "The rest of the catalogue still has 428 placeholder files, which remain valid blockers for those leaves and the complete-catalogue claim, not for lint-format's first-leaf production path under `AD-31`."

### 2026-08-20-lint-format-production-grilling-audit.md
- **Summary:** Report-only audit verdict — production development should not start yet; twenty undocumented decisions and fourteen unverified blockers.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The full enumerated list of twenty undocumented decisions (release boundary, release contents, host coverage, product promise, ecosystem scope, repository layouts, command discovery, grade meaning, applicability, execution consent, shell trust, read-only guarantee, check scope, autofix, CI behavior, command drift, output privacy, failure semantics, lifecycle, support claim) and fourteen unverified blockers.
- **Verbatim rulings / rejections / traps:** "**Verdict:** production development should not start yet. The proposed vertical release contradicts the frozen business contract, which still says all 115 catalogue leaves block release." Blocker 4 trap: "The service is labelled 'convention-only' while it executes real commands, conflicting with the executable-first business rule." Blocker 11: "`npm run` can execute shell content even when Rig launches npm with `shell: false`. The current safety wording does not acknowledge this." Recommendation: "first amend and re-freeze Gate 1 so the release contract explicitly permits **full safety baseline + complete required host/CI coverage + lint/format as the only supported catalogue leaf**, while the other leaves block only their own support and the 'complete catalogue' claim."

### 2026-08-20-lint-format-grilling-release-contract.md
- **Summary:** Reconciliation of audit questions 1-3 against decisions the repository already records — not three new decisions.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** (1) The release boundary is production, not preview, per `GA-15`/`AD-31`, though frozen Gate 1 must still be amended because its text makes all 115 leaves release-blocking. (2) The release is the normal Rig product — full default-on agent-tech-safety baseline plus lint-format as the only supported leaf; disabling a baseline control stays allowed and must be reported truthfully. (3) The initial release retains the full 19-host and six-CI-provider commitment.
- **Verbatim rulings / rejections / traps:** "A genuinely unavailable vendor axis may emit nothing only under the existing explicit `unsupported` rule; incomplete implementation is not unsupported."

### 2026-08-20-linting-harness-capability-model.md
- **Summary:** Owner's formal Linting Harness Capability Model — three ascending levels, Policy → Context → Evidence.
- **Decisions:** GA-22
- **Status:** historical
- **What it recorded:** The owner pasted a full formal specification and opened with "this split exactly". Level 1 (Change-Aware Policy Enforcement) evaluates the change as a transition between repository states against policy, returning ALLOW/DENY/REQUIRE_APPROVAL/WARN. Level 2 (Contextual System Reasoning) treats the repo as a graph and detects indirect privilege escalation, policy contradictions, trust-boundary violations. Level 3 (Evidence-Based Behavioural Verification) converts a claim into a testable hypothesis and produces verifiable evidence. The levels are cumulative (L3 ⊃ L2 ⊃ L1), and the design principle is to use the lowest level capable of a definitive answer.
- **Verbatim rulings / rejections / traps:** Owner's opening: "this split exactly". On the deliberate floor: "The model deliberately begins **above conventional syntax and style linting**. Syntax validation, formatting, type checking, and ordinary static-analysis diagnostics are treated as commodity capabilities provided by existing IDEs, compilers, and specialised linters." On L3: "The use of an LLM or agent is **not itself sufficient** to constitute Level 3. The distinguishing characteristic is the production of verifiable evidence." Canonical formulation: "**Govern the change. Understand the change. Prove the change.**" And: "This does **not** mean Level 1 is less trustworthy. In fact, deterministic policy enforcement may provide the strongest possible conclusion for questions that can be expressed as explicit rules. The hierarchy reflects **scope of capability**, not merely confidence." Design principle: "Rig should always use the **lowest capability level capable of reaching a definitive answer**."

### 2026-08-20-universal-capability-model-leaf-first.md
- **Summary:** Keep the capability model noted as universal in the wiki; focus the work on this one leaf.
- **Decisions:** GA-23
- **Status:** historical
- **What it recorded:** The owner's instruction on scope for the capability model.
- **Verbatim rulings / rejections / traps:** "note universal in the wiki for now focus on this leaf only"

### 2026-08-20-lint-format-hybrid-plus.md
- **Summary:** Hybrid+plus — preserve what the repo has; if Rig knows a better alternative, raise it with the user and let them decide.
- **Decisions:** GA-16
- **Status:** historical
- **What it recorded:** The owner's ruling on the tool-selection promise.
- **Verbatim rulings / rejections / traps:** "Hybrid+plus if a better alternative exsists within rig we bring it up with the user it is for them to decide"

### 2026-08-20-lint-format-open-ecosystem.md
- **Summary:** Ecosystem scope is open-ended — once Rig lands it builds up what is relevant to the repo it landed in.
- **Decisions:** GA-19
- **Status:** historical
- **What it recorded:** The owner's ruling on ecosystem breadth.
- **Verbatim rulings / rejections / traps:** "open ended. Basically we want the intent to build. once the rig lands it should build up what is realvent to the repo it lands in."

### 2026-08-20-lint-format-whole-repository.md
- **Summary:** Repository layout scope is the whole repository, not the root package only.
- **Decisions:** GA-20
- **Status:** historical
- **What it recorded:** The owner's ruling on repository-layout scope.
- **Verbatim rulings / rejections / traps:** "whole repository looks good"

### 2026-08-20-lint-format-semantic-discovery.md
- **Summary:** Command discovery is semantic, not a fixed list of script names.
- **Decisions:** GA-21
- **Status:** historical
- **What it recorded:** The owner's one-line ruling on command discovery.
- **Verbatim rulings / rejections / traps:** "semantic discovery"

### 2026-08-20-lint-format-partial-coverage.md
- **Summary:** Partial coverage is permitted — install what is covered, report the rest.
- **Decisions:** GA-24
- **Status:** historical
- **What it recorded:** The owner's ruling on applicability.
- **Verbatim rulings / rejections / traps:** "yup partial looks good"

### 2026-08-20-lint-format-plan-bound-execution.md
- **Summary:** Execution consent is plan-bound — selection authorizes nothing.
- **Decisions:** GA-25
- **Status:** historical
- **What it recorded:** The owner's approval of the plan-bound execution-consent model.
- **Verbatim rulings / rejections / traps:** "looks good"

### 2026-08-20-lint-format-untrusted-task-execution.md
- **Summary:** Repository tasks stay untrusted under Rig policy, least privilege, secret isolation, network restrictions and resource/time limits.
- **Decisions:** GA-26
- **Status:** historical
- **What it recorded:** The owner's approval of the untrusted-task-execution boundary, plus an instruction to save context and name where to point the next agent.
- **Verbatim rulings / rejections / traps:** "that looks good, save context till now and tell me where to point the agent to continue this process"

### 2026-08-20-lint-format-confirmations.md
- **Summary:** Two bare owner confirmations recorded verbatim during the lint-format grilling run.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Two consecutive approvals with no further content.
- **Verbatim rulings / rejections / traps:** "1. Do that yes" / "2. Yeah do that"

### 2026-08-21-lint-format-read-only-guarantee.md
- **Summary:** The read-only guarantee as proposed is approved.
- **Decisions:** GA-27
- **Status:** historical
- **What it recorded:** The owner's approval of the read-only guarantee (detect a mutating check, halt, evidence it, never auto-restore).
- **Verbatim rulings / rejections / traps:** "that looks good"

### 2026-08-21-lint-format-check-scope.md
- **Summary:** Checks are diff-scoped by default; the user can request the other scopes.
- **Decisions:** GA-28
- **Status:** historical
- **What it recorded:** The owner's ruling on check scope.
- **Verbatim rulings / rejections / traps:** "diff scoped by default user can request the others if they ask"

### 2026-08-21-lint-format-autofix.md
- **Summary:** The autofix policy as proposed is approved.
- **Decisions:** GA-29
- **Status:** historical
- **What it recorded:** The owner's approval of autofix as a separately approved mutating action re-verified by re-running the check.
- **Verbatim rulings / rejections / traps:** "that looks good"

### 2026-08-21-lint-format-ci-behavior.md
- **Summary:** The CI-behaviour proposal is approved.
- **Decisions:** GA-30
- **Status:** historical
- **What it recorded:** The owner's approval of the additive/absent/unknown CI treatment, where grade selection proposes CI rather than auto-wiring it.
- **Verbatim rulings / rejections / traps:** "that looks good to me too"

### 2026-08-21-lint-format-command-drift.md
- **Summary:** A drifted package script is treated as stale/tampered — Rig stops, shows what drifted, and requires re-approval of a freshly rediscovered plan.
- **Decisions:** GA-31
- **Status:** historical
- **What it recorded:** The owner's full ruling on command drift.
- **Verbatim rulings / rejections / traps:** "Treat it as stale/tampered and re-approve (recommended). The moment the underlying task no longer matches what was approved, Rig stops, does not run the changed command, shows you exactly what drifted, and requires you to review and approve a freshly rediscovered plan before it runs anything. Approval was for a specific command; a changed command is a new command."

### 2026-08-21-lint-format-output-privacy.md
- **Summary:** Reports are failure-centric, local and redacted; CI emits only verdict, counts and rule identities; secret-matched content never reaches the agent without explicit opt-in.
- **Decisions:** GA-32
- **Status:** historical
- **What it recorded:** The owner's ruling plus an added instruction to strip secrets and host-rooted personally identifying information and explain failures to the user as actionable items.
- **Verbatim rulings / rejections / traps:** "Failure-centric, local, redacted (recommended). Reports stay on the machine that produced them and record what matters — failures, vacuous runs, coverage gaps — while omitting routine passes. CI emits only the verdict, the counts, and which rules fired — never source snippets or uploaded artifacts. Secret-matched content does not reach the agent's context unless you explicitly opt into model-assisted triage. This is exactly how Rig already treats findings and secrets everywhere else." And: "Do this plus take out the secrets and personally identified information or whatever things that should not be leaked out rooted to like the host on which the rig is running on and then explain clearly to the user in terms of actionable items. What is going wrong?"

### 2026-08-21-lint-format-failure-semantics.md
- **Summary:** Each abnormal ending is its own reported, non-passing state — never collapsed into "pass," never silently swallowed.
- **Decisions:** GA-33
- **Status:** historical
- **What it recorded:** The owner's ruling on failure semantics.
- **Verbatim rulings / rejections / traps:** "Each abnormal end is its own reported, non-passing state (recommended). Timeout, cancelled, missing-dependency, signalled, partial-output, and command-not-found each resolve to a specific truthful result — never collapsed into \"pass,\" never silently swallowed. This is the frozen \"one honest outcome\" rule applied to the messy endings: a check that couldn't reach a verdict says exactly why."

### 2026-08-21-lint-format-lifecycle.md
- **Summary:** The first lifecycle option (reinstall, legacy coexistence, removal of generated CI/config) is approved.
- **Decisions:** GA-34
- **Status:** historical
- **What it recorded:** The owner's approval of the first of the proposed lifecycle options.
- **Verbatim rulings / rejections / traps:** "first one looks good to me too"

### 2026-08-21-lint-format-support-claim.md
- **Summary:** Support is claimed per component, evidence-backed; the whole-repository claim holds only when every discovered non-excluded component clears the bar.
- **Decisions:** GA-35
- **Status:** historical
- **What it recorded:** The owner's ruling on the exact observable threshold for "lint/format is production-supported."
- **Verbatim rulings / rejections / traps:** "Per-component, evidence-backed; whole-repo only when everything covered (recommended). A component is \"supported\" only when Rig genuinely built at least the Policy level for it, discovered and bound its commands, and produced a real check result — not a placeholder — under approved consent. The whole repository is \"supported\" only when every discovered, non-excluded component clears that bar. Any exclusion you approved suppresses the whole-repository claim, while the components that are covered stay truthfully supported. This is the convergence of everything you've already frozen: partial coverage, no false green, truthful reporting."

### 2026-08-21-evidence-only-lint-format-ci.md
- **Summary:** CI enforcement is kept at the Evidence level only; make that clarification wherever necessary.
- **Decisions:** D22
- **Status:** (no status field)
- **What it recorded:** The owner's ruling narrowing CI to the Evidence grade.
- **Verbatim rulings / rejections / traps:** "Yeah, keep CI only for evidence level make that clarification wherever necessary"

### 2026-08-21-gate2-lint-format-retrace.md
- **Summary:** Gate 2 v0.6 — traces D21's nineteen `AT-LF-*` cases into §13, narrows the release boundary to the single lint-format leaf, designs the grade ladder, and clears the three round-3 findings.
- **Decisions:** AD-32, AD-33, AD-34, AD-26, AD-30
- **Status:** historical
- **What it recorded:** Most of the lint-format vertical was already specified catalogue-wide (plan-bound apply with exact-digest approval §6.6, executable-first checks AD-15/§9.1, diff-vs-repo scope §9.2, the record-before-write install journal §7.6, local redacted reporting §9.3, additive/absent/unknown CI §11.2/AD-23) and needed no new machinery. The one genuinely new thing was the grade ladder. `AD-32` mapped Policy/Context/Evidence onto `minimal/mid/maximal` as domain-specific names of the same cumulative dial. `AD-33` (§5.8) made the component the unit of work with a `needs_user_choice` state that blocks apply. `AD-34` (§9.4) made lint-format plan-bound and read-only by construction with the six distinct abnormal endings. The three round-3 findings were closed: the recovery credential class (`AD-30`), the three senses of "verified" (`AD-26`), and the model-assisted triage channel (§8.2/§8.8, one gated default-closed `secrets.model_assisted_triage` field).
- **Verbatim rulings / rejections / traps:** On the ladder as a ceiling: "'Lowest level capable of a definitive answer' is a ceiling, not a floor (GA-22). The selected grade caps how high evaluation may climb; it does not force it that high." On commodity checks: "Commodity checks are inputs, not the grade (GA-22/23)." On CI: "Evidence ⇒ CI proposal, not CI auto-wire (GA-30, `AT-LF-13`)… Grade selection never auto-creates or owns CI." Trap on `shell: false`: "disclosed as untrusted code with `shell: false` explicitly not a safety guarantee." Rejected: "A separate axis would have duplicated that machinery and created a second place for identity to drift." Scope note: "It does not freeze Gate 2 — that needs a fresh report-only review at the new digest (`645e5536…`) and the intent owner's Gate 1 signature."
