# Owner runbook — v6.0.0 to QA-prod and prod

Every step the agent cannot do, in the order
`rig/corpus/standards/change-management.md` requires. Run them from this
worktree unless a step says otherwise. Do not reorder: steps 3 and 4 must
follow step 1, because the signature file is part of the bytes they bind.

## 1. Re-sign Gate 1 (one command, unblocks everything else)

The `test:e2e` pin amendment is applied, so the oracle correctly refuses until
you re-sign. Until this runs, `npm test` cannot be green and nothing can be
pushed or promoted.

```sh
node scripts/approve-gate1.js --confirm-digest-delta d8d481d59a1915eb034a41033123e2efcd6cfebe219801028eb4bbf1b0b2c77c
node scripts/check-advanced-spec.js   # must print no changed-oracle message
```

The only change in the delta is one added line,
`"test:e2e": "node scripts/clean-install-e2e.js"`, in
`wiki/gate1/package-scripts.json`. Compare it with `git diff` before you sign.

**Then tell the agent, and it runs steps 2–4 for you.** They are only listed
here so the sequence is complete and survives a lost session.

## 2. Full gate on the final bytes

```sh
npm test   # ~45 minutes; must exit 0
```

## 3. Review receipt, Opus 5, bound to those bytes

```sh
node scripts/review-receipt.js \
  --target wiki/specs/close-everything/specification-sheet.md \
  --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
  --implementation-root . \
  --base origin/qa-prod \
  --model claude-opus-5 \
  --author-context v6.0.0-closeout \
  --out .context/review-receipt-v6.0.0.json
```

The receipt must live outside the tree or in an ignored path (`.context/` is
ignored): the implementation digest hashes every publishable file, so a receipt
committed into the repository changes the bytes it claims to describe. Keep the
file — step 7 needs its contents.

## 4. Push

Only on a green gate and a passing receipt.

```sh
git push origin vaibhav-kodiyan/universal-issues-closure
```

## 5. Make `gate1-pin` required on `qa-prod` 🔒

The agent gets 403 on the branch-protection API, so this is yours. In the
GitHub UI: Settings → Branches → `qa-prod` → require status checks, and add
`gate1-pin`, `test`, `descendants-linux`, `descendants-macos` and
`descendants-windows`. Or:

```sh
gh api -X PUT repos/qaynel/Rig/branches/qa-prod/protection \
  -F required_status_checks.strict=true \
  -f 'required_status_checks.contexts[]=gate1-pin' \
  -f 'required_status_checks.contexts[]=test' \
  -f 'required_status_checks.contexts[]=descendants-linux' \
  -f 'required_status_checks.contexts[]=descendants-macos' \
  -f 'required_status_checks.contexts[]=descendants-windows' \
  -F enforce_admins=false -F required_pull_request_reviews=null -F restrictions=null
```

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

T-2.9, T-6.7 and T-10.4 are done in CI and in the tree; they are open only
because an owner tick is the evidence.
