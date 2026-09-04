---
date: 2026-09-04
source: agent
topics: gate1-signing, agent-working-conventions
decisions:
status: current
supersedes:
tags: trap, interdependency
summary: The autonomous wiki-maintenance sweep wired scripts/check-size-hints.js into package.json's test:code, which broke Gate 1's signed package-scripts.json oracle and left npm test red; reverted the wiring (kept the script standalone) to restore green, since re-signing is outside agent authority.
---

# Gate 1 package-scripts break and revert — 2026-09-04

Picking the [[2026-09-04-wiki-maintenance-sweep]] workstream back up after the
prior session hit its usage limit mid-audit. Before doing anything else,
`npm test` was run to establish a real baseline, per the project rule that
nothing is pushed on a red or unrun suite.

## What was broken

The sweep session added `scripts/check-size-hints.js` (a legitimate, working
check that keeps `wiki/index/quick-reference.md`'s line-count hints honest)
and wired it into `package.json`'s `test:code` script so it "can't rot again."

`package.json`'s `scripts` object is not an ordinary file here — it is a Gate 1
oracle surface. `scripts/check-advanced-spec.js`'s `verifyPackageScripts`
does a byte-exact `assert.deepEqual` of `package.json`'s `scripts` against the
signed snapshot at `wiki/gate1/package-scripts.json`. Editing `test:code`
without going through a re-sign made that assertion fail, so `npm test` was
red: `rig oracle: package.json scripts differ from the signed oracle
snapshot`.

## The fix

Reverted `test:code` to the string the oracle expects — dropped the
`&& node scripts/check-size-hints.js` clause, changed nothing else. The script
itself was kept; it still runs standalone
(`node scripts/check-size-hints.js`, or `--fix`) and its check is real and
useful, just not yet part of the gated suite.

An agent cannot re-sign Gate 1 — that requires the intent owner's key, per
[[2026-09-02-gate1-key-rotation-adopted]]. Wiring a new check into a
signed-scripts surface is therefore an unfreeze-request-shaped change, not a
chore-shaped one, regardless of how small the diff looks. Flagging for the
owner rather than deciding it here: fold `check-size-hints.js` into
`test:code` at the next Gate 1 re-sign (the onboarding-hardening oracle
re-sign is already pending) if it should run in CI at all.

## Verification

`npm test`: exit 0. `Gate 1 protected: principal=gate1-owner
fingerprint=SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`. 722 tests
across the four suites (rig-agent-toolbox, pi-extension, rig-mcp), 721 pass, 1
skipped (Linux-only PR_SET_PDEATHSIG case), 0 fail.

## Also fixed while here

`wiki/reasoning/README.md`'s frontmatter contract still said `summary:`
"leave it empty for historical records" — the exact convention
[[2026-09-04-wiki-maintenance-sweep]] §2 found was wrong and reverted after it
destroyed 37 hand-written summaries. That sweep left the wording in
`.claude/skills/wiki-maintenance/SKILL.md` alone because a skill payload has
three byte-identical copies outside a chore's scope. `README.md` is not a
skill payload — it is one plain wiki page asserting a convention this project
has already reversed — so it was corrected to match: every trace's `summary:`
is filled in regardless of `status:`.
