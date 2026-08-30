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
conventions the target lacks). This points against D24's current mechanical-only
detection and would need its own grilling, not a silent edit.
[Adaptation eval](../reasoning/2026-08-30-adaptation-eval-claude-task-master.md) ·
[Product vision and tiered adaptive install](../reasoning/2026-08-30-rig-product-vision-and-tiered-adaptive-install.md)

Two live install traps that run surfaced, to fix regardless of direction. The
first was originally recorded as "a 5.8 MB unignored copy of vendored skill
source dumped into `.claude/skills/`" — but the code shows that dump is a
`--with-runtime` artifact, not the default. `rig/lib/payload.js:95-99` filters
the vendored-skills copy to `.md` only unless `activeDelivery` (set by
`--with-runtime`/`--openclaw-mcp`) is on; the eval that surfaced the 5.8 MB was a
runtime install. The still-true default-install trap is smaller: even
markdown-only, the installer writes ~64 `SKILL.md` skill dirs plus the whole
`.rig/` tree into the target and writes no `.gitignore`, so payload lands
uncommitted-but-unignored (kilobytes of markdown, not megabytes of code). The
second trap stands as recorded: an emitted instruction to "regenerate
`wiki/status.md` every three minutes per CLAUDE.md" (`rig/tier-1/routing.md`
~lines 22-25) in a target repo that has no wiki and no such convention.
[Path A/B scoping](../reasoning/2026-08-30-office-hours-path-a-path-b-scoping.md)
