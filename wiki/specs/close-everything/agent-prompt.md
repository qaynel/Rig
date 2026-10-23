# Executor prompt — hand this and `task-list.md` to the local agent

Paste everything below the line into the agent. Give it
`wiki/specs/close-everything/task-list.md` as the attached file.

---

You are finishing a software release for the repository in your current
directory (branch `vaibhav-kodiyan/universal-issues-closure`). Your job is to
work through a checkbox list until every task you are allowed to do is ticked
and the tests pass. Follow these rules exactly. Do not be creative about scope.

## Read first (in this order, nothing else until done)

1. `CLAUDE.md` (top to bottom, especially "North star" and "Delivery SOP").
2. `rig/corpus/standards/delivery-sop.md`.
3. `wiki/specs/close-everything/task-list.md` — your work list.
4. `wiki/specs/close-everything/statement-of-work.md` and
   `specification-sheet.md` — what "done" means.
5. Open the subplan file named in the task's work package (`02-…` to `10-…` in
   the same folder) only when you start that package.

## What you do

Do the tasks marked `[ ]` that have no 🔒, in list order, top to bottom. For
each task:

1. Read its **Accept** and **Prove** lines.
2. Run the Prove command first. Watch it fail (or, if it already passes, say so
   and tick it only if Accept is truly met).
3. Make the smallest change that makes Accept true. Reuse existing code. Do not
   refactor unrelated things. Do not add dependencies.
4. Run the Prove command again. It must pass. Also run any other test file that
   covers the files you touched.
5. Only then change `[ ]` to `[x]` in `task-list.md`, and update the count line
   at the bottom.
6. Write a short trace (see below) with the Prove command and its result line.
7. Commit just that task's files with a message like
   `fix(<area>): <what> (T-4.5)`. One task = one commit.

## Hard rules (breaking any of these is a failure)

- **Never tick a box you did not just prove.** Do not tick from memory or from
  reading code. The Prove command must have run and passed in this session.
- **Do not edit these files, ever:** anything listed in
  `wiki/gate1/testing-infrastructure.manifest` (for example
  `tests/advanced-oracle.test.js`, `tests/path-b-*.test.js`,
  `tests/onboarding-hardening.test.js`, `tests/helpers/path-b.js`,
  `tests/helpers/advanced.js`, `scripts/check-advanced-spec.js`,
  `wiki/gate1/package-scripts.json`), and anything under `wiki/gate1/`. If one
  of those tests must change, write the proposed change as a new file under
  `wiki/specs/close-everything/candidate-amendments/<topic>/` and tick only the
  "candidate filed" task.
- **Do not edit `rig/catalog.json` or anything under `rig/catalog/`.** New
  catalogue work lives in `rig/corpus/` and `tests/fixtures/services/`.
- **Never sign, never run `scripts/approve-gate1.js`.**
- **Never** `git push`, open or edit a PR, create/close/label GitHub issues,
  create tags, or run `gh` commands that write. Those are the 🔒 tasks and
  belong to the owner.
- Do not change `package.json` scripts, and do not weaken, skip or delete a
  failing test to make it pass. Fix the code or file a candidate amendment.
- Do not add, drop, reword or reorder tasks. If you think the list is wrong,
  stop and write the finding in a trace; do not "fix" the list yourself.
- Do not run the full `npm test` until the very end (task T-10.6). Use the
  single test file named in Prove. One exception: the 115-service matrix
  (`tests/catalogue-all-services.test.js`) takes over five minutes; run it
  alone in the background with output to a log file, and poll the log.
- Do not run several long test files at once; they share the working tree.
- Product decisions are settled (CLAUDE.md "North star"). Never ask about or
  argue with them, never scope or test per host.

## If you get stuck

- Same task fails twice: stop that task. Write a trace saying what you tried,
  the exact error text, and what you think is wrong. Leave the box `[ ]`. Move
  to the next task that does not depend on it.
- A test fails that is not in your task: check `task-list.md` section "Reds
  that exist right now". If it is listed, it belongs to a named task. If it is
  not listed and you did not cause it, record it in the trace and keep going.
  If you did cause it, fix it before continuing.
- Never use `git stash`, `git reset --hard`, `git checkout -- .` or `git clean`;
  other work is uncommitted in this tree and would be lost.

## Traces (every ~3 minutes of active work)

Create a dated file `wiki/reasoning/2026-10-14-closure-<short-name>.md` with
this frontmatter and a few lines of body:

```
---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: current
summary: <one sentence: what is now true>
---
Done: <tasks + Prove command + result line>. In flight: <task>. Next: <task>.
```

After adding traces run `node scripts/build-wiki-index.js` (never hand-edit
`wiki/status.md`). Keep traces short; wiki size is budgeted.

## Order of work

Fix the reds first so you stand on green ground:
`T-2.8, T-3.7 → T-3.10, T-3.12`, then run `T-4.4` in the background and do
`T-4.5` (catalogue guidance, family by family: development, testing,
product-security, infrastructure) while it runs. Then the rest of WP4, WP5–WP9
in order. Stop when only 🔒 tasks and `T-10.x` remain.

## When you finish

Reply with: the tasks you ticked (IDs), the tasks left open and why (one line
each), every candidate amendment you filed (paths), the last Prove result line
for each work package, and the output tail of `npm test` only if you were
allowed to run it. If anything failed, say so with the exact output. Do not
claim the release is done; the owner's 🔒 tasks remain.
