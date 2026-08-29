---
date: 2026-08-29
source: agent
topics: policy-model, trust-and-failure-boundaries, host-and-ci-coverage
decisions: AD-39, GA-38
---

# RIG-120 capability-policy close-out

Implemented the remaining shipping-runner capability controls in the single
canonical `rig/lib/check-runner.js` implementation used by both `rig check`
and the installed `.rig/bin/check.js` path.

`AT-CAP-1` adds mandatory wall-clock ceilings with 10 minutes as the default
and per-binding positive timeout configuration. It uses the existing guarded
process-tree machinery and the test proves a timed-out parent cannot leave a
child that writes after the deadline. `AT-CAP-2` applies the existing
`memory-guarded-exec.js` RSS watchdog to every command with a 2 GiB default
and per-binding positive memory configuration; an over-limit command is
reported as `memory_exceeded`.

`AT-CAP-3` uses the existing platform isolation probe and wrapper for explicit
`network: "none"`. Explicit `network: "required"` runs without that wrapper;
omitted network runs only under the temporary `undeclared` compatibility state
and emits `network capability undeclared; running under temporary compatibility
mode`. When the host cannot establish the isolation wrapper, the result is the
non-passing `network_isolation_unavailable` state.

AD-39 selected a separate, target-owned `.rig/execution-policy.json` over an
extension of generated service bindings. `AT-CAP-4` implements that exact
v1 policy: the policy must be tracked and clean in Git, and the matching
service ID grant must authorize required network and every requested raised
timeout or memory ceiling. The exported evaluator is shared rather than
CI-specific so a later interactive one-use grant can use the same rule.
`AT-CAP-5` makes invalid JSON/schema/grants, missing or dirty authority, an
insufficient grant, invalid capability values, unavailable isolation, and
unavailable memory measurement named refusals. No path falls back to running
unprotected.

Vertical evidence was completed for each acceptance case: tests were written
first and showed red against the pre-control behavior, then green after the
canonical-runner change. Each test executes both the source module and a
temporary materialization of the real installed `.rig/bin/check.js` plus its
`.rig/lib` dependencies. Because the pre-existing canonical file was itself
untracked during this continuation, the requested `git stash` red proof also
removed that module and produced the expected failing test load; the
behavioral red proof was captured immediately before each implementation
slice, before that stash check.

Horizontal evidence was also completed. `apply.js` unconditionally copies
the memory watchdog and canonical runner, and seeds the user-owned empty
execution policy on every install profile. The subprocess-call scan found no
additional copy of the selected service command runner: the unrelated
catalogue plumbing tools and specialised library commands are separate
products, while the only service-binding execution implementations remain
the canonical runner, lint-format's distinct plan-bound runner, and the
process helper. Both callers surface non-passing states through their existing
failure paths (interactive reports include the named reason; installed CI
writes it to stderr and exits nonzero); the passing undeclared compatibility
state emits its visible diagnostic directly.

Verification completed: `node --test tests/guarantee-coverage.test.js` passed
23/23 including `AT-CAP-1` through `AT-CAP-6`, and `npm run test:code` passed
with no failures. No release review, signature re-sign, tag, publish, or
catalogue-wide network declaration audit was performed.
