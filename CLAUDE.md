Before acting, read `rig/tier-1/routing.md` and route this task through its skill table.

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
grep cannot see.

Keep the wiki in sync with the branch. Any change that moves what is true — a
decision, a spec, a status, a rejected approach — updates the wiki in the same
change, following `wiki/reasoning/README.md`: file new thinking verbatim under
`reasoning/`, then update the topic hubs it touches and the decision index. A
wiki that has drifted from the branch is a defect, not stale documentation.
Reference it, update it, maintain it; it is part of the deliverable.

## Talking to the user

The language policy governs chat, not the wiki. When you bring a decision to the
user, give just enough real, concrete information to decide: the options and
their consequences, in plain language, without jargon or complex delivery. The
user should come away aware of the choices and what each one costs. Include a
recommendation, and keep one decision per question unless the user asks for a
broader menu. Maintaining the wiki is the agent's own record-keeping; the user's
chat is for decisions, kept plain.

## Architecture

- `rig/tier-1/routing.md` is the single task router.
- `rig/tier-1/skills/` contains Rig's curated phase owners and grafts.
- `rig/tier-1/rules/rig.md` activates the implementation rule.
- `skills/rig/SKILL.md` is the unchanged Rig source component.
- `.claude/skills/` and `.agents/skills/` are install targets for native Claude
  and Codex discovery; their payloads must stay identical.
- `rig/bootstrap.sh` is a fixed copy list by default. Optional `--hosts` /
  `RIG_HOSTS` delegates to `rig/lib/payload.js` and requires `node` on `PATH`.
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

```sh
npm test        # full CI gate — must pass before push
npm run test:rig  # fast bootstrap-only subset
```

The rest of the repository is the existing Rig component and its adapters.
When changing those internal files, keep their established tests and generated
copies green; do not route new Tier 1 behavior through the old plugin runtime.
