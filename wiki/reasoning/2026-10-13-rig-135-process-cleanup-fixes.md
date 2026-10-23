---
date: 2026-10-13
source: agent
topics: bug-fixes, third-party-skills
decisions:
status: historical
supersedes:
tags: interdependency
summary: RIG-135.1/.2/.3 browse descendant-cleanup fixes, test-first; what was proven locally vs only in CI.
---

# RIG-135.1/.2/.3 process-cleanup fixes (progress trace)

## 135.2 done (browser-skill-commands.ts)

- Red: `tests/browse-skill-spawn-descendants.test.js` ran a skill script that
  forks a descendant and outlives `--timeout`; the descendant survived Bun's
  leader-only `proc.kill()`.
- Green: spawn via `node:child_process` with `detached: true`; timeout kills the
  group through new `src/process-tree.ts` (negative-pid on POSIX, `taskkill /T /F`
  on Windows), mirroring `rig/lib/spawn-guarded.js`. `readCapped` rewritten for
  Node streams (cap/truncation behaviour re-checked by hand: 1 MiB cap, exit code).
- `tests/spawn-guard-allowlist.test.js` and `rig/spawn-guard-allowlist.json` are
  not in `wiki/gate1/testing-infrastructure.manifest`, so not frozen; the entry
  was removed directly and the ratchet is green (stale-entry rule forced it).
- Patch + provenance: `wiki/specs/close-everything/candidate-amendments/rig-135.md`.

## 135.3 done (xvfb.ts)

- Red (node:22 + bun in docker, Linux): `tests/browse-xvfb-descendants.test.js`
  uses a fake `Xvfb` that forks a descendant plus a fake `xdpyinfo`; Xvfb was not
  its own process-group leader (`detached` never passed) and close() left the
  descendant. Green: `detached: true` via node:child_process, group SIGTERM then
  group SIGKILL in `cleanupXvfb`. Test skips off Linux (ownership reads /proc).
- Allowlist entry for xvfb.ts reclassified (direct-kill gone; remaining
  Bun.spawnSync probes are non-forking) rather than deleted.

## 135.1 done (cookie-import-browser.ts)

- Seam: `importCookiesViaCdp` split so `launchChromeAndExtract` takes exe/args/
  AbortSignal/extractor; a forking fake Chrome (`fixtures/browse-descendants/
  fake-chrome.js`) stands in for Chromium.
- Red (macOS): all four scenarios failed -- descendant survived success, startup
  timeout, and importer SIGKILL; cancel hung (no cancel path existed).
- Green: `spawnTreeGuarded` in `src/process-tree.ts` (detached group kill on
  POSIX, `taskkill /T /F` on Windows, stdin-pipe watchdog for importer death);
  `signal` abort throws CookieImportError `cancelled`. 4/4 on macOS, 6/6 for all
  three browse tests in node:22+bun Linux docker.
- Windows: no Job Object (see candidate-amendments note). New workflow
  `.github/workflows/browse-process-cleanup.yml` runs the tests on windows-latest
  and ubuntu-latest with RIG_REQUIRE_PROCESS_CLEANUP=1 (missing bun fails, not
  skips). Windows behaviour is unproven until that job runs.
