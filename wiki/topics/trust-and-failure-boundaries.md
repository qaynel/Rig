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
any other escape attempt. `AT-LF-20`–`AT-LF-24` are the deterministic cases.
`AT-LF-21` is now enforced at task spawn; `AT-LF-20`, `AT-LF-22`,
`AT-LF-23`, and `AT-LF-24` still wait on their own runtime changes.
[reasoning trace](../reasoning/2026-08-26-rig115-shell-trust-guarantees.md)

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
