---
date: 2026-10-23
source: agent
topics: the-overhaul, ci
decisions:
status: current
supersedes:
tags: ci, regression, trap, verification
summary: GitHub test job is red (33 fails, identical on push and PR) from three Linux-runner causes, none reproduced on the author's macOS: shallow checkout hides the v5 commit, CI=true switches Rig to CI-projected output the tests don't expect, and bwrap's loopback gives ECONNREFUSED not ENETUNREACH.
---
<!-- needs-human-review: status -->

Reproduced the red job in a Linux container (ubuntu 24.04, node 22, bubblewrap, python venv, shallow clone, CI=true GITHUB_ACTIONS=true). Failures cluster into:

1. Shallow checkout: `actions/checkout` default depth 1, so commit b7f72117 (the v5.0.0 installer) is absent. `tests/migrate-v5.test.js` "migration refreshes an untouched v5 network policy default" ran `git show b7f72117:...` without the `hasV5` skip the sibling test has -> `fatal: invalid object name`. pre-v5-gate and coherence then fail because they execute that test as proving evidence. Fix: skip guard on that test; `fetch-depth: 0` in test.yml and the health gate checkout so the v5 tests actually run.
2. CI markers: with `CI=true`/`GITHUB_ACTIONS=true` `runChecks` returns only the CI-projected aggregate JSON with empty stderr, and diagnostics render as `::warning` annotations. About 25 tests (advanced-sync, advanced-lint-format, basic-guard-scanner, runtime-onboarding, review-received-diagnostics, qa-installed-check-closure, trust-root-review-fixes, etc.) assert local-mode text. They never ran under CI=true before: the last green CI was 2026-09-02 with a ~1 minute suite. Candidate fix: a `tests/helpers/local-mode-env.js` (precedent: `hermetic-git-env.js`) required by the affected non-frozen files. Hiding CI markers in the workflow was rejected by the permission classifier as a CI bypass; the per-file helper edit is held for owner go-ahead.
3. Sandbox loopback (AT-LF-22, frozen oracle, also finding 8 in a non-frozen file): inside `bwrap --unshare-net` loopback is up with 127.0.0.1 assigned, so connecting to a host listener port gives ECONNREFUSED; the frozen test accepts only EPERM/EACCES/ENETUNREACH/ENETDOWN/EADDRNOTAVAIL. Commit 034d5168's `ip addr flush dev lo` wrapper can never work: bwrap drops all capabilities, so `ip` gets "Operation not permitted" and silently no-ops. Verified working fix: run the wrapper as in-namespace uid 0 with `--cap-add CAP_NET_ADMIN --cap-add CAP_SETPCAP`, flush lo, then `setpriv --bounding-set=-all --inh-caps=-all` before exec of the task. Applied in `rig/lib/sandbox.js`; falls back to the old behaviour when `ip`/`setpriv` are missing.

Method note: an unprivileged docker container cannot run bwrap `--unshare-pid` (masked /proc), so use `--privileged` for the repro. Gate 1 frozen files (advanced-oracle, helpers/advanced.js, package-scripts.json) were not touched.

In flight: full-suite diagnostic run with CI markers stripped locally (diagnostic only) to list what remains after causes 1 and 3.
