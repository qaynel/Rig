# Trust-root binding review — findings and acceptance criteria

The owner authorized **one** `--force-rereview` after the provider-limit
failure. The designated `claude-opus-5` reviewer returned **fail**: three
major and six minor findings, no blockers, and no unresolved cases. The
wrapper exited 1 and wrote **no passing receipt**. The same author context
now has six recorded failures. Do not reset it or retry without further
owner authorization.

The candidate stayed unchanged throughout the attempt: HEAD
`f02fb8490ba9d0a67e9960c289ede7f5ad3c216f`, worktree digest
`7a2f24a6cde37075135a825d3a447b8e2fa12c5bb358b19f08e60fac9fd8d235`,
2,672 publishable files. The signed oracle still verifies as 16 files and
95 acceptance cases. This handoff was added after the failed review.

The [raw reviewer findings](../../sources/reviews/2026-10-20-trust-root-rereview.failed.review.json)
are preserved unchanged. They are reviewer claims, not a wrapper receipt and
not independently reproduced findings. The wrapper did not retain per-case
verdicts. The reviewer also reported that Bash was unavailable, so it did
not diff the candidate or verify `wiki/gate1/gate1.sig` itself.

## 1. Major — generic-success bindings are not rejected

**Reviewer anchor:** `rig/lib/checks.js` `validateDisposition`, AD-15, AT-SHAPE-5.
The reviewer reports that a nonempty `argv` is accepted, including
`true`, and that a convention reason matching a generic phrase is enough.

Acceptance criteria:

- Enforce the rejection the frozen case and AD-15 already name: missing,
  empty, silent, and generic-success bindings (`true`, `echo`,
  `process.exit(0)`, and an equivalent stub) are nonzero coverage gaps.
- A convention fallback still needs a service-specific reason. A repeated or
  generic phrase, including the word "service-specific" by itself, does not
  satisfy AT-SHAPE-5.
- Keep a real repo-adapted command acceptable. Show the new rejection fails
  when the guard is removed.
- If the signed oracle must grow to name those inputs, put that change in one
  owner amendment. Do not edit frozen Gate 1 files as an agent.

## 2. Major — install interruption is a shipped test lever

**Reviewer anchor:** `rig/lib/lifecycle.js` and `rig/lib/lint-format.js`
`interrupt_after`, AT-INSTALL-1, AT-LF-17.
The reviewer reports that the suite interrupts an install only through a
production parameter, and that AT-INSTALL-1 does not assert withheld
protection claims while the install is incomplete.

Acceptance criteria:

- Prove interruption through a real failure the case already names: crash,
  interrupt, permission denial, or full disk. A caller-supplied truncation
  flag is not that proof, and it must not remain a production control.
- While the install is incomplete, policy status, the install line, and a
  run report must withhold protection claims. Successful resume must finish
  without clobbering unrelated data.
- Maintain that regression on the public path. Frozen oracle edits join the
  same owner amendment as item 1.

## 3. Major — CI and uninstall cases are narrower than their trace rows

**Reviewer anchor:** `tests/advanced-oracle.test.js` AT-CI-1 and
AT-UNINSTALL-1, against their technical-design trace rows.
The reviewer reports one seeded provider and substring checks instead of a
six-provider deep compare plus uninstall, and a hand-written one-record
manifest instead of install-and-remove across every surface.

Acceptance criteria:

- Cover the behavior those trace rows already require: all six provider
  configs, byte-for-byte survival of unrelated user values, removal of the
  inserted job, and uninstall across the surfaces the case names, including
  the failure when `.rig/` is deleted and the repository is declared clean.
- Do not weaken the signed cases. Extend them only through one owner
  amendment. Editable regressions may land first where they do not change
  frozen bytes.

## 4. Minor — design names a trust-root drift detector that is not shipped

**Reviewer anchor:** technical-design claim that editing the installed trust
root is drift, versus `rig/lib/apply.js` and `rig/lib/onboarding-check.js`.
The reviewer reports that Gate 1's substituted-signer case is met and that
no shipped check compares the installed root to its journaled bytes.

Acceptance criteria / written response:

- Keep one trust root: the Gate 1 key. Do not add another signer, recovery
  path, or trust list.
- Either wire the detector the design already claims, or change the design
  to the honest ceiling the reviewer describes. A written correction of the
  design is sufficient if no frozen case requires the missing detector.

## 5. Minor — design requires a sentence the catalogue gate rejects

**Reviewer anchor:** technical-design §5.6 / AD-31 versus
`rig/lib/catalog.js` known-boilerplate matches and AT-SHAPE-6.
The reviewer reports that the design tells every fragment to say it is
generic baseline practice and not repository-tailored, while the authorship
gate fails that wording.

Acceptance criteria / written response:

- Reconcile the design with AT-SHAPE-6 and the shipped boilerplate rejection.
  Do not insert that repeated sentence into the 115 services.
- Preserve honest Policy-only evidence limits in service-specific language.

## 6. Minor — design names test files that do not exist

**Reviewer anchor:** AT-LF-6 trace row and §14 slice verification commands.
The reviewer reports missing test paths whose `node --test` invocation would
exit 0.

Acceptance criteria / written response:

- Point every documented verification command at a test file that exists, or
  remove the command. Do not add empty files so the old names resolve.
- The signed manifest's primary targets are a separate check. This item does
  not by itself authorize a new binding review.

## 7. Minor — host-native activation receipt cannot be loaded

**Reviewer anchor:** `rig/lib/policy.js` `loadActivePolicy` versus
`validatePolicyApproval`, AD-20, AT-PRESENCE-1.
The reviewer reports that a host-native receipt can be minted and is then
refused as unverifiable, and that the only exercise supplies a test double
that returns true. No shipping entry point reaches that branch.

Acceptance criteria / written response:

- A receipt the active-policy loader cannot verify is not an activation
  success. The shipped external Gate 1 signature path remains the authority
  under the one-trust-root decision.
- Do not prove AT-PRESENCE-1 with a caller-supplied verifier that always
  succeeds, and do not add a second trust root or a new signing binary.

## 8. Minor — network isolation is accepted without a denied connection

**Reviewer anchor:** `rig/lib/spawn-guarded.js` `networkIsolationPrefix`,
AT-LF-22.
The reviewer reports that an empty child exiting 0 is treated as isolation,
and that the case checks only that a probe file is absent.

Acceptance criteria / written response:

- The lint-format network boundary must show a connection denied, or report
  the sandbox unavailable with a named reason. Absence of an output file is
  not that proof.
- The regression must fail when the wrapper does not deny the connection.
  Frozen case edits join the same owner amendment.

## 9. Minor — this review could not execute its own byte checks

**Reviewer anchor:** review-evidence limitation, not an implementation defect.
The reviewer reported Bash unavailable, so it did not run `git diff`, recompute
the implementation digest, or verify the Gate 1 signature.

Written response:

- This does not add a product change. The three major findings are why the
  receipt was refused.
- This session's `check-advanced-spec.js` result is separate operator
  evidence. A later binding review still has to inspect the candidate with
  its own tools. No retry is authorized now.

## Finite closeout sequence

Fix or answer these findings against the existing frozen cases and the
one-trust-root decision. Batch every necessary frozen change into one owner
amendment. Preserve the six recorded failures. Do not edit or sign frozen
Gate 1 files as an agent. After the candidate is frozen, verify the signed
oracle, run the exact-byte full gate, and obtain a new explicit authorization
before another binding attempt.

This review performed no implementation fixes, signing, commit, push, GitHub
review, approval, or merge.

## Resolution (added after the fixes)

All nine items are resolved in shipped code or the design, and the seven signed
case bodies they touch are prepared as one owner amendment, not applied. The
per-finding table, the amendment table, the mutation checks and the honest
limits are in the [evidence index](qa-closeout-evidence.md#trust-root-review-findings-october-20-re-review-nine-items).
The failed-attempt counter stays at 6; another binding attempt still needs the
owner's explicit authorization after the amendment is applied and signed.
