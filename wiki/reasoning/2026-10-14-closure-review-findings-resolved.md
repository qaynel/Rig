---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: current
summary: Code-review findings were fixed or tied to the owner-controlled v6.0.0 publication dependency; focused workflow and secret checks pass.
---
Done: T-10.2 findings from the [review report](2026-10-14-closure-code-review.md) were dispositioned. Health now passes an explicit read token to coherence and grants the reusable health job its required bounded permission; YAML parse and `node --test tests/health-workflow.test.js` passed (2/2). Both publishable-file secret scanners now inspect patch files, exempting only four exact public upstream placeholder lines; `npm run test:secrets` passed (15/15) after the new patch-fixture regression first failed (2 failures). README now acquires its tagged checkout in the one install line; the current command reports `fatal: Remote branch v6.0.0 not found in upstream origin`, an owner publication dependency tracked by T-9.7, not an open implementation finding. The latest `node scripts/check-coherence.js` remains red only on RIG-155/156 issue creation pending and nine proving-test evidence findings. In flight: T-10.3 amendment bundle. Next: assemble and advisory-check the owner bundle.
