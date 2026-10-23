# Owner runbook — v6.0.0 to QA-prod and prod

Every step the agent cannot do, in the order
`rig/corpus/standards/change-management.md` requires. Run them from this
worktree unless a step says otherwise. Do not reorder: steps 3 and 4 must
follow step 1, because the signature file is part of the bytes they bind.

## 1. Apply and re-sign the second Gate 1 amendment 🔒

Two earlier amendments are already applied and carry your signature
(`binding-review-owner.patch` and `one-trust-root-owner.patch`). Do not
re-apply them. The failed trust-root binding review needs one more frozen
delta, prepared as a single patch:
[`trust-root-review-owner.patch`](candidate-amendments/trust-root-review-owner.patch).
It changes two files: `tests/advanced-oracle.test.js` (seven case bodies; no
title changes, so the 95 acceptance cases are unchanged) and the manifest
digest line for that file. Each hunk is listed in the
[evidence index](qa-closeout-evidence.md#the-second-owner-amendment). It is
needed because the shipped code no longer has the `interrupt_after` test lever
or host-native policy minting that the old bodies of `AT-INSTALL-1`,
`AT-LF-17` and `AT-PRESENCE-1` call, and because `AT-SHAPE-5`, `AT-CI-1`,
`AT-UNINSTALL-1` and `AT-LF-22` were narrower than their trace rows.

From the repository root:

```sh
git apply --stat  wiki/specs/close-everything/candidate-amendments/trust-root-review-owner.patch
git apply --check wiki/specs/close-everything/candidate-amendments/trust-root-review-owner.patch
git apply         wiki/specs/close-everything/candidate-amendments/trust-root-review-owner.patch
node scripts/check-advanced-spec.js        # fails only on the signature until you sign
node --test tests/advanced-oracle.test.js
```

The patch already carries the recomputed manifest digest; inspect
`git diff -- wiki/gate1`. The agent must not edit frozen files, run or
simulate the signing ceremony, or supply a guessed digest.

Run `node scripts/approve-gate1.js` yourself. Its first refusal prints the exact
proposed oracle digest and the command with `--confirm-digest-delta`. Review
that delta, run that printed command yourself, then verify with
`node scripts/check-advanced-spec.js`. The confirmation is the combined oracle
message digest, **not** a single file's hash. Agents never run the ceremony or
supply a guessed confirmation.

## 2. Full gate on the final bytes

```sh
npm test   # must exit 0
```

If the optional shelf download stalls in this workspace, its exact pinned
archive is cached at `.context/gstack-shelf-pinned.tar.gz`. The product still
verifies the archive's tar digest when it is supplied as a local mirror:

```sh
RIG_UPSTREAM_MIRROR_GSTACK_SHELF="file://$(pwd)/.context/gstack-shelf-pinned.tar.gz" npm test
```

## 3. Review receipt, Opus 5, bound to those bytes

```sh
node scripts/review-receipt.js \
  --target wiki/gate2/technical-spec.md \
  --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
  --implementation-root . \
  --base origin/qa-prod \
  --model claude-opus-5 \
  --author-context v6.0.0-qa-readiness-2026-10-17 \
  --force-rereview \
  --out .context/qa-readiness-final-review.json
```

The target is the current technical design; the deployment checker independently
checks that digest, the catalogue and every frozen acceptance case. The receipt
must live outside the tree or in an ignored path (`.context/` is
ignored): the implementation digest hashes every publishable file, so a receipt
committed into the repository changes the bytes it claims to describe. Keep the
file — step 7 needs its contents.

The latest failed review used this same context and output path; its
failed-attempt counter is **6**. Preserve it. The wrapper requires
`--force-rereview` for another attempt, and the owner must explicitly
authorize that exception after inspecting the remediated final candidate.
Do not change the context or delete the counter to retry.

Supply the wrapper's output unchanged. The workflow validates its bindings and
coverage; it does not authenticate its producer. Control release dispatch and
receipt custody through repository access permissions.

## 4. Push

Only on a green gate and a passing receipt. This is an owner-controlled step in
the closeout task list.

```sh
git push origin vaibhav-kodiyan/universal-issues-closure
```

## 5. Make `gate1-pin` required on `qa-prod` 🔒

The agent gets 403 on the branch-protection API, so this is yours. In the
GitHub UI: Settings → Branches → `qa-prod` → require status checks, and add
`gate1-pin`, `test`, `descendants-linux`, `descendants-macos` and
`descendants-windows`. Preserve all existing required checks, review rules,
administrator enforcement and restrictions; add the missing checks without
replacing the whole protection configuration. The previous whole-configuration
PUT example was removed because it would reset unrelated protections.

A check that reports without blocking is not a gate — this is step 6 of the
change-management policy.

## 6. Merge PR #153 into `qa-prod`

Required checks green on the exact head SHA first.

## 7. Prove the QA commit, then promote 🔒

```sh
SHA=$(gh api repos/qaynel/Rig/branches/qa-prod --jq .commit.sha)
gh workflow run exact-qa-release-eligibility -R qaynel/Rig \
  -f sha="$SHA" \
  -f receipt="$(cat .context/qa-readiness-final-review.json)"
gh run watch -R qaynel/Rig "$(gh run list -R qaynel/Rig -w exact-qa-release-eligibility -L1 --json databaseId --jq '.[0].databaseId')"
```

This runs the health workflow on that exact SHA and `check-deployment-gate.js`
over the whole sequence. It closes 🔒 T-8.8's green-run half; the
deliberately-failing health run that must open a `health` issue is a separate
dispatch on a throwaway ref.

## 8. Tag and release 🔒

```sh
git checkout qa-prod && git pull
git tag -a v6.0.0 -m "Rig 6.0.0" && git push origin v6.0.0
gh release create v6.0.0 -R qaynel/Rig --title "Rig 6.0.0" --notes-from-tag
```

## 9. Post-publication checks — only now that the tag resolves

```sh
# T-6.8 / T-9.7: the documented install flow, from the published tag
git clone --depth 1 --branch v6.0.0 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.0
/tmp/rig-v6.0.0/install rig --version v6.0.0 --target /tmp/rig-smoke-repo
```

## 10. Close the trackers — last, per your Q4 answer 🔒

Nothing closes before the tag exists, so no task is left open against a closed
issue. The exact commands are prepared in
[`github-actions-pending.md`](github-actions-pending.md): run Phase A, then
Phase B (T-1.6), then Phase C (T-1.7), re-running the read-only audit first and
aborting any step whose precondition no longer holds.

## 11. Tick the boxes that are already proved

Prior CI results can support their historical commits only. Tick T-2.9 and
T-6.7 after checking the required jobs on the final candidate SHA. Tick T-10.4
only after the current signed oracle verifies; the applied test:e2e amendment
was re-signed by the owner and verified on 2026-10-17.
