---
date: 2026-09-01
source: agent
topics: catalogue-contract, onboarding-flow, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: trap
summary: Catalogue generation still silently renames a later source when two skills declare the same name; the frozen tie-break test asserts that identity-changing fallback, so the planned correction requires strict rejection and a human oracle unfreeze.
---

# Path B hardening, Issue 5 — duplicate declared names must fail closed

## Finding

The optional skill loader currently handles a collision by silently replacing
the later skill's declared name with its directory name. That makes the
catalogue identity differ from the skill's own declaration and can cause an
approval or selection to refer to a different source than the author named.

Independent review reproduced the silent-rename to identity-change behavior.
The lower-agent handoff and task brief preserve the evidence record under
`.context/attachments/`; the existing frozen catalogue test is the
`connect-chrome` / `browser` tie-break case that asserts the fallback.

## Planned correction

Catalogue generation will reject a collision with an error naming the duplicate
declared name and both source locations. The loader will retain deterministic
ordering and existing metadata validation, but it will not invent a canonical
identity. Any real source collision found in the shelf will be resolved by an
explicit source declaration and migration evidence, not by a directory-name
fallback.

The positive rejection case belongs in the non-frozen hardening suite. The
existing frozen tie-break assertion must change only through a filled unfreeze
request and the human key holder's re-signing ceremony. Human authorization is
intentionally not supplied by this trace.
