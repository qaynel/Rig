---
status: current
checked: 2026-10-23
owner: rig-product-design
---

# B. System architecture

The [system interaction diagrams](18-system-interactions.md) add the complete
discover-to-transfer state, trust, memory, delegation, review, recovery and
release interactions. This design remains editable after the separate new
programme oracle is approved; it does not redefine signed behavior.

PROPOSED, except where marked IMPLEMENTED. This is also deliverable 4, the
architecture and integration plan: components, contracts, dependencies, data
flow and diagrams.

## Design rules this architecture obeys

1. **One authoritative implementation per capability.** No two mechanisms may
   own the same job. Where a capability already exists in Rig, the new work
   extends it rather than sitting beside it.
2. **The active view is bounded; the memory is not discarded.** The 8 KB
   always-read projection points to scoped, searchable memory, traces and
   evidence. Every retained item has provenance and a lifecycle.
3. **Determinism where a machine suffices.** Counting, keying, diffing,
   resuming, and gate checks use no model call. Models are used for judgement
   only.
4. **The oracle is above the system.** Nothing in the architecture — including
   the self-improvement path — can write to the frozen acceptance set, the trust
   root, or its own evaluation rules.
5. **Preserve the existing seams.** Central corpus, host-agnostic projection,
   one trust root, exact-byte evidence. Source-level upstream reuse is assessed
   before new code (North star 1–18).

## Component map

```
 ┌───────────────────────────── RIG CORPUS (central, host-agnostic) ──────────────────────────────┐
 │  rig/corpus/routing.md          one task router                        [IMPLEMENTED]            │
 │  rig/corpus/skills/*            phase owners (9)                       [IMPLEMENTED, 3 to add]  │
 │  rig/corpus/standards/*         ai-sdlc, change-management, delivery    [IMPLEMENTED]            │
 │  rig/corpus/rules/*             rig.md, communication.md               [IMPLEMENTED]            │
 │  rig/corpus/services/*          catalogue of installable services      [IMPLEMENTED]            │
 │  rig/corpus/checks/*            GENERATED prevention checks            [PROPOSED]                │
 │  rig/corpus/trust/              gate1.allowed-signers — one trust root [IMPLEMENTED]            │
 └───────────────┬────────────────────────────────────────────────────────────────────────────────┘
                 │  rig/bootstrap.sh → rig/lib/payload.js → projection    [IMPLEMENTED]
                 ▼
 ┌───────────────────────────── INSTALLED REPOSITORY (.rig/) ─────────────────────────────────────┐
 │                                                                                                │
 │  .rig/ledger.md          ◄── MANDATORY READ at every phase transition   [PROPOSED]  C1         │
 │    decided │ preferences │ recurring │ where-we-are       (byte-capped, agent-written)         │
 │                                                                                                │
 │  .rig/profile/           portable export of decided+preferences         [PROPOSED]  C2         │
 │  .rig/memory/            scoped searchable knowledge and provenance      [PROPOSED]  C19        │
 │  .rig/runs/<id>/         per-run state machine, resume point, evidence  [PARTIAL]    C15        │
 │  .rig/checks/            graduated deterministic checks                 [PROPOSED]  C13        │
 │  .rig/rules/, .rig/skills/, .rig/plumbing/   projected corpus           [IMPLEMENTED]          │
 │  .rig/policy/, .rig/trust/                   signed policy + trust root [IMPLEMENTED]          │
 │                                                                                                │
 │  wiki/ (or the host project's own convention)  unbounded reference      [IMPLEMENTED]          │
 │  host-native model/subagent tools + Rig routing contract                 [PROPOSED]  C16        │
 └────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Component responsibilities and interfaces

### C1 · Ledger — `.rig/ledger.md`

- **Owns:** the compact 8 KB mandatory-read projection, not all memory or
  evidence. It points to source records and never grants authority.
- **Written by:** any phase owner, through one library (`rig/lib/ledger.js`),
  never by hand-editing in a skill.
- **Read by:** every phase transition, the pre-flight gate, onboarding, the
  reviewer prompt builder, and the profile exporter.
- **Contract:** `read() → { decided[], preferences[], recurring[], where[] }`;
  `record(section, entry)`; `evict()` enforces the cap by graduation or drop;
  `render() → string` is deterministic and byte-stable for identical input.
- **Invariant:** `render()` output ≤ 8,192 UTF-8 bytes. Overflow preserves
  protected decisions and preferences, archives other entries with references,
  and raises a named gap if those protected entries alone cannot fit.
- **Does not:** hold the full history. Retrieval from the deeper memory layer
  adds relevant excerpts to the task context on demand within a separate budget.

### C2 · Profile — `.rig/profile/`

- **Owns:** cross-project transfer. Export developer-level preferences and
  explicitly portable decisions with provenance; project-specific decisions,
  `recurring` and `where-we-are` remain local.
- **Interface:** `rig profile export → directory`; `rig onboarding --profile
  <dir>` imports with adaptive reconstruction — an imported preference that
  contradicts the new repository's observed conventions is surfaced as a
  question, not silently applied.
- **Trust boundary:** an imported profile is **untrusted data**. It can set
  preferences; it can never set policy, grant permission, add a signer, or
  disable a check. Validated against a schema and stripped of anything else.

### C3 · Pipeline and phase owners

The owner-facing A–H journey maps to these internal transitions. The host agent
may run several without interrupting the human. Missing owners and gates are
proposed; existing phase skills and release scripts remain authoritative.

| # | Phase | Owning skill | State |
|---|---|---|---|
| 0 | Install and adapt | `rig-onboarding` + bootstrap | IMPLEMENTED, profile branch proposed |
| 1 | Grill intent → problem statement | `rig-grilling` | IMPLEMENTED |
| 2 | Requirements + solution, separated from implementation choice | `rig-grilling` | PARTIAL |
| 3 | Acceptance criteria | `rig-grilling` → `wiki/gate1/` | IMPLEMENTED |
| 4 | **LOCK requirements, acceptance and tests** | `scripts/approve-gate1.js` | EXISTING SIGNATURE, ORDER ALIGNMENT PROPOSED |
| 5 | Technical design | `rig-product-design` | IMPLEMENTED |
| 6 | **Scope of work** | `rig-scope` | **PROPOSED** |
| 7 | Implementation (TDD, routed models, subagents) | `rig-tdd`, `rig-implementation`, `rig-execution` | PARTIAL |
| 8 | Review loop until criteria met | `rig-code-review`, `scripts/review-receipt.js` | IMPLEMENTED |
| 9 | **Documentation** | `rig-document` | **PROPOSED** |
| 10 | **Close-out / logging** | `rig-closeout` | **PROPOSED** |
| 11 | Release gate and push | `scripts/check-deployment-gate.js` | IMPLEMENTED |
| 12 | Learn, compact and transfer | existing wiki tools + proposed memory lifecycle | PARTIAL |

The router currently lists technical design before the lock, while the owner's
preferred sequence puts it after. This is a workflow-order correction for the
later pipeline work: the current signature already excludes the technical
design, so it does not change what is frozen. See the corrected
[decision record](09-decision-register.md).

### C4 · Pre-flight gate

- **Owns:** every phase transition. One function, one call site per transition.
- **Contract:** `preflight(fromPhase, toPhase, ledger) → { missing[], recurring[], ready }`.
  Deterministic. No model call.
- **Behaviour:** reports missing artefacts and relevant recurring findings
  before work starts. It resolves routine omissions itself, asks only where
  intent or protected authority is required, and blocks when a signed or
  security gate requires it. No prompt for every internal transition.

### C5 · Graduation

- **Owns:** turning a twice-seen failure into a deterministic check.
- **Input:** the finding-class history already produced by
  `scripts/review-receipt.js` (IMPLEMENTED) plus phase-failure records.
- **Output:** a candidate persistent mechanism — preference, skill, script,
  workflow, policy or check — with source occurrences, a proving fixture where
  executable, and a regression result.
- **Authority:** safe memory maintenance and non-protected checks may promote
  after independent automated evidence. A change to frozen acceptance,
  executable policy, security controls or authority requires the existing
  human key. See [05-recursive-improvement.md](05-recursive-improvement.md).

### C6 · Run record — `.rig/runs/<id>/`

- **Owns:** "where did this stop and how do I continue". Generalises the
  per-attempt state machine already implemented for reviews (RIG-124.3).
- **Contract:** states `{ running, completed, failed, interrupted }`; an
  in-flight marker with a nonce written before the risky operation and cleared
  in the same write as the outcome; recovery accounts for an interrupted attempt
  exactly once.
- **Why this shape:** it is already built, tested and proven for the review
  phase. Reusing it is one implementation for one capability.

## Data flow — one change, end to end

```
owner intent (prose)
   │
   ▼  read ledger ──────────────────────────────────┐
[1 grill] ── problem statement ───────────────────► │
   │  preflight(1→2)                                │
   ▼                                                │  every transition
[2 design] ── business spec ──────────────────────► │  reads the ledger and
   │  preflight(2→3)                                │  records decisions into
   ▼                                                │  it; nothing else is
[3 acceptance] ── criteria ───────────────────────► │  mandatory reading
   │                                                │
   ▼  OWNER SIGNS  (ssh-keygen -Y sign, one trust root)
[4 LOCK] ── wiki/gate1/*.manifest frozen ─────────► │
   │  preflight(4→5): "criteria signed? digest matches?"
   ▼                                                │
[5 tech design] ─ technical spec ─────────────────► │
   ▼                                                │
[6 scope of work] ─ ordered work packages ────────► │
   ▼                                                │
[7 implement] ─ code + tests ─ cheap model, subagents, ledger as context
   ▼                                                │
[8 review] ─ receipt ◄── finding history ─────────► │  recurring classes feed
   │           │                                    │  the next round's prompt
   │           └── class fires twice ──► [C5 graduation] ──► proposed check
   │  loop until criteria met or cap reached        │
   ▼                                                │
[9 document] ─ user-facing docs ──────────────────► │
   ▼                                                │
[10 close-out] ─ decisions logged, ledger pruned ─► │
   ▼
[11 release gate] ─ exact-byte evidence ─► push
```

## Memory and context management

The 8 KB cap is an **active projection**, not a retention limit:

| Tier | Artifact | Bounded? | Mandatory to read? | Cost |
|---|---|---|---|---|
| **Hot** | `.rig/ledger.md` | 8,192 UTF-8 bytes | **yes, on arrival and transition** | cheap summary and pointers |
| **Warm** | developer/project memory + current wiki or host convention | bounded by configured retention | only relevant retrieval | shipped offline semantic search plus cited lexical fallback |
| **Cold** | archived traces and superseded sources | configurable retention | no; explicit recall | compressed, provenance-preserving |
| **Protected** | signed contract, review receipts, release evidence | retention by gate and audit rule | machine-read at gates | never removed as sole surviving proof |

The memory record stores scope (`developer` or `project`), source, timestamp,
confidence, last confirmation and supersession link. Retrieval filters by scope
and provenance first, then ranks lexical and locally embedded semantic candidates.
The answer cites its source; contradictory preferences are surfaced once and
the newer owner correction supersedes the older one. No unreviewed memory text
may grant permission or override the signed contract. The existing
`scripts/wiki-query.js` supplies cited lexical fallback. The public artifact
must ship a pinned local model, tokenizer and runtime so semantic indexing and
paraphrase recall work on a fresh supported installation with network access
denied. A missing or corrupt model reports a capability failure; lexical results
cannot satisfy public-release acceptance. The candidate runtime and model in
the reuse plan remain subject to native-platform, footprint and integrity proof.

Compaction first writes a candidate summary and source map, then a deterministic
fidelity check verifies all unresolved decisions, protected evidence references
and representative regression fixtures remain reachable. Only then can a
configured policy move or delete a redundant source. The present three-minute
trace cadence stays. The active view drops whole low-priority excerpts in a
fixed order but retains their warm/cold references; it never silently drops
settled decisions or preferences. Identical inputs render identical bytes.

## Agent orchestration and execution boundaries

- Rig does not run models. Phase owners are instructions the host agent reads;
  subagent dispatch uses the host's own mechanism. [North star]
- **Routing input:** task kind, ambiguity, code impact, security risk, required
  evidence, available host models/tools, their declared capabilities and
  current cost/latency hints. Never infer a model exists from a brand name.
- **Selection:** deterministic script first; otherwise the lowest-cost
  available model that meets the task's risk and context needs. Mechanical
  bounded work may use a cheap child. Product discovery, difficult debugging,
  architecture and protected review require stronger judgement. The host
  executes the dispatch; Rig supplies the classification and brief.
- **Boundaries:** each child gets one task, relevant source citations, the
  active view and exact acceptance slice, with a bounded call/time budget.
  It cannot edit the signed oracle, grant itself permission or certify its own
  result. Independent tests/review verify generated artefacts. A failed cheap
  attempt escalates once with its evidence, then stops with a named blocker;
  retries do not create unbounded swarms.
- **Coordination:** independent read-only work can fan out; writers receive
  disjoint files or isolated worktrees and one integration owner. A workspace
  lock and compare-and-swap preimages catch collisions. The run record tracks
  owner, model, budget, start/finish, evidence and actual cost when supplied by
  the host. Unknown costs remain `unknown`, never zero.

## Trust, permission and security architecture

Unchanged from what is built, and this is deliberate — it is the part that is
already right.

| Boundary | Mechanism | State |
|---|---|---|
| Requirements and acceptance criteria | business spec + acceptance + manifested tests under one signature; agents may never edit after lock | IMPLEMENTED, ordering alignment proposed |
| Signing | one trust root, the Gate 1 key; `ssh-keygen -Y sign` | IMPLEMENTED |
| Hardware signing | `sk-ssh-ed25519` or current secure-enclave key path, verified with a real key-holder run; no private-key copy | PROPOSED VERIFICATION |
| Policy changes | signed policy approval bound to exact candidate bytes | IMPLEMENTED |
| Subprocess | spawn guard allowlist; process-group kill | IMPLEMENTED |
| Secrets | never written into installed repos; publishable-file scan | IMPLEMENTED |
| Review | report-only; reviewer contributes findings, never the receipt | IMPLEMENTED |
| **Imported profile** | untrusted data; schema-validated; cannot touch policy/trust/checks | PROPOSED |
| **Learned mechanism** | safe data updates automatic; independent regression for executable checks; protected changes use owner key | PROPOSED |
| **Ledger** | agent-written but inert: no field is executable or grants permission | PROPOSED |

Three prohibitions that are architectural, not policy:

1. No self-improvement path writes to `wiki/gate1/`, `.rig/trust/`, or its own
   evaluation rules. The improver cannot reach its own guard. (This is exactly
   the defect found in both surveyed self-improvement frameworks.)
2. No third-party agent framework is executed with access to local credentials
   or private repositories. Extraction is by reading and rewriting, not by
   running.
3. No ledger or profile field is ever interpreted as an instruction to execute.
   They are data read into a prompt, and the corpus already treats repository
   content as untrusted data.

## Host integration and portability

One corpus, projected by `rig/bootstrap.sh` through
`rig/lib/payload.js`; native discovery via `.claude/skills/` and
`.agents/skills/` with identical payloads; `rig-mcp` for MCP hosts; host hooks
reported honestly as available-but-not-integrated (North star 12). The three new
skills and active view project through the existing mechanism. Deeper memory,
model routing remains behind Rig's host contract. Memory retrieval uses the
shipped local semantic engine by default and cited lexical fallback on failure;
it never requires a host provider. The mandatory local model/runtime requires
licence, integrity, size, security and offline clean-install evidence. No
host-specific implementation becomes the canonical corpus.

## Failure recovery and observability

| Failure | Detection | Recovery |
|---|---|---|
| Session dies mid-phase | in-flight marker in `.rig/runs/<id>/` | next session resumes from `where-we-are`; interrupted attempt counted once |
| Provider outage / usage limit | positive-evidence classification | not charged as completed review; bounded at 3 consecutive |
| Reviewer returns nonsense | verdict + schema validation | execution failure, bounded, loud |
| Two agents in one workspace | run lock and file ownership | isolate independent writers or stop the conflicting one |
| Evidence invalidated by a byte change | digest mismatch at the gate | gate refuses; evidence re-earned |
| Active view corrupted or over cap | schema/byte validation | rebuild from memory and run records; report missing sources |
| Local semantic assets missing, corrupt or incompatible | integrity/version probe | cited lexical fallback and explicit failure; repair or rebuild the index; public-release gate fails |
| Compaction loses a required fact | source-map and fidelity check | keep original hot/warm; block deletion |

Observability is the run record plus existing receipts and journals. The question
it must answer without a conversation: *what phase is this in, what did the last
attempt do, why did it stop, and what is the one next action.*
