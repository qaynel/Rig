# development.repo-hygiene.stale-cleanup — minimal

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Policy grade, minimal: List the stale candidates by path. Without paths nothing identifies what will be removed, so name each file or directory. Binding checks: stale-cleanup-source-code-boundary.

Acceptance target: policy:development.repo-hygiene.stale-cleanup:minimal:stale-cleanup-source-code-boundary.
Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array).
