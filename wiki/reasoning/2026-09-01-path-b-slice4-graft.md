---
date: 2026-09-01
source: agent
topics: graft-mechanics, install-manifest-removal
decisions:
status: current
supersedes:
tags: interdependency
summary: Path B graft sections now provide byte-preserving, journaled ownership in repository instruction files and uninstall removes only those managed sections.
---

# Path B slice 4 — safe managed graft sections

The shared payload layer now owns a named, versioned section inside an existing
Markdown instruction file without replacing surrounding user content. It
rejects malformed marker structures, marker/version disagreement, stale
preimages, unsafe paths, direct symlinks, hard links, and unsupported targets
before mutation. It preserves the original line-ending convention and all
unmanaged bytes; when an unterminated file needs a separator, that separator is
recorded separately from the managed section itself.

Every successful graft is journaled as a `graft_managed` write with the current
set of managed capability sections. Reapplying identical canonical content is a
no-op. Shared lifecycle removal reads that record, removes only the recorded
section when its content digest still matches, preserves user changes outside a
section or within an edited section, and reports the latter as best effort.

The frozen graft acceptance suite is green for creation, update, no-op,
removal, CRLF and no-final-newline preservation, malformed/stale failure,
symlink/hard-link refusal, journal contents, and uninstall behavior. The next
slice will call this bounded primitive from the approved onboarding apply flow.
