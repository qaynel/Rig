Before acting, read `rig/tier-1/routing.md` and route this task through its skill table.

# Rig Agent Instructions

This repository is **Rig**, a curated, host-agnostic toolbox for coding agents.
It uses a two-gate workflow:

1. `rig-grilling` freezes intent and acceptance tests.
2. `rig-product-design` freezes the technical approach.
3. `rig-implementation` implements the smallest correct diff.
4. `rig-execution`, `rig-tdd`, `rig-debugging`, and `rig-code-review` handle
   coordinated execution, test-driven slices, root-cause work, and review.

`rig-implementation` is still always active for implementation, but it is one
skill inside Rig's broader workflow. Do not treat every task as only a
`rig-implementation` task.

## Project Context

- Tier 1 is the markdown-only bootstrap: fixed file list, no catalogue
  resolver, no runtime, no keys, no `.env` handling.
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

- Route through `rig/tier-1/routing.md` first; do not substitute a nearby skill
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
- On a task that runs long or has several steps, do not hold everything for a
  finish-line summary. Check the time and file a dated reasoning trace with what
  was just done, what is in flight, and what is next at least every three
  minutes of active work; run `node scripts/build-wiki-index.js` rather than
  hand-editing the generated `wiki/status.md`, so a session cut off mid-task can
  resume from the file instead of the lost conversation.
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
