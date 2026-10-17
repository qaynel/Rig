---
date: 2026-08-31
source: agent
topics: distribution-and-release, install-manifest-removal, the-catalogue, delivery-plan, testing-strategy, host-and-ci-coverage, authored-service-gate, review-receipts, onboarding-flow, catalogue-contract, lint-format-roadmap, the-mvp-roadmap, graft-mechanics
status: historical
summary: Archived August 2026 reasoning on the install/resume model, the MVP build, the lean install, the release reviews and the v5.0.0 ceremony — 11 traces compacted.
---

# Release, install and distribution: AT-INSTALL-1, the MVP build, the lean install and the v5.0.0 ceremony

Compacted on 2026-10-17 from 11 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

The install model is **manifest-and-resume, always, with no rollback branch at
all**. `AT-INSTALL-1` was the live Gate 2 blocker: §6.6/§10 and `AD-10`
prescribed transactional rollback on apply failure while §7.6 and the frozen
`AT-INSTALL-1` required the opposite for the identical trigger. It was not a
real tradeoff — `index/rejected.md` already listed "transactional install with
automatic rollback as a second teardown path" as rejected at business-spec level
(`GA-12`), because a failed rollback leaves worse debris than the original
failure. The resolution propagated the §7.6 model into `AD-10`, §6.6, §10 and
the implementation, and rewrote the test that had asserted the old behaviour.

`D24` ruled the MVP would be built in one pass at the agent's discretion:
all 115 leaves authored at Policy grade with the rung stated in each fragment,
the vendored skills wired, context-aware onboarding into existing host trees
only, a distribution path fetching a released tag by name (never `curl | sh`),
and the record brought back into sync. D24's own trace named the property being
consciously set aside — under D24 the agent authors the content *and* sets the
bar it is judged against — and recorded that as a legitimate but undemonstrated
founder call rather than leaving it implicit.

The MVP release review then found the green oracle was green over a library
surface nothing shipped, and that two of D24's own honesty checks were
tautological and could not fail. `AT-DIST-1` was the unmet case: the 55 skills
were unwired, the MIT notice did not ship in installed copies, and `install.sh`
aborted on macOS before downloading anything. The owner's release-blocker list
then drove a fix pass, and `AD-37` made a default install markdown-only with all
executable backing behind `--with-runtime` — cutting 201 non-markdown files to 0
while keeping all 55 skills present and callable.

v5.0.0 was eventually cut on `9d1ea45` with the oracle verified at 73 cases and
a passing independent review receipt binding the implementation digest over
1743 files. `RIG-148` then closed the last install-hygiene gap by choosing the
**gitignore (tool-cache)** model over committing the payload.

## Source traces

### 2026-08-20-resolve-at-install-1.md
- **Summary:** AT-INSTALL-1 resolved — one model only: record-before-mutate manifest writes with resume on retry, no rollback branch anywhere.
- **Decisions:** AD-10
- **Status:** historical
- **What it recorded:** The probe's failure (a late apply failure rolled back already-applied writes and produced no incomplete manifest), why this was not a fresh bug, and why it was not actually an open design question. The alternative considered and ruled out. What changed in Gate 2 (`AD-10`, §6.6, §10, §2.1), in `rig/lib/apply.js` (`getInstallId`, an append-only `.rig/install-manifest.jsonl`, pending/applied records with post-write digests, resume skipping an already-applied path whose digest still matches, `ensureLineOwned` recording `append_managed`, and a `catch` block that only releases the lock and rethrows), and in the tests. What remained open.
- **Verbatim rulings / rejections / traps:** On why there was no tradeoff: "Gate 2's §6.6/§10/AD-10 rollback language was an unreconciled leftover of a decision Gate 1 had already made the other way." Rejected alternative: "keep two models, rollback only when a prior *complete* install already exists to protect… But it adds a boundary nobody asked for and Gate 1 gives no acceptance case that exercises re-apply-onto-a-complete-install as its own scenario — and the rejected-approaches entry above rejects a second teardown path outright, not just for the first-install case. Presented this choice to the intent owner; the one-model resolution (manifest-and-resume always, no rollback branch at all) was confirmed." Deliberate scope limit: "Deliberately **not** built here: preimage content-addressed storage and the reverse-walk removal/uninstall path… Scoping this narrowly was a deliberate choice given the intent owner's own retrospective about over-building governance ahead of a proven need." Reasoning preserved inline against regression: "with the reasoning (rejected second teardown path) stated inline so it doesn't regress again."

### 2026-08-20-cleanup-survey-decisions.md
- **Summary:** Pre-TODO survey of the cleanup branch with per-item intent-owner rulings — twelve findings across high/medium/low value plus a cleared list.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The full survey verbatim: byte-identical `AGENTS.md`/`GEMINI.md` with no drift guard; `publish.yml` still present and running `npm publish` on a private package; ~30 zero-caller exports across `rig/lib/*.js`, enumerated symbol by symbol; six duplicated command files; the root `__init__.py` Hermes plugin undocumented in CLAUDE.md; three basic-guard tests reimplementing shims; `bootstrap.sh`'s 25 hardcoded install lines duplicating `manifest.json`; 428 of 808 catalogue files as placeholders; two unrelated uninstallers; unreferenced `benchmarks/`; ~2100 lines of pre-refactor specs; and an empty `docs/pr-reviews/`. Then the owner's ruling on each.
- **Verbatim rulings / rejections / traps:** Rulings: "**AGENTS.md / GEMINI.md** — keep both. They are the same content served to different hosts by design." / "**`publish.yml`** — delete it." / On the unused exports, the owner's read was "they were left over from a TODO"; the investigation confirmed all 30 arrived in two landing commits (`3e3feeb`, `8dcaa49`) with no later caller — "They are speculative API surface shipped in bulk with the landings… YAGNI applies: remove when the next touching change happens, or as a single mechanical sweep, but they are not load-bearing today." / "**6 command-file copies** — same as (1). Same content served to multiple hosts, recorded here as intentional." / "**Basic-guard test triplet** — move the shared `initRepo`/`git` shims into `tests/helpers/basic-install.js`." / "**`bootstrap.sh` vs `manifest.json` duplication** — clean it up." / "**428 catalogue placeholders** — keep as TODO; note their status in the wiki." / "**`scripts/uninstall.js`** — delete the old one." / "**`benchmarks/`** — keep; document as TODO in the wiki." / "**`wiki/specs/{roadmap,sow,tasklist}.md`** — remove them." / "**`docs/pr-reviews/`** — keep for future use." Final instruction: "Nothing yet. The intent owner said do not start."

### 2026-08-21-mvp-agent-discretion-build.md
- **Summary:** D24 — build the MVP in one pass at the agent's discretion, at a generic bar, across all 115 leaves; the cheaper middle path was explicitly declined.
- **Decisions:** D24
- **Status:** historical
- **What it recorded:** The ruling across three verbatim owner turns; what D24 overrides (the standing one-leaf-at-a-time rule and locked decision 8, which existed because of the GA-10 audit's 432 placeholder files); the distinction D24 rests on (generic content presented *as generic*, not as coverage, with the rung stated in the fragment itself); what D24 preserves (the safety baseline's named-coverage-gap rule, and the owner's signature); the property consciously set aside; the consequence for D23; the six build products; what the build must not do; what only the owner can do; the documentation the owner offered (and the honest answer that almost everything needed was already present); and the success criteria.
- **Verbatim rulings / rejections / traps:** Owner verbatim 1: "ideally what I want right now is that all the families of tools with all the sub tools be shipped out with the bare minimum, the least curated, generic of generic best-practice skills and plugins, and the sort of framework that I'm putting in with the wiki, and ship that out with my context awareness, automatic onboarding and all". Owner verbatim 2: "why can't the entire thing be shipped out at once if I clarify the overall product intent and the business intent to the fullest of my extent — can you not just figure out the technical parts on your own, just boilerplate the entire rest based on best practices and what would fit my intent, what would fit the user's intent". Owner verbatim 3: "we build the minimal viable product right now entirely upon the agent's discretion… The main point is having something we can show, where we are on a crunch of time." Declined middle path: "The owner was offered a cheaper middle path (author five leaves, confirm the bar, then bulk-author the remaining 110) and declined it in favour of full agent discretion. This trace records that the declination was explicit and informed, not an omission." The rejected-approach list D24 suspends: "parallel bulk authoring, template-driven generation, mechanical presence as a semantic proxy, and generic convention fallbacks" — "they recreate the placeholder failure at greater scale." The property set aside: "Rig's core claim is that an agent cannot move its own goalpost. Under D24 the agent authors the content **and** sets the bar that content is judged against… For this release, in this repo, that property is not demonstrated." And: "This is a truthful product. It is also, deliberately, a shallow one." Must-nots: "Must not fabricate a pass, or substitute a generic success command for a missing binding. Named coverage gap, always." / "Must not claim Context or Evidence grade for any leaf authored under D24." / "Must not edit the frozen oracle." Legal blocker: "**Rule on the swallowed suite's licensing.** The 56 skills were vendored with every reference to the upstream name stripped and no upstream `LICENSE` or `NOTICE` carried across, into a repository licensed MIT. This is a release blocker of legal rather than technical character." Trap: the 56 skills "landed in commit `ff7cea5` without touching a single wiki file and are therefore currently invisible to the project's own source of truth."

### 2026-08-22-mvp-release-review.md
- **Summary:** Fresh report-only release review of `mvp-a-la-carte` — the release cannot be cut; the green oracle is green over a library surface nothing ships.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Baseline reproduced exactly (oracle 68/68, `npm test` exit 0, catalogue authored with 0 placeholders across 805 files). Four blockers, ten high findings, nine medium, eight low, a cleared list, three open questions for the owner, and a summary with residual risk. Blockers: the 55 vendored skills are not wired so `AT-DIST-1` is unmet; `rig/lib/lifecycle.js:48` uninstall deletes files outside the target via an unvalidated `path.join`, reproduced by execution; two of D24's honesty checks are tautological; and `install.sh:61`'s `need sha256sum || need shasum` aborts on macOS because `need()` calls `exit 2` inside the function.
- **Verbatim rulings / rejections / traps:** Theme: "The green oracle is real, but it is green over a library surface that nothing ships. That is the theme of this review." On D24's own risk landing: "D24 explicitly recorded that 'the agent both authors the content and sets the bar it is judged against.' These two functions are where that risk landed." Trap (unreachable library): "None of the ten new `rig/lib` modules has a production caller… The oracle binds behavior by direct `require(file)[name]`, so 68/68 green is compatible with an entirely unreachable library." Trap (fabricated approval): "`rig/lib/apply.js:430-431` — the install path fabricates CI approval… Here `applyPlan` supplies the approval to itself." Trap (fabricated verification): "`rig/lib/lifecycle.js:70-75` — `verifyRemoval` fabricates `verified_clean`… This is the 'no fabricated pass' trap, in the function whose entire job is verification." Trap (test-shaped production parameter): "`interrupt_after` is a test-shaped parameter in production code." Trap (closed loop): "`validateDisposition` is a keyword grep… `authorshipReport` synthesizes the string `service-specific ${kind} for ${id}`, which satisfies it by construction. The two functions form a closed loop." Trap (silent open): "`stagedHarnessFiles` returns `[]` when `git` exits non-zero, so a git failure yields `allowed: true` — a silent open." Open question that an agent cannot decide: "**`_core`.** Is the router skill (`name: rig`) one of the 55, or is the count 54? The signed oracle says 55; the implementation handoff says exclude `_core`… An agent cannot decide this one." Summary: "68/68 and 335/335 are honest numbers about the tests that exist. They are not evidence that the product works, because the entire new `rig/lib` surface is unreachable from any shipped entry point and the two functions that were supposed to police D24's one-pass authorship return success as a literal. The release cannot be cut." Verified-not-findings note: "Unsigned tests were moved to match the frozen bar, not the other way round."

### 2026-08-23-production-release-blockers.md
- **Summary:** Owner's release-blocking findings list, with instruction to fix everything not needing owner input and return the rest as a questionnaire.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Nine release-blocking findings: uninstall and remediation can follow repository symlinks and modify or delete files outside the target (reproduced across four write/delete paths); the released installer ships skills and plumbing but not the mandatory catalogue and safety runtime; a bare stranger repository receives zero of the 55 skills; most catalogue service packs are repeated generic boilerplate, explicitly prohibited by the signed contract; five of six CI providers have no working adapter; the shipping journal has no compatible uninstall path and cannot reconcile one crash window; the release-review producer and validator use incompatible schemas so unresolved reviews can validate; the signed distribution test never executes `install.sh` or downloads a tagged archive; and the installer requires Bash despite promising plain `sh`.
- **Verbatim rulings / rejections / traps:** Owner instruction verbatim: "Fix all the issues from the above, which do not require my input and which do list them out as a questionnaire at the end once you've solved all the issues which do not require my input the over the last goal being to fix these issues so that we have a production go and deployment"

### 2026-08-23-lean-install-protocol.md
- **Summary:** AD-37 lean install spec — a default `sh rig/bootstrap.sh` writes markdown/instructions only; executable backing ships only under `--with-runtime`; no oracle re-sign required, proven.
- **Decisions:** AD-37
- **Status:** historical
- **What it recorded:** The traced current state (the `--with-runtime` gate mechanism already exists and works, but the bloat is ungated: three `install_vendored_skills` ops copying skill dirs wholesale including `src/*.ts`, `*.swift`, `bin/*`, `scripts/*` and `*.tmpl`, plus a `copy_tree` of `rig/catalog/plumbing`). The measured footprint: skills tree 6.8 MB, plumbing 1.1 MB, 201 non-markdown files (112 `.ts`, 71 `.tmpl`, 15 `.sh`, 2 `.swift`). A before/after table. The verified argument that no re-sign is needed, naming the exact five digested files. The core `payload.js` change: a litter predicate applied in both modes, a `filter` parameter on `copyTree`, and `activeDelivery` threaded into `installVendoredSkillsOp`.
- **Verbatim rulings / rejections / traps:** The number that matters: "The MB cut is ~7.9 → ~4.0 MB, but the number that matters for 'won't break other people's machines' is **201 → 0 executable/code files**. All 55 skills remain present and callable by Rig name (their `SKILL.md` still lands), so the shelf is intact as instruction content." On the frozen surface: "**Do not edit any of the five frozen files.** Keep `listVendoredSkills` returning 55 (it reads source dirs — untouched), `install.sh` shape, and version `5.0.0`. Then the signed gate stays green with no owner action." On `AT-DIST-1`'s actual reach: "**It never installs into a target and never inspects the footprint.** Lean leaves every one of these true." Litter rationale, verbatim from the code comment: "Build inputs and working notes never ship: the rendered SKILL.md is the product; .tmpl is its source; TODOS-format.md is a dev file."

### 2026-08-24-ticket-burndown.md
- **Summary:** Ticket burndown pass over the RIG-101..122 backlog — verified facts, a three-way triage, and three tickets deferred to the PM.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** Verified facts as of 2026-08-24: `check-versions.js` already lists `rig-mcp/package.json`; `test:code` does not run `npm test --prefix rig-mcp`; the stale `vaibhav-kodiyan/agentic-harness-demo` URL appears across nine named files; and the real remote is `github.com/qaynel/Rig-v0.1`. Triage: implement-and-verify RIG-102/117/118/121 (and 106 if the hook format allows); solution doc for fourteen tickets; defer RIG-119, RIG-120 and RIG-122 to the PM as Blocked.
- **Verbatim rulings / rejections / traps:** The PM instruction being executed: "attempt each myself, write a `solution.md` per ticket linked from the board, update statuses, defer only genuine PM-decision tickets to Blocked." Deferral reasons recorded: "RIG-119 (spec-driven adoption), RIG-120 (owner signing/release ceremony — needs keys), RIG-122 (wiki-as-graft decision)."

### 2026-08-24-grilling-five-open-decisions.md
- **Summary:** Grilling session framing and recommendations on the five open decisions blocking the v5.0.0 close-out — RIG-108, 112, 113, 115, 120.
- **Decisions:** pending owner ruling — D25+ to be assigned on sign-off
- **Status:** (no status field)
- **What it recorded:** Per ticket, the verified facts, the two options with their costs, and the agent's recommendation. RIG-108: three zero-caller runtime modules, with `release-evidence.js` explicitly out of scope because it has a real caller. RIG-112: freeze the catalogue contract now or leave it unlocked. RIG-113: the content of "better" for the better-alternative rule. RIG-115: author the `AT-LF-*` cases for applicability, execution consent and shell trust. RIG-120: the release ceremony's three owner-only steps plus the `qaynel/Rig` vs `qaynel/Rig-v0.1` naming mismatch. Then the sequencing argument.
- **Verbatim rulings / rejections / traps:** Nothing-frozen caveat: "No oracle was edited; nothing here is frozen until the owner rules and (where the ruling touches `wiki/gate1/`) re-signs." RIG-108 recommendation: "**wire `graft.js`**… **delete `enforcement.js` and `git-dispatch.js`** as outside D24 beta scope." RIG-112 recommendation: "**land the mechanical CI-over-115 confirmation now under the ordinary gate; do NOT freeze the contract yet.** Freeze is a one-way door." RIG-113 proposed rule: "propose a replacement ONLY when the current tool is (a) unmaintained/EOL per a declared signal, (b) can't cover a selected component, or (c) absent — never model taste." And: "The ranked lists and the EOL/coverage signals are real product content only a human should author/approve." Sequencing rule: "All of these should be resolved BEFORE the RIG-120 ceremony so they fold into a single re-sign rather than several."

### 2026-08-25-prev5-gate-runbook-and-classification.md
- **Summary:** Pre-v5 gate runbook plus the debt-vs-observable classification of every known finding, offboarded so a lower-reasoning model can execute the gate fixes.
- **Decisions:** owner approved RIG-134 Option A (classify all, fix observable, defer debt)
- **Status:** (no status field)
- **What it recorded:** The classification rule, a must-fix `v5-observable` table of nineteen findings each with ticket, why-observable and fix shape, two structural gate conditions, and an eight-row `debt` deferral table. Then a seven-step flat runbook and a five-part exit condition.
- **Verbatim rulings / rejections / traps:** Classification rule, verbatim: "a finding is **`v5-observable`** if it is observable in a capability v5.0.0 claims to support — i.e. it changes bytes written into / removed from a user's repository, breaks a printed onboarding step a stranger follows, or ships a false capability claim in output. Everything else is **`debt`**." Hard rule: "do **not** edit `tests/advanced-oracle.test.js` or anything under `wiki/gate1/` — those are the owner-signed oracle… If a fix seems to require editing a signed file, stop and flag it; it needs an owner re-sign, not a code change." Classification status: "(done — do not re-litigate)". Critical finding 126.1: "**Critical.** Printed post-install chain dead-ends after `inspect`: `review.json` / `rig.json` / `approval.json` have no producer; literal `--host <host-id>` runs verbatim." Finding 127.5: "Linked-worktree apply renames the user's `pre-commit` to `.rig-chained` and writes a shim with plain fs, un-journaled; uninstall never restores it — permanent hijack across every worktree." Finding 129.1: "Ships a **false** capability claim: `host-capabilities.js:135` marks pi `mcp_config: unsupported` 'refused by design', citing a Skills page that says nothing about MCP; pi supports MCP via a first-party extension." Closing trap: "Two clean independent review rounds are corroboration on top of this, never the definition — that substitution is the exact mistake the whole investigation found."

### 2026-08-29-v5.0.0-tag.md
- **Summary:** Owner authorized the final ceremonial step; the v5.0.0 tag was cut on 9d1ea45 with prerequisites verified.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The prerequisites verified before the tag: all eight version manifests pinned at `5.0.0`; the oracle verified at principal `gate1-owner`, fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`, 73 acceptance cases; a passing independent review receipt with `verdict: pass` and `unresolved: []` binding `implementation_digest` `3013e34931a8e44b244c385315b37a10f256f93aee0156803e60cede1d573550` over 1743 files matching the live worktree; and `install.sh` plus `rig/bootstrap.sh` present in the tagged archive. Then the four actions taken.
- **Verbatim rulings / rejections / traps:** "No frozen oracle byte was changed. Wiki close-out after the tag is a post-release record; the published archive is the reviewed commit."

### 2026-08-31-rig-148-gitignore-oracle.md
- **Summary:** Grilling oracle for RIG-148 — gitignore (tool-cache) design decision confirmed by owner; three red tests in tests/rig-bootstrap.test.js assert the write, idempotency, and uninstall-cleanup behavior. Gate is ready for signing.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The owner's choice of gitignore over commit and its rationale. The intent: a default install writes a named managed `.gitignore` block covering `.rig/`, `.claude/skills/rig-*` and `.agents/skills/rig-*`. Three observable acceptance examples (write, idempotency, uninstall cleanup). Three declared inferred criteria. The three red test titles. The technical specification, present but not frozen.
- **Verbatim rulings / rejections / traps:** Owner decision: "Owner chose **gitignore** over commit for the Rig payload." Rationale: "Rig describes itself as a regenerable agent workflow — re-derivable at any time by rerunning `bootstrap.sh` against the pinned release, not repo-authored content a human wrote and should review byte-by-byte. Committing it would produce a multi-hundred-file diff on every version bump in every downstream repo." Inference declaration: "## Inferred criteria (declared outright — remove if wrong)". Uninstall limit: "Uninstall removes only the Rig block, not the whole `.gitignore` file." Red proof: "All three are **currently red** (confirmed: `node --test tests/rig-bootstrap.test.js` shows 3 failures on HEAD before any implementation)." Freeze state: "Open items at freeze: None. Owner decision made. Tests are red. Technical spec present. Ready for signing."
