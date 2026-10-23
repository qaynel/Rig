---
date: 2026-10-13
source: agent
topics: distribution-and-release, install-manifest-removal
decisions:
status: current
tags: interdependency
summary: Actual network installation reaches installed MCP and signed service onboarding; npm staging compatibility is fixed and exact check-ID/inventory completion remains in flight.
---

Real registry downloads exposed two problems not caught by the old fake npm
fixture. npm 11 misinterprets an absolute --prefix for a randomly named staging
directory as an additional package; running with cwd set to that directory and
relative --prefix . succeeds. Registry dependencies also create CLI symlinks;
--no-bin-links prevents unused executable links from entering the target and
keeps dependency writes compatible with the existing safe journal. This is a
native npm option, not a weakening of path validation.

The generic MCP dependency helper is shared with OpenClaw registration; the
old duplicated staging/download/copy code was removed. The existing unsigned
release archive fixture excludes node_modules and provides fake npm for its
unit-only tag-resolution test. The real network path remains isolated in E2E.
The tagged installer regression, failed OpenClaw install regression, and
OpenClaw retry regression are green. Focused evidence/report tests are 6/6
green; the existing interrupted onboarding state-write test is green.

Actual fresh installation now reaches a real rig_instructions MCP response,
a fixture-only SSHSIG proposal approval, and a nonzero installed documentation
service check. Completion still needs actual check-ID reporting from the
catalogue owner and the full uninstall inventory comparison. The first service
run correctly refused when the canonical runtime catalogue was not yet in the
concurrent snapshot; the root owner added it and the next run reaches checks.

The reusable E2E workflow also supplies public tagged-download smoke after
publication. Release eligibility calls reusable exact-QA health and checks
QA has not moved before emitting an evidence artifact. It grants no write
permissions, and does not claim the owner's signature or final protected gate
has been completed. Local snapshots remain explicitly provisional.
