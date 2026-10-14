# development.repo-hygiene.stale-cleanup — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for stale cleanup. The minimal boundary for stale cleanup checks candidate_paths (nonempty): candidate paths must name the concrete repository contract.. Binding checks: stale-cleanup-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe repo-hygiene.stale-cleanup; bind it to the input named in `rig-services/development.repo-hygiene.stale-cleanup.json` and preserve the check's failure status. When adopting this in an existing repository, connect stale cleanup to the command that inspects candidate_paths and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside repo-hygiene.stale-cleanup as a failure.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:policy-boundary. Given source-code is present and repo-hygiene.stale-cleanup is selected, pass only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. The ceiling is stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Choose a repository-owned check that observes stale cleanup from rig-services/development.repo-hygiene.stale-cleanup.json..

Service-specific evidence cues:
Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.
minimal: candidate paths — ["unused/generated.js"].
mid: reference checks — ["search callers"].
maximal: delete without recovery — false.
