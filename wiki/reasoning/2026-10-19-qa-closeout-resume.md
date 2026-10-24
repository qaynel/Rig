---
date: 2026-10-19
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: historical
supersedes:
tags: qa-closeout, verification
summary: Closeout resumed from the committed C1–C8 fix; maintained migration, optional-helper and health checks pass, while catalogue authorship and unsigned oracle work remain.
---

The supplied follow-up describes the older `082d8467` candidate. The current branch contains the later `f8140b72` closeout fix. The maintained interrupted-publication migration case passes on macOS. The optional-helper installed command/mode test and health-issue public-entrypoint retry test pass (six focused tests). The old scratch unlink probe no longer injects at its former source instruction, and the old service-reselection probe now raises the expected stale-output error instead of returning its prior shape; neither is a current product failure signal. Maintained normal/resume replacement and post-approval edit regressions are present in the suite.

The current uncommitted review remediation remains unfinished. A focused authorship test reports 16 corpus failures: near-duplicate vulnerability maximal prose plus missing declared terms in lint-format and release-gating fragments. Catalogue cleanup, installed lint-grade execution, and a complete unsigned frozen-oracle candidate patch are in independent work. The signed acceptance files remain untouched. The binding-review failure counter remains at two for the same author context; no retry, push or approval is attempted while implementation is moving.
