# Path B Branch Closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take branch `path-b-adaptive-onboarding-oracle` from its current partially-uncommitted state to fully mergeable into `qa-prod`, then land it.

**Architecture:** The previous session hit its session limit mid-work. Two correctness fixes (3a interrupt-window, 3b sibling-reconcile) are already applied in the working tree and green under `tests/path-b-hardening.test.js` — but nothing is committed yet, and the wiki-maintenance step-6 lint work is still red. This plan finishes the committable work, then hands the branch to the human for the three signing-ceremony blockers only they can clear.

**Tech Stack:** Node.js (`node:test`), SSHSIG via `ssh-keygen -Y verify`, markdown-only wiki with generated indexes (`scripts/build-wiki-index.js`).

**Spec:** `.context/attachments/eGnGqS/pasted_text_2026-09-02_07-25-49.txt` (failed-session transcript) + `.context/attachments/srPc5P/pasted_text_2026-09-02_07-26-53.txt` (independent review). The plan argues from those two.

## Global Constraints

- **Wiki-first:** every substantive change files a reasoning trace under `wiki/reasoning/YYYY-MM-DD-*.md` per `wiki/reasoning/README.md`, then runs `node scripts/build-wiki-index.js` to regenerate `wiki/index/*.md` and `wiki/status.md`. Never hand-edit generated indexes.
- **CI gate:** `npm test` must exit 0 before any push. `npm run test:rig` is the inner-loop subset only; not a substitute for the full gate.
- **Never edit `wiki/gate1/acceptance.md`, `spec/business-spec.md`, or any file listed in `wiki/gate1/testing-infrastructure.manifest`** unless the plan step is explicitly the human-signing task; those files are covered by `wiki/gate1/gate1.sig` and editing them requires an oracle re-sign that only the human can perform.
- **Never skip hooks** (`--no-verify`, `--no-gpg-sign`, etc.).
- **Never force-push, reset --hard, or delete branches** without explicit user go-ahead.
- **Commit style:** short subject `<type>(<scope>): <verb-phrase>`, matching the existing branch log (e.g. `fix(onboarding):`, `docs(wiki):`, `test(path-b):`).

## Current state snapshot (2026-09-02)

**Branch:** `path-b-adaptive-onboarding-oracle`, 46 commits ahead of `origin/qa-prod`, last commit `870c921a`.

**Uncommitted, ready to commit (path-b fixes 3a + 3b + supporting wiki):**
- `rig/lib/onboarding.js` — Fix 3a (writer.finish order) + Fix 3b (planRemovals sibling sweep) applied.
- `tests/path-b-hardening.test.js` — two new tests added, both green (64/64 pass).
- `wiki/reasoning/2026-09-02-path-b-fix3-interrupt-sibling.md` — new trace (untracked).
- `wiki/topics/onboarding-flow.md` — hub updated to cite the trace.
- `wiki/index/reasoning.md`, `wiki/status.md` — generated indexes rebuilt.
- `wiki/index/acceptance-cases.md`, `wiki/topics/gate1-signing.md`, `wiki/reasoning/2026-08-31-path-b-acceptance-oracle.md` — three stale-language fixes for P3-2 (independent of the oracle-signed acceptance.md).

**Uncommitted, in-progress (wiki-maintenance step 6, RED):**
- `scripts/wiki-maintenance.js` — `staleHubs`/`lintFindings` present but filter is wrong (see Task 2).
- `tests/wiki-maintenance-lint.test.js` (untracked) — new test file.
- `wiki/reasoning/2026-09-02-wiki-maintenance-step5-primer.md` — modified.
- `wiki/reasoning/2026-09-02-wiki-maintenance-step6-lints.md` (untracked) — new trace.
- **Failing tests (2):** `staleHubs flags a hub older than its newest cited trace` and `lintFindings fails on a stale hub` in `tests/wiki-maintenance.test.js`.

**Untracked, unrelated:** `docs/superpowers/plans/2026-09-02-wiki-maintenance-skill.md` (planning doc; leave alone or commit as `docs`).

**Human-only blockers (do not attempt as agent):**
1. Answer whether `ecdsa-sha2-nistp256 rig-gate-key@secretive.Manoj's-MacBook-Pro.local` key rotation on commit `5694fd7b` was authorized.
2. Edit `wiki/gate1/acceptance.md` H1 + §7 stale language, then re-sign the oracle with the gate1 key.
3. Fill in blank Date + "I authorize" + signature blocks in `wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md`, and authorize the new unfreeze request Task 4 drafts.

---

### Task 1: Commit the completed Fix 3a + Fix 3b (path-b correctness gaps)

**Files:**
- Modify: `rig/lib/onboarding.js` (already staged as unstaged edit — do not re-edit)
- Modify: `tests/path-b-hardening.test.js` (already staged as unstaged edit — do not re-edit)
- Modify: `wiki/topics/onboarding-flow.md` (already staged as unstaged edit — do not re-edit)
- Modify: `wiki/index/acceptance-cases.md`, `wiki/topics/gate1-signing.md`, `wiki/reasoning/2026-08-31-path-b-acceptance-oracle.md`, `wiki/index/reasoning.md`, `wiki/status.md`
- Add: `wiki/reasoning/2026-09-02-path-b-fix3-interrupt-sibling.md`
- Test: `tests/path-b-hardening.test.js`

**Interfaces:**
- Consumes: nothing (this task is a commit, not new code).
- Produces: a clean working tree for the path-b correctness surface and one new commit reachable by Tasks 2 and 5.

- [ ] **Step 1: Verify the path-b suite is still green**

Run: `node --test tests/path-b-hardening.test.js 2>&1 | grep -E "^ℹ (tests|pass|fail)" | tail -5`
Expected: `ℹ tests 64`, `ℹ pass 64`, `ℹ fail 0`.

- [ ] **Step 2: Verify the two new suites cover both fixes**

Run: `node --test --test-name-pattern="interrupt-window|sibling-reconcile" tests/path-b-hardening.test.js 2>&1 | tail -20`
Expected: two `✔` lines, one for each fix, both pass.

- [ ] **Step 3: Stage the path-b fix files**

```bash
git add rig/lib/onboarding.js \
        tests/path-b-hardening.test.js \
        wiki/reasoning/2026-09-02-path-b-fix3-interrupt-sibling.md \
        wiki/topics/onboarding-flow.md \
        wiki/index/reasoning.md \
        wiki/status.md
git status --short
```

Expected: only the six files above are staged; the wiki-maintenance step-6 files (`scripts/wiki-maintenance.js`, `tests/wiki-maintenance-lint.test.js`, `wiki/reasoning/2026-09-02-wiki-maintenance-step5-primer.md`, `wiki/reasoning/2026-09-02-wiki-maintenance-step6-lints.md`) remain unstaged.

- [ ] **Step 4: Commit the path-b fix**

```bash
git commit -m "$(cat <<'EOF'
fix(onboarding): resume interrupted apply and sweep orphaned siblings

Two correctness gaps found by the independent review of the Path B
hardening branch:

Fix 3a — interrupt-window: writer.finish() ran before writeState() and
the .rig/grafts.md write. A crash between them closed the journal but
left state at phase:"proposed" with bytes live, so the next apply saw
its own work as a stale preimage and could not recover. Move
writer.finish() after the state and grafts writes so the journal stays
open across the kill window and journalResumeDigest recognises the
resumable transaction.

Fix 3b — sibling-file reconcile: planRemovals short-circuited on
desiredPaths.has(row.path), so a skill that stayed selected but lost a
file across catalog versions kept the orphan alive; reconcileApplied
then failed projected_digest permanently. Remove the short-circuit AND
build desiredPaths from projection.plans so still-projected subdirs
(references/, templates/) are not swept along with the orphan.

Both gaps get behaviour tests in tests/path-b-hardening.test.js
(interrupt-window; sibling-reconcile). All 64 hardening tests pass.
EOF
)"
```

- [ ] **Step 5: Commit the P3-2 stale-language wiki fixes**

```bash
git add wiki/index/acceptance-cases.md \
        wiki/topics/gate1-signing.md \
        wiki/reasoning/2026-08-31-path-b-acceptance-oracle.md
node scripts/build-wiki-index.js
git add wiki/index/reasoning.md wiki/status.md
git commit -m "$(cat <<'EOF'
docs(wiki): clear stale "awaiting signature" language (P3-2 partial)

wiki/gate1/acceptance.md is oracle-signed and cannot be edited without
a re-sign — that edit is deferred to the human signing ceremony. The
three sibling files touched here (acceptance-cases index, gate1-signing
topic, acceptance-oracle trace) are outside the oracle manifest and are
free to update now so status.md stops advertising the branch as
red/awaiting.
EOF
)"
```

- [ ] **Step 6: Verify the working tree still holds only wiki-maintenance step-6 files**

Run: `git status --short`
Expected: only `scripts/wiki-maintenance.js`, `tests/wiki-maintenance-lint.test.js`, and the two wiki-maintenance reasoning traces remain. Nothing else.

---

### Task 2: Make the wiki-maintenance step-6 lint tests pass

**Files:**
- Modify: `scripts/wiki-maintenance.js:77-98` (the `staleHubs` function)
- Test: `tests/wiki-maintenance.test.js:61-76` (staleHubs test) and `:88-103` (lintFindings test)

**Interfaces:**
- Consumes: nothing beyond the existing wiki-maintenance module.
- Produces: `staleHubs(root, records, dateOf)` returns `[{ slug, hubDate, newestTraceDate }, ...]` counting hubs whose date is older than any cited trace of ANY status (not just `current`). This matches the two failing tests, which use `status: historical` and expect one entry each.

- [ ] **Step 1: Reproduce the failure**

Run: `node --test tests/wiki-maintenance.test.js 2>&1 | grep -E "^(✖|ℹ pass|ℹ fail)" | tail -10`
Expected: 2 failures — `staleHubs flags a hub older than its newest cited trace` and `lintFindings fails on a stale hub`. Both fail with `0 !== 1` — the tests provide a `status: historical` trace, but the function's filter `trace.status === 'current'` excludes it, returning no stale entries.

- [ ] **Step 2: Confirm the intended contract from the tests**

Read `tests/wiki-maintenance.test.js:61-103`. Both failing tests use `status: historical` in their fixtures and expect one stale entry. A third test (`lintFindings is clean when hubs are fresh and traces are tagged`, line 116) still uses `status: historical` and expects zero failures. Together they confirm: historical traces DO count toward staleness, but only when the trace date is newer than the hub date.

- [ ] **Step 3: Fix the filter in `staleHubs`**

Change `scripts/wiki-maintenance.js:83-85` from:

```js
const citing = records.filter(
  (trace) => trace.status === 'current' && trace.topics.includes(slug),
);
```

to:

```js
const citing = records.filter((trace) => trace.topics.includes(slug));
```

Also delete the now-obsolete comment above (lines 80-82) that explains the old filter.

- [ ] **Step 4: Verify the two failing tests pass without regressing the others**

Run: `node --test tests/wiki-maintenance.test.js 2>&1 | grep -E "^(✖|ℹ pass|ℹ fail)" | tail -10`
Expected: 0 fail; all `wiki-maintenance` tests pass.

- [ ] **Step 5: Verify the new `tests/wiki-maintenance-lint.test.js` file also passes**

Run: `node --test tests/wiki-maintenance-lint.test.js 2>&1 | grep -E "^(✖|ℹ pass|ℹ fail)" | tail -5`
Expected: all pass. If this file references helpers you have not created, read it and reconcile — but the working tree already has it as untracked, so it should be self-contained.

- [ ] **Step 6: Run the full gate**

Run: `npm test 2>&1 | grep -E "^(✖|ℹ tests|ℹ pass|ℹ fail|ℹ duration)" | tail -20`
Expected: 0 failures across the whole suite.

- [ ] **Step 7: Commit**

```bash
git add scripts/wiki-maintenance.js \
        tests/wiki-maintenance-lint.test.js \
        wiki/reasoning/2026-09-02-wiki-maintenance-step5-primer.md \
        wiki/reasoning/2026-09-02-wiki-maintenance-step6-lints.md
node scripts/build-wiki-index.js
git add wiki/index/reasoning.md wiki/status.md
git commit -m "$(cat <<'EOF'
fix(wiki-maintenance): count all cited traces toward hub freshness

staleHubs filtered records to status: current only, but the intended
contract — encoded in the step-6 lint tests — is that any cited trace,
regardless of status, contributes to freshness because the hub is the
synthesis surface for every decision anchored under it. Drop the
status filter so lintFindings actually fails on the fixtures it was
authored against.
EOF
)"
```

---

### Task 3: Draft the missing unfreeze request for `scripts/check-advanced-spec.js`

**Files:**
- Create: `wiki/gate1/unfreeze-requests/2026-09-02-check-advanced-spec-83-cases.md`
- Reference: `wiki/gate1/unfreeze-request.template.md` for the required structure.
- Reference: `wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md` as a shape example (that one is the incomplete request the human still needs to sign).

**Interfaces:**
- Consumes: the template file for the fields that must be filled.
- Produces: a filled-out unfreeze request with Rationale, Impact, and Change-summary sections completed; the "Date", "I authorize", and signature blocks are left blank for the human to sign in the physical ceremony.

- [ ] **Step 1: Read the template to learn the exact field set**

```bash
cat wiki/gate1/unfreeze-request.template.md
cat wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md
```

- [ ] **Step 2: Confirm what changed in `scripts/check-advanced-spec.js`**

Run: `git log --oneline -- scripts/check-advanced-spec.js | head -20`

Then: `git diff origin/qa-prod...HEAD -- scripts/check-advanced-spec.js | head -80`

Expected: acceptance-case count moved from 73 to 83; this is the change that requires the unfreeze because that script is listed in `wiki/gate1/testing-infrastructure.manifest`.

- [ ] **Step 3: Write the request**

Create `wiki/gate1/unfreeze-requests/2026-09-02-check-advanced-spec-83-cases.md` filling every non-signature field. Content skeleton (adapt to whatever the template requires):

```markdown
# Frozen-test unfreeze request

## Test to change

- **File:** `scripts/check-advanced-spec.js`
- **Test name or acceptance case:** the 73→83 acceptance-case set-equality
  guard.

## Proposed change and why

The Path B branch expands Gate 1 by 10 cases (AT-PB-1 through AT-PB-10).
`scripts/check-advanced-spec.js` is the specification-gate script that
enforces exact set equality between Gate 1's ID set and Gate 2's
traceability set; its expected-count constant must move from 73 to 83
in lockstep with the acceptance file. Without this change the gate
script rejects the amended acceptance file it was itself amended for.

## Blast radius

Same-shape edit as the acceptance file amendment: the constant moves
from 73 to 83, no logic branches change. All 83 cases execute; the
oracle signature covers the updated script bytes via the manifest
digest.

## Evidence the amendment is safe

- `npm test` passes with the updated script and updated acceptance file.
- `tests/advanced-spec-gate.test.js` covers the set-equality invariant.
- `wiki/gate1/testing-infrastructure.manifest` records the updated
  digest under the same file path — no rename, no reordering.

## Human authorization

- **Date:**
- **I authorize this frozen-fixture change:**
- **SSHSIG signature reference:**
```

Adjust exact field names to match whatever `wiki/gate1/unfreeze-request.template.md` prescribes.

- [ ] **Step 4: Commit**

```bash
git add wiki/gate1/unfreeze-requests/2026-09-02-check-advanced-spec-83-cases.md
git commit -m "docs(gate1): draft unfreeze request for check-advanced-spec 73→83"
```

---

### Task 4: Run the full CI gate on the committed state and record the result

**Files:**
- No file edits. This is a verification task whose deliverable is a reasoning trace of the gate outcome.
- Create: `wiki/reasoning/2026-09-02-path-b-branch-closeout-gate.md`

**Interfaces:**
- Consumes: the working tree with Tasks 1–3 committed.
- Produces: a written record of the pre-handoff gate result the human can see without re-running.

- [ ] **Step 1: Ensure the working tree is clean**

Run: `git status --short`
Expected: nothing but the plan file itself (`docs/superpowers/plans/2026-09-02-path-b-branch-closeout.md`) and possibly the `docs/superpowers/plans/2026-09-02-wiki-maintenance-skill.md` untracked planning doc.

- [ ] **Step 2: Run the full CI gate**

Run: `npm test 2>&1 | tee /tmp/npm-test-closeout.log | tail -30`
Expected: exit 0; no `✖` lines.

If the gate is red, STOP — do not proceed to the handoff. Diagnose and fix (add a new task to this plan), then re-run.

- [ ] **Step 3: Confirm the oracle is still verified**

Run: `node scripts/check-advanced-spec.js 2>&1 | tail -10`
Expected: exit 0; the "signed oracle: verified, 14 files, 83 acceptance cases" line (or the local equivalent).

- [ ] **Step 4: File the trace**

Write `wiki/reasoning/2026-09-02-path-b-branch-closeout-gate.md`:

```markdown
---
date: 2026-09-02
source: agent
topics: onboarding-flow, gate1-signing, delivery-plan
decisions:
status: current
supersedes:
tags: verification, handoff
summary: Path B branch closeout — Fix 3a + Fix 3b + wiki-maintenance step 6 + unfreeze draft committed; full CI gate green; three human-only blockers remain (key rotation answer, acceptance.md re-sign, unfreeze signatures).
---

# Path B branch closeout — pre-handoff gate

**Full CI gate:** `npm test` exit 0, N/N tests pass, 0 fail (see
`/tmp/npm-test-closeout.log` — attach the full log to the handoff if
useful).

**Signed oracle:** verified, 14 files, 83 acceptance cases.

**path-b hardening suite:** 64/64 pass. Fix 3a
(interrupt-window) and Fix 3b (sibling-file reconcile) hold under the
new tests.

**Wiki-maintenance:** `staleHubs` and `lintFindings` now pass their
fixtures; the step-6 lint contract is honoured.

**What remains before merge (human-only):**

1. Confirm authorisation of the `ecdsa-sha2-nistp256` key rotation on
   commit `5694fd7b` (Secretive/Manoj's-MacBook-Pro.local). If
   authorised: add a key-class comment on the allowed-signers line and
   a wiki trace recording the rotation. If not: the oracle cannot be
   trusted and the branch needs a full re-sign under the previous
   ed25519 key.
2. Edit `wiki/gate1/acceptance.md` H1 (drop "AWAITING ORACLE SIGNATURE")
   and §7 lead-in (drop "submitted for owner approval"), then re-sign
   the oracle with the gate1 key.
3. Fill in the Date + "I authorize" + signature blocks in
   `wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md`
   AND
   `wiki/gate1/unfreeze-requests/2026-09-02-check-advanced-spec-83-cases.md`.

None of these can be performed by an agent; each requires the human
holder of the gate1 key.
```

- [ ] **Step 5: Rebuild indexes and commit**

```bash
git add wiki/reasoning/2026-09-02-path-b-branch-closeout-gate.md
node scripts/build-wiki-index.js
git add wiki/index/reasoning.md wiki/status.md
git commit -m "docs(wiki): pre-handoff gate result for Path B closeout"
```

---

### Task 5: Print the handoff summary for the human

**Files:**
- No file edits. This is a final message task — the deliverable is a well-formed message to the user in the last chat turn.

**Interfaces:**
- Consumes: everything Tasks 1–4 produced.
- Produces: a single message to the user summarising what was landed and exactly what they need to do.

- [ ] **Step 1: Compose and send the handoff message**

Write a single message with these sections, no more:

```
## Path B branch closeout — status

**Landed on this branch (commits pushed to local `path-b-adaptive-onboarding-oracle`):**
- fix(onboarding): Fix 3a interrupt-window + Fix 3b sibling-reconcile — 64/64 hardening tests pass
- docs(wiki): P3-2 stale-language cleanup for the three files outside the oracle manifest
- fix(wiki-maintenance): staleHubs/lintFindings honour the step-6 contract; full CI gate green
- docs(gate1): draft unfreeze request for check-advanced-spec 73→83

**Full CI:** `npm test` exit 0, all tests pass (see the branch-closeout gate trace).

**What I need from you before this can merge:**

1. **Key rotation** — Was the `ecdsa-sha2-nistp256 rig-gate-key@secretive.Manoj's-MacBook-Pro.local` key on commit `5694fd7b` authorized by you? If yes, tell me and I'll add the key-class comment + wiki trace. If not, the oracle needs a full re-sign under the previous key.

2. **Sign `acceptance.md`** — Its H1 still says "AWAITING ORACLE SIGNATURE" and §7 says "submitted for owner approval". These edits require re-signing the oracle. I can prepare the exact byte-level edits for you to review before you re-sign; just say the word.

3. **Fill two unfreeze requests** — `2026-09-01-path-b-approval-receipts.md` (blank Date + authorize block) and the new `2026-09-02-check-advanced-spec-83-cases.md` (I drafted the rationale; the Date + authorize + signature blocks are yours to fill).

Once 1–3 are cleared, I can push and open the PR against `qa-prod`.
```

- [ ] **Step 2: Stop**

Do not push, do not open a PR, do not run `git push`. All three blockers above must be cleared by the human first.

---

## Do NOT do these things

The independent review flagged four follow-up items. **Do NOT attempt any of them on this branch.** Each is its own ticket, out of scope for closeout, and would blow up the diff review:

1. `rig/lib/apply.js:146` `verified` gate — pre-existing, same defect class as P1-2, separate ticket.
2. `inventory-drift` warning tier for non-Rig paths — architectural decision, needs its own spec.
3. `applied.unreconciled` visibility that evaporates after a second onboarding cycle — separate bug, separate fix.
4. Near-duplicate tree-walkers and multiple full-tree scans per `check` — refactor, out of scope.

If you find yourself editing any of these, STOP and re-read this line.

## Do NOT touch these files (oracle-signed manifest)

Any edit to these files silently invalidates `wiki/gate1/gate1.sig` and requires a full re-sign, which only the human can perform:

- `scripts/check-advanced-spec.js` (already changed in prior commits; do not re-touch)
- `tests/advanced-oracle.test.js`
- `tests/advanced-spec-gate.test.js`
- `tests/helpers/advanced.js`
- `tests/helpers/path-b.js`
- `tests/path-b-*.test.js` (all of them EXCEPT `tests/path-b-hardening.test.js`, which is not in the manifest and is where new tests belong)
- `wiki/gate1/acceptance.md`
- `wiki/gate1/business-spec.md`
- `wiki/gate1/testing-infrastructure.manifest`

The full manifest is at `wiki/gate1/testing-infrastructure.manifest` — check it before editing anything under `scripts/`, `tests/`, or `wiki/gate1/`.
