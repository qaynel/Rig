---
date: 2026-08-20
source: intent owner
topics: testing-strategy, delivery-plan, distribution-and-release, the-catalogue
decisions:
status: historical
---

Survey of the branch `implement-advanced-a-la-carte-catalogue-refactor-cleanup`
before any TODO work starts. Report-only; the intent owner then ruled per item
below. Full survey text preserved verbatim.

## Survey findings

### High-value

1. **`AGENTS.md` and `GEMINI.md` are byte-identical, no drift guard.**
   `gemini-extension.json` sets `contextFileName: AGENTS.md`, so `GEMINI.md` may
   be pure legacy. Fix: delete it, or add a diff check to
   `scripts/check-rule-copies.js`.
2. **`.github/workflows/publish.yml` still present.** `wiki/status.md` says it
   must be deleted before a release; also it runs `npm publish` on a package
   marked `"private": true`, so a version tag would fail.
3. **~30 exports across `rig/lib/*.js` have zero external callers.** Grepped
   every symbol; unused: `apply.js` → `acquireLock`, `POINTER_LINE`;
   `config.js` → `TRANSPORTS`, `CREDENTIAL_SAFETY`, `validateAny` (plus the
   alias `validateRigJson`); `credentials.js` → `LOAD_STEP`, `writeEnvExample`,
   `gitignoreEnv`, `writeMcpSetup`, `pointReadme`; `renderers.js` →
   `HOST_TIER`, `CREDENTIAL_SAFETY`, `mergeJson`, `appendTomlBlock`,
   `RENDERERS`, `fileFor`; `variants.js` → `SUPPORTED_TRANSPORTS`,
   `representable`; `reports.js` → `ALLOWED`; `host-capabilities.js` →
   `REGISTRY`, `DEFAULT_CAPABILITIES`, `VERIFIED_ON`; `inspect.js` →
   `MAX_BYTES`, `redact`, `VERDICTS`, `KNOWN_RESTRICTIONS`, `validateVerdict`;
   `checks.js` → `runArgv`, `runBinding`, `checkCopies`; `profile.js` →
   `profileRepo`; `guard.js` → `FLOOR_PATTERN` (internal only). Also collapses
   a `CREDENTIAL_SAFETY` name collision between `config.js` and `renderers.js`.
4. **6 command files duplicated across `.agents/workflows/`,
   `.opencode/command/`, and `commands/*.toml`**, byte-identical, no drift
   guard.
5. **`__init__.py` at the repo root is the Hermes plugin.** Real and tested by
   `tests/hermes-plugin.test.js`, but undocumented in CLAUDE.md's architecture
   section; `npm test` pays a `.venv` + pandas install to unlock one
   `benchmarks/correctness.js` assertion.
6. **`tests/basic-guard-{chain,floor,scanner}.test.js` each reimplement
   `initRepo`/`git` shims.** `tests/helpers/basic-install.js` already exists —
   move the helpers there.

### Medium-value

7. **`rig/bootstrap.sh` has 25 hardcoded install lines that duplicate
   `rig/manifest.json`.** The `--hosts` branch already goes through
   `payload.js`; the default POSIX path does not.
8. **428 of 808 files in `rig/catalog/services/**` are `TODO(Slice 10)`
   placeholders.** Expected per `status.md`, but the tree noise and 216 KB
   `catalog.json` are real.
9. **Two unrelated uninstallers**: `scripts/uninstall.js` (legacy
   plugin-runtime path) and `rig/lib/uninstall.js` (current Basic path). A test
   comment already warns "don't reuse the legacy one".
10. **`benchmarks/` is not referenced by CI, README, or docs.** Only two tests
    require its modules.
11. **`wiki/specs/{roadmap,sow,tasklist}.md` (~2100 lines) self-flag as
    pre-refactor** and still use "hermes/basic/mid/advanced" terminology
    superseded by the a-la-carte catalogue.
12. **`docs/pr-reviews/` is empty.**

### Low-value

- `rig/lib/apply.js` at 561 LOC with a ~220-line `applyPlan`; readable, don't
  split yet.
- `scripts/check-rule-copies.js` has 7 hand-listed targets; grows with every
  new host.
- `rig/lib/receipt.js` is 17 lines — could inline into its 2 callers.
- 10+ hidden install-target roots with no CLAUDE.md map from directory → owner
  test → shipping status.

### Ruled out (already clean)

`.claude/skills/` ↔ `.agents/skills/` (drift-guarded by
`tests/rig-bootstrap.test.js`); `.openclaw/skills/` (generated + drift-checked);
`rig/manifest.json` ↔ `rig/lib/payload.js` split; `scripts/check-versions.js`;
`rig/tier-1/routing.md`; `tests/helpers/advanced.js`; `hooks/`; `rig-mcp/`;
`pi-extension/`; `CLAUDE.md`.

## Intent-owner rulings

### High-value

1. **AGENTS.md / GEMINI.md** — keep both. They are the same content served to
   different hosts by design.
2. **`publish.yml`** — delete it.
3. **Unused `rig/lib/*.js` exports** — check the git history first. Intent
   owner's read: they were left over from a TODO. If confirmed, note the
   finding in the wiki (below) before any removal decision.
   - Investigation: all 30 exports were introduced in the two landing commits
     `3e3feeb` (2026-07-19, "Implement Tier 2 Basic materializer") and
     `8dcaa49` (2026-07-26, "Implement Advanced a-la-carte catalogue and
     delivery CLI"), and no later commit added or removed callers. They are
     speculative API surface shipped in bulk with the landings — the "left
     from a TODO" reading matches. YAGNI applies: remove when the next
     touching change happens, or as a single mechanical sweep, but they are
     not load-bearing today.
4. **6 command-file copies across `.agents/workflows/`, `.opencode/command/`,
   `commands/*.toml`** — same as (1). Same content served to multiple hosts,
   recorded here as intentional.
5. *(no ruling — deferred to open question below)*
6. **Basic-guard test triplet** — move the shared `initRepo`/`git` shims into
   `tests/helpers/basic-install.js`.

### Medium-value

7. **`bootstrap.sh` vs `manifest.json` duplication** — clean it up.
8. **428 catalogue placeholders** — keep as TODO; note their status in the
   wiki.
9. **`scripts/uninstall.js`** — delete the old one.
10. **`benchmarks/`** — keep; document as TODO in the wiki.
11. **`wiki/specs/{roadmap,sow,tasklist}.md`** — remove them.
12. **`docs/pr-reviews/`** — keep for future use.

### Low-value

Handle as deemed necessary during the work above; no separate ruling.

## What happens next

Nothing yet. The intent owner said do not start. The cleanup punch list is
mirrored into `status.md` so agents pick it up when work begins; the rulings
above are the reference for what each item's outcome must be.
