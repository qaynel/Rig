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

## Conclusion

No reproducible code-level defect explains the 30-minute duration itself —
it doesn't reproduce under isolation or under heavy synthetic load, and the
mechanism that would make it a code bug (an actual pipe deadlock) is
independently ruled out by how the script is written. The most defensible
reading: this was a one-off external stall of a single subprocess launch, the
kind that a real reviewer call over the network can also produce for entirely
mundane reasons (rate limiting, a slow response, a stuck connection) — which
is exactly the scenario RIG-124's cap exists to bound. That reframes the red
run correctly: the *duration* was incidental noise; the finding that matters
is still [[RIG-124]] **124.1** — that when a subprocess genuinely does take
the full timeout (for any reason, real or synthetic), its failure is silently
dropped from the retry count instead of being counted against the cap. That
conclusion, and the fix it calls for, are unchanged by this trace.

**Recommendation: do not spend further time chasing the exact cause of one
subprocess's one-off delay** — it isn't reproducible and isn't on the
critical path. The actionable item remains fixing RIG-124.1 before RIG-120's
ceremony run, since a real 30-minute-plus reviewer stall is an expected,
recurring possibility in production, not a fluke specific to that run.
