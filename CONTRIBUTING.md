# Contributing

Thanks for contributing to Rig. By participating, you agree to the
[Code of Conduct](CODE_OF_CONDUCT.md).

Rig is MIT licensed. Contributions are accepted under that license.

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

## Pull requests

- Branch from the default branch.
- Keep the change focused on one problem.
- Run `npm test` before asking for review.
- Fill in the pull request template.

Open a pull request against the default branch (`prod`).

## Reporting

- Bugs and feature requests use the [issue templates](https://github.com/qaynel/Rig/issues/new/choose).
- Questions go through [SUPPORT.md](SUPPORT.md).
- Vulnerabilities go through [SECURITY.md](SECURITY.md). Do not open a public issue.
- Accessibility barriers go through [ACCESSIBILITY.md](ACCESSIBILITY.md).
