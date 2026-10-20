# development.repo-hygiene.stale-cleanup — mid

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Policy grade, mid: Record the check that shows no callers remain, such as a search or build. Deleting without it can break hidden users, so attach the reference check. Cumulative with minimal. Binding checks: stale-cleanup-source-code-boundary, stale-cleanup-repo-hygiene-context.

Acceptance target: policy:development.repo-hygiene.stale-cleanup:mid:stale-cleanup-source-code-boundary+stale-cleanup-repo-hygiene-context.
Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array); stale-cleanup-repo-hygiene-context: `reference_checks` is nonempty (a string or array).
