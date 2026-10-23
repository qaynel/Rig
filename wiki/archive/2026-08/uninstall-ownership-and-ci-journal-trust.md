---
date: 2026-08-31
source: agent
topics: install-manifest-removal, trust-and-failure-boundaries, host-and-ci-coverage, user-global-writes, review-receipts
status: historical
summary: Archived August 2026 reasoning on D11 — why an editable journal is not ownership proof — plus the RIG-120 close-out handoffs — 8 traces compacted.
---

# Uninstall ownership and CI journal trust (D11), and the RIG-120 close-out handoffs

Compacted on 2026-10-17 from 8 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

`D11` was reached across four successive review-then-patch rounds, each closing
exactly the bypass the reviewer demonstrated, and the sequence itself was later
named as a pattern worth the owner's attention. The settled principle is that
**no editable journal field ever proves ownership of a path**, and that the
object of policy is the *real path being changed*, not the journal's claim
about it:

1. A forged repository-local install record could label an existing user CI
   pipeline as tool-owned and uninstall would delete it if the recorded digest
   matched — reproduced against a normal user Jenkins pipeline. (Owner,
   release-stopping.)
2. Requiring `append_managed` did not close the class, because that field is
   equally editable, as are `managed_block` and `managed_line`. The semantic
   boundary is unique attribution of the addition.
3. Classification used the journal's lexical path while I/O used the contained
   resolved path, so a forged `.rig/../Jenkinsfile` was admitted as an
   install-tree member and deleted the resolved user pipeline.
4. Even the lexical *contained* path was insufficient: an install-tree directory
   symlink plus a forged record could admit and delete the resolved user
   pipeline, and an extra hard link could strip user lines. Uninstall now
   classifies against `realpath` and refuses to mutate through a symlink or a
   file with `nlink > 1`.

The settled permissions: uninstall may delete only the dedicated Rig-named
GitHub workflow as a whole file, digest-checked; it may strip only the exact
pointer line the CI adapter writes, under the append-managed class that adapter
actually performs; and ambiguous CI content is retained as named best-effort.

An ordering rule was also settled: **containment runs before the namespace
check**. Whether Rig may own a path is a separate question from whether the path
is safe to resolve at all. And removal derives its exact CI-file set from the
provider registry rather than a hand-maintained list.

The two RIG-120 handoff briefs exist so a cold session can resume without
re-deriving settled ground, and both carry explicit do-not lists.

## Source traces

### 2026-08-28-editable-journal-is-not-ownership-proof.md
- **Summary:** Release-stopping owner finding — a forged repository-local install record can label a user CI pipeline as tool-owned and uninstall will delete it.
- **Decisions:** D11
- **Status:** historical
- **What it recorded:** The reproduction against a normal user Jenkins pipeline; a second finding that an unsafe journal path can still avoid symlink-containment rejection when a forged OpenClaw ledger marks its prefix as preserved; the owner's recommendation; and the validation state.
- **Verbatim rulings / rejections / traps:** Owner verbatim: "Release-stopping: a forged repository-local install record can label an existing user CI pipeline as tool-owned and uninstall will delete it if the recorded digest matches. I reproduced this with a normal user Jenkins pipeline. The cleanup must not treat an editable journal as proof of exclusive ownership.\nAlso fix: an unsafe journal path can still avoid symlink-containment rejection when a forged OpenClaw ledger marks its prefix as preserved. It is retained rather than rejected, weakening the intended fail-closed behaviour.\nRecommendation: preserve common root-level CI files until ownership can be independently proven; only remove uniquely attributable artifacts. Resolve containment before any preservation decision." Validation note: "the frozen acceptance suite passed (74 tests) with global Git configuration isolated. The literal full gate still stops at signature verification because the frozen-contract signature does not cover the latest checker bytes." Owner's one-word instruction at the end: "resolve"

### 2026-08-28-rig120-safety-followup.md
- **Summary:** The first safety patch put the namespace check before symlink-aware resolution; containment must run first, plus five missing CI-provider locations and an identity-allocation bug in OpenClaw removal.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Four corrections. (1) Ordering: a forged journal path through an escaping ancestor symlink was preserved as best-effort instead of refused. (2) The namespace list omitted five CI-provider locations, so CI files Rig created survived uninstall; removal now derives its exact set from the provider registry. (3) OpenClaw removal used the identity *allocator*, so when the identity was absent uninstall created a new random one; it now reads the persisted identity without allocation and refuses when absent. (4) A memory-watchdog process listing is usable only when the command succeeds, parses at least one process, and still contains the guarded root.
- **Verbatim rulings / rejections / traps:** The ordering rule: "Containment must run before the namespace check: whether Rig may own a path is a separate question from whether the path is safe to resolve at all." The CI removal rule: "A provider path is removable only when the journal says Rig created the whole file. A namespaced merge into an existing user CI file remains best-effort rather than risking deletion of the user's whole pipeline; exact managed-block reversal is separate work." The watchdog rule: "Missing or partial evidence is an explicit unavailable state, never zero memory usage." Scope: "No new product decision is introduced here. These changes enforce the existing containment, exact-ownership, attributed-global-write, truthful-failure, and generated-CI removal contracts."

### 2026-08-28-ci-managed-line-is-not-ownership-proof.md
- **Summary:** Requiring append_managed does not close the class — any journal metadata field is equally editable; the semantic boundary is unique attribution of the addition.
- **Decisions:** D11
- **Status:** historical
- **What it recorded:** `isManagedAddition()` treated any `managed_line`, `managed_block` or `append_managed` label as enough to mutate a CI file, so a forged `create_owned` record that also named a user line as `managed_line` could strip that line on uninstall. The settled boundary and the exact two permitted CI mutations.
- **Verbatim rulings / rejections / traps:** "The semantic boundary is unique attribution of the addition, not journal metadata. For CI, uninstall may delete only the dedicated Rig-named GitHub workflow as a whole file, and may strip only the exact pointer line the CI adapter writes onto an existing GitHub workflow, and only when the record's ownership class is the append-managed write that adapter actually performs. A forged `managed_line`, `managed_block`, `append_managed`, digest, provider path, or recognised filename cannot manufacture the right to mutate other CI bytes. Ambiguous CI content is retained as named best-effort."

### 2026-08-28-ci-path-identity-is-the-mutation-object.md
- **Summary:** Two remaining grants — unique-file admission let the journal pick the mutation operator, and classification used the lexical path while I/O used the resolved one.
- **Decisions:** D11
- **Status:** historical
- **What it recorded:** Grant 1: `create_owned` on the dedicated GitHub workflow still let the journal pick the mutation operator, so a forged `managed_line` on that path stripped user bytes without a digest check, including through an in-repo symlink whose lexical name was the unique workflow. Grant 2: a forged `.rig/../Jenkinsfile` was admitted as an install-tree member and deleted the resolved user pipeline. The four fixes.
- **Verbatim rulings / rejections / traps:** "Fixes: classify uninstall against the contained relative path; never write through a symlink; unique-file removal is digest-checked whole-file delete only; CI line-strip remains the exact GitHub adapter pointer under append-managed. Graft and hook journal trust remain separate from this CI boundary."

### 2026-08-28-ci-realpath-is-the-mutation-object.md
- **Summary:** Even the lexical contained path was insufficient — uninstall now classifies against realpath and refuses to mutate through a symlink or a file with nlink > 1.
- **Decisions:** D11
- **Status:** historical
- **What it recorded:** The remaining bypass: an install-tree directory symlink (`.pi` → `.`) plus a forged `.pi/Jenkinsfile` record could admit and delete the resolved user pipeline, and an extra hard link from `.rig/owned` onto a Jenkinsfile could strip user lines. The fix and the principle.
- **Verbatim rulings / rejections / traps:** "Uninstall now classifies against `realpath` of the mutation target and refuses to mutate through a symlink or a file with nlink greater than 1. Journal metadata still cannot manufacture CI ownership; the object of policy is the real path being changed."

### 2026-08-29-rig120-force-rereview-fail.md
- **Summary:** RIG-120 forced re-review FAILS — unsigned oracle bytes (a partial re-sign over a stale oracle-test pin) and an unguarded autofix seam.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** The run parameters and that the wrapper exited 1 with no binding receipt written. Blocker: `tests/advanced-oracle.test.js` hashes to `7efc231c…` while the manifest pins `6997a0be…`, and the worktree regenerated manifest lines for two other files and rewrote `gate1.sig` — a partial re-sign over a stale pin. Major: `runAutofix`'s fix and verify commands both go through bare `spawnTask` with only `cwd`, no isolation prefix, timeout or memory limit, while the other three runners wrap all of them. Three minors not re-verified as release-blocking. The path to a receipt.
- **Verbatim rulings / rejections / traps:** On the blocker's nature: "This is the owner re-sign already listed on [[tickets/RIG-120]], not a new code defect — but a release review cannot pass while the armed gate is red." On the promotion of the major: "The previous ceremony pass had flagged this as unverified/minor; this pass promoted it because the technical spec claims the shell-trust suite is closed and D28's network/resource guarantees are scoped to every repository-owned task Rig executes. Autofix is a mutating task." Path forward: "A binding receipt still requires a pass. Re-signing alone will not clear the major."

### 2026-08-29-rig120-close-out-handoff.md
- **Summary:** Handoff brief for the remaining RIG-120 code-level blocker — what is closed, the five remaining acceptance criteria, the vertical and horizontal rules, explicit non-goals, and a testable definition of done.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** Three items already closed and not to be redone. The only remaining code blocker, with AT-CAP-1 through AT-CAP-5 each specified against the owner-signed text rather than a fresh guess. A four-step vertical rule to apply per criterion. A three-step horizontal rule to run once before declaring done. Five explicit non-goals. A testable definition of done. A reporting-back instruction.
- **Verbatim rulings / rejections / traps:** Do-not: "**Do not** re-propose 'add a drift test between the two runners' — that was explicitly rejected by the owner and is recorded as a trap. If you find a *third* copy of this logic anywhere, the default move is to delete the duplication into the canonical module, not to test that it currently agrees." Resource invariant: "the invariant is `0 < t_command <= t_authorised` and `0 < M_command <= M_authorised`, not a fixed constant." On the undeclared state: "Write the state name and diagnostic text into the acceptance test itself; don't leave it to the implementation's discretion." On AT-CAP-4's design gap: "Run `rig-product-design` on this one question before writing code: new file vs. extending `.rig/service-bindings.json`… it is not a re-grill, don't reopen the acceptance criteria over it." Vertical rule's load-bearing step: "A criterion is not done until both 3 and 4 are green. Doing 1-3 and skipping 4 reproduces the exact defect class this ticket exists to close." And: "A test that only exercises `rig/lib/check-runner.js` from its source location proves nothing about what CI actually runs — that gap is exactly what caused this ticket in the first place." Implementation boundary: "Implement in `rig/lib/check-runner.js` only — never in `checks.js` or `catalog/baseline/check.js` directly. If either of those two needs to change… that's a sign the seam is in the wrong place." Non-goals: "Do not implement interactive one-use capability grants." / "Do not audit or touch the ~115 existing catalog service packs' network declarations." / "Do not touch the release ceremony… an agent doing them wouldn't make the release safe, it would defeat the reason the ceremony has a human signature in the first place." / "Do not promote `AT-CAP-1`..`6` into the frozen Gate 1 oracle without being asked." / "Do not push to the remote or open a PR without being asked." Honesty bar: "do not mark 'Done' if any of AT-CAP-1..5 is stubbed, partially wired, or untested against materialized bytes. A fake-green status here is the specific failure mode this whole project's `GA-33`/`GA-35` culture exists to prevent." And on the brief itself: "this brief is a compressed pointer into the wiki, not a substitute for reading [[tickets/RIG-144]] and the sign-off trace directly."

### 2026-08-29-rig120-fresh-review-v2-handoff.md
- **Summary:** Execution brief for the 8-finding fresh review — three binding owner decisions (no CI plan/approval seam; no on-branch re-sign; use --interim until converged) and each finding mapped to a fix.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** D1: the blocker about AT-LF-5/11/14/20 being unenforced on the CI runner is answered by a decision the owner already signed, so the fix is correcting the technical spec's overclaim rather than building new machinery. D2: revert the frozen oracle bytes and move the stronger assertion into non-frozen coverage. D3: the local iteration loop using `--interim` with a scratch `--out` under `.context/`, the exact commands, and the convergence bar. Then all eight findings mapped to fixes, a definition of done, housekeeping, and a guardrails list.
- **Verbatim rulings / rejections / traps:** D1, verbatim: "**Do not build a plan/approval/one-shot seam into `check-runner.js`.**… The fix is **not** new machinery, it's correcting `wiki/gate2/technical-spec.md` §9.4, which currently claims 'All five guarantees are now implemented; the shell-trust suite is closed' without qualification — that sentence overclaims relative to GA-38 and is what's generating the blocker… This is fixing a doc that never reflected an already-made decision, not lowering a bar to dodge a reviewer — don't reopen GA-38 to argue this further." D2: "If reverting turns out to be genuinely infeasible for some specific frozen assertion, stop and report why — do not fall back to a blind `approve-gate1.js` run as a substitute." D3's convergence bar: "**Only after two consecutive clean `--interim` passes** (verdict `pass`, 0 blockers, 0 majors — minors are fine to carry if you've made a deliberate call to accept them and said so in the wiki) move to the real ceremony." And: "do not reuse a prior failing author-context to dodge the cap." And: "If this comes back `fail`, that's real signal — go back to the interim loop with the new findings, do not just retry the same command. Stop and report to the owner after 3 real (non-interim) attempts total, per the cap's own intent, rather than spending `--force-rereview` silently." Finding 3's two real bugs: "`runArgv` spawns with no `env` option, so every check command inherits the full parent environment. Mirror `lint-format.js`'s `TASK_ENV_ALLOWLIST` isolation here." Finding 4: "Rewrite the test to drive `classifyEnding` through `runCommand`'s real callers (actual timeout, actual signal, actual missing binary) rather than calling `classifyEnding({kind})` directly with synthetic kind strings… or remove it from the enum if nothing can ever produce it — don't leave speculative dead states." Finding 6: "`linuxPdeathCommand` rewrites every guarded spawn to `python3 -c '...os.execvpe(...)'`, so a missing target binary surfaces as a nonzero python exit, not `ENOENT` on the spawn." Finding 8: "`runAutofix`'s approval check isn't bound to a digest of the fix argv, unlike plan/remediation approvals elsewhere in the same file." Guardrails: "Do not re-propose unifying `checks.js`/`check-runner.js` further or adding a drift test between runner copies — already done and explicitly rejected as insufficient by the owner." / "Do not run the real (non-`--interim`) ceremony more than once per genuine, distinct fix cycle — that's what burned 7 receipts flat in the earlier RIG-130 analysis." Done bar: "`npm test` (the full gate…) is green with **no on-branch re-sign**… If that turns out to be impossible, stop and report exactly which frozen file forced it and why, rather than running `approve-gate1.js` and moving on."
