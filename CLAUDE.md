Before acting, read `rig/corpus/routing.md` and route this task through its
skill table — its "Task weight" section sets a lighter path for single-step
tasks; everything else uses the full cadence below.

# Rig Development

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
12. **Report supported host hooks Rig does not install as available but not integrated.**
    Reserve `emitted` for a real host-consumed artifact with byte-landing proof;
    reserve `unsupported` for a vendor surface that does not exist. The gap is
    explicit in the release contract rather than a speculative hook claim.
    `wiki/reasoning/2026-10-18-host-hook-honest-gap-owner-decision.md`.
13. **One trust root: the Gate 1 key is the only signing key Rig uses.**
    It is the only key that signs, approves, or recovers anything. Plan
    approvals, policy, and receipts verify against it alone. Rig has no
    separate policy-signer setup, recovery registration, trust-on-first-use
    fallback, `trust.json`, or independent `.rig/allowed-signers` list.
    `wiki/reasoning/2026-10-20-one-trust-root-owner-decision.md`.

When the owner states a product decision, add it here in the same change.

Rig installs a curated agent workflow into other repositories from one central corpus.
Rig supports the repository's static agent-host entrypoints through
`rig/bootstrap.sh`.
Follow `rig/corpus/standards/ai-sdlc.md` for the development lifecycle.

## Working from the wiki

`wiki/agent-primer.md` is this project's first source of truth for an agent.
Read it before touching the code. It is one short page: it points at
`Home.md` for the map, `status.md` for what is true now, and the specific
topic hubs and indexes a routing decision needs, and it names the rule that
the wiki (not grep) holds the reasoning behind every part of this project.
Follow the links it holds only as far as the task requires. Do this before
asking the user for context, making suggestions, or sketching a solution.

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
conversation. A single-step task on the lightweight path (`rig/corpus/routing.md`
§Task weight) skips this cadence; it applies once the task is multi-step or
changes what's true in the wiki.

## Delivery SOP

Releases follow `rig/corpus/standards/change-management.md` — one ordered
sequence from candidate freeze to tracker closure, enforced by
`node scripts/check-deployment-gate.js --receipt <path>`. Do not reorder it and
do not carry evidence across a code change.

Follow `rig/corpus/standards/delivery-sop.md` for multi-step changes. The live
closeout artifacts are in `wiki/specs/close-everything/` (`task-list.md`,
`agent-prompt.md`).

## Talking to the user

Every message to the user follows `rig/corpus/rules/communication.md` (installed
as `.rig/rules/communication.md`). Treat the user as your product manager: send
the least information needed to decide, with the overall picture intact. Ground
the problem, the real options with their business costs, one recommendation, and
one decision per question in the wiki's current truth and product spirit. Wiki
paths, section numbers, and decision IDs stay out of the first-pass reply; they
belong in the wiki and the diff, and are reproduced on request.

## Architecture

- `rig/corpus/routing.md` is the single task router.
- `rig/corpus/skills/` contains Rig's curated phase owners and grafts.
- `rig/corpus/rules/rig.md` activates the implementation rule.
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

Installed repositories never receive secrets or generated `.env` files.
Scripts, markdown, and MCP may ship (North star 3).

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
copies green; do not route new Rig behavior through the old plugin runtime.
