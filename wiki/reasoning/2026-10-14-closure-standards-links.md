---
date: 2026-10-14
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: historical
summary: CLAUDE and GEMINI now route lifecycle and delivery guidance to their canonical standards.
---
Done: T-7.6; `rg -n 'standards/ai-sdlc\.md|standards/delivery-sop\.md|specification sheet|statement of work|checkbox task list|red, smallest fix|owner says go|one task at a time' CLAUDE.md GEMINI.md` — both files link to both standards and no longer restate the delivery steps. `git diff --check -- CLAUDE.md GEMINI.md` — clean. In flight: none. Next: WP8 T-8.1.
