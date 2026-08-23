# Advanced CI floor — reports/rig upload behavior

Source of truth: `rig/lib/ci-adapters.js` (`REPORTS_UPLOAD`).

## Contract

- Local and CI runs write actionable reports only under `reports/rig/`
  (`failed` | `vacuous` | `coverage_gap`). Routine passes are omitted.
- When a verified CI adapter is emitted, it uploads `reports/rig/` as a build
  artifact **if** any JSON reports exist.
- Unverified CI providers do not receive fabricated upload config; they degrade
  to an advisory patch while `.rig/bin/check.js --scope repo` still installs.

## Verified today

| Provider | Strategy | Evidence |
|---|---|---|
| GitHub Actions | standalone additive workflow `.github/workflows/rig-check.yml` | [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions), [Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts) |

## Explicit degradations

GitLab CI, CircleCI, Jenkins, Buildkite, Azure Pipelines: `status: degraded`,
no emitted config until official-doc citation or first-wire test is recorded.
