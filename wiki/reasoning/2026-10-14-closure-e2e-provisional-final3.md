---
date: 2026-10-14
source: agent
topics: distribution-and-release
decisions:
status: current
supersedes: 2026-10-14-closure-e2e-provisional-final2
summary: The latest full clean-install E2E candidate archive passes both customer scenarios and is recorded as provisional.
---
Done: T-6.4 ran `node scripts/clean-install-e2e.js --sha 59bc324499ed404e938d0978d48d2f96cedbdac2 --artifact /tmp/rig-closure-candidate.SqE0C0/candidate-final.tar.gz --out .context/e2e-evidence.json`; result `status: pass`, `provisional: true`, Darwin arm64 Node v24.18.0, archive digest `55301d084b193e828cbb0640d7e753cb21ce0a8f487a28d50260f6242348d383`. Fresh and existing scenarios completed real npm install, MCP `rig_instructions`, signed onboarding, one named service check, and restoration. In flight: exact committed-SHA CI. Next: post-freeze full suite and pushed Linux/macOS evidence.
