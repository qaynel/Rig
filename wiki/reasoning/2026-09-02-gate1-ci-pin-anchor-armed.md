---
date: 2026-09-02
source: agent
topics: gate1-signing
decisions:
status: current
supersedes:
tags: security, interdependency
summary: The production merge boundary now enforces the CI-side owner-key pin: the repository secret exists, production requires the trusted check, direct pushes are forbidden, and an end-to-end pull-request probe passed.
---

# CI pin anchor — armed on production

The repository-administrator actions that the implementation could not perform
from repository files are complete.

## External controls

- The repository secret `GATE1_FINGERPRINT` holds the current owner public-key
  fingerprint, `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`.
- Production branch protection requires the `gate1-pin` GitHub Actions check,
  requires a pull request (with no approval count imposed), applies to
  administrators, forbids force pushes, and forbids branch deletion.

Those controls are intentionally outside the repository-writing trust boundary:
a pull request cannot change the stored fingerprint or remove the required
check before it merges.

## Bootstrap and verification

The checker workflow was absent from production, so requiring it before the
first merge would have deadlocked its own bootstrap. The required context alone
was removed briefly; pull-request-only enforcement, administrator enforcement,
and force-push/deletion bans remained active. Pull request #144 then merged
only the trusted workflow and its repository-code-free checker. The resulting
production push ran `gate1-pin` successfully against the stored secret. The
required context was restored immediately afterward.

Pull request #145 then changed only the candidate copy's executable bit for the
checker and was never merged. Its `pull_request_target` run completed
`gate1-pin` successfully, demonstrating that the production-base checker reads
candidate files as data and the required PR path is live. The probe was closed
and its temporary branches removed.

## Boundary that remains

Local verification still cannot establish this property because it reads only
repository-controlled state. The merge boundary is now the authority: a
repository writer cannot land a forged signing key, rewritten oracle, or
rewritten local verifier without the protected CI check passing against the
externally stored fingerprint. A holder of repository-administrator credentials
can still alter the secret or branch rule; that scope is deliberately outside
the git-writer threat model.
