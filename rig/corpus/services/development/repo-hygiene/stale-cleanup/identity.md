# development.repo-hygiene.stale-cleanup — identity

Policy grade: stale cleanup owns repo-hygiene.stale-cleanup. Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Keep neighboring repo-hygiene services outside the stale cleanup decision for repo-hygiene.stale-cleanup. Tie acceptance to the configured input at `rig-services/development.repo-hygiene.stale-cleanup.json`; malformed input is still attributed to that path.

Disposition: executable. Read the limit: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Choose a repository-owned check that observes stale cleanup from rig-services/development.repo-hygiene.stale-cleanup.json.

Acceptance target: policy:development.repo-hygiene.stale-cleanup:minimal:stale-cleanup-source-code-boundary.

Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array).
