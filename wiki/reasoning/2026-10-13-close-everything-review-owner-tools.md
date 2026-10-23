---
date: 2026-10-13
source: intent owner
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, decision, service-coverage
summary: Owner chose available external tools only, with explicit coverage gaps and setup guidance for missing tools.
---

# Close-everything review — external tool policy

## Owner message, verbatim

Some service checks need scanners or cloud tools. Use tools already available and report missing ones with setup guidance, or let onboarding offer to install missing tools with separate approval, adding network use and changes to the repository? I recommend reporting the gaps for this release.
Report gaps; use available tools (recommended)

## Consequence for the proposed plan amendment

Service checks use available repository tooling. Missing scanners/cloud tools
produce named coverage gaps and setup guidance, not a passing result or an
automatic tool install. Fetching third-party skill resources during onboarding
remains the separate settled delivery decision.

The original review record accurately captures the earlier three-answer stage.
This addendum resolves its external-tool question; merging duplicate services
and the QA-to-production promotion bar remain open.
