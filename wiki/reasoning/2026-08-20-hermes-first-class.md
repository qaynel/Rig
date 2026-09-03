---
date: 2026-08-20
source: intent owner
topics: host-and-ci-coverage
decisions:
status: historical
---

Resolves the open question from
[`2026-08-20-cleanup-survey-decisions.md`](2026-08-20-cleanup-survey-decisions.md)
item 5.

Hermes is first-class. Document it in `CLAUDE.md`'s architecture section as
part of cleanup punch list item 5; do not deprecate, do not move `__init__.py`,
do not drop the `.venv` + pandas step from `npm test`.
