---
date: 2026-09-01
source: agent
topics: onboarding-flow
decisions:
status: current
supersedes:
tags: interdependency
summary: Path B now has a bounded structural inventory and pure exact-match overlap surface; state-owned reports are the next integration step.
---

# Path B slice 2 — structural inventory and overlap surface

The structural inventory is implemented in the existing bounded inspection
seam. It visits only known harness roots, records the path, host, kind,
declared metadata, byte count, and digest, and never emits body prose. It
redacts extracted strings, bounds reads to 256 KiB, classifies malformed or
non-UTF-8 sources as warnings, rejects escaping symlinks, and refuses two
repository paths that resolve to the same file.

The overlap primitive is pure and exact. An existing entry contributes only its
declared capability tags and the capability/tags supplied by a catalogued,
explicit alias. A Rig skill contributes only its capability, declared overlap
tags, and aliases. There is no filename, vendor-prefix, heading, or prose
inference; the result is context for the host agent rather than a selection or
mutation.

The five direct structural inventory checks are green. The three remaining
inventory-file checks deliberately remain red because they exercise the next
state-machine slice: deterministic report rendering and `prepare` integration.
