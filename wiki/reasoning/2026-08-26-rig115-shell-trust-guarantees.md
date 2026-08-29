---
date: 2026-08-26
source: intent owner
topics: trust-and-failure-boundaries, gate1-signing
decisions: GA-37, D28
---

RIG-120's release ceremony is being planned as one bundled signing round
covering RIG-120's own naming/ceremony items, the catalogue-contract freeze
(RIG-112), and RIG-115's shell-trust suite. RIG-115's reconciliation
(2026-08-24) had already found that the existing signed oracle discloses the
untrusted-task boundary (`AT-LF-5`, carrying `GA-26`'s "Rig policy, least
privilege, secret isolation, network restrictions, and resource/time limits")
but never pins down what any of those five words concretely guarantee. Session
lifetime, filesystem/environment isolation, memory limits, and symlink
handling were labeled assumptions; network denial was requested but the
process runner does not enforce it. None of that is an implementing agent's
call to make — it is a product-safety promise, not a mechanism detail.

The agent proposed five concrete defaults, framed as the smallest reasonable
reading of `GA-26` that is also deterministically testable, and the intent
owner approved all five as stated:

1. **Approval lifetime.** A plan approval authorizes exactly one execution of
   that exact plan digest. It does not carry over to a later run — re-using a
   consumed approval is not authorization.
2. **Filesystem/environment isolation.** A task's working directory, and every
   path it touches, must resolve inside the repository even through a
   symlink. It receives no ambient environment variables beyond an explicit
   allowlist — no blanket inheritance of the parent process's environment.
3. **Network denial.** A task has no outbound network reachability by
   default. Nothing is reachable unless the plan explicitly allows it.
4. **Resource/time caps.** A task that exceeds a configured memory ceiling or
   wall-clock timeout is killed and reported as its own distinct
   non-passing state, per the abnormal-ending taxonomy already frozen
   (`GA-33`) rather than hanging or being silently truncated.
5. **Symlink handling.** A repository-supplied symlink whose real target
   resolves outside the repository is refused the same as any other escape
   attempt — Rig never follows it to read, write, or set a working directory.

These five became `AT-LF-20` through `AT-LF-24`, added to
[`../gate1/acceptance.md`](../gate1/acceptance.md) under `D28`/`GA-37`, closing
[[RIG-115]]'s shell-trust suite. None of the five is implemented yet — the new
acceptance cases and their tests in `tests/advanced-oracle.test.js` are
expected to fail (red) until the runtime in `rig/lib/lint-format.js` actually
enforces them. That is the intended order the owner chose for this release
round: freeze the oracle first with the target behavior pinned down, sign it,
then implement against the frozen shell. A red gate on these five cases
between drafting and implementation is not a regression; it is the tests doing
their job.
