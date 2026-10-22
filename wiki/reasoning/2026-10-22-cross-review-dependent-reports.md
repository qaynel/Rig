---
date: 2026-10-22
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-22-linux-signal-taxonomy-integration
tags: verification, remediation, linux
summary: Cross-review repairs the installed dependency not-run report gap with red/green10/10; Linux root cause is signal metadata lost by Bubblewrap, with private-channel preservation in flight.
---

18:01 UTC — The two completed Luna lanes cross-reviewed one another's production fixes. Integrity review found no additional defect and focused29/29 passes. Installed review found one concrete remaining gap: after an earlier failure, the real installed command correctly skipped later services and printed the dependency state, but did not persist that later-service outcome. Root added an assertion to the actual CI-process regression, observed the expected red, then reused the shared report writer in the installed fail-fast bookkeeping branch. Installed/report checks pass10/10. Local CI evidence stays ignored and redacted; the disclosed stdout object still contains only verdict/counts/rules, with empty stderr.

Linux investigation has exact raw boundary evidence. Direct Node SIGTERM produces null status plus SIGTERM; Bubblewrap returns143 with no signal, and the memory supervisor likewise loses the distinction from intentional exit143. The Linux lane is reusing memory-guarded-exec for a tiny in-sandbox Node supervisor with a dedicated metadata pipe, keeping task stdout separate and closing the extra descriptor for the task child. No isolation mechanism or namespace is weakened. Distinct genuine exit143 versus signal death must be tested before accepting the patch.

Seven original shared-seam repairs and their root-reviewed nonfrozen tests are ready for a recoverable intermediate commit; Linux supervisor changes are still owned by the active worker and excluded from that checkpoint. The original16 protected files/95 cases still verify. Finish Linux actual-process proof, integrate, reconcile the reopened ledger and final wiki, then freeze a clean candidate for full npm and fresh binding review. Previous review failure/counter remain preserved; nothing is pushed or declared deployment-ready.
