# 02 — Bug fixes

Part of the [master plan](00-master-plan.md). Every bug is fixed test-first
(`rig-tdd`): a red test that reproduces the defect, the smallest fix, then
green. One commit per item. Run the single test file in the inner loop; the
full gate runs only at ship time.

## RIG-127.11 — uninstall crashes on a corrupted global config

- **Now:** `removeGlobalConfig` (`rig/lib/global-writes.js:198`) calls
  `readJson`, which is a raw `JSON.parse`. A corrupted file throws uncaught in
  the middle of uninstall. Its sibling `removeGlobalMcp` already catches this.
- **Fix:** catch the parse error. Leave the file untouched and report it as
  best-effort, matching the sibling.
- **Acceptance:** uninstall with a corrupted global config exits normally,
  lists that path as best-effort, and leaves the file byte-identical.
- **Test:** a new case in `tests/install-uninstall-roundtrip.test.js` or a
  lifecycle test file.

## RIG-127.12 — legacy nameless managed-block over-strips

- **Now:** `rig/lib/lifecycle.js:413-431`. When a record's `managed_block` is
  not a string, the name falls back to `[^\n]*`, which strips **every**
  `rig:*` block in the file.
- **Fix:** for a nameless legacy record, strip only blocks whose content
  digest matches what the record says Rig wrote. Otherwise report the file as
  best-effort.
- **Acceptance:** a file with a legacy nameless record plus a second, different
  `rig:*` block loses only the owned block, and the other survives
  byte-identical.

## RIG-145 — read-only runner batch-aborts

- **Now:** `runReadOnly` (`rig/lib/lint-format.js:696-700`) returns one
  `network_isolation_unavailable` for the whole batch at the first ungranted
  command. `runGrade` (`:627-628`) decides per command.
- **Fix:** decide per command, matching `runGrade`.
- **Acceptance:** the acceptance in `wiki/tickets/RIG-145.md`. Plan
  `[ungranted, network-granted]` with no isolation runs the granted command and
  marks the ungranted one, the result carries `changed_paths`, and nothing
  ungranted reaches the network. Uses a new process case.

## RIG-146 — frozen one-use case proves less than it claims

- **Now:** frozen `AT-LF-20` (`tests/advanced-oracle.test.js:916-927`) reuses
  one approval object, so the in-memory flag rejects the second use before the
  durable on-disk record is ever consulted.
- **Fix (frozen file, so it goes through an unfreeze request):** build two
  independent approval objects from the same signed approval, so only the
  on-disk record can reject the second.
- **Acceptance:** with the durable block deleted from the implementation, the
  case fails. With it restored, the case passes. That mutation check is recorded
  in the unfreeze request.

## RIG-147 — duplicate stderr warning

- **Now:** `rig/lib/check-runner.js:198` calls `console.warn` even though the
  result already carries `network_state: 'undeclared'` and a `diagnostic`.
- **Fix:** first add a visible caller-level diagnostic in installed CLI/CI;
  the current baseline caller ignores successful results' network diagnostics.
  Then delete the library `console.warn`. Emit one warning, with a GitHub
  Actions annotation in CI and a normal diagnostic in other CLI execution.
- **Acceptance:** no stderr output from the runner on an undeclared network,
  and the CI annotation appears. The existing capability cases stay green.

## RIG-135.1 — cookie import can leave the user's real browser locked (Windows)

- **Now:** `rig/catalog/skills/browser-and-research/browser-automation/browse/src/cookie-import-browser.ts`
  launches Chromium against the user's real profile and kills only the leader
  pid.
- **Fix:** launch through a Windows Job Object with kill-on-close, or the
  documented launch-read-close sequence with an OS-level watchdog, so every
  descendant dies on any exit path.
- **Verification:** a new `windows-latest` GitHub Actions job runs a test that
  launches a forking stub in place of Chromium and asserts no descendant
  survives success, timeout, or cancellation. Earlier this was blocked only
  because there was no Windows CI; GitHub's Windows runners remove that.

## RIG-135.2 — browse scripts spawn through Bun, which can't group-kill

- **Now:** `browser-skill-commands.ts` uses `Bun.spawn`, and Bun's `kill()`
  has no process-group kill (oven-sh/bun#15791).
- **Fix:** spawn through `node:child_process` (which Bun supports) with
  `detached: true`, and kill the process group, mirroring
  `rig/lib/spawn-guarded.js`.
- **Acceptance:** killing a skill script that forks leaves no descendant. The
  spawn-guard ratchet (`tests/spawn-guard-allowlist.test.js`) loses this
  allowlist entry.

## RIG-135.3 — Xvfb isn't actually detached

- **Now:** `xvfb.ts:134` says "spawn detached" but doesn't pass `detached: true`.
- **Fix:** pass `detached: true` and tear down by group on stop.
- **Acceptance:** after stop, no Xvfb process from this session remains. The
  test runs on Linux CI where Xvfb is available.

## Dependencies and risks

- 127.11 and 127.12 touch uninstall, which 03's v5 migration also touches.
  Land 02 first so 03 builds on fixed code.
- The browse fixes become tested local patches applied to the pinned upstream
  bytes fetched during onboarding (owner delivery decision). Retain licence
  notices and patch provenance. Offering upstream patches is a later human
  publication step; it is not required to deliver the tested local fix.
