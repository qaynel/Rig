---
date: 2026-10-14
source: agent
topics: distribution-and-release
decisions:
status: superseded
summary: The complete local clean-install E2E passes against a temporary candidate archive and is recorded as provisional.
---
Done: T-6.4 ran `node scripts/clean-install-e2e.js --sha 68fe29aa2c7571d782f29d6b18ebf84fc80b6a40 --artifact /tmp/rig-closure-candidate.SqE0C0/candidate-final.tar.gz --out .context/e2e-evidence.json`; result `status: pass`, `provisional: true`, Darwin arm64 Node v24.18.0. Both fresh and existing scenarios completed real npm install, MCP `rig_instructions`, signed onboarding, one named service check, and restoration. In flight: exact committed-SHA CI. Next: post-freeze full suite and pushed Linux/macOS evidence.
