---
status: active
checked: 2026-08-21
owner: rig-grilling
phase: acceptance-authoring
---

# Lint-format leaf — consolidated production intent

This is the single-place synthesis of the frozen intent for the first
production leaf, `development.code-quality.lint-format`. It is **synthesis, not
a new decision**: every statement below traces to a closed audit ruling
(`GA-15`–`GA-35`, plus the reconciled release contract for questions 1–3). If
this document and a `GA-` trace disagree, the trace wins and this is wrong.

Its purpose is to give acceptance authoring (and, after re-freeze,
`rig-product-design`) one readable statement of who the leaf is for, what it
must do, and what counts as a failure — without re-deriving it from twenty
separate traces. The runnable cases synthesised from it are drafted in
[`lint-format-acceptance-draft.md`](lint-format-acceptance-draft.md).

Governing sources: the closed-decisions table in
[`lint-format-grilling-handoff.md`](lint-format-grilling-handoff.md), the
immutable
[`lint-format-production-grilling-audit.md`](../reasoning/2026-08-20-lint-format-production-grilling-audit.md),
and the `GA-` rows in [`../index/decisions.md`](../index/decisions.md).

---

## User and problem

**User.** An engineer onboarding Rig into a real repository that already has, or
needs, linting and formatting — from a single JS package to a polyglot
monorepo with nested components. They own the repository, its existing
toolchain, and its CI.

**Problem.** Lint/format tooling is either already present (and must not be
trampled), partially present, or absent; it is spread across components in
different ecosystems; and running repository-declared tasks means running the
repository's own untrusted code. The user needs Rig to improve and prove code
quality across the whole repository **without** replacing what works, running
anything they did not approve, or claiming coverage it did not earn. [`GA-15`,
`GA-16`, `GA-19`, `GA-20`, `GA-26`, `GA-35`]

**Desired outcome.** Lint-format ships as a genuinely production-supported
catalogue leaf inside normal Rig — default-on safety baseline, full
19-host/six-provider commitment — that discovers the whole repository, proposes
a reviewable plan, runs only what the user approves, grades each component
cumulatively Policy → Context → Evidence, reports failures honestly and
locally, and claims support only where it produced real evidence. [`GA-15`,
release-contract reconciliation for questions 1–3]

---

## Business rules (the frozen intent, by area)

**Release boundary and contents.** Production, not preview. Lint-format is the
only initially supported catalogue leaf; the other 114 leaves remain
commitments that block their own support and the complete-catalogue claim, not
this leaf. The default-on agent-tech-safety baseline, existing user
disablement, and truthful reporting all remain. [questions 1–3, `GA-15`]

**Product promise (hybrid-plus).** A repository's existing lint/format
toolchain is preserved by default. Rig may offer supported setup where none
exists and surface a better Rig-supported alternative where one does, but the
user alone decides whether to adopt it. Rig never silently replaces a working
tool. [`GA-16`, `GA-17`]

**Ecosystem and layout.** Applicability is open-ended and derived from the
repository Rig actually lands in, not a fixed language or package-manager
roster. Discovery covers the whole repository — root projects, workspaces,
nested packages, polyglot components — and every discovered component is
presented in the reviewable plan, where the user may deselect components before
apply. [`GA-19`, `GA-20`]

**Command discovery.** Commands are discovered semantically from each
component's manifests, tool configuration, and declared tasks. Fixed script
names are not the contract, and direct-tool substitution is not assumed;
ambiguous matches return to the user rather than being guessed. Repository-
declared workflows are preserved. [`GA-21`]

**Grade meaning.** Exactly cumulative Policy → Context → Evidence: govern the
change, understand the change, prove the change. Levels are cumulative and Rig
uses the lowest level capable of a definitive answer. Commodity syntax, format,
type, and static checks are inputs; Evidence (Level 3) requires verifiable
evidence, not merely an agent opinion. The method is universal across services,
but only lint-format is specified and proven now. [`GA-22`, `GA-23`]

**Consent and execution.** Selecting the service authorizes nothing to run.
Approval of the concrete plan authorizes exactly its listed read-only commands,
working directories, and components. Every repository-owned task is untrusted
code — disclosed as such and run under Rig policy, least privilege, secret
isolation, network restriction, and resource/time limits; `shell: false` is
never presented as a safety guarantee. Mutating fixes always need separate
approval. [`GA-25`, `GA-26`]

**Read-only guarantee.** A check approved as read-only that mutates the working
tree is a failure. Rig detects the mutation, stops before any further planned
command runs, fails the check, and reports the exact changed paths with
before/after evidence. It does not auto-restore the tree and does not let the
check continue. [`GA-27`]

**Check scope.** Diff-scoped (changed files) by default; the user may request
whole-repository or another explicit scope on demand. Rig never silently
widens scope. Every scope honors each component's own ignore rules and runs in
that component's working directory. [`GA-28`]

**Autofix.** A separate mutating action, never folded into or triggered by a
read-only check. The user explicitly invokes a specific fix command under its
own approval; Rig offers both format fixes and safe lint fixes, re-verifies by
re-running the check, and leaves results as uncommitted working-tree edits the
user owns and reviews. Rig never commits them or claims ownership of the
source. [`GA-29`]

**CI behavior (Evidence enforcement).** The Evidence level enforces lint-format
in CI, whole-scope at the gate. Rig integrates additively into verified
existing CI; absent or unsupported CI is proposed as an explicit, separately
approved, user-chosen-provider plan; a pipeline Rig does not understand is
preserved and reported, never silently edited or replaced. Rig never
auto-creates or owns CI on selection alone. [`GA-30`]

**Command drift.** A task that has changed since approval is outside that
approval. Rig treats the binding as stale/tampered: it stops, does not run the
changed command, discloses the exact drift, and requires the user to review and
approve a freshly rediscovered plan before execution resumes. A changed command
is a new command. [`GA-31`]

**Output privacy.** Failure-centric, local, and redacted. Reports stay on the
producing host, keep failures, vacuous runs, and coverage gaps, and omit
routine passes. CI emits only verdict, counts, and rule identities — no source
snippets, no uploaded artifacts. Redaction covers secrets, PII, and any
host-rooted sensitive data, stripped on the producing host before any output
leaves it. Reports explain each finding as a clear, actionable item, not a raw
dump. Secret-matched content reaches the agent only on explicit opt-in. [`GA-32`]

**Failure semantics.** Every abnormal ending is its own distinct, reported,
non-passing state: timeout, cancelled, missing-dependency, signalled,
partial-output, and command-not-found each say exactly why. None is collapsed
into "pass," reduced to a generic "failed," or treated as non-blocking. [`GA-33`]

**Lifecycle.** Follows the frozen install-manifest/removal contract. Reinstall
is an idempotent resume that claims nothing until complete. Removal reverses
exactly what the manifest recorded Rig created — generated CI, configuration,
managed blocks — and touches nothing else. User-invoked source fixes are the
user's own edits and always survive uninstall. [`GA-34`]

**Support claim.** Claimed per component and only on positive evidence: a
component is supported only when Rig built at least the Policy level, discovered
and bound its commands, and produced a real (non-placeholder) check result
under plan-bound consent. The whole repository is supported only when every
discovered, non-excluded component clears that bar; any approved exclusion
suppresses the whole-repository claim while the covered components stay
truthfully supported. Install success alone is not coverage. [`GA-35`, `GA-24`]

---

## In scope

- Whole-repository, open-ecosystem discovery and semantic command binding for
  lint/format across root, nested, workspace, and polyglot components.
- The cumulative Policy → Context → Evidence grade for the lint-format domain
  only.
- Plan-bound, read-only check execution of repository-owned tasks under Rig's
  untrusted-code controls.
- Autofix as a separately approved mutating action.
- Additive CI integration / proposed bootstrap for the Evidence level.
- Failure-centric, local, redacted reporting with a full abnormal-ending
  taxonomy.
- Idempotent reinstall and manifest-exact removal for this leaf.
- Per-component, evidence-backed support claims with partial-coverage
  exclusions.

## Out of scope / non-goals

- Authoring or implementing any of the other 114 catalogue leaves. The
  universal grade model is recorded but proven only through lint-format now.
  [`GA-23`]
- Silent tool replacement, or choosing an alternative on the user's behalf.
  [`GA-16`]
- Silent scope widening, silent CI edits, silent rediscovery of drifted
  commands, or auto-restore after a mutating check. [`GA-27`, `GA-28`,
  `GA-30`, `GA-31`]
- Routing matched secret content through the model by default. [`GA-32`]
- Claiming whole-repository support from install success or from per-run
  results alone. [`GA-35`]

## Permissions and data boundaries

- Nothing executes on service selection; only an approved concrete plan
  authorizes its exact read-only commands, directories, and components.
  Mutating fixes are separately approved. [`GA-25`]
- Repository-owned tasks run as untrusted code under policy, least privilege,
  secret isolation, network restriction, and resource/time limits. [`GA-26`]
- Reports and redaction stay on the producing host; CI carries only verdict,
  counts, and rule identities; secret content reaches the agent only on opt-in.
  [`GA-32`]

## Observable failure behavior

Each of these is externally observable and is the spine of a drafted acceptance
case: a mutating "read-only" check caught and halted with before/after evidence
[`GA-27`]; a drifted command stopped before it runs [`GA-31`]; each abnormal
ending resolving to its own named non-passing state [`GA-33`]; a partially
covered repository that names its unprotected components and withholds the
whole-repository claim [`GA-24`, `GA-35`]; and a report that stays local,
redacted, and actionable rather than a raw or uploaded dump [`GA-32`].

---

## Fixture posture for the acceptance

Two fixtures carry the whole set (intent-owner choice, 2026-08-21):

- **Spine — a single JS component** (eslint + prettier configured, a changed
  file with one lint and one format violation, plus a clean file) carries the
  entire vertical flow and every single-component edge case.
- **Polyglot — the same JS component plus one nested non-JS component** exists
  only to make whole-repository discovery [`GA-20`] and user-approved
  partial-coverage exclusion with a suppressed whole-repository support claim
  [`GA-24`, `GA-35`] observable, since neither can be exhibited by a
  single-component repository.

The concrete fixture bytes are Gate 2's to build; this document and the draft
name the fixture shape each case needs.
