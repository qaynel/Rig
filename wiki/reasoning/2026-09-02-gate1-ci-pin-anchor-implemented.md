---
date: 2026-09-02
source: agent
topics: gate1-signing
decisions:
status: current
supersedes:
tags: interdependency, security, trap
summary: Owner chose the CI-side anchor. Implemented as a base-branch pull_request_target job running a repo-code-free checker against a repository secret; six forgery attempts run against it, five blocked, control passes. Closes the forgery class at the merge boundary only, and only once the owner creates the secret and makes the check required — both are GitHub-side and cannot be done from the repo.
---

# CI pin anchor — implemented and attacked

Owner chose option A from
`2026-09-02-gate1-in-repo-anchor-is-not-a-barrier.md`, and asked that it be
checked rather than assumed:

> do the CI check against a stored secret this looks good, check if closes the issue

## What was built

- `.github/scripts/verify-gate1-pin.sh` — an independent verifier that uses
  **no repository code at all**: `sha256sum`, `ssh-keygen`, `awk` only. It (1)
  requires exactly one principal, (2) compares that key's fingerprint to
  `GATE1_EXPECTED_FINGERPRINT`, (3) checks every frozen file against the signed
  manifest via `sha256sum -c`, and (4) verifies `gate1.sig` over an oracle
  message it recomputes itself.
- `.github/workflows/gate1-pin.yml` — runs it on `pull_request_target` and on
  push to `prod`.

## The two traps that make the naive version worthless

**Trap 1 — running the repo's own verifier.** The obvious implementation is a CI
step that runs `node scripts/check-advanced-spec.js` and compares the fingerprint
it prints against a secret. That fails: `check-advanced-spec.js` is a file in the
repository, so the agent edits it to print whatever it likes. *The audited party
cannot supply the auditor.* Hence a checker that touches no repo code.

**Trap 2 — using `pull_request` instead of `pull_request_target`.** For
`pull_request`, GitHub runs the workflow definition **from the PR**, so the agent
edits or empties the check in the same commit as the forgery. `pull_request_target`
runs the **base branch's** definition, which the PR cannot touch, and the checker
script is taken from the base checkout rather than the candidate's. Simulated
both:

```
If CI naively used the PR's own script:
  gate1-pin: OK (totally fine, nothing to see here)     -> exit=0 (agent wins)
What the workflow actually does (trusted script, PR data):
  gate1-pin: the signing key is not the pinned owner key -> exit=1
```

`pull_request_target` is normally a footgun on a public repo because people check
out and *execute* PR code with secrets in scope. This job only ever reads the
candidate's data files; nothing from the candidate is executed.

## Attack results

Six scenarios run against the checker (`0` is the control):

| # | Attack | Result |
|---|---|---|
| 0 | untouched repo | passes (correct) |
| 1 | replace signers file with agent key + re-sign rewritten oracle | **blocked** |
| 2 | append a second signer | **blocked** |
| 3 | edit a frozen test, leave key and signature alone | **blocked** |
| 4 | rewrite acceptance criteria, leave a stale signature | **blocked** |
| 5 | neuter `scripts/check-advanced-spec.js` | **blocked** |
| 6 | full re-arm — edit test + manifest + key + signature together | **blocked** |

Attack 1 is the one the owner identified that defeats the single-principal fix.
Attack 6 is the strongest in-repo forgery available: it is internally perfectly
consistent and the repo's own verifier reports success on it. Both die on the
fingerprint comparison, because the agent cannot produce a signature under the
owner's key and cannot alter the stored fingerprint.

## What this does NOT close — stated plainly

1. **It is not armed until the owner does two things on GitHub**, neither of
   which is settable from the repository: create the repository secret
   `GATE1_FINGERPRINT` = `SHA256:MYPMlpxH/cY5SGPoD2ghrL48SLoU5thTvRfViN8gdA4`,
   and add `gate1-pin` as a **required** status check in branch protection on
   `prod`. Without the second, the job fails loudly but nothing blocks the merge
   — which is still only a deterrent, the exact thing this was meant to fix.
2. **Bootstrapping:** `pull_request_target` reads the workflow from the base
   branch, so this file protects nothing until it is merged to `prod`. The PR
   that introduces it is itself unprotected by it.
3. **Direct pushes to `prod`:** on a `push` event both checkouts are the same
   commit, so the checker would come from the pushed commit. Branch protection
   forbidding direct pushes closes this; without it, this path is soft.
4. **Repository-admin scope:** anyone or anything holding an admin-scoped GitHub
   token can rewrite the secret. The anchor is exactly as strong as the token
   scope the agent runs under. It holds against an agent with git write access,
   which is the threat model; it does not hold against an agent handed an admin
   PAT.
5. **Local verification is still forgeable.** `node scripts/check-advanced-spec.js`
   run on a developer machine consults only in-repo files and can still be made
   to lie. The anchor exists at the merge boundary only. A human trusting a local
   green check is still fooled — the CI result is the one that means anything.

## Consequence for the two red tests

Unchanged and still worth landing. The single-principal rule is now
defence-in-depth rather than the barrier: CI blocks attacks 1, 2 and 6 whether or
not the in-repo verifier is fixed, but the in-repo check should not be knowingly
left reporting "protected" on a forged tree.
