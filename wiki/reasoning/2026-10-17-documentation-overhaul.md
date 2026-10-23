---
date: 2026-10-17
source: agent
topics: what-rig-is, the-overhaul
decisions:
status: historical
supersedes:
tags: documentation
summary: Documentation overhaul adds audience navigation, translated introductions, product and architecture pages, and a documentation-readiness policy; later review corrects factual claims.
---

# Documentation overhaul — 2026-10-17

## What was done

Replaced the thin, engineer-only doc set with an audience-targeted suite:

- `docs/vision.md` — overhauled from a technical release note to a PM-facing product description (~280 words, plain English, no jargon)
- `docs/architecture.md` — new file with three Mermaid diagram views: system context (5 nodes), installation flow (8 steps), internal structure (3 subgraphs + third-party skills)
- `docs/install.md` — overhauled with the "explain it to a 5-year-old" philosophy: step-by-step with context + command + outcome per step, 15-second scannable headings
- `README.md` — replaced "Learn more" with four audience cards under "Where to go next"
- `README.es.md`, `README.ko.md` — replaced stale bodies (described pre-6.0.0 with tier/package language) with faithful translations of the updated README
- `rig/corpus/standards/change-management.md` — added step 5a (Documentation is current) between steps 5 and 6; human check, not yet automated

## Duplicate resolution

`docs/vision.md` was overhauled in-place rather than creating a separate `docs/product.md` — the file already existed and served the same purpose. `docs/agent-portability.md` was left untouched (no tier language found, and it serves a different audience than the new architecture.md visual diagrams).

## Decisions

- `docs/platform-native.md` is unrelated to Rig (it's a general "use the platform" reference) — left untouched
- Translations mirror the English README only; deeper docs stay English-only this release
- The `--purge-generated` uninstall flag was restored after a subagent missed it (it exists in `rig/lib/lifecycle.js`)
- The docs-gate script amendment (`check-deployment-gate.js`) is deferred — policy text ships first; a future ticket adds the automated check

## What is now true

The docs structure for 6.0.0 is:
```
README.md         — front door, audience cards
docs/vision.md    — PM/evaluator product description
docs/architecture.md — engineer Mermaid diagrams (3 levels)
docs/install.md   — step-by-step installer guide
docs/agent-portability.md — per-host reference (unchanged)
docs/advanced/operator.md — operator guide (unchanged)
```
