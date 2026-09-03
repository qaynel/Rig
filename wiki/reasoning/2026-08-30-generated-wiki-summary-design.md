---
date: 2026-08-30
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes: wiki/status.md
tags: interdependency
summary: The current-state page and reasoning-trace index are generated from immutable trace frontmatter; update a trace and run the generator instead of hand-editing either summary.
---

# Generated wiki summary design

External research found useful adjacent patterns but no adoptable tool. ADR
practice supplies immutable records with explicit supersession, while Dataview
needs an Obsidian runtime and MkDocs generates a site rather than checked-in
Markdown. Adding either would violate the source-repository-only, markdown-only
constraint.

The selected seam is a small Node script already supported by this repository.
It parses only the trace frontmatter needed for the index, deterministically
writes the compact current-state page and a complete trace index, and a matching
check fails when either generated file differs. Existing narrative indexes stay
as historical synthesis; the generated trace index is the always-current entry
point for new work. A trace marked `superseded` remains indexed but is excluded
from current state; its `supersedes` field tells readers what it replaced.
