Before acting, read `rig/corpus/routing.md` and route this task through its skill table.

# Rig Agent Instructions

## North star — locked by the owner; never re-ask, never contradict

These are settled. Re-raising any of them has repeatedly cost the owner time.
Before any scope, design, test, or support question, check it against this list.

1. **Rig is one central corpus.** Skills, pipeline, catalogue services,
   standards, and grafting instructions live once, in the Rig corpus. The
   user's own coding agent unpacks it onto their repository with clear
   onboarding instructions — a mechanical projector for known hosts, the agent
   itself for unknown ones. Never frame scope, tests, docs, or support per host
   or by counting hosts. Design: `wiki/reasoning/2026-09-08-dynamic-offboarding-architecture-brainstorm.md`.
2. **Onboarding is agent-driven and adaptive.** The host agent grafts the
   smallest useful set onto what the repository already has; Rig code does not
   infer. `wiki/reasoning/2026-08-31-path-b-product-direction.md`.
3. **Markdown-only Tier 1 is retired.** Rig may ship scripts, markdown, and MCP;
   a sync engine is wanted. Do not reject an approach on markdown-only grounds.
   `wiki/reasoning/2026-09-04-structural-workflow-fix-grilling.md` (B2).
4. **The human-signed oracle is the gate.** Agents never edit frozen tests; the
   owner re-signs, batched into one session. (B3)
5. **Close bar:** code is cheap. Fix it; "replaced" needs a strong written
   reason; difficulty or priority is never a reason.
   `wiki/reasoning/2026-10-13-close-everything-owner-answers-round1.md`.
6. **Third-party skills are fetched during onboarding for this release.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-fetch.md`.
7. **The canonical corpus uses one new root, `rig/corpus/`.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-corpus-root.md`.
8. **Remove tier wording now; keep the existing flag compatible for one release.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-tier.md`.
9. **Service checks use available tools; missing tools are named gaps with setup guidance.**
   `wiki/reasoning/2026-10-13-close-everything-review-owner-tools.md`.
10. **Proven duplicate services may merge with written reasons and selection compatibility.**
    The count may fall below 115; required capabilities remain covered.
    `wiki/reasoning/2026-10-13-close-everything-review-owner-merges.md`.
11. **QA-to-production promotion uses automated checks only on the exact QA commit.**
    Include automated health and real-download clean-install checks; no outside-repository manual install gate.
    `wiki/reasoning/2026-10-13-close-everything-review-owner-promotion.md`.

When the owner states a product decision, add it here in the same change.

This repository is **Rig**, a curated, host-agnostic toolbox for coding agents.
Follow `rig/corpus/standards/ai-sdlc.md` for the development lifecycle and use
the Rig skills it routes to for each phase.

## Delivery SOP

Follow `rig/corpus/standards/delivery-sop.md` for multi-step changes. The live
closeout artifacts are in `wiki/specs/close-everything/` (`task-list.md`,
`agent-prompt.md`).

## Project Context

- Rig ships from one central corpus that the user's agent unpacks (North
  star 1). No keys and no `.env` handling are ever installed.
- Active delivery beyond the bootstrap is **mandatory agent-tech-safety
  baseline + à-la-carte catalogue** (`family → group → service → grade`).
  Fixed Basic / mid / Advanced install packages are deprecated (GA-9g).
- Project knowledge starts at `wiki/agent-primer.md`; that page routes you to
  `wiki/Home.md`, `wiki/status.md`, and the hubs and indexes the task's
  decision needs. Current authorities live under `wiki/gate1/` and
  `wiki/gate2/`. The operator guide remains at `docs/advanced/operator.md`.
- The legacy MCP-configurator CLI remains as a compatibility path; its
  historical design is archived under `wiki/archive/deprecated-tier-taxonomy/`.

## Working Rules

- Route through `rig/corpus/routing.md` first; do not substitute a nearby skill
  for the named owner.
- Preserve Gate 1 acceptance artifacts unless the task is explicitly routed back
  to grilling.
- For design work, update the relevant decision log and companion spec together.
- Treat `wiki/agent-primer.md` as the first source of truth. Read it — and
  follow only the links it lists as far as the task requires — before grepping
  the code, asking questions, making suggestions, or sketching a solution,
  and keep the wiki in sync with the branch: any change that moves what is
  true updates the wiki in the same change. A wiki that has drifted from the
  branch is a defect. Reference it, maintain it, update it.
- File every reasoning trace supplied by the intent owner under
  `wiki/reasoning/` verbatim, then update its topic hubs and decision index in
  the same change; follow `wiki/reasoning/README.md`.
- When you bring a decision to the user, give just enough real, concrete
  information to decide — the options and their consequences — in plain
  language, without jargon or complex delivery. Include a recommendation, and
  keep one decision per question unless the user asks for a broader menu.

## Rig Implementation Rule

Lazy means efficient, not careless. Before writing code, stop at the first rung
that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse the helper, util, or pattern.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it.
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

The ladder runs after you understand the problem, not instead of it: read the
task and the code it touches, trace the real flow end to end, then climb.

Bug fix = root cause, not symptom. Grep every caller of the function you touch
and fix the shared function once.

Rules:

- No abstractions that were not explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, but only once you understand the problem.
- Pick the edge-case-correct option when two standard-library approaches are the
  same size; lazy means less code, not the flimsier algorithm.
- Mark intentional simplifications with a `rig:` comment. If the shortcut
  has a known ceiling, name the ceiling and the upgrade path.

Not lazy about: understanding the problem, trust-boundary validation, error
handling that prevents data loss, security, accessibility, real-hardware
calibration, and anything explicitly requested. Lazy code without its check is unfinished:
non-trivial logic leaves ONE runnable check behind; trivial one-liners need no
test.

Adapter invariant: this file must still carry Rig's lazy senior rule,
input validation at trust boundaries, and the warning to label any naive heuristic with its ceiling and upgrade path.

(Yes, this file also applies when you develop the Rig repo itself: run `npm test`
locally and confirm it is green before pushing. That is the full CI gate — the
rule-copy check, the version check, the Node suite, and the pi-extension tests,
the same commands `.github/workflows/test.yml` runs. Do not push on a red or
unrun suite.)
