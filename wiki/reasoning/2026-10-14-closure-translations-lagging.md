---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: historical
summary: Spanish and Korean README editions clearly identify themselves as lagging and link readers to the current English README.
---
Done: T-9.6 marked `README.es.md` and `README.ko.md` as not updated for Rig 6.0.0, with localized links to `README.md`. Prove: `node scripts/check-versions.js` — all 8 version files pinned at 6.0.0; identity URLs clean across 7 manifests. `git diff --check -- README.es.md README.ko.md` passed with no output. In flight: T-9.7 clean-directory README install. Next: resolve any install result, then T-9.2 coherence if its external blockers clear.
