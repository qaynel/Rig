---
date: 2026-09-02
source: agent
topics: host-and-ci-coverage
decisions:
status: historical
supersedes:
tags: trap, rejected
summary: .claude/skills and .agents/skills drift closed with a relative-path parity check in check-rule-copies.js plus the two missing trees copied over; the larger single-source .rig expander that would make the check unnecessary is recorded as a deferred future feature, not adopted.
---

# Skill-tree parity check, and the deferred single-`.rig` expander

## Context

The path-b QA/prod deploy review
([2026-09-02-path-b-qa-prod-deploy-review.md](2026-09-02-path-b-qa-prod-deploy-review.md),
"Medium — `wiki-maintenance` lands in only one of the two skill trees") found
that `.claude/skills/` (native Claude discovery) and `.agents/skills/` (Codex
discovery) had drifted:

- `.claude/skills/wiki-maintenance/SKILL.md` — added on this branch, no
  `.agents/skills/` counterpart.
- `.claude/skills/rig-enforcement/SKILL.md` — same asymmetry, inherited from
  `qa-prod`, not this branch's doing.

`CLAUDE.md` states the two trees "are install targets for native Claude and
Codex discovery; their payloads must stay identical." That was an asserted
invariant with nothing enforcing it. `scripts/check-rule-copies.js` compared
the per-host **rule** copies against `AGENTS.md` but never compared the two
**skill** directories, and the fresh-repo bootstrap test only exercises
installed temp targets. Nothing in `npm test` would have caught the drift.

Every `.claude/skills/rig-*/SKILL.md` is byte-identical to its
`rig/tier-1/skills/*/SKILL.md` source; `wiki-maintenance` and `rig-enforcement`
have no tier-1 source at all, which is why they fell outside the existing
pattern and outside every check.

## What was done (cheap fix, landed now)

1. **Made the trees match.** Copied `wiki-maintenance/` and `rig-enforcement/`
   from `.claude/skills/` into `.agents/skills/` (each is a single `SKILL.md`;
   a straight copy). Neither enters `rig/manifest.json` — both are
   authoring-time-only skills and Tier 1 must stay markdown-only in installed
   repos, so the manifest exclusion is correct and unchanged. The asymmetry
   was the defect, not the exclusion.

2. **Added the check that fails on divergence.** `scripts/check-rule-copies.js`
   now walks both skill trees and compares their set of relative file paths.
   Any path present under one root and not the other fails the build, naming
   the file. This runs inside `npm test` via the existing `test:code` chain.
   Verified both directions: removing a file from either tree turns the check
   red; restoring it turns it green.

   Scope of the check is **relative file path parity**, deliberately not
   byte-for-byte content parity. Path parity catches the realistic failure
   modes — a whole skill missing from one root, or a file added to one skill's
   tree but not its twin. Whether the two roots may ever legitimately differ in
   content is a question that belongs with the deferred expander below, not
   with this fix, so byte comparison was left out rather than hard-coded as
   "identical forever."

## The deferred future feature — single-source `.rig` expander

During the discussion that led to this fix, a larger design was proposed:
instead of committing N native host trees (`.claude/skills/`, `.agents/skills/`,
and the equivalents for the other hosts) and keeping them in sync by hand or by
check, ship **one** source-of-truth directory — a single `.rig/` holding every
capability for all 19 hosts (logical framework + instructions + MCP config) —
plus deployment documents. The user's own agent host, at onboarding, reads
those deployment documents and materialises `.claude/`, `.agents/`, and the
rest from the single corpus.

Trade-off analysis as discussed:

- **Single source of truth is the right direction.** The drift this fix closes
  only exists because the payload is authored N times. One corpus + a
  materialiser removes the drift class entirely rather than policing it.
- **LLM-from-prose expansion at onboarding loses what makes the payload
  checkable.** If the host agent "follows deployment documents" to generate the
  trees, the output is non-deterministic and cannot be verified against a
  recorded digest. Rig's whole freshness/proposal-binding model
  (`skills_digest`, `tree_digest`) depends on the emitted bytes being a pure
  function of the source bytes. Prose-driven generation breaks that.
- **A deterministic expander is the keep-both path.** A plain, non-LLM
  materialiser (copy + rename + frontmatter-strip per host contract, the same
  mechanical transforms `check-rule-copies.js` already knows about) gives one
  source *and* reproducible output *and* a CI check that regenerates and
  diffs. This is the shape worth building.
- **The real fork is committed-vs-regenerated.** Either the native trees stay
  committed and a check regenerates-and-diffs them (smallest change, trees
  remain greppable in the repo), or they stop being committed and are
  regenerated on demand at install and in CI (removes the committed
  duplication but makes the repo's own working tree depend on running the
  expander). That choice is left open for whoever picks this up.

Status: **deferred, not rejected.** The cheap parity check is sufficient for
now and does not block the expander later — when the expander lands, the
path-parity check is replaced by the regenerate-and-diff check. Recorded in
[`../index/rejected.md`](../index/rejected.md) § Architecture and packaging as a
deferred item.
