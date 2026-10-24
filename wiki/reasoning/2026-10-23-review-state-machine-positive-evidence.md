---
date: 2026-10-23
source: agent
status: current
topics: review-receipts, testing-strategy
summary: RIG-124.3: a review spends an authorization only on positive evidence of a completed review; timeouts, outages and malformed reports are bounded infrastructure failures.
---

# RIG-124.3 — the review state machine, on positive evidence only

2026-10-23. Owner approved §9 of the consolidated engineering directive: a
review spends a completed-review authorization only when there is reliable
evidence that the reviewer ran and returned a valid verdict.

## What was wrong

Two defects, both in `scripts/review-receipt.js`:

1. The attempt counter was written optimistically before the spawn
   (`failures: priorFailures + 1`) and only cleared on a confirmed pass. Every
   way of not passing — provider outage, bad `--model`, missing CLI, timeout,
   empty output, a malformed report — charged the re-review cap as if the
   reviewer had read the bytes and objected to them. Two provider outages
   exhausted a release's whole review budget without a single line being read.
2. The refund path added in RIG-124.2 keyed on ten regexes matched against
   reviewer stderr. Vendor error text drifts with every provider release, so
   that classification silently rots; `claude -p` and `codex exec` expose no
   HTTP status, so there is nothing behind the text to fall back on.

## The rule now

A review **completed** if and only if all four hold:

- the process exited 0,
- its output parsed as JSON,
- `verdict` is `pass` or `fail`,
- `verdicts` is an array.

Everything else is an infrastructure or execution failure, which says nothing
about the reviewed bytes and charges nothing. A `fail` verdict is complete as it
stands and is charged immediately, because the validation gate rejects every
failing receipt and exits. A `pass` stays in flight until its receipt validates:
a pass that cannot be bound to the acceptance ids, or that passes while carrying
blockers, is a self-contradictory report and must not be able to buy — or burn —
an authorization by being malformed.

## State

One record per author-context at `<receipt>.attempts.json`:

- `failures` — completed failing reviews. The only thing the cap charges.
- `infra_streak` — consecutive infrastructure failures. Bounds uncharged
  retries at `INFRA_STREAK_LIMIT = 3`, then stops with an explicit blocker that
  prints the last three attempts and their reasons. Uncharged must not mean
  unlimited, or a broken reviewer loops forever at full token cost.
- `in_flight` — `{ nonce, started_at }`, written before the spawn and cleared in
  the same write as the outcome. This is how RIG-124.1's safety intent survives:
  a process killed mid-spawn leaves the marker behind, and the next run accounts
  for that attempt exactly once, as `interrupted`. `logAttempt` replaces any
  earlier entry for the same nonce, so no attempt can be counted twice.
- `attempts` — last 20 attempts with state and reason, the audit trail.

States: `running`, `completed`, `failed`, `interrupted`. `attempted` is not a
stored state — an attempt is `running` from the moment it is persisted.

## `--ingest`

`--ingest <file>` reconciles reviewer JSON or a transcript supplied by hand
against the recorded finding-class history: how many of its findings the record
already holds, how many are new, how many could not be interpreted. It is
read-only by construction — it never writes history, never spends or refunds an
authorization, never writes a receipt — because a pasted report is not evidence
that a reviewer ran over these bytes. It stays reachable after the cap and the
streak limit have stopped automatic reviewing, which is exactly when a report
arrives by hand. A report that is not a valid completed review exits non-zero
and says which parts it could not interpret.

## Tests that changed meaning

Three pre-existing cases asserted the old accounting and were rewritten, not
deleted:

- `counts a killed/timed-out reviewer spawn toward the re-review cap` → a
  timeout is now persisted as an infrastructure failure and the genuine
  re-review stays available. The RIG-124.1 guarantee it was protecting (never
  silently drop an attempt) is asserted directly, on the persisted record.
- `keeps the retry cap when a pass report fails receipt validation` → a
  malformed pass spends no authorization, and three in a row hit the blocker.
  The protection moved from the cap to the streak bound.
- `still counts a launch failure that is not a provider limit` → there is no
  vendor-text distinction left to test. Any non-zero exit, empty output, or
  invalid verdict is uncharged; the streak bounds all of them.

New cases: interrupted-attempt recovery exactly once; the `--interim` path
(charged on a fail, cleared on a pass, history preserved across both); `--ingest`
reconciliation, refusal, and non-overwrite of protected history.

`tests/release-blockers.test.js`: 49/49 green. Neither file is in the Gate 1
frozen manifest.
