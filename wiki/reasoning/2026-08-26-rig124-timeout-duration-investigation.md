---
date: 2026-08-26
source: agent
topics: review-receipts
decisions:
---

## Task

Follow-up to [[2026-08-26-rig124-cap-lost-update]]: that trace explains *what
happens* when a reviewer subprocess is killed by its own timeout (the failure
is silently dropped, RIG-124.1). It does not explain *why* the subprocess in
the original red run actually took the full ~30 minutes in the first place —
that duration is the whole trigger condition, and a subprocess wrapping a
one-line stub shell script taking 30 minutes deserves its own explanation
before treating it as "just what happens sometimes."

## Hypotheses, ranked

1. Some other test in the suite accidentally invokes the real reviewer CLI
   (network-bound, genuinely slow) instead of the local stand-in.
2. The stub script's input pipe deadlocks (parent never closes stdin, child
   blocks reading forever) — would hang indefinitely, not just ~30 minutes.
3. Heavy OS-level contention from all 72 test files running concurrently
   starves the trivial subprocess spawn badly enough to approach the 30-minute
   ceiling.
4. Environmental one-off: machine slept/throttled mid-run, or something
   outside the test's control stalled a single process launch.

## Elimination

- **(1) ruled out.** Only this one test file drives the review-receipt script
  anywhere in the suite, and every call routes through a locally-written stub
  standing in for the reviewer, injected first on the search path. No other
  test in the suite shells out to a real reviewer.
- **(2) ruled out.** The script always hands the prompt to the subprocess as
  direct input (not left open), which is the standard non-deadlocking way to
  do it; confirmed empirically below.
- **(3) tested directly, ruled out.** Baseline: an unloaded run of the stub
  with a realistic-size prompt (the actual combined size of the three spec
  documents the real ceremony reviews, ~305 KB) completes in 584ms. Repeated
  under synthetic heavy load — dozens of CPU-spinning processes plus a
  fork/exec busy-loop, pushing the load average to ~2.3x this machine's core
  count — the same call completed in 230ms, no slower than baseline. This
  machine's scheduler does not meaningfully delay a trivial subprocess spawn
  even under significant oversubscription, so parallel-test-file contention
  alone does not explain a 30-minute stall.
- **(4) checked, no evidence found, but not fully excludable.** The system
  sleep/wake log for the window in question shows no sleep event, and an
  active caffeinate assertion was preventing idle sleep at the time — so this
  specific box did not doze off. This doesn't rule out a different one-off
  stall (a security-scanning tool doing something slow to a freshly-written,
  freshly-executable file being the most plausible remaining shape, though
  unconfirmed) but there's no further evidence to chase without instrumenting
  the *next* occurrence live.

## Conclusion (superseded — see addendum below)

No reproducible code-level defect explains the 30-minute duration itself —
it doesn't reproduce under isolation or under heavy synthetic load, and the
mechanism that would make it a code bug (an actual pipe deadlock) is
independently ruled out by how the script is written. The most defensible
reading: this was a one-off external stall of a single subprocess launch, the
kind that a real reviewer call over the network can also produce for entirely
mundane reasons (rate limiting, a slow response, a stuck connection) — which
is exactly the scenario RIG-124's cap exists to bound.

## Addendum: a real leaked process, found by checking for one

The user pushed back correctly: "a subprocess taking 30 minutes is itself
suspicious — is there an actual defective/stuck process, not just noise?"
That's a fair challenge to the conclusion above, and checking for it directly
(rather than reasoning about plausibility) turned up a genuine defect.

A live process was found still running on this machine, unrelated to this
session: a shell interpreting the same throwaway reviewer stand-in script
from the deterministic repro built in [[2026-08-26-rig124-cap-lost-update]]
(the one deliberately made to hang forever to prove the cap's lost-update
bug), orphaned (reparented to PID 1) and alive since that investigation, over
40 minutes ago, still looping and still spawning children. Its working
directory no longer exists — only the process does.

**Root mechanism, confirmed with a controlled test:** the stand-in script has
more than one line, so the shell interpreting it must fork a real child
process for each step rather than replacing itself. When the wrapping
process is killed — whether by the script's own internal timeout, or by an
outside kill — only that direct shell is terminated. Any child *it* had
already forked partway through the script is not touched by that kill and is
never reaped; it is orphaned and keeps running indefinitely. Reproduced
cleanly: a shell blocked on its own child when the timeout fires dies on
cue, but its child survives, reparented to init, running forever.

**Why this matters beyond one leaked process:** the real reviewer program
(the actual review tool, not the throwaway stand-in) is a full agent that
plausibly spawns its own child processes internally while it works. If that
combination — kill the wrapper on timeout — doesn't reliably tear down
everything underneath it, a review that the tool believes it cancelled can
keep running in the background: still doing work, still consuming budget,
indefinitely, invisible to anything watching the wrapper. That is a more
serious version of the problem than "the retry count is wrong" — it means
"killed" reviews may not actually stop.

**Revised recommendation:** raising the timeout was never on the table and
still isn't — this addendum confirms why: the problem was never that 30
minutes is too short, it's that a kill doesn't reliably stop everything a
review started. Two things now belong on the fix list together, not
separately: (1) the already-filed cap bug [[RIG-124]] **124.1**, and (2) make
a kill of the reviewer wrapper actually terminate its whole process tree
(the standard fix is spawning it in its own process group and signaling the
group, not just the one tracked process), so a cancelled review is guaranteed
to actually stop. Filing (2) as part of the same follow-up rather than a
separate ticket, since both are about the same kill path being incomplete.
The one leaked process found on this machine is harmless debug debris (not
reachable from real ceremony runs) but should be cleaned up.
