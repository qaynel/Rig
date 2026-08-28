---
date: 2026-08-28
source: agent
topics: trust-and-failure-boundaries, testing-strategy
decisions:
---

# Grilling: runGrade has no network isolation (G2 from the PR #83 review)

**Context:** [[status]]'s PR #83 independent-review section named this as
gating item **G2**: `runReadOnly` wraps every command through
`argvWithNetworkIsolation` (`unshare`/`sandbox-exec`) and refuses to run when
neither is available; `runGrade` — the path that runs the repo's own
lint/format/`make` commands — calls `runCommand` with raw argv, no isolation
at all. AT-LF-22's frozen text says "an approved command … not explicitly
granted network access," not "a read-only command," so the guarantee reads as
covering both execution paths. `runGrade` has no production caller yet
(confirmed by grep — only test/comment references), so this is latent, not
observed in the field, but it blocks signing AT-LF-22 as implemented.

## Question put to grilling

"Do we have enough context to proceed with this fix?"

## What the record already pins, without asking

- The fix shape is already named in [[status]]: add the isolation prefix to
  `runGrade` plus a parity test, same shape as the two parity tests already
  in `tests/guarantee-coverage.test.js` (`AT-PROC-1b` cwd, `AT-PROC-1c`
  memory).
- `AT-PROC-1` ([[mistakes/guarantee-sharding]]) is workflow doctrine, not a
  signed Gate-1 case — adding `AT-PROC-1d` needs no owner re-sign.
- The frozen oracle is unaffected: `tests/advanced-oracle.test.js`'s
  `runGrade` cases (`AT-LF-7`/`8`/`9`) pass pre-computed `result` objects
  with no `argv` and never spawn; its `AT-LF-22` case only exercises
  `runReadOnly`. No frozen call site's sync/async contract or invocation
  shape changes.
- RIG-141's lesson applies directly: gating must be per-command
  (`cmd.network === true` bypasses the prefix and any refusal), not a
  function-level early return — a function-level guard would repeat RIG-141's
  over-block bug on the grade path.

## Decisions resolved this session

1. **What does `runGrade` do when isolation tooling is unavailable?**
   Considered: have Rig detect and offer to install the missing sandboxing
   tool. Rejected — the CI investigation
   ([[reasoning/2026-08-28-linux-network-isolation-ci]]) found the actual
   failure mode on a locked-down host is a **denied kernel capability**
   (AppArmor blocking unprivileged user namespaces), not a **missing
   binary** (`unshare`/`sandbox-exec` ship with essentially every Linux/macOS
   host already). No install closes a capability denial the host's own
   policy imposes. **Resolved:** `runGrade` mirrors `runReadOnly`'s
   refuse-and-report contract exactly — `network_isolation_unavailable`,
   gated per command so a `network: true`-granted command still runs.
2. **Fix `runGrade`, or ask the owner to re-scope AT-LF-22 to the read-only
   path?** **Resolved: fix.** Re-scoping needs an owner re-sign ceremony and
   nothing in §9.4 or the frozen acceptance text restricts AT-LF-22 to
   `runReadOnly`; fixing is ~1 file + 1 test and closes the gap the text
   already describes.

## Implementation watch-item, not a blocker

`AT-PROC-1c`'s existing fixture runs an *ungranted* `runGrade` command to
prove the memory watchdog. Once the isolation prefix applies to ungranted
commands, that fixture either gets wrapped by the sandbox prefix (the memory
watchdog samples only the *direct* child's RSS —
[[mistakes/guarantee-sharding]]'s enforcement-design note — a wrapper process
could mask the real allocator) or, if the namespace probe fails on the CI
host, returns `network_isolation_unavailable` instead of `memory_exceeded`
and the assertion breaks either way. Mark `AT-PROC-1c`'s command
`network: true` so it stays on the unprefixed path and keeps testing memory
in isolation from this change. Confirm during implementation that
`sandbox-exec`/`unshare` exec in place (pid preserved) so `AT-PROC-1d`'s own
wrapped assertion samples the real process.

## Ticket

[[RIG-143]] — GitHub issue not yet filed; pending confirmation.
