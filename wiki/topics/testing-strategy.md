# Testing strategy

## What it is

Testing begins with Gate 1's independent acceptance cases, transcribes them into
an executable specification gate, then implements behavior in tracer-bullet
slices. Development runs are diff-scoped, CI is whole-repository, and dependent
testing rungs fail fast while reporting later rungs as not run. CI runs selected
executable services only when they are repo-CI-applicable at their active grade;
for lint-format, that means Evidence only. [Gate 2 §9.2 and §13–14](../gate2/technical-spec.md#13-acceptance-traceability)

## Why it is this way

The existing green suite proves inventory and non-emptiness rather than the
frozen behavior, so extending it would preserve false confidence. Exact ID-set
equality, required target existence, result-count assertions, and semantic
service review make omission visible. [Known traps](../index/traps.md)

## What binds it

`G7`–`G9` define Rig's TDD, debugging, and independent-review doctrine. `AD-18`
drives the executable oracle, and every Gate 2 §13 row names a mechanism and
target. [Foundational log](../sources/logs/grill-decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Implementation-authored acceptance, trusting exit status alone, file-presence
tests, no-op bindings, parallel template authoring, and a missing target counting
as pass were rejected. [Rejected approaches](../index/rejected.md)

An implementer never edits a frozen test directly. If the test is wrong or the
intended behavior has changed, a filled evidence request records the exact
test and reason before the human key holder re-signs the changed oracle. This
also leaves a first-class path for a human working without agent tokens.
[2026-08-30 handoff](../reasoning/2026-08-30-development-process-handoff.md)

A frozen test can still carry an unstated fixture prerequisite. `AT-HOME-1`'s
fake `npm` copies a `rig-mcp/node_modules` tree that only CI's standalone
`npm ci --prefix rig-mcp` step created, so `npm test` passed in CI and failed on
a fresh clone. The fix is a canonical bootstrap guard on the root `pretest` plus
a non-frozen structural lock — the frozen assertions are untouched, the change
only supplies the prerequisite they always assumed. Because
`wiki/gate1/package-scripts.json` is in the signed manifest, even that hook edit
needs a Gate-1 re-sign. Landed in PR #140 with the re-sign in the same commit;
a fresh-clone `npm test` (no `.venv`, no `rig-mcp/node_modules`) now exits 0
with AT-HOME-1 green.
[RIG-154 design](../reasoning/2026-08-31-rig-154-fresh-checkout-npm-test-design.md),
[RIG-154 close-out](../reasoning/2026-08-31-rig-154-close-out.md)

The same green-in-CI, red-on-fresh-clone shape recurred 2026-09-02 in the
skill-shelf `tree_digest`. `skillTreeDigest` hashed `fs.statSync(file).mode &
0o777` — nine permission bits, of which git tracks only owner-execute — so a
checkout under `umask 002` moved every catalogue row's digest and turned
`build-skill-catalog.js --check` red. The `--check` gate cannot catch it: it
regenerates and string-compares inside one process, where the umask cancels.
Fix landed the same day — `mode` collapsed to git's two states (`(mode & 0o111)
? 0o755 : 0o644`), `catalog.json` byte-unchanged — with a non-frozen guard
`tests/skill-tree-digest-reproducible.test.js` that holds bytes constant, varies
`chmod`, and asserts the digest does not move (the reproducibility check the
`--check` gate structurally cannot be). Auto-discovered by the `tests/*.test.js`
glob, no Gate-1 re-sign — same precedent as `tests/wiki-maintenance-lint.test.js`.
[tree-digest reproducibility trace](../reasoning/2026-09-02-catalogue-tree-digest-reproducibility.md)

## Authorities and sources

- Frozen oracle: [Gate 1 acceptance](../gate1/acceptance.md)
- Traceability and slices: [Gate 2 §13–14](../gate2/technical-spec.md#13-acceptance-traceability)
- Captured testing sources: [testing vision](../sources/reference/testing-pipeline-vision.raw.md) and [mutation taxonomy](../sources/reference/mutation-testing-taxonomy.raw.md)
- First real interrupted-apply evidence: [AT-INSTALL-1 resolution trace](../reasoning/2026-08-20-resolve-at-install-1.md)
- Cleanup survey rulings: [reasoning trace](../reasoning/2026-08-20-cleanup-survey-decisions.md)

## What is still open

The prior executable specification gate ran first and proved the signed
73-case D24/D28 oracle green. Path B expanded the exact testing manifest from
five to 14 files and the oracle to 83 cases. The amended oracle is now signed
and verified before every implementation run; its frozen tests remain the
contract while the adaptive-onboarding slices turn the original red product
failures green.
[Implementation resumption](../reasoning/2026-09-01-path-b-implementation-resumption.md)

**A green oracle alone is not evidence that the product works.** The 2026-08-22
fresh review found that the oracle bound behavior only by direct
`require(file)[name]`, so 68/68 was compatible with a library no shipped code
path could reach. That total-unreachability claim is now superseded: an
active-runtime install journals `.rig/bin/rig`, and an end-to-end regression
uses that installed command to plan, apply, and check the lint-format leaf.

That is a property of how the oracle binds, not a defect in any one test, and it
is worth stating plainly because it is the successor to the older trap on this
page. The previous version was "the suite asserts inventory, not behavior." This
one is "the suite asserts behavior, at a seam the product does not use." Both
produce a green suite that means less than it looks like it means.

**Installed-payload hygiene lint (2026-08-31).**
`tests/installed-router-hygiene.test.js` greps the installed instruction text
(`routing.md`, `tdd/SKILL.md` + mirrors) for the phantom-convention and
dangling-citation defect shapes behind RIG-151 / RIG-152 / RIG-124.2 — no model
call, negative assertions plus a positive pincer so bare deletion does not
pass. Red by design until those three land. It is the first concrete instance
of the mechanical breakage-count check [[RIG-153]] specifies for the
RIG-149…152 defect classes.
[routing-hygiene oracle](../reasoning/2026-08-31-routing-hygiene-oracle.md)

**Adaptation measurement instrument spec (RIG-153, 2026-08-31).**
The technical spec extends `tests/installed-router-hygiene.test.js` with two
further test blocks: RIG-149 (`rig`→`rig-rig` self-collision guard in
`payload.js`) and RIG-148 (`ensure_gitignore_block` in `manifest.json`). This
completes the full six-defect-shape coverage of the RIG-148→152 inventory —
the mechanical half of the adaptation-measurement instrument. The model-judged
half lives in `wiki/specs/adaptation-measurement-rubric.md`: 2 hard gates
(G1 Config Preserved, G2 Zero Breakages — MET/UNMET), 3 graded axes (A1
Signal-vs-Noise, A2 Net Capability Added, A3 Reversibility — fail/partial/pass,
equal weight), per-axis profile format, clean-checkout procedure, and prompt
template. No API-key-wired model script; the judge is human-operated.
[instrument spec](../reasoning/2026-08-31-rig-153-instrument-spec.md) ·
[rubric](../specs/adaptation-measurement-rubric.md)

RIG-153 closed 2026-08-31 with option A (the instrument) delivered and frozen
(`592f4eed`). The re-baseline *run* against the +12/100 baseline is measurement
work, not instrument work: it is carved out as [[RIG-156]], deferred and low
priority. Rationale — the six hygiene tests already prove the RIG-148..152
defect shapes are fixed, so a re-baseline now would mostly flip the G2 gate
UNMET→MET; the run worth doing is after adaptive integration (prune-to-stack,
reconcile-with-existing-config) is built, which is a Path B question. Five
readiness blockers (no clean in-workspace target copy, unpinned Rig SHA,
human-operated judge, model pin string source, a malformed handoff
blocker-check) are recorded on RIG-156.
[close-out ruling](../reasoning/2026-08-31-rig-153-close-option-b-deferred.md)

**Path B oracle authored (2026-08-31).** Ten independently visible cases cover
the six foundational and four support contracts at the real catalogue,
inventory, state, graft, shared-domain, CLI/MCP, installer, router, and checker
seams. Exact ID/title/trace equality is 83/83/83 and all 14 manifest hashes
match. The agent-derived criteria are explicitly presented for owner review;
they are not frozen until the human signature, and implementation remains
blocked.
[acceptance-oracle trace](../reasoning/2026-08-31-path-b-acceptance-oracle.md)

Those two checks used to return `failures: []` unconditionally. They no longer
do. `authorshipReport()` opens each fragment file; `contractFor()` reads
declared host-contract fields instead of inventing them. The signed cases still
assert `failures: []`, which now means no defects were found. The remaining
honest limit is narrower: the signed oracle still binds many functions by
direct `require`, and one installed lint-format tracer does not prove every
runtime module or behavior is wired through a shipping caller.
[fresh review](../reasoning/2026-08-22-mvp-release-review.md) ·
[Status](../status.md#what-exists-in-the-code-today)

The structural half of that limit is now guarded: a production caller-graph
test scans every runtime library module and fails if one is imported only by
tests. Behavioral shipping-path cases separately exercise installed
lint-format, managed graft apply, commit validation, MCP enforcement, and the
release-review wrapper. This does not make direct-require oracle cases redundant;
it ensures their modules cannot silently become library-only again.

A third mechanism of the same family showed up 2026-08-27 in RIG-115's
per-AT-LF-case branches: each branch's acceptance test passes for a slice of
its guarantee narrower than the acceptance text states, and nothing checks
whether the union of sibling branches' passing tests reconstructs the whole
guarantee. Named as [guarantee sharding](../mistakes/guarantee-sharding.md) —
see [`mistakes/`](../mistakes/) for this family of anti-patterns going
forward, kept separate from this page's own two instances above.
Instances: [RIG-138 / #93](https://github.com/qaynel/Rig/issues/93),
[RIG-139 / #94](https://github.com/qaynel/Rig/issues/94),
[RIG-140 / #95](https://github.com/qaynel/Rig/issues/95).
[reasoning trace](../reasoning/2026-08-27-guarantee-sharding-mistake.md)

The prevention side is `AT-PROC-1`, a workflow-doctrine acceptance criterion
(not a Gate 1 case — no owner signature, no set-equality gate) requiring the
union of a split guarantee's sibling-branch tests to cover every enumerated
call site and conjunct. `tests/guarantee-coverage.test.js` is its executable
target: red by design until RIG-138/139/140 landed, green since
[2026-08-27](../reasoning/2026-08-27-rig138-139-140-shell-trust-fix.md).
RIG-143 adds AT-PROC-1d for the network conjunct on `runGrade`: the test
covers isolation, explicit grants, and refusal when the host cannot provide
the sandbox. Full text: [guarantee sharding § acceptance criteria](../mistakes/guarantee-sharding.md#acceptance-criteria-at-proc-1).
[reasoning trace](../reasoning/2026-08-28-runGrade-network-isolation-grilling.md)

**Wiki-maintenance lint wired without a Gate 1 re-sign (routine Step 6,
2026-09-02).** `scripts.test:code`'s exact string is digest-pinned in the
signed oracle, so `node scripts/wiki-maintenance.js lint` cannot be spliced
into that chain without a human key-holder ceremony. Instead
`tests/wiki-maintenance-lint.test.js` asserts `lintFindings(repoRoot,
traces(repoRoot))` is empty; `npm test`'s existing `tests/*.test.js` glob
picks it up automatically, so a stale hub or an untagged post-floor trace
fails the same way any other test fails. `staleHubs` counts a citing trace
toward a hub's freshness regardless of `status` (a trace filed straight to
`historical` still owes its hub a sync) but only for traces dated on/after
`FRONTMATTER_FLOOR` (2026-09-02) — the same grandfather line the
frontmatter-completeness check uses, so the lint's introduction does not
retroactively flag the wiki's pre-existing drift. The trace side of the
staleness comparison uses each trace's first-add commit, not its latest
commit, so a later lifecycle-flip edit (current → historical) re-committing
the file cannot retrigger staleness against a hub that already absorbed it.
[step6-lints trace](../reasoning/2026-09-02-wiki-maintenance-step6-lints.md)

<!-- Reviewed 2026-09-02 during wiki-maintenance step 6; synced to the
     step6-lints trace. -->

## Review themes become executable ratchets (2026-09-03)

The onboarding hardening oracle now separates concrete adversarial behavior
from pattern prevention. Eight cases mutate the real state, filesystem, host,
catalogue, verification, MCP, and policy boundaries. Four additional cases scan
for the recurring shapes: wrong trust object/fail-open handling, stale global
snapshots, parallel authorities, and tests that simulate rather than drive the
shipped seam. The MCP test now uses a real SDK client; source-order checks are
paired with behavioral tests so neither static shape nor happy-path output is
the sole evidence.
[Prevention-oracle trace](../reasoning/2026-09-03-onboarding-hardening-prevention-oracle.md)

### What the pattern ratchets cost (2026-09-03)

Review of the prepared invariant suite recorded the price of freezing
source-shape checks under Gate 1: `AT-HD-9`–`AT-HD-12` pin a function's
parameter count, three specific identifier names, and a regex-scanned catch
shape, so a later rename or refactor of those seams needs an owner re-sign, not
just a green suite. Two of the checks also read as coverage they do not provide
— the version-literal scan is built from the current `package.json` version, so
it goes blind exactly when the version drifts, and the trace-policy check is a
string proxy that fails on a document stating the correct rule in natural
wording.
[Oracle review trace](../reasoning/2026-09-03-onboarding-hardening-oracle-review.md)

### Source-shape ratchets replaced with adversarial behavior proofs (2026-09-03)

Four of the identifier/shape ratchets the review flagged (`I-A-1`, `I-A-3`,
`I-B-1`, `I-B-2`) are rewritten as behavioral tests that drive the real
`handleOnboarding` seam and assert on observable outcomes — no journal or
graft-target mutation when a tamper or an inventory drift is detected, correct
per-host projection under a second native/instruction-only host pair, and an
end-to-end exception-propagation proof through a symlinked scan-root file —
instead of parsing source text for a literal function name or an exact
parameter count. Two checks stay source-level (`I-A-2`'s O_EXCL open,
`I-D-1`'s MCP text-channel ban) because they pin a stable forbidden
*primitive*, not an identifier's spelling. The version-literal scan (`I-C-2`)
now rejects any quoted `vX.Y.Z`-shaped literal unconditionally, rather than one
built from the currently-installed version.
[Phase 0 corrections trace](../reasoning/2026-09-03-onboarding-hardening-phase0-corrections.md)
