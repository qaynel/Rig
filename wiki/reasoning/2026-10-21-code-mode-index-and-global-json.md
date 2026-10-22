---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-approval-and-linux-boundary
tags: review, remediation, verification
summary: Added staged-index sanitation and byte-preserving JSON member edits; focused suites pass and the final full npm test is in progress.
---

Finding 11's staged-content bypass is fixed at the shared Git dispatcher. It
uses NUL-delimited changed paths, resolves the index blob IDs, and scans blob
bytes instead of the working tree. It fails closed on malformed or unmerged
entries, handles spaces/newlines, and uses the same content classifier as
adoption inspection. The focused staged/unstaged opposite-content regression
passes, as does frozen Gate 1 AT-B4.

Finding 18's JSON writes now patch only Rig-owned member value spans using the
stdlib JSON parser for validation and a small span reader for source offsets.
That preserves unrelated lexical bytes, including unsafe-integer notation,
exponent notation, escaped strings, whitespace, and key order. The global
MCP suite passes 8/8, including two repository-owned entries and exact source
restoration after both are removed. Generic namespace ownership transfer on
removal order and real host-level install/uninstall proof remain outstanding.

The Gate 1 oracle check, wiki index/budget checks, `git diff --check`, and the
focused inspect/global/staged tests pass. The final full `npm test` run is in
progress after these changes. All 18 acceptance rows remain open until the
remaining finding-specific proof and required review are completed.
