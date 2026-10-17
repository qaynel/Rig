# Owner runbook — v6.0.0 to QA-prod and prod

Every step the agent cannot do, in the order
`rig/corpus/standards/change-management.md` requires. Run them from this
worktree unless a step says otherwise. Do not reorder: steps 3 and 4 must
follow step 1, because the signature file is part of the bytes they bind.

## 1. Re-sign Gate 1 (one command, unblocks everything else)

Completed by the owner on 2026-10-17: the applied `test:e2e` amendment is
covered by a fresh signature, and verification passes (16 files, 95 cases).
The instructions below apply if a later oracle change requires another signature.

Run `node scripts/approve-gate1.js` yourself. Its first refusal prints the exact
proposed oracle digest and the command with `--confirm-digest-delta`. Review
that delta, then run that printed command yourself and verify with
`node scripts/check-advanced-spec.js`. The confirmation is the combined oracle
message digest, **not** the package-script file's hash. Agents never run the
ceremony or supply a guessed confirmation.

The only change in the delta is one added line,
`"test:e2e": "node scripts/clean-install-e2e.js"`, in
`wiki/gate1/package-scripts.json`. Compare it with `git diff` before you sign.

**The owner reported success and the agent verified it.** Steps 2–4 now follow;
the sequence is retained here so an interrupted session can resume.

## 2. Full gate on the final bytes

```sh
npm test   # ~45 minutes; must exit 0
```

## 3. Review receipt, Opus 5, bound to those bytes

```sh
node scripts/review-receipt.js \
  --target wiki/gate2/technical-spec.md \
  --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
  --implementation-root . \
  --base origin/qa-prod \
  --model claude-opus-5 \
  --author-context v6.0.0-closeout \
  --out .context/review-receipt-v6.0.0.json
```

The target is the current technical design; the deployment checker independently
checks that digest, the catalogue and every frozen acceptance case. The receipt
must live outside the tree or in an ignored path (`.context/` is
ignored): the implementation digest hashes every publishable file, so a receipt
committed into the repository changes the bytes it claims to describe. Keep the
file — step 7 needs its contents.

Supply the wrapper's output unchanged. The workflow validates its bindings and
coverage; it does not authenticate its producer. Control release dispatch and
receipt custody through repository access permissions.

## 4. Push

Only on a green gate and a passing receipt.

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
  -f receipt="$(cat .context/review-receipt-v6.0.0.json)"
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
