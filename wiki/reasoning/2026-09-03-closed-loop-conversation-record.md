---
date: 2026-09-03
source: agent
topics: agent-working-conventions
decisions:
status: current
supersedes:
tags: interdependency, deferred
summary: Conversation record that produced the closed-loop workflow + realignment + adaptive harness design. Resume-from-cold entrypoint for the deferred build.
---

# Conversation record — closed-loop workflow, realignment, and agentic harness

This trace preserves the *conversation* that produced the design filed in
[[2026-09-02-closed-loop-workflow-and-context-realignment]]. It exists so a
future session (or a different agent) can resume from cold without
re-deriving the reasoning path. Read this trace to understand *why* the
design took the shape it did; read the design trace for the spec itself.

---

## Trigger

A post-`qa-prod` deploy review of Path B onboarding hardening returned 8
findings — 2 blockers, 2 highs, 4 mediums — captured verbatim in
`.context/attachments/hRQxxl/pasted_text_2026-09-02_23-15-27.txt`. The
findings' *classes* had already recurred multiple times across prior
releases (Theme A appeared three times, Theme B twice, Theme C twice per
the reviewer's own summary).

**The 8 findings, one-line each:**

1. Approved proposal bytes can be replaced after signing — `proposal.digest` is a stored field, never re-derived from bytes. (Blocker)
2. Predictable `.tmp` path follows symlinks — `writeFileSync` opens `O_CREAT|O_WRONLY|O_TRUNC` which follows existing links. (Blocker)
3. Post-approval repo mutations get silently baselined — `apply` snapshots inventory *after* it writes; prepare-time `inventory.digest` never re-checked. (High)
4. Mixed-host installs drop instruction-only fallback — `installedSkillScopes` collapses to a union boolean instead of per-host decision. (High)
5. Documented installer downloads a stale product — `v5.0.0` hard-coded in README.md:29 and `skill-catalog.js:271` with no single source of truth. (High)
6. Final inventory check fails open — `inventoryDriftFailures` wraps `inventoryHarness` in `try {…} catch { return []; }`. (Medium)
7. MCP duplicates full response into text output — spec had a compact-text contract; no test asserted it; code drifted. (Medium)
8. Wiki maintenance skill contradicts trace immutability — `wiki-maintenance/SKILL.md:29` authorized frontmatter edits, `wiki/reasoning/README.md:12` declared traces immutable; neither cited the other; 92 traces edited without a decision record. (Medium)

---

## Question 1 — "Was there something off with my context that these issues were not brought up during development itself?"

**Answer:** no, context wasn't broken; workflow is. Two gaps did the work.

**Gap 1 — happy-path TDD masquerading as verification.** `rig-tdd` drives
one behavior at a time against an agreed seam; `rig-grilling` locks
business intent. Neither forces the red-team question ("what does an
attacker who can write this file do?") as a first-class step. So 699
tests, all change-detectors, and F1/F2/F3/F6/F7 all shipped with tests
proving the intended path works and none proving the trust boundary
refuses adversarial input.

**Gap 2 — no lint against parallel sources of truth.** F5 (two `v5.0.0`
hard-codes) and F8 (wiki-maintenance silently overriding immutability)
are the same failure — two files carry one rule, neither cites the
other. The wiki-reasoning discipline is good for *new* invariants but
doesn't check whether a newly-added skill contradicts an older one. F8
was caused by the recently-added `wiki-maintenance` skill — the exact
kind of thing a "cross-doc invariant must cite each other" wiki-lint
would have caught at review.

Everything else is downstream of Gap 1: verification code was
decomposed and tested like ordinary code.

The fix isn't more context. It's a workflow rule: every trust boundary
gets an adversarial test alongside the happy-path test, and CI greps
fail on `catch {}` in `*-check.js`/`*-state.js`. Would have caught F1,
F2, F3, F6, F7 at the same gate the happy-path tests passed.

---

## Question 2 — "Is there something wrong with the workflow of the product itself causing this loop of issues → fix → review → issues?"

**Answer:** yes, structurally. Three gaps compound.

**Structural Gap A — the oracle only freezes the happy path.**
Adversarial invariants aren't business acceptance criteria; they never
enter the frozen oracle; TDD faithfully implements the frozen oracle;
review finds what was never in the spec. Next feature, same gap.

**Structural Gap B — reviews are post-hoc and diff-scoped.** Design-time
defects (F1's misplaced trust boundary, F2's TOCTOU shape) are baked in
before review exists. Cross-file drift (F5, F8) isn't visible in a
diff-scoped review.

**Structural Gap C — each cycle patches instances, not the pattern.**
Theme A three times, Theme B twice, Theme C twice — fingerprint of a
fix-the-symptom loop. No phase requires extracting a rule from a
finding class before closing the review, so `traps.md` stays a
graveyard of prose that no next author reads.

Rig has more process than most projects — grilling, oracle-freeze,
reasoning traces, phase owners. All optimized for *deciding what to
build* and *proving what was built*. None systematically enumerates
trust boundaries or scans for parallel-authority conflicts. Those are
silent gaps only visible in adversarial review, which runs after ship.

---

## Question 3 — "How do I engineer this closed loop through my existing infra?"

**User's intuition was 80% right.** Correction: storing a pattern in the
wiki doesn't close the loop. The wiki is a **ledger**; a ledger doesn't
act. What closes the loop is a **phase obligation to consult the ledger
at the right moment** plus a **derivation step after review that converts
findings into consultable form**. Storage without required consultation
is a library nobody visits.

**F8 as proof:** wiki-maintenance was added and overrode
`reasoning/README.md`. The wiki already *knew* traces were immutable.
The wiki wasn't consulted when the new authority was authored.

**The closed loop has three parts:**

1. **Ledger of enforceable patterns** — `wiki/mistakes/*.md` entries
   with `enforcement_site` + `check` frontmatter, prose body preserved
   for history. Backfill all prose entries from `traps.md`. Backfill
   F1–F8.
2. **Derivation step at review close** — for each finding class in
   `rig-code-review`, extract a rule and file it in Part 1. Either CI
   grep or checklist row. No rule extracted = review not closed.
3. **Consultation obligations at phase transitions** — grilling
   closeout enumerates trust boundaries and consults scoped traps;
   product-design closeout greps for existing authorities and reconciles
   conflicts; code-review opening loads scoped mistakes; CI runs
   `ci-grep` traps on every push.

**Worked mapping of F1–F8 to enforcement sites:** in the design trace,
Part 3 table. Three become CI grep (fail-closed forever), three become
checklist rows in specific phases, two become closeout table obligations.
None of these classes can silently ship again once this lands.

**User's initial framing was "minimum viable loop"; they overruled that
mid-conversation:** *"I don't want a minimal viable loop and all. I just
want to build it fully through."* Full-build tranches are in the design
trace, Part 8, seven tranches, in implementation order.

---

## Question 4 — "Check for context bloat and confirm agentic harness engineering direction"

**Measured bloat (2026-09-02 snapshot):**

- `wiki/reasoning/` — 172 traces, 30,544 lines, 1.1MB.
- Largest single trace: `2026-08-31-path-b-technical-spec.md` at 1,260
  lines. Ten more over 200 lines.
- `wiki/mistakes/` — 2 files. Should carry ~30 named patterns already
  prose-described in `traps.md`.
- Most `current` traces have empty `summary:` frontmatter — the
  cheap-triage mechanism the contract defines is unused.
- No cadence archives superseded traces; cross-links carry no size
  hint; rules in prose grow unbounded; duplicate authorities on same
  subject accumulate silently.

**Debloat techniques discussed, highest ROI first** (full list in design
trace Part 5):

1. Tiered summaries — populate `summary:` on every `current` trace, enforce via lint.
2. Structural extraction — patterns leave prose, become tables/CI.
3. By-reference layout (user's suggestion) — extend with size hints on links.
4. Retrieval, not preload — semantic search via `gbrain` where available.
5. Distillation cadence — fold-into-hub then archive.
6. Freshness signal — skip `historical`/`superseded` by default.
7. Progressive disclosure — primer → hub → trace, stop at shallowest layer.
8. Dedup enforcement — cross-file rule scan.
9. Cap-and-split — no trace over N lines (candidate 500).
10. Adaptive harness — see below.

**Agentic harness engineering — direction confirmed correct.** The
harness (Rig's phase router + skill entry logic) becomes phase-aware:

- Phase-scoped context loading — load only that phase's obligations and
  scoped `mistakes/*.md` entries.
- Trap prefiltering — filter mistakes by `enforcement_site` and by file
  paths the task touches.
- Trace budget per session — soft cap on wiki bytes loaded; prefer
  summary over body when cap approaches.
- Context prune at phase transition — drop context the next phase does
  not need.
- Semantic retrieval layer — route non-navigational queries through
  `gbrain` (or equivalent) instead of loading files.

**The `realignment` skill (user's naming):** on-demand, user-initiated.
`.claude/skills/realignment/SKILL.md` + `scripts/realignment.js`. Three
modes: `status` (read-only report on alignment + bloat + trap health),
`check` (wiki-lint additions, fail-CI-on-drift), `plan` (proposal-only
markdown output the user reviews; nothing swept automatically —
reconciliation is a decision, not a bulk edit; explicitly the F8
lesson). See design trace Part 7 for full spec.

---

## Question 5 — "Save this entire conversation in the wiki. Where can I refer to it later?"

This trace *is* the record. To resume from cold, read these in order:

1. **Read this trace first** (`2026-09-03-closed-loop-conversation-record.md`) —
   understand the trigger, the reasoning path, the five conversation questions.
2. **Then read the design trace**
   ([[2026-09-02-closed-loop-workflow-and-context-realignment]]) —
   the full spec: three-part loop, F1–F8 mapping, context bloat measurement,
   10 debloat techniques, realignment skill spec, agentic harness direction,
   seven implementation tranches, open questions, appendable session log.
3. **Then read the reviewer's raw findings** —
   `.context/attachments/hRQxxl/pasted_text_2026-09-02_23-15-27.txt`.
   These are the concrete cases the design is engineered against.
4. **Then read the companion trace**
   ([[2026-09-02-wiki-maintenance-skill]]) — the *post-release*
   routine already scoped as the `wiki-maintenance` skill. The
   authoring-time `realignment` skill is its counterpart.
5. **Then read the current traps ledger** — `wiki/index/traps.md` and
   the two entries in `wiki/mistakes/`. Tranche 1 converts the prose
   entries in the former into structured entries in the latter.
6. **Then read topic hub** — `wiki/topics/agent-working-conventions.md`.
   Sections "Current implementation" and "Authorities and sources" both
   cite the design trace.
7. **Then read memory** —
   `project_wiki_maintenance_skill_and_deferred.md` in your Claude
   projects memory carries the HIGHEST-PRIORITY marker and the tranche
   list.

**When resuming, start by:**

- Confirm nothing has invalidated the design — grep the review corpus
  for any new findings that would reshape the tranches.
- Pick tranche 1 first (ledger conversion). Every other tranche
  depends on `wiki/mistakes/*.md` having `enforcement_site` and `check`
  frontmatter.
- Follow the full-cadence process (wiki, TDD, review) for each
  tranche. Do not batch. Each tranche is a full-cadence change per
  `CLAUDE.md` discipline.
- File a session log entry in the *design* trace's Part 10 (appendable)
  at the end of each tranche, describing what shipped and what remains.

---

## Reference summary — where the design lives

| Artifact | Location | Contains |
|---|---|---|
| Design spec | `wiki/reasoning/2026-09-02-closed-loop-workflow-and-context-realignment.md` | Full spec, 10 sections, 7 tranches |
| Conversation record | `wiki/reasoning/2026-09-03-closed-loop-conversation-record.md` (this file) | Q&A path, resume-from-cold |
| Reviewer findings | `.context/attachments/hRQxxl/pasted_text_2026-09-02_23-15-27.txt` | 8 concrete cases |
| Companion (post-release routine) | `wiki/reasoning/2026-09-02-wiki-maintenance-skill.md` | Deferred pointer |
| Topic hub | `wiki/topics/agent-working-conventions.md` | Two citations |
| Memory | `project_wiki_maintenance_skill_and_deferred.md` (Claude memory) | HIGHEST-PRIORITY marker |
| Current traps ledger | `wiki/index/traps.md`, `wiki/mistakes/` | To be converted in Tranche 1 |
