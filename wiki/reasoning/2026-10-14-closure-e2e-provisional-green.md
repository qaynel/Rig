---
date: 2026-10-14
source: agent
topics: distribution-and-release, the-overhaul
decisions:
status: current
summary: A disposable candidate archive passed both real clean-install scenarios on macOS, with exact-SHA evidence deferred until final commit.
---
`node scripts/clean-install-e2e.js --sha 0e9f973e6ee83cd9633d3a587d4fcf7aeed48e8b --artifact /tmp/rig-closure-candidate.SqE0C0/candidate.tar.gz --out .context/e2e-evidence.json` passed on macOS (Darwin arm64, Node v24.18.0, npm registry `https://registry.npmjs.org/`). Both fresh and existing-repository scenarios completed real `npm ci`, the MCP `rig_instructions` call, SSHSIG-approved onboarding, the selected service check (`onboarding-docs-source-code-boundary`, executed count 1), and full inventory/byte restoration. Evidence is labelled provisional because the candidate SHA is a disposable snapshot commit. In flight: deliberate-breakage evidence. Next: rerun against the final branch commit after the owner freezes the candidate.
