---
date: 2026-09-03
source: agent
topics: onboarding-flow, gate1-signing, trust-and-failure-boundaries, testing-strategy
decisions:
status: current
supersedes:
tags: interdependency, trap
summary: Onboarding hardening now has eight real adversarial behaviors and four manifested pattern ratchets prepared for owner approval
---

# Onboarding hardening prevention oracle — 2026-09-03

The intent owner asked: “create tests to prevent the themes from reoccuring and
prepare all artifacts before gate1 lock”. This extends the eight concrete
hardening findings with four acceptance cases, one for each recurring review
theme: wrong trust object/fail-open verification, stale aggregate snapshots,
parallel authorities, and happy-path tests mistaken for an oracle.

The restored adversarial file was not yet part of the signed testing manifest,
the central acceptance set, or the main technical-spec traceability table. Its
MCP case also reconstructed the buggy response locally, so no production MCP
edit could make that test green. The unfinished invariant file had two false
greens: a post-write inventory call satisfied a pre-write recheck assertion,
and a mixed-host aggregate fallback evaded an overly narrow regular expression.

The pre-signing oracle now corrects those gaps. The MCP behavior case drives the
root and installed adapters through the existing SDK client helper. The
inventory ratchet looks only before the journal writer is created. The host
ratchet requires a host-list parameter, a per-host loop, and absence of the
aggregate-empty fallback. Verification catches are accepted only when they
rethrow or record a hard failure. Finding IDs are extracted from real test
titles and compared with the technical design instead of counting comments.

Four new cases cover the patterns while the original eight continue to cover
the concrete failures. Both test files are listed in the testing manifest; the
active acceptance and traceability sets now contain 95 cases. The working design
also records the exact installed-host list as install-marker data instead of
inferring a fallback from a global scope union.

No production behavior was changed and the approval helper was not run. The
expected pre-signing signal is eight red behavioral cases plus the red pattern
checks for defect shapes that still exist; already-held catalogue and parity
ratchets remain green. The current signature is deliberately stale until the
intent owner reviews and signs the 95-case oracle.
