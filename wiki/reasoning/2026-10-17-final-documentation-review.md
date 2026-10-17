---
date: 2026-10-17
source: review
topics: the-overhaul
decisions:
status: historical
summary: Final documentation review withholds merge approval because uninstall and onboarding guidance conflict with runtime behavior, the new trace fails its budget check, and current-byte release evidence is absent.
---

## Owner request — verbatim

Just go have a final documentation check and give me the go-ahead and a receipt to merge this branch into QA prod

## Review checkpoint

The review is report-only. Preserve the separate documentation agent's edits.
The reviewed local HEAD is ba371b641e3dc6b245d94acaa1a29a882011a8ec;
the PR's green checks bind to 8d801d12ab2a2392324285691812c89b43df2f1c,
not this dirty candidate. The deployed release-review wrapper is not invoked:
one remaining attempt must be reserved for corrected, frozen final bytes.

Confirmed documentation defects: install guidance says --purge-generated keeps
generated reports, whereas it removes owned evidence and restores preimages;
onboarding adds a separate picker despite the approved adaptive proposal flow;
the product overview promises installed signed-oracle/deployment enforcement
that the payload does not install; architecture labels deployment as Gate 2,
although the technical design is not frozen, and puts root host entrypoints
under .rig/. The new documentation policy requires named documentation files
in the changelog, but that entry is absent.

The new documentation-overhaul trace lacks required summary frontmatter and
fails check-wiki-budget.js. Signature verification passes for 16 files and
95 cases. Version, rule-copy and candidate tracker-coherence checks pass.
All 25 checked local links in the README editions and the three reviewed
documentation pages resolve. The deployment checker stops at the dirty-tree
freeze check. No current-byte full gate, exact-SHA E2E or binding final review
is claimed; earlier successful runs remain advisory.

Next: correct these documentation findings, complete trace metadata/navigation
and changelog, freeze and commit the combined candidate, renew final full-gate
and review evidence, then require PR checks on the exact pushed head before
merging to qa-prod. This review does not authorize merge or publication.
