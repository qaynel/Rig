# development.repo-hygiene.stale-cleanup — maximal

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Policy grade, maximal: Set deleting without recovery to false. A deletion that cannot be undone destroys user files that only look unused, so keep it recoverable. Cumulative with minimal and mid. Binding checks: stale-cleanup-source-code-boundary, stale-cleanup-repo-hygiene-context, stale-cleanup-evidence-receipt.

Acceptance target: policy:development.repo-hygiene.stale-cleanup:maximal:stale-cleanup-source-code-boundary+stale-cleanup-repo-hygiene-context+stale-cleanup-evidence-receipt.
Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array); stale-cleanup-repo-hygiene-context: `reference_checks` is nonempty (a string or array); stale-cleanup-evidence-receipt: `delete_without_recovery` equals false.
