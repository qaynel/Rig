# development.repo-hygiene.stale-cleanup — minimal

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for stale cleanup. The minimal boundary for stale cleanup checks candidate_paths (nonempty): candidate paths must name the concrete repository contract. Binding checks: stale-cleanup-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe repo-hygiene.stale-cleanup; bind it to the input named in `rig-services/development.repo-hygiene.stale-cleanup.json` and preserve the check's failure status. When adopting this in an existing repository, connect stale cleanup to the command that inspects candidate_paths and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside repo-hygiene.stale-cleanup as a failure.

Acceptance target: policy:development.repo-hygiene.stale-cleanup:minimal:stale-cleanup-source-code-boundary.

Declared predicates: stale-cleanup-source-code-boundary: `candidate_paths` is nonempty (a string or array).
