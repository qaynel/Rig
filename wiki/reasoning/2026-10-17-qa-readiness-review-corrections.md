---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: current
summary: Independent review's base-binding and cross-platform digest defects reproduce red and now pass; code-suite run was deliberately interrupted for these fixes.
---

Done: the settled documentation/policy focused group passed 59 tests, with
zero failures. Wiki budgets, generated indexes, size hints, diff whitespace,
corpus projections and release-workflow YAML parsing passed. The current PR
diff is approximately +67,085/-32,298 lines, a 48.14% deletion-to-addition
ratio; that is a gross diff measurement, not a claim that all retained code
or documentation shrank by that percentage.

Independent review found two further concrete defects: deployment validation
omitted the expected QA PR base, and the implementation digest included umask
permissions that Git does not preserve. Two new checks reproduced both bugs
(10 pass / 2 fail). The checker now requires origin/qa-prod, and the shared
digest normalizes to Git's executable/non-executable modes while preserving
path, kind and content. All 12 deployment regression tests now pass.

The advisory npm run test:code run was deliberately interrupted with SIGINT
before editing these bytes. Its canceled test-file entries are not product
failures or completion evidence. It will be rerun on the settled tree.

The reviewer retracted a proposed cryptographic-receipt requirement after
checking AT-GATE-3, AD-29 and the trust boundary: this release requires a fresh
wrapper-authored review, not a new signing system. Docs now distinguish JSON
binding validation from operational custody of the unchanged wrapper output.
Branch-protection inspection currently returns HTTP 403; the runbook now gives
the additive UI operation rather than a PUT that could clear existing rules.

In flight: a Luna worker reproduces a wrapper retry-counter defect where
malformed or incomplete passing reports erase the attempt before validation.
Next: complete that fix, rerun integrated evidence, and await the pending human
signature. No signing or protected-oracle edit was performed by this session.
