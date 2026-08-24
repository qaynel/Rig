---

kanban-plugin: board

---

## Backlog



## Solution Discovery



## Acceptance Criteria & Testing



## Request for Signing



## Coding

## Ready for Commit

- [x] **RIG-123 — Implement the OpenClaw global MCP opt-in**
	**Status:** Implemented (2026-08-24) - tests green, ready to commit/push · [Solution](tickets/RIG-123.md)
	**Landed:** The explicit installer flag warns about the global JSON5 file and all-workspace effect, installs the locked `rig-mcp` runtime, registers through `openclaw mcp set`, attributes the server key in `.rig/global-writes.json`, and unsets before runtime deletion. Failed unregister retains the runtime and ledger entry.


## Blocked

- [ ] **RIG-122 — (Low priority / deferred) Offer the wiki-knowledge system as a Rig tool family**
	**Status:** BLOCKED (2026-08-24) — approved post-release work; RIG-120 and publication are incomplete · [Solution](tickets/RIG-122.md)
	**Blocker:** The owner approved this only after the core release. RIG-120 has no passing independent review, is paused on three confirmed release defects, and still precedes owner signing plus `v5.0.0` publication. Resume after RIG-120 is Done and the release exists.
	**Acceptance:**
	- Any shipped form respects the Tier 1 markdown-only constraint (structure + conventions as markdown; no installed runtime, sync engine, or required third-party app).
	- If it depends on Obsidian/Kanban specifically, that dependency is optional and the structure degrades to plain markdown without it.
- [ ] **RIG-116 — Promote the non-lint-format leaves Policy → Context → Evidence**
	**Status:** BLOCKED (2026-08-24) — post-beta demand evidence and prerequisite gates do not yet exist · [Solution](tickets/RIG-116.md)
	**Blocker:** The governing roadmap requires promotion after beta, ranked by observed use under ordinary owner review. No beta selection/receipt evidence or approved demand ranking exists, the release remains blocked, and the reusable lint-format consent template is blocked. Guessing a family would violate the acceptance criterion.
	**Acceptance:**
	- A prioritized, family-batched plan promotes leaves beyond Policy on evidence of use, each under the ordinary gate.
	- At least the highest-demand families reach Context/Evidence with real verifiable checks.
- [ ] **RIG-115 — Author lint-format acceptance for applicability, execution consent, and shell trust**
	**Status:** BLOCKED (2026-08-24) — granular shell-trust policy and owner re-sign required · [Solution](tickets/RIG-115.md)
	**Blocker:** The signed oracle has broad consent, exclusion, mutation, and argv-boundary cases, but the ticket's deterministic draft still marks approval lifetime, filesystem/env isolation, network denial, resource caps, and symlink behavior as assumptions. The owner must approve/correct those guarantees and re-sign the resulting acceptance/tests before implementation can claim them.
	**Acceptance:**
	- Deterministic acceptance cases exist and pass for each of the three contracts, added under the owner's re-sign.
	- A leaf task that attempts a mutation under a read-only approval, or escapes the argv boundary, fails visibly.
- [ ] **RIG-113 — Bound the lint-format setup/replacement (hybrid-plus) contract**
	**Status:** BLOCKED (2026-08-24) — owner must approve the drafted ecosystem preferences and choose replacement backup semantics · [Solution](tickets/RIG-113.md)
	**Blocker:** The ranked lists, EOL/coverage signals, proposal rule, and write scopes are drafted, but remain owner product policy; `<file>.rig-backup` is explicitly marked assumed. Acceptance tests and implementation must wait for those choices and the owner re-sign.
	**Acceptance:**
	- "Better alternative" has a defined, testable decision rule; a proposed setup/replacement never lands without an explicit user decision.
	- The generated-setup contract (files, scope, approval) is specified and covered by acceptance cases.
- [ ] **RIG-112 — Freeze and implement the catalogue contract + authored-service gate**
	**Status:** BLOCKED (2026-08-24) — 115-leaf mechanical gate is green; D27 defers the owner-only freeze ceremony · [Solution](tickets/RIG-112.md)
	**Blocker:** The signed CI gate already rejects mechanically valid but generic/unbound leaves across exactly 115 services. The remaining acceptance criterion is the catalogue freeze itself, which the owner's D27 ruling explicitly defers until the owner agrees the final solution, acceptance, and tests are sound and re-signs the oracle.
	**Acceptance:**
	- The catalogue contract is frozen and enforced in code; a leaf that is mechanically valid but generic (no repository binding / no service-specific check) fails the authored-service gate as a coverage gap.
	- The gate runs in CI over all 115 leaves.
- [ ] **RIG-110 — Prove first-wire + live-hook contracts for every supported host**
	**Status:** BLOCKED (2026-08-24) — needs owner beta-roster decision and access/results for real host/CI wires · [Solution](tickets/RIG-110.md)
	**Blocker:** The governing spec still marks every executable host/CI first wire pending, and no real-wire records exist. Fixture and byte-landing tests cannot satisfy that frozen criterion. Owner must decide which candidates remain executable versus pointer-only/unsupported, then provide access to or dated results from those vendor environments.
	**Acceptance:**
	- Each of the 19 researched hosts + 6 CI providers has an exact live-hook/instruction/skills/MCP contract with a byte-landing test and at least one real first-wire verification (or is explicitly recorded as pointer-only/unsupported).
	- The §3.1 ❔/🟡 conflicts (codewhale, hermes, swival, antigravity CLI) are each resolved to a decided disposition in the wiki.
- [ ] **RIG-120 — Finish the release ceremony and cut v5.0.0**
	**Status:** BLOCKED — owner action only (signing keys); branch gate is green · [Solution](tickets/RIG-120.md)
	**Problem:** status.md: the release is blocked on owner-controlled inputs — a fresh independent review receipt bound to the exact PR worktree, the intent owner's signer-class attestation on the frozen Gate 1 signer file, and the explicit `v5.0.0` tag/publish (never an implicit side effect). Until these land there is no installable release, only a source checkout.
	**Acceptance:**
	- A fresh independent review receipt is produced against the exact PR worktree and passes.
	- The signer-class attestation is added via an owner-authorized re-signing ceremony.
	- The full gate is rerun green on the final bytes and `v5.0.0` is cut and published.


## Done

- [x] **RIG-119 — Incorporate spec-driven development into the Rig pipeline**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-119.md)
	**Done:** Spec-driven requests now route through the existing grilling and product-design owners. Grilling names the five executable-spec checkpoints, product design owns code-grounded technical interrogation, and an acceptance case enforces the route and synchronized native-host copies without adding a new skill.
- [x] **RIG-105 — Automate Antigravity MCP wiring or make the manual step first-class**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-105.md)
	**Done:** Antigravity onboarding emits exact selected-server stdio JSON for manual merge into `~/.gemini/config/mcp_config.json` and an installed verification command. The check accepts semantically equivalent JSON, rejects drift and malformed configuration, and Rig never writes the global file while CLI issue #60 remains open.
- [x] **RIG-114 — Replace fixed npm-script discovery with whole-repo semantic discovery**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-114.md)
	**Done:** Whole-repository discovery now binds non-standard manifest/task commands and configured polyglot tools with exact argv, cwd, ignore metadata, and source digests. Ambiguity blocks apply for user choice; unbuildable components are named unprotected and suppress the repository-wide support claim.
- [x] **RIG-111 — Define exact user-global MCP contracts + byte-landing tests**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-111.md)
	**Done:** Exact current contracts and attributed merge/remove writers for Windsurf/Devin Desktop legacy Cascade, Cline IDE, Hermes, and CodeWhale; multi-repository, idempotence, malformed-input, changed-value, forged-ledger, and uninstall coverage. Activation remains note-only behind RIG-110's roster and real-wire gate.
- [x] **RIG-109 — Test the runtime through its shipping path, not by direct `require`**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-109.md)
	**Done:** Active-runtime bootstrap plans, applies, and checks lint-format through `.rig/bin/rig`; tagged-release inspection, installed commit validation, managed grafting, MCP enforcement, and the review wrapper add shipping-path coverage while the signed direct-require oracle remains intact.
- [x] **RIG-108 — Resolve the four zero-caller runtime modules (wire or delete)**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-108.md)
	**Done:** All runtime modules now have production callers guarded by a repository-wide caller test. The existing enforcement, release-review, and commit-dispatch seams are proven; catalogue apply now uses managed graft blocks with journaled legacy migration and exact named-block uninstall.
- [x] **RIG-107 — Wire the advanced runtime into a real install/run entrypoint**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-107.md)
	**Done:** Active-runtime installs journal `.rig/bin/rig`, bootstrap prints a copy-pasteable inspect → recommend → plan → apply → check workflow, and tagged-release plus lint-format regressions exercise the installed command. The tracer also excludes Rig-owned `.rig` packages from customer component discovery.
- [x] **RIG-101 — Wire the `rig-mcp` server into host distribution**
	**Status:** Implemented (2026-08-24) — committed on this branch · [Solution](tickets/RIG-101.md)
	**Done:** `opencode.json` registers `rig-mcp` (`mcp.rig`), verified by `tests/opencode-mcp.test.js`; `rig-mcp/test/stdio.test.js` spawns the real server over stdio and checks all three modes; `docs/agent-portability.md` documents copy-paste config for every host key shape; exclusions (`pi`, `generic`, user-global-only hosts) recorded in `host-coverage-spec §3.2.1`.
- [x] **RIG-106 — Propagate Rig mode to subagents on every host that supports them**
	**Status:** Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-106.md)
	**Done:** Researched all 19 hosts against vendor docs for a subagent hook that can inject context (host-coverage-spec §3.1a). Wired the ticket's named gap — Copilot/Copilot CLI's `subagentStart` — into `hooks/copilot-hooks.json` + `hooks/rig-runtime.js`, verified by new cases in `tests/hooks.test.js` (caveat: never fires for Copilot's built-in `general-purpose` agent, only named/custom agents — vendor limitation, not a Rig gap). Every other host recorded N/A with a distinct evidenced reason (gate/observer-only hook — cursor, codewhale, hermes; no subagent-scoped event; plugin-only or SDK-only mechanism; or no hooks at all). Corrected post-review 2026-08-24: hermes moved from "no mechanism" to observer-only, pi's "no mechanism" softened to "no native mechanism," kiro resolved from unresolved to N/A (session-scoped payload).
- [x] **RIG-103 — Stop emitting MCP config for hosts that don't support it (pi contradiction)**
	**Status:** Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-103.md)
	**Done:** `pi` removed from the MCP auto-write set and its renderer deleted; selecting `pi` now emits no `.omp/mcp.json`, and a pre-existing user-owned file is preserved byte-for-byte with migration guidance (AT-HOST-5), covered end-to-end for the legacy path the frozen catalogue-only oracle test didn't reach. The shared disposition map is `rig/lib/mcp-hosts.js` (RIG-104).
- [x] **RIG-104 — Unify the legacy `renderers.js` MCP path with the catalogue materializer**
	**Status:** Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-104.md)
	**Done:** New `rig/lib/mcp-hosts.js` is the single disposition/file/key table (from `host-capabilities.js` research, with two named documented overrides) driving both the legacy Basic path and the catalogue descriptor path. One shared `mergeMcpEntry` writer replaces 12 near-duplicate per-host JSON mutators, proven idempotent and unrelated-entry-preserving per shape by new `tests/basic-mcp-merge.test.js`. Network-capable MCP entries are evaluated through the same policy engine as shell/web, with a parity test. Two real path/shape divergences between the two paths (pi, OpenClaw) were found and reconciled. `copilot-cli` — cited, non-conflicted `mcp: 'repo'` host — got a renderer too, closing the last serviceability gap among researched hosts (only the §3.1 unresolved-conflict/user-global/unsupported hosts remain note-only). Full gate green.
- [x] **RIG-102 — Run the `rig-mcp` test suite in the CI gate**
	**Status:** RESOLVED — landed via owner re-signing ceremony · [Solution](tickets/RIG-102.md)
	**Problem:** `npm test` → `test:code` ran the root Node suite and `npm test --prefix pi-extension`, but never `npm test --prefix rig-mcp`, so the MCP server's shared instruction contract could regress undetected.
	**Done:** Added `&& npm test --prefix rig-mcp` to `test:code` in `package.json`, mirrored in the signed `wiki/gate1/package-scripts.json`, owner re-signed the oracle (`node scripts/approve-gate1.js`). The signature verifies and the current rig-mcp suite passes 6/6.
- [x] **RIG-117 — Fix stale plugin/repo identity across manifests and README**
	**Status:** RESOLVED — landed + verified · [Solution](tickets/RIG-117.md)
	**Problem:** The remote is now `github.com/qaynel/Rig-v0.1`, but published plugin metadata still points at the old identity: `.codex-plugin/plugin.json`, `.devin-plugin/plugin.json`, and `antigravity-plugin/plugin.json` all set `homepage`/`repository` to `github.com/vaibhav-kodiyan/agentic-harness-demo`, and README/product-spec note lingering ponytail-era naming. Customers install a plugin whose links go to the wrong repo.
	**Done:** Replaced the stale slug with `qaynel/Rig-v0.1` across all manifests, the marketplace entry, openclaw skills, the opencode plugin, and the openclaw generator; added an identity guard to `check-versions.js` that fails on the stale slug. One open naming reconciliation (`qaynel/Rig` vs `qaynel/Rig-v0.1`) flagged for the release — see solution + RIG-120.
- [x] **RIG-118 — Make the full plugin distribution discoverable from the README**
	**Status:** RESOLVED — landed · [Solution](tickets/RIG-118.md)
	**Problem:** The richer plugin installs (Claude/Codex/OpenCode/pi/Hermes/Gemini CLI/Copilot CLI/OpenClaw/Devin, with hooks/commands/statusline) are a shipped surface, but the README only documents Tier 1 + Tier 2; the host install commands live only in `docs/agent-portability.md`. A user landing on the README never finds them.
	**Done:** README already carried the host matrix + install commands; added a **Capability** column (full-hook vs pointer-only) with a legend, folded in the Hermes row, and pointed prompt-menu-only hosts to the `rig-mcp` server.
- [x] **RIG-121 — Refresh drifted wiki specs to match shipped reality**
	**Status:** RESOLVED — landed · [Solution](tickets/RIG-121.md)
	**Problem:** Per CLAUDE.md a drifted wiki is a defect. `specs/lint-format-roadmap.md` still says "Still placeholders. 428 `TODO(Slice 10)` files remain," but zero such files exist and delivery-plan step 5 records "805 files, zero placeholders." `specs/product-spec.md`'s gap table lists items already resolved (e.g. `publish.yml` — now deleted; the `main`-vs-`master` branch gate — test.yml now runs on `branches: ['**']`).
	**Done:** Corrected the placeholder-count row (dated superseded note → delivery-plan step 5); struck the resolved `publish.yml`, `main`/`master`, and R3 gap rows with dated Resolved annotations; fixed the `RIG_REPO` stub default.




%% kanban:settings
```
{"kanban-plugin":"board","new-line-trigger":"shift-enter","show-checkboxes":false,"hide-card-count":false,"list-collapse":[true,true,true,true,false,false,false,true]}
```
%%
