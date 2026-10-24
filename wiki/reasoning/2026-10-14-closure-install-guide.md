---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: historical
summary: The install guide covers fresh installs, existing repositories, v5 upgrades, and removal using commands present in installer and materializer help.
---
Done: T-9.3 added `docs/install.md` with fresh, existing-config, v5 upgrade, and uninstall flows. Prove: `node rig/materialize.js --help` lists `uninstall` and `--target`/`--purge`; `./install rig --help` lists `--target`/`--version`; every guide command and flag is present in those help outputs. In flight: T-9.2 still awaits a green coherence check. Next: T-9.4 troubleshooting coverage.
