---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags:
summary: Wiki maintenance Step 3 — backfilled status:historical (and topics: where absent) on the 77 pre-contract traces that a live hub or ticket cites; the remaining 26 orphan pre-contract traces are left as-is per the new paragraph in reasoning/README.md.
---

# Wiki maintenance Step 3 — disposition for untagged traces

## Backfill (77 traces)

The status probe listed 77 pre-contract traces without `status:` (many also
without `topics:`) that a live hub or ticket cites. All received
`status: historical` — appropriate because every one of them dates before
2026-08-30 and describes design, investigation, or decision reasoning whose
outcome has since either shipped, been superseded, or been folded into a
hub. Six traces had no frontmatter block at all
(`2026-08-25-token-burn-investigation.md`,
`2026-08-28-runReadOnly-memory-ceiling-unavailable-clean.md`, three
2026-08-29 RIG-120/144 traces, and `2026-08-24-rig-104-mcp-unification.md`);
they received a minimal contract-shaped frontmatter block with `topics:`
taken from the citing hub the status probe named.

Bodies were not touched — Ground Rule 1 forbids editing trace bodies.

## Orphans (26 traces)

Twenty-six pre-contract traces are untagged and referenced by no live hub or
ticket. Per the routine's Step 3 policy, they are intentionally left alone —
no synthesised status/topics is inserted retroactively. They remain
discoverable by date/filename through `wiki/index/reasoning.md`, and the
generator's historical fallback keeps them off the current-state page.
`wiki/reasoning/README.md` now carries a "Pre-contract traces" section that
records this disposition.

## Follow-up

- Rerun `node scripts/build-wiki-index.js`.
- Steps 4–7 remain outstanding.
