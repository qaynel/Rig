---
date: 2026-10-17
source: agent
topics: agent-working-conventions
decisions:
status: current
supersedes:
tags: interdependency
summary: The 120 2026-08 reasoning traces are compacted into ten themed archive pages under wiki/archive/2026-08/; wiki/reasoning/ drops 2.2M to 1.3M and every inbound reference now cites the archive page.
---

# August 2026 reasoning compacted into ten archive themes

Owner instruction: compact the very old reasoning traces into archive themes to
reduce the live wiki's size, taking out all the relevant information first.
Scope was exactly the 120 files matching `wiki/reasoning/2026-08-*.md`; every
2026-09 and 2026-10 trace stays where it is.

## What was done

Each of the 120 traces was read in full and assigned to exactly one of ten
themes, derived from subject rather than date:

| Theme | Traces |
|---|---|
| `lint-format-vertical-slice` | 26 |
| `shell-trust-and-capability-policy` | 14 |
| `review-receipts-and-test-infrastructure` | 14 |
| `path-a-and-path-b-onboarding` | 13 |
| `release-install-and-distribution` | 11 |
| `gate-model-and-the-one-lock` | 10 |
| `what-rig-is-product-direction-and-dsh` | 9 |
| `uninstall-ownership-and-ci-journal-trust` | 8 |
| `wiki-and-agent-working-conventions` | 8 |
| `host-coverage-and-mcp-wiring` | 7 |

Each theme page carries a synthesis of what the theme settled, then one section
per source trace reproducing its frontmatter summary (written where the source
had none), its decision IDs, its status, what it recorded, and every verbatim
owner ruling, rejected approach and recorded trap it carried. Bodies live in git
history. The originals were deleted and every inbound reference — wikilink,
markdown link and bare path — repointed at the owning theme page.

`wiki/reasoning/` went from 2.2M / 316 files to 1.3M / 196 files; the ten
archive pages are 252K.

## What this changed about what is true

Three of the 120 carried `status: current` — the Path B product direction, the
Path B follow-up decisions, and the RIG product vision. Their content is
preserved verbatim in `archive/2026-08/path-a-and-path-b-onboarding.md` and
`archive/2026-08/what-rig-is-product-direction-and-dsh.md`, but those archive
pages are `status: historical`, so the generated current-state page no longer
renders them as current. `CLAUDE.md`'s North star item 2 still cites
`wiki/reasoning/2026-08-31-path-b-product-direction.md` by path; that citation
is now dangling and needs the owner's hand.

## Deliberately not changed

- `wiki/status.md` and `wiki/index/reasoning.md` — generated; regenerated
  separately by `scripts/build-wiki-index.js`.
- `wiki/gate1/**` — the human-signed frozen oracle.
- Bare backticked trace filenames inside dated 2026-09 traces that were
  *talking about* those files (the wiki-maintenance sweep records). They are
  prose about a past state, not links, and rewriting them would misstate what
  the trace said.
- The nine `[[2026-08-25-*]]` citations across RIG-125..134 and
  `wiki/index/path-map.md` that were already dangling before this change —
  those traces were never committed, as the RIG-125/130/132/133 audit in
  [[archive/2026-08/review-receipts-and-test-infrastructure]] established.
