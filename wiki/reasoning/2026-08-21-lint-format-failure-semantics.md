---
date: 2026-08-21
source: intent owner
topics: services-and-reports, trust-and-failure-boundaries
decisions: GA-33
status: historical
---

Each abnormal end is its own reported, non-passing state (recommended). Timeout, cancelled, missing-dependency, signalled, partial-output, and command-not-found each resolve to a specific truthful result — never collapsed into “pass,” never silently swallowed. This is the frozen “one honest outcome” rule applied to the messy endings: a check that couldn’t reach a verdict says exactly why.
