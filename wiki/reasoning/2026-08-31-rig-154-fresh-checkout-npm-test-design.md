---
date: 2026-08-31
source: agent
topics: testing-strategy
decisions:
status: current
supersedes:
tags: interdependency, trap
summary: Technical design for RIG-154 — fresh-checkout `npm test` fails because AT-HOME-1's fake npm copies a rig-mcp/node_modules tree nothing in the root run creates. Fix is a canonical bootstrap guard appended to the existing `pretest` (D1), locked by a structural non-frozen test asserting the guard is present and CI carries no masking `npm ci --prefix rig-mcp` step (D2). Both changes force a Gate-1 re-sign because `wiki/gate1/package-scripts.json` is in the signed manifest.
---

# Design: fresh-checkout `npm test` fails on missing `rig-mcp/node_modules` (RIG-154)

`rig-product-design` output (pipeline step 2). Grilling handoff carried the
oracle below as an unsigned draft; no ticket or trace existed before this file.

## Oracle (carried verbatim from the grilling handoff — unsigned draft)

**Outcome:** `npm test` passes on a fresh checkout with no prior setup, running
the identical bootstrap locally and in CI.

**In scope**

- Root pretest ensures rig-mcp deps exist:
  `[ -d rig-mcp/node_modules ] || npm ci --prefix rig-mcp --no-audit --no-fund`,
  appended to the existing hook (which already does the same pattern for the
  Python venv).
- Delete CI's now-redundant standalone "Install bundled MCP runtime
  dependencies" step.
- Update `wiki/gate1/package-scripts.json` to match; human re-sign.

**Out of scope / non-goals**

- No edit to `tests/advanced-oracle.test.js`.
- Do not commit `rig-mcp/node_modules`; `rig-mcp/package.json` +
  `package-lock.json` stay source of truth.
- No npm-workspaces re-architecture of rig-mcp.
- Real-npm clean-environment E2E is a separate follow-up (RIG-155), not this
  one.

**Acceptance (observable)**

- Fresh clone, no `.venv`, no `rig-mcp/node_modules` → `npm test` exits 0;
  AT-HOME-1 passes.
- `.github/workflows/test.yml` contains no `npm ci --prefix rig-mcp` step; CI
  green on plain `npm test`.
- `rig-mcp/node_modules` stays untracked; `git status` clean after a run.
- Full gate green.

## Current-state trace

`npm test` = `node scripts/check-advanced-spec.js && npm run test:code`.
`npm` runs `pretest` first: today
`PATH=.venv/bin:$PATH python3 -c "import pandas" 2>/dev/null || npm run setup:dev`
— a guard/fallback that materialises the Python venv only when it is missing.

`test:code` =
`npm run test:secrets && node scripts/check-rule-copies.js && node scripts/check-versions.js && PATH=.venv/bin:$PATH node --test tests/*.test.js && npm test --prefix pi-extension && npm test --prefix rig-mcp`.
`node --test tests/*.test.js` runs the whole root suite — including
`tests/advanced-oracle.test.js` case **AT-HOME-1** — *before*
`npm test --prefix rig-mcp`, whose own `pretest`
(`[ -d node_modules ] || npm install --no-audit --no-fund`) is the only thing
in the pipeline that would create `rig-mcp/node_modules`.

AT-HOME-1 tests `install.sh --openclaw-mcp`. It puts a fake `npm` on `PATH`
(`advanced-oracle.test.js:499-510`) whose body is
`cp -R "$RIG_TEST_MCP_NODE_MODULES" "$dest/node_modules"` with
`RIG_TEST_MCP_NODE_MODULES = <root>/rig-mcp/node_modules` (`:538`). The staging
copy at `:477-480` deliberately excludes `node_modules`, so the fake npm is the
only path that can populate the installed runtime. When
`<root>/rig-mcp/node_modules` is absent the `cp` fails, the fake npm exits
non-zero, `install.sh` aborts with *"npm ci failed for bundled rig-mcp
runtime"*, and `assert.equal(optedIn.status, 0)` (`:548`) fails.

CI passes only because `.github/workflows/test.yml:37-38` runs a standalone
`npm ci --prefix rig-mcp --no-audit --no-fund` before `npm test`. That step is
invisible to the test and to a fresh local checkout — the exact
non-hermetic-fixture / hidden-ambient-state smell the approved analysis
(`.context/attachments/up28bR/pasted_text_2026-08-31_12-00-32.txt`) names.

The test genuinely needs real deps: `:561-575` connects a real MCP client to
the installed server and calls `rig_instructions`. A stub tree will not do.

## Frozen surface (confirmed against the branch)

`wiki/gate1/testing-infrastructure.manifest` pins, by SHA:

```
scripts/check-advanced-spec.js
tests/advanced-oracle.test.js
tests/advanced-spec-gate.test.js
tests/helpers/advanced.js
wiki/gate1/package-scripts.json      ← in the manifest, contra the handoff note
```

`check-advanced-spec.js` hashes the manifest file into the signed oracle
message (`oracleMessage()`), and `verifyManifest()` re-hashes every listed
file. So **`wiki/gate1/package-scripts.json` is covered by the Gate-1
signature** — the handoff's "not itself in the signed manifest" is wrong. This
does not change the conclusion (a re-sign is required), only the ceremony:
`node scripts/approve-gate1.js` will call `refreshManifest()`, rewrite the
manifest with the new `package-scripts.json` digest, and — because
`wiki/gate1/gate1.sig` already exists — refuse once, printing the expected
digest, then re-sign when re-run with `--confirm-digest-delta <sha256>`. That
step needs `RIG_GATE1_SIGNING_KEY` and is the human key holder's (pipeline
step 3). `verifyPackageScripts()` also `assert.deepEqual`s `package.json`
`.scripts` against the snapshot, so the snapshot must be updated in the same
change. `.test` is unchanged by this work, so the
`/^node scripts\/check-advanced-spec\.js && npm run test:code$/` assertion at
`check-advanced-spec.js:150` still holds.

`.github/workflows/test.yml` is not frozen.

## D1 — bootstrap mechanism

**Chosen: Option A — append a guard to the existing `pretest`.**

New `pretest`:

```
{ PATH=.venv/bin:$PATH python3 -c "import pandas" 2>/dev/null || npm run setup:dev; } && { [ -d rig-mcp/node_modules ] || npm ci --prefix rig-mcp --no-audit --no-fund; }
```

Brace-grouped on purpose. POSIX `sh` gives `&&` and `||` equal precedence,
left-associative, so the bare
`A || B && [ -d x ] || npm ci` reads as `(((A || B) && [ -d x ]) || npm ci)` —
which happens to work on the happy path but couples the venv result to the mcp
branch. `{ venv-guard; } && { mcp-guard; }` keeps each guard's
`check || fallback` semantics intact and independent. npm executes `scripts`
through `sh -c`; brace groups are POSIX.

Why `pretest` and not `pretest:code`: `npm test` runs `pretest` before
`node scripts/check-advanced-spec.js` and the whole `test:code` chain, so
`rig-mcp/node_modules` exists before any `tests/*.test.js` file loads.
`pretest:code` (`npm run pretest`) re-runs the same guard, idempotently, for a
direct `npm run test:code`.

`[ -d rig-mcp/node_modules ] ||` means `npm ci` runs *only when the tree is
absent*. `npm ci` deletes any existing `node_modules` before installing; the
guard prevents that from ever touching a developer's populated tree. This
mirrors `rig-mcp/package.json`'s own `[ -d node_modules ] || npm install`
pattern (with `ci` instead of `install` — stricter, lockfile-exact, and what
AT-HOME-1's `/\bci\b/` log assertion at `:551` documents as the product path).

**Rejected: Option B — a dedicated `setup:test:mcp` script invoked by both
`pretest` and CI.** More explicit, but adding a `scripts` key still breaks
`verifyPackageScripts()`'s `deepEqual` → same re-sign cost as Option A, plus a
new indirection and a second call site to keep in sync. Option A is one line in
a hook that already establishes the "guard the venv, or build it" precedent.

CI change: delete `.github/workflows/test.yml:36-38` (the
"Install bundled MCP runtime dependencies" step). `npm test` → `pretest` → mcp
guard now performs the identical `npm ci --prefix rig-mcp` on the fresh CI
checkout, so local and CI run one bootstrap. The separate "Secret hygiene" step
(`:45-46`, `npm run test:secrets`, no pretest) is unaffected and stays for the
ordering reason its comment gives.

## D2 — regression lock

**Chosen: structural, in a new non-frozen test file.**

The regression to lock: the fresh-checkout breakage returns *silently* (CI stays
green) if either (a) the `pretest` guard is deleted or malformed, or (b) a
masking `npm ci --prefix rig-mcp` step is re-added to CI. A structural test
catches exactly those two.

New `tests/rig-mcp-bootstrap.test.js` (sibling to
`tests/advanced-ci-floor.test.js`, the existing precedent for asserting on
repo/CI shape):

1. `require('../package.json').scripts.pretest` matches
   `/\[ -d rig-mcp\/node_modules \][^\n]*\|\|[^\n]*npm ci --prefix rig-mcp/`
   — the guard is present and correctly shaped.
2. Read `.github/workflows/test.yml`; assert no line matches
   `/npm (?:ci|install)\b[^\n]*--prefix\s+rig-mcp/` — CI carries no step that
   would mask a broken guard.

Fails today: assertion 1 (no guard yet) and assertion 2 (CI has the step).
Passes once both D1 changes land.

Behavioural proof is delegated, not automated in-suite:

- The frozen **AT-HOME-1** already proves the installed MCP server actually
  starts and answers a tool call once its deps exist — that guarantee is not
  what regressed and does not need re-proving here.
- One recorded manual run: `git clean -xdf && npm test` on a fresh worktree,
  output pasted into the close-out trace as the fresh-checkout behavioural
  evidence. Running a real networked `npm ci` inside the unit suite would make
  every `npm test` slow and registry-dependent — the approved analysis
  explicitly warns against burying that in an oracle test.

**Rejected: semantic guard-execution test.** Run the guard against a fake `npm`
shim on `PATH` (AT-HOME-1's own technique) in a temp dir and assert it invokes
`ci --prefix …/rig-mcp` when the dir is absent and not when present. ~40 lines,
still deterministic and network-free, and it proves the guard *branches*
rather than merely *exists*. Not chosen: the guard is `[ -d x ] || cmd` — three
tokens of POSIX `sh`; a test that it branches is a test that `sh` works. The
realistic regressions are "guard removed" and "CI step re-added", both caught
by the structural form. Kept on record as the stronger option if a reviewer
wants in-suite behavioural coverage of the guard itself.

**Rejected: a new early-ordered `tests/aaa-*.test.js` that self-bootstraps.**
`node --test` runs test files as separate child processes with per-file
concurrency (Node 24); filename order does not guarantee a bootstrap file
completes before `advanced-oracle.test.js` starts. And it is precisely the
"sprinkle `npm ci` inside the tests" shape the approved analysis rejects.

## Ordered slices and verification

1. **Lock (red).** Add `tests/rig-mcp-bootstrap.test.js` with the two
   assertions.
   Verify: `node --test tests/rig-mcp-bootstrap.test.js` → both fail.
2. **Guard (green on the lock's assertion 1).** Append the brace-grouped mcp
   guard to `pretest` in `package.json`; copy the new `scripts` block verbatim
   into `wiki/gate1/package-scripts.json`.
   Verify: `node --test tests/rig-mcp-bootstrap.test.js` → assertion 1 passes;
   `node scripts/check-advanced-spec.js` → fails on the manifest digest
   (expected — awaits step 4).
3. **CI parity (green on the lock's assertion 2).** Delete the
   "Install bundled MCP runtime dependencies" step from
   `.github/workflows/test.yml`.
   Verify: `node --test tests/rig-mcp-bootstrap.test.js` → 2/2 green.
4. **Re-sign (human, pipeline step 3).**
   `node scripts/approve-gate1.js` → refuses, prints
   `--confirm-digest-delta <sha256>`; re-run with that flag.
   Verify: `node scripts/check-advanced-spec.js` → *Oracle verified*.
5. **Fresh-checkout behavioural proof.** In a clean worktree
   (`git clean -xdf`), no `.venv`, no `rig-mcp/node_modules`: `npm test`.
   Verify: exits 0, AT-HOME-1 passes, `git status` clean. Paste output into the
   close-out trace.
6. **Full gate.** `npm test` at repo root → green. Then branch
   `RIG-154-fresh-checkout-bootstrap` and PR against `prod`.

## Data, safety, failure boundaries

- **No new trust boundary.** The guard runs the same `npm ci --prefix rig-mcp`
  CI already ran, from the committed `rig-mcp/package-lock.json`.
- **Network:** `npm ci` needs the registry. CI already had this exact step, so
  CI's network profile is unchanged. Local `npm test` on a fresh checkout now
  makes one network call it did not before — the deliberate canonical-bootstrap
  tradeoff the approved analysis endorses (declared setup, identical local and
  CI). Subsequent runs skip it via the `[ -d ]` guard. Offline devs with no
  `rig-mcp/node_modules` were already unable to pass `npm test` (AT-HOME-1);
  this makes the failure a clear one-line `npm ci` instead of a fake-npm `cp`
  abort.
- **Idempotency:** guard is `check || fallback`; a populated tree is left
  untouched (no `npm ci` wipe).
- **`rig-mcp/node_modules` stays untracked** — already covered by
  `.gitignore`/`.git/info/exclude`; nothing in this change commits it.

## Risks / returns to grilling

- **R1 — the re-sign is unavoidable.** Any change to `package.json` `.scripts`
  breaks the signed snapshot. This is by design (step 3 exists for exactly
  this); flagged so it is not a surprise. No way to fix the outcome without
  touching `pretest`, and no non-`scripts` local hook exists to carry the guard.
- **R2 — `npm ci` vs `npm install` drift.** `rig-mcp/package.json`'s own
  `pretest` uses `npm install`; this guard uses `npm ci`. Harmless (both honour
  the lockfile) and `ci` matches AT-HOME-1's asserted product path. Aligning
  rig-mcp's own hook is out of scope — note only.
- **R3 — RIG-155.** The real-npm, clean-container E2E that proves the *customer*
  install path (real `install.sh` → real `npm ci` → MCP up → tool call) is a
  separate ticket, not this one. Propose it on close.
- No oracle contradiction. The frozen AT-HOME-1 assertions are untouched and
  stay green; this change only supplies the fixture prerequisite the test
  always assumed.
