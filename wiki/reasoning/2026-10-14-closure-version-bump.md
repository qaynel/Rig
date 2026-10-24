---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release, the-catalogue
decisions:
status: historical
summary: Release manifests and package locks now agree on 6.0.0 while the legacy v5 skill shelf remains stable.
---
Done: T-9.1; updated all eight files named by `scripts/check-versions.js` and the root/MCP lockfile package versions. `node scripts/check-versions.js` — all 8 pinned at 6.0.0, identity URLs clean. The check exposed the legacy skill-catalogue generator deriving its v5 shelf tag from the root package; pinned that compatibility artefact to v5.0.0 in the generator, without editing `rig/catalog/**`; `node scripts/build-skill-catalog.js --check` passes. In flight: none. Next: T-9.2 README update.
