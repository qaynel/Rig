---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: Runtime payload files are present under --with-runtime, but the bootstrap proof still flags an optional manual signer path after two attempts.
---
Done: T-3.9 is green. T-3.10 remains open after two failed `node --test tests/rig-bootstrap.test.js` runs. First error: `.rig/runtime/rig/lib/ai-sdlc.js should exist after install` in the default-install link scan; after scoping that scan to optional runtime behavior and adding the runtime manifest entry, the `--with-runtime` case passed but the default scan failed with `.rig/allowed-signers should exist after install`. The latter is a user-created signing setup path, not an install payload. In flight: T-3.11. Next: file the AT-PB-3 fetched-shelf amendment.
