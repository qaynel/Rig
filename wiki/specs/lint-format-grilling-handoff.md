---
status: active
checked: 2026-08-21
owner: rig-grilling
phase: stage-c-handoff
---

# Lint-format production grilling handoff

This is the live continuation point for the first production leaf's Gate 1. It
is a handoff, not gate authority. **All twenty audit questions are closed**
(`GA-27`–`GA-35` plus the reconciled 1–3); the intent below is frozen in the
wiki. **Stage A and Stage B are done as of 2026-08-21**: the intent owner
approved the drafted `AT-LF-1`–`AT-LF-19` set below, and they are now written
into Gate 1 (`gate1/acceptance.md` §7H, `gate1/business-spec.md`'s D21 note),
re-freezing Gate 1 at 68 cases — see [status](../status.md). What remains of
Stage B is step 6, the intent owner's physical signature over the new digest;
Stage C (handing the frozen, signed intent to `rig-product-design`) follows.
The immutable audit is
[`lint-format-production-grilling-audit.md`](../reasoning/2026-08-20-lint-format-production-grilling-audit.md);
the current production map is [`lint-format-roadmap.md`](lint-format-roadmap.md).

## Start here

1. Read [`../Home.md`](../Home.md), [`../status.md`](../status.md),
   [`../../rig/tier-1/routing.md`](../../rig/tier-1/routing.md), and the full
   `rig-grilling` skill before acting.
2. Read the closed-decisions table and every linked intent-owner trace below.
   Do not reopen or re-ask a closed decision. If a decision genuinely must
   change, return to the intent owner, record why, and file a new trace — never
   edit a filed one.
3. Read the acceptance surface you are about to amend: the frozen 49-case set in
   [`../index/acceptance-cases.md`](../index/acceptance-cases.md) and its
   set-equality contract with Gate 2, [`../gate1/acceptance.md`](../gate1/acceptance.md)
   §7, and the traceability table in [`../gate2/technical-spec.md`](../gate2/technical-spec.md) §13.
4. Preserve the dirty worktree. It contains concurrent user/agent changes,
   including rule-copy work unrelated to this leaf. Do not discard or overwrite
   them.

## Goal

The twenty product-intent decisions are closed. Author independent observable
acceptance examples and the smallest exact runnable cases for the complete
lint-format vertical flow, amend and re-freeze Gate 1 to match the vertical
release contract, then hand the frozen intent to `rig-product-design`. Do not
implement production behavior in this phase.

**Done as of 2026-08-21:** the acceptance is authored, approved, and landed in
Gate 1 (D21, 68 cases). Remaining: the intent owner's signature (Stage B step
6) and the Stage C handoff to `rig-product-design`.

## Closed decisions

| Audit item | Frozen intent |
|---|---|
| 1. Release boundary | Production, not preview. Lint-format ships first; the other 114 leaves block their own support and the complete-catalogue claim. Gate 1 still needs the matching amendment. |
| 2. Release contents | Normal Rig: default-on agent-tech-safety baseline plus lint-format as the only initially supported catalogue leaf. Existing user disablement and truthful reporting remain. |
| 3. Host coverage | Full 19-host/six-provider commitment. Only evidence-backed genuine vendor absence may emit `unsupported`. |
| 4. Product promise | Hybrid-plus: preserve existing tools, offer setup where needed, surface a better Rig-supported alternative, and let the user decide. Never replace silently. |
| 5. Ecosystem scope | Open-ended and repository-derived, not a fixed language or package-manager roster. |
| 6. Repository layout | Whole-repository discovery across root projects, workspaces, nested packages, and polyglot components. The user may deselect components before apply. |
| 7. Command discovery | Semantic discovery from manifests, tool configuration, and declared tasks. Fixed names are not the contract; ambiguous matches return to the user. |
| 8. Grade meaning | Exactly cumulative Policy → Context → Evidence: govern, understand, prove. Use the lowest level capable of a definitive answer. Commodity syntax/format/type/static checks are inputs. The method is universal across services, but current work stays on this leaf only. |
| 9. Applicability | Partial, truthful installation is allowed. Covered components proceed; exact uncovered components require user-approved exclusion, remain visibly unprotected, and suppress whole-repository support claims. |
| 10. Execution consent | Service selection authorizes nothing to run. Approval of the concrete plan authorizes its exact listed read-only commands, working directories, and components. Mutating fixes need separate approval. |
| 11. Shell trust | Every repository-owned task is untrusted code. Disclose that boundary and run it under Rig policy controls, least privilege, secret isolation, network restrictions, and resource/time limits. `shell: false` is not a safety claim. |
| 12. Read-only guarantee | A read-only check that mutates the working tree is a failure. Rig detects the mutation, stops further execution, fails the check, and reports the exact changed paths with before/after evidence. No auto-restore, no continuation. Detection, stop, evidence, and truthful repository state are externally observable. |
| 13. Check scope | Diff-scoped (changed files) by default; the user may request whole-repository or other scopes on demand. Rig never silently widens scope. Every scope honors each component's ignore rules and runs in its working directory. The enforcement/CI scope is settled under item 15. |
| 14. Autofix | A separate mutating action, never folded into a read-only check. The user explicitly invokes a specific fix command with its own approval; Rig offers both format and safe lint fixes, re-verifies by re-running the check, and leaves results as uncommitted working-tree edits the user owns. |
| 15. CI behavior | The Evidence level enforces in CI whole-scope at the gate. Additive into verified existing CI; absent/unsupported CI is proposed as an explicit, separately approved, user-chosen-provider plan; a pipeline Rig does not understand is preserved and reported, never silently edited or replaced. Rig never auto-creates or owns CI on selection alone. |
| 16. Command drift | A drifted task is stale/tampered. Rig stops, does not run the changed command, discloses the exact drift, and requires a freshly rediscovered plan the user approves before execution resumes. No silent rediscovery, no running stale text. A changed command is a new command. |
| 17. Output privacy | Failure-centric, local, redacted. Reports stay on the producing host; CI emits only verdict, counts, and rule identities. Redaction covers secrets, PII, and any host-rooted sensitive data, stripped on the producing host before output leaves it. Reports explain findings as clear actionable items, not raw dumps. Secret content reaches the agent only on explicit opt-in. |
| 18. Failure semantics | Every abnormal ending is its own distinct, reported, non-passing state: timeout, cancelled, missing-dependency, signalled, partial-output, and command-not-found each say exactly why. Never collapsed into "pass," never a generic "failed," never non-blocking. |
| 19. Lifecycle | Follows the frozen install-manifest/removal contract. Reinstall is an idempotent resume claiming nothing until complete; removal reverses exactly what the manifest recorded Rig created (generated CI, config, managed blocks) and nothing else; user-invoked source fixes always survive uninstall. |
| 20. Support claim | Production support is claimed per component and only on positive evidence: a component is supported only when Rig built at least the Policy level, discovered and bound its commands, and produced a real (non-placeholder) check result under plan-bound consent. The whole repository is supported only when every discovered, non-excluded component clears that bar; any approved exclusion suppresses the whole-repository claim while the covered components stay truthfully supported. Install success alone is not coverage; per-run-only reporting is not enough. |

The intent-owner traces for these rulings are:

- [`vertical-lint-format-production.md`](../reasoning/2026-08-20-vertical-lint-format-production.md)
- [`lint-format-hybrid-plus.md`](../reasoning/2026-08-20-lint-format-hybrid-plus.md)
- [`lint-format-open-ecosystem.md`](../reasoning/2026-08-20-lint-format-open-ecosystem.md)
- [`lint-format-whole-repository.md`](../reasoning/2026-08-20-lint-format-whole-repository.md)
- [`lint-format-semantic-discovery.md`](../reasoning/2026-08-20-lint-format-semantic-discovery.md)
- [`linting-harness-capability-model.md`](../reasoning/2026-08-20-linting-harness-capability-model.md)
- [`universal-capability-model-leaf-first.md`](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)
- [`lint-format-partial-coverage.md`](../reasoning/2026-08-20-lint-format-partial-coverage.md)
- [`lint-format-plan-bound-execution.md`](../reasoning/2026-08-20-lint-format-plan-bound-execution.md)
- [`lint-format-untrusted-task-execution.md`](../reasoning/2026-08-20-lint-format-untrusted-task-execution.md)
- [`lint-format-read-only-guarantee.md`](../reasoning/2026-08-21-lint-format-read-only-guarantee.md)
- [`lint-format-check-scope.md`](../reasoning/2026-08-21-lint-format-check-scope.md)
- [`lint-format-autofix.md`](../reasoning/2026-08-21-lint-format-autofix.md)
- [`lint-format-ci-behavior.md`](../reasoning/2026-08-21-lint-format-ci-behavior.md)
- [`lint-format-command-drift.md`](../reasoning/2026-08-21-lint-format-command-drift.md)
- [`lint-format-output-privacy.md`](../reasoning/2026-08-21-lint-format-output-privacy.md)
- [`lint-format-failure-semantics.md`](../reasoning/2026-08-21-lint-format-failure-semantics.md)
- [`lint-format-lifecycle.md`](../reasoning/2026-08-21-lint-format-lifecycle.md)
- [`lint-format-support-claim.md`](../reasoning/2026-08-21-lint-format-support-claim.md)

Questions 1–3 were reconciled from existing authority in
[`lint-format-grilling-release-contract.md`](../reasoning/2026-08-20-lint-format-grilling-release-contract.md).

## Handoff script — author the acceptance, re-freeze Gate 1

All product-intent decisions are closed. This is the remaining work, in order.
It runs in **two stages** so no signed, frozen artifact is silently broken:
Stage A is reversible authoring that disturbs nothing frozen; Stage B is the
amendment that trips the set-equality gate and stales the Gate 1 signature, and
it only lands with the intent owner's approval and signature. The intent owner
chose this staged path deliberately — do not collapse it into one pass.

### Stage A — author (reversible; disturbs nothing frozen)

1. **State the consolidated final intent.** In one place, write the lint-format
   leaf's user, problem, outcome, business rules, in/out of scope, non-goals,
   permissions, data boundaries, lifecycle, and observable failure behavior —
   synthesised from the twenty closed decisions below, citing their `GA-` IDs.
   This is synthesis, not a new decision. Put it in a new
   `wiki/specs/lint-format-intent.md` and link it from
   [`the-catalogue.md`](../topics/the-catalogue.md) and
   [`delivery-plan.md`](../topics/delivery-plan.md).
2. **Author the observable acceptance examples.** Write plain given/when/then
   examples for the complete vertical flow — inspect → recommend → user
   scope/tool choice → plan → approve → apply → Policy → Context → Evidence
   checks → report → drift → reinstall → remove — plus the edge cases each
   closed decision names (read-only mutation caught, diff vs. requested scope,
   autofix as separate consent, CI additive/absent/unknown, command drift,
   redaction + actionable reporting, each abnormal ending, partial-coverage
   support claim). These are descriptions, not test files yet.
3. **Draft the runnable case specs.** For each example, write the smallest exact
   runnable acceptance case: its ID (propose an `AT-LF-*` block), its observable
   pass/fail condition, and the fixture it needs. Each **must fail against the
   current prototype** and pass only when this intent is met. **Do not reuse the
   implementation-authored npm-only tests as Gate 1 proof** — Gate 1 authors the
   verdict independently. Keep these as specs in the handoff or a draft file;
   do not yet add them to the frozen index.

Stage A changes only new files and topic hubs. Surface the drafted `AT-LF-*`
set and the acceptance examples to the intent owner for approval before Stage B.

**Stage A drafted 2026-08-21, approved 2026-08-21 by the intent owner:**
consolidated intent in [`lint-format-intent.md`](lint-format-intent.md); 19
observable examples and runnable `AT-LF-1`–`AT-LF-19` case specs in
[`lint-format-acceptance-draft.md`](lint-format-acceptance-draft.md).

### Stage B — amend and re-freeze Gate 1 (breaks the gate; needs the signature)

Do this as one reviewable amendment, only after Stage A is approved.

4. **Add the cases to the frozen set.** ✅ **Done 2026-08-21.** The approved
   `AT-LF-*` cases are written into [`../gate1/acceptance.md`](../gate1/acceptance.md)
   §7H and [`../index/acceptance-cases.md`](../index/acceptance-cases.md), and
   the count and "how the set has moved" table are updated (49 → 68). This
   **breaks the set-equality gate** until Gate 2 re-traces — that is expected
   and is Gate 2's job, not this phase's.
5. **Re-freeze Gate 1 together.** ✅ **Done 2026-08-21.** The decision index
   now carries `D21` alongside `GA-27`–`GA-35`, the affected topic hubs
   (`the-catalogue.md`, `delivery-plan.md`) and `../status.md` are updated, and
   the current digests are recorded there. The Gate 1 signature is marked
   stale.
6. **Re-arm the signature.** ⏳ **Still open — the one remaining step.** The
   Gate 1 signature is a physically-present-human act only the intent owner
   can perform (`D17`/`D19`, `AT-GATE-2`). Rig cannot self-sign. The re-freeze
   is ready for the intent owner to sign against the digests in
   [`../status.md`](../status.md); until signed, an armed repository with a
   missing signature fails the spec gate by design.

### Stage C — hand off

7. **Hand the frozen, signed intent to `rig-product-design`** to specify the
   vertical technical flow and re-trace the `AT-LF-*` set into Gate 2 §13. Only
   after Gate 2 is frozen may implementation resume. Blocked on step 6.

## Independent blockers that remain

Finishing this authoring does not itself clear the existing three Gate 2 round-3
findings, arm the Gate 1 signature, build the executable specification gate or
authored-service gate, complete manifest/removal, prove distribution, or create
an exact-digest semantic review receipt. Keep those visible, but do not mix them
into this phase unless a ruling changes their required behavior.
