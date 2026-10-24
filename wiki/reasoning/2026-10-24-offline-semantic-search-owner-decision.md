---
date: 2026-10-24
source: intent owner
topics: what-rig-is, onboarding-flow, the-two-gates, agent-working-conventions
decisions: NS-20
status: current
supersedes: 2026-10-24-final-product-coverage-refinement.md
tags: product-definition, memory, offline
summary: Owner requires meaning-based memory search to work offline by default in the public release.
---

For the public release, should meaning-based memory search work offline by default? I recommend making it optional, while always providing cited local text search. This keeps installation lean and avoids requiring a model download or paid provider; users without one would see a clear capability gap.
Required offline by default