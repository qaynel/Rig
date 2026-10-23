---
date: 2026-10-17
source: review
topics: distribution-and-release
status: historical
supersedes: 2026-10-17-review-received-resolution-public-upgrade.md
summary: Installer docs now state that migration-only MCP setup requires an emitted host and is ignored on fresh installs.
---

The scope reviewer confirmed the public-installer behavior and found one remaining precision gap: `SETUP_MCP=1` only installs dependencies after a v5 migration if the selected host emits MCP configuration. The policy and implementation already gated setup on that condition. I updated `docs/install.md`, Gate 2 AD-38 and §7.6, and the distribution-and-release hub to state that non-emitting hosts and fresh installs skip migration-only setup. The docs regression now asserts the emitted-host condition; `node --test tests/deployment-policy-docs.test.js` passes 2/2. This is a wording clarification to match the implemented guard, not a change to the migration behavior.

Next: run the remaining local focused checks, regenerate wiki indexes, verify the signed oracle and coherence/version gates, then commit the complete candidate and run `npm test` on those exact bytes. The external QA runs, receipt custody, push, independent approval, and PR closure remain owner-controlled.
