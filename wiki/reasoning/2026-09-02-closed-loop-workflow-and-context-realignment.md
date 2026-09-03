---
date: 2026-09-02
source: agent
topics: agent-working-conventions, testing-strategy, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: interdependency, deferred
summary: Design for closing the issues→fix→review loop and preventing wiki/context bloat via a realignment skill and agentic harness. Highest-priority deferred item.
---

# Closed-loop workflow, context realignment, and agentic harness

Provenance: post-`qa-prod` deploy review turned up 8 findings (2 blockers,
2 highs, 4 med) whose *classes* had already recurred multiple times across
prior releases. The user asked whether the workflow itself is causing the
loop. The answer is yes, structurally, and this trace records the full
design of the fix — including the context management and realignment work
needed to make it stick.

Companion trace: [[2026-09-02-wiki-maintenance-skill]] scoped the
post-release upkeep routine. This trace scopes the *authoring-time* loop —
how patterns get caught before code is written, and how the wiki itself
stays legible as it grows. The wiki-maintenance skill's Deferred section
now points here as the highest-priority follow-on.

---

## Part 1 — The three structural gaps causing the loop

The workflow is optimized for *deciding what to build* and *proving what
was built*. It has no phase whose job is *systematically hardening trust
boundaries*, and no phase whose job is *preventing invariant drift across
parallel authoring surfaces*. Both gaps are silent — they only surface in
adversarial review, which runs after ship, which is why every release
resets the loop.

**Gap A — the oracle only freezes the happy path.** `rig-grilling` locks
business intent and acceptance criteria before implementation. Adversarial
invariants ("the signature binds the bytes", "the temp file refuses
symlinks", "the verify path fails closed") are not business acceptance
criteria, so they never enter the frozen oracle. TDD then implements the
frozen oracle faithfully. Review finds what was never in the spec.

**Gap B — reviews are post-hoc and diff-scoped.** `rig-code-review` runs
after the branch is written and looks at diff. Design-time defects are
baked in before review exists; cross-file drift (F5's duplicated version,
F8's wiki-maintenance vs `reasoning/README.md` immutability) is invisible
to a diff-scoped review.

**Gap C — each cycle patches instances, not the pattern.** Findings get
one-off fixes; no phase requires extracting a rule from a finding class
before closing the review. `wiki/index/traps.md` and `wiki/mistakes/`
exist for this and are used, but the workflow does not *require* new
patterns to land there before review close, so next feature can
rediscover.

The wiki is not the loop. **The wiki is a ledger; a ledger does not act.**
What closes the loop is a *phase obligation to consult the ledger at the
right moment* + a *derivation step after review that converts findings
into consultable form*. Right now the ledger and the review exist; the two
arrows connecting them do not.

---

## Part 2 — The closed loop (three parts)

### Part 2A — Ledger of enforceable patterns

Convert `wiki/index/traps.md` and `wiki/mistakes/` from prose-only to a
mixed format:

- Each pattern is still described in prose (history matters, the "why we
  learned this the hard way" is load-bearing).
- Each pattern additionally exposes three machine-legible fields:
  - **Pattern** — short name, kebab-case.
  - **Enforcement site** — the phase or CI check that must catch it.
    Values: `ci-grep`, `grilling-closeout`, `product-design-closeout`,
    `code-review-checklist`, `spec-closeout`, `wiki-lint`.
  - **Check** — the concrete command or checklist question.

The `wiki/mistakes/` directory (only two files today: `README.md`,
`guarantee-sharding.md`) is the target format — one file per named
anti-pattern with a fixed frontmatter shape. Extend the frontmatter
contract to include `enforcement_site:` and `check:`. Backfill the
existing traps.md prose entries as `mistakes/*.md` rows.

`wiki/index/rejected.md` gets the same treatment: each rejection names the
phase where the rejection must be reconsulted before reopening.

### Part 2B — Derivation step at review close

`rig-code-review` currently ends when findings are fixed. Add a required
step: **for each finding class, extract a rule and file it as a
`mistakes/*.md` entry** with `enforcement_site` + `check`. Either as:

- **CI grep** — strongest form; works for machine-checkable patterns
  (`catch{}` in verify paths, `writeFileSync` on predictable temps,
  duplicated version constants, bare digest fields stored beside bytes).
  Lands as `scripts/check-*.js` and wires into `npm test`.
- **Checklist row against a specific phase** — for judgment calls
  (aggregate boolean over per-item decision, "TOFU captured at approval
  must re-verify at commit").

Review is not closed until every finding class is either (a) proven
already-covered by an existing rule or (b) has a new rule filed and (if
CI-expressible) landed in the same PR.

### Part 2C — Consultation obligations at phase transitions

Each Rig phase gets a closeout that reads relevant rows from Part 2A:

- **`rig-grilling` closeout** — enumerate trust boundaries the spec
  introduces (signature, filesystem write, verify path, approval gate).
  For each, walk `mistakes/*.md` filtered on `enforcement_site:
  grilling-closeout` and answer per boundary. If a trap does not apply,
  record why. If it does, an adversarial acceptance criterion enters the
  oracle before freeze.
- **`rig-product-design` closeout** — for each new constant, file, or
  authority introduced, grep for existing declarations of the same rule.
  Reconcile conflicts as a decision, not a patch. This alone would have
  stopped F5 (duplicated version) and F8 (wiki-maintenance vs
  reasoning immutability).
- **`rig-code-review` opening** — load `mistakes/` entries scoped to
  `code-review-checklist`; scan the diff explicitly for each.
- **CI** — run every `ci-grep`-form check on every push. Fail-closed
  backstop.

---

## Part 3 — Worked example: F1–F8 through the closed loop

| # | Finding                                | Extracted rule                                              | Enforcement site           |
|---|----------------------------------------|-------------------------------------------------------------|----------------------------|
| 1 | digest stored beside bytes             | derive-on-read for any hash that guards bytes               | product-design-closeout + optional ci-grep for `content_digest.*=` adjacent to `writeFileSync` |
| 2 | symlink `.tmp` follows                 | no `writeFileSync` on predictable filenames                 | ci-grep (hard fail)        |
| 3 | post-approval mutations baselined      | TOFU captured pre-confirm must re-derive at mutation        | grilling-closeout enumerate captured-at-approval state |
| 4 | mixed-host installs drop fallback      | per-item, not per-set, decisions for install-time capability| product-design-closeout    |
| 5 | duplicated version hard-codes          | one source of truth per constant; grep before adding        | ci test: README ↔ manifest |
| 6 | `catch {}` in verify fails open        | no bare catch in `*-check.js` / `*-state.js`                | ci-grep (hard fail)        |
| 7 | MCP text bloat                         | every spec sentence gets one test                           | spec-closeout: table of spec claims → test file:line |
| 8 | wiki-maintenance overrode immutability | before adding new authority, grep for existing rules on same subject | product-design-closeout + wiki-lint |

Three become CI grep (fail-closed, zero human effort forever), three
become checklist items in specific phases, two become closeout table
obligations. Once these land, none of these classes can silently ship
again.

---

## Part 4 — Context bloat (measured)

Snapshot 2026-09-02:

- `wiki/reasoning/` — 172 traces, 30,544 lines, 1.1MB.
- Largest single trace: `2026-08-31-path-b-technical-spec.md` at 1,260
  lines. Ten more over 200 lines each.
- `wiki/mistakes/` — 2 files. Underpopulated relative to the ~30 named
  patterns already described in `traps.md` prose.
- `wiki/agent-primer.md` — 55 lines (good, entry stays small).
- `wiki/Home.md` — 125 lines. `wiki/status.md` — 49 lines (generated).
- Trap `summary:` frontmatter fields are mostly empty on `historical`
  traces (correct per contract) but many `current` traces also carry no
  summary, so an agent has no cheap way to decide "load body or not".

Symptoms of the bloat:

- No cadence archives old-and-superseded traces; they stay hot even when
  the topic hub has fully absorbed them.
- No tiered summary layer — traces are verbatim intake with nothing
  between "read the whole thing" and "read the hub". Hubs are the
  synthesis but they carry per-trace fidelity poorly, and traces
  themselves have no distilled version.
- Cross-links (`[[...]]`) carry no size hint, so an agent following a
  link cannot decide "cheap detour or expensive detour".
- Rules that live in prose (e.g. traps.md entries) grow unbounded; the
  file is 300+ lines and the pattern will not be found by grepping
  unless the reader already knows what to grep for.
- Duplicate authorities on the same subject (F8 shape) accumulate
  silently — no lint asserts that a rule exists in only one place.

---

## Part 5 — Context-debloat techniques (10)

These are the levers a realignment skill would pull. Ranked highest ROI
first.

1. **Tiered summaries** — every trace's `summary:` frontmatter is
   populated (one line; even historical traces get one). Agent reads
   summary → decides whether to load body. Enforce via wiki-lint. Highest
   ROI: 172 summaries at ~15 words each = ~2,500-line summary index
   that replaces 30,000 lines of body for triage.

2. **Structural extraction — patterns leave prose, become
   tables/CI.** (Part 2A.) The prose is history; the mixed-format
   `mistakes/*.md` entry is what phases consult. Reduces "read all of
   traps.md" from ~300 lines to ~30 file listings + selective body reads.

3. **By-reference layout** — traces cite each other with `[[...]]`
   rather than restating; `agent-primer.md` fans out to hubs which fan
   out to traces. Already partially done. Extend with size hints in the
   link render (`[[foo]] (~40 lines)`) so an agent can budget.

4. **Retrieval, not preload** — the agent does not preload the wiki.
   `agent-primer.md` is the only mandated read; everything else is
   grepped/queried on demand. Where semantic search is available
   (`gbrain` in this environment), index the wiki and prefer semantic
   queries over broad file reads.

5. **Distillation cadence** — old traces get folded into topic hubs,
   then the raw trace moves to `wiki/archive/` (already exists). Only
   recent-window traces (say last 30 days) or currently-cited traces
   stay hot. Wiki-maintenance skill Step 4 owns this; formalize the
   window and enforce.

6. **Freshness signal** — every trace has `status: current|superseded|
   historical`. Agent skips `historical`/`superseded` unless explicitly
   looking for it. Wiki-lint asserts every non-current trace whose
   `status:` is unset gets flagged.

7. **Progressive disclosure** — primer (1 page) → hub (~5 pages each)
   → trace (leaf). Agent stops at the shallowest level that answers the
   question. Ensure hubs actually synthesize; a hub that just lists
   trace names is not doing its job.

8. **Dedup enforcement** — same rule appearing in multiple files is
   both bloat and drift risk (F8's cousin). Wiki-lint scans for
   duplicate assertions across `wiki/`, `.claude/skills/`,
   `rig/tier-1/rules/`. Cross-doc invariants must cite each other.

9. **Cap-and-split rule** — no single trace over N lines (candidate:
   500). Longer traces are split by topic or archived-with-summary.
   The 1,260-line spec becomes a small hub + linked sections.

10. **Adaptive harness (Part 6)** — the harness itself prunes context
    between phase transitions; this is the highest-order lever and gets
    its own section.

---

## Part 6 — Agentic harness engineering

The wiki-maintenance skill is *authoring-time*. The realignment work is
*session-time* — the harness must adapt to the task and the phase, not
statically preload everything and hope grep saves it.

**Direction:** the harness (Rig's phase router + skill entry logic)
becomes agentic and phase-aware. Concretely:

- **Phase-scoped context loading.** At skill start, the harness inspects
  the task and the current phase, then loads only that phase's obligations
  and the `mistakes/*.md` entries scoped to it. `rig-grilling` does not
  need to load `code-review-checklist` entries; `rig-code-review` does
  not need to load `grilling-closeout` entries.
- **Trap prefiltering.** Before a phase closeout runs, the harness
  filters `mistakes/*.md` by `enforcement_site:` and (where possible) by
  the file paths the task touches. Grilling on a signing feature loads
  signature-related traps; grilling on a UI change does not.
- **Trace budget per session.** Harness declares a soft cap on wiki
  bytes loaded per session; when a follow-link would exceed the cap,
  the harness prefers the summary over the body and warns the agent to
  narrow the query.
- **Context prune at phase transition.** Between phases in a multi-phase
  session, the harness drops loaded context that the next phase does not
  need. Prevents accumulating cruft across a long session.
- **Semantic retrieval layer.** Where `gbrain` (or equivalent) is
  available, harness routes non-navigational queries through it instead
  of loading files. Skill instructions annotated with "prefer semantic
  query" for queries where grep is a poor match.

This is what turns the harness from a static shell into an adaptive one.
The realignment skill (Part 7) is the on-demand tool the user runs when
alignment or bloat drifts; the harness is the continuous discipline that
keeps sessions from re-accumulating the same drift.

---

## Part 7 — The `realignment` skill (spec)

**Name:** `realignment` (candidate — user-provided).
**Location:** `.claude/skills/realignment/SKILL.md` +
`scripts/realignment.js` (`status`, `check`, `plan` modes).
**Trigger:** user-initiated; also runnable on schedule via `/schedule`.
**Kind:** authoring-time, not part of installed Tier 1 payload (same
class as `wiki-maintenance`).

**What it does — status mode (read-only):**

1. **Alignment scan** — walks `.claude/skills/`, `rig/tier-1/rules/`,
   `wiki/reasoning/README.md`, `wiki/mistakes/`, `wiki/index/traps.md`
   and looks for duplicate authorities on the same subject (F8-shape).
   Reports pairs and asks for a decision.
2. **Bloat scan** — per-trace line count vs cap; missing `summary:` on
   `current` traces; historical traces still cited by hubs; hubs that
   are trace-listings without synthesis; heaviest N files.
3. **Trap-table health** — count of prose-only traps vs
   structured-mixed traps; count of `mistakes/*.md` entries per
   `enforcement_site`; findings from the last N review cycles with no
   corresponding rule extracted.
4. **Consultation coverage** — for each phase closeout, does the
   skill's instructions reference the trap table? Missing references
   are flagged.
5. **Context weight report** — per-phase, estimated bytes an agent
   would load if it followed the primer + hub + relevant-mistakes
   route. Trends over time (stored in `.rig/realignment-history.jsonl`).

**What it does — check mode (wiki-lint additions):**

- Fails on any trace with unset `summary:` and `status: current`.
- Fails on any `mistakes/*.md` missing `enforcement_site` or `check`.
- Fails on any trace over cap lines without an archive marker.
- Fails on any rule appearing verbatim in two authority files without a
  cross-cite.

**What it does — plan mode (proposal-only, no writes):**

- For each duplicate authority, proposes a canonical location.
- For each oversized trace, proposes a split or archive plan.
- For each historical trace still cited by a live hub, proposes a hub
  rewrite that absorbs the trace.
- For each unclassified finding, proposes a rule and enforcement site.

Plan mode's output is a markdown proposal file the user reviews. Nothing
is applied automatically — realignment is deliberately user-approved,
because reconciliation is a decision, not a sweep. (This is exactly the
lesson from F8: don't let an automation silently override existing
rules.)

**Relationship to wiki-maintenance:**

- `wiki-maintenance` — routine, post-release, mostly idempotent
  hub-sync + archive. Runs on schedule.
- `realignment` — on-demand, whenever the user senses drift or context
  cost has grown. Reports and proposes; does not sweep.

Both share `scripts/build-wiki-index.js` and lint helpers, but the
skills stay separate — different when-to-run and different verdicts.

---

## Part 8 — Deliverables (full, prioritized)

The user asked for the full build, not minimal. In implementation order:

**Tranche 1 — Ledger conversion (unblocks everything else):**

1. Extend `wiki/mistakes/*.md` frontmatter contract with
   `enforcement_site` and `check` fields. Update
   `wiki/mistakes/README.md` to document the new fields.
2. Backfill every prose trap in `wiki/index/traps.md` as a
   `wiki/mistakes/<slug>.md` entry. Keep the prose as history in the
   entry body; the frontmatter carries the enforceable fields.
   `wiki/index/traps.md` becomes a chronological index; the mistakes
   entries are the machine-consulted source.
3. File one `wiki/mistakes/<slug>.md` per F1–F8 finding class. Each
   with its enforcement site per Part 3 table.

**Tranche 2 — CI enforcement (the fail-closed backstop):**

4. `scripts/check-no-writefilesync-predictable-temp.js` — grep-based;
   fails on `writeFileSync` in code paths writing to `${x}.tmp`
   patterns. Wire into `npm test`.
5. `scripts/check-no-bare-catch-in-verify.js` — fails on
   `catch\s*[({]\s*[)}]` in `**/*-check.js` and `**/*-state.js`.
   Wire into `npm test`.
6. `scripts/check-version-single-source.js` — asserts README examples
   match `rig/manifest.json`. Wire into `npm test`.

**Tranche 3 — Phase closeout obligations:**

7. Extend `rig-grilling` skill: closeout section requires
   trust-boundary enumeration + per-boundary trap consultation.
8. Extend `rig-product-design` skill: closeout section requires
   duplicate-authority grep + reconciliation.
9. Extend `rig-code-review` skill: opening loads scoped mistakes;
   closeout requires rule extraction per finding class.

**Tranche 4 — Realignment skill:**

10. Author `.claude/skills/realignment/SKILL.md` per Part 7.
11. Build `scripts/realignment.js` — `status`, `check`, `plan` modes.
12. Extend wiki-lint (in `scripts/wiki-maintenance.js`) with the four
    check-mode assertions from Part 7.

**Tranche 5 — Context debloat sweep (one-time cleanup):**

13. Populate `summary:` frontmatter on every `current` trace missing it.
14. Split the 1,260-line technical-spec trace into a hub + linked
    sections; move original to `wiki/archive/` with pointer.
15. Sweep historical traces older than a defined window (candidate: 90
    days) that are not cited by a live hub → `wiki/archive/`. Regen
    indexes.

**Tranche 6 — Adaptive harness (research + implementation):**

16. Research spike: measure current per-skill context weight; identify
    which skills preload vs. lazy-load.
17. Design phase-scoped context loading — how does a skill declare its
    consultation footprint? Candidate: `consults:` frontmatter naming
    the `enforcement_site` slugs.
18. Implement trap-prefilter helper in `scripts/`; expose to skills.
19. Wire semantic-retrieval hint annotations into skill instructions
    where `gbrain` is available.

**Tranche 7 — Wiki self-invariant guard (post-F8 hardening):**

20. Reconcile `wiki/reasoning/README.md` (traces are immutable) with
    `wiki-maintenance` skill (frontmatter is amendable metadata layer,
    not body). File the decision explicitly; cross-cite in both files.
    The wiki-maintenance skill's Ground rule #1 already implies this
    reconciliation but does not explicitly cite `reasoning/README.md`;
    close that gap.
21. Add wiki-lint rule: any new file under `.claude/skills/` or
    `rig/tier-1/rules/` triggers a duplicate-authority grep at CI time.

---

## Part 9 — Open questions / decisions still needed

- Line cap for `cap-and-split` — candidate 500; user to confirm.
- Archive window — candidate 90 days; user to confirm.
- Should `mistakes/` be renamed? User asked whether "realignment" is
  the right skill name; if so, `mistakes/` might also be renamed
  `patterns/` or `rules/` to match. Deferred.
- Does adaptive harness (Part 6) need Rig-level primitives, or can it
  be implemented per-skill? Recommended: per-skill first, extract
  primitives once three skills share the pattern.
- `wiki-maintenance` and `realignment` skill boundaries may fuzz over
  time. If they do, merge; do not maintain two overlapping skills.

---

## Part 10 — Session log (appendable)

Adding here as this conversation and future sessions progress. Newest
first.

**2026-09-02 (this session, agent):** Initial design filed. User confirmed
the direction: full build, not minimal. Priority: highest. Companion trace
[[2026-09-02-wiki-maintenance-skill]] updated to point here.

<!-- Future sessions: append entries above this line; do not edit
existing entries (trace immutability). New material that supersedes this
design goes in a new dated trace with `supersedes: 2026-09-02-closed-loop-workflow-and-context-realignment`. -->
