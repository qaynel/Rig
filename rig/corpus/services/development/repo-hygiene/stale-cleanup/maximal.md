# development.repo-hygiene.stale-cleanup — maximal

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: stale-cleanup-source-code-boundary, stale-cleanup-repo-hygiene-context, stale-cleanup-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.repo-hygiene.stale-cleanup:maximal:stale-cleanup-source-code-boundary+stale-cleanup-repo-hygiene-context+stale-cleanup-evidence-receipt.

Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array); stale-cleanup-repo-hygiene-context: `reference_checks` is nonempty (a string or array); stale-cleanup-evidence-receipt: `delete_without_recovery` equals false.
