Before acting, read `rig/tier-1/routing.md` and route this task through its
skill table — its "Task weight" section sets a lighter path for single-step
tasks; everything else uses the full cadence below.

# Rig Development

Rig installs a curated markdown-only agent workflow into other repositories.
Tier 1 supports the repository's static agent-host entrypoints through
`rig/bootstrap.sh`.

## Working from the wiki

`wiki/Home.md` is this project's first source of truth. Every agent starts a
task there: `status.md` for what is true now, the topic hubs for why each part
is shaped the way it is, the indexes for decisions, acceptance cases, rejected
approaches, and traps. Read the wiki before grepping the code. The answers to
"what is this, why is it this way, what was already tried and rejected" are
written down; searching for them again burns tokens and loses the reasoning the
grep cannot see. Do this before asking the user for context, making
suggestions, or sketching a solution.

Keep the wiki in sync with the branch. Any change that moves what is true — a
decision, a spec, a status, a rejected approach — updates the wiki in the same
change, following `wiki/reasoning/README.md`: file new thinking verbatim under
`reasoning/`, then update the topic hubs it touches and the decision index. A
wiki that has drifted from the branch is a defect, not stale documentation.
Reference it, update it, maintain it; it is part of the deliverable.

On a task that runs long or has several steps, do not hold everything for a
finish-line summary — that loses the work if the session is cut off partway
through. Check the time and file a dated reasoning trace with what was just
done, what is in flight, and what is next at least every three minutes of
active work; run `node scripts/build-wiki-index.js` rather than hand-editing
the generated `wiki/status.md`. Record a new understanding
or an approach that just failed the moment it happens — as its own reasoning
trace, or in `index/rejected.md` / `index/traps.md` if that is what it is —
rather than batching it for later. A session picking up cold should be able to
resume from what is written, not from re-deriving it or reading the lost
conversation. A single-step task on the lightweight path (`rig/tier-1/routing.md`
§Task weight) skips this cadence; it applies once the task is multi-step or
changes what's true in the wiki.

## Talking to the user

Every message to the user follows `rig/tier-1/rules/communication.md` (installed
as `.rig/rules/communication.md`). Treat the user as your product manager: send
the least information needed to decide, with the overall picture intact. Ground
the problem, the real options with their business costs, one recommendation, and
one decision per question in the wiki's current truth and product spirit. Wiki
paths, section numbers, and decision IDs stay out of the first-pass reply; they
belong in the wiki and the diff, and are reproduced on request.

## Architecture

- `rig/tier-1/routing.md` is the single task router.
- `rig/tier-1/skills/` contains Rig's curated phase owners and grafts.
- `rig/tier-1/rules/rig.md` activates the implementation rule.
- `skills/rig/SKILL.md` is the unchanged Rig source component.
- `.claude/skills/` and `.agents/skills/` are install targets for native Claude
  and Codex discovery; their payloads must stay identical.
- `rig/bootstrap.sh` installs from `rig/manifest.json` through
  `rig/lib/payload.js`; optional `--hosts` / `RIG_HOSTS` selects a host subset.
  Vendored-skill code and the `.rig/plumbing` tree install only under
  `--with-runtime`; a default install lands every `SKILL.md` but no code.
- `plugin.yaml` and root `__init__.py` are the first-class Hermes plugin. The
  Hermes tests and the `.venv`/pandas-backed benchmark import in `npm test` are
  part of the supported surface.
- `tests/rig-bootstrap.test.js` proves the fresh-repo multi-host install.
- `wiki/Home.md` is the project knowledge entrypoint. File future intent-owner
  reasoning verbatim under `wiki/reasoning/`, then update its topic hubs and
  decision index as `wiki/reasoning/README.md` requires.

Tier 1 must remain markdown-only in installed repositories: no installed
runtime, secrets, sync engine, or generated `.env` files. The host-filtered
installer path may use the repo-local payload manifest at install time, but it
must still emit only markdown/instruction files into the target repository.

## Checks

`npm test` is the full CI gate: it runs `scripts/check-rule-copies.js`,
`scripts/check-versions.js`, the Node test suite, and the pi-extension tests —
the same commands `.github/workflows/test.yml` runs. Run it locally and confirm
it is green before pushing; do not push on a red or unrun suite. `npm run
test:rig` is a fast subset (the bootstrap test only) and is not a substitute.
Inner-loop red/green uses `npm run test:rig` or the single relevant test file,
never the full gate — see `rig-tdd`; run the full gate once, right before push.

```sh
npm test        # full CI gate — must pass before push
npm run test:rig  # fast bootstrap-only subset
```

The rest of the repository is the existing Rig component and its adapters.
When changing those internal files, keep their established tests and generated
copies green; do not route new Tier 1 behavior through the old plugin runtime.
