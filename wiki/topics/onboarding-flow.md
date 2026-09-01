# Onboarding flow

## What it is

The default staged flow is `inspect → host review → recommend → plan → apply →
check`. Sanitation precedes profiling, recommendations remain advisory, and the
user approves a content-bound plan before any write. [Gate 2 §6](../gate2/technical-spec.md#6-staged-onboarding-data-flow)

The practical job of that flow is to set up the packaged harness against the
repo as it actually exists, using delivered Rig tools while preserving the
user's current infrastructure unless they approve a change. [Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## Why it is this way

The order prevents untrusted repository harness content from influencing the
agent before it is inspected, while separating advice from authority. Planning
before applying makes every intended mutation reviewable and lets the apply
stage enforce hashes rather than rediscover intent. [Gate 1 §2](../gate1/business-spec.md)
[Advanced grilling GA-9b–GA-9c](../sources/logs/advanced-grilling.md)

It also keeps the product promise concrete: Rig first understands the current
project context, then proposes the smallest harness setup that complements that
context instead of assuming a clean-slate install.

## What the adaptive install lays down

Path B's install is deliberately inert. It pins the release skill catalogue at
`.rig/catalog.json`, stages the complete 55-skill optional shelf under
`.rig/runtime/rig/catalog/skills/` where no host discovers it, and projects
only the eight mandatory skills — `rig-code-review`, `rig-debugging`,
`rig-execution`, `rig-grilling`, `rig-implementation`, `rig-onboarding`,
`rig-product-design`, `rig-tdd` — into host discovery. Everything else waits
for an approved onboarding proposal. Install never runs `prepare`, never reads
semantic repository content, and never chooses an optional skill.

The legacy markdown-only Tier 1 install is unchanged and still fans the whole
shelf into native discovery; the two paths are separated by the
`default_delivery` / `active_delivery` manifest gates until slice 6 retires the
legacy operator path. [Slice 1 trace](../reasoning/2026-09-01-path-b-slice1-catalogue.md)

## What binds it

`AD-6` fixes the stages, `AD-7` constrains inspection, `AD-8` separates
remediation, `AD-14` keeps the full menu available, `GA-19` requires the
lint-format build to derive from the repository's actual ecosystem, and
`GA-20` makes discovery whole-repository. `GA-21` makes command recognition
semantic rather than name-based. `GA-25` binds execution consent to the concrete
plan rather than service selection. `AT-BASE-1`,
`AT-SHAPE-2`, and `AT-SCAN-*` define the observable behavior. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

A combined scan/profile/install command, automatic remediation, recommendation
as a gate, and silent host/config fallback were rejected because they collapse
distinct consent and trust boundaries. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen ordering and user control: [Gate 1](../gate1/business-spec.md)
- CLI seams and stage outputs: [Gate 2 §6](../gate2/technical-spec.md#6-staged-onboarding-data-flow)
- Sanitation mechanics: [Gate 2 §8.7](../gate2/technical-spec.md#87-sanitation-and-bounded-remediation)
- Packaged forward-deployed harness clarification: [reasoning trace](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)
- Open-ended lint-format ecosystem ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-open-ecosystem.md)
- Whole-repository lint-format ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-whole-repository.md)
- Semantic lint-format command discovery: [reasoning trace](../reasoning/2026-08-20-lint-format-semantic-discovery.md)
- Partial, truthful lint-format coverage: [reasoning trace](../reasoning/2026-08-20-lint-format-partial-coverage.md)
- Plan-bound lint-format execution consent: [reasoning trace](../reasoning/2026-08-20-lint-format-plan-bound-execution.md)
- Untrusted repository-task execution: [reasoning trace](../reasoning/2026-08-20-lint-format-untrusted-task-execution.md)
- Diff-scoped lint-format check-scope default: [reasoning trace](../reasoning/2026-08-21-lint-format-check-scope.md)
- Stale/tampered command-drift ruling: [reasoning trace](../reasoning/2026-08-21-lint-format-command-drift.md)

## What is still open

**Resolved.** The round-3 rollback/resume contradiction between §6.6 and §7.6
is resolved: apply now has one partial-failure behavior, preserving completed
writes for manifest-backed resume instead of rolling them back. The one-gate
model (2026-08-21) has since replaced the two-freeze model this section
originally described — the technical design is checked for presence, not
separately frozen — and the flow below is implemented and green.
[Resolution trace](../reasoning/2026-08-20-resolve-at-install-1.md) ·
[the two gates](the-two-gates.md) · [Status](../status.md)

For lint-format, inspection may not stop at a fixed ecosystem allow-list. It
must identify what is relevant in the repository and use that reality to build
the recommendation and proposed capability. The user still approves the
content-bound plan before any write.

That inspection covers the whole repository, including root projects,
workspaces, nested packages, and polyglot components. The resulting plan keeps
those component boundaries visible so the user can review the proposed scope
and deselect components before apply.

For every included component, discovery recognizes equivalent lint/format
behavior from manifests, tool configuration, and declared tasks rather than a
fixed script-name list. An ambiguous binding is a user decision, not permission
for Rig to guess.

An unbuildable component does not force the user to abandon covered components.
The plan may propose partial installation, but it must name the exact exclusions
as unprotected and obtain approval for them before apply. Partial coverage never
becomes a whole-repository support claim.

Selecting lint-format requests the capability but authorizes no repository code
to execute. The reviewable plan lists the exact commands, working directories,
components, and read-only intent; approval authorizes only those checks. A
mutating fix is outside that consent and requires its own approval.

Plan approval does not turn a repository task into trusted code. Even when Rig
passes a safe argv array with `shell: false`, the selected task may invoke a
shell internally. The plan discloses that boundary and execution remains under
Rig policy, least privilege, secret isolation, network restrictions, and
resource/time limits.

**D24 (2026-08-21) makes onboarding MVP step 4 and fixes what it is allowed to
infer.** Detection is *mechanical only*: read which of the 19 researched hosts a
repository already uses from their known instruction / skills / hook / MCP
paths, and write only into trees that exist. Family selection stays **explicit
and trimmable, defaulting to the full set** — Rig does not guess from repo shape
which capabilities a project needs.

The split is deliberate. Detecting that `.claude/` exists is a fact and cannot
be wrong. Inferring that a Python ETL repo "wants" the testing family is a
judgment, and when it guesses wrong it does the exact thing the à-la-carte model
exists to prevent: imposing tools the repository did not ask for. Family
auto-selection is deferred until there is real signal about which mapping is
correct, which is one of the things beta feedback is for.

**Implemented 2026-08-25 (RIG-126).** A runtime install now prints a complete
staged command sequence: inspect with mechanical host detection, host-review
to a verdict-bearing review, recommend, explicit select into `rig.json`, plan,
apply after a real host-native or external approval, and check. Check prints a
positive confirmation on success. The staged path renders the same Antigravity
manual MCP entry it later verifies. A source-checkout `rig/bin/rig` shim still
resolves only after install (126.5, deferred).

For detected Antigravity installs with selected MCP servers, onboarding also
owns a first-class manual boundary: `.rig/mcp-setup.md` contains the exact
stdio JSON to merge into the user-global Antigravity config and the installed
verification command. Rig does not write that global file; the check makes the
manual step observable instead of leaving it as an unverified template note.

**Implemented 2026-08-23.** The released bootstrap uses the registry's bounded
marker table whenever no host list is supplied. An explicit list replaces auto
detection rather than adding to it. The payload writer journals each mutation
before and after it lands, reports selection provenance and the write count,
and rejects destinations that escape through a symlink. The generic host stays
explicit-only because a shared root instruction file is ambiguous.
[roadmap](../specs/mvp-roadmap.md) ·
[ruling](../reasoning/2026-08-21-mvp-agent-discretion-build.md) ·
[v0.12 retrace](../reasoning/2026-08-22-gate2-v0.12-d24-retrace.md)

**Installed entrypoint implemented 2026-08-24.** Active-runtime installs now
journal an executable `.rig/bin/rig` command and print the complete
`inspect → recommend → plan → apply → check` command sequence after bootstrap.
The default markdown-only bootstrap still installs neither the command nor the
runtime. A shipping-path regression installs the runtime, selects lint-format,
plans and applies it through the installed command, then executes its installed
check successfully.

**Open direction (2026-08-30): adaptive integration is the unbuilt core.** The
first real adaptation run onto a dense multi-host repo
(`inspo/claude-task-master-main/`) scored **+12/100**: the merge-not-overwrite
core works, but onboarding "treated a repo with one of the richest multi-tool
agent configs you'll find as if it were empty" — it ignored 27 Cursor rules, 5
Kiro steering docs, the Claude plugin, and `.taskmaster/CLAUDE.md`, stacked
generic parallel files across three ecosystems, and pruned nothing to the
stack. The eval's single highest-value fix is to make install *parse the
pre-existing config and reconcile with it* (reference existing Cursor/Kiro rules
from `routing.md`, prune the skill set to the stack, and stop emitting
conventions the target lacks). That looked like a D24 conflict until grilling
split the work: Rig *code* stays mechanical; the onboarding *host agent* does
the judgment. The grilling is now answered — see the lock below.
[Adaptation eval](../reasoning/2026-08-30-adaptation-eval-claude-task-master.md) ·
[Product vision and tiered adaptive install](../reasoning/2026-08-30-rig-product-vision-and-tiered-adaptive-install.md)

**Scoped 2026-08-31 as "deterministic acceleration" — D24 stays intact for Rig
code.** Path B is not a mechanical reconcile-pipeline and not left wholly to
prose: Rig ships **deterministic tools the onboarding host agent invokes**
(inventory the repo's existing config, reference it by path, install a selected
skill set). The code decides nothing about what a repo "wants." Two eval
premises are withdrawn: no deletion in either direction (the fix is *selective
install*, not install-all-then-prune), and the install should trend
context-weight neutral-or-negative. The work-item map (B-1 inventory, B-2
reference-by-path, B-3 selective install, B-4 overlap surface, B-5 canonical
entrypoint, B-6 weight budget) remains the code-side split; G-class inference
*in Rig installer code* stays out of beta.
[Path B adapt scope](../reasoning/2026-08-31-path-b-adapt-scope.md)

The operator path and check closure are now complete. `install rig` always
stages the active runtime and stops at an explicit `rig-onboarding` handoff;
repeatable host selections replace detection, while omission preserves it. The
shared check measures journal-backed attributable weight with warning-only
growth thresholds and fails known projection, graft, reference, state, and
ownership regressions. [Operator and check closure](../reasoning/2026-09-01-path-b-slice6-operator-check.md)

**Locked 2026-08-31: agent-led graft, not a skill picker.** The intent owner
answered the Path B grilling. The onboarding host agent receives full repository
context, the full Rig capability catalogue (organised into families for the
agent, not as a user picker), grafting instructions, and the Rig development
pipeline. It decides how Rig fits, makes routine choices itself, and escalates
only consequential decisions (destructive replacement, security/trust,
irreversible or product-shaping forks). The user reviews a summary of the
**resulting repository improvement** — existing state, relevant families,
reuse, grafts, new capabilities, important decisions, resulting pipeline —
not a configuration wizard. Repo-specific onboarding state lives under
`.rig/`; existing repo config is not unnecessarily polluted. When capabilities
overlap, the agent calculates the delta and grafts missing Rig behaviour onto
existing infrastructure rather than picking a winner or stacking a parallel
copy. Payload size (files and bytes) is a warning; duplicate-write and
correctness regressions are hard failures. A router-only re-eval is deferred
and does not block this work. Intelligence lives in the host agent plus the
context Rig supplies, not in a "React → install A, B, C" rule engine.
D24's mechanical-only detection boundary is unchanged. What shifts is the
consent UX: D24's "default-full, user trims families" is replaced by
agent-proposed graft plus summary approval.
[Path B product direction](../reasoning/2026-08-31-path-b-product-direction.md)

**Follow-up locks 2026-08-31.** The last two Path B design questions closed.
(1) Grafts into repo-owned files are permitted, but every graft lives inside an
explicit, machine-detectable begin/end Rig-managed section
(`<!-- rig:graft capability="..." begin --> ... <!-- rig:graft end -->`) so
removal is a clean string operation and the ownership boundary is obvious in
source control. (2) The flat vendored skill shelf is reorganised into a
`family → tool/capability → skill` hierarchy, taxonomy derived from the actual
inventory and grouped by capability rather than by vendor origin/prefix; the
existing `family → group → service → grade` service catalogue is untouched,
and unification of the two taxonomies is deferred until product evidence
justifies it. Operator shape confirmed in the same exchange: one install
command (`install rig [--host <host>]`), `rig-onboarding` delivered as a Rig
skill and/or a rig-mcp tool the host agent invokes explicitly after install,
no auto-trigger; installation documentation directs the user to initiate
onboarding from their host agent as the explicit next step.
[Path B follow-up decisions](../reasoning/2026-08-31-path-b-follow-up-decisions.md)

**Technical design filed 2026-08-31.** Path B now has implementation-ready
contracts for the capability-family shelf and generated catalogue, versioned
graft sections, repository-local onboarding state, structural inventory and
overlap reports, the shared skill/CLI/MCP onboarding interface, selective host
projections, the one-command install handoff, and warning-only weight checks
with correctness hard failures. The design keeps semantic relevance and delta
judgment in the host agent, binds apply to the exact summary and proposal, and
leaves the governed service catalogue unchanged. Implementation remains
test-first after the acceptance oracle and human signature.
[Path B technical specification](../reasoning/2026-08-31-path-b-technical-spec.md)

**Path B oracle signed; implementation underway.** The verified 14-file,
83-case oracle protects the adaptive-onboarding work. Its initial red run
identified the implementation slices, and the completed catalogue slice is
already green without changing the governed 115-service catalogue.
[Path B acceptance oracle](../reasoning/2026-08-31-path-b-acceptance-oracle.md)
· [implementation resumption](../reasoning/2026-09-01-path-b-implementation-resumption.md)

**Structural inventory is now available to the onboarding flow.** It enumerates
only known harness locations, reports paths, declared metadata, hashes, and
bounded warnings, and rejects escaping or aliased symlinks. Exact-match overlap
calculation is likewise mechanical: it uses only declared capability tags and
explicit aliases, leaving relevance and the resulting change to the host agent.
State-owned Markdown reports consume these facts in the next slice.
[Inventory slice](../reasoning/2026-09-01-path-b-slice2-inventory.md)

**The prepared and proposed state is now strict and replayable.** Preparing
writes only Rig-owned state and the two mechanical reports; unchanged facts are
a byte-stable no-op, while a changed inventory clears the pending proposal and
approval. Proposing validates a complete, ordered summary plus paths and
digests before recording it, so the eventual approval can be bound to exactly
the reviewed bytes. The approved vertical slice now applies only a verified,
proposal-bound receipt: it projects selected skills, writes approved versioned
grafts through the journal, and reconciles the result into `checked` state.
[State slice](../reasoning/2026-09-01-path-b-slice3-state.md) ·
[vertical slice](../reasoning/2026-09-01-path-b-slice5-vertical.md)

The active Path B install supplies that flow through one canonical playbook at
`.rig/skills/onboarding/SKILL.md`; native onboarding skills are thin pointers,
and the CLI and MCP adapters invoke the same domain handler. Operator install
grammar and warning-only weight accounting remain separate later slices.

**Idea on file (2026-08-31, office hours pending): `/rig onboarding` skill.**
After Rig is installed, the user could invoke a single host-native command that
reads the repo as it actually exists, onboards everything that fits, and removes
or skips what does not — a single slash-command wrapper over the staged flow,
with adaptive reconciliation built in. Connection to the +12/100 adaptation eval
is direct: this would be the vehicle for the "parse the pre-existing config and
reconcile" fix the eval called out. Open questions (consent model for pruning,
one-shot vs re-runnable, markdown-only compatibility) are filed in the trace
pending office-hours discussion.
[Post-install onboarding skill idea](../reasoning/2026-08-31-post-install-rig-onboarding-skill.md)

Two live install traps that run surfaced, to fix regardless of direction. The
first was originally recorded as "a 5.8 MB unignored copy of vendored skill
source dumped into `.claude/skills/`" — but the code shows that dump is a
`--with-runtime` artifact, not the default. `rig/lib/payload.js:95-99` filters
the vendored-skills copy to `.md` only unless `activeDelivery` (set by
`--with-runtime`/`--openclaw-mcp`) is on; the eval that surfaced the 5.8 MB was a
runtime install. **Measured, not estimated (2026-08-30):** a default
Claude-only install is 209 files / 8.3 MB, 100% unignored — megabytes, not
kilobytes, driven by the vendored skill catalog landing twice (once
unprefixed at `.rig/skills/*`, once renamed at `.claude/skills/rig-*`), not
by any non-markdown content. The gitignore-vs-commit design call this trap
implies is recorded at [[graft-mechanics]]. The second trap — an emitted
instruction to "regenerate `wiki/status.md` every three minutes per
CLAUDE.md" plus the "In this source checkout, use `rig/tier-1/...`"
conditionals and the bare `(RIG-124)` citation (RIG-151/RIG-152/RIG-124.2)
— **fixed 2026-08-31.** The phantom-convention passages were rewritten as
explicit instructions to the onboarding host agent (map onto this repo's
convention at install, or drop it) — markdown-only, not a `payload.js`
transform and not bare deletion. Consistent with B1/`GA-1`; does not touch
D24. Oracle: `tests/installed-router-hygiene.test.js` (3/3 green).
[reframe-vs-transform trace](../reasoning/2026-08-31-routing-md-adaptation-not-transform.md)
· [close-out trace](../reasoning/2026-08-31-routing-hygiene-close-out.md)

Two further correctness bugs were found the same pass, by running
`bootstrap.sh` against disposable targets rather than reading source alone:
`rig/tier-1/rules/rig.md` (installed unconditionally) hardcodes
`.rig/skills/implementation/SKILL.md` as its one concrete instruction, but
that path is gated (`instruction_only_selected`) and is never written for a
Claude-only or Codex-only install — confirmed missing by direct repro. And
the vendored `rig` switchboard (`rig/catalog/skills/_core`, `name: rig`)
installs as `rig-rig` for Claude/Codex/Antigravity because the per-host
`rig-` prefix rewrite (`rig/lib/payload.js:94`) isn't exempted for the one
skill whose own name is the prefix — so `routing.md`'s "invoke the vendored
`rig` router" fallback (~lines 100-102) names a skill that doesn't exist
under that name for native-dispatch hosts. Full evidence, exact line numbers,
and a ranked fix list for all of the above:
[Path A bug investigation](../reasoning/2026-08-30-path-a-bug-investigation.md) ·
[Path A/B scoping](../reasoning/2026-08-30-office-hours-path-a-path-b-scoping.md)

## Reapplication subtracts as well as adds

**Fixed 2026-09-01.** `apply()` was additive only: it never read the previous
`state.applied` set, so a second approved proposal that dropped a skill or a
graft left the first one's artifacts on disk while state truthfully reported
them gone — and `check` could not see them, because `reconcileApplied` only
walks the *current* `applied.projections`. Apply now reconciles three sets
(previously applied, newly approved, live on disk) before the write transaction
and removes the difference inside it. It refuses to delete in three cases: an
artifact whose live digest has moved since apply wrote it (a human edited it),
an installer-staged core catalogue skill (`planSkillProjections` records those
without ever writing them, so apply must not remove them either), and any path
the journal cannot prove Rig created. Refusals are returned as `unreconciled`
warnings and persisted at `state.applied.unreconciled`, so every later `check`
re-emits them rather than the warning being seen once.
[Reconciliation trace](../reasoning/2026-09-01-path-b-hardening-issue3-reconcile.md)

## An interrupted apply must be resumable by re-running it

**Fixed 2026-09-01.** A journalled write is three steps — `pending` record,
bytes to disk, `applied` record — and a crash between the last two leaves the
desired bytes live with nothing recording them. Every preflight in `apply`
compares the live file against the *proposal's* preimage, so all of them read
that state as a third-party edit: `upsertGraftSection` and `removeGraftSection`
raised "stale file digest or preimage", `cleanProjection` raised "conflicts with
repository-owned path", `preflightOwnedFiles` raised "stale preimage digest".
Retrying repeated the same comparison, so the install was wedged in `proposed`
with no path forward that did not involve hand-editing the repository.

All four now accept live bytes that equal what the journal was writing —
`journalResumeDigest(writer, rel)` — but only while the journal's transaction is
still open, so a cleanly finished earlier install can never wave through a
proposal built on a stale view of a file. `preflightGrafts` gained a dry writer
that forwards `latest` and `interrupted` to the real one; it still cannot
mutate, but it now sees what the real write will see.
[Resume trace](../reasoning/2026-09-01-path-b-hardening-issue4-resume.md)

## An approval covers the bytes, not the skill's name

**Fixed 2026-09-01.** `selected_skills` is a list of names, so an approval
signed the *name* `qa` and `apply` read whatever the staged shelf held by the
time it ran; `check` then compared each projection against the ledger row apply
had written from that same read, so a source edited between propose and apply
was invisible from both ends. `propose` now freezes `skill_bindings` inside the
digested proposal body — per selected skill, the catalogue row's `tree_digest`
and a `projected_digest` over every file the projection will write, keyed by
its path inside the projected skill directory. `apply` re-derives both and
refuses a stale proposal when either moved or when the projection reaches a
skill the bindings do not name; `check` rebuilds the projected digest by
walking each recorded projection root on disk, so an edited sibling or a file
smuggled beside an approved `SKILL.md` is a hard failure rather than a
warning. The bindings are computed by the engine, never accepted from the
caller: a caller who could assert the digest of the bytes being approved would
be re-introducing the `verified: true` defect.
[Byte-binding trace](../reasoning/2026-09-01-path-b-hardening-issue2-bytebinding.md)
