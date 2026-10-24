---
date: 2026-10-14
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: historical
summary: Task list with verified ticks, executor prompt and a Delivery SOP (spec, SOW, task list, acceptance, then work) filed; two prior executor sessions stopped at usage limits mid-catalogue.
---

Owner asked for the SOW turned into a ticked task list, a hand-off prompt for a
lower-order agent, and the spec to SOW to task list to acceptance order made
standard procedure. Two earlier executor sessions (Claude and Codex) both hit
usage limits partway through the catalogue and E2E work. Ticks were set by
running each focused test file on 2026-10-14, not from the transcripts: 33 done,
42 agent-open, 10 owner-only. Nine reds exist in the tree (v5 parity, corpus
uniqueness, migration, one-table MCP, runtime payload, frozen AT-PB-3, spawn
guard, wiki budget, coherence duplicates); each is assigned a task. Catalogue
guidance prose is still the templated boilerplate in 798 corpus files. Not yet
started: health workflow, CHANGELOG, 6.0.0 version, README/vision/install docs.
SOP lives in rig/corpus/standards/delivery-sop.md with pointers in CLAUDE.md and
GEMINI.md; routing.md and the pinned package scripts were left untouched.
Artifacts: wiki/specs/close-everything/task-list.md and agent-prompt.md.
