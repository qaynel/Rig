---
status: active
checked: 2026-08-22
owner: rig-product-design
---

# The MVP roadmap

> **This file is a map, not a rulebook.** The documents that actually decide
> anything are [`gate1/acceptance.md`](../gate1/acceptance.md) and
> [`gate2/technical-spec.md`](../gate2/technical-spec.md). If this file
> disagrees with either, they are right and this file is wrong. The ruling this
> roadmap executes is
> [D24](../reasoning/2026-08-21-mvp-agent-discretion-build.md).

Checked against the files on **2026-08-22**.

---

## What the MVP is

A stranger with `git`, `curl`, and `sh` installs Rig into a repository with one
command. Rig reads what that repository already uses, installs only into host
trees that exist, and offers the full catalogue: **115 service leaves at Policy
grade** plus **all 55 swallowed skills**. Nothing fabricates a pass. Every leaf
declares its grade.

It is deliberately broad and deliberately shallow. Breadth is the product claim;
depth arrives afterwards, one leaf at a time, driven by what beta users actually
reach for.

## What the MVP is not

- Not a demonstration of "an agent cannot move its own goalpost." D24 suspends
  per-leaf owner review, so this release does not prove the property Rig exists
  to prove. Recorded deliberately; reversible by promotion.
- Not a claim that 115 services are deeply supported. One leaf
  (`development.code-quality.lint-format`) has evidence behind it. The other 114
  state baseline practice and say so.
- Not a claim of complete safety-oriented capabilities or safety benchmarking.
  Standard engineering safeguards remain active for the beta.
- Not the end of the fifteen-slice delivery plan. This roadmap reorders the
  early part of that plan for time-to-beta; the rest survives intact.

---

## Where things actually stand

| Layer | State |
|---|---|
| Catalogue structure | **Done.** `rig/catalog.json` defines all 115 services: ids, families, groups, labels, MECE `owns`/`excludes`, delivery, fragment paths, per-grade check ids, slices. |
| Catalogue content | **All 115 authored and gate-proven.** 805 fragments carry declared grade content; the honest authorship check reports zero failures. |
| Swallowed skills | **55 vendored, all wired (2026-08-23).** `rig/manifest.json` carries three per-host `install_vendored_skills` entries; `rig/lib/payload.js` expands them at install time. New `tests/vendored-skills-install.test.js` binds the installed layout. |
| Host map | **Researched.** 19 hosts with instruction / skills / hook / MCP paths; seams exist in `host-capabilities.js`, `renderers.js`, `ci-adapters.js`, `config.js`. |
| Specification gate | **Armed and green.** The signed oracle verifies over the frozen five-file manifest; all 68 acceptance cases pass against `rig/lib` modules and 115 Policy-grade fragments authored under D24. Fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`. |
| Distribution | **`install.sh` and `5.0.0` shipped.** Package is `5.0.0` (private); a released tag is not yet cut. |
| Oracle signature | **Armed.** The owner signature verifies over the unchanged oracle with the protected `gate1-owner` fingerprint. |
| Licence position | **Approved.** The swallowed source is MIT-licensed `garrytan/gstack` version `1.60.1.0` at `7c9df1c…`; its notice and local modifications are recorded and must ship with every installed copy, with no endorsement claim. |

---

## The ordered path

**Authority prerequisite completed 2026-08-21.** The intent owner approved the
D24/one-gate contract and the MIT distribution ruling, and both Gate 1 files now
carry the amendment. The completed testing infrastructure and its manifest
still require the owner's live-human signature before production implementation.

Each step has one verifiable outcome. After that amendment, do not start a step
before the one above has reached its stated result. The specification gate is
expected to be red for missing product behavior when the owner signs it; code
makes the already-signed oracle green.

### 1. Repair the record — **done 2026-08-21**

The wiki now records D24, the two record defects, and this roadmap.

**Verify:** `wiki/status.md` names D24, the unwired swallowed suite, and the
restored upstream licence/provenance evidence.

### 2. Build and freeze the complete specification gate — **signed 2026-08-22**

**Standing red cleared 2026-08-21.** The swallowed-suite README and the status
record now describe the neutralized credential shapes without reproducing them.
The secret floor passes, followed by all 264 root tests and all 15 pi-extension
tests.

**Gate signed 2026-08-22.** `scripts/check-advanced-spec.js` runs
ahead of code tests and `npm run test:code` is the implementation-only split.
All 68 amended acceptance cases have deterministic static titles, every Gate 2
trace row names its exact manifested target, and the stable five-file manifest
verifies under the owner signature. D24 supersedes D23, so the
catalogue-content target covers all 115 leaves.

Effort remaining: none for the gate. **Verify:** the gate runs first and
short-circuits code tests; `npm run test:code` runs code tests alone; every one
of the 68 cases maps to an executable target; the product oracle is green; and
the owner signature verifies over the exact oracle and testing-infrastructure
manifest.

### 3. Wire the swallowed skills and ship a real install path — **done 2026-08-23**

All 55 skills and the plumbing tree install through `rig/manifest.json`. Native
hosts (Claude, Codex, Antigravity) get each skill under `rig-<name>/` with the
frontmatter `name:` rewritten to match the installed directory so discovery
resolves correctly; instruction-only hosts get the neutral `.rig/skills/<name>/`
layout the router already knew. `LICENSE.upstream` and `UPSTREAM.md` ship into
every install root the notice must reach. `_core` installs under its declared
name `rig`, satisfying the frozen oracle's 55-count without a re-sign.

**Lean default, added 2026-08-23 ([AD-37](../index/decisions.md)):** a default
`sh rig/bootstrap.sh` (no `--with-runtime`) installs every `SKILL.md` but no
per-skill code or the `.rig/plumbing` tree — same `active_delivery` gate as the
runtime engine. `.tmpl` build inputs and `TODOS-format.md` never land, in
either mode. See the [lean-install protocol](../reasoning/2026-08-23-lean-install-protocol.md).

`install.sh` is present, works on macOS, resolves either `--version` or `latest`
against the GitHub API, downloads to a temp path before executing, and refuses
tags containing shell metacharacters or path traversal. `package.json` is
`5.0.0` (private). A pre-release tag has not yet been cut; that remains for
step 7's release checks.

**Verify:** `node --test tests/vendored-skills-install.test.js` proves the
installed layout end to end; `sh rig/bootstrap.sh --tier 1 --target <fresh>`
puts 55 skills into the target under their Rig names on Claude/Codex/neutral.

Tag-cutting still pending.

### 4. Context-aware onboarding — **done 2026-08-23**

The shipped bootstrap now calls the 19-host registry when `--hosts` is omitted,
selects only hosts with bounded repo-relative markers, and reports both the
detected host and the marker that selected it. `--hosts` and `RIG_HOSTS` remain
exact explicit overrides; duplicate IDs are collapsed and unknown IDs fail.
Shared `AGENTS.md` alone selects nothing, and `generic` remains explicit-only.

Every payload mutation now goes through one append-only record-before-mutate
writer. Copy, tree-copy, vendored-skill rewrite, executable mode, and pointer
append operations receive pending/applied records with preimage and post-write
digests. Paths are containment-checked through symlinks before mutation.
Family selection remains explicit and trimmable, defaulting to the full set;
host detection does not infer catalogue families.

**Verify:** `node --test tests/context-aware-onboarding.test.js` installs into a
Claude-only repo without Codex/Copilot trees, keeps a bare repo free of implicit
host trees, proves explicit narrowing, compares every payload file to the
journal, and refuses an out-of-root detected-host symlink.

### 5. Author all 115 leaves at Policy grade — **done 2026-08-23**

The bulk pass, in family batches: development 26, testing 40, infrastructure 31,
product-security 18. Each leaf keeps its existing fragments (`identity`,
`minimal`, `mid`, `maximal`, plus `slices/*` where `rig/catalog.json` defines
them), authored to the shape the lint-format leaf already demonstrates.

Two rules bind every fragment:

- **Declare the grade.** Each fragment states that it is Policy-rung baseline
  practice, not tailored to the installing repository.
- **Never fabricate a pass.** A missing or malformed binding is a named, nonzero
  coverage gap. No generic success command, no silent skip.

No leaf authored in this step may claim Context or Evidence grade. lint-format
remains the only leaf permitted a higher claim, on its own existing evidence.

Effort: L (the largest step; the signed gate from step 2 remains unchanged as
its named product-behavior failures are cleared).
**Verify:** the specification gate passes with zero `TODO(Slice 10)` fragments
remaining; every leaf returns real content and a stated grade.

### 6. Prove the complete catalogue gate — **done 2026-08-23**

With all 115 leaves carrying real content, the already-signed `AT-SHAPE-6`
target must pass without any D23 carve-out. Confirm this rather than assume it:
if the gate cannot pass at all 115, the authoring in step 5 is not finished.

The unmodified signed specification gate passed over all 115 leaves after the
authorship function was made capable of reporting real fragment failures. The
owner signature verified first; both complete-catalogue targets then reported
zero failures, and the full suite finished at 344/344 root tests plus 15/15
pi-extension tests.

**Verify:** `npm test` passes without changing any of the five manifested oracle
files.

### 7. Release

Three release checks remain:

1. Confirm every installed copy carries the owner-approved upstream MIT notice
   and exact `1.60.1.0` provenance with no endorsement claim.
2. Confirm the signing mechanism remains armed and verifies the owner signature
   created at step 2 against the unchanged oracle. Owner action is required
   again only if the oracle itself changed.
3. Run the full production evidence set and cut `v5.0.0`.

Effort: S once the signature lands. **Verify:** the nine ordered release
checks in Gate 2 §12.3 pass at the bytes being claimed.

### 8. After beta — promote on evidence

Beta feedback decides which leaves earn depth. Promote Policy → Context →
Evidence one leaf at a time, under the ordinary authored-service gate with owner
review restored. Each promotion also restores, for that leaf, the property D24
suspended.

This is where the fifteen-slice delivery plan resumes unchanged.

---

## The owner action, isolated

Everything else in this roadmap can proceed without the intent owner after the
authority prerequisite and step-2 freeze. These cannot be delegated:

| Action | Why only the owner | When |
|---|---|---|
| Sign the completed D24/one-gate oracle | The amendment and MIT ruling are approved. The remaining physical signature is an owner act by design; signature before code plus oracle immutability after is the enforcement mechanism. | Before production implementation, at step 2. |

---

## Traps specific to this roadmap

- **A green suite still means nothing until step 2 lands.** The committed tests
  are calibrated to pass against placeholder content. Do not read green as
  specification health before the gate exists.
  [traps](../index/traps.md#the-suite-is-green-and-means-nothing)
- **Policy grade is a floor, not a disclaimer.** A leaf that says "baseline
  practice" and then fabricates a pass has failed anyway. The safety baseline is
  untouched by D24.
- **Step 5 is where the placeholder failure recurs if the label slips.** The
  only thing separating D24's output from what GA-10 rejected is that the grade
  is declared on the fragment's face. A fragment that reads as coverage is the
  old defect wearing new words.
- **D24 does not authorise editing the frozen oracle.** It authorises authoring
  catalogue content and building the delivery path. Acceptance does not move.

---

## Keeping this file honest

Time-sensitive like [status](../status.md). Rewrite it in place as steps
complete; do not append revision notes. Anything dated belongs in
[`reasoning/`](../reasoning/) and is cited from here.
