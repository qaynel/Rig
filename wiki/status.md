# Status - checked 2026-08-25 (updated 2026-08-25)

## RIG-131 ready for commit (2026-08-25)

`scripts/check-ticket-traceability.js` is wired into `test:code` before the
Node glob. Completed-column cards now name a present test or `manual:`.
RIG-104 / RIG-105 / RIG-107 moved Backlog with stated reasons. Named suite:
`tests/ticket-traceability.test.js`. Later pre-v5 red suites (126/127/128/134)
are out of this ticket's scope.

## Implementation packets in flight for the pre-v5 release gate (2026-08-25)

The owner asked that every pre-v5 fix be offboarded onto its ticket so a
lower-reasoning implementation model can work without reconstructing the
investigation. In flight: turn the existing finding classification into
self-contained packets with the chosen behavior, touched seams, explicit
non-goals, deterministic acceptance cases, exact red-test targets, fixtures,
and the completion command. The owner-signed oracle remains unchanged; these
are unsigned, behavior-focused tests that the implementation model writes red
before each leaf fix.

Completed: implementation packets now live on RIG-125, RIG-126, RIG-127,
RIG-128, RIG-129, RIG-131, RIG-132's pre-v5 ratchet slice, and RIG-134. They
name the public path and production seam, the exact files to add, test titles,
fixture state, required observable assertion, forbidden shortcuts, and narrow
then-full verification command. The committed red baseline now includes the
named traceability, descriptor, write-safety, uninstall, onboarding, claim, and
ratchet suites; the remaining failures are all missing production behavior,
not fixture or syntax failures. Gate-2 onboarding seams record the chosen
`host-review` and explicit `select` contracts. The required approval remains a
real host-native or external-signature boundary; test fixtures isolate that
separate issuer and do not authorize production code to fabricate a receipt.
No production code or owner-signed oracle changed in this offboarding pass.

Every pre-v5 ticket in Coding now has a bounded solution packet, an explicit
`## Acceptance` section, and a committed exact-test reference for each
observable condition. The pre-v5 gate suite executes every mapped leaf suite,
so it can turn green only when the whole release-scoped set is green. The
linked-worktree uninstall regression is included in that set. The focused
baseline is intentionally red only on unimplemented behavior; no production
code or owner-signed oracle changed in this completion pass.

## Owner approved Option A — pre-v5 gate offboarded for a low-reasoning model (2026-08-25)

The owner approved **Option A** of [[RIG-134]]: classify every known finding as
`v5-observable` or `debt`, fix (or downgrade) the observable set before v5.0.0,
defer the debt to the v5.1 migration inventory. Then asked for every gate fix to
be tracked as a ticket with enough context that a **lower-reasoning model** can
execute it without re-deriving the investigation.

Done this session (report-only; no code, no frozen-oracle edit, nothing signed):

- **The classification was run.** Every finding across [[RIG-126]] / [[RIG-127]]
  / [[RIG-128]] / [[RIG-129]] is tagged `v5-observable` or `debt` with one line of
  evidence, on each ticket and collected in the runbook. Full table + the ordered
  low-model task list + the exit condition:
  [[2026-08-25-prev5-gate-runbook-and-classification]].
- **The pre-v5 must-fix set** (the `v5-observable` findings) is: 134.1
  (`contractFor`, covers 128.1/128.2 and the shipped descriptor of 128.3), 128.4
  + 128.5 (JSON5 clobber / fail-closed writer), the whole uninstall cluster
  127.1–127.8 + 127.10 (127.9 already fixed), the onboarding cluster 126.1–126.4,
  and 129.1 (pi's false MCP claim → correct or downgrade to `unknown`). Plus
  [[RIG-131]] and the raw-field allowlist ratchet ([[RIG-132]] pre-v5 slice, which
  is also the debt inventory).
- **Scope note for the owner:** Option A pulls **most of the uninstall and
  onboarding clusters into the release**, exactly as predicted — uninstall writes
  to the user's repo by definition, so almost every 127 finding is observable.
  That is the real cost of A and it is now visible as a bounded leaf-fix list, not
  an open-ended review.
- **Board + tickets updated:** [[RIG-131]] and [[RIG-134]] moved Backlog → Coding
  (owner-approved); 126/127/128/129 tagged gate-scoped for the observable half;
  [[RIG-132]] (full collapse) / [[RIG-133]] / [[RIG-125]] / [[RIG-130]] stay
  post-v5 except RIG-132's pre-v5 ratchet slice.

**Execution order for the low model:** [[RIG-131]] → 134.1 → the observable leaf
fixes (127 cluster, 126 cluster, 128.4/128.5, 129.1) → commit the debt inventory
+ ratchet → re-run the gate → ship v5.0.0. Each step's exact files, fix shape,
and acceptance test are in the runbook.



## Session record — the 2026-08-25 structural investigation

The whole arc of this day's work in one trace, including the owner's questions as
asked, the three points where the analysis corrected itself, and the evidence
commands with their output:
[`2026-08-25-structural-investigation-session-record`](reasoning/2026-08-25-structural-investigation-session-record.md).

A session picking this up cold should start there, then read the five
sub-traces it indexes and the two outside documents under `sources/reference/`.
The sections below are that day's conclusions in the order they were reached
(newest first).

## Pre-v5 classification run — one confirmed release blocker, and a correction (2026-08-25)

Second outside analysis assessed
([source](sources/reference/branch-by-abstraction-migration.raw.md),
[assessment](reasoning/2026-08-25-prev5-classification-and-migration-pattern.md)).
It answers the before-or-after-v5.0.0 question: **ship v5.0.0 behind a ratchet,
migrate the spine in v5.1 as Branch by Abstraction / Parallel Change (Expand →
Migrate → Contract).** Accepted — and it dissolves the question rather than
answering it, because my framing assumed "after" meant a big-bang v5.1. It does
not: the system stays releasable at every commit of the migration. That matters
here specifically, since bulk authoring is one of the five mistakes named in the
first-attempt retrospective.

**Its release-blocking exception was run, and the result splits.**

- **BLOCKER, confirmed — [[RIG-134]] 134.1.** `rig apply` (printed by
  `rig/bootstrap.sh:131`) → `applyPlan`:197 → `materializeHostAdapters`:435 →
  `contractFor` writes `.rig/host-contracts/<host>/<axis>.json` **into the
  user's repository**, reading `REGISTRY` raw so the three product overrides
  never apply. Antigravity's emitted descriptor advertises `config_scope: repo`
  at `.agents/mcp_config.json`, contradicting RIG-105's owner-approved
  manual-only decision. Wrong files, under a supported capability. Bounded leaf
  fix before ship — **not** a licence to pull the collapse into v5.0.0.
- **DEBT, defer — 134.2, and this corrects the wiki.** `materializeSelectedHosts`
  has **zero production callers**; only `advanced-hosts.test.js` and the signed
  oracle reach it. Earlier analysis on this branch named it as the live shipped
  divergence and called RIG-104's Done claim "false in shipped code" — overstated
  for that function; it ships nothing. Verified by execution that the live write
  path (`renderers.js` → `MCP_HOSTS`) honours all three overrides: antigravity
  `autoWrite:false`, no renderer, absent from `AUTO_WRITE_HOSTS`; codewhale repo
  `.codewhale/mcp.json`; pi `unsupported` with the legacy file preserved.
  RIG-104's unification claim is still unmet — the unmet half is the descriptor
  path, not the write path. RIG-125 and RIG-128 corrected; traces stay as
  written.
- **134.3 — the sharpest finding.** One of the **68 signed acceptance cases**
  tests `materializeSelectedHosts`, a function with no production caller, while
  `contractFor` — which writes into user repos — has no signed case at all. The
  signature is spending a capped, ceremony-gated budget certifying dead code.
  Strengthens RIG-133. Also shows why `runtime-caller-graph.test.js` can't catch
  it: it checks *modules*, and `host-capabilities.js` has production importers
  for its other exports.

**Two corrections to the migration plan as given.** (1) The pre-v5 ratchet cannot
reference `HostContract`, which arrives a phase later — the implementable form is
a grandfathered allowlist of modules permitted to read raw `REGISTRY` fields,
which may only shrink, and which doubles as the migration's progress bar. (2) The
debt inventory must *be* the allowlist, not a second artefact — otherwise the
de-duplication programme opens by duplicating a fact.

**Also taken verbatim into RIG-132:** *"Consumers may consume semantic results,
but may not independently interpret semantic inputs."* Better than "one authority
for the meaning" because it is a prohibition on a consumer, which a fitness
function can check.

**Sequence: RIG-134 (pre-v5 gate) → RIG-131 → ship v5.0.0 → RIG-132 → RIG-133 →
RIG-125 → 126/127/128**, RIG-130 alongside, RIG-129 in parallel. Report-only; no
code changed, nothing signed, nothing committed.

## Outside analysis assessed — four accepted, two declined (2026-08-25)

The intent owner supplied an outside architectural analysis against the
"escaping the quadratic" trace. Held verbatim at
[sources/reference/normalized-semantic-architecture.raw.md](sources/reference/normalized-semantic-architecture.raw.md);
assessment at
[2026-08-25-semantic-model-assessment](reasoning/2026-08-25-semantic-model-assessment.md).
Its thesis: *author intent once; derive everything else; force all behaviour
through one small contract; mechanically prevent the architecture from expanding
back out* — DRY-as-stated + semantic model / model-aware generation + narrow
waist + property-based testing + architectural fitness functions.

**Accepted, and it changes tickets:**

1. **"One home per fact" was the wrong goal, and this repo proves it.** `REGISTRY`
   already *is* a single source of truth; `mcp-hosts.js` applies the overrides and
   `materializeSelectedHosts` re-interprets the same raw rows without them. One
   home, two meanings, gate green. The goal is **one authority for the meaning**,
   with runtime/docs/tests as generated projections through one narrow contract.
   RIG-132 retitled accordingly.
2. **Contract conformance beats reachability.** The loop-breaker property is
   *"all host-specific behaviour flows through the host contract"*, not *"every
   module has a production caller"* — the latter is rung 2 of our own proxy
   ladder and is green today while the divergence is live. Conformance covers
   host 20 before host 20 exists. RIG-125 updated.
3. **Provenance is a modelled enum, not prose.** `verified | unsupported |
   unknown` plus an evidence receipt in the host model; generation refuses to
   emit "supported" without `verified`. Makes undocumented certainty about
   third-party behaviour unrepresentable rather than reviewable. RIG-129 updated.
4. **The stopping rule was wrong.** "New-class rate zero across two rounds" is a
   *confidence criterion*, not the definition of done — promoting it repeats the
   clean-pass error one level up. Completion is the conjunction of the structural
   conditions; two clean rounds corroborates. RIG-130 relabelled.

**Declined:**

- **Seven numbered fitness functions, a normative-intent layer, and a name for
  the architecture.** The first-attempt retrospective lists over-engineered
  governance and mechanism-before-leaf among the five named mistakes; that is
  this shape exactly. Take **two** fitness functions — no second semantic
  authority, no bypass of the host contract — write the rest as ordinary tests,
  and do not name an architecture that does not exist yet. Adopt the established
  *terms* (semantic model, narrow waist, property-based testing, fitness
  function); do not erect a regime.
- **RIG-131 fourth.** It is the check that a Done claim resolves to a green
  test, and 132/133/125 are large pieces of work agents will mark Done. Landing
  it last means the whole structural programme is recorded as complete in agent
  prose — the exact mechanism behind RIG-104/105/107. It is also the cheapest
  item on the board. It goes first.

**Two constraints the source does not know about:** Tier 1 stays markdown-only in
installed repos (the semantic model is a build-time artefact here, never a
shipped runtime), and this branch is finishing v5.0.0 — the target architecture
is a spine rewrite, so before-or-after-release is a real decision with real cost
either way.

**Working order: RIG-131 → RIG-132 → RIG-133 → RIG-125 → 126/127/128**, with
RIG-130 alongside and RIG-129's first-wire inventory in parallel. Report-only;
no code changed, nothing signed, nothing committed.

## How this closes — the exit criterion (2026-08-25)

Third pass of the same investigation, answering *"is there an established
principle, and how do we come to a close?"* Filed verbatim as
[escaping the quadratic](reasoning/2026-08-25-escaping-the-quadratic.md).

**The escape is not on the review side.** More passes sample; better reviewers
buy a constant factor against 7,600; a deterministic reviewer samples the *same*
0.4% forever. The only moves that terminate change the size of the space.

**The principles, all established:** DRY as actually stated (a single
authoritative representation of *knowledge* — satisfied by generation, not by
comparison); make illegal states unrepresentable; the narrow waist (M×N
agreements become M+N conformances — exactly the host-matrix problem, and
`materializeSelectedHosts` bypassing `MCP_HOSTS` is a producer that went around
the waist); correct-by-construction plus a ratchet.

**The strongest evidence is in-repo.** `scripts/build-openclaw-skills.js` and
`scripts/build-review-doctrine.js` already run generate-then-verify, and say so
in their headers ("so the ruleset never drifts" / "can never drift"). **Neither
of those two facts has ever produced a review finding.** All findings come from
the ten facts handled by comparison guards or nothing. So RIG-132 is "apply the
pattern we already run to the rows without it" — mechanical and finite, not a
philosophical change.

**Four defect classes, four terminating moves** — duplicated fact → generate;
unreachable/miswired module → one reachability property over the shipping path;
spec↔code drift → Done bound to a named green test; unverified external claim →
a first wire, because review cannot close those at all under any budget.

**New ticket RIG-133.** The owner signature byte-pins
`tests/advanced-oracle.test.js`, an enumerated list of 68 samples. Pinning an
enumeration caps the checked surface at sign time while `rig/lib` grows, charges
a re-sign per coverage increase (3 in 20 commits), and already halted an agent
("I cannot edit that test file without invalidating the owner's signature"). Sign
the **properties + the case generator** instead; costs one re-sign, shared with
RIG-120's.

**The stopping rule, replacing "the last review came back clean":** (1) every
fact has one home, ratchet green; (2) every Done card names a green test; (3)
**new-finding-class rate zero across two consecutive rounds**; (4) every external
capability claim has a first-wire receipt or is downgraded in shipped docs. A
quiet round with 1/2/4 unmet is the state this project has been in for six
rounds.

Board: RIG-133 raised. RIG-132 gained the in-repo precedent and the ratchet
framing (a collapse without a ratchet re-inflates — `192f35e` "Unify MCP renderer
dispositions" ended with a third table). Sequencing unchanged: RIG-132 →
RIG-125 → 126/127/128, RIG-130/131 alongside, RIG-129 in parallel. Report-only;
no code changed, nothing signed, nothing committed.

## Why every pass finds new issues — measured, and it is quadratic (2026-08-25)

Second pass on the owner's question, from the git trace and the receipt anchors.
Filed at [[2026-08-25-why-each-pass-finds-new-issues]]. Report-only; **no code
changed, nothing signed, nothing committed.** Full gate re-verified green
(438 root / 15 pi-extension / 6 rig-mcp).

**Correction to the earlier framing.** The first trace said reviews sample a
large *static* pool. Measured, that is wrong and the truth is worse: the pool is
**quadratic in the number of places a fact can live, and every fix grows it.**

Every finding this project has ever received — spec or code — is **pairwise**:
"§X says A, §Y says B." Consistency belongs to a *pair*, not a location. The spec
carries ~124 claim anchors (79 sections, 37 `AD-`, 68 `AT-`, 19 `D`) ≈ **7,600
pairs**; a pass reports 2–8. Six rounds covered ~0.4%.

The receipt anchors prove the mechanism rather than implying it: the same
sections recur across rounds paired with **different partners** each time —
`§8.4` in rounds 3 and 5, `§5.7`/`§8.9`/`§11.3` in 4 and 5, `§13` four times in
round 5 and again in 6. §8.4 was not fixed wrong; it was reconciled with one
neighbour and later found inconsistent with another.

Also worth noting: 6 of the 7 receipts are **specification** reviews of
`technical-spec.md`, not code reviews. The code side is the same shape with
implicit cross-references, and the git trace dates the pairs — the second
uninstaller has been in the tree since **July 2026**, through every review ever
run. Two round-3 findings were introduced by commits that were themselves fixes
for earlier findings (`192f35e` "Unify MCP renderer dispositions" added a third
MCP table; `35fc852` RIG-107 printed a sequence with no producer).

**The losing move, in one file.** `scripts/check-rule-copies.js` guards 7 copies
of the rule body, cannot guard the 8th, falls back to 8 substring canaries, and
carries the comment *"Upgrade path: generate the copies from SKILL.md"* — the
correct fix, written down and not done. 60 tracked files have a byte-identical
twin. Guards cost O(1) per pair somebody noticed; the pairs are O(N²).

**Board.** New ticket [[RIG-132]] — one home per fact, generated everywhere else;
new duplication ships with its generator or does not ship; carries the
duplicate-fact inventory with guard status. **Sequencing changed:** [[RIG-132]]
now precedes [[RIG-125]] (property tests over a collapsed N are near-exhaustive;
over today's N they are another sample), with [[RIG-130]]/[[RIG-131]] alongside,
then 126/127/128. [[RIG-125]] gained a sequencing-correction section. New traps
recorded for the guard-vs-generator move and for fixes that create the next
finding.


## Structural root-cause investigation done — two new loop generators ticketed (2026-08-25)

Owner asked why every review round props up new bugs. Answer filed at
[[2026-08-25-structural-nondeterminism-root-cause]]. Report-only analysis plus
wiki/ticket updates; **no code changed, nothing signed, nothing committed.**

**The finding.** The symptom is not unstable code. Across seven review receipts
the specific findings never recur (each fix is guarded by a named case in
`tests/release-blockers.test.js`, 38 of them) and the per-round counts never
fall — round 5 is the worst round, after four rounds of correct fixes. That is
sampling from a pool nobody drains, not regression.

Four generators, verified first-hand in code, not read off the wiki:

1. **Acceptance is signed at the unit seam and frozen there.** All **68**
   acceptance cases load through `api(file, name)` — one module, one exported
   function; **5 of 65** oracle tests reach the shipping path. Every round-3
   finding is a composition property that seam cannot express. The file is
   byte-pinned, so the check surface cannot grow while `rig/lib` does.
2. **Every previous fix for the loop was a new proxy.** inventory → behavior →
   "has a production caller". Rung 3 now: `mcp-hosts.js` has exactly one importer
   (`renderers.js`); `materializeSelectedHosts` reads `REGISTRY` directly.
   [[RIG-104]]'s Done claim is false in shipped code, with the full gate green.
3. **The review loop has no memory**, so convergence is unmeasurable.
4. **The claim surface (19 hosts x 5 axes, zero first wires) dwarfs the verified
   surface**, and `contradiction` is the modal finding category.

**Board changes.** Two uncovered generators raised as new tickets — [[RIG-130]]
(finding-class ledger + convergence metric) and [[RIG-131]] (Done must name a
green test, with a `npm test` checker). Both cheap, both OPEN, neither approved
for Coding. Existing tickets expanded rather than duplicated: [[RIG-125]] gained
the root cause beneath its symptom (its four loop-breaker tests must land
**inside** the signed oracle under [[RIG-120]]'s re-sign, not beside it, plus the
proxy-ladder table); [[RIG-110]] gained the claim-surface framing that raises its
priority without changing its recommendation. [[RIG-126]]/[[RIG-127]]/[[RIG-128]]
/[[RIG-129]] left as-is — genuinely separate deliverability/documentation issues.

**Recommended order** (changes the existing playbook): [[RIG-130]] + [[RIG-131]]
first — cheap, and they make RIG-125's result stick and measurable — then
[[RIG-125]], then 126/127/128 under its tests, 129 alongside.

Hubs updated: [[testing-strategy]] (the proxy ladder), [[review-receipts]] (no
memory), [[agent-working-conventions]] (Done is not evidence),
[[host-and-ci-coverage]] (claim surface), [[distribution-and-release]] (no
stopping rule). Three new entries in `index/traps.md`.

## Round-3 receipt findings mapped onto existing tickets (2026-08-25)

Did not mint new IDs — that would duplicate [[RIG-125]]–[[RIG-128]]. Wrote
the finding→ticket map, what the round-2 RIG-120 diff did and did not
change, and a next-agent playbook at
[[2026-08-25-rig120-round3-finding-map]]. Decision briefs added on
[[RIG-125]], [[RIG-126]], [[RIG-127]] so they can be approved for Coding
without this chat. [[RIG-127]] §127.9 (OpenClaw short-circuit) marked
fixed; §127.8 promoted to major; §127.4 path-only progress noted.

## RIG-120 round-2 defects fixed; round-3 receipt failed (2026-08-25)

The three assigned round-2 majors are fixed in the worktree. Full gate is
green: **438** root / **15** pi-extension / **6** rig-mcp. Frozen oracle hash
unchanged (`ffd5041a3ea91860a05a849aeee61d70e0bd5a1f0acffc8d341996a9f309cc58`).

The independent Codex receipt (same wrapper as round 2, base `origin/prod`)
returned **fail**. The original three majors did not reappear. The eight
findings are the already-open [[RIG-125]]–[[RIG-128]] cluster — **no new
ticket IDs**. Agent-ready decision briefs are on those tickets. Map:
[[2026-08-25-rig120-round3-finding-map]]. Verbatim JSON:
[[2026-08-25-rig120-review-round3-receipt]]. No receipt file on disk.

Owner re-sign and `v5.0.0` tag were not attempted. Next needs an owner
call: keep v5.0.0 scoped to the original three and treat the new findings
as the already-open tickets, or expand this release to close them first.

## Wiki architecture map + de-dup pass done (2026-08-25)

Added a new top-level [[architecture]] front-door page — a code-structure map
(concept → file/dir) so an agent can navigate the code through text instead of
grepping — then ran a de-dup/format-normalization pass over the hubs. Design
approved in chat and filed at [[2026-08-25-wiki-architecture-map-and-dedup]].

**Phase 1:** [[architecture]] written (orientation + whole-tree directory table +
`rig/lib`-by-concern and `scripts` file tables + tests-by-area — every entry links
to the hub that explains *why*, duplicating none of the reasoning). Wired into
`Home.md`'s front-door line and page-kinds framing; `CLAUDE.md`'s Architecture
section now points to it instead of standing alone. All internal links verified.

**Phase 2:** heading vocabulary normalized to the canonical six across all 28
hubs (`Why`→`Why it is this way`; `Remaining work`/`What's still open`→`What is
still open`); content-bearing mechanism sections (`Current implementation`,
`Shipping payload`, `Validation`, `Standing`, …) kept rather than force-fit.
Reshaped the one true outlier `enforcement-and-git-dispatch-wiring` from a wiring
log into a proper hub that links to [[action-evaluator]]/[[one-use-approvals]]
instead of re-explaining one-use approvals. Fixed the found defect: that hub was
missing from `Home.md`'s topic list (Home said 27; there were 28) — now listed,
count corrected. `status.md`'s historical log left untouched by design. No code,
no frozen-oracle edit; wiki-only.

## Blocked-ticket decision briefs offboarded (2026-08-25)

Added a standardized **"Decision brief — offboarded 2026-08-25"** block to the
top of all seven Blocked tickets (RIG-110, 112, 113, 115, 116, 120, 122) so the
owner can unblock each tomorrow against a low-reasoning agent without chasing
context. Each brief states the single decision, the concrete options in a
blast-radius table, one recommendation (chosen for least blast radius / no
cascade), and the exact next action a low-reasoning agent runs once the owner
picks. Briefs link into the existing graph (topics, `[[status]]`, sibling
tickets, reasoning traces) rather than duplicating the reconciliation bodies
already on each ticket. Keystone is [[RIG-120]]: RIG-122 and RIG-116 auto-unblock
once the release ships; RIG-112/113/115 batch their oracle changes into RIG-120's
single owner re-sign ceremony; RIG-110's recommended path (pointer-only beta
roster) needs no vendor access. No code, no frozen-oracle edit.

## RIG-124 implemented, ready for commit (2026-08-25)

All three token-burn fixes landed on this branch (`qa-prod-finishing-up`), not
yet committed: `scripts/review-receipt.js` now enforces a one-re-review cap
per `--author-context` in the script itself (a sibling `<out>.attempts.json`
state file), adds a cheap-model `--interim` mode that never writes the binding
receipt, and `--force-rereview` as an explicit override; `rig-tdd`'s red/green
inner loop is `npm run test:rig`/a single test file, full gate once before
push (synced to `.claude/skills/rig-tdd` and `.agents/skills/rig-tdd`);
`rig/tier-1/routing.md` gained a "Task weight" section carving out a
lightweight path for single-step, single-file, non-wiki-truth-changing tasks,
cross-referenced from `CLAUDE.md`. Confirmed no Gate 1 re-sign is needed —
neither touched file is in `wiki/gate1/testing-infrastructure.manifest`, and
the frozen `AT-GATE-3` test doesn't touch the wrapper's CLI. New test coverage
in `tests/release-blockers.test.js`; full gate green (434 root / 15
pi-extension / 6 rig-mcp). See [[2026-08-25-rig124-implementation]] for the
design and the declared inferences. Ticket moved Backlog → Ready for Commit on
[[Tickets]]. Next: user decides whether to commit/push.

## RIG-122 blocked behind the published release (2026-08-24)

The thirteenth and final Coding ticket was reconciled without implementation.
Its owner-approved scope is explicitly post-release. RIG-107 is resolved, but
RIG-120 has no passing independent review, is paused on three confirmed release
defects, and still precedes owner signing plus `v5.0.0` publication. Creating
the optional wiki graft now would violate that sequencing. RIG-122 is Blocked
until RIG-120 is Done and the release exists; its decided plain-Markdown,
runtime-free, Obsidian-optional contract is preserved for resumption. No Coding
cards remain.

## RIG-119 folded spec-driven flow ready to commit (2026-08-24)

The twelfth sequential ticket is resolved and moved to Ready for Commit. The
router sends spec-driven requests through grilling and product design, with no
new skill. Grilling names the five checkpoints and product design owns code-
grounded technical interrogation. The acceptance case plus bootstrap/copy suite
pass 9/9, native-host copies match their canonical sources, and fresh review
found no ticket-scope blocker. The final gate verifies the protected 68-case
oracle and passes 431 root, 15 pi-extension, and 6 rig-mcp tests. RIG-122 may
now open from fresh context.

## RIG-105 manual Antigravity MCP flow ready to commit (2026-08-24)

The eleventh sequential ticket is resolved and moved to Ready for Commit. It
renders an exact selected-server stdio JSON block for manual merge into
Antigravity's user-global config and prints an installed host-check command.
The check validates exact receipt-bound entries, supports the shipped
receipt-free `rig` entry, and fails visibly on missing, malformed, or drifted
configuration. Rig does not write the global file while upstream CLI issue #60
remains open. Fresh review found no ticket-scope blocker. The final gate
verifies the protected 68-case oracle and passes 430 root, 15 pi-extension,
and 6 rig-mcp tests. RIG-119 may now open from fresh context.

## RIG-120 paused mid-remediation — handoff written (2026-08-24)

Resumed RIG-120 (the fourth attempt at a passing independent release review).
Round 1 found and fixed a real defect: a failed dependency install during the
OpenClaw opt-in left a dangling ledger entry that permanently bricked both
uninstall and retry — fixed in `rig/lib/openclaw-mcp.js` with two new
regression cases in `tests/release-blockers.test.js`; full gate confirmed
green (426/15/6) before moving on. Round 2's review on those fixed bytes
rejected again with three new, independently-verified major findings: an
uninstall abort-on-one-entry bug that skips removing everything else, not
just the stuck piece; a security-relevant gap where the credential backup
store is written to a committable path instead of the clone-local directory
the design requires, with no `.gitignore` protection at all; and two
production functions (`resumeInstall`, `verifyRemoval`) that the frozen
acceptance tests call directly but no shipping code path reaches, so a real
defect in the shipping equivalents wouldn't fail those tests. Paused here on
explicit request before fixing those three — full verbatim findings,
verification notes, and the exact fix shape for each (including the one
frozen-test boundary that must not be crossed without an owner re-sign) are
recorded in
[reasoning/2026-08-24-rig120-review-round2-findings.md](reasoning/2026-08-24-rig120-review-round2-findings.md).
Nothing from this session is committed yet. No valid review receipt exists
on disk — the round-2 wrapper run failed the verdict gate and never wrote
one. Next Coding session should read that reasoning trace first and resume
at its "Next steps" list.

## RIG-116 blocked until post-beta demand evidence exists (2026-08-24)

The tenth sequential ticket was reconciled without code changes. Its governing
roadmap requires Context/Evidence promotion after beta, prioritized by observed
leaf use under ordinary owner review. There are no beta selection receipts or
approved demand rankings in the repository, the release is still blocked, and
the reusable lint-format consent template is also blocked. Guessing that
Development or Testing is highest demand would fail the ticket's own
acceptance. RIG-116 is Blocked until those prerequisites exist; the next Coding
ticket may open from fresh context.

## RIG-115 blocked on granular shell-trust policy and re-sign (2026-08-24)

The ninth sequential ticket was reconciled without changing the frozen oracle
or runtime. Broad signed cases already cover selection consent, exact plan
digests, partial coverage, mutation detection, separate autofix approval, and
the outer argv boundary. The ticket's requested deterministic profile still
marks approval lifetime, filesystem/environment isolation, memory limits, and
symlink behavior as assumptions, and requests network denial the current
runner does not enforce. The owner must approve or amend those concrete
guarantees and re-sign their acceptance/tests before implementation. RIG-115
is Blocked; the next Coding ticket may open from fresh context.

## RIG-114 semantic discovery ready to commit (2026-08-24)

The eighth sequential ticket is resolved and moved to Ready for Commit.
Repository discovery no longer has a depth ceiling or fixed npm-script names;
it derives component commands from non-standard tasks, tool configs, known
polyglot workflows, and open-ended role declarations with exact argv, cwd,
ignore metadata, and source digests. Ambiguity blocks apply for user choice,
while unbuildable components are named unprotected and suppress the repository
support claim. Fresh review found no ticket-scope blockers. The final full gate
verifies the signed 68-case oracle and passes 425 root, 15 pi-extension, and 6
rig-mcp tests. The next Coding ticket may now open from fresh context.

## RIG-113 blocked on owner lint policy choices (2026-08-24)

The seventh sequential ticket was reconciled without code changes. Drafts
already define five ranked ecosystem lists, EOL/coverage signals, proposal
conditions, explicit approval, and generated file scopes. They are not frozen
product policy or runnable acceptance: the owner still must approve/amend the
rankings and signals, and choose whether replacement uses the draft
`<file>.rig-backup` convention or Rig's existing preimage lifecycle. RIG-113 is
Blocked on those inputs and the resulting oracle re-sign; RIG-114 may now open
from fresh context.

## RIG-112 blocked on intentionally deferred owner freeze (2026-08-24)

The sixth sequential ticket was reconciled without code changes. The existing
signed authored-service gate enumerates exactly 115 catalogue leaves, rejects
generic IDs/placeholders/duplicate bodies/missing ownership and applicability,
and currently returns zero failures; it runs in the green full CI gate. The
remaining ticket criterion is the catalogue freeze itself. D27 and the ticket's
owner ruling explicitly defer that non-delegable re-signing ceremony until the
owner accepts the final contract, acceptance, and tests. RIG-112 is Blocked on
that future owner action; the next Coding ticket may be opened fresh.

## RIG-111 user-global contracts ready to commit (2026-08-24)

The fifth Coding ticket is resolved and moved to Ready for Commit. Exact
current contracts and one attributed merge/remove writer now cover
Windsurf/Devin Desktop legacy Cascade, Cline IDE, Hermes, and CodeWhale.
Multi-repository, repeat-apply, malformed-input, changed-value, forged-path,
and uninstall behavior is executable. Fresh review tightened empty identifier,
unknown ledger kind, malformed ledger, incompatible YAML, and exact current-
home validation. The final full gate verifies the signed 68-case oracle and
passes 422 root, 15 pi-extension, and 6 rig-mcp tests. Activation intentionally
remains note-only behind RIG-110. The next Coding ticket may now be opened from
a fresh recovery checkpoint.

## RIG-111 implementation passed focused verification (2026-08-24)

The fifth sequential ticket now has exact, primary-source-checked user-global
MCP contracts for Windsurf/Devin Desktop legacy Cascade, Cline IDE, Hermes, and
CodeWhale. One shared writer uses install-ID-scoped server keys, preserves
unrelated content, is byte-idempotent, and fails closed on malformed JSON,
unsupported YAML, changed owned values, or forged ledger paths. Both uninstall
paths remove only the matching attributed entry. The focused RIG-111 and shared
lifecycle suites pass 42/42. Activation remains note-only behind RIG-110; next
is the full `npm test` gate and a fresh diff review before board promotion.

## RIG-110 blocked on real vendor wires and roster decision (2026-08-24)

The fourth Coding ticket was reconciled without changing code or weakening its
acceptance criteria. The authoritative host-coverage spec still marks all 19
host and six CI executable contracts/first wires pending, and the repository
contains no dated real-wire result bundles. Existing registry and byte-landing
tests are fixture evidence only; the frozen acceptance contract explicitly
requires real vendor execution. RIG-110 is therefore Blocked until the owner
decides the beta executable versus pointer-only roster and supplies access to,
or dated results from, the retained host/CI environments. The next Coding
ticket may now be opened from a fresh recovery checkpoint.

## RIG-109 shipping-path evidence ready to commit (2026-08-24)

The third Coding ticket was reconciled from fresh context and moved to Ready
for Commit without new code. Its dependency is already complete: active-runtime
bootstrap drives lint-format plan/apply/check through the installed command,
and the runtime caller work adds tagged-release inspection, installed commit
validation, managed graft, MCP enforcement, and review-wrapper evidence. The
testing record now distinguishes this real reachability proof from the narrower
remaining limit that no single tracer proves every behavior. Focused public-seam
checks pass; the immediately preceding full gate is green at 414 root, 15
pi-extension, and 6 rig-mcp tests.

## Final release-review remediation verified; receipt next (2026-08-24)

The ownership and disclosure blockers from the final independent review are
fixed. Reinstall and uninstall now require the current native registry value to
exactly match Rig's recorded server before they can replace or remove it; a
failed reinstall restores the prior Rig value rather than deleting it; and the
bootstrap warning uses the same configured path passed to the native CLI. The
review-specific regressions, existing lifecycle suite, and release installer
path pass 94/94 focused cases. The latest review also found that the installed
MCP runtime fell back to a shortened rule set because its canonical rule file
was not in the active-delivery payload. The payload now carries that file at
the runtime hook's expected path, covered by a shipping-payload regression.

Focused release and acceptance checks pass 95/95. The full release gate is
green on these bytes: 415 root checks, 15 Pi-extension checks, and 6 MCP
checks. Next: produce a fresh independent receipt bound to this stable
worktree; do not change publishable bytes after it is issued.

## RIG-108 runtime callers ready to commit (2026-08-24)

The second Coding ticket is resolved and moved to Ready for Commit. All four named modules
now have production seams: enforcement through MCP rendering/policy, release
evidence through the review wrapper, managed grafting through catalogue apply,
and commit dispatch through the installed runtime command. The existing bare
catalogue pointer migrates into one named managed block without duplication.
A repository-wide runtime caller-graph guard and focused behavioral suites are
green. Fresh review found and fixed journal-bypassing legacy migration and
over-broad managed-block uninstall; the exact legacy frozen case remains green.
The final full gate verifies the signed 68-case oracle and passes 414 root, 15
pi-extension, and 6 rig-mcp tests. No work remains in RIG-108.

## OpenClaw release remediation ready for owner re-signature (2026-08-24)

The failed release receipt's OpenClaw lifecycle findings are fixed. Rig now
requires a successful native registry read before it installs dependencies or
writes a global entry; a failed `mcp set` immediately attempts native rollback;
and a rollback failure remains in the local pending ledger so uninstall retries
native removal before it can remove the runtime. The release-installer fixture
now models the vendor's successful registry read, and focused release tests
cover both a failed read and a set that mutates before reporting failure.

Focused checks are green (91/91), but the strengthened release-installer test
changes the signed test snapshot. Next: owner re-signs the unchanged intent and
acceptance contract with the refreshed test snapshot, then the agent runs the
full release gate and a new independent receipt on the stable release bytes.

The separately active runtime-entrypoint work is now complete and its full gate
is green. Release verification remains governed by the OpenClaw re-signature
and receipt steps above, not by the entrypoint ticket.

## RIG-107 runtime entrypoint ready to commit (2026-08-24)

The first Coding-column ticket is resolved and has moved to Ready for Commit.
Active-runtime
installs now journal an executable `.rig/bin/rig` shim and print the staged
workflow. A new black-box regression installs it, plans and applies lint-format
through it, and executes the installed check; the tagged-archive regression now
invokes inspection through the same public command. That tracer also found and
fixed discovery treating Rig's own `.rig` packages as customer components.
Focused installer, payload, lint-format, and release-byte suites are green. The
post-review full gate verifies the signed 68-case oracle and passes 408 root,
15 pi-extension, and 6 rig-mcp tests. No work remains in RIG-107; the next
Coding ticket may now be opened with a fresh recovery checkpoint.

## Release receipt found OpenClaw failure-path blockers (2026-08-24)

The final independent release review did not pass. It found that a failed
OpenClaw ownership probe is treated as proof that no server exists, and that a
failed `openclaw mcp set` may leave a newly written global server entry while
the pending ledger entry is skipped during uninstall. Those paths can leave a
global server pointing at a removed runtime. The release is blocked until both
native-command failure paths fail closed, pending registration state is safely
reconciled during uninstall, and the shipped installer tests prove those cases.

Next: fix the shared OpenClaw registration/removal flow, add focused failure
coverage, rerun the full release gate, and obtain a new independent receipt on
the resulting bytes.

## Ready board reconciled with branch commits (2026-08-24)

The four MCP-related tickets that were still sitting in the ready column but
already have commits in this branch are now marked Done on the board:
RIG-101, RIG-103, RIG-104, and RIG-106. The OpenClaw opt-in stays in Ready for
Commit because its implementation is still only in the working tree, not in the
branch history yet.

## RIG-102 resolved; blocked card was stale (2026-08-24)

The CI gate now runs `npm test --prefix rig-mcp`. The matching signed test
snapshot and manifest digest are present, the owner re-signing ceremony is
complete, and the oracle verifies. The current rig-mcp suite passes 6/6. The
duplicate blocked board entry was removed; RIG-102 remains in Done.

## v5.0.0 release bytes ready for independent receipt (2026-08-24)

The independent review's OpenClaw lifecycle findings were addressed and then
tightened after a second review pass. OpenClaw registration now runs inside the
payload transaction before the install journal is marked complete;
`.rig/global-writes.json` is written through the shared append-only journal as
pending/applied state; `npm ci` installs into a temporary runtime and only
journal-copies `node_modules` after success; successful unregister removes the
ledger instead of creating a digest mismatch; and failed `openclaw mcp unset`
stops teardown with `.rig/global-writes.json`, the install journal, and the
referenced runtime retained for retry.

Focused release checks are green:
`node --test tests/release-blockers.test.js`,
`node --test tests/advanced-oracle.test.js --test-name-pattern 'OpenClaw MCP opt-in'`,
`node --test tests/basic-uninstall.test.js tests/basic-uninstall-merge.test.js`,
`node --test tests/rig-bootstrap.test.js tests/basic-payload-gating.test.js tests/basic-architecture.test.js`,
`npm test --prefix rig-mcp`, and `node scripts/check-advanced-spec.js`.

Full release gate also passed on this branch after the fixes: `npm test`
verified Gate 1, rule copies, version pins, secret hygiene, 405/405 root Node
tests, 15/15 pi-extension tests, and 6/6 rig-mcp tests. Next: rerun the full
release-byte gate after this status checkpoint, then generate the independent
release review receipt without further byte changes.

## Independent review found OpenClaw lifecycle blockers (2026-08-24)

The fresh Codex review wrapper now runs with the current read-only sandbox, but
the first valid semantic review failed the receipt. It reported two actionable
OpenClaw lifecycle blockers: registration currently happens after the payload
journal is marked complete, so a later `npm ci`/`openclaw mcp set` failure can
leave a nonzero install with a complete journal; and `.rig/global-writes.json`
is written directly instead of through the shared append-only journal. The
review also noted an implementation digest mismatch caused by bytes moving
during the review attempt, so a new receipt must be generated after these fixes
and a fresh full gate.

Next: move OpenClaw registration inside `runPayload` before journal completion,
journal the global-write ledger through the shared writer, leave runtime
deletion to the manifest walk after a successful `openclaw mcp unset`, rerun
the full gate, then rerun the independent review receipt.

## OpenClaw global MCP opt-in implemented — full gate green (2026-08-24)

Owner signed the amended OpenClaw oracle for inclusion in v5.0.0. The
implementation now accepts `--openclaw-mcp` through the release installer and
bootstrap, installs the bundled `rig-mcp` runtime from a shipped lockfile with
`npm ci --omit=dev --ignore-scripts`, registers one per-install OpenClaw server through
`openclaw mcp set`, records the global write in `.rig/global-writes.json`, and
unregisters with `openclaw mcp unset` before deleting the referenced runtime.
If unregister fails, uninstall keeps that runtime and reports best-effort so the
global server is not left pointing at a deleted file.

The full gate is green:
`node --test --test-name-pattern='AT-HOME-1 OpenClaw MCP opt-in' tests/advanced-oracle.test.js`,
`node --test tests/release-blockers.test.js`,
`node --test tests/rig-bootstrap.test.js tests/basic-payload-gating.test.js tests/basic-architecture.test.js`,
`npm test` (403 root tests, 15 pi-extension tests, 6 rig-mcp tests). Next:
produce the final independent release review receipt on these passing bytes.

## RIG-120 release preflight blocked by unsigned OpenClaw oracle (2026-08-24)

Release preflight was run against the current worktree for v5.0.0 preparation.
Gate 1 integrity still verifies against the current oracle files
(`gate1-owner`, fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`),
but the full gate is red: `npm test` passes 401/402 root Node cases and fails
the new OpenClaw global MCP opt-in acceptance case because `install.sh` does not
yet accept `--openclaw-mcp`. This confirms the OpenClaw D25 oracle/test draft is
not a release candidate yet; final independent review, release-byte test rerun,
tagging, and publishing must wait until the owner either signs this amended
oracle for implementation or explicitly defers the OpenClaw option out of
v5.0.0.

Next: get the owner decision. Recommended path is to sign the OpenClaw oracle
now, implement the smallest installer/runtime/uninstall support for
`--openclaw-mcp`, rerun the full gate, then generate the final release review
receipt on the passing bytes.

## OpenClaw global MCP opt-in — oracle ready for owner signature (2026-08-24)

The owner requested an explicit, warned installation option that registers
`rig-mcp` in OpenClaw's user-global MCP configuration rather than committing a
repository-local file. Current OpenClaw documentation confirms the active file
is `~/.openclaw/openclaw.json` (JSON5) and that the supported non-interactive
writer is `openclaw mcp set <name> <json>`; this resolves RIG-101's prior
repo-vs-global scope conflict in favour of the global surface. The requested
host-specific option conflicted with the signed global-write rule, so it was
returned to grilling. The amended business intent, acceptance, and working
technical design now define an explicit `--openclaw-mcp` selection: default
installation still performs no OpenClaw or npm operation; the selected path
warns before a global write, installs the locked server runtime, uses the
vendor CLI only, records a distinct per-clone server name, and refuses to
delete that runtime if the vendor CLI cannot unregister it. The new executable
acceptance test is intentionally red at the missing option (not a harness
error), ready to turn green after owner signing and implementation. Next:
owner runs the Gate 1 signing ceremony, then implementation starts.

## RIG-101 expanded from 4 to 11 wired hosts (2026-08-24)

User asked for `rig-mcp` wiring to cover more hosts, then requested a
web-research prompt for the hosts still missing it. That research (12 hosts,
official-docs-sourced) came back and was cross-checked against
`rig/lib/host-capabilities.js` REGISTRY, RIG-104's single source of truth that
landed concurrently in this same working directory. Agreement on 6 of 7 newly
wired hosts (cursor, kiro, swival, copilot VS Code, copilot-cli, codex CLI +
IDE extension); devin's config filename has a low-stakes possible drift
(`.devin/config.json` vs. a maybe-renamed `.devin/mcp_config.json`), wired
as-is per REGISTRY. One real, unresolved conflict: **openclaw** — REGISTRY
says repo-scoped `.openclaw/openclaw.json` (tested/shipped shape), fresh docs
say single global file, no per-repo concept at all. Left un-wired rather than
guessed; see
[reasoning/2026-08-24-rig-101-host-expansion-openclaw-conflict.md](reasoning/2026-08-24-rig-101-host-expansion-openclaw-conflict.md)
and `host-coverage-spec §3.2.1` for the full record. `tests/rig-mcp-adapters.test.js` now covers 11 hosts, 11/11
green. `docs/agent-portability.md`, `host-coverage-spec.md`, and
`wiki/tickets/RIG-101.md` all updated to match.

## RIG-106 disposition corrected after independent review (2026-08-24)

Four corrections to the subagent-hook research below, each re-verified against
primary sources before applying — see
[reasoning/2026-08-24-subagent-disposition-corrections.md](reasoning/2026-08-24-subagent-disposition-corrections.md).
None change what's wired (Claude/Codex/Copilot remain the only hosts with a
context-injecting subagent hook); all four sharpen the record:
**Copilot** gained a real caveat — `subagentStart` never fires for the
built-in `general-purpose` agent, only named/custom agents, a vendor
limitation Rig's graft can't work around. **Hermes** moved out of "no hook
mechanism" into the observer-only bucket with Cursor/CodeWhale — it has a real
26-event hook system including `subagent_start`/`subagent_stop`, but they're
explicitly return-value-ignored observer hooks. **Pi**'s "no hook mechanism"
was softened to "no native mechanism" — a third-party extension
(`@vahor/pi-hooks`) exists but its 30 events still don't include a
subagent-scoped one, so the disposition is unchanged. **Kiro** moved from
explicitly unresolved to resolved N/A — `AgentSpawn`'s payload carries only
`session_id`, reading as per-session rather than per-subagent, though a
first-wire test is recommended given an open vendor bug report about its
firing behavior. `host-coverage-spec §3.1a`, the RIG-106 ticket doc, and the
Tickets board card are all updated.

## RIG-103/RIG-104 resolved — legacy and catalogue MCP paths unified under one disposition table (2026-08-24)

Moved RIG-103 and RIG-104 from Coding → Ready for Commit. Neither touches the
signed oracle, so both landed without a re-sign. New `rig/lib/mcp-hosts.js` is
the single `{ disposition, autoWrite, file, key }` table (derived from
`host-capabilities.js`'s researched `REGISTRY`, with two named overrides:
antigravity stays manual-only per RIG-105, codewhale keeps its shipped
`DEEPSEEK_MCP_CONFIG` repo-redirect pending RIG-110); both `renderers.js`
(legacy Basic path) and the catalogue descriptor path read it now, replacing
the two independently-hardcoded `HOST_TIER`/`HOST_FILES` tables that had
silently diverged. `pi`'s renderer is deleted — selecting `pi` now emits no
MCP config, and a pre-existing user file is preserved with migration
guidance (AT-HOST-5), covered for the legacy path the frozen catalogue-only
oracle test didn't reach (new cases in `tests/basic-renderers.test.js`). One
shared `mergeMcpEntry` writer replaces 11 near-duplicate per-host JSON
mutators; new `tests/basic-mcp-merge.test.js` proves it's idempotent and
preserves unrelated entries for every shape (flat `mcpServers`, copilot
`servers`+`inputs`, opencode `mcp`, OpenClaw's nested `mcp.servers`, and the
Codex TOML block). Network-capable (http) MCP entries are now evaluated
through the same `evaluateAction` policy engine as shell/web, with a parity
test — MCP is not an enforcement bypass. Two real divergences between the two
paths were found and reconciled in favor of already-shipped, tested behavior:
OpenClaw's registry metadata was corrected to `.openclaw/openclaw.json` +
nested `mcp.servers` (was bare `openclaw.json` + flat `mcpServers`, a value
no code actually consumed); `docs/agent-portability.md`'s shape table
corrected to match. `copilot-cli` is wired too (added after a same-day
push for full serviceability): it's a cited, non-conflicted `mcp: 'repo'`
host using the plain default shape, not one of the §3.1 unresolved-conflict
hosts, so there was no real reason to leave it note-only by omission — a
fourth previously-undiscovered per-host hardcoded list
(`rig/lib/variants.js` `SUPPORTED_TRANSPORTS`) had to gain an entry too.
Full gate green: root 393/393, pi-extension 15/15, rig-mcp 6/6. See
[landing reasoning](reasoning/2026-08-24-rig-104-mcp-unification.md).

## RIG-106 resolved — Copilot subagentStart wired, full 19-host disposition recorded (2026-08-24)

Moved RIG-106 from Coding → Ready for Commit. Doesn't touch the signed oracle.
Researched every `SUPPORTED_HOSTS` entry against vendor docs for a subagent
lifecycle hook capable of *injecting* context (gating/observing isn't enough
to load Rig mode) — full findings in
[reasoning/2026-08-24-subagent-mode-propagation-disposition.md](reasoning/2026-08-24-subagent-mode-propagation-disposition.md),
recorded in [host-coverage-spec §3.1a](specs/host-coverage-spec.md). Wired the
ticket's named gap: `hooks/copilot-hooks.json` gained a `subagentStart` entry
invoking `hooks/rig-subagent.js`; `hooks/rig-runtime.js`'s Copilot branch of
`writeHookOutput` previously injected only on `SessionStart` (silently
dropping everything else) and now also injects on `SubagentStart`, matching
GitHub's documented `{ additionalContext }` shape. Two new cases in
`tests/hooks.test.js` cover mode-present and mode-absent. Every other host is
N/A for a distinct, cited reason (cursor/codewhale gate or observe but can't
inject; gemini/antigravity/devin/windsurf have hooks but no subagent-scoped
event; opencode's is an unshipped feature request; openclaw's and cline's
subagent events live in mechanisms Rig doesn't graft; pi/hermes/swival/generic
have no hook mechanism at all); kiro's `AgentSpawn` is left explicitly
unresolved rather than guessed. Full gate green: root 384/384, pi-extension
15/15, rig-mcp 6/6.

## RIG-101 implemented — rig-mcp wired into opencode + documented (2026-08-24)

Moved RIG-101 from Coding → Ready for Commit. Doesn't touch the signed
oracle, so it landed without a re-sign. `opencode.json` registers `rig-mcp`
as a local MCP server (`mcp.rig`, real array-form `command` per OpenCode's
docs, not the `command`+`args` shape `rig/lib/renderers.js` uses for the
unrelated catalogue path — that gap is [[RIG-104]]'s to close), verified by
new `tests/opencode-mcp.test.js`. New `rig-mcp/test/stdio.test.js` spawns the
real server over stdio via the MCP client SDK and asserts non-empty,
correctly-tagged `rig_instructions` output for `lite`/`full`/`ultra`.
`docs/agent-portability.md` gained copy-paste config for all four MCP key
shapes; `host-coverage-spec §3.2.1` records the intentional exclusions (`pi`,
`generic` unsupported; `windsurf`/`cline`/`hermes`/`codewhale` user-global
only). Full gate green: root 381/381, pi-extension 15/15, rig-mcp 6/6. See
[[RIG-101]] for the full landed/not-done breakdown — wiring the remaining
`mcp: 'repo'` hosts (claude, gemini, cursor, etc.) is deliberately deferred;
the acceptance bar was one host and the doc table covers the rest.

## Owner approval ceremony — all design-complete tickets approved (2026-08-24)

Owner re-signed Gate 1 oracle with Secretive key (fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`) a second time to approve all 16 design-complete tickets (RIG-101, 103–116) for implementation. All tickets moved from **Request for Signing** → **Coding**. Oracle verified: 5 files, 68 acceptance cases. Full test suite green: root 380/380, pi-extension 15/15, rig-mcp 3/3.

**Approved for implementation (moved to Coding):** RIG-101 (rig-mcp distribution), RIG-103–104 (MCP unification), RIG-106–107 (subagent mode + runtime entrypoint), RIG-108–111 (zero-caller modules + shipping paths + host contracts), RIG-112–116 (catalogue contract through leaf promotion).

## Ticketing structure updated (2026-08-24)

The Kanban board (`wiki/Tickets.md`) has been restructured to reflect the Rig development workflow:

**Current stages (as of 2026-08-24, post-approval):**
1. **Backlog** — nothing started
2. **Solution Discovery** — grilling in session, solution not yet clear
3. **Acceptance Criteria & Testing** — acceptance criteria and testing infrastructure being defined
4. **Request for Signing** — ready for hardware-key sign-off (currently empty; all approved)
5. **Coding** — development in progress (13 tickets: RIG-105, RIG-107-116, RIG-119, RIG-122 — all owner-approved)
6. **Ready for Commit** — tests green, ready for deployment (1 ticket: RIG-123)
7. **Blocked** — waiting for owner input (1 ticket: RIG-120)
8. **Done** — committed on this branch and complete (8 tickets: RIG-101, RIG-102, RIG-103, RIG-104, RIG-106, RIG-117, RIG-118, RIG-121)

All existing tickets have been organized into their appropriate stage based on status.

## Grilling session — owner rulings landed (2026-08-24)

Owner ruled on the five close-out items ([framing](reasoning/2026-08-24-grilling-five-open-decisions.md)).
Process doctrine captured verbatim in
[reasoning/2026-08-24-process-doctrine-and-one-lock.md](reasoning/2026-08-24-process-doctrine-and-one-lock.md)
(D25 business intent optional, D26 one lock, D27 freeze-timing), synthesized into
[the gate](topics/the-two-gates.md).

- **RIG-120 naming — DONE (code):** canonical name is just `qaynel/Rig`; the
  reverted `-v0.1` suffix is stripped from every manifest, marketplace,
  openclaw/opencode, `check-versions.js`, and the wiki. **Owner action left:**
  rename the GitHub remote from `Rig-v0.1` to `Rig` or install URLs 404.
- **RIG-112 — CLOSED, no freeze:** the "freeze now?" was a mis-raised question;
  by D27 nothing locks until solution+acceptance+tests are all in and sound. Fixed
  the `catalogue-contract` phrasing that generated it so it won't regenerate.
- **RIG-108 — WIRED (2026-08-24):** graft = augment-existing-capability
  managed blocks (**keep**, owner-confirmed); enforcement = policy allow/deny +
  one-use approval (now: `rig policy grant-approval` CLI + deterministic script);
  git-dispatch = pre-commit injection/secret scan (now: `rig validate-commit` CLI).
  Both callable, testable, integrated into Hermes plugin. See
  [enforcement-and-git-dispatch-wiring](topics/enforcement-and-git-dispatch-wiring.md).
- **RIG-113 / RIG-115 — pending owner content:** the lint skill is context-driven;
  owner will supply the "good code / good linting" knowledge base and, if needed,
  the specific `AT-LF-*` test cases. Agent to draft first passes to react to.

Oracle-touching outcomes (RIG-113 lists, RIG-115 cases) batch into the single
RIG-120 re-sign when ready.

## Testing-infrastructure audit (2026-08-24) — owner's instinct confirmed

Acceptance criteria largely exist (as prose in `wiki/specs/`); **runnable
testing infrastructure does not**, for the active close-out tickets:

- **RIG-108/109 (enforcement + git-dispatch):** now WIRED into the CLI
  (`rig policy grant-approval` → `grantApproval`; `rig validate-commit` →
  `runPreCommit`), so they have real production callers. **But every test still
  reaches them by direct `require`** (`release-blockers.test.js:23`,
  `advanced-oracle.test.js:288/335`) — no test exercises the CLI shipping path.
  The green gate does **not** prove the wiring works end to end. This is exactly
  RIG-109's unmet ask. Needed: a shipping-path test invoking the two CLI
  commands + the invariant meta-test (no `rig/lib/*.js` reached only by
  direct-require).
- **RIG-113 (`ecosystem-preferences.md` + `setup-decision-rule.md`):** ranked
  lists, EOL signals, setup contracts, and the propose/deliver/write decision
  rule are authored and good. **No tests.** One `[ASSUMED]` open item: the
  `.rig-backup` mechanism must reconcile with Rig's existing git-floor/clean-tree
  write convention.
- **RIG-115 (`acceptance-test-profiles.md`):** three suites / 14 Given-Expected
  cases (Applicability, Execution consent, Shell trust) authored well. **Not in
  signed `acceptance.md`** (which holds only AT-LF-1..19) and **in no test
  file.** Cases CONSENT-5, SHELL-2/3/5 are `[ASSUMED]` and need verification
  against the real `.rig/` policy (network-policy.json, resource caps, symlink
  handling) before they can be locked.

Path to finish: answer the `[ASSUMED]` open questions → build the AT-LF-* test
infrastructure (and the shipping-path tests) so each fails-before/passes-after →
one re-sign locks RIG-115 cases + any RIG-113 acceptance into the oracle.

## Owner ceremony + decisions (2026-08-24, later)

Owner ran the Gate 1 re-signing ceremony (`node scripts/approve-gate1.js`) with
their Secretive key (fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`,
comment `rig-gate-key@secretive.Manoj's-MacBook-Pro.local`) after landing
**RIG-102**: `test:code` now runs `npm test --prefix rig-mcp`, mirrored in the
signed `wiki/gate1/package-scripts.json`. Full gate green: root 380/380,
pi-extension 15/15, rig-mcp 3/3. Local signing convention moved from the
locally-excluded `.context/` to a tracked-gitignored `.credentials/` directory
(`scripts/approve-gate1.js` now reads `.credentials/gate1.env`).

Owner also approved three pending product decisions (implementation still
pending, doesn't touch the signed oracle): **RIG-119** fold spec-driven dev
into `rig-grilling`/`rig-product-design`, no new skill; **RIG-122** ship the
wiki convention as an optional markdown-only graft post-release; **RIG-105**
surface the Antigravity manual MCP step + a verification check, not
auto-write. RIG-108/112/113/115 remain blocked — each needs decision
*content* (not just approval) before there's anything to land or re-sign.

## Ticket burndown pass complete (2026-08-24)

Worked the whole RIG-101..122 backlog (`Tickets.md`). Every ticket now has a
solution doc under [`wiki/tickets/`](tickets/) linked from its board card, and
the board is re-columned (Done / To Do / Blocked). Full gate green throughout:
`npm test` = 13/13 + 380/380 + 15/15.

**Resolved + landed (Done):** RIG-102 (the `rig-mcp` suite added to the signed
CI gate), RIG-117 (stale `agentic-harness-demo` →
`qaynel/Rig-v0.1` across all manifests/marketplace/openclaw/opencode + new
identity guard in `check-versions.js`), RIG-118 (README capability column +
rig-mcp pointer), RIG-121 (roadmap placeholder count + product-spec gap rows).
Incidental: gitignored `wiki/.obsidian/` — its vendored plugin binaries tripped
the secret-hygiene scan and were blocking the gate.

**Designed, implementation-ready (To Do):** RIG-101, 103, 104, 106, 107, 108,
109, 110, 111, 112, 113, 114, 115, 116 — each solution doc gives files, contract,
and tests. Key finding: several (102, 108, 112, 113, 115) ultimately re-sign the
Gate 1 oracle to *land*, because `package.json` scripts + `acceptance.md` are
under `gate1.sig`. RIG-108: verified `release-evidence.js` *does* have a caller
(`scripts/review-receipt.js`); the other three modules are genuinely zero-caller.

**Deferred — needs owner/PM input (Blocked):** RIG-105 (1-line approach confirm), RIG-119 (spec-driven adoption
decision), RIG-120 (release ceremony — owner signing keys), RIG-122 (wiki-graft
decision). Each carries a recommendation.

Open reconciliation surfaced for the release: `qaynel/Rig` (install.sh/README)
vs `qaynel/Rig-v0.1` (actual remote) — see RIG-117/RIG-120.
See [burndown trace](reasoning/2026-08-24-ticket-burndown.md).

---


If a page elsewhere in the wiki seems to disagree with this one, trust this one
— and check [the timeline's "reading a document by its date" table](index/timeline.md#reading-a-document-by-its-date)
to see what that page's era still believed.

The signed oracle remains unchanged and green at 68 acceptance cases. The
working technical design is v0.16 and is present rather than frozen. D24 keeps
the beta boundary at all 115 Policy leaves plus the 55-skill vendored shelf,
detected-host onboarding, the mandatory safety baseline, six CI providers, and
named-tag `5.0.0` distribution.

The protected oracle, secret scan, rule-copy check, and version check pass on
the current bytes. `npm test` is green end to end: the root suite is
**380/380** and the pi-extension suite is **15/15**. A prior read of this page
claimed `AT-BASE-3` and `AT-SECRET-1` were failing against the frozen business
text and required an owner-authorized Gate 1 re-signing ceremony; re-running
both on the current bytes shows they pass, so that re-signing ceremony is not
needed. The `pandas` benchmark import some local runs report as failing is a
missing `.venv` setup in that environment, not a suite failure.

The leftover production holes from the last pass are closed: apply writes a CI
file only when that path is in the signed plan and still compare-and-swaps it;
uninstall on a linked worktree no longer crashes, and install still places the
secret-guard hook in the shared hooks directory. The copy check fails closed
on a sync-map entry that is a symlink out of the repository.

## Production review findings

The nine findings supplied on 2026-08-23 are implemented and have focused
regression coverage.

| Finding | Current state |
|---|---|
| Repository symlinks escape write/delete boundaries | One shared realpath-aware containment guard protects lifecycle, payload, coverage, remediation, apply, and CI paths. Ancestor symlinks resolving outside the target fail before mutation. |
| Installer omits catalogue and safety runtime | The tagged-release payload installs the catalogue metadata, all service/baseline fragments, `materialize.js`, and all runtime modules under `.rig/runtime/`; local Tier 1 remains static-only. |
| Bare repository receives no vendored skills | Hostless install now receives all 55 neutral skills under `.rig/skills/` while still creating no absent host-specific tree. |
| Service packs repeat prohibited generic boilerplate | All Policy packs name exact scopes, applicability, dispositions, leaf-specific checks, distinct acceptance targets, explicit given/pass/fail evidence, and slice behavior. Generic selected services without repository bindings fail as coverage gaps instead of `process.exit(0)`. |
| Five CI providers have no adapter | GitHub Actions, GitLab CI, CircleCI, Jenkins, Buildkite, and Azure Pipelines each render and apply a provider-visible, detail-free repository check with approval, preservation, idempotence, journaling, and first-wire coverage. |
| Shipping journal and uninstall are incompatible; crash window is ambiguous | JSONL is authoritative for install, resume, and reverse removal. Pending records reconcile landed, unlanded, or conflicting state. The shipping CLI restores chained hooks, removes install-ID-attributed global entries, writes removal evidence, lists purge targets before deletion, and preserves user policy. |
| Review producer and validator schemas differ | Both use one strict `report-only` schema bound to technical-spec, catalogue-fragment, and exact PR implementation digests plus the PR base, exact passing case coverage, no release-blocking findings, and no unresolved IDs. |
| Distribution test never runs the installer/archive | The regression builds a tagged archive, transports it through fake `curl`, executes the real installer under `dash`, and checks tag, skills, catalogue, and runtime in the installed target. |
| Installer requires Bash | The root stub is POSIX `sh` with no Bash shebang, `pipefail`, substring expansion, or `[[ ... ]]`. |

[Intent-owner findings](reasoning/2026-08-23-production-release-blockers.md)

## Release boundary

The owner selected plan-time disclosure for model-assisted secret triage. The
policy proposal, exact disclosure-bound approval, CLI flow, persistent status,
and regressions are implemented with actual SSHSIG verification. One-use
approval replay, recovery signing/ordering, real lint argv execution, vetted
history scanning, structured semantic drift, axis-specific host contracts, and
uninstall integration are also covered. The full gate is green (see above); the
release is blocked on the signer-class attestation and a fresh independent
receipt bound to the resulting exact PR worktree.

After those are resolved, rerun the full gate on the final bytes and explicitly
cut/publish `v5.0.0`; tag publication is never an implicit side effect of code
changes.

A default local `sh rig/bootstrap.sh` (no `--with-runtime`) is now
markdown-only end to end: per-skill code and `.rig/plumbing` are gated behind
`active_delivery` alongside the runtime engine, and `.tmpl`/`TODOS-format.md`
never land. All 55 `SKILL.md` files still land unconditionally, so the frozen
oracle's 55-skill reading is unaffected and no re-sign was required
([AD-37](index/decisions.md), [lean-install protocol](reasoning/2026-08-23-lean-install-protocol.md)).

## Current mechanics

- `npm test` verifies the protected oracle first, then secrets, rule copies,
  versions, the root Node suite, and pi-extension tests.
- `install.sh` downloads a named tag to disk and executes only the extracted
  local bootstrap with its explicit active-delivery runtime gate.
- `.rig/install-manifest.jsonl` is the single lifecycle authority.
- Policy activation and recovery verify external SSHSIG receipts under separate
  namespaces; caller-set verification booleans are not accepted by shipping
  commands.
- The release-review wrapper starts a fresh reviewer process, binds the exact PR
  implementation worktree and base, and refuses incomplete or failing evidence.
- Historical review receipts remain void for current bytes.

## Owner-controlled release inputs

- Produce the authorized fresh independent review against the exact PR
  worktree.
- Add the intent owner's signer-class attestation comment to the frozen Gate 1
  signer file through an owner-authorized re-signing ceremony.
- Confirm the final `v5.0.0` tag and publication operation after the full gate
  is green.

## Branch code review complete — 5 tickets raised (2026-08-25)

Reviewed the whole `qa-prod-finishing-up` branch vs `origin/prod` (20 commits,
188 files) for application coherence and production readiness. Full record:
[[2026-08-25-branch-code-review-snapshot]]. Report-only — no code changed.

Split along the owner's two axes:
- **Structural (loop generators):** [[RIG-125]] — RIG-104/105/107 are marked
  Done but unmet in shipped code because the same fact is defined in several
  places (MCP disposition ×3; two uninstallers) and acceptance tests check the
  mechanism, not the end-to-end property. This is what regenerates review→ticket
  →re-review churn; fixed by equivalence + roundtrip + printed-sequence tests.
- **Deliverability (production readiness):** [[RIG-126]] onboarding isn't
  runnable end-to-end; [[RIG-127]] uninstall leaves orphans (install itself is
  sound); [[RIG-128]] MCP emitted contracts misdescribe reality + repo writer
  clobbers JSON5. [[RIG-129]] (clubbed doc/evidence) citation audit — pi's "MCP
  refused by design" is false; copilot/copilot-cli/cline/openclaw/antigravity
  #60/codewhale citations verified correct.

All five are OPEN/un-triaged; recommended order RIG-125 first (its tests stop the
loop), then 126/127/128 under those tests, 129 alongside. Not yet approved for
implementation.
