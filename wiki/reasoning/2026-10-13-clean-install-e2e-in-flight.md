---
date: 2026-10-13
source: agent
topics: distribution-and-release, install-manifest-removal
decisions:
status: historical
tags: interdependency
summary: Clean-install E2E implementation in flight; candidate archive verification and scoped runtime evidence cleanup have focused green checks, real installed service run pending.
---

The public installer previously accepted release tags only. Candidate-artifact
input now requires a SHA-256 archive digest and the exact Git archive commit
header. The focused digest-mismatch case failed because the flag was absent,
and passes after implementation. The public path still extracts to a temporary
source tree before bootstrap; dependencies download through real npm ci into a
fresh staging directory and their target writes enter the install journal.

Runtime evidence previously bypassed install ownership, and purge deleted the
entire reports/rig directory. A narrow evidence ledger retains original bytes
and modes for named onboarding artifacts and JSON reports, binds removal to
written digests, and refuses edited artifacts. Scoped cleanup restores a
preexisting last-uninstall report and retains unrelated ignored reports. The
existing interrupted state-write test exposed an error-message regression;
its expected recovery guidance was restored and the targeted case is green.

The E2E script now crosses the public installer, installed MCP stdio client,
installed onboarding CLI and fixture-only SSHSIG approval. It selects the
onboarding documentation service and requires nonzero executed service checks,
then compares complete before/after file inventories, including .git,
ignored files and existing user reports. The scheduled signer is ephemeral,
created only for two mkdtemp fixture repositories, and never uses the owner's
release key. Service onboarding is being delivered concurrently by the
catalogue owner; exact check IDs and the first real network run remain in
flight.

The workflow resolves one commit and checks it on Linux and macOS with no npm
cache setup. Local intermediate evidence uses an explicitly provisional Git
snapshot in a separate temporary repository because the shared workspace is
being edited concurrently. That evidence cannot satisfy final release
eligibility. The final reviewed and signed SHA must run again on clean CI.
