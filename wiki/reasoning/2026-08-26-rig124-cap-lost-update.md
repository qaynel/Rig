---
date: 2026-08-26
source: agent
topics: review-receipts
decisions:
---

## Task

RIG-120 release-ceremony review, run fresh in a new session per the standing
instruction (no reuse of prior-session conclusions). Step 1 is confirming the
gate is green before calling `scripts/review-receipt.js`. The prior session's
`npm test` run reported RED: 473 passed / 1 failed, on
`tests/release-blockers.test.js:1104` —
`review-receipt cap is scoped per author-context and clears on a passing
verdict (RIG-124)`, `assert.equal(capped.invocationCount, 0)` actual `1`. Total
run duration was reported as `1800952 ms` (~30 minutes). Per policy that
session correctly stopped rather than reviewing red bytes, and this session's
job is to investigate that failure and track it as a ticket.

## Checkout sanity check first

Before trusting the red report, checked whether the local checkout was stale —
this exact thing happened earlier today (see
[[2026-08-26-review-round-code-level-findings]], 11 commits behind). This time:
`git log HEAD..origin/qa-prod-finishing-up` shows exactly one commit ahead,
`ff295cf` "Document RIG-127.11 and RIG-127.12 uninstall follow-ups (#72)" — a
wiki-only doc commit (`wiki/Tickets.md`, one reasoning trace, `wiki/status.md`,
`wiki/tickets/RIG-127.md`). No code files. `git status` shows only wiki
modifications locally, no staged/unstaged code changes. So the code under test
is identical to what the red report tested; this is not a stale-checkout
repeat.

## Reproduction attempts

1. `node --test --test-name-pattern="cap is scoped per author-context"
   tests/release-blockers.test.js` — **passed**, 1.3s.
2. Full file, `node --test tests/release-blockers.test.js` — **all 34 tests
   passed**, 15.9s, no flakes across the RIG-124 tests.

So the failure does not reproduce in isolation or as a single file. Given the
prior run's ~30-minute wall time for what is normally a sub-second assertion,
the round total duration is suspiciously close to
`scripts/review-receipt.js`'s own `TIMEOUT_MS = 30 * 60 * 1000` (line 22) — the
hard kill timeout on the spawned reviewer subprocess. 1,800,000ms vs the
reported 1,800,952ms is a ~1s difference, i.e. almost exactly one timeout
period. That is too precise to be coincidental system slowness; it reads as
"one of the reviewer subprocess spawns inside this test genuinely hit its
internal timeout and got killed."

## Reading the cap implementation

`scripts/review-receipt.js`:

- Cap state lives in one file, `attemptsPath = \`${outPath}.attempts.json\``
  (line 55) — not partitioned per author-context; it is a single mutable slot
  whose one JSON blob happens to carry an `authorContext` field.
- On start (lines 56-64): read the file if it exists; if
  `state.authorContext === authorContext`, adopt `state.failures` as
  `priorFailures`; otherwise (including "file absent") `priorFailures` stays
  `0`.
- Cap check (lines 65-71): `if (priorFailures > MAX_RE_REVIEWS && !forceRereview) fail(...)`.
- The reviewer subprocess is spawned synchronously at line 162 with
  `timeout: TIMEOUT_MS`.
- **Only after that spawn returns** (lines 184-188) does the process write the
  incremented failure count back to `attemptsPath` (on a `fail` verdict) or
  delete it (on `pass`).

The gap: if the spawn at line 162 is killed by its own timeout (or any other
signal that ends the child before it produces valid output), `spawnSync`
returns with `status: null` and a `signal`, and `fail()` at line 171
(`if (run.status !== 0) fail(...)`) exits the whole `review-receipt.js`
process **before line 184-185 ever runs**. The failed attempt is never written
to `attemptsPath`. The persisted failure count silently undercounts real
failed/incomplete attempts by exactly the number of attempts that got
killed before returning.

## Deterministic repro of the root cause

Rather than trying to force a real 30-minute hang, simulated the same
observable effect directly: made the fake `claude` reviewer script hang
(`while true; do sleep 3600; done` after writing its invocation marker), then
invoked `scripts/review-receipt.js` against it with a short `timeout` so the
*test harness* — standing in for what the internal `TIMEOUT_MS` does for real
— kills the child before it returns.

Sequence for `authorContext = 'release-attempt-a'`, `MAX_RE_REVIEWS = 1`:

1. Normal fail. `attempts.json` → `{authorContext: 'release-attempt-a', failures: 1}`.
2. Reviewer subprocess hangs; outer call killed (`status: null`, `signal:
   SIGTERM`) before reaching the write. `attempts.json` **unchanged**, still
   `failures: 1` — call 2's failure is lost.
3. Normal fail again (would be the 3rd, cap-triggering attempt if failures had
   correctly reached 2). Reads `priorFailures = 1` (stale), `1 > 1` is false,
   **not capped** — spawns again and only now reaches `failures: 2`.

Output confirms this exactly:

```
call1 status 1 attempts: {"authorContext":"release-attempt-a","failures":1}
call2 (simulated timeout-kill) status null signal SIGTERM attempts: {"authorContext":"release-attempt-a","failures":1}
call3 (should be capped) status 1 stderr: review-receipt: rejected reviewer report ...
attempts.json final: {"authorContext":"release-attempt-a","failures":2}
```

Call 3 was not capped and spawned a real reviewer invocation — the same shape
as `capped.invocationCount` reading `1` instead of the expected `0` in the
failing test, and the same shape a real release-ceremony run would hit if a
reviewer subprocess ever legitimately times out mid-attempt.

## Conclusion

This is a genuine lost-update race in the cap's persisted state, not a test
flake and not stale bytes. The mechanism: **a killed or timed-out reviewer
attempt is not counted as a failure**, because the failure counter is only
persisted after the subprocess call returns cleanly. RIG-124's whole purpose
was to stop unbounded automatic retry/re-review loops from burning the token
budget; a reviewer subprocess timing out (exactly the kind of stuck/expensive
call RIG-124 exists to bound) is the one case where the cap silently fails
open and grants an extra, uncounted attempt instead of counting toward the
limit. Filed as RIG-124.1, follow-up to the closed RIG-124, using the same
convention as RIG-127.11/127.12 (defect found after the parent ticket's own
suite went green). Not a regression in this branch's diff — the cap logic has
been shaped this way since RIG-124 landed; today's red gate is the first time
it was exercised under conditions to trigger it.

This directly blocks trusting `npm test` and the RIG-120 release review to run
cleanly: a reviewer subprocess timeout during the real release-ceremony
receipt run (`node scripts/review-receipt.js ...` against a real model) would
hit this exact bug and silently under-count, defeating the one-retry cap
RIG-124 was built to enforce. RIG-120's ceremony should not proceed until this
is fixed or the owner explicitly accepts the residual risk.
