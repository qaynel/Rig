# stale-cleanup

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Owned scope: `repo-hygiene.stale-cleanup`. Input: `rig-services/development.repo-hygiene.stale-cleanup.json`.

Coverage ceiling: Configuration validation only, so it confirms candidate paths, reference checks and the no-recovery-delete flag are declared; it does not show the candidates are really unused.

minimal: candidate paths — ["unused/generated.js"]. List the stale candidates by path. Without paths nothing identifies what will be removed, so name each file or directory.

mid: reference checks — ["search callers"]. Record the check that shows no callers remain, such as a search or build. Deleting without it can break hidden users, so attach the reference check.

maximal: delete without recovery — false. Set deleting without recovery to false. A deletion that cannot be undone destroys user files that only look unused, so keep it recoverable.
