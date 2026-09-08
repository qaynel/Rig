---
date: 2026-09-08
source: agent
topics: onboarding-flow, what-rig-is, the-catalogue, delivery-plan
decisions:
status: current
supersedes:
tags: feasibility, test, evidence
summary: "Feasibility test: can an agent dynamically render host-native harness files from the canonical corpus? Tested with Sonnet on Cursor (known host) and Zed (unknown host). Result: YES — body content is invariant, only the envelope changes."
---

# Dynamic Projection Feasibility Test — 2026-09-08

## Test setup

- **Model:** Claude Sonnet (delegated subagent)
- **Input:** The full canonical corpus (1,553 lines):
  - `rig/tier-1/routing.md` (routing table)
  - `rig/tier-1/rules/*.md` (2 rule files)
  - `rig/tier-1/skills/*/SKILL.md` (7 canonical skills)
  - `rig/tier-1/adapters/*` (5 host adapter examples)
  - `.claude/skills/*/SKILL.md` (existing Claude Code projection, for reference)
- **No explicit projection instructions were given.** The agent was told the
  corpus structure and asked to produce host-native files. It figured out the
  format mapping itself.

## Test 1 — Cursor (known host, different format)

**Task:** Render the TDD and code-review skills as `.cursor/rules/*.mdc` files.

**Result:** ✅ Success.

- Correct YAML frontmatter: `description`, `globs`, `alwaysApply`
- `alwaysApply: false` for skills (correct — they're on-demand via routing)
- Body content: **character-for-character identical** to canonical SKILL.md
- Rig-internal metadata (`name`, `status`, `family`, `tool`, `capability`,
  `guarantees`, `overlap_tags`) correctly stripped (Cursor has no equivalent)

Evidence: `wiki/reasoning/evidence/dynamic-projection-test/cursor/`

## Test 2 — Zed (unknown host, never seen by Rig)

**Task:** Render the TDD skill and routing table for Zed editor.

**Result:** ✅ Success.

The agent correctly identified:
- Config lives in `.zed/settings.json` under `assistant.prompt_instructions`
- Prompts live in `.zed/prompts/*.md` as plain markdown (no frontmatter)
- Always-on routing goes in `settings.json`; skills are per-prompt files
- Body content: **character-for-character identical** to canonical

File tree produced:
```
.zed/
├── settings.json           # Always-on routing instruction
└── prompts/
    ├── rig-routing.md
    ├── rig-tdd.md
    ├── rig-code-review.md
    └── ... (one per skill)
```

Evidence: `wiki/reasoning/evidence/dynamic-projection-test/zed/`

## Key finding

**The body content is invariant across all hosts.** Every host consumes
markdown bodies. The only transformation is the envelope:

| Host | Path pattern | Frontmatter | Activation |
|------|-------------|-------------|------------|
| Claude Code | `.claude/skills/*/SKILL.md` | Full YAML (name, description, etc.) | Auto-loaded by name |
| Cursor | `.cursor/rules/*.mdc` | `description`, `globs`, `alwaysApply` | `alwaysApply` flag |
| Zed | `.zed/prompts/*.md` | None | `settings.json` for routing |
| Windsurf | `.windsurf/rules/*.md` | `trigger` | `trigger: always_on` |
| Kiro | `.kiro/rules/*.md` | `title`, `inclusion` | `inclusion: always` |

The envelope is a **~10-line host descriptor**: path pattern, frontmatter
template, activation mechanism. A projector that reads this descriptor and
renders the files is a pure function, fully testable.

## What this means for the architecture

1. **The corpus IS the product.** Skills, routing, rules — all in
   `rig/corpus/`. One copy. One authority.
2. **Known hosts get a mechanical projector.** `project(corpus, hostDescriptor) → files`.
   Deterministic, testable in CI, no agent needed.
3. **Unknown hosts get the agent.** It reads the corpus + host conventions
   and produces the projection. The existing propose/approve/apply/check
   flow validates the result.
4. **The host descriptor is the extension point.** Supporting a new host =
   adding a ~10-line descriptor, not triplicating every skill file.

## Verdict

**The hypothesis works.** An agent with no Rig-specific projection code,
given only the canonical corpus and knowledge of a host's conventions, can
produce correct host-native harness files. The body is invariant; the
envelope is small and mechanical.

This validates the dynamic offboarding architecture described in
`2026-09-08-dynamic-offboarding-architecture-brainstorm.md`.
