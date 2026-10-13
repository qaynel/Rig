---
date: 2026-10-13
source: agent
topics: onboarding-flow, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: corpus, sandbox, trap
summary: Subplan 03 slice 3 — agent onboarding instructions (README + unpack.md) ship in the corpus; unknown hosts get an agent-script proposal slot whose script digest is signed, which runs only under a probe-verified filesystem+network sandbox and whose artifacts are validated before journaled writes; adversarial tests prove it on macOS sandbox-exec.
---

# 03 central corpus — slice 3: onboarding instructions and the script slot

## Done

- `rig/corpus/onboarding/README.md` is the agent's step-by-step (inspect,
  select, project, graft, propose/approve/apply/check). `unpack.md` covers a host
  Rig has no projector for: how to learn the host, the script contract, the
  proposal slot, what apply does, and a table of named refusals. Both install
  to `.rig/onboarding/` (listed as intended differences against the v5 golden).
  A test requires `unpack.md` to name every refusal code the code can raise.
- `projection_script` is an optional proposal key (`rig/lib/projection-script.js`):
  host, source, approved outputs (path, max bytes, preimage digest, optional
  content digest), timeout. The engine computes the script digest; the signed
  proposal digest therefore binds the script bytes, outputs and limits.
  Proposals without a script keep their exact v5 body and digest (tested).
- `rig/lib/sandbox.js` decides availability by *proof*: a probe script run inside
  the sandbox must fail to write outside its output directory and fail to
  connect to a loopback listener it could reach unsandboxed. macOS uses
  `sandbox-exec` (writes denied except the output directory, network denied,
  DNS mach services denied, reads under the home directory denied except the
  repository, corpus, script and Node install); Linux uses `bwrap` behind the
  same probe; any other platform, a missing tool, a failed probe, or
  `RIG_SANDBOX_DISABLE=1` is a named `sandbox-unavailable` refusal that happens
  before anything executes.
- `apply` order: verify approval, bindings and preflights, then run the script,
  then validate artifacts (regular files only; no symlinks or hard links;
  approved path set exactly; size; realpath containment; content digest), then
  write the script to `.rig/projections/<host>.js` and the artifacts through the
  existing journal writer. `check` fails if a kept script or output changes.
- Adversarial tests (`tests/projection-script.test.js`, 22 cases) run real
  scripts under the real sandbox: writes to the repo, `.rig/state.json`, tmp;
  a home-directory secret; a child process; a loopback connection that the
  test listener must never see; unapproved/extra/oversize/missing/symlinked
  artifacts; a failing and a never-ending script; substituted script bytes
  (even with a recomputed stored digest); stale preimage; interruption + retry.
  Mutation check: running the script unsandboxed turns the adversarial test red.

## Rulings

1. Scripts are Node.js (Rig already requires Node; the feasibility test's Python
   is not portable). One language keeps the sandbox probe and the docs honest.
2. Reserved output paths regardless of approval: `.rig/`, `.git/`, `.env*`,
   `node_modules`. The signed approval cannot widen them.
3. Node's `--permission` flag was tried and dropped: it needs read access to
   every parent directory of the entry file and adds nothing the OS sandbox
   does not already enforce, including for children.
4. Linux is gated by the same probe but could not be exercised on this machine
   (no `bwrap`); tests that need a real sandbox skip visibly where none exists
   and the refusal tests still run. Windows refuses.

## Gaps recorded

- DNS-name exfiltration is blocked on macOS by denying the resolver mach
  services; this is best effort, and the probe checks TCP only.
- The repository README still carries per-host install prose; replacing it is
  subplan 09's documentation work.

## Next

Slice 4: pinned third-party fetch during onboarding (staging, digest verify,
named gaps, RIG-135 patches applied to fetched bytes, offline fixtures).
