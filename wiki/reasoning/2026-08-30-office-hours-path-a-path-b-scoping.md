---
date: 2026-08-30
source: agent
topics: onboarding-flow, distribution-and-release, what-rig-is
decisions:
status: current
supersedes:
tags: trap, interdependency
summary: Office-hours scoping of the post-eval work — order fixed as A (concrete install bugs + a frozen rubric) then B (adaptive integration, gated by grilling), with C (real-user testing) running async. Code confirms the eval's 5.8 MB dump was a --with-runtime artifact, not the default install. Carries the two report-only investigation prompts for A and B.
---

# Office hours: scoping Path A and Path B after the +12 adaptation eval

*Filed by an agent during the 2026-08-30 office-hours session, after the eval
ground-truth packet came back. Records the direction the intent owner chose, the
code-confirmed correction to the eval's framing, the scoped work for each path,
and the two investigation prompts handed off next. Immutable; the hubs it names
carry the synthesis.*

## Direction chosen

The intent owner set the order: **Path A first** (fix the concrete install bugs
and freeze a real measurement instrument), **then Path B** (build adaptive
integration). **Path C** (getting real users to install Rig and raise issues) is
not sequenced here — it runs async as its own ongoing feedback loop; the intent
owner is already recruiting testers. A and B are each investigated separately by
a fresh agent using the prompts below, then their findings land as their own
reasoning traces.

## The code-confirmed correction to the eval

The eval scored the install produced by `--with-runtime`, not Rig's default.
`rig/lib/payload.js:95-99` filters the vendored-skills copy to `.md` only unless
`activeDelivery` is set, and `activeDelivery` is only true under `--with-runtime`
(or `--openclaw-mcp`). So the 5.8 MB of vendored TypeScript/shell, the 861
`runtime/` files, and the 97 `plumbing/` files that the eval penalized heavily on
signal-vs-noise **do not land in a default install**. Fixes L1 and #6 from the
eval, and a large share of the noise-ratio deduction, apply to the runtime
install, not the one a normal user gets.

The still-true trap for the default install: even markdown-only, the installer
writes ~64 `SKILL.md` skill dirs plus the whole `.rig/` tree into the target and
writes no `.gitignore`, so payload still lands uncommitted-but-unignored — now
kilobytes of markdown, not megabytes of code. The onboarding-flow hub is
corrected to reflect this; the immutable eval trace stands as written.

## Path A scope (no D24 conflict, ships independently)

- **A1 — Phantom convention text.** `rig/tier-1/routing.md` (installed as
  `.rig/routing.md`) emits Rig's own dev doctrine into stranger repos: the
  `wiki/status.md` 3-minute reasoning-trace cadence (~lines 22-25), "per
  `CLAUDE.md`", and the "In this source checkout, use `rig/tier-1/...`"
  conditionals (~lines 6-8, ~30). The router-as-installed is conflated with
  Rig's-own-dev-cadence in one file. Pure-markdown, small-to-medium, highest
  confidence.
- **A2 — Payload not gitignored.** `payload.js` / `bootstrap.sh` never touch the
  target's `.gitignore`. Embedded design call: gitignore the payload (tool-cache
  model) or commit it (vendored-config model). Small code.
- **A3 — Fix the instrument, then re-baseline.** No rubric file exists; +12 is
  one holistic Sonnet pass, ±5 self-reported. Freeze a 4-axis rubric with fixed
  weights, pin the model, run against a clean checkout, and run the **default**
  install (not `--with-runtime`) so the number reflects the real product. Expect
  the default baseline above +12 once the runtime-bloat deduction is gone.

## Path B scope (a gate before it is a build)

The eval's headline fix — parse `.cursor/rules` + `.kiro/steering` + root
`CLAUDE.md` + the plugin, reference them by path from `routing.md`, prune skills
to the stack, dedup the review/TDD overlap — extends the existing `inspect` stage
(`rig/lib/inspect.js`, which already knows those paths as host markers at lines
~15-25) from "which hosts exist" to "which conventions exist, and reconcile."

The catch is D24: detection is mechanical-only precisely so Rig never guesses
what a repo wants. There is a real line inside B. "Reference the existing rules
by path" is near-mechanical and safe. "Infer which skills the stack needs and
prune the rest" is judgment, which is the guess D24 forbids. B's first
deliverable is therefore a grilling gate that draws that line, then a
product-design spec, then the build. The risk in B is concentrated in the
decision, not the implementation.

## Investigation prompt — Path A (concrete bugs + measurement)

> You are investigating install-time defects in Rig, a markdown-only
> agent-workflow harness that installs into other repositories via
> `rig/bootstrap.sh` → `rig/lib/payload.js`. Report-only: do not fix, do not
> install against a real repo. Produce a ranked work-item list with file:line
> evidence.
>
> Trust but verify: a single adaptation eval on `inspo/claude-task-master-main/`
> scored +12/100 and was run with `--with-runtime`. `rig/lib/payload.js:95-99`
> shows the default install copies only `.md`; vendored `.ts/.sh`, `runtime/`,
> and `plumbing/` land only under `--with-runtime`. Confirm this and state
> exactly what the default install writes vs what `--with-runtime` adds.
>
> Characterize each, with evidence:
> 1. Phantom convention text — map every line of the installed router
>    (`rig/tier-1/routing.md`) and any other installed markdown that asserts a
>    convention, path, or file the target lacks (the `wiki/status.md` cadence
>    ~22-25, "per CLAUDE.md", the "source checkout" conditionals ~6-8/~30). For
>    each, say what a stranger repo's agent does when it hits that instruction.
> 2. Payload lands unignored — confirm the installer writes no `.gitignore`;
>    establish exactly which paths land in the target working tree for a default
>    install and that none are ignored. State the fix's design call: gitignore
>    (tool-cache) vs commit (vendored-config), with the tradeoff.
> 3. No measurement instrument — specify what a frozen, repeatable eval needs:
>    fixed axes + weights, pinned model, clean-checkout procedure, and running
>    the *default* install (not `--with-runtime`). Do not invent a score.
>
> Constraint: Tier 1 stays markdown-only in installed repos unless
> `--with-runtime` is explicit. Deliverable: a ranked work-item list — file:line,
> one-line defect, fix approach, effort (S/M/L), pure-markdown vs installer-code,
> any embedded design decision, and correctness-bug vs polish. Write findings to
> `wiki/reasoning/2026-XX-XX-path-a-bug-investigation.md` per
> `wiki/reasoning/README.md`, then update the hubs it touches.

## Investigation prompt — Path B (adapt engine: situation + work items)

> You are investigating what it takes to build Rig's adaptive-integration
> ("adapt") capability. Report-only: map the work and the decision boundary, do
> not build. Rig installs a markdown harness into an existing repo; today it
> detects which hosts a repo uses mechanically and stacks its own files beside
> the repo's existing agent config without reconciling. The one eval on a dense
> multi-host repo (`inspo/claude-task-master-main/`: 25 Cursor rules, 5 Kiro
> steering docs, a Claude plugin, `.taskmaster/CLAUDE.md`) scored +12/100:
> "merge works; adapt does not." Read the eval response under
> `.context/attachments/aA7Z67/` and
> `wiki/reasoning/2026-08-30-adaptation-eval-claude-task-master.md`.
>
> Hard constraint (D24, `wiki/topics/onboarding-flow.md`): detection is
> mechanical-only — read which known hosts a repo uses from their known paths,
> write only into trees that exist, never guess from repo shape which
> capabilities a project needs. Draw the line precisely; do not cross it
> silently.
>
> Investigate:
> 1. The current pipeline — `rig/lib/inspect.js` already knows `.cursor/rules`,
>    `.kiro/steering`, `.cursorrules` as markers (~lines 15-25). Map what
>    inspect/recommend/plan/apply and the routing template do with those files
>    today; confirm it detects presence but never reads or references content.
> 2. The eval's fixes 1-5 — for each, classify as (a) within D24 (mechanical,
>    buildable now, e.g. reference existing rules by path) or (b) requires
>    reversing/amending D24 (judgment, e.g. infer-and-prune). Be explicit about
>    which side of the line each falls on and why.
> 3. The grilling agenda — the questions that must be answered before any
>    (b)-class work is built: how far reconciliation goes, the failure mode of a
>    wrong guess, what signal justifies pruning, whether reference-by-path alone
>    moves the number. These feed a `rig-grilling` / `rig-product-design` gate.
>
> Deliverable: a work-item map split into "buildable within D24" and "gated
> behind grilling," each item with the code surface it touches, effort, and
> expected eval-axis impact; plus the grilling agenda. Write findings to
> `wiki/reasoning/2026-XX-XX-path-b-adapt-scope.md` per
> `wiki/reasoning/README.md`, then update the hubs it touches.

## Recurring cadence

Each investigation and each subsequent grilling/design/build step files its own
dated trace here so retrospection reads off the record instead of re-deriving it.
This session's scoping is that record's first entry after the eval; the two
investigation outputs are the next two.
