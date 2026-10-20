# development.repo-hygiene.stale-cleanup — identity

Policy grade: stale-cleanup owns repo-hygiene.stale-cleanup. Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Input: `rig-services/development.repo-hygiene.stale-cleanup.json`. Configuration validation only, so it confirms candidate paths, reference checks and the no-recovery-delete flag are declared; it does not show the candidates are really unused.

Disposition: executable.
Acceptance target: policy:development.repo-hygiene.stale-cleanup:minimal:stale-cleanup-source-code-boundary.
Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array).
