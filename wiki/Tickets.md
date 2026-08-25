---

kanban-plugin: board

---

## Backlog

- [ ] **RIG-104 — Unify the legacy `renderers.js` MCP path with the catalogue materializer**
	**Status:** BACKLOG (2026-08-25) — moved from Done by [[RIG-131]]; no current test proves both install paths read `MCP_HOSTS` · [Solution](tickets/RIG-104.md)
	**Reason:** The shared merge writer is real, but `materializeSelectedHosts` still reads `REGISTRY` directly and never applies `AUTO_WRITE_OVERRIDE` / `FILE_OVERRIDE` / `LEGACY_FILE`. Re-verify under [[RIG-128]] / [[RIG-134]] after the catalogue path uses the same authority.
- [ ] **RIG-105 — Automate Antigravity MCP wiring or make the manual step first-class**
	**Status:** BACKLOG (2026-08-25) — moved from Done by [[RIG-131]]; the staged `--with-runtime` path never renders the manual step · [Solution](tickets/RIG-105.md)
	**Reason:** `tests/antigravity-manual-mcp.test.js` covers the legacy Basic path (`materialize.js`), not the staged apply flow a real user follows. Tracked as 126.2 on [[RIG-126]].
- [ ] **RIG-107 — Wire the advanced runtime into a real install/run entrypoint**
	**Status:** BACKLOG (2026-08-25) — moved from Done by [[RIG-131]]; printed inspect→recommend→plan→apply→check sequence is not runnable · [Solution](tickets/RIG-107.md)
	**Reason:** Printed commands require `review.json` / `rig.json` / `approval.json` that no printed step produces, and "host review" is not a subcommand. Tracked as 126.1 on [[RIG-126]].
- [ ] **RIG-132 — One authority per semantic fact: collapse the duplicate inventory, generate the projections**
	**Status:** OPEN (2026-08-25) — raised by the git-trace investigation; awaiting owner approve-for-Coding · [Solution](tickets/RIG-132.md)
	**Class:** STRUCTURAL (the exponent). Every finding ever received is pairwise ("§X says A, §Y says B"). The spec has ~124 claim anchors → **~7,600 pairs**; a pass reports 2–8, so six rounds covered ~0.4%. Receipt anchors prove it: §8.4 recurs in rounds 3 and 5, §5.7/§8.9/§11.3 in 4 and 5, §13 four times in round 5 and again in 6 — same section, different partner each time. 60 tracked files have a byte-identical twin; the project's answer to duplication has always been "add a guard" (O(1) per pair) against an O(N²) pool. Fix: one home per fact, generated everywhere else; new duplication ships with its generator or doesn't ship. **Do before [[RIG-125]]** — property tests over a collapsed N are near-exhaustive; over today's N they're another sample. Analysis: [why each pass finds new issues](reasoning/2026-08-25-why-each-pass-finds-new-issues.md). **Goal re-stated 2026-08-25 after the outside analysis:** "one home per fact" is *not* sufficient — `REGISTRY` already is a single source of truth and `materializeSelectedHosts` still diverged from `mcp-hosts.js` by re-interpreting the raw rows. The goal is one authority for the **meaning**, with runtime/docs/tests as generated projections through one narrow contract (semantic model + narrow waist + fitness functions — established terms, see [assessment](reasoning/2026-08-25-semantic-model-assessment.md)). Takes **two** fitness functions, not seven, and does not name the architecture. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-133 — The signature freezes 68 samples; it should freeze the properties and a case generator**
	**Status:** OPEN (2026-08-25) — raised by the "escaping the quadratic" investigation; awaiting owner approve-for-Coding · [Solution](tickets/RIG-133.md)
	**Class:** STRUCTURAL (coverage cap). `wiki/gate1/testing-infrastructure.manifest` byte-pins `tests/advanced-oracle.test.js` — an **enumerated list of 68 samples**, 63 at the direct-require seam. Pinning an enumeration caps the checked surface at sign time while `rig/lib` grows, charges a re-sign ceremony for every coverage increase (3 in 20 commits), and is why round 2 recorded *"I cannot edit that test file without invalidating the owner's signature."* Fix: sign the **properties + the case generator** (cases derived from `REGISTRY`), so adding a host extends coverage with no signed byte changed. Costs **one** re-sign — share [[RIG-120]]'s. Analysis: [escaping the quadratic](reasoning/2026-08-25-escaping-the-quadratic.md). **Moves ahead of RIG-125:** collapse the space (132), make signed coverage grow *with* it (133), then write composition properties into a signing scheme that can hold them. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-130 — The review loop has no memory, so convergence is unmeasurable**
	**Status:** OPEN (2026-08-25) — raised by the structural root-cause investigation; awaiting owner approve-for-Coding · [Solution](tickets/RIG-130.md)
	**Class:** STRUCTURAL (loop generator). Every review round is an independent draw: `review-receipt.js` carries no record of what prior rounds found or which classes are closed. Seven receipts, all `fail`, counts never fall (round 5 is the worst, after four rounds of correct fixes). Fix: append-only finding-class ledger, closed-class feed-in to the next reviewer prompt, and a findings-in-closed-classes convergence metric that becomes the release stopping rule. Cheap; do with [[RIG-131]] alongside [[RIG-132]] and **before** RIG-125, so RIG-125's result is measurable. Analysis: [root cause](reasoning/2026-08-25-structural-nondeterminism-root-cause.md). **Relabelled 2026-08-25:** this measures a *confidence criterion*, not the definition of done — completion is the conjunction of the structural conditions; two clean rounds is corroboration on top. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-125 — Structural: parallel sources of truth + no equivalence test keep re-opening "Done" work**
	**Status:** OPEN (2026-08-25) — branch review + round-3 receipt major; awaiting owner approve-for-Coding · [Solution](tickets/RIG-125.md)
	**Class:** STRUCTURAL (loop generator). Receipt re-confirmed: split MCP tables, two uninstallers, no inspect→apply→uninstall roundtrip. Loop-breaker: one MCP-disposition authority + equivalence test; one uninstall authority; real install→uninstall roundtrip; printed bootstrap sequence to a green check — landed **inside the signed oracle** under RIG-120's re-sign, not beside it. Do [[RIG-132]] (collapse N) + [[RIG-130]]/[[RIG-131]] first, then this, then 126/127. Map: [round-3 finding map](reasoning/2026-08-25-rig120-round3-finding-map.md).
## Solution Discovery



## Acceptance Criteria & Testing



## Request for Signing



## Coding

- [ ] **RIG-134 — Pre-v5 release gate: classify every known finding as debt or v5-observable**
	**Status:** APPROVED — CODING (2026-08-25) — Option A; classification run, drives the observable fixes across 126/127/128/129 · [Solution](tickets/RIG-134.md) · [Runbook](reasoning/2026-08-25-prev5-gate-runbook-and-classification.md)
	**Class:** RELEASE GATE. The gate umbrella. Classification is **done** (see the runbook): **v5-observable (must-fix):** 134.1 (`contractFor`, covers 128.1/128.2 + shipped descriptor of 128.3), 128.4/128.5, uninstall 127.1–127.8/127.10, onboarding 126.1–126.4, 129.1. **debt (defer to v5.1 inventory):** 134.2, 134.3, 128.3 internal, 128.6, 126.5, 129.2–129.4. 134.1 is the one confirmed release blocker: `rig apply` (printed by `bootstrap.sh:131`) → `applyPlan`:197 → `materializeHostAdapters`:435 → `contractFor` writes `.rig/host-contracts/<host>/<axis>.json` into the user's repo from raw `REGISTRY`, so descriptors contradict the write path. Bounded leaf fix, **not** the collapse. The low model executes the observable set via the runbook's ordered task list; the debt set is committed as the v5.1 migration inventory ([[RIG-132]]).
- [ ] **RIG-126 — Onboarding is not runnable end-to-end**
	**Status:** APPROVED — CODING (2026-08-25) — pre-v5 observable scope only: 126.1–126.4; 126.5 remains debt · [Solution](tickets/RIG-126.md) · [Runbook](reasoning/2026-08-25-prev5-gate-runbook-and-classification.md)
	**Class:** DELIVERABILITY. The staged commands now have named red tests for generated review, explicit selection, manual Antigravity setup, and an observable successful check. A real host-native or external approval remains mandatory; tests use only the isolated fixture receipt.
- [ ] **RIG-127 — Uninstall does not cleanly reverse an install (orphan cluster)**
	**Status:** APPROVED — CODING (2026-08-25) — pre-v5 observable scope: 127.1–127.8 and 127.10; 127.9 remains fixed · [Solution](tickets/RIG-127.md) · [Runbook](reasoning/2026-08-25-prev5-gate-runbook-and-classification.md)
	**Class:** DELIVERABILITY. Public uninstall, retained journals, purge cleanup, corrupt-ledger refusal, empty-file cleanup, and independent local removal are covered by committed red tests.
- [ ] **RIG-128 — MCP delivery: emitted contracts misdescribe reality + repo merge writer clobbers files**
	**Status:** APPROVED — CODING (2026-08-25) — pre-v5 observable scope: descriptor parity plus 128.4/128.5; 128.3 internal and 128.6 remain debt · [Solution](tickets/RIG-128.md) · [Runbook](reasoning/2026-08-25-prev5-gate-runbook-and-classification.md)
	**Class:** DELIVERABILITY. The red suite covers descriptor parity, invalid-file preservation, JSON5 no-clobber behavior, primitive-path rejection, and idempotent valid merges.
- [ ] **RIG-129 — Host-capability citation & claim-accuracy audit**
	**Status:** APPROVED — CODING (2026-08-25) — pre-v5 observable scope: 129.1 only; 129.2–129.4 remain debt · [Solution](tickets/RIG-129.md) · [Runbook](reasoning/2026-08-25-prev5-gate-runbook-and-classification.md)
	**Class:** DOCUMENTATION/EVIDENCE. The red claim-integrity suite requires pi guidance to name the extension path without claiming that MCP is unsupported or creating a configuration Rig cannot safely manage.


## Ready for Commit

- [ ] **RIG-131 — "Done" is agent prose, not a named green test**
	**Status:** READY FOR COMMIT (2026-08-25) — Option A checker landed; RIG-104/105/107 returned to Backlog · [Solution](tickets/RIG-131.md)
	**Done:** `scripts/check-ticket-traceability.js` is wired into `test:code` before the Node glob. Completed-column cards must name `tests/<file>.test.js::<title>` or `manual:`; missing, invented, or renamed titles fail the gate. Named green tests: `tests/ticket-traceability.test.js` (six cases).
- [ ] **RIG-124 — Stop the Rig dev loop from burning the token budget**
	**Status:** READY FOR COMMIT (2026-08-25) — implemented, not yet committed · [Solution](tickets/RIG-124.md)
	**Done:** `review-receipt.js` enforces a one-re-review cap per author-context itself, gains a cheap-model `--interim` mode that never writes the binding receipt, and stays release-only; `rig-tdd`'s inner loop is `npm run test:rig`/a single test file with the full gate once before push; `routing.md`/`CLAUDE.md` add a lightweight path for single-step, single-file, non-wiki-truth-changing tasks. No re-sign needed (neither touched file is in the Gate 1 manifest). Full gate green: 434 root / 15 pi-extension / 6 rig-mcp.


## Blocked

- [ ] **RIG-122 — (Low priority / deferred) Offer the wiki-knowledge system as a Rig tool family**
	**Status:** BLOCKED (2026-08-24) — approved post-release work; RIG-120 and publication are incomplete · [Solution](tickets/RIG-122.md)
	**Blocker:** The owner approved this only after the core release. [[RIG-120]] still has no passing independent review (round-3 receipt failed on the 125–127 cluster). Resume after RIG-120 is Done and the release exists.
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
	**Status:** BLOCKED (2026-08-25) — round-2 defects fixed, gate green 438/15/6; round-3 receipt failed on the RIG-125/126/127 cluster; owner must choose scope before another receipt · [Solution](tickets/RIG-120.md)
	**Problem:** status.md: the release is blocked on owner-controlled inputs — a fresh independent review receipt bound to the exact PR worktree, the intent owner's signer-class attestation on the frozen Gate 1 signer file, and the explicit `v5.0.0` tag/publish (never an implicit side effect). Until these land there is no installable release, only a source checkout.
	**Acceptance:**
	- A fresh independent review receipt is produced against the exact PR worktree and passes.
	- The signer-class attestation is added via an owner-authorized re-signing ceremony.
	- The full gate is rerun green on the final bytes and `v5.0.0` is cut and published.


## Done

- [x] **RIG-123 — Implement the OpenClaw global MCP opt-in**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-123.md)
	**Done:** The explicit installer flag warns about the global JSON5 file and all-workspace effect, installs the locked `rig-mcp` runtime, registers through `openclaw mcp set`, attributes the server key in `.rig/global-writes.json`, and unsets before runtime deletion. Failed unregister retains the runtime and ledger entry.
- [x] **RIG-119 — Incorporate spec-driven development into the Rig pipeline**
	**Status:** COMMITTED (2026-08-24) — landed on this branch · [Solution](tickets/RIG-119.md)
	**Done:** Spec-driven requests now route through the existing grilling and product-design owners. Grilling names the five executable-spec checkpoints, product design owns code-grounded technical interrogation, and an acceptance case enforces the route and synchronized native-host copies without adding a new skill.
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
- [x] **RIG-101 — Wire the `rig-mcp` server into host distribution**
	**Status:** Implemented (2026-08-24) — committed on this branch · [Solution](tickets/RIG-101.md)
	**Done:** `opencode.json` registers `rig-mcp` (`mcp.rig`), verified by `tests/opencode-mcp.test.js`; `rig-mcp/test/stdio.test.js` spawns the real server over stdio and checks all three modes; `docs/agent-portability.md` documents copy-paste config for every host key shape; exclusions (`pi`, `generic`, user-global-only hosts) recorded in `host-coverage-spec §3.2.1`.
- [x] **RIG-106 — Propagate Rig mode to subagents on every host that supports them**
	**Status:** Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-106.md)
	**Done:** Researched all 19 hosts against vendor docs for a subagent hook that can inject context (host-coverage-spec §3.1a). Wired the ticket's named gap — Copilot/Copilot CLI's `subagentStart` — into `hooks/copilot-hooks.json` + `hooks/rig-runtime.js`, verified by new cases in `tests/hooks.test.js` (caveat: never fires for Copilot's built-in `general-purpose` agent, only named/custom agents — vendor limitation, not a Rig gap). Every other host recorded N/A with a distinct evidenced reason (gate/observer-only hook — cursor, codewhale, hermes; no subagent-scoped event; plugin-only or SDK-only mechanism; or no hooks at all). Corrected post-review 2026-08-24: hermes moved from "no mechanism" to observer-only, pi's "no mechanism" softened to "no native mechanism," kiro resolved from unresolved to N/A (session-scoped payload).
- [x] **RIG-103 — Stop emitting MCP config for hosts that don't support it (pi contradiction)**
	**Status:** Resolved (2026-08-24) — committed on this branch · [Solution](tickets/RIG-103.md)
	**Done:** `pi` removed from the MCP auto-write set and its renderer deleted; selecting `pi` now emits no `.omp/mcp.json`, and a pre-existing user-owned file is preserved byte-for-byte with migration guidance (AT-HOST-5), covered end-to-end for the legacy path the frozen catalogue-only oracle test didn't reach. The shared disposition map is `rig/lib/mcp-hosts.js` (RIG-104).
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
{"kanban-plugin":"board","new-line-trigger":"shift-enter","show-checkboxes":false,"hide-card-count":false,"list-collapse":[false,false,false,false,false,false,false,true]}
```
%%
