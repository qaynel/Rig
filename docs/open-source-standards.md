# Open-source standards

This is the contribution policy for Rig. Every change — code, docs, skills,
catalogue entries, tests, and inherited third-party work — must follow it.
The short working copy is [CONTRIBUTING.md](../CONTRIBUTING.md). This page is
the full standard.

By participating you agree to the [Code of Conduct](../CODE_OF_CONDUCT.md).
Rig is MIT licensed. Contributions are accepted under that license.

## What “open source” means here

- Rig itself is [MIT](../LICENSE). Anyone may use, copy, modify, and
  redistribute it under those terms.
- Rig ships only **free, redistributable, open-source** parts. Paid APIs,
  subscriptions, and hosted-only services are not defaults and must not become
  required to install or run Rig.
- Inherited work is taken at **source level**: pin the candidate, record the
  exact files, licence, keep/discard scope, integration path, and verification.
  Copying a similar design from scratch, or dropping in a whole foreign
  framework, does not count as reuse.
- Licence notices required by MIT, Apache-2.0, and similar terms **stay in the
  tree**. Engineering is inherited; upstream branding is not.

These rules come from the owner’s product decisions. They are not optional
for a pull request.

## How a contribution must be made

Work one issue at a time. Take a branch from QA production (`qa-prod`), merge
that branch back into `qa-prod`, then resolve the issue. `prod` is the
published line. It is not the integration branch.

### 1. Start from an issue

- Bugs, features, and accessibility barriers use the
  [issue templates](https://github.com/qaynel/Rig/issues/new/choose).
- Search existing issues first. If you find a duplicate, comment on the
  earlier issue and close the later one as `duplicate`, pointing at the
  survivor.
- Security reports go through [SECURITY.md](../SECURITY.md), never a public
  issue.
- Questions go through [SUPPORT.md](../SUPPORT.md).

The issue is the unit of work. A pull request without an issue is acceptable
only for a tiny, obvious fix (typo, broken link). Anything that changes
behaviour, licences, inherited sources, or release evidence needs an issue.

### 2. Take a branch from QA production

```sh
git fetch origin
git checkout -b issue-<number>-<short-slug> origin/qa-prod
```

- Branch from `origin/qa-prod`, not from `prod`, not from a personal stack,
  and not from an old local `qa-prod`.
- Name the branch after the issue, for example `issue-165-language-support`.
- Keep the branch focused on that one issue.

### 3. Make the change

- Follow this document and [CONTRIBUTING.md](../CONTRIBUTING.md).
- Keep the diff to one problem. Do not mix refactors, drive-by lint, or
  unrelated docs into the same change.
- Do not edit owner-signed files (the Gate 1 oracle and its frozen tests).
  File a candidate amendment instead.
- Do not add secrets, credentials, or signing keys. See
  [SECURITY.md](../SECURITY.md).
- Run `npm test` on the **final bytes** before you ask for review. A green
  run from an earlier tree is not evidence.
- Update user-facing docs in the same change when behaviour changes. Add a
  changelog line under `Unreleased` when the change is user-visible.

### 4. Merge it back into QA production

```sh
git push -u origin HEAD
gh pr create --base qa-prod --title "<title>" --body "Closes #<number>"
```

- Open **one** pull request, against `qa-prod` only.
- Fill in [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md).
- Put `Closes #<number>` in the pull request body so GitHub closes the issue
  when the PR merges.
- Required checks must be green on the exact PR head. A check that reports
  without blocking is not a gate.
- A maintainer merges. Do not merge your own PR unless you are the maintainer
  for that change.

Do not open the pull request against `prod`. Promotion from `qa-prod` to
`prod` is the release sequence in
[change-management.md](../rig/corpus/standards/change-management.md). It needs
exact-QA health, clean-install evidence, and owner approval. Closing an issue
does not promote a release.

### 5. Resolve the issue

- GitHub closes the issue when the `qa-prod` pull request merges, if the PR
  body contains `Closes #<number>`.
- Do not close the issue by hand while the work is still unmerged.
- If the issue needs an owner decision before code lands, leave it open and
  record the decision on the issue. Close it only after the decided work has
  merged, or after the owner records that no code change will ship.
- If the issue is a duplicate, close it as `not planned`, label `duplicate`,
  and point at the surviving issue. Put the work instructions on the
  survivor, not on the duplicate.

## Licence policy

### Rig’s own licence

Rig is MIT. A contribution is a grant of those same MIT rights in the
contributed work. Do not submit code you cannot license that way.

There is no contributor licence agreement and no developer certificate of
origin beyond this grant. The Git author identity is the record of who
contributed.

### What may be added to the tree

| Allowed | Not allowed |
|---|---|
| OSI-approved permissive licences (MIT, BSD-2/3-Clause, Apache-2.0, ISC, Unlicense, CC0) | Proprietary, all-rights-reserved, or unlicensed material |
| Licence notices and `NOTICE` files required by those terms | Paid APIs, subscriptions, or usage-metered defaults |
| Optional extras whose terms are shown **before** download, when the extra is not required to install or run Rig | Strong copyleft that would bind a repository Rig installs into (AGPL, and other licences that impose their terms on customer code) |
| Pinned, redistributable models and runtimes with a recorded licence | “Source available” or field-of-use licences that fail OSI |

Apache-2.0 is accepted. AGPL is not, because Rig’s corpus is installed into
other people’s repositories. A repository with no licence cannot be forked
or inherited.

When a useful component is free to use but **not** OSI-licensed (for
example some model terms of use), it may be offered only as an **opt-in
extra**, with the terms shown before download. It must not be the required
path, and a fully OSI-licensed alternative should be tracked as a follow-up
issue.

### Recording inherited work

For every third-party source that lands in Rig, record all of the following
in the same change:

1. The upstream repository, commit, or release pin.
2. The licence and the path of the notice that ships.
3. The exact files kept, rewritten, or discarded, and why.
4. How the piece is integrated (adapter, overlay, vendored copy) and how it
   is verified (`npm test` or a named proving test).
5. Branding removed. Licence text kept.

A pull request that adds inherited files without that record is incomplete.

## Project governance

- **Owner.** Product decisions, Gate 1 signatures, and release publication
  belong to the repository owner. Agents and contributors prepare those
  steps; they do not sign, publish, or override them.
- **Maintainers.** Review and merge pull requests into `qa-prod` when the
  change matches this policy, the tests pass, and the issue is addressed.
- **Contributors.** Open issues, take branches from `qa-prod`, and submit
  pull requests against `qa-prod` under the MIT grant above.

Settled product decisions live in `CLAUDE.md` (pointers) and the project
wiki. Do not re-open a settled decision in a pull request; file an issue if
new evidence appears.

## Community policies

| Topic | Document |
|---|---|
| Conduct | [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) |
| Security reports | [SECURITY.md](../SECURITY.md) |
| Accessibility | [ACCESSIBILITY.md](../ACCESSIBILITY.md) |
| Questions | [SUPPORT.md](../SUPPORT.md) |
| Development evidence | [rig/corpus/standards/ai-sdlc.md](../rig/corpus/standards/ai-sdlc.md) |
| Delivery steps | [rig/corpus/standards/delivery-sop.md](../rig/corpus/standards/delivery-sop.md) |
| QA → production release | [rig/corpus/standards/change-management.md](../rig/corpus/standards/change-management.md) |

## Duplicate issues

Before opening an issue, search titles and labels. When two open issues
describe the same work:

1. Keep the earlier issue, unless the later one has more complete
   instructions or discussion.
2. Copy any missing detail onto the survivor.
3. Close the duplicate with a comment `Duplicate of #<survivor>`, the
   `duplicate` label, and reason `not planned`.
4. Put the QA-production working steps on the survivor only.

## Checklist before you open a pull request

- [ ] The branch was taken from `origin/qa-prod`.
- [ ] The pull request targets `qa-prod`.
- [ ] The PR body contains `Closes #<issue>` (or explains why no issue).
- [ ] `npm test` passed on the bytes being reviewed.
- [ ] New third-party files name their pin, licence, keep/discard scope, and
      verification.
- [ ] No secret, key, or credential is in the tree.
- [ ] User-visible behaviour has a docs and changelog update.
- [ ] The change follows the Code of Conduct and this standard.
