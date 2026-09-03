---
date: 2026-08-30
source: intent owner
topics: gate1-signing, agent-working-conventions, testing-strategy
decisions:
status: historical
supersedes:
tags: interdependency
---

# Implementation handoff: development-process changes from the 2026-08-30 office-hours session

*Self-contained. Hand to an implementing agent. Everything discussed in the
session, scoped to concrete file-level work with real anchors. No code is
written here — this is the work order.*

## Framing (read first)

The root problem diagnosed: the project was stuck in a fix-break loop because the
spec + acceptance tests (the "oracle") were never frozen for the duration of a
task, so the target kept moving. Second problem: the wiki became a second
codebase (`status.md` rewritten in ~93% of commits). Third: additive-only,
reuse-blind code generation ("hyper slop").

Key discovery during scoping: **much of the mechanism already exists.** The
signed test-freeze is fully built. The implementation ladder is fully built.
So most of this work is doctrine, wiring, and one generator script — not new
subsystems. Do not rebuild what is listed as "already exists."

## Hard constraints (apply to every work package)

1. **Tier 1 stays markdown-only in installed repos.** Any generator script runs
   at *authoring time in this source repo only*; its output must be plain
   markdown. Never install a runtime, DB, or service into a target repo.
2. **Payload copies must stay byte-identical.** The implementation skill exists
   at `.claude/skills/rig-implementation/SKILL.md` and
   `.agents/skills/rig-implementation/SKILL.md` (and source
   `skills/rig/SKILL.md`). `scripts/check-rule-copies.js` enforces parity in
   `npm test`. Edit all copies together.
3. **`npm test` is the gate.** Any new script needs a test and CI parity
   (`.github/workflows/test.yml`). `npm run test:rig` is only the fast subset.
4. **Update the wiki in the same change.** Follow `wiki/reasoning/README.md`:
   file a dated immutable trace under `wiki/reasoning/`, then update the topic
   hubs and `wiki/index/decisions.md`. A drifted wiki is a defect.

## Suggested sequence

WP3 first (smallest, standalone) → WP2 (standalone doctrine) → WP1 (largest,
blocked on external research). WP4 is a no-op guard.

---

## WP1 — Wiki: append-only traces + generated summary

**Goal:** kill the `status.md` churn. A worker reads a compact, always-current
summary and proceeds, without spending tokens to maintain it and without it
going stale.

**Already exists:**
- `wiki/reasoning/` is already append-only and immutable by rule
  (`wiki/reasoning/README.md`). Trace frontmatter already carries
  `date / source / topics / decisions`.
- `wiki/index/*.md` (decisions, timeline, traps, rejected, acceptance-cases,
  invariants, path-map, sources) exist as the synthesis layer.
- Precedent for an authoring-time generator: `scripts/build-review-doctrine.js`.
- Precedent for a CI sync-check: `scripts/check-rule-copies.js`,
  `scripts/check-versions.js`.

**Missing / the work:**
1. **Resolve build-vs-adopt first.** This WP is BLOCKED on the research in
   `.context/wiki-summary-problem-statement.md` (handed to a web agent). If an
   existing tool (e.g. log4brains / an ADR index generator / Dataview-style
   generation) fits the markdown-only + append-only + generated-summary shape,
   adopt it. Otherwise build the script below. Do not start WP1 until this is
   answered.
2. **Extend trace frontmatter** for mechanical generation: add `status`
   (e.g. current/superseded), `supersedes` (trace or decision id), and `tags`
   (rejected/trap/interdependency). Backfill is optional; new traces adopt it.
3. **Write `scripts/build-wiki-index.js`** (deterministic, no LLM, zero tokens):
   read every `wiki/reasoning/*.md` frontmatter, emit the `wiki/index/*` files
   and a compact top-level summary. Supersession: a superseded trace stays
   reachable but the summary shows the current decision.
4. **Shrink `status.md` (1,649 lines, the churn hotspot).** Split it: a tiny
   generated "current state" header + move the narrative into dated traces.
   This is the biggest token win and the main point of the WP.
5. **Wire a sync-check into `npm test`** so generated files can't drift from the
   traces (regenerate → diff → fail if dirty), same pattern as
   `check-rule-copies.js`.

**Done when:** editing a trace + running the generator is the only way the
summary/index changes; no agent hand-writes the summary; `npm test` fails if
generated output is stale.

---

## WP2 — Test-freeze: unfreeze-request gate + human-fillable evidence template

**Goal:** an agent (or a human with no tokens) can only change a frozen test via
a signed unfreeze that carries evidence. Rare, one-commit events.

**Already exists (do NOT rebuild):**
- The freeze itself: `wiki/gate1/testing-infrastructure.manifest` (SHA-256 of
  each oracle test file), `wiki/gate1/gate1.sig` (SSH signature),
  `wiki/gate1/gate1.allowed-signers`.
- The re-freeze ceremony: `scripts/approve-gate1.js` — edit the oracle files,
  re-run it, and it refuses to re-sign unless you pass
  `--confirm-digest-delta <sha256>` matching exactly what changed. `unlock` is
  intentionally unsupported (an armed gate cannot be silently disarmed).
- Signing key resolution already supports a local human path: it reads
  `RIG_GATE1_SIGNING_KEY` or `.context/gate1.env` /`.credentials/gate1.env`.
- Skills already forbid editing Gate 1: `rig/tier-1/skills/tdd/SKILL.md`
  ("Gate 1 acceptance artifacts remain frozen"),
  `rig/tier-1/skills/execution/SKILL.md` ("No worker may edit Gate 1").

**Missing / the work (doctrine + one template, minimal code):**
1. **Add the unfreeze-request template**, e.g.
   `wiki/gate1/unfreeze-request.template.md`, with fields:
   - which test (file / test name)
   - what changes and why (one paragraph)
   - evidence, one or more of: (a) the test asserted a non-issue — proof =
     triage log / the wrong assertion + why; (b) the encoded spec changed — new
     spec link/quote; (c) **human rationale (no agent available)** — plain
     written reason
   - signature (the key)
   The template must be fillable by a human as fast as by an agent — this is the
   out-of-tokens / outage path, and it is first-class, not a fallback.
2. **Add the sanctioned-exception doctrine to the skills** that currently only
   say "do not edit Gate 1": `tdd/SKILL.md` (Before Red), `execution/SKILL.md`
   (Boundaries), and check `grilling/SKILL.md` (it likely owns Gate 1 change).
   The doctrine: never edit a frozen test directly; open a filled
   unfreeze-request carrying evidence, then re-run `approve-gate1.js`. The
   evidence is necessary; the human signature is authoritative.
3. **Document the human path** next to `scripts/approve-gate1.js` /
   `.credentials/gate1.env.example`: a tokenless human edits the oracle, fills
   the template, runs the same `node scripts/approve-gate1.js`. Point them at it
   so they stay on-rails instead of editing the test and losing the guarantee.
4. **Optional, doctrine-not-CI:** a gate test that the template exists and that
   an oracle change without an accompanying filled request is flagged. Keep
   enforcement light per the user's "philosophy over CI check" preference.

**Done when:** the only sanctioned way a frozen test changes is a filled,
signed unfreeze-request; a human with no agent can complete it from the template
alone.

---

## WP3 — Implementation: delete-first solution ladder + definition-of-done check

**Goal:** attack bloat at *solution-selection time*, not at review time. The
posture binds when the agent starts understanding the problem, not when it types
code.

**Already exists:**
- `.claude/skills/rig-implementation/SKILL.md` + `.agents/skills/rig-implementation/SKILL.md`
  (+ `skills/rig/SKILL.md`) already have a 7-rung "laziest solution" ladder
  (YAGNI → reuse-in-codebase → stdlib → native → installed-dep → one-line →
  minimum code), a "Deletion over addition" rule, and a root-cause bug rule.
- `rig/tier-1/rules/rig.md` activates it as always-on.

**Missing / the work (edit the skill; keep all copies identical):**
1. **Foreground the ordered hierarchy** as the primary frame, each downward step
   requiring a stated reason the step above was insufficient:
   ```
   Delete → Reuse unchanged → Modify existing code locally
          → Generalise existing behaviour → Add new code
   ```
   Delete becomes rung 0 (not buried under YAGNI). The existing stdlib/native/
   installed-dep rungs fold in under "reuse/modify" rather than being the
   headline.
2. **Add the generalisation-trap constraint:** generalisation must justify its
   own existence — prefer direct reuse or a small local modification before
   extracting a new abstraction. Generalise only when two+ concrete callers
   actually exist and the shared semantics are real, not anticipated. This stops
   "duplicate code" from being replaced by "speculative frameworks."
3. **Add the leftover-path definition-of-done line** (also to the completion
   checks in `execution/SKILL.md` and `tdd/SKILL.md`):
   > The change uses the least new mechanism necessary, reuses existing semantic
   > authorities where possible, and removes superseded paths rather than
   > leaving parallel implementations behind.
   This kills the diverging-duplicates failure (A, then B, then C, each drifting)
   by making removal of the old path part of "done," not optional cleanup.
4. **Keep all skill copies identical** (`check-rule-copies.js` will fail
   otherwise).

**Explicitly NOT in scope:** a delete-ratio CI gate. The user rejected this. A
delete-ratio number, if ever added, is a *thermometer* (reporting-only, detects
drift) — never an enforcement gate. Do not build it as a blocker.

**Done when:** the implementation skill leads with Delete→…→Add, the
generalisation constraint and DoD line are present in all copies, and the copies
are in sync.

---

## WP4 — Timeline and ceremony: no-op guard

The user approved keeping the timeline (`wiki/index/timeline.md`) and the
release ceremony. **No work.** Do not remove or "simplify" these while doing WP1
(the status.md shrink must not delete the timeline). Listed only so a later
cleanup pass doesn't treat them as churn.

---

## What "done" looks like across all packages

- Frozen oracle governs each task; changing a frozen test requires a signed,
  evidence-bearing unfreeze that a human can author (WP2).
- The wiki summary is generated, never hand-written, and cannot go stale (WP1).
- Code generation leads with delete/reuse and removes superseded paths (WP3).
- Timeline + ceremony intact (WP4).
- `npm test` green, all payload copies in sync, wiki updated in the same change.
