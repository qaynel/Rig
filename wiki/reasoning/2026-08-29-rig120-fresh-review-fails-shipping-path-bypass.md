---
date: 2026-08-29
source: agent
topics: trust-and-failure-boundaries
decisions:
status: historical
---

# RIG-120 fresh independent review: FAIL — shipping path bypasses the safety guarantees

2026-08-29

## What ran

The formal release-review ceremony (`scripts/review-receipt.js`), against the
exact worktree including all uncommitted safety-defect fixes on
`rig-120-safety-defects`, base `origin/prod`, reviewer model `claude-opus-5`
in a fresh sandboxed session with no access to this conversation. Verdict:
**fail**. Because it failed, the wrapper refused to write a receipt file, as
designed — no receipt exists at
`wiki/sources/reviews/rig-120-v5.0.0-2026-08-28.review.json`.

## Findings, and which I independently verified against the code

**Verified — blocker.** The five shell-trust guarantees (single-use approval,
filesystem/env isolation, network denial, resource caps, symlink-escape
refusal) are implemented and tested only inside `lint-format.js`'s
`runReadOnly`/`runGrade`/`executePlan`/`runAutofix`. Grepped the whole tree:
nothing outside `lint-format.js` and its own tests calls any of those four
functions. The actual command runner the installed product uses —
`checks.js`, invoked from `apply.js`, materialized into installed repos as
`.rig/bin/check.js` — spawns commands through the shared guarded-spawn helper
with no environment allowlist (inherits the parent process's real env), no
network-isolation prefix, no memory ceiling, and a plain string-prefix `cwd`
containment check rather than a real-path one. This matches what
`wiki/tickets/RIG-144.md` already records as open and explicitly
"not yet reviewed or signed off." The guarantees are real and well-tested,
but on a path the shipping product never takes.

**Verified — blocker.** The symlink-escape refusal the technical design
promises does not happen. The planning step's real-path containment check is
wrapped in a silently-swallowed exception handler; on an escape it just
leaves the snapshot empty instead of refusing. The execution step then reads
the same file a second time with **no containment check at all**, so the
outside file's bytes are read through the symlink — the escape then surfaces
as a recoverable "drift" state, not a refusal. Read both functions directly
to confirm this.

**Verified — major (weak test).** The one test guarding the symlink-escape
promise only asserts the snapshot is empty, which is equally true for a
missing file or a parse error. It would not fail if the escape above were
never fixed and the outside content simply failed to parse a different way.
It also never exercises the execution step where the actual unguarded read
happens.

**Verified, downgraded.** The review flagged the uncommitted, resigned oracle
files as unverifiable within its own session ("I could not execute the
verifier"). Ran the verifier myself: it passes cleanly against the registered
owner signing key. Not a live risk — the review's caution was reasonable
given its constraints, but the signature is good.

**Plausible, likely already an accepted scope decision, not re-verified
deeply.** The review flagged that non-GitHub CI providers get an honestly-
downgraded "best effort" removal rather than the full removal promise —
correct per the test file, but this matches a scope decision already
recorded repeatedly elsewhere in the project record, so it may not be new
information for the owner.

**Not independently verified (minor, lower priority):** one network-denial
test that can pass vacuously on a host with no sandbox tool available, and
the fix-command path not carrying the same resource/network guards as the
read-only path.

## Why this matters

This is a materially different problem than every prior RIG-120 review
pass recorded in the project status — those found and closed real defects
*inside* the guarded functions. This pass found that an entire, real,
well-tested safety layer sits on a code path the installed product does not
call. That is a release-blocking gap, not a polish item, and it was not
caught by any of the prior review rounds because they were all scoped to the
guarded functions themselves rather than to what the installed product
actually executes.

## Root cause: why the shipping-path bypass wasn't caught by five prior review rounds

Traced why this survived every earlier pass. The project already has a
guard against exactly this class of bug —
[[index/traps|"The oracle is green at a seam the product does not use"]],
discovered 2026-08-22, which produced `tests/runtime-caller-graph.test.js`'s
"every runtime library module has a production caller" check. That check
operates at file granularity: does *any* production file `require()` this
module. `lint-format.js` is required by `plan.js` and `apply.js` — so the
check passes — but only for two unrelated exports (`buildBinding`,
`validateBindingSources`). The four functions carrying the actual safety
guarantees are still never called; the file-level check cannot see that.
Every acceptance-test-driven review round asked "does this function behave
correctly against its test," which it does, and never asked "is this
function reachable from the real installed entrypoint." Detail added to the
traps index.

## Second pattern, separate from the above: reactive point-fixes on the CI/journal trust boundary

Not part of this pass's findings, but visible by reading this ticket's own
history: the uninstall CI-ownership logic went through five-plus separate
review-then-patch rounds (editable journal fields as ownership proof → fixed;
`managed_line` as ownership proof → fixed; path-identity/realpath gaps → fixed
twice more). Each round closed exactly the bypass the reviewer demonstrated,
using a new example, rather than the first fix generalizing to "no editable
journal field ever proves ownership of a path outside Rig's own install
area" and closing every instance of that reasoning error at once. Worth the
owner's attention as a pattern independent of today's finding: it is why this
ticket has taken this many rounds even before today's structural finding.

## Next

Not a code fix I should make silently — it changes which module the
shipping product's checks actually run through, which is an implementation
decision, not a review action. Reported to the user for a decision on scope
and priority before any further RIG-120 ceremony attempt.
