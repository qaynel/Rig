---
date: 2026-08-31
source: agent
topics: onboarding-flow, what-rig-is, testing-strategy
decisions:
status: superseded
supersedes:
tags: interdependency
summary: Path B grilling checkpoint — the locked product direction and technical design support ten acceptance cases, one for each F-1..F-6 and S-1..S-4 contract; red oracle construction is in flight and implementation has not begun.
---

# Path B oracle checkpoint

## Just completed

- Read the router, active Rig rules, grilling owner, implementation rule, wiki
  entrypoints, both Path B owner traces, the complete Path B technical design,
  and the current signed business/acceptance oracle.
- Traced the existing oracle verifier, signed test manifest, traceability table,
  installer, payload journal, lifecycle, inspection, CLI, and MCP seams.
- Confirmed there is no unresolved product decision. The existing record fixes
  the user, outcome, authority split, data boundaries, consent boundary,
  lifecycle, and externally observable failure policy.
- Confirmed the smallest complete acceptance partition is ten cases: F-1
  through F-6 and S-1 through S-4. Combining any pair would make evidence
  omission harder to detect; splitting below those contracts would restate the
  technical design rather than clarify product behavior.

## In flight

- Amend the business and acceptance oracle with the agent-led adaptive
  onboarding outcome and ten observable cases.
- Add independent behavior tests at the real source/install/domain/CLI/MCP
  seams. The tests will not assert that specification prose exists and will not
  supply product logic from fixtures.
- Extend the existing exact-ID traceability mechanism and signed testing
  manifest to cover the new cases.

## Next

- Run the focused Path B suites and record their expected red verdicts.
- File the completed oracle/evidence trace, update all three topic hubs and the
  acceptance index, rebuild generated wiki indexes, and stop for the human
  signature. No Path B implementation and no Gate-1 approval command will run.
