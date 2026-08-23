---
date: 2026-08-22
source: review
topics: distribution-and-release, the-catalogue, install-manifest-removal, host-and-ci-coverage, testing-strategy, delivery-plan
decisions:
---

# Fresh release review — `mvp-a-la-carte` @ working tree vs `origin/qa-prod`

**Report only. No files were changed.** Baseline reproduced exactly as stated in the handoff: verifier prints `principal=gate1-owner fingerprint=SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY` / `5 files, 68 acceptance cases`; oracle 68 pass / 0 fail; `npm test` exit 0 (secrets 13/13, root 335/335, pi-extension 15/15). `package.json.scripts` verified byte-equal to `wiki/gate1/package-scripts.json`; version `5.0.0`, `private: true`; no `publish.yml`. Catalogue authored: 0 `TODO|TBD|Concrete convention` across 805 files.

The green oracle is real, but it is green over a library surface that nothing ships. That is the theme of this review.

---

## Blockers

**1. The 55 vendored skills are not wired. AT-DIST-1's actual requirement is unmet.**
`wiki/gate1/acceptance.md:617` — "The resulting install exposes all 55 vendored skills **by their Rig names** and carries `LICENSE.upstream` plus `UPSTREAM.md`."
`rig/manifest.json` payload has 39 operations, none referencing `rig/catalog/skills` (verified programmatically). A repo-wide grep finds zero references to `rig/catalog/skills` from `rig/lib`, `rig/materialize.js`, `rig/bootstrap.sh`, `scripts`, or `rig/manifest.json` — only `rig/lib/skills.js:6`, which reads the directory for counting, and the oracle test itself. `wiki/status.md:306` still reads "**Vendored, 0 wired** … not installable. Roadmap step 3 wires them," and that line is accurate.
Failure scenario: a stranger runs `install.sh`, the bootstrap installs the manifest payload, and none of the 55 skills — nor `LICENSE.upstream`/`UPSTREAM.md` — land in their repository. This also breaks the owner's MIT release condition that notice and provenance ship *in every installed copy*.
The manifested test (`tests/advanced-oracle.test.js:483-487`) only counts directories and checks the two files exist **in this checkout**, so it cannot catch this. Roadmap step 3 is not done.

**2. `rig/lib/lifecycle.js:48` — uninstall deletes files outside the target.**
`path.join(target, record.path)` with a record path read from the repo-local `.rig/install-manifest.json`. Confirmed by execution: a manifest record of `../outside/victim.txt` caused `uninstall()` to delete a file outside the install target. Same unvalidated-join class at `lifecycle.js:30` (`resumeInstall`), `checks.js:73` (`sync-map.json` group entries), and `lint-format.js:185` (`applyCoverage` plan writes).

**3. Two of D24's honesty checks are tautological — they cannot fail.**
- `rig/lib/catalog.js:147-165` — `authorshipReport()` returns `failures: []` as a literal (line 165). It never opens a fragment file; `disposition` is synthesized from `service.delivery` and `evidence_targets` from declared paths in `catalog.json` regardless of whether those files exist or are authored. `AT-P6`'s `assert.deepEqual(report.failures, [])` and `report.services.every(e => e.disposition && e.evidence_targets.length > 0)` therefore have zero teeth. `AT-SHAPE-6` retains teeth only through the separate `allServiceFiles()` loop in the test body.
- `rig/lib/host-capabilities.js:209-233` — `contractFor()` hardcodes `deny_behavior`, `proceed_protocol`, `merge_boundary`, `first_apply`, `repeat_apply` as constants and `input_schema` as always-truthy; the `path === undefined` guard never fires because the value is `null`. Verified: `validateRegistryContracts().failures` is `[]` unconditionally.

D24 explicitly recorded that "the agent both authors the content and sets the bar it is judged against." These two functions are where that risk landed.

**4. `install.sh:61` — `need sha256sum || need shasum` aborts on macOS.**
`need()` calls `exit 2` inside the function, which exits the shell regardless of the `||`. macOS ships `shasum`, not `sha256sum`, so the installer dies at line 61 with `missing required tool: sha256sum` before it downloads anything. The delivery path is broken on the platform the owner signs from.
Related, same file: the header (line 3) claims the script "verifies bytes," and neither hashing tool is ever invoked — locked decision 7 says no fingerprint pin, so the requirement is dead, but the comment asserts a control that does not exist.

---

## High

**5. None of the ten new `rig/lib` modules has a production caller.**
`skills`, `release-evidence`, `policy`, `enforcement`, `lifecycle`, `global-writes`, `git-dispatch`, `secret-history`, `graft`, `lint-format` are required only by `tests/advanced-oracle.test.js`. `materialize.js`, `cli-advanced.js`, `payload.js`, `bootstrap.sh`, and `manifest.json` reference none of them. The oracle binds behavior by direct `require(file)[name]`, so 68/68 green is compatible with an entirely unreachable library.

**6. `rig/lib/apply.js:430-431` — the install path fabricates CI approval.**
```js
const ci = detectedCi ? planCiIntegration(target, { provider: detectedCi, approved: true }) : ...
```
`apply.js:462-463` then writes `.github/workflows/rig.yml` into the user's repository. `wiki/gate1/acceptance.md:513-515` (AT-CI-2) requires the user to select a verified provider and **explicitly approve creation**; "before approval it creates none." Here `applyPlan` supplies the approval to itself. Note also that `applyCiPlan` — the function the oracle exercises — has no production caller; the shipping path duplicates it via `writeOwned` with different semantics.

**7. `rig/lib/checks.js:106` — semantic drift is a word match on "deprecated," wired to a blocking gate.**
Any file under `wiki/` containing the word deprecated is reported `status: 'stale'`, and `runChecks` turns the first finding into `status: 1`. Confirmed in a scratch repo: a single sentence "The old tier taxonomy is deprecated; use the catalogue." produces a finding. This repository's own `AGENTS.md` and wiki would trip it. The rig rule requires a naive heuristic to name its ceiling and upgrade path; there is no `rig:` comment.

**8. `rig/lib/lifecycle.js:70-75` — `verifyRemoval` fabricates `verified_clean`.**
It ignores `target`, `evidence.preimages`, and `evidence.records`, touches no filesystem, and returns `verified_clean` for any input without `missing_markers`. A target with rig files still on disk reports clean. This is the "no fabricated pass" trap, in the function whose entire job is verification.

**9. `rig/lib/lifecycle.js:36` — `resumeInstall` is not record-before-mutate.**
The manifest is written once, after the write loop. A genuine interruption persists zero records, so files already written are orphaned — untracked by the manifest and therefore invisible to `uninstall`. AT-INSTALL-1 passes only because `interrupt_after` (line 24) simulates the interrupt *in-process* and lets the function return normally; `interrupt_after` is a test-shaped parameter in production code. Also `digest: null` on every record (line 33), and the file is `.rig/install-manifest.json` while `apply.js` maintains a separate `.rig/install-manifest.jsonl` — two manifests with two formats.

**10. `rig/lib/lint-format.js:211` — `runGrade` hardcodes `grade: 'Policy'`.**
Returned for every requested grade. The round-4 blocker correction recorded in `wiki/status.md` requires "the reported assurance is the highest grade actually completed." `completed_grades` is computed correctly; the headline `grade` is not. Separately, `anyFail` (line 202) reads only command exit codes — a mid/maximal run with `context.findings` populated still reports `verdict: 'pass'`.

**11. `rig/lib/lint-format.js:236-247` — `runReadOnly` will report false mutation.**
It digests every file in the target (skipping only `.git`) before and after **each** command. Real linters write caches: `.eslintcache`, `.ruff_cache`, `__pycache__`, `node_modules/.cache`. Any of those makes AT-LF-11's halt fire on a genuinely read-only check, with evidence preserved and the run stopped. It also re-walks the whole repository once per command.

**12. `rig/lib/git-dispatch.js:41,44` — the pre-commit gate reports steps it does not run.**
`steps.push('secrets')` and `steps.push('drift')` add labels with no execution behind them; only sanitation actually scans. AT-B4 states "recording a note without running the scan does not pass." Additionally `stagedHarnessFiles` returns `[]` when `git` exits non-zero (line 17), so a git failure yields `allowed: true` — a silent open.

**13. AT-SECRET-1's disclosure clause is unimplemented.**
`wiki/gate1/acceptance.md:684-696` requires that when triage is enabled "the choice is disclosed at the point of enabling with the reason." `rig/lib/reports.js:57` has no enabling point and no disclosure — it takes a boolean and returns content. (The full-content return itself is consistent with Gate 1, which permits content on explicit enable; it does diverge from the Gate 2 §8.2/§8.8 "bounded redacted `matched_content`" language, and Gate 2 is working design, so the code is entitled to win there — but the disclosure requirement is Gate 1 and is missing.)

**14. Wiki drift — `wiki/status.md` "What exists in the code today" was not updated.**
It still asserts `scripts/check-advanced-spec.js` **Does not exist**, `npm run test:code` **Does not exist**, `install.sh` **Does not exist**, `package.json` version **4.8.4**, **1 of 115** leaves authored, 428 `TODO(Slice 10)` placeholders (now 0), and 20 `tests/advanced-*.test.js` files (now 22). "Known documentation debt" repeats the 428 figure. The handoff also listed `wiki/topics/specification-gate.md`, `the-two-gates.md`, and `delivery-plan.md` for rewrite; they were not touched. Per CLAUDE.md this is a defect, not stale docs.

---

## Medium

**15. `rig/lib/ci-adapters.js:230-237` — `applyCiPlan` mutates every user workflow with no manifest record.** It appends a `# rig-check:` marker to each file in `.github/workflows/` using direct `fs.writeFileSync`, outside the install manifest. AT-UNINSTALL-1 ("removes exactly manifest-owned content") cannot reverse these edits.

**16. `rig/lib/ci-adapters.js:163-166` — `detectUnknownCi` is `fs.existsSync('.ci')`.** A repo with `Jenkinsfile`, `.circleci/`, `azure-pipelines.yml`, or `.drone.yml` returns `approval_required` rather than AT-CI-4's `unknown`. The implementation matches the fixture, not the requirement.

**17. `rig/lib/policy.js:25` — the self-authorization guard is bypassable.** `policyStatus` reads `.rig/policy/active.json` and returns it without running `validatePolicy`. The unknown-field check that exists precisely so "policy cannot self-authorize activation" (line 103) is applied only on the propose path, not on load.

**18. Presence is a caller-supplied boolean.** `policy.js:62` (`opts.verified`) and `lint-format.js:277` (`approval.verified`) gate on a flag the caller passes; `choosePresenceMethod` (line 109) is never invoked by `activatePolicy`. Under locked decision 2 the required property is a key no agent can operate without a live human act; a boolean argument is not that.

**19. `rig/lib/lint-format.js:87` — `discoverCommands` misclassifies compound scripts.** `if (body.includes('&&') || name === 'verify')` routes any script containing `&&` to `verify`. `"lint": "eslint . && prettier --check ."` is a common shape and would leave `roles.lint` as `missing` — a fabricated coverage gap. `npm run` is also hardcoded (wrong for pnpm/yarn), and the Python/Rust/Go components that AT-LF-1 requires `discoverComponents` to find can never receive a binding, since command discovery reads `package.json` scripts only.

**20. `rig/lib/resolve.js:124-134` — `resolve()` returns an Array with `effective`/`order`/`services` bolted on as properties.** Current callers (`plan.js:23`, `apply.js:116`) read the properties and work. Any future `JSON.stringify`, spread, or structured clone silently drops all three. No caller serializes it today, so this is latent rather than broken.

**21. `rig/lib/checks.js:198` — `validateDisposition` is a keyword grep,** accepting any convention reason containing "repository", "service-specific", "tailored", or "convention:". `authorshipReport` (catalog.js:160) synthesizes the string `service-specific ${kind} for ${id}`, which satisfies it by construction. The two functions form a closed loop.

**22. `rig/lib/enforcement.js:31-40` — `consumeOneUseApproval` never consumes.** It returns `{consumed: true}` without setting `approval.used`; replay refusal depends entirely on an unnamed caller persisting that flag, and there is no caller. The digest is `JSON.stringify(action)`, so key insertion order changes reject a valid approval.

**23. `install.sh` argument handling.** `--version` / `--target` as the final argument dereference `$2` under `set -u`; the resolved `TAG` is interpolated into both a URL and `${WORKDIR}/rig-${TAG}.tar.gz` with no validation, and for `latest` that value is parsed out of a GitHub API response — remote-influenced input reaching a filesystem path.

---

## Low

- `rig/lib/host-capabilities.js:172-187` — 5 of 19 registry hosts (`vscode-codex`, `copilot-cli`, `antigravity`, `hermes`, `generic`) have no `HOST_DETECTION` signal and are reachable only via `explicit`.
- `rig/lib/skills.js:14` — `listVendoredSkills()` returns directory names. `_core`'s `SKILL.md` declares `name: rig`; all other 54 match their directory. Gate 1 says "by their Rig names," so this one entry is wrong. It is also the entry the implementation handoff told the implementer to *exclude*, which would have produced 54 against the oracle's `assert.equal(skills.length, 55)` — the handoff and the signed oracle disagree, and this needs an owner call rather than a code change.
- `rig/lib/profile.js:85` — `FAMILIES.filter(id => known.has(id) || FAMILIES.includes(id))` is a no-op; `known` is built and unused.
- `rig/lib/enforcement.js:5-10` — `CATEGORY_TO_RULE` is an identity map.
- `rig/lib/git-dispatch.js:9` — `gh[po]_` misses `ghs_`, `ghu_`, `ghr_`.
- `rig/lib/host-capabilities.js:252` — `materializeSelectedHosts` performs no writes despite the name; `materializeHostAdapters` in the same file does.
- `rig/lib/lint-format.js:25-56` — `discoverComponents` reads every `.conf/.toml/.yaml/.yml/.json` to depth 6, skipping only `node_modules` and `.git` (not `vendor`, `dist`, `target`, `.venv`).
- `rig/lib/ci-adapters.js:255` — `renderPipeline` has no production caller and generates GitHub Actions YAML that diverges from `githubActionsStandalone()`.

## Not findings, checked and cleared

The edits to `tests/advanced-ci-floor.test.js` and `tests/advanced-lint-format.test.js` (`rig-check.yml` → `rig.yml`, `degraded` → `approval_required`) are **forced by the signed oracle** at `tests/advanced-oracle.test.js:374,378`. Unsigned tests were moved to match the frozen bar, not the other way round. `package.json` script reordering is byte-equality with `wiki/gate1/package-scripts.json`, verified. The `.github/workflows/test.yml` branch-filter fix (`main`, which does not exist here, → `**`) is a real fix with its reasoning in the file. The formulaic catalogue fragments are what D24 explicitly authorized for this release.

---

## Open questions for the owner

1. **`_core`.** Is the router skill (`name: rig`) one of the 55, or is the count 54? The signed oracle says 55; the implementation handoff says exclude `_core`. Either the oracle stands and `listVendoredSkills` should return `rig` rather than `_core`, or the count is wrong and needs a re-sign. An agent cannot decide this one.
2. **AT-P6 and the `failures: []` contract.** The case as manifested cannot fail. Correcting it means re-signing `tests/advanced-oracle.test.js`. Do you want that now, or accepted as a named gap in the release evidence?
3. **AT-SECRET-1 disclosure.** Gate 1 requires disclosure at the point of enabling; there is no enabling surface in the code at all. Is that in scope for `5.0.0`, or deferred?

## Summary and residual risk

68/68 and 335/335 are honest numbers about the tests that exist. They are not evidence that the product works, because the entire new `rig/lib` surface is unreachable from any shipped entry point and the two functions that were supposed to police D24's one-pass authorship return success as a literal.

The release cannot be cut. `AT-DIST-1` — the case whose Gate 1 text ends "a build that passes every other case but cannot be installed by someone without this checkout is not shipped" — is the one that is actually unmet: the skills are unwired, the MIT notice does not ship in installed copies, and `install.sh` aborts on macOS before it downloads.

Residual risk I could not close from here: I did not execute `install.sh` against a real released tag (none exists), so the download/extract/bootstrap path past line 61 is unexercised. `rig/catalog/plumbing/` (~110 vendored executables) is likewise unwired and undocumented in the manifest; I reviewed its wiring status, not its contents.
