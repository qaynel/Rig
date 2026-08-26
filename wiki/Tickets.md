---

kanban-plugin: board

---

## Backlog

- [ ] **RIG-132 — One authority per semantic fact: collapse the duplicate inventory, generate the projections**
	**Status:** OPEN (2026-08-25) — GitHub #41 — raised by the git-trace investigation; awaiting owner approve-for-Coding · [Solution](tickets/RIG-132.md)
	**Class:** STRUCTURAL (the exponent). Every finding ever received is pairwise ("§X says A, §Y says B"). The spec has ~124 claim anchors → **~7,600 pairs**; a pass reports 2–8, so six rounds covered ~0.4%. Receipt anchors prove it: §8.4 recurs in rounds 3 and 5, §5.7/§8.9/§11.3 in 4 and 5, §13 four times in round 5 and again in 6 — same section, different partner each time. 60 tracked files have a byte-identical twin; the project's answer to duplication has always been "add a guard" (O(1) per pair) against an O(N²) pool. Fix: one home per fact, generated everywhere else; new duplication ships with its generator or doesn't ship. **Do before [[RIG-125]]** — property tests over a collapsed N are near-exhaustive; over today's N they're another sample. Analysis: "why each pass finds new issues" *(trace never landed in the repo)*. **Goal re-stated 2026-08-25 after the outside analysis:** "one home per fact" is *not* sufficient — `REGISTRY` already is a single source of truth and `materializeSelectedHosts` still diverged from `mcp-hosts.js` by re-interpreting the raw rows. The goal is one authority for the **meaning**, with runtime/docs/tests as generated projections through one narrow contract (semantic model + narrow waist + fitness functions — established terms, see "semantic model assessment" *(trace never landed in the repo)*). Takes **two** fitness functions, not seven, and does not name the architecture. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-133 — The signature freezes 68 samples; it should freeze the properties and a case generator**
	**Status:** OPEN (2026-08-25) — GitHub #42 — raised by the "escaping the quadratic" investigation; awaiting owner approve-for-Coding · [Solution](tickets/RIG-133.md)
	**Class:** STRUCTURAL (coverage cap). `wiki/gate1/testing-infrastructure.manifest` byte-pins `tests/advanced-oracle.test.js` — an **enumerated list of 68 samples**, 63 at the direct-require seam. Pinning an enumeration caps the checked surface at sign time while `rig/lib` grows, charges a re-sign ceremony for every coverage increase (3 in 20 commits), and is why round 2 recorded *"I cannot edit that test file without invalidating the owner's signature."* Fix: sign the **properties + the case generator** (cases derived from `REGISTRY`), so adding a host extends coverage with no signed byte changed. Costs **one** re-sign — share [[RIG-120]]'s. Analysis: "escaping the quadratic" *(trace never landed in the repo)*. **Moves ahead of RIG-125:** collapse the space (132), make signed coverage grow *with* it (133), then write composition properties into a signing scheme that can hold them. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-130 — The review loop has no memory, so convergence is unmeasurable**
	**Status:** OPEN (2026-08-25) — GitHub #43 — raised by the structural root-cause investigation; awaiting owner approve-for-Coding · [Solution](tickets/RIG-130.md)
	**Class:** STRUCTURAL (loop generator). Every review round is an independent draw: `review-receipt.js` carries no record of what prior rounds found or which classes are closed. Seven receipts, all `fail`, counts never fall (round 5 is the worst, after four rounds of correct fixes). Fix: append-only finding-class ledger, closed-class feed-in to the next reviewer prompt, and a findings-in-closed-classes convergence metric that becomes the release stopping rule. Cheap; do with [[RIG-131]] alongside [[RIG-132]] and **before** RIG-125, so RIG-125's result is measurable. Analysis: "structural nondeterminism root cause" *(trace never landed in the repo)*. **Relabelled 2026-08-25:** this measures a *confidence criterion*, not the definition of done — completion is the conjunction of the structural conditions; two clean rounds is corroboration on top. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-125 — Structural: parallel sources of truth + no equivalence test keep re-opening "Done" work**
	**Status:** OPEN (2026-08-25) — GitHub #44 — branch review + round-3 receipt major; awaiting owner approve-for-Coding · [Solution](tickets/RIG-125.md)
	**Class:** STRUCTURAL (loop generator). Receipt re-confirmed: split MCP tables, two uninstallers, no inspect→apply→uninstall roundtrip. Loop-breaker: one MCP-disposition authority + equivalence test; one uninstall authority; real install→uninstall roundtrip; printed bootstrap sequence to a green check — landed **inside the signed oracle** under RIG-120's re-sign, not beside it. Do [[RIG-132]] (collapse N) + [[RIG-130]]/[[RIG-131]] first, then this, then 126/127. Map: "RIG-120 round-3 finding map" *(trace never landed in the repo)*.
- [ ] **RIG-127.11 — Uninstall hard-crashes on a corrupted legacy global config**
	**Status:** OPEN (2026-08-26) — GitHub #69 — follow-up to closed [[RIG-127]] (#36); found after roundtrip suite went green · [Solution](tickets/RIG-127.md)
	**Class:** DELIVERABILITY / v5-observable. `removeGlobalConfig()` does raw `JSON.parse` with no try/catch; a corrupted global file throws uncaught mid-uninstall. Sibling `removeGlobalMcp` already catches this; no test exercises the path.
- [ ] **RIG-127.12 — Legacy pre-RIG-104 managed-block records over-strip on uninstall**
	**Status:** OPEN (2026-08-26) — GitHub #70 — follow-up to closed [[RIG-127]] (#36); found after roundtrip suite went green · [Solution](tickets/RIG-127.md)
	**Class:** DELIVERABILITY / v5-observable. A nameless managed-block record falls back to a wildcard regex matching any block in the file, not just the owned one. Narrow upgrade path only, but real.
- [ ] **RIG-135 — Implement guaranteed process cleanup for spawned subprocesses**
	**Status:** OPEN (2026-08-26) — GitHub #75 — follow-up from [[RIG-124]] 124.1; general helper, not the narrow `review-receipt.js` fix · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY. When a spawned process is killed, only the tracked parent dies; forked children can be orphaned. RIG-124.1 fixed that for the reviewer launcher only; this ticket is the shared guaranteed-cleanup helper for every spawn site.
- [ ] **RIG-135.1 — Cookie-import Chromium launch orphans a lock on the user's real browser profile**
	**Status:** OPEN (2026-08-26) — GitHub #78 — follow-up from [[RIG-135]] (#75) spawn-site triage; browse-skill owned · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY / v5-observable. Highest priority of the three RIG-135 follow-ups. `rig/catalog/skills/browse/src/cookie-import-browser.ts` (`importCookiesViaCdp`, Windows path) launches headless Chromium against the user's **real** Chrome/Edge profile — required, because v20 ABE keys are path-bound — and cleans up with a bare leader-pid `chromeProc.kill()`. No Windows Job Object, and Bun's `Subprocess#kill()` takes no negative pid. An orphan holds a lock on the user's actual browser, not a scratch one. Owner decision open: build a Windows Job Object primitive with no CI to verify it, or redesign cookie import to avoid an open-ended debug-port session against the real profile.
- [ ] **RIG-135.2 — Browse skill scripts spawn through Bun's API, which RIG-135's helper design can't group-kill**
	**Status:** OPEN (2026-08-26) — GitHub #79 — follow-up from [[RIG-135]] (#75) spawn-site triage; browse-skill owned · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY. `rig/catalog/skills/browse/src/browser-skill-commands.ts` (`spawnSkill`) runs a **caller-authored** script via `Bun.spawn(['bun','run',scriptPath,...])` with a bare `proc.kill()` on timeout. Same orphan shape as the sites RIG-135 already classes as debt, but `Bun.spawn` only calls `setsid()` under `detached: true` and its `kill()` rejects a negative pid — so RIG-135's Node-`ChildProcess`-shaped helper cannot be dropped in unchanged. Owner decision open: route through `node:child_process` (likely cheaper) or build a Bun-native negative-pid `kill(2)`.
- [ ] **RIG-135.3 — Xvfb daemon isn't actually detached despite a comment claiming it is**
	**Status:** OPEN (2026-08-26) — GitHub #80 — follow-up from [[RIG-135]] (#75) spawn-site triage; browse-skill owned · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY (minor). Lowest priority of the three. `rig/catalog/skills/browse/src/xvfb.ts` (`spawnXvfb`) comments that Xvfb is spawned detached with a daemon-independent lifetime, but never passes `detached: true` — `proc.unref()` only drops event-loop keep-alive, not OS session isolation — so a `SIGHUP` to the daemon's session can take Xvfb with it. `cleanupXvfb` signals the direct pid only. The comment/code mismatch is the real finding; Xvfb rarely forks long-lived descendants, so the group-kill gap alone is small blast radius. Owner decision open: make the code match the intended lifetime contract, or drop the misleading comment.
- [ ] **RIG-124 — Stop the Rig dev loop from burning the token budget**
	**Status:** BACKLOG (2026-08-25) — RIG-131: Ready-for-Commit card had no ## Acceptance evidence; not present on origin/prod · [Solution](tickets/RIG-124.md)
- [ ] **RIG-123 — Implement the OpenClaw global MCP opt-in**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-123.md)
	**Done:** The explicit installer flag warns about the global JSON5 file and all-workspace effect, installs the locked `rig-mcp` runtime, registers through `openclaw mcp set`, attributes the server key in `.rig/global-writes.json`, and unsets before runtime deletion. Failed unregister retains the runtime and ledger entry.
- [ ] **RIG-119 — Incorporate spec-driven development into the Rig pipeline**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-119.md)
	**Done:** Spec-driven requests now route through the existing grilling and product-design owners. Grilling names the five executable-spec checkpoints, product design owns code-grounded technical interrogation, and an acceptance case enforces the route and synchronized native-host copies without adding a new skill.
- [ ] **RIG-105 — Automate Antigravity MCP wiring or make the manual step first-class**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-105.md)
	**Done:** Antigravity onboarding emits exact selected-server stdio JSON for manual merge into `~/.gemini/config/mcp_config.json` and an installed verification command. The check accepts semantically equivalent JSON, rejects drift and malformed configuration, and Rig never writes the global file while CLI issue #60 remains open.
- [ ] **RIG-114 — Replace fixed npm-script discovery with whole-repo semantic discovery**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-114.md)
	**Done:** Whole-repository discovery now binds non-standard manifest/task commands and configured polyglot tools with exact argv, cwd, ignore metadata, and source digests. Ambiguity blocks apply for user choice; unbuildable components are named unprotected and suppress the repository-wide support claim.
- [ ] **RIG-111 — Define exact user-global MCP contracts + byte-landing tests**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-111.md)
	**Done:** Exact current contracts and attributed merge/remove writers for Windsurf/Devin Desktop legacy Cascade, Cline IDE, Hermes, and CodeWhale; multi-repository, idempotence, malformed-input, changed-value, forged-ledger, and uninstall coverage. Activation remains note-only behind RIG-110's roster and real-wire gate.
- [ ] **RIG-109 — Test the runtime through its shipping path, not by direct `require`**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-109.md)
	**Done:** Active-runtime bootstrap plans, applies, and checks lint-format through `.rig/bin/rig`; tagged-release inspection, installed commit validation, managed grafting, MCP enforcement, and the review wrapper add shipping-path coverage while the signed direct-require oracle remains intact.
- [ ] **RIG-108 — Resolve the four zero-caller runtime modules (wire or delete)**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-108.md)
	**Done:** All runtime modules now have production callers guarded by a repository-wide caller test. The existing enforcement, release-review, and commit-dispatch seams are proven; catalogue apply now uses managed graft blocks with journaled legacy migration and exact named-block uninstall.
- [ ] **RIG-107 — Wire the advanced runtime into a real install/run entrypoint**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-107.md)
	**Done:** Active-runtime installs journal `.rig/bin/rig`, bootstrap prints a copy-pasteable inspect → recommend → plan → apply → check workflow, and tagged-release plus lint-format regressions exercise the installed command. The tracer also excludes Rig-owned `.rig` packages from customer component discovery.
- [ ] **RIG-101 — Wire the `rig-mcp` server into host distribution**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was Implemented (2026-08-24) — committed on this branch · [Solution](tickets/RIG-101.md)
	**Done:** `opencode.json` registers `rig-mcp` (`mcp.rig`), verified by `tests/opencode-mcp.test.js`; `rig-mcp/test/stdio.test.js` spawns the real server over stdio and checks all three modes; `docs/agent-portability.md` documents copy-paste config for every host key shape; exclusions (`pi`, `generic`, user-global-only hosts) recorded in `host-coverage-spec §3.2.1`.
- [ ] **RIG-106 — Propagate Rig mode to subagents on every host that supports them**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-106.md)
	**Done:** Researched all 19 hosts against vendor docs for a subagent hook that can inject context (host-coverage-spec §3.1a). Wired the ticket's named gap — Copilot/Copilot CLI's `subagentStart` — into `hooks/copilot-hooks.json` + `hooks/rig-runtime.js`, verified by new cases in `tests/hooks.test.js` (caveat: never fires for Copilot's built-in `general-purpose` agent, only named/custom agents — vendor limitation, not a Rig gap). Every other host recorded N/A with a distinct evidenced reason (gate/observer-only hook — cursor, codewhale, hermes; no subagent-scoped event; plugin-only or SDK-only mechanism; or no hooks at all). Corrected post-review 2026-08-24: hermes moved from "no mechanism" to observer-only, pi's "no mechanism" softened to "no native mechanism," kiro resolved from unresolved to N/A (session-scoped payload).
- [ ] **RIG-103 — Stop emitting MCP config for hosts that don't support it (pi contradiction)**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-103.md)
	**Done:** `pi` removed from the MCP auto-write set and its renderer deleted; selecting `pi` now emits no `.omp/mcp.json`, and a pre-existing user-owned file is preserved byte-for-byte with migration guidance (AT-HOST-5), covered end-to-end for the legacy path the frozen catalogue-only oracle test didn't reach. The shared disposition map is `rig/lib/mcp-hosts.js` (RIG-104).
- [ ] **RIG-104 — Unify the legacy `renderers.js` MCP path with the catalogue materializer**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-104.md)
	**Done:** New `rig/lib/mcp-hosts.js` is the single disposition/file/key table (from `host-capabilities.js` research, with two named documented overrides) driving both the legacy Basic path and the catalogue descriptor path. One shared `mergeMcpEntry` writer replaces 12 near-duplicate per-host JSON mutators, proven idempotent and unrelated-entry-preserving per shape by new `tests/basic-mcp-merge.test.js`. Network-capable MCP entries are evaluated through the same policy engine as shell/web, with a parity test. Two real path/shape divergences between the two paths (pi, OpenClaw) were found and reconciled. `copilot-cli` — cited, non-conflicted `mcp: 'repo'` host — got a renderer too, closing the last serviceability gap among researched hosts (only the §3.1 unresolved-conflict/user-global/unsupported hosts remain note-only). Full gate green.
- [ ] **RIG-102 — Run the `rig-mcp` test suite in the CI gate**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was RESOLVED — landed via owner re-signing ceremony · [Solution](tickets/RIG-102.md)
	**Problem:** `npm test` → `test:code` ran the root Node suite and `npm test --prefix pi-extension`, but never `npm test --prefix rig-mcp`, so the MCP server's shared instruction contract could regress undetected.
	**Done:** Added `&& npm test --prefix rig-mcp` to `test:code` in `package.json`, mirrored in the signed `wiki/gate1/package-scripts.json`, owner re-signed the oracle (`node scripts/approve-gate1.js`). The signature verifies and the current rig-mcp suite passes 6/6.
- [ ] **RIG-117 — Fix stale plugin/repo identity across manifests and README**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was RESOLVED — landed + verified · [Solution](tickets/RIG-117.md)
	**Problem:** The remote is now `github.com/qaynel/Rig-v0.1`, but published plugin metadata still points at the old identity: `.codex-plugin/plugin.json`, `.devin-plugin/plugin.json`, and `antigravity-plugin/plugin.json` all set `homepage`/`repository` to `github.com/vaibhav-kodiyan/agentic-harness-demo`, and README/product-spec note lingering ponytail-era naming. Customers install a plugin whose links go to the wrong repo.
	**Done:** Replaced the stale slug with `qaynel/Rig-v0.1` across all manifests, the marketplace entry, openclaw skills, the opencode plugin, and the openclaw generator; added an identity guard to `check-versions.js` that fails on the stale slug. One open naming reconciliation (`qaynel/Rig` vs `qaynel/Rig-v0.1`) flagged for the release — see solution + RIG-120.
- [ ] **RIG-118 — Make the full plugin distribution discoverable from the README**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was RESOLVED — landed · [Solution](tickets/RIG-118.md)
	**Problem:** The richer plugin installs (Claude/Codex/OpenCode/pi/Hermes/Gemini CLI/Copilot CLI/OpenClaw/Devin, with hooks/commands/statusline) are a shipped surface, but the README only documents Tier 1 + Tier 2; the host install commands live only in `docs/agent-portability.md`. A user landing on the README never finds them.
	**Done:** README already carried the host matrix + install commands; added a **Capability** column (full-hook vs pointer-only) with a legend, folded in the Hermes row, and pointed prompt-menu-only hosts to the `rig-mcp` server.
- [ ] **RIG-121 — Refresh drifted wiki specs to match shipped reality**
	**Status:** BACKLOG (2026-08-25) — RIG-131: no ## Acceptance evidence reference · was RESOLVED — landed · [Solution](tickets/RIG-121.md)
	**Problem:** Per CLAUDE.md a drifted wiki is a defect. `specs/lint-format-roadmap.md` still says "Still placeholders. 428 `TODO(Slice 10)` files remain," but zero such files exist and delivery-plan step 5 records "805 files, zero placeholders." `specs/product-spec.md`'s gap table lists items already resolved (e.g. `publish.yml` — now deleted; the `main`-vs-`master` branch gate — test.yml now runs on `branches: ['**']`).
	**Done:** Corrected the placeholder-count row (dated superseded note → delivery-plan step 5); struck the resolved `publish.yml`, `main`/`master`, and R3 gap rows with dated Resolved annotations; fixed the `RIG_REPO` stub default.


## Solution Discovery



## Acceptance Criteria & Testing



## Request for Signing



## Coding



## Ready for Commit



## Blocked

- [ ] **RIG-122 — (Low priority / deferred) Offer the wiki-knowledge system as a Rig tool family**
	**Status:** BLOCKED (2026-08-24) — GitHub #62 — approved post-release work; RIG-120 and publication are incomplete · [Solution](tickets/RIG-122.md)
	**Blocker:** The owner approved this only after the core release. [[RIG-120]] still has no passing independent review receipt on the current bytes. Resume after RIG-120 is Done and the release exists.
	**Acceptance:**
	- Any shipped form respects the Tier 1 markdown-only constraint (structure + conventions as markdown; no installed runtime, sync engine, or required third-party app).
	- If it depends on Obsidian/Kanban specifically, that dependency is optional and the structure degrades to plain markdown without it.
- [ ] **RIG-116 — Promote the non-lint-format leaves Policy → Context → Evidence**
	**Status:** BLOCKED (2026-08-24) — GitHub #63 — post-beta demand evidence and prerequisite gates do not yet exist · [Solution](tickets/RIG-116.md)
	**Blocker:** The governing roadmap requires promotion after beta, ranked by observed use under ordinary owner review. No beta selection/receipt evidence or approved demand ranking exists, the release remains blocked, and the reusable lint-format consent template is blocked. Guessing a family would violate the acceptance criterion.
	**Acceptance:**
	- A prioritized, family-batched plan promotes leaves beyond Policy on evidence of use, each under the ordinary gate.
	- At least the highest-demand families reach Context/Evidence with real verifiable checks.
- [ ] **RIG-115 — Author lint-format acceptance for applicability, execution consent, and shell trust**
	**Status:** BLOCKED (2026-08-24) — GitHub #64 — granular shell-trust policy and owner re-sign required · [Solution](tickets/RIG-115.md)
	**Blocker:** The signed oracle has broad consent, exclusion, mutation, and argv-boundary cases, but the ticket's deterministic draft still marks approval lifetime, filesystem/env isolation, network denial, resource caps, and symlink behavior as assumptions. The owner must approve/correct those guarantees and re-sign the resulting acceptance/tests before implementation can claim them.
	**Acceptance:**
	- Deterministic acceptance cases exist and pass for each of the three contracts, added under the owner's re-sign.
	- A leaf task that attempts a mutation under a read-only approval, or escapes the argv boundary, fails visibly.
- [ ] **RIG-113 — Bound the lint-format setup/replacement (hybrid-plus) contract**
	**Status:** BLOCKED (2026-08-24) — GitHub #65 — owner must approve the drafted ecosystem preferences and choose replacement backup semantics · [Solution](tickets/RIG-113.md)
	**Blocker:** The ranked lists, EOL/coverage signals, proposal rule, and write scopes are drafted, but remain owner product policy; `<file>.rig-backup` is explicitly marked assumed. Acceptance tests and implementation must wait for those choices and the owner re-sign.
	**Acceptance:**
	- "Better alternative" has a defined, testable decision rule; a proposed setup/replacement never lands without an explicit user decision.
	- The generated-setup contract (files, scope, approval) is specified and covered by acceptance cases.
- [ ] **RIG-112 — Freeze and implement the catalogue contract + authored-service gate**
	**Status:** BLOCKED (2026-08-24) — GitHub #66 — 115-leaf mechanical gate is green; D27 defers the owner-only freeze ceremony · [Solution](tickets/RIG-112.md)
	**Blocker:** The signed CI gate already rejects mechanically valid but generic/unbound leaves across exactly 115 services. The remaining acceptance criterion is the catalogue freeze itself, which the owner's D27 ruling explicitly defers until the owner agrees the final solution, acceptance, and tests are sound and re-signs the oracle.
	**Acceptance:**
	- The catalogue contract is frozen and enforced in code; a leaf that is mechanically valid but generic (no repository binding / no service-specific check) fails the authored-service gate as a coverage gap.
	- The gate runs in CI over all 115 leaves.
- [ ] **RIG-110 — Prove first-wire + live-hook contracts for every supported host**
	**Status:** BLOCKED (2026-08-24) — GitHub #67 — needs owner beta-roster decision and access/results for real host/CI wires · [Solution](tickets/RIG-110.md)
	**Blocker:** The governing spec still marks every executable host/CI first wire pending, and no real-wire records exist. Fixture and byte-landing tests cannot satisfy that frozen criterion. Owner must decide which candidates remain executable versus pointer-only/unsupported, then provide access to or dated results from those vendor environments.
	**Acceptance:**
	- Each of the 19 researched hosts + 6 CI providers has an exact live-hook/instruction/skills/MCP contract with a byte-landing test and at least one real first-wire verification (or is explicitly recorded as pointer-only/unsupported).
	- The §3.1 ❔/🟡 conflicts (codewhale, hermes, swival, antigravity CLI) are each resolved to a decided disposition in the wiki.
- [ ] **RIG-120 — Finish the release ceremony and cut v5.0.0**
	**Status:** BLOCKED (2026-08-26) — GitHub #68 — gate green 476/15/6; RIG-126/127/128/129/131/134 Done; round-3 receipt predates those merges; owner must run a fresh receipt · [Solution](tickets/RIG-120.md)
	**Problem:** status.md: the release is blocked on owner-controlled inputs — a fresh independent review receipt bound to the exact PR worktree, the intent owner's signer-class attestation on the frozen Gate 1 signer file, and the explicit `v5.0.0` tag/publish (never an implicit side effect). Until these land there is no installable release, only a source checkout. Follow-ups [[RIG-127]] 127.11/127.12 (#69/#70) remain open but are not gate-red.
	**Acceptance:**
	- A fresh independent review receipt is produced against the exact PR worktree and passes.
	- The signer-class attestation is added via an owner-authorized re-signing ceremony.
	- The full gate is rerun green on the final bytes and `v5.0.0` is cut and published.


## Done

- [ ] **RIG-124.1 — Killed/timed-out reviewer attempt is dropped from the re-review cap instead of counting toward it**
	**Status:** DONE (2026-08-26) — GitHub #73 closed by PR #74; general process-cleanup helper remains [[RIG-135]] (#75) · [Solution](tickets/RIG-124.md)
	**Done:** `tests/release-blockers.test.js::review-receipt counts a killed/timed-out reviewer spawn toward the re-review cap (RIG-124.1)`.
- [ ] **RIG-126 — Onboarding is not runnable end-to-end**
	**Status:** DONE (2026-08-26) — GitHub #35 closed by PR #32; 126.1–126.4; 126.5 remains debt · [Solution](tickets/RIG-126.md)
	**Done:** `tests/runtime-onboarding.test.js::the staged sequence produces review selection plan and a green check`.
- [ ] **RIG-127 — Uninstall does not cleanly reverse an install (orphan cluster)**
	**Status:** DONE (2026-08-26) — GitHub #36 closed by PR #31; 127.1–127.8 and 127.10; 127.11/127.12 filed as #69/#70 · [Solution](tickets/RIG-127.md)
	**Done:** `tests/install-uninstall-roundtrip.test.js::public uninstall reverses a default bootstrap install`.
- [ ] **RIG-128 — MCP delivery: emitted contracts misdescribe reality + repo merge writer clobbers files**
	**Status:** DONE (2026-08-26) — GitHub #37 closed by PR #29; descriptor parity plus 128.4/128.5; 128.3/128.6 remain debt · [Solution](tickets/RIG-128.md)
	**Done:** `tests/host-contract-parity.test.js::every emitted MCP descriptor agrees with the interpreted write contract`.
- [ ] **RIG-129 — Host-capability citation & claim-accuracy audit**
	**Status:** DONE (2026-08-26) — GitHub #38 closed by PR #28; 129.1 only; 129.2–129.4 remain debt · [Solution](tickets/RIG-129.md)
	**Done:** `tests/pi-mcp-claim.test.js::pi MCP guidance names the extension path and never says unsupported`.
- [ ] **RIG-131 — "Done" is agent prose, not a named green test**
	**Status:** DONE (2026-08-26) — GitHub #39 closed by PR #30; checker in the npm test path · [Solution](tickets/RIG-131.md)
	**Done:** `tests/ticket-traceability.test.js::the current board has no unresolved completed-card violation`.
- [ ] **RIG-134 — Pre-v5 release gate: classify every known finding as debt or v5-observable**
	**Status:** DONE (2026-08-26) — GitHub #40 closed by PR #34; Option A observable set green; debt inventory is `rig/raw-registry-access.json` · [Solution](tickets/RIG-134.md)
	**Done:** Classification tagged; 134.1 parity and the v5-observable cluster are proven by `tests/pre-v5-gate.test.js::every v5-observable finding has a green deterministic test` and `tests/host-contract-parity.test.js::every emitted MCP descriptor agrees with the interpreted write contract`.
- [ ] **RIG-124 — Stop the Rig dev loop from burning the token budget**
	**Status:** DONE (2026-08-26) — GitHub #45 closed; RIG-124.1 (#73) fixed by PR #74 · [Solution](tickets/RIG-124.md)
	**Done:** `tests/release-blockers.test.js::review-receipt caps re-review after one retry for the same author-context (RIG-124)`.
- [ ] **RIG-123 — Implement the OpenClaw global MCP opt-in**
	**Status:** DONE (2026-08-26) — GitHub #46 closed · [Solution](tickets/RIG-123.md)
	**Done:** `tests/release-blockers.test.js::shipping OpenClaw bootstrap discloses the configured path before registration`.
- [ ] **RIG-119 — Incorporate spec-driven development into the Rig pipeline**
	**Status:** DONE (2026-08-26) — GitHub #47 closed · [Solution](tickets/RIG-119.md)
	**Done:** `tests/spec-driven-pipeline.test.js::RIG-119 folds spec-driven requests into grilling and product design`.
- [ ] **RIG-105 — Automate Antigravity MCP wiring or make the manual step first-class**
	**Status:** DONE (2026-08-26) — GitHub #48 closed · [Solution](tickets/RIG-105.md)
	**Done:** `tests/runtime-onboarding.test.js::staged antigravity onboarding renders the same manual entry it verifies`.
- [ ] **RIG-114 — Replace fixed npm-script discovery with whole-repo semantic discovery**
	**Status:** DONE (2026-08-26) — GitHub #49 closed · [Solution](tickets/RIG-114.md)
	**Done:** `tests/semantic-lint-format.test.js::semantic binding covers nonstandard tasks, configured tools, ignores, and arbitrary nesting`.
- [ ] **RIG-111 — Define exact user-global MCP contracts + byte-landing tests**
	**Status:** DONE (2026-08-26) — GitHub #50 closed · [Solution](tickets/RIG-111.md)
	**Done:** `tests/global-mcp-writes.test.js::RIG-111 refuses malformed or incompatible global configuration`.
- [ ] **RIG-109 — Test the runtime through its shipping path, not by direct `require`**
	**Status:** DONE (2026-08-26) — GitHub #51 closed · [Solution](tickets/RIG-109.md)
	**Done:** `tests/rig-bootstrap.test.js::Tier 1 --with-runtime installs and surfaces a working catalogue entrypoint`.
- [ ] **RIG-108 — Resolve the four zero-caller runtime modules (wire or delete)**
	**Status:** DONE (2026-08-26) — GitHub #52 closed · [Solution](tickets/RIG-108.md)
	**Done:** `tests/runtime-caller-graph.test.js::every runtime library module has a production caller`.
- [ ] **RIG-107 — Wire the advanced runtime into a real install/run entrypoint**
	**Status:** DONE (2026-08-26) — GitHub #53 closed · [Solution](tickets/RIG-107.md)
	**Done:** `tests/rig-bootstrap.test.js::Tier 1 --with-runtime installs and surfaces a working catalogue entrypoint`.
- [ ] **RIG-101 — Wire the `rig-mcp` server into host distribution**
	**Status:** DONE (2026-08-26) — GitHub #54 closed · [Solution](tickets/RIG-101.md)
	**Done:** `tests/rig-mcp-adapters.test.js::opencode.json registers rig-mcp as a local MCP server`.
- [ ] **RIG-106 — Propagate Rig mode to subagents on every host that supports them**
	**Status:** DONE (2026-08-26) — GitHub #55 closed · [Solution](tickets/RIG-106.md)
	**Done:** `manual: tests/hooks.test.js asserts Copilot subagentStart injection as script-style cases with no node:test titles`.
- [ ] **RIG-103 — Stop emitting MCP config for hosts that don't support it (pi contradiction)**
	**Status:** DONE (2026-08-26) — GitHub #56 closed · [Solution](tickets/RIG-103.md)
	**Done:** `tests/basic-renderers.test.js::AT-HOST-5 (legacy path) pi emits no MCP config and preserves + guides a pre-existing user file`.
- [ ] **RIG-104 — Unify the legacy `renderers.js` MCP path with the catalogue materializer**
	**Status:** DONE (2026-08-26) — GitHub #57 closed · [Solution](tickets/RIG-104.md)
	**Done:** `tests/host-contract-parity.test.js::every emitted MCP descriptor agrees with the interpreted write contract`.
- [ ] **RIG-102 — Run the `rig-mcp` test suite in the CI gate**
	**Status:** DONE (2026-08-26) — GitHub #58 closed · [Solution](tickets/RIG-102.md)
	**Done:** `manual: wired in package.json test:code and the signed wiki/gate1/package-scripts.json`.
- [ ] **RIG-117 — Fix stale plugin/repo identity across manifests and README**
	**Status:** DONE (2026-08-26) — GitHub #59 closed · [Solution](tickets/RIG-117.md)
	**Done:** `manual: identity guard lives in scripts/check-versions.js and runs from npm test`.
- [ ] **RIG-118 — Make the full plugin distribution discoverable from the README**
	**Status:** DONE (2026-08-26) — GitHub #60 closed · [Solution](tickets/RIG-118.md)
	**Done:** `manual: README documentation change; no named test renders the host capability matrix`.
- [ ] **RIG-121 — Refresh drifted wiki specs to match shipped reality**
	**Status:** DONE (2026-08-26) — GitHub #61 closed · [Solution](tickets/RIG-121.md)
	**Done:** `manual: documentation-only refresh of wiki specs; no named test pins those prose rows`.

%% kanban:settings
```
{"kanban-plugin":"board","new-line-trigger":"shift-enter","show-checkboxes":false,"hide-card-count":false,"list-collapse":[false,false,false,false,false,false,false,false]}
```
%%
