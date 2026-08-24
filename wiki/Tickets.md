---

kanban-plugin: board

---

## Backlog



## Solution Discovery



## Acceptance Criteria & Testing



## Request for Signing



## Coding

- [ ] **RIG-107 — Wire the advanced runtime into a real install/run entrypoint**
	**Status:** Designed — implementation-ready (core blocker) · [Solution](tickets/RIG-107.md)
	**Problem:** `rig/materialize.js` orchestrates the entire à-la-carte engine (`inspect`, `recommend`, `plan`, `apply`, `remediate`, `check`, `policy`, `uninstall`) via `cli-advanced.js`, which pulls in `policy`, `lifecycle`, `apply`, `plan`, `secret-history`, `lint-format`, and more. But nothing invokes it: `bootstrap.sh` and `install.sh` only run `rig/lib/payload.js` (the static markdown copy). `materialize.js` is installed as an inert file (`.rig/runtime/rig/materialize.js`, `active_delivery` gate) with no wrapper, bin, or documented command. The 2026-08-22 fresh review confirmed all ten oracle modules have no production caller — a customer cannot actually reach the catalogue/policy/safety runtime the project's core promise is built on.
	**Acceptance:**
	- A supported, documented entrypoint (installed CLI/bin or `bootstrap.sh --with-runtime` sub-command) drives `materialize.js` end to end on a real repository.
	- Onboarding surfaces the runtime path so a stranger can run inspect → recommend → plan → apply without reading source.
	- A regression installs with runtime and successfully executes at least one catalogue leaf (e.g. lint-format) through the shipping entrypoint, not by direct `require`.
- [ ] **RIG-108 — Resolve the four zero-caller runtime modules (wire or delete)**
	**Status:** Designed — one ticket claim now stale; wire/delete decision · [Solution](tickets/RIG-108.md)
	**Problem:** `rig/lib/enforcement.js`, `graft.js`, `release-evidence.js`, and `git-dispatch.js` are required by nothing in `rig/` outside their own oracle tests — not even by `cli-advanced.js`. They are either unwired features (graft mechanics, enforcement, release evidence, git dispatch are all named product capabilities) or dead code kept green only by the oracle's direct-`require` binding.
	**Note:** Verified 2026-08-24 — `release-evidence.js` *does* have a caller (`scripts/review-receipt.js`); the other three are genuinely zero-caller. See solution.
	**Acceptance:**
	- Each of the four modules is either connected to a shipping code path (with a test that reaches it through that path) or removed with its now-orphaned oracle cases retired under the owner's re-sign.
	- No `rig/lib/*.js` module remains that is exercised only by a direct-`require` oracle test with no production caller.
- [ ] **RIG-109 — Test the runtime through its shipping path, not by direct `require`**
	**Status:** Designed — blocked on RIG-107 entrypoint · [Solution](tickets/RIG-109.md)
	**Problem:** The signed oracle binds behavior with `require(file)[name]`, so 68/68 green is (per testing-strategy topic) "behavior at a seam the product does not use." Even correct modules aren't proven reachable.
	**Acceptance:**
	- At least one end-to-end test invokes the installed entrypoint (RIG-107) and asserts the runtime behavior, complementing the direct-require oracle.
	- The wiki's testing-strategy "green oracle is not evidence the product works" caveat is closed by that coverage.
- [ ] **RIG-110 — Prove first-wire + live-hook contracts for every supported host**
	**Status:** Designed — tiered verification program; conflict dispositions draftable now · [Solution](tickets/RIG-110.md)
	**Problem:** host-coverage-spec §1 marks "exact per-host live-hook contracts," "complete evidence bundle per host/CI axis," and "successful first wire per executable host/CI axis" as *Pending for every executable candidate*. §3.1 still carries unresolved conflicts: codewhale skills/MCP path (`~/.deepseek/` vs `./.codewhale/`), hermes repo-scope ("unclear"), swival's lack of an edit-time gate, and the Antigravity-CLI issue #60 (project-local MCP silently ignored) plus the community-only `trigger: always_on` key. Host serviceability is asserted as candidates, not verified.
	**Acceptance:**
	- Each of the 19 researched hosts + 6 CI providers has an exact live-hook/instruction/skills/MCP contract with a byte-landing test and at least one real first-wire verification (or is explicitly recorded as pointer-only/unsupported).
	- The §3.1 ❔/🟡 conflicts (codewhale, hermes, swival, antigravity CLI) are each resolved to a decided disposition in the wiki.
- [ ] **RIG-111 — Define exact user-global MCP contracts + byte-landing tests**
	**Status:** Designed — implementation-ready · [Solution](tickets/RIG-111.md)
	**Problem:** user-global-writes topic states "the host registry still needs exact contracts for every axis whose MCP or other configuration is user-global." That covers windsurf/Devin Desktop, cline, hermes, and codewhale, where Rig writes outside the repo (`~/.codeium/…`, cline_mcp_settings, `~/.hermes/…`, `~/.deepseek/…`). No exact merge/preservation contract or landing test exists for these.
	**Acceptance:**
	- Each user-global axis has a documented merge-and-preserve contract, an idempotent writer, and a byte-landing test that leaves unrelated user config intact.
	- Uninstall removes only Rig-attributed user-global entries, verified by test.
- [ ] **RIG-112 — Freeze and implement the catalogue contract + authored-service gate**
	**Status:** Designed — mechanical gate already exists/green; freeze needs re-sign · [Solution](tickets/RIG-112.md)
	**Problem:** catalogue-contract topic: the contract is "designed but not frozen or implemented," and the authored-service gate "must later prove that mechanically valid leaves also carry real, service-specific meaning." All 115 leaves are authored at Policy grade, but nothing yet proves a leaf's policy/checks are genuinely service-specific rather than well-formed boilerplate.
	**Acceptance:**
	- The catalogue contract is frozen and enforced in code; a leaf that is mechanically valid but generic (no repository binding / no service-specific check) fails the authored-service gate as a coverage gap.
	- The gate runs in CI over all 115 leaves.
- [ ] **RIG-113 — Bound the lint-format setup/replacement (hybrid-plus) contract**
	**Status:** Designed — decision rule proposed; needs owner sign-off on "better" · [Solution](tickets/RIG-113.md)
	**Problem:** catalogue-contract topic leaves open the "hybrid-plus" promise: Rig preserves/adapts to the repo's toolchain, may offer one if none exists, and may propose a "better supported alternative" — but "the exact meaning of 'better' and the generated setup contract still need to be bounded in the lint-format grilling."
	**Acceptance:**
	- "Better alternative" has a defined, testable decision rule; a proposed setup/replacement never lands without an explicit user decision.
	- The generated-setup contract (files, scope, approval) is specified and covered by acceptance cases.
- [ ] **RIG-114 — Replace fixed npm-script discovery with whole-repo semantic discovery**
	**Status:** Designed — implementation-ready (bounded engineering) · [Solution](tickets/RIG-114.md)
	**Problem:** lint-format-roadmap: check discovery is "prototype implemented" across `catalog.js`, `plan.js`, `apply.js`, `checks.js`, `ci-adapters.js`, but "recognizes only fixed npm script names." The production contract requires whole-repository, open-ecosystem, polyglot semantic discovery (manifests, tool config, declared tasks), not a fixed script-name list.
	**Acceptance:**
	- Discovery identifies lint/format capability from component manifests/config/tasks across root, workspaces, nested and polyglot packages, respecting each component's ignore rules and working directory.
	- Ambiguous bindings require a user choice; unbuildable components are named as unprotected exclusions and suppress any whole-repository support claim.
- [ ] **RIG-115 — Author lint-format acceptance for applicability, execution consent, and shell trust**
	**Status:** Designed — cases draftable now; landing re-signs Gate 1 · [Solution](tickets/RIG-115.md)
	**Problem:** lint-format-roadmap marks three contracts "intent frozen, acceptance not yet authored": partial-install applicability, execution consent (selection authorizes nothing to run; plan approval authorizes only listed read-only commands; fixes need separate approval), and shell trust (repository tasks stay untrusted under policy/privilege/secret/network/resource limits even with `shell: false`).
	**Acceptance:**
	- Deterministic acceptance cases exist and pass for each of the three contracts, added under the owner's re-sign.
	- A leaf task that attempts a mutation under a read-only approval, or escapes the argv boundary, fails visibly.
- [ ] **RIG-116 — Promote the non-lint-format leaves Policy → Context → Evidence**
	**Status:** Designed — phased post-beta plan · [Solution](tickets/RIG-116.md)
	**Problem:** delivery-plan step 8: lint-format is the only leaf built past Policy grade; the other 114 leaves are Policy-only and their Context/Evidence promotion is deferred to post-beta. A "full-fledged" catalogue delivers higher-grade assurance across families, not one vertical.
	**Acceptance:**
	- A prioritized, family-batched plan promotes leaves beyond Policy on evidence of use, each under the ordinary gate.
	- At least the highest-demand families reach Context/Evidence with real verifiable checks.
- [ ] **RIG-105 — Automate Antigravity MCP wiring or make the manual step first-class**
	**Status:** DECIDED (2026-08-24) — owner approved: surface manual step + verification, not auto-write. Implementation-ready. · [Solution](tickets/RIG-105.md)
	**Problem:** `antigravity-plugin/mcp_config.json` ships `{"mcpServers": {}}` with a comment telling users to hand-copy entries into `~/.gemini/config/mcp_config.json`. Antigravity users get no automated MCP wiring today (documented as Tier B / PD-open-4).
	**Acceptance:**
	- Onboarding surfaces the manual step with exact copy-paste content plus a verification check (`rig check --host antigravity`).
	- The chosen behavior is a recorded wiki decision that supersedes the bare "template only" placeholder.
- [ ] **RIG-119 — Incorporate spec-driven development into the Rig pipeline**
	**Status:** DECIDED (2026-08-24) — owner approved: fold into grilling/product-design, no new skill. Implementation-ready. · [Solution](tickets/RIG-119.md)
	**Problem:** The spec toolkit's five-phase "turn vague intent into a precise, executable spec" flow overlaps Rig's `rig-grilling` → `rig-product-design` → gate pipeline but isn't offered as a first-class Rig capability.
	**Acceptance:**
	- The routing table and skill index reference the folded-in flow and it has an acceptance case.
- [ ] **RIG-122 — (Low priority / deferred) Offer the wiki-knowledge system as a Rig tool family**
	**Status:** DECIDED (2026-08-24) — owner approved: ship as optional markdown-only graft, post-release. Still gated behind RIG-107/RIG-120. · [Solution](tickets/RIG-122.md)
	**Problem:** Rig's own development runs on an Obsidian-based wiki — topic hubs, indexes, reasoning traces, and this Kanban board — which is currently internal only, not offered to the repos Rig installs into.
	**Acceptance:**
	- Any shipped form respects the Tier 1 markdown-only constraint (structure + conventions as markdown; no installed runtime, sync engine, or required third-party app).
	- If it depends on Obsidian/Kanban specifically, that dependency is optional and the structure degrades to plain markdown without it.


## Ready for Commit

- [x] **RIG-101 — Wire the `rig-mcp` server into host distribution**
	**Status:** Implemented (2026-08-24) — doesn't touch the signed oracle, ready to commit/push · [Solution](tickets/RIG-101.md)
	**Landed:** `opencode.json` registers `rig-mcp` (`mcp.rig`), verified by `tests/opencode-mcp.test.js`; `rig-mcp/test/stdio.test.js` spawns the real server over stdio and checks all three modes; `docs/agent-portability.md` documents copy-paste config for every host key shape; exclusions (`pi`, `generic`, user-global-only hosts) recorded in `host-coverage-spec §3.2.1`.
- [x] **RIG-106 — Propagate Rig mode to subagents on every host that supports them**
	**Status:** Resolved (2026-08-24) — doesn't touch the signed oracle, ready to commit/push · [Solution](tickets/RIG-106.md)
	**Landed:** Researched all 19 hosts against vendor docs for a subagent hook that can inject context (host-coverage-spec §3.1a). Wired the ticket's named gap — Copilot/Copilot CLI's `subagentStart` — into `hooks/copilot-hooks.json` + `hooks/rig-runtime.js`, verified by new cases in `tests/hooks.test.js` (caveat: never fires for Copilot's built-in `general-purpose` agent, only named/custom agents — vendor limitation, not a Rig gap). Every other host recorded N/A with a distinct evidenced reason (gate/observer-only hook — cursor, codewhale, hermes; no subagent-scoped event; plugin-only or SDK-only mechanism; or no hooks at all). Corrected post-review 2026-08-24: hermes moved from "no mechanism" to observer-only, pi's "no mechanism" softened to "no native mechanism," kiro resolved from unresolved to N/A (session-scoped payload).
- [x] **RIG-103 — Stop emitting MCP config for hosts that don't support it (pi contradiction)**
	**Status:** Resolved (2026-08-24) — landed as the first slice of RIG-104, doesn't touch the signed oracle, ready to commit/push · [Solution](tickets/RIG-103.md)
	**Landed:** `pi` removed from the MCP auto-write set and its renderer deleted; selecting `pi` now emits no `.omp/mcp.json`, and a pre-existing user-owned file is preserved byte-for-byte with migration guidance (AT-HOST-5), covered end-to-end for the legacy path the frozen catalogue-only oracle test didn't reach. The shared disposition map is `rig/lib/mcp-hosts.js` (RIG-104).
- [x] **RIG-104 — Unify the legacy `renderers.js` MCP path with the catalogue materializer**
	**Status:** Resolved (2026-08-24) — doesn't touch the signed oracle, ready to commit/push · [Solution](tickets/RIG-104.md)
	**Landed:** New `rig/lib/mcp-hosts.js` is the single disposition/file/key table (from `host-capabilities.js` research, with two named documented overrides) driving both the legacy Basic path and the catalogue descriptor path. One shared `mergeMcpEntry` writer replaces 12 near-duplicate per-host JSON mutators, proven idempotent and unrelated-entry-preserving per shape by new `tests/basic-mcp-merge.test.js`. Network-capable MCP entries are evaluated through the same policy engine as shell/web, with a parity test. Two real path/shape divergences between the two paths (pi, OpenClaw) were found and reconciled. `copilot-cli` — cited, non-conflicted `mcp: 'repo'` host — got a renderer too, closing the last serviceability gap among researched hosts (only the §3.1 unresolved-conflict/user-global/unsupported hosts remain note-only). Full gate green.


## Blocked

- [ ] **RIG-102 — Run the `rig-mcp` test suite in the CI gate**
	**Status:** BLOCKED — change ready; landing needs owner re-sign of the signed oracle · [Solution](tickets/RIG-102.md)
	**Problem:** `npm test` → `test:code` runs the root Node suite and `npm test --prefix pi-extension`, but never `npm test --prefix rig-mcp`. `rig-mcp/test/instructions.test.js` exists yet never gates a push, so the MCP server (and its shared instruction contract with the hooks) can regress undetected.
	**Note:** `package.json` scripts are inside the signed Gate 1 oracle (`wiki/gate1/package-scripts.json`), so the one-line change can only land via the owner's re-signing ceremony. Acceptance bullet 3 (`check-versions.js` covers `rig-mcp/package.json`) is already met.
	**Acceptance:**
	- `test:code` (and therefore `npm test` and `.github/workflows/test.yml`) runs the rig-mcp tests.
	- A deliberately broken rig-mcp change fails `npm test`.
	- `scripts/check-versions.js` covers `rig-mcp/package.json` (currently `5.0.0`) alongside the other package versions.
- [ ] **RIG-120 — Finish the release ceremony and cut v5.0.0**
	**Status:** BLOCKED — owner action only (signing keys); branch gate is green · [Solution](tickets/RIG-120.md)
	**Problem:** status.md: the release is blocked on owner-controlled inputs — a fresh independent review receipt bound to the exact PR worktree, the intent owner's signer-class attestation on the frozen Gate 1 signer file, and the explicit `v5.0.0` tag/publish (never an implicit side effect). Until these land there is no installable release, only a source checkout.
	**Acceptance:**
	- A fresh independent review receipt is produced against the exact PR worktree and passes.
	- The signer-class attestation is added via an owner-authorized re-signing ceremony.
	- The full gate is rerun green on the final bytes and `v5.0.0` is cut and published.


## Done

- [x] **RIG-102 — Run the `rig-mcp` test suite in the CI gate**
	**Status:** RESOLVED — landed via owner re-signing ceremony · [Solution](tickets/RIG-102.md)
	**Problem:** `npm test` → `test:code` ran the root Node suite and `npm test --prefix pi-extension`, but never `npm test --prefix rig-mcp`, so the MCP server's shared instruction contract could regress undetected.
	**Done:** Added `&& npm test --prefix rig-mcp` to `test:code` in `package.json`, mirrored in the signed `wiki/gate1/package-scripts.json`, owner re-signed Gate 1 (`node scripts/approve-gate1.js`, fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`). Full gate green: root 380/380, pi-extension 15/15, rig-mcp 3/3.
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