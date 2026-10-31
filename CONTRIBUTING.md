# Contributing

Thanks for contributing to Rig. By participating, you agree to the
[Code of Conduct](CODE_OF_CONDUCT.md).

Rig is MIT licensed. Contributions are accepted under that license. The full
policy — licences, inheritance, governance, and the QA-production workflow —
is [Open-source standards](docs/open-source-standards.md). A contribution
that does not follow that document will not be merged.

## Setup

You need Git and Node.js. Python 3 is used only when the test setup creates a
local virtualenv.

```sh
git clone https://github.com/qaynel/Rig.git
cd Rig
npm test
```

`npm test` runs the repository checks. The first run can create `.venv` and
install `requirements-dev.txt`.

## Working an issue

Take a branch from QA production (`qa-prod`), merge it back into `qa-prod`,
then resolve the issue. Do not branch from `prod` and do not open the pull
request against `prod`.

### 1. Take a branch from QA production

```sh
git fetch origin
git checkout -b issue-<number>-<short-slug> origin/qa-prod
```

Replace `<number>` with the GitHub issue number. Keep the branch on that one
issue.

### 2. Make the change

- Keep the change focused on one problem.
- Follow [docs/open-source-standards.md](docs/open-source-standards.md).
- Do not edit owner-signed files. File a candidate amendment instead.
- Run `npm test` on the final bytes before asking for review.

### 3. Merge it back into QA production

```sh
git push -u origin HEAD
gh pr create --base qa-prod --title "<title>" --body "Closes #<number>"
```

Open one pull request against `qa-prod`. Fill in the pull request template.
Required checks must be green on the exact PR head. A maintainer merges.

Promotion to `prod` follows the release checks and owner approval in
[change-management.md](rig/corpus/standards/change-management.md). It is not
part of closing the issue.

### 4. Resolve the issue

- Put `Closes #<number>` in the pull request body so GitHub closes the issue
  when the PR merges into `qa-prod`.
- Do not close the issue by hand while the work is still unmerged.
- If the issue needs an owner decision first, leave it open and record the
  decision there. Close it only after the decided work has merged, or after
  the owner records that no code change will ship.
- Close duplicates of an earlier issue as `duplicate`, pointing at the
  survivor. Put these working steps on the survivor.

## Reporting

- Bugs and feature requests use the [issue templates](https://github.com/qaynel/Rig/issues/new/choose).
- Search existing issues before opening a new one.
- Questions go through [SUPPORT.md](SUPPORT.md).
- Vulnerabilities go through [SECURITY.md](SECURITY.md). Do not open a public issue.
- Accessibility barriers go through [ACCESSIBILITY.md](ACCESSIBILITY.md).
