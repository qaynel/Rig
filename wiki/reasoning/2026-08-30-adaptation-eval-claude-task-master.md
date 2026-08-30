---
date: 2026-08-30
source: review
topics: what-rig-is, onboarding-flow, the-catalogue
decisions: GA-36
status: current
supersedes:
tags: interdependency, trap
summary: First real adaptation run — RIG installed onto inspo/claude-task-master-main scored +12/100; merge-not-overwrite works, adaptive integration is not built.
---

# RIG install evaluation — claude-task-master-main (+12/100)

*Filed verbatim. This is the first time RIG's install/adaptation pass was run on
a real, dense, multi-host repository (`inspo/claude-task-master-main/`) and
scored. It answers the question `what-rig-is` §"still open" and GA-36 left
dangling — "is the adaptation actually good" — with evidence rather than hope.
The eval below is the report-only reviewer's output, unedited. Two items in §3
(the 5.8 MB unignored source dump and the phantom `wiki/status.md` instruction)
are live traps to fix before any beta tester touches the installer.*

---

RIG Install Evaluation — claude-task-master-main

1. Baseline (pre-RIG state)

The repo has a single commit (986de06), so the pre-RIG state = current tree minus untracked RIG additions minus the one-line CLAUDE.md edit. git status shows exactly one modified tracked file: M CLAUDE.md. RIG's own preimage (.rig/preimages/d42fcecb…) is a byte copy of the original CLAUDE.md.

Pre-existing agent-facing config was extensive:

- Claude: CLAUDE.md (180 lines), .taskmaster/CLAUDE.md (imported via @./), .claude/commands/ (dedupe, go/ham, go/pr-comments), .claude/hamster.md, .claude/TM_COMMANDS_GUIDE.md, .claude-plugin/marketplace.json
- Cursor: 27 .cursor/rules/*.mdc (architecture, tests, dev_workflow, ai_services, taskmaster, telemetry, changeset, git_workflow, …), .cursor/commands/goham.md, .cursor/mcp.json
- Kiro: 5 .kiro/steering/*.md (dev_workflow, taskmaster, self_improve, kiro_rules, taskmaster_hooks_workflow), 7 .kiro/hooks/*.kiro.hook, .kiro/settings/mcp.json
- GitHub: 5 .github/workflows/claude*.yml
- Plugin: packages/claude-code-plugin/ — 3 agents + ~45 commands
- Templates: assets/AGENTS.md, assets/GEMINI.md (not root-active)

CLAUDE.md already carried repo-specific doctrine: business-logic-must-live-in-@tm/core, test placement/mocking rules, DRY/YAGNI section, changeset workflow.

2. What RIG did — diff

Purely additive. One tracked-file change, zero deletions, zero overwrites.

a) CLAUDE.md — MERGED. Manifest seq 19: operation: append_managed, preimage_digest: d42fcecb… preserved. Diff is one appended line:
CLAUDE.md:181  +Before acting, read `.rig/routing.md` and route this task through its skill table.
Original 180 lines untouched, voice intact. This is a real append-merge with a recovery preimage.

b) .cursor/rules/rig.mdc — PARALLEL STACK. New file, alwaysApply: true, body = the same one-liner pointing at .rig/routing.md. Dropped alongside 27 existing cursor rules; none of them reference it and it references none of them.

c) .kiro/steering/rig.md — PARALLEL STACK. New file, inclusion: always, same one-liner. Same non-reconciliation with the 5 existing steering docs.

d) .rig/ — NEW OWNED TREE (12 MB). routing.md, rules/rig.md, rules/communication.md, 65 skills, runtime/, preimages/, and a ~1 MB install-manifest.jsonl.

e) .claude/skills/ — PARALLEL STACK + BLOAT (5.8 MB). 64 skill dirs that mirror .rig/skills/ byte-for-byte, including full TypeScript source (rig-browse/src/*.ts, build scripts). No .gitignore entry, so all of it would land in the next commit.

Classification of every pre-existing agent file:
- CLAUDE.md → Merged (1-line append, preimage kept)
- All 27 .cursor/rules/*.mdc, all 5 .kiro/steering/*.md, .kiro/hooks/*, .taskmaster/CLAUDE.md, .claude/commands/*, .claude-plugin/*, packages/claude-code-plugin/*, .github/workflows/claude*.yml → Ignored (untouched; routing.md names none of them)
- Net-new rig.mdc / rig.md / .claude/skills/ → Parallel stack

Nothing was Overwritten/clobbered.

3. Improvement scored

Config preserved: ~100%. Every byte of original guidance survives. The only edit is a non-destructive append with a stored preimage. On this axis RIG is near-perfect.

Net capability added: small but real. The genuinely new primitive is RIG's Tier-1 pipeline in .rig/routing.md: grilling → product-design → gate (one freeze, human signature over the oracle digest) → implementation → execution → code-review, whose stated invariant is "an agent cannot move its own goalpost." Nothing in the baseline enforces a frozen acceptance/test oracle. That's the only capability here an agent couldn't already get from the existing config. The other ~6 Tier-1 skills (tdd, debugging, code-review) duplicate capability already present three times over (superpowers TDD/debugging, pr-review-toolkit, the code-review plugin, mattpocock-skills).

Signal vs noise: poor. 65 skills installed; ~7 are relevant to a Node/TS CLI+MCP monorepo. The rest — ios-qa, ios-fix, design-shotgun, canary, make-pdf, office-hours, scrape, benchmark, connect-chrome … — are dead weight here. Nothing in the install is tailored to this repo: no mention of @tm/core layering, turbo:typecheck, changesets, or the tiered MCP tools. Estimated noise ratio ~85% by skill count, higher by bytes (5.8 MB of duplicated .ts source in .claude/skills/).

Breakage / conflict:
1. .rig/routing.md instructs: "file a dated reasoning trace then regenerate wiki/status.md at least every three minutes of active work, per CLAUDE.md." There is no wiki/ directory and CLAUDE.md says nothing about a wiki, status.md, reasoning traces, or a 3-minute cadence. Dangling cross-reference to a non-existent convention — this will actively confuse an agent.
2. routing.md repeatedly points at rig/tier-1/rules/… and skills/rig/SKILL.md "in this source checkout" — those paths don't exist here (this is not the RIG source repo). Conditionally worded, so minor.
3. Three always-on entrypoints (CLAUDE.md line, rig.mdc, kiro rig.md) now funnel every task through routing.md — consistent but redundant, and each adds a mandatory read before "even clarifying questions."
4. RIG's rules/rig.md (YAGNI/laziness) overlaps CLAUDE.md's existing "Code Quality & Reusability" DRY/YAGNI section — duplicative, not contradictory.
5. Review/TDD skill pileup: rig-code-review + rig-review + code-review plugin + pr-review-toolkit + superpowers = 4–5 competing review workflows with no precedence stated.

4. Verdict

Net improvement score: +12 / 100.

The install is non-destructive and fully reversible: it preserved 100% of the repo's original agent guidance, merged into CLAUDE.md with a real append + preimage rather than clobbering, and added one legitimately novel primitive — the signed freeze-the-oracle gate. That keeps it in positive territory. But it earns only a low positive because "adaptation" stopped at the primary file: RIG ignored 27 Cursor rules, 5 Kiro steering docs, the Claude plugin, and .taskmaster/CLAUDE.md, wired nothing into those existing rulesets, dumped a 12 MB .rig/ tree plus a redundant 5.8 MB .claude/skills/ copy (uncommitted-but-unignored source code), shipped ~58 skills irrelevant to this stack, and left an internal instruction pointing at a wiki/status.md convention that does not exist in this repo. The value delivered (one workflow gate) is small relative to the reading cost and clutter added.

What this run proves about the adaptation engine: the merge-not-overwrite core is real and working for the main entrypoint — append_managed with a stored preimage is exactly right, and no existing content was degraded. But adaptive integration is not built. RIG treated a repo with one of the richest multi-tool agent configs you'll find as if it were empty: it stacked generic files in parallel across three ecosystems instead of reconciling with what was there, and personalized none of its content to the codebase. Merge works; adapt does not yet.

Single highest-value change to RIG: during install, actually parse the pre-existing agent config and (a) reference the existing Cursor/Kiro rules from routing.md instead of ignoring them, (b) prune the installed skill set to what the repo's stack implies and drop the duplicate .claude/skills/ source tree, and (c) stop emitting instructions (wiki/status.md, "per CLAUDE.md" cadence) for conventions the target repo doesn't have.

---

## What this trace settles (not part of the eval — synthesis pointer)

- GA-36 closed the audience-fork question with "adaptation quality is the moat
  and is still unproven." This run is the first proof, and it is split: the
  **merge** primitive is real and working; **adaptive integration** (reconcile
  onto existing multi-host config, prune to stack, personalize content) is not
  built. See [[what-rig-is]] and [[onboarding-flow]].
- The install's own eval instrument (rubric, weights, per-dimension scale) is
  not yet captured here — a follow-up packet was requested from the eval agent
  to bring the measuring instrument, not just this score, into the wiki.
- The two live traps to fix regardless of direction: the 5.8 MB unignored
  vendored-source dump in `.claude/skills/`, and the phantom "regenerate
  `wiki/status.md` every three minutes per CLAUDE.md" instruction emitted into a
  repo with no wiki. Both burn first-run goodwill.
