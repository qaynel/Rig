---

kanban-plugin: board

---

## Backlog

- [ ] **RIG-145 — runReadOnly batch-aborts the command list on isolation-unavailable where runGrade marks per command**
	**Status:** OPEN (2026-08-29) — GitHub #108 — accepted follow-up from the passing v5.0.0 review; non-blocking · [Solution](tickets/RIG-145.md)
	**Class:** CORRECTNESS / SHELL TRUST (parity). `runReadOnly` (`lint-format.js:696-700`) does a function-level return of `network_isolation_unavailable` on the first ungranted command when no OS isolation is present, skipping every later command — including a `network: true` one that `runGrade`'s per-command check (`:627-628`, inside `.map`) would still run. Same guarantee-sharding pattern as [[RIG-139]]/[[RIG-143]]. Not a safety hole (nothing ungranted runs); a granted command is silently skipped. Neither runner has a non-test caller yet, so latent. Fix touches `runReadOnly`'s single-status return shape — owner call. Secondary nit: that early return omits `changed_paths`.
- [ ] **RIG-146 — Frozen AT-LF-20 proves one-use only via the in-memory flag, never the durable on-disk record**
	**Status:** OPEN (2026-08-29) — GitHub #109 — accepted follow-up from the passing v5.0.0 review; non-blocking; needs an owner re-sign · [Solution](tickets/RIG-146.md)
	**Class:** TEST QUALITY / SHELL TRUST. [[RIG-138]] landed the durable `consumePlanApproval` on-disk record, but `AT-LF-20` (`tests/advanced-oracle.test.js:916-927`) reuses one `approval` object, so the second `executePlan` is rejected by the in-memory `approval.used` guard (`lint-format.js:459`) before the on-disk check (`:483`). `AT-LF-20` would still pass with the whole durable block deleted; the real cross-process case is covered only by non-frozen `AT-PROC-1a`. Fixing `AT-LF-20` edits a byte-pinned oracle file (`7efc231c…`) so it needs a key-holder re-sign — batch with [[RIG-133]]/[[RIG-136]].
- [ ] **RIG-147 — Undeclared-network diagnostic is written to stderr via console.warn on top of the structured result field**
	**Status:** OPEN (2026-08-29) — GitHub #110 — accepted follow-up from the passing v5.0.0 review; non-blocking · [Solution](tickets/RIG-147.md)
	**Class:** ARCHITECTURE / DIAGNOSTIC HYGIENE (minor). `runConfiguredArgv` (`check-runner.js:196-200`) already returns `network_state: 'undeclared'` + `diagnostic` (AD-39 / `GA-38`; `AT-CAP-3` + `AT-PROC-1u` assert it) but also calls `console.warn` — a redundant stderr side channel CI can bury under the checked command's output. Drop the `console.warn`; have the installed CI path route `network_state === 'undeclared'` from the return value into a visible annotation. No spec or oracle change.
- [ ] **RIG-132 — One authority per semantic fact: collapse the duplicate inventory, generate the projections**
	**Status:** OPEN (2026-08-25, re-investigated 2026-08-26) — GitHub #41 — pre-v5 ratchet slice (`rig/raw-registry-access.json` + checker + 5/5 tests) landed alongside RIG-134; v5.1 migration untouched; awaiting owner approve-for-Coding · [Solution](tickets/RIG-132.md)
	**Class:** STRUCTURAL (the exponent). Every finding ever received is pairwise ("§X says A, §Y says B"). The spec has ~124 claim anchors → **~7,600 pairs**; a pass reports 2–8, so six rounds covered ~0.4%. Receipt anchors prove it: §8.4 recurs in rounds 3 and 5, §5.7/§8.9/§11.3 in 4 and 5, §13 four times in round 5 and again in 6 — same section, different partner each time. 60 tracked files have a byte-identical twin; the project's answer to duplication has always been "add a guard" (O(1) per pair) against an O(N²) pool. Fix: one home per fact, generated everywhere else; new duplication ships with its generator or doesn't ship. **Do before [[RIG-125]]** — property tests over a collapsed N are near-exhaustive; over today's N they're another sample. Analysis: [why each pass finds new issues](reasoning/2026-08-25-why-each-pass-finds-new-issues.md). **Goal re-stated 2026-08-25 after the outside analysis:** "one home per fact" is *not* sufficient — `REGISTRY` already is a single source of truth and `materializeSelectedHosts` still diverged from `mcp-hosts.js` by re-interpreting the raw rows. The goal is one authority for the **meaning**, with runtime/docs/tests as generated projections through one narrow contract (semantic model + narrow waist + fitness functions — established terms, see [assessment](reasoning/2026-08-25-semantic-model-assessment.md)). Takes **two** fitness functions, not seven, and does not name the architecture. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-133 — The signature freezes 68 samples; it should freeze the properties and a case generator**
	**Status:** OPEN (2026-08-25, re-confirmed 2026-08-26; count re-checked 2026-08-29) — GitHub #42 — no progress on the structural fix. `tests/advanced-oracle.test.js` is now **73** signed acceptance IDs (68 at filing) but is still an enumerated sample list bound through `api(file, name)` direct-require, not properties + a generator; every coverage increase still costs a re-sign ceremony. Blocks RIG-125's last step; awaiting owner approve-for-Coding · [Solution](tickets/RIG-133.md)
	**Class:** STRUCTURAL (coverage cap). `wiki/gate1/testing-infrastructure.manifest` byte-pins `tests/advanced-oracle.test.js` — an **enumerated list of 68 samples**, 63 at the direct-require seam. Pinning an enumeration caps the checked surface at sign time while `rig/lib` grows, charges a re-sign ceremony for every coverage increase (3 in 20 commits), and is why round 2 recorded *"I cannot edit that test file without invalidating the owner's signature."* Fix: sign the **properties + the case generator** (cases derived from `REGISTRY`), so adding a host extends coverage with no signed byte changed. Costs **one** re-sign — share [[RIG-120]]'s. Analysis: [escaping the quadratic](reasoning/2026-08-25-escaping-the-quadratic.md). **Moves ahead of RIG-125:** collapse the space (132), make signed coverage grow *with* it (133), then write composition properties into a signing scheme that can hold them. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-130 — The review loop has no memory, so convergence is unmeasurable**
	**Status:** OPEN (2026-08-25, re-confirmed 2026-08-26) — GitHub #43 — no progress; no finding-ledger exists; awaiting owner approve-for-Coding · [Solution](tickets/RIG-130.md)
	**Class:** STRUCTURAL (loop generator). Every review round is an independent draw: `review-receipt.js` carries no record of what prior rounds found or which classes are closed. Seven receipts, all `fail`, counts never fall (round 5 is the worst, after four rounds of correct fixes). Fix: append-only finding-class ledger, closed-class feed-in to the next reviewer prompt, and a findings-in-closed-classes convergence metric that becomes the release stopping rule. Cheap; do with [[RIG-131]] alongside [[RIG-132]] and **before** RIG-125, so RIG-125's result is measurable. Analysis: [root cause](reasoning/2026-08-25-structural-nondeterminism-root-cause.md). **Relabelled 2026-08-25:** this measures a *confidence criterion*, not the definition of done — completion is the conjunction of the structural conditions; two clean rounds is corroboration on top. **Order (2026-08-25, third investigation):** RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128, RIG-130 alongside, RIG-129 parallel.
- [ ] **RIG-125 — Structural: parallel sources of truth + no equivalence test keep re-opening "Done" work**
	**Status:** OPEN, implementation substantially landed (2026-08-25, re-investigated 2026-08-26) — GitHub #44 — all 3 loop-breaker tests + uninstall-authority collapse landed with RIG-126/127/128 and are green; not yet promoted into signed oracle (blocked on RIG-133); awaiting owner approve-for-Coding · [Solution](tickets/RIG-125.md)
	**Class:** STRUCTURAL (loop generator). Receipt re-confirmed: split MCP tables, two uninstallers, no inspect→apply→uninstall roundtrip. Loop-breaker: one MCP-disposition authority + equivalence test; one uninstall authority; real install→uninstall roundtrip; printed bootstrap sequence to a green check — landed **inside the signed oracle** under RIG-120's re-sign, not beside it. Do [[RIG-132]] (collapse N) + [[RIG-130]]/[[RIG-131]] first, then this, then 126/127. Map: [round-3 finding map](reasoning/2026-08-25-rig120-round3-finding-map.md).
- [ ] **RIG-127.11 — Uninstall hard-crashes on a corrupted legacy global config**
	**Status:** OPEN (2026-08-26, re-verified 2026-08-29) — GitHub #69 — follow-up to closed [[RIG-127]] (#36); found after roundtrip suite went green · [Solution](tickets/RIG-127.md)
	**Class:** DELIVERABILITY / v5-observable. `removeGlobalConfig()` (`global-writes.js:200`) calls `readJson()` (`:35`) — raw `JSON.parse`, no try/catch — unguarded from `lifecycle.js` `uninstall()`; a corrupted global file throws uncaught mid-uninstall. Sibling `removeGlobalMcp` already catches this; no test exercises the path. Confirmed still present on HEAD `9d1ea45`.
- [ ] **RIG-127.12 — Legacy pre-RIG-104 managed-block records over-strip on uninstall**
	**Status:** OPEN (2026-08-26) — GitHub #70 — follow-up to closed [[RIG-127]] (#36); found after roundtrip suite went green · [Solution](tickets/RIG-127.md)
	**Class:** DELIVERABILITY / v5-observable. A nameless managed-block record falls back to a wildcard regex matching any block in the file, not just the owned one. Narrow upgrade path only, but real.
- [ ] **RIG-135.1 — Cookie-import Chromium launch orphans a lock on the user's real browser profile**
	**Status:** OPEN (2026-08-26) — GitHub #78 — follow-up to [[RIG-135]] (#75); found triaging pending-triage sites; highest-priority of the three · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY, browse-skill owned. `cookie-import-browser.ts`'s Windows-only CDP cookie import launches headless Chromium directly against the user's real installed Chrome/Edge profile (required — v20 ABE keys are path-bound) and kills it with a bare leader-pid `chromeProc.kill()`. An orphan holds a lock on the user's actual browser, not a scratch profile. Needs a Windows Job Object design; this repo has no Windows CI to verify one.
- [ ] **RIG-135.2 — Browse skill scripts spawn through Bun's API, which RIG-135's helper design can't group-kill**
	**Status:** OPEN (2026-08-26) — GitHub #79 — follow-up to [[RIG-135]] (#75); found triaging pending-triage sites · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY, browse-skill owned. `browser-skill-commands.ts`'s `spawnSkill` runs caller-authored skill scripts via `Bun.spawn` with a bare `proc.kill()` on timeout — same orphan risk as RIG-135's already-debt runtime sites, but Bun's `Subprocess#kill()` has no negative-pid group-kill ([oven-sh/bun#15791](https://github.com/oven-sh/bun/issues/15791)), so the Node-shaped helper can't be dropped in unchanged. Owner must choose: shim through `node:child_process`, or build a Bun-native group-kill.
- [ ] **RIG-135.3 — Xvfb daemon isn't actually detached despite a comment claiming it is**
	**Status:** OPEN (2026-08-26) — GitHub #80 — follow-up to [[RIG-135]] (#75); found triaging pending-triage sites; lowest priority of the three · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY (minor), browse-skill owned. `xvfb.ts` spawns the Xvfb daemon via `Bun.spawn` without `detached: true`, despite an adjacent comment claiming "spawn detached" — Bun only isolates a process group when `detached: true` is passed. Cleanup also only signals the direct pid. Same Bun-native group-kill gap as RIG-135.2; lower blast radius since Xvfb rarely forks descendants.
- [x] **RIG-115 — Author lint-format acceptance for applicability, execution consent, and shell trust**
	**Status:** DONE (2026-08-27; board corrected 2026-08-29) — GitHub #64 closed (#87/#85/#86/#89/#88/#90) — oracle re-signed; all five shell-trust guarantees `AT-LF-20`–`AT-LF-24` are authored in `wiki/gate1/acceptance.md` and implemented in `rig/lib/lint-format.js` (73-case signed set). Was still filed under `## Blocked` reading "IMPLEMENTING / AT-LF-22 / 24 pending" after the work landed (commits `7010eca` AT-LF-22, `dd65b97` AT-LF-24); status corrected. Kept in this lane (not `## Done`) because the RIG-131 traceability gate requires a `## Acceptance` section with `→ test::title` evidence bullets, which this ticket's history predates — its evidence is the signed oracle cases. · [Solution](tickets/RIG-115.md)
	**Verified by:** `tests/advanced-oracle.test.js` cases `AT-LF-20`–`AT-LF-24`, all green on HEAD `9d1ea45`.
- [x] **RIG-135 — Guaranteed subprocess cleanup: shared helper, no orphaned descendants**
	**Status:** COMPLETE (2026-08-26; checkbox corrected 2026-08-29) — GitHub #75 closed (#77) — shared `rig/lib/spawn-guarded.js` and all 19 mandatory debt-site migrations landed; the card was left unchecked. Sub-findings 135.1/135.2/135.3 remain open as #78/#79/#80 (browse-skill-owned). · [Solution](tickets/RIG-135.md)
	**Class:** DELIVERABILITY. When a spawned process is killed, only the tracked parent dies; forked children can be orphaned. RIG-124.1 fixed that for the reviewer launcher only; this ticket is the shared guaranteed-cleanup helper for every spawn site. **Verified by:** `tests/spawn-guarded.test.js` (recursive-kill, timeout, cleanup-once, Linux parent-death) + `tests/spawn-guard-allowlist.test.js` ratchet.
- [x] **RIG-144 — Installed `rig/catalog/baseline/check.js` carries none of the AT-LF-20..24 hardening**
	**Status:** CODE COMPLETE (2026-08-29) — GitHub #104 closed (#107) — owner-scoped and landed. `rig/lib/check-runner.js` is now the single canonical `runArgv`/`runBinding`; both `rig/lib/checks.js` and `rig/catalog/baseline/check.js` `require()` it (`AT-CAP-6` asserts object identity, so a hand-copied duplicate fails immediately). Realpath containment, configurable resource ceilings with descendant-tree timeout kill, three-state network (`none`/`required`/visibly-diagnosed `undeclared`), committed exact-service `.rig/execution-policy.json` authority, and named fail-closed refusals are implemented and green in both source and materialized `.rig/bin`+`.rig/lib` layouts (`AT-CAP-1..6`, `AT-PROC-1l..1u`). Shipped in v5.0.0. · [Solution](tickets/RIG-144.md)
	**Class:** CORRECTNESS / SHELL TRUST, target-repo-facing. Follow-ups from the passing review: [[RIG-147]] (undeclared-network `console.warn` side channel).
- [x] **RIG-140 — AT-LF-23 only implements wall-clock timeout; memory ceiling is absent**
	**Status:** COMPLETE (2026-08-28) — GitHub #95 — `memory-guarded-exec.js` polls RSS and reports a distinct `memory_exceeded` status, independent of timeout; `AT-LF-23`/`AT-PROC-1c` green · [Solution](tickets/RIG-140.md)
	**Class:** CORRECTNESS / SHELL TRUST. Board was left OPEN after landing; corrected 2026-08-28 triage.
- [x] **RIG-139 — AT-LF-24 symlink containment only wired in `runReadOnly`; `runGrade` uses `cmd.cwd` unguarded**
	**Status:** COMPLETE (2026-08-28) — GitHub #94 — `runGrade` now resolves `cwd` through `taskCwd`/`containedPath` at parity with `runReadOnly`; `AT-LF-24`/`AT-PROC-1b` green · [Solution](tickets/RIG-139.md)
	**Class:** CORRECTNESS / SHELL TRUST. Board was left OPEN after landing; corrected 2026-08-28 triage.
- [x] **RIG-138 — AT-LF-20 approval `.used` flag is in-memory only; evaporates across process boundaries**
	**Status:** COMPLETE (2026-08-28) — GitHub #93 — `consumePlanApproval` durably records execution on disk, keyed by `plan_digest`, checked before any in-memory flag; `AT-LF-20`/`AT-PROC-1a` green. Frozen-test strengthening tracked as [[RIG-146]]. · [Solution](tickets/RIG-138.md)
	**Class:** CORRECTNESS / SHELL TRUST. Board was left OPEN after landing; corrected 2026-08-28 triage.
- [x] **RIG-136 — Oracle success log hardcodes the case count; print the verified count**
	**Status:** DONE (2026-08-29) — GitHub #92 closed (#107) — resolved on HEAD `9d1ea45`. `scripts/check-advanced-spec.js` now prints `${caseCount} acceptance cases` where `caseCount` is `verifyCoverage()`'s dynamic `titled.length` return, interpolated exactly like the `${entries.length} files` count beside it — no "68" literal remains. Rode the v5.0.0 oracle re-sign. · [Solution](tickets/RIG-136.md)
	**Class:** MAINTENANCE.
- [x] **RIG-137 — Production monkey-patch in net.Server.listen weakens network trust**
	**Status:** COMPLETE (2026-08-28) — GitHub #91 — Option A landed: monkey-patch deleted (`8ad5825`), `AT-LF-22` rewritten async, oracle re-signed and verifies on HEAD · [Solution](tickets/RIG-137.md)
	**Class:** CODE QUALITY / TRUST BOUNDARY. Board was left OPEN/blocked after the re-sign and implementation actually landed; corrected 2026-08-28 triage. Trace: [[reasoning/2026-08-27-at-lf-22-monkey-patch]].
- [x] **RIG-143 — runGrade runs approved commands with no network isolation**
	**Status:** COMPLETE (2026-08-28) — GitHub #111 closed (#102/#107) — implementation and AT-PROC-1d acceptance test green · [Solution](tickets/RIG-143.md)
	**Class:** CORRECTNESS / SHELL TRUST. `runGrade` now applies the same per-command isolation and grant/refusal contract as `runReadOnly`.
- [x] **RIG-142 — spawnTask safety defaults (shell:false, env allowlist) are caller-overridable with no guard or test**
	**Status:** COMPLETE (2026-08-27) — GitHub #97 — safety options are now locked after caller options and the helper is exported; focused oracle is green · [Solution](tickets/RIG-142.md)
	**Class:** CORRECTNESS / SHELL TRUST.
- [x] **RIG-141 — runReadOnly hard-refuses all tasks when sandbox absent, including network-granted ones; granted-network path untested**
	**Status:** COMPLETE (2026-08-27) — GitHub #96 — sandbox refusal is now checked per command grant, preserving ungranted denial while allowing granted tasks; focused oracle is green · [Solution](tickets/RIG-141.md)
	**Class:** CORRECTNESS / SHELL TRUST.
- [ ] **RIG-122 — (Low priority / deferred) Offer the wiki-knowledge system as a Rig tool family**
	**Status:** OPEN (2026-08-29) — GitHub #62 — approved post-release work; [[RIG-120]] is Done and `v5.0.0` is published · [Solution](tickets/RIG-122.md)
	**Class:** POST-RELEASE. Optional markdown wiki graft. Unblocked by the published release.


## Solution Discovery



## Acceptance Criteria & Testing



## Request for Signing



## Coding



## Ready for Commit



## Blocked

- [ ] **RIG-116 — Promote the non-lint-format leaves Policy → Context → Evidence**
	**Status:** BLOCKED (2026-08-24) — GitHub #63 — post-beta demand evidence and prerequisite gates do not yet exist · [Solution](tickets/RIG-116.md)
	**Blocker:** The governing roadmap requires promotion after beta, ranked by observed use under ordinary owner review. No beta selection/receipt evidence or approved demand ranking exists, and the reusable lint-format consent template is blocked. Guessing a family would violate the acceptance criterion.
	**Acceptance:**
	- A prioritized, family-batched plan promotes leaves beyond Policy on evidence of use, each under the ordinary gate.
	- At least the highest-demand families reach Context/Evidence with real verifiable checks.
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

## Done

- [ ] **RIG-120 — Finish the release ceremony and cut v5.0.0**
	**Status:** DONE (2026-08-29) — GitHub #68; annotated tag and GitHub latest release published · [Solution](tickets/RIG-120.md)
	**Done:** `tests/release-blockers.test.js::the POSIX installer downloads and executes a named tagged archive`; tag `v5.0.0` on `9d1ea45`.
	**Accepted follow-up (non-blocking, from the passing review):** [[RIG-145]] runReadOnly/runGrade isolation-unavailable parity · [[RIG-146]] frozen AT-LF-20 proves one-use only via the in-memory flag · [[RIG-147]] undeclared-network `console.warn` side channel.
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
