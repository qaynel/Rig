---
date: 2026-10-18
source: agent
topics: the-overhaul, testing-strategy, catalogue-contract
decisions:
status: historical
supersedes:
tags: qa-closeout, candidate, verification
summary: Report-only audits found a shipped README test gap, now covered by a disposable-install assertion; final candidate verification is next.
---

Report-only audits of C1, C3/C4, and C7/C8 found no remaining implementation defect in the inspected paths. The C8 audit identified that the new disposable-install test checked the onboarding README but missed the manifest-shipped skills README. The test now reads `.rig/skills/README.md` from the installed tree, compares it to the source, and asserts the current optional-delivery and executable-mode claims. It also asserts the signed current-authority statements directly. The C1 interrupted-publication regression now checks the transaction bytes and an unrelated user file's bytes and mode. The targeted recovery case passes on macOS; the named recovery and two replacement cases pass on Linux. Generated wiki indexes and size hints have been refreshed.

The exact final-byte npm gate, committed archive E2E, real-npm MCP retry, and binding owner-designated review receipt remain pending. No binding receipt, push, approval, or merge has been attempted.
