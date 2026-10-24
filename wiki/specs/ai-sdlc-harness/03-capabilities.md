---
status: current
checked: 2026-10-23
owner: rig-product-design
---

# C. Capability-by-capability specification

Capability-level acceptance examples below supplement the
[atomic approval contract](15-gate1-contract.md). They are not an alternate
primary-criterion registry; the same-numbered requirement/criterion/test
mapping and [test manifest](16-test-manifest.md) define the proposed oracle.

PROPOSED unless marked. Entries detail the proposed behavior, integration and checks. Capabilities
that already exist and are settled are stated briefly with a pointer; the detail
is spent on what must be built.

Acceptance-criteria IDs here are **proposed** (`AC-*`) and are not Gate 1 cases
until the owner signs them. The journey-level acceptance summary is in
[08-acceptance-matrix.md](08-acceptance-matrix.md); detailed subcases stay here.

---

## C1 · 8 KB active memory view — **PROPOSED, foundational**

**Problem.** A complete but unbounded record is too expensive to read every
phase; settled decisions are then re-asked. The owner approved an 8 KB cap for
the active view, not for all retained knowledge.

**Behaviour and contract.** A phase transition loads a deterministic projection
of portable preferences, relevant project decisions, recurring findings, and a
one-action resume point. `renderActive(memory, task) → { text, sourceIds,
truncated, gaps }`; `text` is at most **8,192 UTF-8 bytes**. `record(entry)`
updates the deeper C19 store first; the view is rebuilt from that store. A
missing or corrupt view is regenerated without losing the source records.

**Integration and approach.** Project `.rig/ledger.md` is the readable active
projection. Adapt Claude-Mem's `src/services/context/ContextBudget.ts`
render/measure/drop-whole-item loop at a pinned commit, replacing its character
count with UTF-8 bytes and preserving source pointers. Keep Rig's existing
`wiki-query` as the first retrieval path. No model call for rendering,
counting, pre-flight or deduplication.

**Alternatives.** Loading the entire wiki recreates the observed read cost;
a bare 8 KB file with no deeper memory would discard knowledge the owner wants.
A daemon is unnecessary for the active view.

**Safety, failure and cost.** Imported and retrieved text is data, never a
permission. On overflow, shorten excerpts in fixed order and keep references;
never silently discard portable preferences, unresolved decisions, protected
evidence or the sole resume point. If these cannot fit, report the exact
budget gap. Routine rendering is local and free.

**Acceptance.** `AC-C1-1` rendered UTF-8 bytes ≤ 8,192 on ASCII and multibyte
fixtures; `AC-C1-2` duplicate keys update one source record; `AC-C1-3` an
overflowed item remains retrievable by source ID; `AC-C1-4` identical input
renders identical bytes; `AC-C1-5` injected instructions remain inert data;
`AC-C1-6` corrupt projection rebuilds from intact sources and reports missing
ones.

---

## C2 · Portable developer profile — **PROPOSED**

**Problem.** Developer preferences are lost between projects or computers.

**Behaviour and contract.** Export a human-readable profile with provenance and
a machine-readable version/index. It contains developer-scope preferences and
explicitly portable decisions only. Project decisions, review recurrences,
permissions, secrets and the current run never transfer. Import returns
`{ applied[], conflicted[], rejected[] }`; conflicts with observed repository
conventions are presented once with a recommendation. `rig-onboarding` adapts
the imported profile instead of copying project-specific configuration.

**Integration and approach.** Use the existing onboarding graft. Persistent
workflows export as standard Agent Skills `SKILL.md` directories when
appropriate; preference data uses a documented Markdown/JSON profile because
no reviewed cross-host preference schema meets the provenance and scope
requirements. The active view is regenerated after import, not used as the
sole export source. Host user-level skill locations are discovered, never
assumed to be the same across agents.

**Alternatives.** A hosted account introduces a privacy and network dependency;
copying the entire wiki leaks project state and exceeds the context budget.

**Safety, failure and cost.** The import is untrusted data: validate size,
syntax, scope and paths before any write. It cannot add a signer, change policy,
disable a check or invoke tools. A malformed profile is refused with a report;
onboarding continues. Export/import is local and requires no paid call.

**Acceptance.** `AC-C2-1` export/import round-trip preserves developer-scope
preferences and provenance, leaving project-specific state empty;
`AC-C2-2` policy/signing fields are rejected; `AC-C2-3` conflicting preference
is reported rather than silently applied; `AC-C2-4` repeated import is
idempotent; `AC-C2-5` a standard skill exported with the profile remains valid
under the Agent Skills specification.

---

## C3 · Agent-driven onboarding and grafting — **IMPLEMENTED**

Settled (North star 1–2). The host agent grafts the smallest useful set onto
what the repository already has; Rig code does not infer. Tested by
`tests/rig-bootstrap.test.js`, `tests/path-b-onboarding.test.js`,
`tests/context-aware-onboarding.test.js`.

**Change required for this SOW:** one new branch for `--profile` (C2) and one
onboarding question set that produces the initial `preferences` (the owner's
"during onboarding we would do a Q&A"). No architectural change.

---

## C4 · Requirements clarification and specification — **PARTIAL**

**Exists:** `rig-grilling` (adversarial requirement interrogation) and
`rig-product-design` (business + technical spec), with the pipeline enforced by
`tests/spec-driven-pipeline.test.js`.

**Gap.** The output of grilling is not recorded as `decided` entries, so the
next session re-grills settled ground. This is the single cheapest fix in the
package: grilling already produces exactly the entries C1 wants.

**Contract addition.** `rig-grilling` ends by recording every settled answer as
a `decided` entry with its source trace. `AC-C4-1`: a second grilling pass on
the same intent reports the prior answers and asks only what is genuinely new.

---

## C5 · Architecture and technical design — **IMPLEMENTED**

`rig-product-design` → `wiki/gate2/technical-spec.md`, checked for presence at
the gate and bound by digest into the review receipt. Its bytes are already
outside the signature. The router's phase order can be aligned with the owner's
lock-before-design sequence during pipeline work, without changing the gate.

---

## C6 · Scope-of-work generation — **PROPOSED**

**Problem.** The phase exists in the owner's mental model and nowhere in Rig, so
work is sequenced ad hoc and the owner cannot see the shape of a change before
it is built. The 10-14 closure run needed a hand-written `task-list.md` and
`agent-prompt.md` precisely because this phase has no owner.

**Behaviour.** After the lock and technical design, a
`rig-scope` skill produces an ordered set of work packages, each with: its
acceptance criteria references, its dependencies, the model tier it may use,
its verification command, and its one-line done condition. The owner reads it
and redirects; they do not author it.

**Contract.** `wiki/specs/<change>/scope.md` with a machine-checkable table:
`package | depends-on | criteria | verify | tier`. The pre-flight gate for the
implementation phase refuses to start a package whose dependencies are not
complete.

**Integration.** New skill in `rig/corpus/skills/scope/`; one row in the router
table; `rig-execution` consumes the table for parallel dispatch.

**Alternatives rejected.** *Keep it implicit in the technical spec* — that is
today's behaviour and it produced hand-written task lists. *A tracker
integration* — adds an external dependency for an artifact that must work
offline.

**Cost.** One model pass over an already-written spec. Pays for itself the first
time a cheap model needs to know what to do next without reading everything.

**Tests.** `AC-C6-1` every work package cites at least one acceptance criterion
and one verification command. `AC-C6-2` a package whose dependency is incomplete
cannot be started (deterministic check, not advice). `AC-C6-3` the scope table
parses and round-trips.

---

## C7 · Requirements and acceptance lock — **PARTIAL**

**Exists.** The single Gate 1 key signs the business-spec, acceptance and
manifested deterministic tests. The current checker verifies exact digests;
implementation agents may not edit those frozen artefacts. The technical
specification is presence-checked and editable. These are settled boundaries.

**Gap.** The router still places technical design before the lock, and the
hardware-backed key path has no end-to-end test. The owner has now approved
locking requirements and acceptance together before technical design, plus
specifying and verifying `sk-ssh-ed25519` where feasible.

**Approach.** Align phase order without changing the existing signed-message
format. During the later hardware work, verify the owner's actual key path,
real user-presence act, enrolment, rotation and unavailable-key refusal; retain
one trust root. No key material enters the repository. A legitimate contract
change uses the existing owner-only amendment and re-sign ceremony.

**Acceptance.** `AC-C7-1` signed requirements and criteria verify while a
technical-spec edit leaves the signature valid; `AC-C7-2` an acceptance edit
invalidates it; `AC-C7-3` a key-holder hardware-signing run verifies and an
unavailable key refuses without fallback or key copy. Automated emulation may
check parsing, but cannot stand in for the live key-holder evidence.

---

## C8 · Routed implementation and subagents — **PARTIAL**

**Exists.** `rig-implementation`, `rig-tdd` and `rig-execution` own minimal
changes, red-green verification and coordinated work. Host agents already
supply the actual model and child execution surfaces.

**Gap and approach.** Use C16's task router to dispatch only independently
bounded work. A child gets the active view, one scoped package, relevant source
references and acceptance slice, with explicit file ownership, model,
call/time budget and return schema. Cheap mechanical work is preferred when
its check is deterministic. Risky architecture, security or ambiguous tasks
route to a stronger model. A generated artefact is independently tested or
reviewed; no child certifies its own protected change. Writer collisions use
isolated worktrees or disjoint ownership, not simultaneous edits to one file.

**Acceptance.** `AC-C8-1` a child prompt contains its package and relevant
context but no unrelated conversation or secrets; `AC-C8-2` a risk-classified
protected task cannot be certified by its implementer; `AC-C8-3` concurrent
writers with overlapping files are serialized or isolated; `AC-C8-4` a failed
cheap attempt carries evidence into one stronger retry and then stops at the
budget.

---

## C9 · Code review, remediation and regression prevention — **IMPLEMENTED 2026-10-23 (uncommitted)**

**Problem (was).** Review rounds shared only a failure count, so each round was
an independent draw and a recurring finding was rediscovered at full cost
forever. Separately, provider outages and timeouts were charged to the owner's
authorisation cap — three recorded losses in four days.

**Now.** `scripts/review-receipt.js`:
- finding-class history per author-context, keyed `category|normalised(evidence
  ‖ anchor ‖ detail)` with line numbers omitted so line drift still matches
  (pattern from `alibaba/open-code-review` `internal/session/compare.go`,
  Apache-2.0, cited in source);
- prior rounds injected into the next reviewer's prompt with an explicit
  "this is not a quota" instruction;
- classes reaching two rounds printed as due to graduate;
- an authorisation is spent only on **positive evidence** of a completed review
  (exit 0 + parseable JSON + `pass`/`fail` verdict + `verdicts` array);
- a persisted per-attempt state machine with an in-flight marker, exactly-once
  interruption recovery, and consecutive infrastructure failures bounded at 3;
- `--ingest` reconciles an externally supplied report against the recorded
  history, read-only, never authoritative.

**Evidence.** `tests/release-blockers.test.js` 49/49 green; full gate result in
[10-current-state.md](10-current-state.md). Detail:
[the trace](../../reasoning/2026-10-23-review-state-machine-positive-evidence.md).

**Remaining gap (→ C13).** Graduation is *reported*, not *enacted*. Nothing
generates the check.

---

## C10 · CI/CD, testing and release-readiness — **IMPLEMENTED**

`npm test` as the full gate; `scripts/check-deployment-gate.js` enforcing the
ordered sequence from candidate freeze to tracker closure; exact-QA-commit
automated promotion (North star 11); real-download clean-install E2E. No change
proposed. The one architectural constraint it imposes on everything above:
**evidence does not survive a byte change**, which is why the ledger must not
live inside the digested tree (see NFR-6 and [D-05](09-decision-register.md)).

---

## C11 · Documentation, decision logging and knowledge maintenance — **PARTIAL**

**Exists:** the wiki discipline (immutable trace bodies, generated indexes,
`scripts/wiki-maintenance.js`, `scripts/wiki-query.js`, a budget gate with
waivers).

**Gap.** Documentation and close-out are not phases with owners, so they are
done at the end under time pressure or not at all. The owner asked for exactly
this: "Everything, logging, documentation, everything is done and it is
integrated."

**Proposed.** Two small skills, not a system:
- `rig-document` — after the review passes, update the user-facing documentation
  the change touches, and nothing else. Its pre-flight check lists the docs that
  mention the changed surface.
- `rig-closeout` — record the decisions this change settled into `decided`,
  prune `where-we-are`, run the graduation check, and emit the close-out
  summary. One pass, bounded.

**Explicit constraint from the owner's directive:** *"Do not introduce another
large documentation system where a small enforceable mechanism would be more
useful."* These two skills add no new artifact type; they write into the ledger
and the existing docs.

**Tests.** `AC-C11-1` a change touching a documented surface cannot reach the
release gate with the documentation unchanged (deterministic surface→doc map).
`AC-C11-2` close-out records at least the decisions named in the change's
reasoning trace.

---

## C12 · Pre-flight checks at phase transitions — **PROPOSED**

**Problem.** The owner has to notice what was skipped. They asked for the
inverse, verbatim: *"It automatically tells me before we proceed any further,
'I've noticed that we have not done this so can you please get that done before
we do that?'"*

**Behaviour.** At every transition, one deterministic report: what the next
phase requires, what is present, what is missing, and which `recurring` items
apply. Before the work, not after it fails.

**Contract.** `preflight(from, to, ledger) → { requires[], missing[], recurring[], ready }`.
No model call. Each phase declares its requirements as data in its skill file,
so the check is one table lookup.

**Alternatives rejected.** *A checklist in the skill prose* — that is today, and
it is advisory. *A blocking gate on every transition* — over-constrains the
owner, who sometimes legitimately skips a phase; blocking stays with the signed
oracle.

**Tests.** `AC-C12-1` every pipeline phase declares machine-readable
requirements (test fails if a phase is added without them). `AC-C12-2` a
transition with a missing requirement reports it and names the remedy.
`AC-C12-3` the check makes no network or model call.

---

## C13 · Repeated instruction and failure learning — **PARTIAL**

**Problem.** The developer should not have to repeat a direction twice, and a
known defect should not be rediscovered as if new.

**Exists.** Review finding classes carry across rounds with positive-evidence
attempt accounting. Graduation is reported but not enacted.

**Behaviour and contract.** Key explicit owner corrections and verified failure
classes separately, with source occurrences and confidence. Two observations
trigger a **candidate** mechanism: stored preference, standard Agent Skill,
script, workflow, non-protected check, or policy amendment. Choose the smallest
one that would change the next run. Semantic retrieval may propose a match;
exact source citations and a human/independent check resolve uncertain matches.
A false positive cannot silently become policy.

**Integration and approach.** Preserve Rig's review history and run records.
Use a candidate dossier `{ occurrences, proposed_mechanism, before_fixture,
after_fixture, risk, authority }`. Adapt Harness²'s candidate/evaluation
separation only as a pattern, with baseline and negative outcomes retained.
Safe preference maintenance may land automatically. An executable check needs
an independent deterministic regression and a diff review. A change to signed
acceptance, executable policy, security controls or authority requires the
existing owner key; ordinary checks do not acquire a new signing ceremony.

**Failure and cost.** No automatic promotion if the fixture cannot reproduce
the issue, the candidate makes the baseline worse, or the authority class is
unclear. Record rejected candidates so they are not proposed forever. Counting
is deterministic; model-assisted matching of repeated incidents is optional
and budgeted. Required offline memory search is specified under C19.

**Acceptance.** `AC-C13-1` a repeated instruction creates one cited candidate;
`AC-C13-2` a recurring defect with a red-before/green-after fixture can become
a non-protected check after independent verification; `AC-C13-3` protected
changes remain pending until owner signing; `AC-C13-4` negative trials persist;
`AC-C13-5` absence of a finding never proves resolution.

---

## C14 · Controlled recursive improvement — **PROPOSED**

The detailed [permission and evaluation table](05-recursive-improvement.md)
controls changes to Rig's own skills, checks and memory. Candidates are
compared with the unchanged baseline on representative historical cases and
current signed acceptance; evaluation rules are outside the candidate's write
scope. Safe non-executable maintenance may be automatic. Protected changes
require the one owner key. A human receives a product-level recommendation,
not a request to approve every housekeeping operation.

---

## C15 · Interruption recovery and cross-session resume — **PARTIAL**

**Problem.** Recorded repeatedly: two executor sessions died at usage limits
mid-task; recovery was by pasted transcript; one handover described an older
candidate than the live one, so state was re-derived anyway.

**Exists:** the review phase's per-attempt state machine with exactly-once
interruption recovery (RIG-124.3), and the `where-we-are` design in C1.

**Gap.** Generalise the same shape to every phase: `.rig/runs/<id>/` with an
in-flight marker per risky operation, and `where-we-are` as the human-readable
resume point. A new session reads the ledger, finds the phase and the one next
action, and continues.

**Tests.** `AC-C15-1` a phase killed mid-operation resumes without repeating a
completed step and without double-counting. `AC-C15-2` resume requires no input
beyond the repository. `AC-C15-3` a resumed run reports which attempt was
interrupted and when.

---

## C16 · Adaptive model and mechanism routing — **PROPOSED, foundational**

**Problem.** An expensive main model currently spends attention on searches,
formatting and trace housekeeping while cheap children sometimes face tasks
whose judgement or security risk exceeds their capability.

**Contract.** `route(task, hostInventory, budget) → { mechanism, model?, brief,
limits, verification, fallback }`. Classify task complexity, ambiguity,
file-write scope, security impact and evidence need. The host inventory is
observed at dispatch time; names such as Haiku, Sonnet and Opus are examples,
not hardcoded universal capabilities. A model/cost profile records declared
context, tool access, relative/known price, latency and quality evidence;
unknown values remain unknown. A deterministic script wins when sufficient.

**Approach.** Adapt the bounded-task model-selection and dispatch-brief rules
from Superpowers' `subagent-driven-development/SKILL.md` into Rig's existing
`rig-execution`, rather than installing a duplicate orchestrator. Use the
host's native child tool. Hermes Agent's per-task route and budget components
inform an optional adapter, not a bundled agent runtime. Deep Agents' private
child-state exclusions inform the cross-host brief contract. Permit parallel
read-only work and disjoint writers; cap fan-out and retries.

**Failure and cost.** A missing cheap model routes to the next verified option
or an inline task, without inventing one. Uncertain quality escalates once
with the same evidence. A budget exhaustion or provider outage is recorded
separately from a substantive task failure. Report actual cost and latency when
the host exposes them; otherwise `unknown`. Never claim that cheap is always
cheaper across turns.

**Acceptance.** `AC-C16-1` mechanical tasks choose a deterministic tool before
any model; `AC-C16-2` a bounded low-risk task chooses the cheapest eligible
observed model; `AC-C16-3` ambiguous/security tasks route to a qualified model
and independent verifier; `AC-C16-4` unavailable models and unknown pricing
have explicit fallback; `AC-C16-5` fan-out, retries and aggregate budget are
bounded; `AC-C16-6` run records distinguish cost, latency and correctness
without a single optimised score.

---

## C17 · Trust, permission and security — **IMPLEMENTED**

See [the architecture](02-architecture.md) for the existing trust root,
signature and exact-byte evidence. New surfaces are imported profiles, retrieved
memory, optional model adapters, concurrent writers and learned mechanisms.
Each is untrusted until validated. None may grant authority; the protected
contract and runtime policy remain under the existing key.

---

## C18 · One authoritative implementation per capability — **PARTIAL**

**Problem.** The owner's own example: *"You might have two skills for PR review.
Why would you want that?"* Amalgamation is the product claim, so duplicate
capabilities are the product's main failure mode.

**Exists:** merge policy for proven duplicate services (North star 10), a
catalogue with grades, and installed-router hygiene tests.

**Gap.** Onboarding does not detect that the host repository already has a
capability Rig is about to install. Proposed: a capability map keyed by
*function* (not vendor), checked at install; where the host already has one, Rig
grafts onto it or reports the overlap, and never installs a second.

**Tests.** `AC-C18-1` installing into a repository that already has a PR-review
skill produces one, with the overlap reported. `AC-C18-2` no two corpus entries
claim the same capability key.

---

## C19 · Scoped, searchable long-term memory — **PROPOSED**

**Problem.** An 8 KB active view cannot hold the developer's accumulated
knowledge, project decisions, historical lessons and evidence.

**Contract.** `remember(scope, fact, source)`, `recall(query, scope, limit)` and
`supersede(oldId, correction)` over developer and project scopes. Every result
returns source, age, confidence and current/superseded status. Retrieve lexical
matches locally and meaning-based candidates through the **shipped offline
model** in the public release. Merge rankings only after
scope filtering. Inject selected excerpts as labelled data, never hidden
instructions, within the task budget.

**Open-source approach.** Adapt Deep Agents' separation of always-loaded
memory and on-demand skills (`middleware/memory.py`, `skills.py`) and Hermes'
`memory_context.py` fencing/deduplication into Rig's host-agnostic contract.
Evaluate Claude-Mem's `SearchOrchestrator.ts` lexical/semantic fallback and
`ProgressiveMemorySearch.ts` compact-first retrieval as narrow algorithm ports.
Use the pinned local embedding model/runtime candidate in the
[inheritance matrix](12-reuse-plan.md) only after its packaging, platform and
quality fixtures pass. No whole Python agent runtime or always-on Claude-Mem
worker is installed.
The [inheritance matrix](12-reuse-plan.md) names the pinned files and tests.

**Safety and failure.** Profile/project separation is enforced on writes and
queries. Credentials and private key material are never memories. Conflicting
preferences surface for correction; a newer explicit owner correction
supersedes an older inference. A corrupt or unavailable local semantic asset
causes a named failure and lexical recall for recovery; that degraded state
cannot pass public-release readiness. No retrieved memory can override signed
acceptance or permission policy.

**Acceptance.** `AC-C19-1` scoped recall never crosses projects without an
explicit portable profile; `AC-C19-2` an offline semantic paraphrase retrieves
its cited source from shipped assets with no network call; a failed local model
degrades explicitly but blocks public-release readiness; `AC-C19-3` contradictory preference resolution preserves
both provenance and current value; `AC-C19-4` prompt-injection text remains
inert; `AC-C19-5` recall stays inside a declared cost and context budget.

---

## C20 · Automatic wiki and trace retention — **PROPOSED**

**Problem.** The current three-minute capture rule makes recovery possible but
leaves manual compaction and a growing wiki as recurring work.

**Contract.** A triggered maintenance run classifies traces as hot (current),
warm (summarised/indexed) or cold (archived); records source→summary mappings;
extracts unresolved decisions and representative regression fixtures; checks
fidelity before old sources become deletion-eligible. Deterministic tools do
indexing, duplication candidates and retention checks. A low-cost host child
summarises only when judgement is needed; an independent verifier checks its
output. The three-minute capture cadence remains in force.

**Safety and cost.** Never delete the sole surviving copy of signed-contract
evidence, security records, review receipts, audit evidence or regression
fixtures. Configurable retention can delete proven redundant traces after a
fidelity pass; failures leave originals intact and report a gap. Compaction
must not itself change the signed requirements or their evidence digest.

**Acceptance.** `AC-C20-1` a duplicate trace moves to warm/cold without losing
an unresolved decision; `AC-C20-2` deletion refuses for a sole protected
source; `AC-C20-3` a deliberately wrong summary fails fidelity and preserves
the original; `AC-C20-4` deterministic-only maintenance makes no model call;
`AC-C20-5` the low-cost summariser receives bounded context and independent
verification; `AC-C20-6` a cold session rebuilds current state from retained
records without the original chat.

---

## C21 · Hardware-backed signing compatibility — **PROPOSED VERIFICATION**

**Problem.** The owner wants the protected lock usable with a security key;
the existing SSH signing path is implemented but lacks a proven `sk-*` run.

**Contract and approach.** Preserve one Gate 1 trust root and the existing
SSHSIG message over business requirements, acceptance and the test manifest.
Document hardware-key enrolment, user-presence/verification settings, key
rotation, unavailable-key refusal and explicit owner-only amendments. Verify
the real key-holder ceremony on an appropriate machine; no agent simulates a
human touch. A technical-spec or mutable-memory edit does not change the
signature. Keep all private key material outside Rig's installed files.

**Acceptance.** `AC-C21-1` an `sk-ssh-ed25519` signing run verifies with the
existing checker; `AC-C21-2` acceptance-byte changes invalidate it while
memory and design edits do not; `AC-C21-3` rotation requires the same owner
authority and preserves an audit record; `AC-C21-4` missing hardware refuses
without a software-key or trust-on-first-use bypass.

---

## C22 · Source-level open-source inheritance — **PROPOSED**

**Problem.** A repository list and conceptual similarities do not deliver the
owner's requested reuse.

**Contract.** Every adoption task starts from a pinned upstream commit and
named source file, with licence/notice obligations, the exact functions or
skill sections to keep, discarded runtime and dependencies, overlap with Rig,
integration seam, maintenance owner and verification. Direct copies or ports
carry provenance; independently inspired code is labelled as such. Upstream
code stays unexecuted during planning.

**Acceptance.** `AC-C22-1` every adopted row in the
[matrix](12-reuse-plan.md) has the full source/licence/keep/discard/test fields;
`AC-C22-2` a selective fork includes the required notice and a behaviour
regression; `AC-C22-3` duplicate skill ownership is resolved before install;
`AC-C22-4` a rejected or unverified candidate is not presented as integrated.
