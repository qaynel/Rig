---
date: 2026-08-31
source: agent
topics: graft-mechanics, install-manifest-removal
decisions:
status: current
supersedes:
tags: oracle, rig-148
summary: Grilling oracle for RIG-148 — gitignore (tool-cache) design decision confirmed by owner; three red tests in tests/rig-bootstrap.test.js assert the write, idempotency, and uninstall-cleanup behavior. Gate is ready for signing.
---

# RIG-148 grilling oracle — .gitignore hygiene

*Owner confirmed: gitignore (tool-cache model). Filed after user decision.*

## Decision record

Owner chose **gitignore** over commit for the Rig payload.

Rationale (from the ticket + investigation): Rig describes itself as a
regenerable agent workflow — re-derivable at any time by rerunning
`bootstrap.sh` against the pinned release, not repo-authored content a human
wrote and should review byte-by-byte. Committing it would produce a
multi-hundred-file diff on every version bump in every downstream repo.

## Intent

A default (`--hosts claude`, no `--with-runtime`) Rig install writes a named,
managed `.gitignore` block covering `.rig/`, `.claude/skills/rig-*`, and
`.agents/skills/rig-*`, so a user's first `git add` does not silently commit
the entire Rig payload.

## Acceptance (observable examples)

1. **Write**: After `runPayload(target, ['claude'])`, `.gitignore` exists and
   contains entries for `.rig/`, `.claude/skills/rig-*`, `.agents/skills/rig-*`.

2. **Idempotency**: Running `runPayload` twice produces a `.gitignore` with the
   `.rig/` pattern exactly once (no duplication).

3. **Uninstall cleanup**: After install + `uninstall(target)`, the `.rig/` entry
   is gone but any pre-existing user content (e.g. `node_modules/`) is preserved.

## Inferred criteria (declared outright — remove if wrong)

- The block is a named managed entry (same `append_managed` / `managed_line`
  mechanism as `ensure_line`) so uninstall can remove it cleanly via the
  existing journal-based removal path.
- The block covers `.rig/`, `.claude/skills/rig-*`, `.agents/skills/rig-*` —
  the three install targets a default single-host install writes.
- Uninstall removes only the Rig block, not the whole `.gitignore` file.

## Testing infrastructure

Three new tests appended to `tests/rig-bootstrap.test.js` (titles match the
traceability requirement):

```
RIG-148 — default Claude install writes a .gitignore block covering Rig-owned paths
RIG-148 — gitignore block is idempotent: re-running bootstrap does not duplicate it
RIG-148 — uninstall removes the gitignore block and preserves pre-existing user content
```

All three are **currently red** (confirmed: `node --test tests/rig-bootstrap.test.js`
shows 3 failures on HEAD before any implementation). They pass only when a
`ensure_gitignore_block` (or equivalent) op is added to the payload and
`payload.js` / `manifest.json` are wired up.

## Technical specification (checked for presence, not frozen)

From `wiki/tickets/RIG-148.md § Required fix shape`:
- Add a payload entry (new op, e.g. `ensure_gitignore_block`) that appends a
  named idempotent block to `.gitignore` covering `.rig/` and the host-specific
  `rig-*` skill directories.
- Mirror the existing `ensure_line` managed-block pattern already used for
  `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` pointers (`manifest.json:28,34-36`).
- Files touched: `rig/lib/payload.js`, `rig/manifest.json` (new op), and the
  uninstall path in `rig/lib/lifecycle.js` (if not already handled by the
  `managed_line` removal branch).

Technical spec is present — not frozen.

## Open items at freeze

None. Owner decision made. Tests are red. Technical spec present. Ready for signing.
