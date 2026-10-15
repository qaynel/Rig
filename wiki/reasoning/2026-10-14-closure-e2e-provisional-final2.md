---
date: 2026-10-14
source: agent
topics: distribution-and-release
decisions:
status: superseded
supersedes: 2026-10-14-closure-e2e-provisional-final
supersedes: 2026-10-14-closure-e2e-provisional-final
summary: The complete local clean-install E2E passes against the latest temporary candidate archive and is recorded as provisional.
---
Done: T-6.4 reran `node scripts/clean-install-e2e.js --sha c4ed1ecc2c709efae08128b2c934859e8b69d4a3 --artifact /tmp/rig-closure-candidate.SqE0C0/candidate-final.tar.gz --out .context/e2e-evidence.json`; result `status: pass`, `provisional: true`, Darwin arm64 Node v24.18.0, archive digest `f4593180e3c12cbb5d76c57e46e2ae458a880ea22975a70c81bd81351ef65c92`. Both fresh and existing scenarios completed real npm install, MCP `rig_instructions`, signed onboarding, one named service check, and restoration. In flight: exact committed-SHA CI. Next: post-freeze full suite and pushed Linux/macOS evidence.
