---
date: 2026-08-21
source: intent owner
topics: trust-and-failure-boundaries, onboarding-flow
decisions: GA-31
---

Treat it as stale/tampered and re-approve (recommended). The moment the underlying task no longer matches what was approved, Rig stops, does not run the changed command, shows you exactly what drifted, and requires you to review and approve a freshly rediscovered plan before it runs anything. Approval was for a specific command; a changed command is a new command.
