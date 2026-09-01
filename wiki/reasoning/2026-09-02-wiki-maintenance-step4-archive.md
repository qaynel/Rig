---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags:
summary: Wiki maintenance Step 4 — created wiki/archive/, moved the deprecated tier taxonomy and the pre-generator status snapshot into it, and noted the sixth location in Home.md outside primary navigation and outside the read-before-grep mandate.
---

# Wiki maintenance Step 4 — archive dead weight

## Scope

The routine's Step 4 relocates two dead-weight paths into a new
`wiki/archive/` directory that sits outside the five-page-kind model, outside
primary navigation, and outside the `CLAUDE.md` read-before-grep mandate.

## What moved

- `wiki/sources/superseded/deprecated-tier-taxonomy/` → `wiki/archive/deprecated-tier-taxonomy/`.
  The tier taxonomy has been superseded end-to-end; keeping it under
  `wiki/sources/` still surfaced it in the sources index. Move preserves the
  files with `git mv`; nothing was rewritten.
- `wiki/reasoning/2026-08-30-status-before-generated-summary.md` →
  `wiki/archive/2026-08-30-status-before-generated-summary.md`. The
  generator has fully replaced it; leaving it under `wiki/reasoning/` made it
  show up in the reasoning index for no purpose.

Both moves are pure relocations. Ground Rule 1 forbids editing trace bodies;
neither file's content was touched.

## Home.md

Added one paragraph naming `wiki/archive/` as a sixth location outside the
five-page-kind model and stating it is not part of the read-before-grep
mandate. It is not linked from any topic-hub row in the primary navigation.

## Non-frozen link updates

Rewrote the three surviving non-frozen references to the moved paths:
`wiki/index/sources.md`, `wiki/glossary.md`, `wiki/index/path-map.md`.

## Frozen references — intentionally not touched

`wiki/gate1/business-spec.md` and `wiki/gate2/technical-spec.md` each carry
one line referencing the old location. Ground Rule 3 places both `gate1/`
and `gate2/` off-limits, even for a mechanical link rewrite. Left them
alone; a future signer-owned pass may correct them if the paths matter to
that ceremony.

## Follow-up

- Rerun `node scripts/build-wiki-index.js`.
- Step 5 (primer page) can start now that 1–4 are landing together on this
  branch; it still needs explicit human review.
- Steps 6 and 7 remain outstanding.
