# RIG-144 capability-policy layer: grilling draft (derived from the owner's pasted architecture decision)

2026-08-29

## Existing record checked first

Read before drafting anything, per the grilling process: `wiki/tickets/RIG-144.md`
(the three open owner-scoping questions it already named), `GA-37`/`AT-LF-20`-
`24` (the analogous guarantee set already implemented and signed for
`lint-format.js`'s runner — `wiki/index/decisions.md`), `wiki/gate2/
technical-spec.md` §9.4/§10, and the two runner implementations themselves
(`rig/lib/checks.js`, `rig/catalog/baseline/check.js`/`check-copies.js`,
just discovered today to be a second live copy — see
[[reasoning/2026-08-29-rig120-symlink-escape-and-checks-realpath-containment]]).
This derives the problem and most of the acceptance shape from that record
plus the owner's pasted document rather than re-interviewing from zero.

## Problem and outcome

**User:** anyone who installs Rig and either runs `rig check` interactively
(`--with-runtime`) or lets their CI run the generated `.rig/bin/check.js`.
**Problem:** both runners execute repo-declared and catalog-declared commands
with no resource ceiling, no network capability model, and no distinction
between "read a file and report" and "do anything a shell can do" — this is
what the 2026-08-29 fresh review named release-blocking. **Desired outcome:**
every command gets a bounded-by-default execution envelope; anything beyond
that envelope requires an explicit, checked grant rather than being silently
available; a control Rig cannot enforce on the current host is a refusal, not
a silent gap. **Non-goals**, explicit in the owner's document: endpoint-scoped
network allowlists, container/VM isolation, richer resource profiles, finer
network granularity than a boolean-or-class default — all explicitly deferred
to 5.x, not this pass.

## In scope for the v5.0.0 blocker (owner's five items, mapped onto this codebase)

1. **Filesystem containment — done.** Today's earlier fix (`containedPath()`
   in both runners) already closes this for both `rig/lib/checks.js` and
   `rig/catalog/baseline/check.js`.
2. **Execution resource limits — mandatory, no rollout risk.** Every
   subprocess either runner spawns gets a wall-clock timeout (already via
   `spawnGuardedSync`'s whole-tree kill) and a memory ceiling, using the
   exact mechanism `lint-format.js`/`memory-guarded-exec.js` already built
   and proved (`AT-LF-23`, `AT-PROC-1c/f/g/i/j/k`) — not a second
   implementation. Default 10 minutes / 2 GiB (the owner's own example),
   repo-configurable per binding. Generous defaults essentially never fire
   on legitimate CI, so this is safe to make unconditional immediately,
   unlike item 3.
3. **Network as a declared capability, not a blanket switch.** Reuses
   `lint-format.js`'s existing per-command shape (`cmd.network === true`,
   already implemented and tested as `AT-LF-22`/`AT-PROC-1d`) rather than
   inventing a new three-class taxonomy — the owner's Class A/B/C framing is
   useful for picking *defaults*, not a new mechanism; the mechanism already
   exists and is proven. **Real rollout question, not inferred — see
   "Decision needed" below.**
4. **Elevated capability requires explicit authority.** Scoped down for v5:
   `checks.js`/`check.js` have no interactive plan/execute split today
   (RIG-144 already noted this) — building one is real new UX surface, not
   a capability-boundary fix. v5 scope is the noninteractive half only: a
   committed `.rig/execution-policy.json` (CI-side, predeclared, no popup)
   that grants a named binding a capability beyond its default. Interactive
   one-use approval (mirroring `consumePlanApproval`) is deferred to 5.x —
   **declared inference**, reversible and low-risk (adding an interactive
   grant path later doesn't invalidate anything built now).
5. **Fail closed.** Same pattern already proven three times over
   (`network_isolation_unavailable`, `memory_ceiling_unavailable`,
   `boundary_violation`) — a control that can't be verified on the host is a
   distinct refusal status, never silent pass-through. No new mechanism
   needed, only new call sites.

**Cross-cutting, from today's discovery:** every one of 2-5 must hold for
*both* runner copies, or the two must be unified first. **Declared
inference:** keep both runners independently fixed for this pass rather than
taking on a unification refactor mid-security-fix (RIG-144 already warned
"not a drop-in port" against exactly this kind of scope creep) — instead add
an explicit parity/drift test between the two (same pattern
`check-rule-copies.js` already uses for other file pairs in this repo), so a
future fix to one that misses the other fails CI immediately instead of
shipping silently. Reversible: nothing about this blocks unifying them later.

## Decision needed (the one real fork, not inferred)

Item 3's mechanism is settled (reuse `cmd.network`), but its **default**
is a genuine choice with real cost either way:

- **A — default-deny immediately.** Any binding without an explicit
  `network: true` gets no network reachability, starting now. Matches
  `AT-LF-22`'s existing stance exactly, uniform across the codebase. Cost:
  Rig's own catalog ships ~115 service packs; whichever of those need
  network (package installs, registry checks) and don't yet declare
  `network: true` **break silently on the next `rig check` run** the moment
  this ships, until each is individually audited and updated. Real risk of
  breaking real CI is the risk RIG-144 was scoped around avoiding.
- **B — additive: opt-in restrictive.** Ship the mechanism and enforcement
  now; existing/undeclared bindings keep today's behavior (network
  reachable) until explicitly tightened. A repo can opt into `A`'s stricter
  default itself via `.rig/execution-policy.json`. New or catalog-owned
  bindings get audited and switched to explicit declarations over time, not
  in one blocking pass.

**Recommendation: B.** It ships the actual v5 blocker (capability is
declared and enforceable, not silently unlimited) without a second
uncoordinated risk (breaking installed repos' CI on upgrade) that RIG-144
was explicitly trying to avoid by not blind-porting `lint-format.js`'s
defaults. A can still happen — per-binding, as each of the 115 catalog
packs gets audited — it's just not a single flag-flip gate on this release.

## Acceptance criteria (draft, testing infrastructure to follow after this is confirmed)

- **AT-CAP-1 (resource limits, mandatory, both runners):** a command bound
  through either runner that exceeds its configured wall-clock timeout is
  killed (whole process tree, not just the direct child) and reported as a
  distinct `timeout` status. Default 10 minutes, repo-configurable per
  binding.
- **AT-CAP-2 (memory ceiling, mandatory, both runners):** a command
  exceeding its configured memory ceiling is killed and reported as a
  distinct status; if the ceiling cannot be enforced on the host (`ps`
  absent), the command is killed and reported `memory_ceiling_unavailable`,
  never silently allowed to run unbounded. Default 2 GiB, repo-configurable.
- **AT-CAP-3 (network is declared, not ambient, both runners):** a binding
  without `network: true` has no outbound network reachability; one with
  `network: true` runs unrestricted. Existing/undeclared bindings keep
  today's reachable-by-default behavior for this release (Option B above);
  a repo may tighten the default to deny via `.rig/execution-policy.json`.
- **AT-CAP-4 (elevated capability needs committed authority, CI path):** a
  binding requesting a capability beyond its default (raised memory/timeout,
  network where undeclared) executes only when `.rig/execution-policy.json`
  predeclares that exact grant for that exact binding id; absent that entry,
  the runner refuses and reports a distinct non-passing status rather than
  silently running under the lower default or silently acquiring the
  capability.
- **AT-CAP-5 (fail closed, both runners):** any control this set promises
  that the host cannot actually enforce is a refusal of that execution
  class, reported as its own distinct status — never a silent downgrade to
  "ran anyway."
- **AT-CAP-6 (parity, cross-cutting):** an explicit test asserts the two
  runner implementations agree on AT-CAP-1..5's observable behavior for the
  same binding input, so a fix landing in one and not the other fails this
  test immediately instead of shipping silently (closes today's discovery
  structurally, not just for today's specific bug).

## Open, not yet resolved

- Exact shape of `.rig/execution-policy.json` (new file, or extend the
  existing `.rig/service-bindings.json`) — implementation-level, will settle
  during `rig-product-design`, not blocking the acceptance-criteria
  sign-off above.
- Whether any of AT-CAP-1..6 should be promoted into the frozen Gate 1
  oracle (`wiki/gate1/`, alongside `AT-LF-20`-`24`) or stay in
  `tests/guarantee-coverage.test.js` like RIG-135/141/142/143's tests did —
  the owner's call, same as every other gate-membership decision in this
  project.

## Next

Reported to the user for sign-off on the acceptance criteria and the one
real decision (network default rollout) before writing the testing
infrastructure and implementation. Per the gate contract, an agent may draft
the oracle but the human signature is what makes it safe to build against.
