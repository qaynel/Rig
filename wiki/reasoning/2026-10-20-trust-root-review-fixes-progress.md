---
date: 2026-10-20
source: agent
topics: gate1-signing, review-receipts
decisions:
status: historical
supersedes:
tags: trust, progress
summary: Progress trace for fixing the nine findings of the failed trust-root binding review (started 20:05 IST).
---

20:05 IST — started. State: owner applied and signed the first amendment (HEAD
042a8505); the one authorized trust-root review failed (3 major, 6 minor,
counter 6, preserved). Owner asked for all issues resolved before the final
review agent. Constraints unchanged: no frozen edits, no signing, no review
run, no push. Frozen changes go in one second owner amendment.

20:35 IST — product fixes done. Finding 1: generic-success detector in
check-runner (bare, checks and component bindings), enforced by
validateDisposition and the catalogue authorship gate; convention reasons need
real service content. Finding 2: `interrupt_after` deleted from lifecycle and
lint-format; interruption is now only a real failure. Finding 7: host-native
policy approval is refused as unavailable (no receipt the loader cannot
verify). Finding 8: networkIsolationPrefix returns a prefix only after a probe
inside it sees a connection denied (EPERM macOS, ENETUNREACH Linux, both
observed). Editable fixtures that used `node -e ''` as a binding now read the
repository.

20:45 IST — finding 3 found real product gaps, not just thin tests: a merged CI
job was never removed for five of six providers (best-effort, job left in the
user's pipeline), and uninstall left a trailing newline on a user file that had
none, and a re-run after an interrupted uninstall reported an already-removed
global entry as best-effort. All three fixed (journaled marked-region digests,
separator restore proven against the preimage digest, already-absent entry is
done). Regression file tests/trust-root-review-fixes.test.js, 14/14; seven
mutants all caught. Design text corrected for findings 4-7 (drift detector not
shipped, stock disclaimer sentence, host-native, missing test paths), plus a
guard test that every test path the design names exists.

20:47 IST — in flight: owner amendment 2 built by .context/build-owner-batch-2.py
(AT-SHAPE-5, AT-CI-1, AT-INSTALL-1, AT-UNINSTALL-1, AT-LF-17, AT-PRESENCE-1,
AT-LF-22 bodies; titles unchanged, 95 cases); candidate oracle passes 74/74
against live code; patch applies clean. Live red set is exactly the three
cases whose old bodies call the deleted lever / host-native minting. Next:
full final-byte gate, evidence doc, runbook, wiki index, local commit.
