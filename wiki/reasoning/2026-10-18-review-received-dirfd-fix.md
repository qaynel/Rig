---
date: 2026-10-18
source: agent
topics: distribution-and-release, review-receipts, testing-strategy
decisions:
status: superseded
supersedes: 2026-10-18-review-received-publication-followup.md
tags: review, migration, path-safety
summary: Python standard-library directory-relative linking closes the migration publication parent-swap race; superseded by the follow-up covering root-pinned cleanup and retry-marker no-follow operations.
---

The smallest safe publication path on this macOS workspace is Python 3's
standard-library `os.link` with `src_dir_fd` and `dst_dir_fd`. Node opens and
validates descriptors for the repository root and `.rig`, then passes them to
a short `python3 -c` helper. The link now lands in the opened directory even if
the `.rig` pathname is replaced immediately before the syscall. No third-party
package or native build step is added. Fresh installs do not invoke Python;
v5 migration fails closed with a recoverable refusal if Python 3 or directory-
relative link support is unavailable. The install guide and current Gate 2
technical design name this migration-only runtime requirement.

Editable race regressions cover a parent substitution before publication, a
swap after the actual hard link but before path validation, a pre-existing
external mode-0640 sentinel, a temp-unlink interruption and the former
check-then-unlink timing. The full migration suite passes 38/38, including
resume, MCP-emitting interruption retry, non-emitting host reconciliation,
and missing-Python refusal. The real-download MCP retry installs dependencies,
launches the installed descriptor, completes its handshake and calls
`rig_instructions`. Documentation/catalogue checks pass 12/12, the signed
oracle passes 16 files/95 cases, generated wiki checks and coherence pass, and
the version gate passes.

`npm test` was attempted but deliberately stopped after roughly four and a half
minutes with three process-isolated files still pending
(`catalogue-all-services`, `path-b-hardening`, and `path-b-weight`). At
interruption, 910 tests had passed, three were cancelled by the stop, and two
were skipped; this is not a green full-gate result. Exact-commit Linux/macOS
clean-install evidence, a fresh candidate review receipt and release delivery
remain owner-controlled. No candidate commit, push, approval or merge was made.
