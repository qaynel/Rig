---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: historical
summary: Installed lint setup now runs through the public CLI with separate approval and uninstall recovery.
---
Done: T-5.5; initial `node --test tests/lint-format-setup.test.js` baseline — 8 pass, 0 fail but no installed-path coverage. Added the CLI case; its first run exposed an overbroad assertion that all of `.rig` should disappear despite the retained user-owned signer file. After narrowing the assertion, `node --test tests/lint-format-setup.test.js` — 9 pass, 0 fail. In flight: T-5.6. Next: confirm whether any frozen lint case needs an amendment.
