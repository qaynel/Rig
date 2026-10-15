---
date: 2026-09-08
source: agent
topics: onboarding-flow, what-rig-is, the-catalogue, delivery-plan
decisions:
status: current
supersedes:
tags: brainstorm, architecture
summary: "Brainstorm: dynamic offboarding architecture — instead of mechanically triplicating skills per host, Rig holds one canonical corpus and the onboarding agent dynamically renders the host-native version at install time. Evaluates whether this clears the blocked ticket backlog."
---

# Dynamic Offboarding Architecture — Brainstorm

## The idea, restated

**Current model:** Rig vendors 1,213 catalogue files, triplicates 8 core skills
across 3 locations (rig/tier-1/skills, .claude/skills, .agents/skills), and
uses a static manifest with 82 rows to mechanically copy bytes per host. Adding
a host means adding files. The seam is at authoring time.

**Proposed model:** Rig holds **one canonical corpus** of skills, context, and
pipeline knowledge. The onboarding agent, running on whatever host the user has,
**dynamically renders** the host-native version of the harness at install time.
The corpus is the single source of truth. The host-native artifacts are
projections, not copies.

This is not a new idea — it's the convergence of three existing traces:

1. **B1 product direction, Decision 6:** "The intelligence lives in the context
   supplied to the onboarding agent, the capability descriptions, the grafting
   instructions, the repository understanding, and the agent's reasoning."
2. **GA-36:** "One corpus, one analysis emitted per host" — approved as the
   architecture; the objection was about forking a runtime, not about the
   corpus-first approach.
3. **2026-09-04 Finding 1:** The skill triplication fails the deletion test.
   Delete `.claude/` and `.agents/` and the complexity collapses into one
   function. The seam should be `project(skills, host) → files`.

The new element from the intent owner (2026-09-08 office hours): even for hosts
Rig doesn't explicitly support, the agent can build the native version from the
corpus + knowledge of that host's conventions. Rig becomes a **context package**
that any competent agent can unpack, not a static installer that must know every
host's file layout in advance.

---

## What the architecture looks like

```text
┌───────────────────────────────────────────┐
│           Canonical Corpus                 │
│                                           │
│  rig/corpus/                              │
│    skills/          (one copy per skill)  │
│    pipeline/        (grilling, TDD, etc.) │
│    catalogue.json   (capability metadata) │
│    conventions/     (best practices)      │
│    grafting/        (how to integrate)    │
│                                           │
└────────────────┬──────────────────────────┘
                 │
                 │  onboarding agent reads this
                 │  + reads the target repo
                 │  + knows the host's native format
                 │
                 ▼
┌───────────────────────────────────────────┐
│        Dynamic Projection                  │
│                                           │
│  For Claude Code:                         │
│    .claude/skills/rig-*/SKILL.md          │
│    CLAUDE.md (grafted section)            │
│                                           │
│  For Cursor:                              │
│    .cursor/rules/*.mdc                    │
│    .cursorrules (grafted section)         │
│                                           │
│  For OpenCode/Codex/etc.:                 │
│    their native skill/instruction format  │
│                                           │
│  For an unknown host:                     │
│    agent reads host docs + corpus and     │
│    figures out the best native format     │
│                                           │
└───────────────────────────────────────────┘
```

### Key properties

1. **Single source of truth.** One `rig/corpus/` directory. No triplication.
   No `check-rule-copies.js`. No manifest with 82 copy rows.

2. **Host projections are computed, not stored.** The `.claude/skills/`,
   `.agents/skills/` directories are **output**, not source. They're generated
   by the onboarding agent (or a mechanical projector for known hosts).

3. **Unknown hosts are first-class.** The agent doesn't need a hardcoded
   adapter. It reads the host's conventions (from its own training data or from
   docs the user points it to) and builds the projection from the corpus.

4. **The corpus is the product.** What Rig ships is the knowledge: the pipeline
   design, the skill content, the grafting rules, the conventions. The
   host-specific files are delivery format, not content.

5. **Deletion as implementation.** Per Finding 1, this is mostly deletion:
   remove the triplicated copies, remove the static manifest rows, collapse
   `payload.js` into an input to the onboarding flow.

---

## What this clears from the ticket backlog

### Directly cleared or substantially simplified

| Ticket | How it's affected |
|--------|-------------------|
| **RIG-132** (one authority per semantic fact) | **Cleared.** The canonical corpus IS the single authority. Projections are computed, not duplicated. |
| **RIG-125** (parallel sources of truth re-open work) | **Cleared.** There's only one source. The projection function replaces the parity check. |
| **RIG-133** (signature freezes samples not properties) | **Simplified.** The oracle can freeze properties of the corpus + projection function rather than enumerating per-host samples. Adding a host means adding a projection, not re-signing. |
| **RIG-149** (rig-rig prefix collision) | **Cleared.** No more blanket `rig-` prefix rewrite in payload.js. The projector handles host-native naming. |
| **RIG-148** (209 files unignored) | **Cleared/redesigned.** Projections are either gitignored (tool-cache) or committed (vendored config) — the projector decides per host convention. |
| **RIG-130** (review loop has no memory) | **Simplified.** With one corpus, the review loop has one target. The wiki serves as the review memory (per the authority hardening SOW). |
| **RIG-110** (first-wire contracts for every host) | **Reframed.** Instead of 19 hardcoded host contracts, the corpus describes capabilities and the agent figures out the wire. Known hosts get a tested mechanical projector; unknown hosts get agent-mediated projection. |
| **RIG-112** (catalogue contract freeze) | **Reframed.** The corpus catalogue is simpler (no per-host variants). Freezing it becomes tractable. |

### Not affected

| Ticket | Why |
|--------|-----|
| **RIG-145** (runReadOnly batch-abort) | Shell trust, orthogonal. |
| **RIG-146** (AT-LF-20 in-memory flag) | Oracle test quality, orthogonal. |
| **RIG-147** (console.warn side channel) | Diagnostic hygiene, orthogonal. |
| **RIG-127.11/.12** (legacy uninstall) | Legacy compat, orthogonal. |

---

## How it interacts with existing decisions

| Decision | Status |
|----------|--------|
| **D24 mechanical-only detection** | **Preserved.** The corpus is mechanical. The agent does the judgment. This is exactly D24's split. |
| **GA-36 one corpus per host** | **This IS GA-36.** |
| **Path B product direction** | **This is Decision 6 implemented.** The agent receives context and dynamically unpacks. |
| **Gate 1 signed oracle** | **Strengthened.** Oracle freezes the corpus, not N copies. Fewer bytes to sign, more coverage per signature. |
| **2026-09-04 Approach A** | **Compatible.** The signed oracle as the wedge product, with the corpus as what gets frozen and the projection as install experience. |

---

## The two-tier projector

For known hosts (Claude Code, Cursor, OpenCode, Codex, Antigravity, etc.), Rig
ships a **mechanical projector** — a pure function `project(corpus, host) → files`
that's deterministic and testable. This gives:

- Byte-reproducible output (testable in CI)
- No agent needed for known hosts (fast path)
- The same function the agent calls when it decides which skills to project

For unknown hosts, the onboarding agent:

1. Reads the corpus (skills, pipeline, conventions)
2. Reads any available host documentation or conventions
3. Renders the host-native version using its own judgment
4. The result goes through the same propose/approve/apply/check flow

This means Rig is forward-compatible with hosts that don't exist yet.

---

## What needs to be true for this to work

1. **The corpus must be self-describing enough for an agent to render it.**
   Each skill needs: capability description, dependencies, integration points,
   what it adds to the pipeline. Currently the SKILL.md files have this
   implicitly but not in a structured way.

2. **Known-host projectors must be tested.** The current triplication is bad
   engineering but it works. The projector must produce equivalent output.

3. **The onboarding flow must handle the "no mechanical projector" case.**
   The agent-mediated path needs a verification step: did the rendered
   projection actually work?

4. **The oracle signing story must adapt.** Instead of freezing N copies of
   byte-identical files, freeze the corpus + the projector. A corpus change
   invalidates the oracle. A new host projector does not (it's additive).

---

## Risk assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Agent renders garbage for unknown host | Medium | The check step verifies; the user approves before apply |
| Mechanical projector has bugs | Low | It's a pure function; heavily testable |
| Corpus isn't rich enough for agent rendering | Medium | Iterate on corpus quality based on real onboarding runs |
| Breaking change for existing installs | Medium | Migration: detect triplicated layout, offer corpus-based re-onboarding |

---

## Implementation sketch (if approved)

### Phase 1 — Corpus extraction (mostly deletion)
1. Identify the canonical version of each skill (rig/tier-1/skills/ is the source)
2. Move to `rig/corpus/skills/`
3. Delete `.claude/skills/rig-*` and `.agents/skills/rig-*` (projected copies)
4. Delete the copy rows from `rig/manifest.json`
5. Delete `check-rule-copies.js`
6. Add `project(corpus, host) → files` function
7. Test: `project(corpus, 'claude') ≡ old .claude/skills/` (byte-identical)

### Phase 2 — Onboarding integration
1. The onboarding flow calls `project()` for known hosts
2. For unknown hosts, the onboarding agent reads the corpus and renders
3. Both paths go through propose/approve/apply/check

### Phase 3 — Catalogue simplification
1. Replace 805 formulaic service files with one generated table
2. Reference upstream skill sources instead of vendoring
3. The corpus catalogue becomes: what Rig adds (pipeline, oracle, grafting)
   plus a manifest of what it references (upstream skills)

---

## The critical question

**Does this actually work for the "even if we don't support that host" case?**

Test: take a host Rig has never seen (e.g., a new IDE with its own agent
format). Give the onboarding agent:
- The Rig corpus (skills, pipeline, conventions)
- The host's documentation

Can the agent produce a working harness? If yes, the architecture is sound. If
no, we're still stuck with per-host mechanical adapters.

This is testable without building anything — just hand the corpus and a host's
docs to an agent and see what it produces.

---

## Verdict

The dynamic offboarding architecture is the natural convergence of B1 Decision 6,
GA-36, and Finding 1. It's mostly deletion (remove triplication) plus one new
function (project). It clears or simplifies 8 of the 12 blocked/backlog tickets.
It makes Rig forward-compatible with unknown hosts. And it's what the intent owner
has been describing since "one corpus, translated natively per host."

**Recommendation:** Proceed to a grilling session to lock this as the
implementation direction, then execute Phase 1 (corpus extraction) as the first
work item on this branch.
