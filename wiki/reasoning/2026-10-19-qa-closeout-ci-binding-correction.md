---
date: 2026-10-19
source: agent
topics: testing-strategy, host-and-ci-coverage
decisions:
status: current
supersedes:
tags: qa-closeout, verification
summary: An approved maximal lint CI job now receives an executable binding while the local Evidence verdict remains independent of CI approval.
---

Reviewing the installed lint path exposed a gap outside the old frozen fixtures: its maximal binding always contained a CI coverage gap. The local grade runner ignored that field, but a real CI invocation would run the generic binding and fail even after an approved CI artifact was installed. The apply path now replaces that one check with the signed artifact path and explicit formatter argv only when the CI artifact was included in the approved plan. Otherwise it retains the named gap. The shared CI adapter still owns rendering and writing; local Context and Evidence continue to run without CI. An installed-path regression invokes the projected check with `CI=true` and passes on the approved fixture. The focused lint test run is in progress after this correction.

The host contract's gap text now says “Available but not integrated” directly and a host test checks the wording. The current broad diagnostic started before these final edits, so focused reruns validate them; the full release gate must be rerun on the owner's signed final bytes.
