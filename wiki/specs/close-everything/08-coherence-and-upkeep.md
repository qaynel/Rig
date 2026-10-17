# 08 — Coherence sweep and heavy upkeep (D5, D6)

Part of the [master plan](00-master-plan.md). Depends on 01 and 03. The final
sweep runs after 09.

**Owner (round 2):** heavy upkeep (option c), plus "a coherence check so that,
say, one part of the codebase is not out of sync with the other … a horizontal
sweep".

## Coherence sweep (one-time, at the end)

Walk every pair of things that make claims about each other and fix every
disagreement:

- docs ↔ code (commands, flags, paths, version)
- board ↔ GitHub ↔ ticket files
- agent instructions ↔ North star
- wiki hubs ↔ traces
- corpus ↔ projections
- service guidance ↔ service checks

Each finding is either fixed or turned into a check below.

## Coherence check (permanent, in CI)

`scripts/check-coherence.js`, run by `npm test`, with these assertions:

- **Trackers:** every `RIG-*` id has the same state on GitHub, on the board, and
  in its ticket file under an explicit state mapping: open work, ready for QA,
  fixed-and-delivered, and redesign/not-planned are different dispositions.
  Candidate validation compares a declared target transition with live current
  state; after delivery it checks exact final agreement. Read-only checks do
  not close issues to make a PR green. Uses the GitHub API with the workflow's
  read-only token; API/auth errors fail, and unmapped/new issues fail visibly.
  When there is no token (local runs), it skips with a visible notice, never a
  silent pass.
- **Docs:** every command and flag in the README and install guide exists in
  the relevant CLI's help output, and current-release version claims equal
  `package.json`. Historical versions and v5 migration references remain valid.
- **Corpus:** there are no checked-in twins, and the projections are
  reproducible (from 03).
- **Instructions:** active rules must not assert retired doctrine. Negative
  statements and historical quotations remain valid; a phrase appearing alone
  is not a contradiction. Test both stale doctrine and its explicit rejection.

## Heavy upkeep

- **Definition of done:** in the standards (07).
- **Weekly health workflow** (`.github/workflows/health.yml`, cron plus manual
  dispatch): runs the full gate, the D1 end-to-end test, the dependency-drift
  check, and the wiki budget.
- **On failure:** the workflow opens or updates one issue labelled `health`, so
  failures are never silent. Give only the reporting job `issues: write`;
  execution jobs remain read-only. Bind reports to failing SHA/run and avoid
  duplicate issues. Scheduled workflows run from the default branch: QA
  validation uses manual dispatch with an explicit QA ref.
- **Dependency drift:** both production dependency packages, `rig-mcp` and
  the installed `rig/mcp-runtime` copy, must
  have no high or critical advisories (`npm --prefix <package> audit --omit=dev`)
  and their lockfiles must be in sync (`npm ci --prefix <package> --dry-run`).
  The existing parity guard keeps their package manifests and locks identical.
  Root and `pi-extension` have no dependencies or lockfiles, so neither
  `npm audit` nor `npm ci` applies there.
- **Runner setup:** every Ubuntu workflow executing the full gate enables and
  verifies the rootless network namespace used by the ungranted-task boundary,
  matching the main test workflow. The full gate prepares its own dependencies.
- **Release discipline:**
  - one version authority (already `check-versions.js`)
  - a `CHANGELOG.md` entry required for each tag
  - a tag only after a green D1 run (enforced in the release workflow)

## Acceptance

- If a tracker, doc, or corpus claim is broken on purpose, the coherence check
  goes red. One case per assertion family goes into
  `tests/coherence.test.js`.
- The health workflow is green on manual dispatch, and a deliberately failing
  run opens a `health` issue.
- The coherence check and full gate are green at ship.
