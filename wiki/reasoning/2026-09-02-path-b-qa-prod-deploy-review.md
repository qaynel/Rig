---
date: 2026-09-02
source: agent
topics: onboarding-flow, gate1-signing, delivery-plan
decisions:
status: current
supersedes:
tags: review, verification, qa-prod
summary: Report-only review of path-b-adaptive-onboarding-oracle (53 commits ahead of qa-prod, plus one uncommitted worktree edit) against AT-PB-1..10; two blockers found — an uncommitted acceptance.md edit that breaks the signed oracle, and a umask-dependent catalogue tree digest that makes a fresh checkout fail npm test and go stale on approved proposals.
---

# Path B → qa-prod deploy review (in progress)

## Scope

Branch `path-b-adaptive-onboarding-oracle` @ `79d2137`, 53 commits ahead of
`qa-prod` @ `c1b664b`, merge-base is `qa-prod` itself (fast-forwardable).
564 files, +17787/-356. Plus one uncommitted worktree edit.
Oracle read for this review: `wiki/gate1/acceptance.md` §7I, `AT-PB-1`–`AT-PB-10`.

## Findings so far

### Blocker 1 — uncommitted acceptance.md edit breaks the signed oracle

The worktree carries an unstaged edit to `wiki/gate1/acceptance.md` (H1
"AWAITING ORACLE SIGNATURE" → "ORACLE SIGNED"; §7 "submitted for owner
approval" → "approved by the owner"). `scripts/approve-gate1.js` signs
`sha256(acceptance.md)` as part of `rig-oracle-freeze-v2`, so these bytes are
under the signature.

Evidence — same command, two trees:

- worktree as-is: `node scripts/check-advanced-spec.js` → `rig oracle: oracle
  signature does not verify`, exit 1.
- detached worktree at committed `79d2137`: `Gate 1 protected:
  principal=gate1-owner ... Oracle verified: 14 files, 83 acceptance cases`,
  exit 0.

This is the text half of blocker 2 in
[branch closeout gate](2026-09-02-path-b-branch-closeout-gate.md) performed
without the re-sign half. Committing it as-is turns the whole repo's gate red.

### Blocker 2 — catalogue tree digest is umask-dependent

`rig/lib/skill-catalog.js:194` folds `fs.statSync(file).mode & 0o777` into
`skillTreeDigest`. The comment three lines above claims "mode bits are fixed
so the value is reproducible"; they are not — they follow the checkout's
umask. Git tracks only the executable bit, so a `git clone`/`git worktree add`
under `umask 002` yields `664` where git recorded `644`, and every one of the
63 rows' `tree_digest` moves.

Evidence: `git worktree add --detach <tmp> HEAD` under this session's
`umask 002` → `npm test` exit 1 with `rig/catalog/skills/catalog.json is
stale — run: node scripts/build-skill-catalog.js`. The same check passes in
the primary checkout, whose modes were `chmod`-ed back to `644` by the
previous session.

Two consequences:

1. The remediation the error message names makes it worse. Running
   `node scripts/build-skill-catalog.js` in that worktree exits 0 and leaves a
   63-insertion/63-deletion diff to `catalog.json` — the umask-polluted
   digests. Committing that would flip the failure onto every `umask 022`
   machine, including CI.
2. `rig/lib/onboarding.js:362` refuses an approved proposal with `stale
   proposal: catalogue tree_digest for skill "<id>" has changed`. A proposal
   approved on one machine and applied after a re-clone is refused with no
   real byte movement — the byte-binding `AT-PB-5` requires, firing on an
   environment difference rather than a change.

The published `release.skills_digest` is *not* affected: `skillsDigest` uses
the frozen twelve-key row identity and excludes `tree_digest`
(`skill-catalog.js:305-307`). The blast radius is the freshness check and the
proposal binding, not the release identity.

## Still in flight

Axes 2–4 (correctness/safety trace of the new onboarding flow, architectural
smells, test gaps) against `AT-PB-2`/`4`/`7`/`10`.

## Findings, second pass

### High — two unfreeze requests carry no human authorization

`wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md` and
`2026-09-02-check-advanced-spec-83-cases.md` both have empty **Date** and
**I authorize this oracle change** fields. Frozen oracle bytes
(`scripts/check-advanced-spec.js` 73→83, and the two approval-receipt
fixtures) already moved and are already under the current signature, so the
signature is not the missing piece — the recorded human decision is. This is
blocker 3 of [branch closeout gate](2026-09-02-path-b-branch-closeout-gate.md),
still open.

Related: the one request that *is* filled
(`2026-09-01-path-b-duplicate-name.md`) authorizes itself with "Authorized by
the completed SSH-signature ceremony; the current signature verifies against
the revised manifest." That is circular — the signature proves the bytes were
signed, not that a human agreed to this specific unfreeze, which is the whole
point of the request form.

### Low — a committed agent scratch artifact

`.superpowers/sdd/2026-09-01-path-b-remediation/task-1-report.md` is the only
tracked file under `.superpowers/`, and `.superpowers/` is not in
`.gitignore`. It is a per-task agent status report, not a deliverable.

## Verified clean (not findings)

- **`AT-PB-1` byte-identity holds.** `rig/catalog/services` (the governed
  115-service catalogue) has zero diff against `qa-prod`. The 300 changed
  paths under `rig/catalog/skills` are the family→capability→skill shelf
  reorganisation: 242 pure renames, the rest renames plus the new
  `family`/`tool`/`capability`/`guarantees`/`overlap_tags` frontmatter the
  shelf catalogue reads.
- **No freeze-bypass through helpers.** The eight frozen `path-b-*.test.js`
  files require only `helpers/path-b.js`, which is itself in the manifest. The
  two unfrozen helpers (`path-b-approval.js`, `path-b-crash.js`) are required
  only by the unfrozen `path-b-hardening.test.js`.
- **`.context/rig-oracle-freeze-v2.txt` is not a trust input.**
  `check-advanced-spec.js:161` recomputes the message from the gate1 files;
  the `.context/` copy is a convenience echo and matches at HEAD.
- **`containedPath` (`rig/lib/path-safety.js:7`) is sound.** Per-segment
  `lstat` plus `realpathSync` containment; the `ENOTDIR` break is justified in
  a comment and lands on an `existsSync` check in every caller.
- **Approval verification is real.** `onboarding.js:150` refuses `host-native`
  outright, requires a repo-owned `.rig/allowed-signers`, and re-verifies the
  SSHSIG over `rig-plan-approval` + proposal digest. `propose` computes the
  bindings itself rather than trusting caller-supplied digests
  (`onboarding.js:469-472`). Residual, by-design risk: whoever can write
  `.rig/allowed-signers` can enroll an approver — the same repo-local trust
  root policy activation already uses, documented in
  `rig/tier-1/allowed-signers.example.md`.
- **`install` grammar is shell-safe.** `set -eu` with the trailing `[ ... ] &&
  set -- ...` chain does not trip the errexit AND-OR exemption (verified
  against dash, bash, and /bin/sh); `require_value` rejects option-shaped
  values; `add_host` dedupes in first-seen order per `AT-PB-6`.

### Medium — `wiki-maintenance` lands in only one of the two skill trees

This branch adds `.claude/skills/wiki-maintenance/SKILL.md` with no
`.agents/skills/wiki-maintenance/` counterpart. `CLAUDE.md` states the two
trees "are install targets for native Claude and Codex discovery; their
payloads must stay identical", so a Codex-hosted authoring agent in this repo
cannot discover the maintenance skill a Claude-hosted one can.

Keeping it out of `rig/manifest.json` is correct — it is authoring-time only
and Tier 1 must stay markdown-only in installed repos. The asymmetry is the
defect, not the exclusion. (The pre-existing `rig-enforcement` asymmetry is
inherited from `qa-prod` and is not this branch's doing.)

Attached test gap: `scripts/check-rule-copies.js` compares rule copies but
never compares the two skill directories' membership, so nothing in the gate
would have caught this. Every other `.claude/skills/rig-*/SKILL.md` is
byte-identical to its `rig/tier-1/skills/*/SKILL.md` source; `wiki-maintenance`
has no tier-1 source at all, which is why it fell outside the pattern.

## Gate result, independently reproduced

Detached worktree at `79d2137`, tracked file modes restored to git's recorded
values first (`git ls-files -s` → `chmod`), then `npm test`:

- secrets suite 13/13, `check-rule-copies.js` green, `check-versions.js` green
  ("Skill catalogue matches source: 63 skills", all 8 versions pinned 5.0.0).
- `node --test`: **695 tests, 691 pass, 4 fail**, exit 1.
- The four failures are exactly the ones the closeout trace predicted —
  `AT-LF-11`, `AT-LF-12`, `AT-LF-23`, and `release-blockers.test.js`'s lint
  grade-evidence case — all `network_isolation_unavailable` from
  `unshare --user --map-root-user --net` being denied in this sandbox. None
  touches onboarding, wiki-maintenance, or gate1 code. Independently confirms
  [2026-08-28 linux-network-isolation-ci](2026-08-28-linux-network-isolation-ci.md).

`AT-PB-10`'s closed failure set is complete: all nine hard-failure codes plus
both growth warnings exist in `rig/lib/onboarding-check.js` (or
`onboarding.js` for `malformed-graft`/`state-incomplete`) and each is seeded
in `tests/path-b-weight.test.js`.

## Merge shape

`git merge-base HEAD qa-prod` = `c1b664b` = `qa-prod` itself, and `qa-prod` has
zero commits HEAD lacks — this fast-forwards cleanly. 53 commits, 564 files,
+17787/-356.

## Superseding update — the tree moved under this review

Two commits landed on this branch while the review was running, and the
working tree changed again after them. Re-verified state:

**`5af7582` ("fix stale signature-pending wording (owner-authorized)")**
commits the acceptance.md wording edit that Blocker 1 above described as
uncommitted, and extends it to `business-spec.md`'s H1. Its own message and
[trace](2026-09-02-gate1-wording-fix-and-signing-instructions.md) state
plainly that this invalidates `gate1.sig` by construction and that the
re-sign is the next step. Verified at that commit in a detached worktree:
`node scripts/check-advanced-spec.js` → "oracle signature does not verify",
exit 1.

**Blocker 1 is therefore now worse, not resolved.** `npm test` is
`node scripts/check-advanced-spec.js && npm run test:code` — the oracle check
is the *first* hard gate. As committed, this branch's tip fails `npm test` on
its first command, before a single test runs. `tests/advanced-spec-gate.test.js`
passing (4/4) does not contradict this: it exercises the gate mechanism
against synthetic fixtures in `mkdtemp` roots, never the repository's own
signature. Nothing may merge to `qa-prod` at `5af7582`.

**The working tree now holds an uncommitted re-sign, with a different key.**
`gate1.sig` is replaced with an ed25519 signature and
`gate1.allowed-signers` is reverted to the pre-rotation
`ssh-ed25519 ... vaibhav.kodiyan.vk@gmail.com` line, discarding the key-class
comment. `check-advanced-spec.js` verifies clean again but reports
`fingerprint=SHA256:MYPMlpxH/cY5SGPoD2ghrL48SLoU5thTvRfViN8gdA4` (ED25519)
where the previous commit reported
`SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY` (ECDSA).

Three consequences, all needing the owner rather than an agent:

1. **The trust root moved back to the exportable key.** `79d2137`'s
   [rotation trace](2026-09-02-gate1-key-rotation-authorized.md) records the
   owner confirming a deliberate move *to* a Secretive/Secure-Enclave key
   whose private half never leaves hardware, framed as "a strengthening of
   the key class, not a downgrade". The working tree signs with the plain
   file-based ed25519 key that rotation replaced. If that is the owner's
   choice, the rotation trace and `gate1-signing.md` are now false and must
   be superseded; if it is not, an unintended key signed the oracle.
2. **It contradicts the documented ceremony.** The wording-fix trace plans
   the re-sign as Secretive-agent forwarding from the Mac precisely *because*
   the key is non-exportable. An ed25519 signature is not that path.
3. **The unfreeze requests now cite the wrong key.** Both filled/partial
   `Key holder / signing-key fingerprint` fields name
   `SHA256:0Ok+...` (ECDSA) — not the key that actually signed.

Separately, the wording-fix trace already predicted the comment loss:
`approveGate1()`'s final step overwrites `gate1.allowed-signers` with a bare
principal line, eating hand-authored comments on every run. That is a real
script defect worth fixing regardless of which key wins.

**Blocker 3 (unfilled unfreeze authorizations) is unchanged and still open.**
