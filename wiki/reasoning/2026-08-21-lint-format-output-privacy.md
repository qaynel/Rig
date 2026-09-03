---
date: 2026-08-21
source: intent owner
topics: services-and-reports, drift-and-secret-controls
decisions: GA-32
status: historical
---

Failure-centric, local, redacted (recommended). Reports stay on the machine that produced them and record what matters — failures, vacuous runs, coverage gaps — while omitting routine passes. CI emits only the verdict, the counts, and which rules fired — never source snippets or uploaded artifacts. Secret-matched content does not reach the agent’s context unless you explicitly opt into model-assisted triage. This is exactly how Rig already treats findings and secrets everywhere else.



Do this plus take out the secrets and personally identified information or whatever things that should not be leaked out rooted to like the host on which the rig is running on and then explain clearly to the user in terms of actionable items. What is going wrong?
