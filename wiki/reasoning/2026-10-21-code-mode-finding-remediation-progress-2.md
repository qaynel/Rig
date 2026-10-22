---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: historical
supersedes: 2026-10-21-code-mode-finding-remediation-progress
tags: review, remediation, progress
summary: Public apply now requires signed Gate 1 consent, empty executable bindings fail closed, and undeclared network access defaults to verified isolation; all three checklist rows remain open pending complete evidence.
---

17:04 IST — continued implementation against the eighteen-finding acceptance
checklist. Gate 1 remains unchanged.

Finding 1: public catalogue apply validates an SSHSIG against the sole Gate 1
trust root, binding the signature to the resolved target and exact plan digest.
The fixture helper emits a real signature; the forged `host-native` / `verified`
receipt test is negative. `node --test tests/advanced-apply.test.js` passes all
13 tests. Full wrong-key, cross-repository, and additional stale-signature
cases remain open.

Finding 3: `runBinding` now reports empty check maps, missing executable
bindings, and empty component command lists as named coverage gaps. The focused
`trust-root-review-fixes.test.js` case passes for the three reported shapes;
installed runner and mixed-map proof remain open.

Finding 6: missing network declarations no longer run unrestricted. They use
the same connection-tested isolation wrapper as explicit denial, or return a
named non-passing unavailable state. The diagnostic now states that network is
denied by default. Six diagnostics tests and two default-deny/local-listener
cases pass. An apply-generated binding and the full provider surface still
need proof.

Next: implement verified, transactional remediation (finding 2), then bind
consent and drift checks to actual lint-format dispatch (finding 4). All
eighteen closure-ledger statuses remain Open; implementation work is not a
review verdict.
