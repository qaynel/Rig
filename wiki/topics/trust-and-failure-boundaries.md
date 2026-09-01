# Trust and failure boundaries

## What it is

Rig treats repository paths, config bytes, policy candidates, signatures, host
events, catalogue fragments, existing harness content, user files, commands,
bindings, CI config, reports, and concurrent writes as explicit boundaries with
defined validation and failure behavior. [Gate 2 §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)

## Why it is this way

The product operates inside repositories while agents may have full shell access.
Security therefore cannot rely on a second reachable file or on agent-authored
claims. Each boundary needs a property outside the untrusted input: exact bytes,
an external credential, a typed schema, an ownership receipt, or a verified
adapter contract. [Gate 1 §2](../gate1/business-spec.md)

## What binds it

The complete table in Gate 2 §10 is normative. Its mechanisms draw on `AD-7`–
`AD-10`, `AD-19`–`AD-30`, and lint-format's `GA-25` plan-bound execution
consent plus `GA-26` untrusted-task rule, while Gate 1's safety, install,
presence, global-write, and report cases make the failures observable.
[Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Path traversal, escaping symlinks, unknown keys, shell execution during scans,
stale/replayed approval, silent fallback, user-file replacement, artifact
uploads, and unowned global deletion are refusals, not degraded success.
[Gate 2 §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)

## Authorities and sources

- Product invariants: [Gate 1](../gate1/business-spec.md)
- Boundary table: [Gate 2 §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)
- Security sources: [`sources/reference/`](../sources/reference/)
- Lint-format execution-consent ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-plan-bound-execution.md)
- Untrusted repository-task ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-untrusted-task-execution.md)

## What is still open

The partial-failure, recovery, and secret-triage round-3 corrections are all
**resolved** in Gate 2 v0.6 (install-resume as apply's only failure model;
recovery declared-class per D19; the gated `secrets.model_assisted_triage`
channel). What remains before freeze is a fresh review at the new digest, not a
further boundary fix. [Status](../status.md)

For lint-format, a catalogue selection is not execution consent. Consent binds
to the exact planned command, working directory, component, and read-only
purpose. Mutating fixes sit outside that approval and require a separate user
decision.

Autofix is that mutating action (`GA-29`). It is never folded into or triggered
by a read-only check: the user must explicitly invoke a specific fix command,
approved on its own. Rig offers it for both formatting and safe lint fixes,
then re-verifies by re-running the read-only check instead of assuming the fix
held. The changes land as ordinary uncommitted working-tree edits the user owns
and reviews; Rig never commits them or claims ownership of the source.
[reasoning trace](../reasoning/2026-08-21-lint-format-autofix.md)

Because consent binds to exact commands, a task that drifts from what was
approved is out of authorization (`GA-31`). When the underlying repository task
no longer matches the approved binding — a different tool, a new target, an edit
after approval — Rig treats it as stale/tampered: it stops before running, does
not execute the changed command, discloses exactly what drifted, and requires a
freshly rediscovered plan the user reviews and approves before execution
resumes. Rig neither silently rediscovers and runs under the old approval nor
runs stale approved text against a repository that no longer defines it. A
changed command is a new command.
[reasoning trace](../reasoning/2026-08-21-lint-format-command-drift.md)

`shell: false` protects Rig's outer argument boundary; it says nothing about the
behavior of a package-manager task or tool that may invoke a shell internally.
Repository-owned tasks remain untrusted and execute under Rig's policy,
least-privilege, secret-isolation, network, and resource/time controls.

Those five words are now five concrete, testable guarantees (`GA-37`, `D28`):
a plan approval authorizes exactly one execution of its exact digest and does
not carry over to a later run; a task's working directory and every path it
touches must resolve inside the repository even through a symlink, and it
receives no ambient environment variable beyond an explicit allowlist; a task
has no outbound network reachability unless the plan explicitly grants it; a
task exceeding a configured memory ceiling or wall-clock timeout is killed
and reported as its own distinct non-passing state (`GA-33`); a
repository-supplied symlink resolving outside the repository is refused like
any other escape attempt. `AT-LF-20`–`AT-LF-24` are the deterministic cases,
and all five are implemented as of 2026-08-28: `AT-LF-20` in `executePlan`
(consumes the approval on a successful run and refuses replay), `AT-LF-21` at
task spawn (cwd/path containment plus an explicit env allowlist, both
`runGrade` and `runReadOnly`), `AT-LF-22` in `runGrade` and `runReadOnly`
(default-deny network with per-command grants), `AT-LF-23` (timeoutMs
kill-and-report plus memory ceiling), and
`AT-LF-24` in `planExecution` (refuses a read whose target escapes the
repository through a symlink). The five guarantees are complete on the
interactive lint-format plan/grade path. The installed CI floor intentionally
has no plan/approval seam under GA-38; its shared runner enforces containment,
resource ceilings, three-state network handling, and committed-policy
capability authority. Remaining shard gaps are closed in the same file — see
below.
[reasoning trace](../reasoning/2026-08-26-rig115-shell-trust-guarantees.md)

On Linux, the default-deny path uses `unshare --user --map-root-user --net`
and probes that exact prefix by launching Node before wrapping a task. This
avoids treating an installed-but-unusable sandbox tool as enforcement. If the
host refuses rootless namespaces, Rig returns
`network_isolation_unavailable`, which is a blocking non-pass rather than a
false clean result. GitHub Actions explicitly enables the runner setting that
Ubuntu 24.04 restricts and verifies the namespace before the test suite.
[reasoning trace](../reasoning/2026-08-28-linux-network-isolation-ci.md)

A check approved as read-only that changes the working tree is a failure, not a
tolerated side effect (`GA-27`). Rig detects the mutation, stops before any
further planned command runs, fails the check, and reports the exact changed
paths with before/after evidence. It does not auto-restore the pre-check state —
that would clobber concurrent user work and erase the forensic record of a
misbehaving or compromised tool — and it does not let the check continue. The
read-only guarantee is externally observable: mutation detected, execution
stopped, evidence preserved, repository state reported truthfully.
[reasoning trace](../reasoning/2026-08-21-lint-format-read-only-guarantee.md)

Not every check reaches a clean pass or fail, and each messy ending is its own
truthful, non-passing state (`GA-33`): timeout, cancellation, missing
dependency, signalled process, partial output, and command-not-found each
resolve to a distinct reported result rather than collapsing into "pass" or a
generic "failed" that loses the actionable cause. Treating an inconclusive end
as non-blocking is rejected as reintroducing false green.
[reasoning trace](../reasoning/2026-08-21-lint-format-failure-semantics.md)

The network guarantee has the same shape at both approved-command call sites.
`runGrade` now uses the shared isolation prefix and per-command grant gate:
ungranted commands are refused when the host cannot provide isolation, while
explicitly granted commands still run. AT-PROC-1d proves the grade path's
network conjunct without changing the signed oracle.
[reasoning trace](../reasoning/2026-08-28-runGrade-network-isolation-grilling.md)

The CI/git-floor runner now has a matching capability boundary design: all
commands receive timeout and memory ceilings; explicit network denial is
isolated, explicit network access and raised ceilings need a committed
per-service grant, and an undeclared network state remains visibly diagnostic
during the compatibility rollout. A host that cannot enforce a promised
control, malformed policy bytes, or policy that is not committed is a named
refusal rather than a downgrade. [Execution-policy design](../reasoning/2026-08-29-rig144-execution-policy-design.md)

RIG-115's per-AT-LF-case branches sharded this section's guarantees rather
than proving them whole: the symlink-containment check (AT-LF-21/24) was
wired into `runReadOnly` only, leaving `runGrade` — the path that actually
executes lint/format commands — reading `cmd.cwd` unguarded
([RIG-139 / #94](https://github.com/qaynel/Rig/issues/94)); AT-LF-23's
"memory ceiling or wall-clock timeout" had only the timeout half implemented
anywhere ([RIG-140 / #95](https://github.com/qaynel/Rig/issues/95)). Each
branch's own test passed; neither proved the boundary this page states. See
[guarantee sharding](../mistakes/guarantee-sharding.md) and
[reasoning trace](../reasoning/2026-08-27-guarantee-sharding-mistake.md).

Both are now fixed directly in `rig/lib/lint-format.js`
([reasoning trace](../reasoning/2026-08-27-rig138-139-140-shell-trust-fix.md)):
a shared `taskCwd()` (wrapping `containedPath`) is called from both
`runGrade` and `runReadOnly`, and a configured `memory_limit_mb` is enforced
by a separate watcher process (`rig/lib/memory-guarded-exec.js`) polling RSS,
alongside the existing wall-clock timeout — both report their own distinct
non-passing state (`boundary_violation`, `memory_exceeded`) per `GA-33`. The
memory cap is a polling watchdog, not a kernel guarantee: see the enforcement
design note in [guarantee sharding](../mistakes/guarantee-sharding.md) for
why (a hard `RLIMIT_AS` cap is not reliably enforced cross-platform) and its
known race window (a single allocation fast enough to complete inside one
poll interval can still land before the kill signal does).

A secondary defect was found and fixed during the rig-120 code review: when
`ps` itself is absent, `memory-guarded-exec.js` correctly kills the command
and reports `memory_ceiling_unavailable` — but `runReadOnly` was not checking
for that status, so the killed command fell through to the snapshot-diff check
and returned `clean`. Fixed by adding `memory_ceiling_unavailable` to
`runReadOnly`'s early-return condition alongside `timeout` and `memory_exceeded`.
AT-PROC-1i proves the full path end-to-end (strips `ps` from PATH, calls
`runReadOnly` with `memory_limit_mb`, asserts the result is
`memory_ceiling_unavailable`). `runGrade` was unaffected: its `anyFail`
check propagates the non-zero exit code and `'fail'` verdict correctly.
[reasoning trace](../reasoning/2026-08-28-runReadOnly-memory-ceiling-unavailable-clean.md)

The watchdog now also rejects incomplete process evidence: a non-zero `ps`
exit, an empty parsed listing, or a listing that no longer contains the guarded
root process is `memory_ceiling_unavailable`, not a zero-byte reading. A poll
that lands after the guarded child has already exited but before its `close`
handler clears the timer skips itself instead of reading that same absence as
unavailable evidence, so a command that finished cleanly is never
misreported as killed for a ceiling it never approached. The
uninstall boundary follows the same fail-closed ordering: symlink-aware
containment runs before an untrusted journal record is classified as inside or
outside Rig's removable namespace or retained for a failed OpenClaw removal.
The repository-local journal is also never sufficient proof of exclusive
ownership for a common CI pipeline, even when its declared digest matches, nor
of the right to strip an arbitrary line merely because a record names
`managed_line`, `managed_block`, or `append_managed`. CI line-strip is limited
to the exact GitHub workflow pointer Rig wrote. Classification uses the
contained, realpathed relative path, not a lexical alias or directory-symlink
trampoline, and unique-file removal is digest-checked whole-file delete that
does not follow a symlink or extra hard link.
[safety follow-up](../reasoning/2026-08-28-rig120-safety-followup.md)
[intent-owner safety ruling](../reasoning/2026-08-28-editable-journal-is-not-ownership-proof.md)
[CI managed-line ruling](../reasoning/2026-08-28-ci-managed-line-is-not-ownership-proof.md)
[CI path-identity ruling](../reasoning/2026-08-28-ci-path-identity-is-the-mutation-object.md)
[CI realpath ruling](../reasoning/2026-08-28-ci-realpath-is-the-mutation-object.md)

`AT-LF-22`'s guarantee **used to** ship alongside a production defect
([[RIG-137]] / #91, now closed): `rig/lib/lint-format.js` globally
monkey-patched `net.Server.prototype.listen` to make the frozen test's
`listen()` → `address()` sequence synchronous again on Node 24, where
host-lookup/bind completes on an event-loop tick even for a literal IP. The
patch was global — any real caller asking for loopback-only
`listen(0, '127.0.0.1')` silently got wildcard binding instead. The
owner-approved fix deleted the patch and made `AT-LF-22` itself `async`,
awaiting the `'listening'` callback rather than reading `server.address()`
synchronously; a fixed-port workaround was considered and rejected because it
removes the synchronization guarantee `address()` provides, not just the
async requirement. Scoped deliberately to that one test —
`tests/helpers/advanced.js`'s `withTempDir`/`withRepo` stays synchronous and
unmodified even though it can't safely wrap an async callback (its `finally`
deletes the temp dir when the promise is *returned*, not when it *settles*);
generalizing it is deferred to whenever a second test actually needs an async
fixture lifetime. The key-holder re-sign this required, since both plausible
homes for any patch relocation sit inside the byte-pinned oracle manifest,
has landed — the oracle verifies clean on current HEAD.
[reasoning trace](../reasoning/2026-08-28-rig137-option-a-scope.md)

`AT-LF-24`'s symlink-escape refusal **used to** degrade to a recoverable
state instead of a hard refusal: `lint-format.js`'s `planExecution` silently
left `source_snapshot: null` on an escape instead of marking it, and
`executePlan` re-read the same `cmd.source` file a second time with no
containment check at all — reading the outside file's real bytes through the
symlink and surfacing the mismatch as `command_drift`, not a refusal. Fixed:
both call sites now share one `readSource()` helper built on `containedPath()`;
execute time independently re-derives from disk rather than trusting the
plan-time flag (the symlink can appear only after planning), and returns
`boundary_violation`. The frozen `AT-LF-24` test previously only asserted the
snapshot was empty — equally true for a missing file — and never exercised
`executePlan` at all; rewritten to assert the actual refusal and that the
outside command's side effect never ran. `wiki/gate1/gate1.sig` is stale
pending owner re-sign, same as every oracle-test edit in this project.
[reasoning trace](../reasoning/2026-08-29-rig120-symlink-escape-and-checks-realpath-containment.md)

A 2026-08-29 fresh independent review found a structurally different problem
from every prior round on this boundary: the five shell-trust guarantees
above are real and well-tested, but implemented only inside
`lint-format.js`'s `runReadOnly`/`runGrade`/`executePlan`/`runAutofix` — the
installed product's actual command runner (`rig/lib/checks.js`, materialized
as `.rig/bin/check.js`) never calls any of those four functions, and had none
of the guarantees itself. The file-granularity "does a production file
require() this module" guard
([[index/traps|"The oracle is green at a seam the product does not use"]])
could not see this, because `lint-format.js` genuinely is required by
`plan.js`/`apply.js` — just for two unrelated exports. `checks.js`'s cwd and
required-path containment (the one sub-gap [[RIG-144]] already scoped as
unambiguous, independent of the network/memory policy questions) is now
realpath-based via the same `containedPath()` helper — closing that one axis
for the path the shipping product actually runs. The other three axes
(plan/approval, network isolation, memory ceiling) remain open, deliberately
not implemented against a guess: [[RIG-144]] already recorded why blindly
porting `lint-format.js`'s defaults could break legitimate CI (network
installs, long/heavy real test suites) rather than protect anything.
[fresh-review reasoning trace](../reasoning/2026-08-29-rig120-fresh-review-fails-shipping-path-bypass.md)

The containment fix above initially covered only `rig/lib/checks.js`, missing
that `rig/catalog/baseline/check.js` — a second, hand-maintained, not
sync-mapped duplicate materialized to `.rig/bin/check.js`, which every
generated CI workflow actually invokes — had the identical lexical-containment
bug, plus a leaf-only (not path-walking) symlink check in its `check-copies.js`
companion. Both fixed; `apply.js` now also materializes `path-safety.js` so
`containedPath()` exists at the installed layout. Whether the two runner
copies should be unified rather than kept in independent hand-sync is an open
question feeding the [[RIG-144]] capability-policy scoping, not decided yet.
[reasoning trace](../reasoning/2026-08-29-rig120-symlink-escape-and-checks-realpath-containment.md)

That question is now decided (`GA-38`): unify, don't just drift-test. The
owner rejected a parity-test-between-two-copies fix as accepting the defect
class rather than removing it. `rig/lib/check-runner.js` is now the single
`runArgv`/`runBinding` implementation; `rig/lib/checks.js` and
`rig/catalog/baseline/check.js` (materialized to `.rig/bin/check.js`) both
`require()` it rather than each carrying a copy, and `apply.js` materializes
it into `.rig/lib/` the same way it already does `path-safety.js`. `AT-CAP-6`
proves this the strong way — object identity for the two in-repo callers,
source-text equality for the materialized copy — rather than proving the two
implementations currently happen to behave alike. The remaining capability
axes (three-state network declaration with a visible diagnostic for the
undeclared/legacy state, configurable-not-fixed resource ceilings, and
committed-policy-only capability authority for the non-interactive CI path)
are scoped and owner-signed-off but not yet implemented.
[sign-off reasoning trace](../reasoning/2026-08-29-rig144-capability-policy-sign-off.md)

Those scoped capability controls are now implemented in the one canonical
runner, with direct and installed-byte evidence for resource ceilings,
three-state network handling, committed authority, and fail-closed outcomes.
[Close-out trace](../reasoning/2026-08-29-rig120-capability-policy-close-out.md)

An interrupted journalled delete is now recovered rather than left as a wedge.
The pending `delete_owned` record states both ends of the operation, so a later
`write()` or `remove()` can prove which half landed — an absent file means the
unlink ran and only the applied record was lost; a file holding exactly the
recorded preimage means the unlink never ran. Any other bytes are a genuine
conflict and refuse. Before this, a crash between the two halves left the path
neither writable (the pending delete's `desired_digest: null` matched no
intended write) nor deletable (its non-null preimage read as pre-existing).
[Ownership fix trace](../reasoning/2026-09-01-path-b-hardening-issue6-delete-ownership.md)
