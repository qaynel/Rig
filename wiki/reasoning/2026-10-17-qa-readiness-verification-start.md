---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: Documentation cleanup is settled for verification; prior remote CI is green, but current signed-contract verification awaits the owner and v6.0.0 remains unpublished.
---

Done: three Luna workers recovered both supplied histories, audited the central
onboarding/install flow, checked live issue labels/states, corrected active wiki
routes, and independently reviewed the deployment-gate changes. Ten focused gate
regressions pass. The 5,082-line resume transcript is compacted to a 64-line
archive with all three owner messages verified verbatim, original provenance,
historical failures and links. Three unreferenced superseded plans (2,272 lines)
were removed with an authority/check replacement map. Fourteen obsolete transient
trace statuses are superseded; their bodies are unchanged.

The August retained-link sources keep their original bodies; a missing summary
was added as metadata to the D24 approval so its restored path meets the budget
without adding a waiver. Stale onboarding/signing hub waivers are removed as
the active documentation shrinks. Historical foundational/MVP docs are explicitly
marked historical and direct readers to the current closeout.

Current read-only external verification: PR 153 remains open against qa-prod;
its remote head 8d801d12ab2a2392324285691812c89b43df2f1c has successful test,
gate1-pin and three platform process-cleanup checks. Those results do not cover
this newer tree. `gh release view v6.0.0` returns `release not found`. The five
redesign issues are open and labeled; closure must follow the tag and smoke.

In flight: focused wiki/policy checks, then the code suite as advisory evidence
while the human signing request is pending. The signed npm test gate will be
reported separately and never replaced by advisory tests. Final receipt is
deferred until final signed bytes exist. No oracle files were edited or signed
by this session. Next: resolve current test failures, renew release evidence,
and retain any unavoidable human/publication blockers explicitly.
